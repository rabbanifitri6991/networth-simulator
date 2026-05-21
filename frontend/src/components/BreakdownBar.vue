<template>
  <div class="card">
    <p class="tag" style="margin-bottom:14px">Composition at Year {{ store.years }}</p>
    <div class="bar-wrap">
      <Bar :data="store.breakdownData" :options="options" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { Bar } from 'vue-chartjs'
import { usePortfolioStore } from '@/stores/portfolio'
import { fmt } from '@/utils/compound'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const store = usePortfolioStore()

const options = computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0c1020',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      bodyColor: '#e2e8f0',
      padding: 12,
      callbacks: { label: ctx => ` ${fmt(ctx.raw)}` }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: {
        color: '#475569', font: { family: 'Space Mono', size: 10 },
        callback: v => v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`
      }
    },
    y: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { family: 'Space Mono', size: 11 } }
    }
  }
}))
</script>

<style scoped>
.bar-wrap { height: 200px; }
</style>
