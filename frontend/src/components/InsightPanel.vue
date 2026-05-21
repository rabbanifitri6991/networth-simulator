<template>
  <div class="card insight-panel">
    <p class="tag" style="margin-bottom:14px">Insights</p>
    <div class="insights">
      <div v-for="ins in insights" :key="ins.title"
        class="insight-item"
        :style="{ borderColor: ins.color + '33', background: ins.color + '0a' }"
      >
        <span class="ins-icon" :style="{ color: ins.color }">{{ ins.icon }}</span>
        <div>
          <p class="ins-title" :style="{ color: ins.color }">{{ ins.title }}</p>
          <p class="ins-body">{{ ins.body }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { fmt } from '@/utils/compound'

const store = usePortfolioStore()
const last = computed(() => store.lastPoint)

const insights = computed(() => [
  {
    color: '#f59e0b', icon: '₿', title: 'BTC DCA Power',
    body: `RM${store.monthlyBtc}/mo into BTC → ${fmt(last.value?.BTC || 0)} in ${store.years}Y (${store.scenario} scenario). High volatility, high ceiling.`
  },
  {
    color: '#8b5cf6', icon: '◎', title: 'SOL Staking Edge',
    body: `3.4% APY compounds on top of price gains. Your RM${store.assets.sol} SOL → ${fmt(last.value?.SOL || 0)}.`
  },
  {
    color: '#34d399', icon: '¥', title: 'Japan Lump Sum',
    body: `Toggle it off to see the impact. RM${store.assets.japan.toLocaleString()} compounding from day 1 is your biggest lever.`
  },
  {
    color: '#60a5fa', icon: '🎯',
    title: store.hit500k ? `RM500K at Year ${store.hit500k.year}!` : 'RM500K: adjust sliders',
    body: store.hit500k
      ? 'On track! Stay consistent with your DCA — compounding rewards patience.'
      : 'Increase monthly investment or extend time horizon to see the path.'
  },
])
</script>

<style scoped>
.insight-panel { display: flex; flex-direction: column; }
.insights { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.insight-item {
  border: 1px solid; border-radius: 10px;
  padding: 10px 14px; display: flex; gap: 12px;
}
.ins-icon { font-size: 18px; flex-shrink: 0; line-height: 1.4; }
.ins-title { font-size: 12px; font-weight: 700; margin-bottom: 3px; }
.ins-body  { font-size: 11px; color: #64748b; line-height: 1.6; }
</style>
