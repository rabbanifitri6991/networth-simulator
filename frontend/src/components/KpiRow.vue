<template>
  <div class="kpi-grid">
    <div v-for="kpi in kpis" :key="kpi.tag" class="kpi-card card">
      <p class="tag">{{ kpi.tag }}</p>
      <p class="kpi-value" :style="{ color: kpi.color }">{{ kpi.value }}</p>
      <p class="kpi-sub">{{ kpi.sub }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { fmt } from '@/utils/compound'

const store = usePortfolioStore()

const kpis = computed(() => {
  const last = store.lastPoint
  if (!last) return []
  return [
    {
      tag: 'Net Worth Now',
      value: `RM${Math.round(store.totalNetWorth).toLocaleString('en-MY')}`,
      sub: 'All assets today',
      color: '#e2e8f0'
    },
    {
      tag: `In ${store.years} Years`,
      value: fmt(last.Total),
      sub: 'Projected total',
      color: store.scenarioColor
    },
    {
      tag: 'Total Gain',
      value: `${store.gainPct > 0 ? '+' : ''}${store.gainPct}%`,
      sub: `${store.gainAmount > 0 ? '+' : ''}${fmt(store.gainAmount)}`,
      color: store.gainAmount > 0 ? '#34d399' : '#f87171'
    },
    {
      tag: 'Bitcoin',
      value: fmt(last.BTC),
      sub: `from RM${store.assets.btc.toLocaleString()}`,
      color: '#f59e0b'
    },
    {
      tag: 'SOL + Staking',
      value: fmt(last.SOL),
      sub: '3.4% APY included',
      color: '#8b5cf6'
    },
    {
      tag: 'RM500K Target',
      value: store.hit500k ? `Year ${store.hit500k.year} ✓` : `>${store.years}Y`,
      sub: store.hit500k ? 'Half-millionaire!' : 'Adjust sliders',
      color: store.hit500k ? '#34d399' : '#f87171'
    },
  ]
})
</script>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}
.kpi-card { padding: 14px 16px; }
.kpi-value { font-size: 18px; font-weight: 700; margin: 6px 0 4px; }
.kpi-sub   { font-size: 11px; color: #475569; font-family: 'Space Mono', monospace; }
</style>
