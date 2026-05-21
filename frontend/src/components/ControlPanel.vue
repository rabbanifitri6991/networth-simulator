<template>
  <div class="card control-panel">
    <div class="controls-row">

      <!-- Scenario -->
      <div class="control-group">
        <p class="tag">Scenario</p>
        <div class="btn-group">
          <button
            v-for="(r, key) in store.returns"
            :key="key"
            class="btn"
            :class="{ active: store.scenario === key }"
            :style="store.scenario === key ? { background: scenarioColors[key], color: '#05070f' } : {}"
            @click="store.scenario = key"
          >{{ r.label }}</button>
        </div>
      </div>

      <!-- Horizon -->
      <div class="control-group">
        <p class="tag">Horizon</p>
        <div class="btn-group">
          <button
            v-for="y in [3,5,10,15,20]"
            :key="y"
            class="btn"
            :class="{ active: store.years === y }"
            :style="store.years === y ? { background: '#60a5fa', color: '#05070f' } : {}"
            @click="store.years = y"
          >{{ y }}Y</button>
        </div>
      </div>

      <!-- ETF Monthly -->
      <div class="control-group slider-group">
        <p class="tag">
          ETF Monthly:
          <span class="slider-val" style="color:#a78bfa">RM{{ store.monthlyEtf.toLocaleString() }}</span>
        </p>
        <input type="range" min="200" max="8000" step="100" v-model.number="store.monthlyEtf" />
        <div class="slider-labels"><span>RM200</span><span>RM8,000</span></div>
      </div>

      <!-- BTC Monthly -->
      <div class="control-group slider-group">
        <p class="tag">
          BTC Monthly:
          <span class="slider-val" style="color:#f59e0b">RM{{ store.monthlyBtc.toLocaleString() }}</span>
        </p>
        <input type="range" min="0" max="2000" step="50" v-model.number="store.monthlyBtc" />
        <div class="slider-labels"><span>RM0</span><span>RM2,000</span></div>
      </div>

      <!-- Toggles -->
      <div class="control-group">
        <p class="tag">Options</p>
        <div class="toggles">
          <ToggleSwitch
            v-model="store.deployJapan"
            label="Japan Lump Sum"
            :sub="`RM${store.assets.japan.toLocaleString()}`"
          />
          <ToggleSwitch
            v-model="store.includeCrypto"
            label="Include Crypto"
            sub="BTC + SOL"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { usePortfolioStore } from '@/stores/portfolio'
import ToggleSwitch from './ToggleSwitch.vue'

const store = usePortfolioStore()
const scenarioColors = { bull: '#34d399', base: '#60a5fa', bear: '#f87171' }
</script>

<style scoped>
.control-panel { margin-bottom: 16px; }
.controls-row {
  display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start;
}
.control-group { min-width: 140px; }
.btn-group { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.slider-group { min-width: 180px; flex: 1; }
.slider-val { color: var(--accent); font-family: 'Space Mono', monospace; }
input[type=range] { margin-top: 8px; }
.slider-labels {
  display: flex; justify-content: space-between;
  font-size: 10px; color: var(--muted); margin-top: 2px;
  font-family: 'Space Mono', monospace;
}
.toggles { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
</style>
