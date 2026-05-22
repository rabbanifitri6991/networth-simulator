import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { buildProjection, totalContributed } from '@/utils/compound'

const JPY_MYR = 0.02482

const DEFAULTS = {
  assets: {
    bank:   0,
    epf:    0,
    stocks: 0,
    japan:  0,
    asb:    0,
    btc:    0,
    sol:    0,
  },
  settings: {
    scenario:      'base',
    years:         10,
    monthlyEtf:    1500,
    monthlyBtc:    500,
    deployJapan:   true,
    includeCrypto: true,
  }
}

const STORAGE_KEY = 'networth_portfolio'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export const usePortfolioStore = defineStore('portfolio', () => {

  // ── Load saved data or use defaults ───────────────────────────────────
  const saved = loadFromStorage()

  const assets = ref(saved?.assets
    ? { ...DEFAULTS.assets, ...saved.assets }
    : { ...DEFAULTS.assets }
  )

  const returns = ref({
    bull: { etf: 0.14, epf: 0.065, asb: 0.0575, btc: 0.80, sol: 0.90, solStake: 0.034, label: 'Bull 🚀' },
    base: { etf: 0.10, epf: 0.060, asb: 0.0575, btc: 0.35, sol: 0.40, solStake: 0.034, label: 'Base 📈' },
    bear: { etf: -0.05, epf: 0.055, asb: 0.050, btc: -0.40, sol: -0.50, solStake: 0.034, label: 'Bear 🐻' },
  })

  const scenario      = ref(saved?.settings?.scenario      ?? DEFAULTS.settings.scenario)
  const years         = ref(saved?.settings?.years         ?? DEFAULTS.settings.years)
  const monthlyEtf    = ref(saved?.settings?.monthlyEtf    ?? DEFAULTS.settings.monthlyEtf)
  const monthlyBtc    = ref(saved?.settings?.monthlyBtc    ?? DEFAULTS.settings.monthlyBtc)
  const deployJapan   = ref(saved?.settings?.deployJapan   ?? DEFAULTS.settings.deployJapan)
  const includeCrypto = ref(saved?.settings?.includeCrypto ?? DEFAULTS.settings.includeCrypto)

  const isLoading = ref(false)
  const lastSaved = ref(saved ? new Date().toISOString() : null)

  // ── Auto-save to localStorage whenever anything changes ───────────────
  watch(
    [assets, scenario, years, monthlyEtf, monthlyBtc, deployJapan, includeCrypto],
    () => {
      saveToStorage({
        assets: assets.value,
        settings: {
          scenario:      scenario.value,
          years:         years.value,
          monthlyEtf:    monthlyEtf.value,
          monthlyBtc:    monthlyBtc.value,
          deployJapan:   deployJapan.value,
          includeCrypto: includeCrypto.value,
        },
        savedAt: new Date().toISOString()
      })
      lastSaved.value = new Date().toISOString()
    },
    { deep: true }
  )

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

  const projection  = computed(() => buildProjection(projectionConfig.value))
  const contributed = computed(() => totalContributed(projectionConfig.value))
  const lastPoint   = computed(() => projection.value[projection.value.length - 1])

  const gainAmount = computed(() =>
    lastPoint.value ? lastPoint.value.Total - contributed.value : 0
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

  // ── Chart data ────────────────────────────────────────────────────────
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
      makeDataset('Cash', 'Cash/FD',    '#94a3b8'),
      makeDataset('EPF',  'EPF',        '#60a5fa'),
      makeDataset('ASB',  'ASB',        '#34d399'),
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
      datasets: [{
        data: items.map(d => d.value),
        backgroundColor: items.map(d => d.color),
        borderWidth: 0
      }]
    }
  })

  // ── Actions ───────────────────────────────────────────────────────────

  /** Save to backend API (optional — works only when backend is running) */
  async function savePortfolio() {
    isLoading.value = true
    try {
      const { default: axios } = await import('axios')
      const payload = {
        assets: assets.value,
        settings: {
          scenario: scenario.value, years: years.value,
          monthlyEtf: monthlyEtf.value, monthlyBtc: monthlyBtc.value,
          deployJapan: deployJapan.value, includeCrypto: includeCrypto.value,
        }
      }
      const { data } = await axios.post('/api/portfolio', payload)
      lastSaved.value = data.savedAt
      return { success: true }
    } catch {
      // API not available — localStorage already saved via watcher
      return { success: true, local: true }
    } finally {
      isLoading.value = false
    }
  }

  /** Load from backend API (optional) */
  async function loadPortfolio() {
    try {
      const { default: axios } = await import('axios')
      const { data } = await axios.get('/api/portfolio')
      if (data.assets)   assets.value = { ...DEFAULTS.assets, ...data.assets }
      if (data.settings) {
        const s = data.settings
        if (s.scenario      != null) scenario.value      = s.scenario
        if (s.years         != null) years.value         = s.years
        if (s.monthlyEtf    != null) monthlyEtf.value    = s.monthlyEtf
        if (s.monthlyBtc    != null) monthlyBtc.value    = s.monthlyBtc
        if (s.deployJapan   != null) deployJapan.value   = s.deployJapan
        if (s.includeCrypto != null) includeCrypto.value = s.includeCrypto
      }
    } catch {
      // API offline — already loaded from localStorage on init, nothing to do
    }
  }

  /** Reset everything to defaults */
  function resetPortfolio() {
    assets.value      = { ...DEFAULTS.assets }
    scenario.value    = DEFAULTS.settings.scenario
    years.value       = DEFAULTS.settings.years
    monthlyEtf.value  = DEFAULTS.settings.monthlyEtf
    monthlyBtc.value  = DEFAULTS.settings.monthlyBtc
    deployJapan.value = DEFAULTS.settings.deployJapan
    includeCrypto.value = DEFAULTS.settings.includeCrypto
    localStorage.removeItem(STORAGE_KEY)
    lastSaved.value   = null
  }

  return {
    assets, returns, scenario, years,
    monthlyEtf, monthlyBtc, deployJapan, includeCrypto,
    isLoading, lastSaved,
    totalNetWorth, projection, contributed,
    lastPoint, gainAmount, gainPct, hit500k,
    scenarioColor, chartData, breakdownData,
    savePortfolio, loadPortfolio, resetPortfolio,
  }
})
