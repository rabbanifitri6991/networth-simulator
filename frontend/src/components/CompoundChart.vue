<template>
  <div class="card chart-card">
    <div class="chart-header">
      <p class="chart-title">Portfolio Growth — All Assets Stacked (RM)</p>
      <p class="tag">
        Crypto: Bull +80%/+90% · Base +35%/+40% · Bear -40%/-50% (BTC/SOL) + 3.4% SOL staking
      </p>
    </div>
    <div class="chart-wrap">
      <Line :data="store.chartData" :options="options" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { usePortfolioStore } from '@/stores/portfolio'
import { fmt } from '@/utils/compound'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const store = usePortfolioStore()

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      labels: {
        color: '#64748b', font: { family: 'Space Mono', size: 11 },
        boxWidth: 12, padding: 16,
      }
    },
    tooltip: {
      backgroundColor: '#0c1020',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      titleColor: '#64748b',
      bodyColor: '#e2e8f0',
      padding: 14,
      callbacks: {
        label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}`
      }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#475569', font: { family: 'Space Mono', size: 11 } }
    },
    y: {
      stacked: true,
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        color: '#475569',
        font: { family: 'Space Mono', size: 11 },
        callback: v => v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`
      }
    }
  }
}))
</script>

<style scoped>
.chart-card { margin-bottom: 14px; }
.chart-header { margin-bottom: 16px; }
.chart-title { font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 4px; }
.chart-wrap { height: 320px; }
</style>
