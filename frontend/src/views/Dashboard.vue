<template>
  <div class="dashboard">
    <div class="page-inner">

      <!-- Header -->
      <div class="dash-header">
        <div>
          <p class="tag" style="margin-bottom:8px">Full Net Worth Tracker · Moomoo + ASNB + Crypto</p>
          <h1 class="dash-title">
            <span :style="{ color: store.scenarioColor }">
              RM{{ Math.round(store.totalNetWorth).toLocaleString('en-MY') }}
            </span> today
          </h1>
          <p class="dash-sub">
            → projected
            <span :style="{ color: store.scenarioColor }">{{ fmt(store.lastPoint?.Total || 0) }}</span>
            in {{ store.years }} years
          </p>
        </div>
        <div class="header-btns">
          <button class="reset-btn" @click="handleReset">↺ Reset All</button>
          <button class="edit-btn" @click="showEditModal = true">✎ Edit Assets</button>
        </div>
      </div>

      <!-- Asset tiles -->
      <AssetCards />

      <!-- Controls -->
      <ControlPanel />

      <!-- KPI row -->
      <KpiRow />

      <!-- Main chart -->
      <CompoundChart />

      <!-- Bottom row -->
      <div class="bottom-grid">
        <BreakdownBar />
        <InsightPanel />
      </div>

      <!-- Disclaimer -->
      <p class="disclaimer">
        ⚠️ Crypto is highly speculative. Bear = -40% BTC, -50% SOL (has happened before).
        ASB ~5.75%/yr · EPF ~6%/yr · Cash/FD ~2.5%/yr · JPY/MYR @ 0.02482 · Not financial advice.
      </p>

    </div>

    <!-- Edit modal -->
    <EditAssetsModal v-model="showEditModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import { fmt } from '@/utils/compound'
import AssetCards      from '@/components/AssetCards.vue'
import ControlPanel    from '@/components/ControlPanel.vue'
import KpiRow          from '@/components/KpiRow.vue'
import CompoundChart   from '@/components/CompoundChart.vue'
import BreakdownBar    from '@/components/BreakdownBar.vue'
import InsightPanel    from '@/components/InsightPanel.vue'
import EditAssetsModal from '@/components/EditAssetsModal.vue'

const store         = usePortfolioStore()
const showEditModal = ref(false)

function handleReset() {
  if (confirm('Reset all assets to RM0? This cannot be undone.')) {
    store.resetPortfolio()
  }
}
</script>

<style scoped>
.dashboard   { padding: 32px 20px; }
.page-inner  { max-width: 1100px; margin: 0 auto; }
.dash-header {
  display: flex; justify-content: space-between;
  align-items: flex-start; margin-bottom: 24px;
}
.dash-title {
  font-size: clamp(26px, 5vw, 40px);
  font-weight: 800; letter-spacing: -1px; line-height: 1.2;
}
.dash-sub {
  color: var(--muted); font-size: 14px;
  margin-top: 6px; font-family: 'Space Mono', monospace;
}
.header-btns { display: flex; gap: 8px; align-items: center; margin-top: 8px; flex-shrink: 0; }
.edit-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  color: #94a3b8; font-family: 'Syne', sans-serif;
  font-weight: 600; font-size: 13px;
  padding: 10px 18px; border-radius: 10px;
  cursor: pointer; transition: all 0.15s;
  white-space: nowrap;
}
.edit-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.08); }
.reset-btn {
  background: rgba(248,113,113,0.06);
  border: 1px solid rgba(248,113,113,0.2);
  color: #f87171; font-family: 'Syne', sans-serif;
  font-weight: 600; font-size: 13px;
  padding: 10px 18px; border-radius: 10px;
  cursor: pointer; transition: all 0.15s;
  white-space: nowrap;
}
.reset-btn:hover { background: rgba(248,113,113,0.12); border-color: rgba(248,113,113,0.4); }
.bottom-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 14px; margin-bottom: 14px;
}
.disclaimer {
  font-size: 11px; color: #1e293b;
  font-family: 'Space Mono', monospace;
  text-align: center; padding: 12px;
  border: 1px solid #1e293b; border-radius: 8px;
}
@media (max-width: 700px) {
  .bottom-grid { grid-template-columns: 1fr; }
  .dash-header { flex-direction: column; gap: 12px; }
}
</style>
