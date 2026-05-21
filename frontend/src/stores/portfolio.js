import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { buildProjection, totalContributed } from '@/utils/compound'
import axios from 'axios'

const JPY_MYR = 0.02482

export const usePortfolioStore = defineStore('portfolio', () => {

  // ── State ─────────────────────────────────────────────────────────────
  const assets = ref({
    bank:   14000,
    epf:    14000,
    stocks: 10000,
    japan:  Math.round(1_600_000 * JPY_MYR),  // ~39,712
    asb:    0,
    btc:    750,
    sol:    500,
  })

  const returns = ref({
    bull: { etf: 0.14, epf: 0.065, asb: 0.0575, btc: 0.80, sol: 0.90, solStake: 0.034, label: 'Bull 🚀' },
    base: { etf: 0.10, epf: 0.060, asb: 0.0575, btc: 0.35, sol: 0.40, solStake: 0.034, label: 'Base 📈' },
    bear: { etf: -0.05, epf: 0.055, asb: 0.050, btc: -0.40, sol: -0.50, solStake: 0.034, label: 'Bear 🐻' },
  })

  const scenario     = ref('base')
  const years        = ref(10)
  const monthlyEtf   = ref(1500)
  const monthlyBtc   = ref(500)
  const deployJapan  = ref(true)
  const includeCrypto = ref(true)

  const isLoading = ref(false)
  const lastSaved = ref(null)

  // ── Computed ──────────────────────────────────────────────────────────
  const totalNetWorth = computed(() =>
    Object.values(assets.value).reduce((s, v) => s + v, 0)
  )

  const projectionConfig = computed(() => ({
    scenario:      scenario.value,
    years:         years.value,
    monthlyEtf:    monthlyEtf.value,
    monthlyBtc:    monthlyBtc.value,
    deployJapan:   deployJapan.value,
    includeCrypto: includeCrypto.value,
    assets:        assets.value,
    returns:       returns.value,
  }))

  const projection = computed(() => buildProjection(projectionConfig.value))

  const contributed = computed(() => totalContributed(projectionConfig.value))

  const lastPoint = computed(() => projection.value[projection.value.length - 1])

  const gainAmount = computed(() => lastPoint.value
    ? lastPoint.value.Total - contributed.value
    : 0
  )

  const gainPct = computed(() =>
    contributed.value > 0
      ? ((gainAmount.value / contributed.value) * 100).toFixed(1)
      : 0
  )

  const hit500k = computed(() =>
    projection.value.find(d => d.Total >= 500_000)
  )

  const scenarioColor = computed(() => ({
    bull: '#34d399', base: '#60a5fa', bear: '#f87171'
  }[scenario.value]))

  // ── Chart data (Chart.js format) ──────────────────────────────────────
  const chartData = computed(() => {
    const labels = projection.value.map(d => `Y${d.year}`)
    const makeDataset = (key, label, color) => ({
      label,
      data: projection.value.map(d => d[key]),
      borderColor: color,
      backgroundColor: color + '33',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    })

    const datasets = [
      makeDataset('Cash', 'Cash/FD', '#94a3b8'),
      makeDataset('EPF',  'EPF',     '#60a5fa'),
      makeDataset('ASB',  'ASB',     '#34d399'),
      makeDataset('ETF',  'ETF/Stocks', '#a78bfa'),
    ]
    if (includeCrypto.value) {
      datasets.push(makeDataset('BTC', 'Bitcoin', '#f59e0b'))
      datasets.push(makeDataset('SOL', 'Solana',  '#8b5cf6'))
    }
    return { labels, datasets }
  })

  const breakdownData = computed(() => {
    if (!lastPoint.value) return { labels: [], datasets: [] }
    const items = [
      { label: 'ETF/Stocks', value: lastPoint.value.ETF,  color: '#a78bfa' },
      { label: 'EPF',        value: lastPoint.value.EPF,  color: '#60a5fa' },
      { label: 'Cash/FD',   value: lastPoint.value.Cash, color: '#94a3b8' },
      { label: 'ASB',        value: lastPoint.value.ASB,  color: '#34d399' },
      ...(includeCrypto.value ? [
        { label: 'Bitcoin', value: lastPoint.value.BTC, color: '#f59e0b' },
        { label: 'Solana',  value: lastPoint.value.SOL, color: '#8b5cf6' },
      ] : [])
    ].filter(d => d.value > 0)

    return {
      labels: items.map(d => d.label),
      datasets: [{ data: items.map(d => d.value), backgroundColor: items.map(d => d.color), borderWidth: 0 }]
    }
  })

  // ── Actions ───────────────────────────────────────────────────────────

  /** Save portfolio to backend */
  async function savePortfolio() {
    isLoading.value = true
    try {
      const payload = {
        assets: assets.value,
        settings: {
          scenario: scenario.value,
          years: years.value,
          monthlyEtf: monthlyEtf.value,
          monthlyBtc: monthlyBtc.value,
          deployJapan: deployJapan.value,
          includeCrypto: includeCrypto.value,
        }
      }
      const { data } = await axios.post('/api/portfolio', payload)
      lastSaved.value = data.savedAt
      return { success: true }
    } catch (err) {
      console.error('Save failed:', err)
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  /** Load portfolio from backend */
  async function loadPortfolio() {
    isLoading.value = true
    try {
      const { data } = await axios.get('/api/portfolio')
      if (data.assets)   assets.value   = { ...assets.value,   ...data.assets }
      if (data.settings) {
        const s = data.settings
        if (s.scenario)      scenario.value      = s.scenario
        if (s.years)         years.value         = s.years
        if (s.monthlyEtf)    monthlyEtf.value    = s.monthlyEtf
        if (s.monthlyBtc)    monthlyBtc.value    = s.monthlyBtc
        if (s.deployJapan  != null) deployJapan.value   = s.deployJapan
        if (s.includeCrypto != null) includeCrypto.value = s.includeCrypto
      }
      lastSaved.value = data.savedAt
    } catch (err) {
      console.warn('No saved portfolio or API not available')
    } finally {
      isLoading.value = false
    }
  }

  return {
    // state
    assets, returns, scenario, years,
    monthlyEtf, monthlyBtc, deployJapan, includeCrypto,
    isLoading, lastSaved,
    // computed
    totalNetWorth, projection, contributed,
    lastPoint, gainAmount, gainPct, hit500k,
    scenarioColor, chartData, breakdownData,
    // actions
    savePortfolio, loadPortfolio,
  }
})
