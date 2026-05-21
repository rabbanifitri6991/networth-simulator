<template>
  <div class="asset-grid">
    <div
      v-for="asset in assetList"
      :key="asset.key"
      class="asset-card"
      :style="{ borderLeftColor: asset.color }"
    >
      <p class="tag">{{ asset.label }}</p>
      <p class="asset-value" :style="{ color: asset.color }">
        RM{{ asset.value.toLocaleString('en-MY') }}
      </p>
      <p class="asset-sub">{{ asset.sub }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()

const assetList = computed(() => [
  { key: 'bank',   label: 'Cash / Bank',   value: store.assets.bank,   color: '#94a3b8', sub: 'FD ~2.5%/yr' },
  { key: 'epf',    label: 'EPF (KWSP)',    value: store.assets.epf,    color: '#60a5fa', sub: '~6%/yr auto' },
  { key: 'asb',    label: 'ASB (ASNB)',    value: store.assets.asb,    color: '#34d399', sub: '~5.75%/yr tax-free' },
  { key: 'stocks', label: 'US Stocks/ETF', value: store.assets.stocks, color: '#a78bfa', sub: 'VOO · MGK · VT' },
  { key: 'japan',  label: 'Japan ¥1.6M',   value: store.assets.japan,  color: '#2dd4bf', sub: '¥1,600,000 lump sum' },
  { key: 'btc',    label: 'Bitcoin',       value: store.assets.btc,    color: '#f59e0b', sub: '+RM500/mo DCA' },
  { key: 'sol',    label: 'Solana',        value: store.assets.sol,    color: '#8b5cf6', sub: '3.4% staking APY' },
])
</script>

<style scoped>
.asset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}
.asset-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left-width: 3px;
  border-radius: 12px;
  padding: 14px 16px;
  transition: transform 0.15s;
}
.asset-card:hover { transform: translateY(-2px); }
.asset-value { font-size: 17px; font-weight: 700; margin: 6px 0 4px; }
.asset-sub   { font-size: 10px; color: var(--muted); font-family: 'Space Mono', monospace; }
</style>
