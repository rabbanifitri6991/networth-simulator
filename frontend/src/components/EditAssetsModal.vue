<template>
  <!-- Backdrop -->
  <teleport to="body">
    <transition name="modal">
      <div v-if="modelValue" class="backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal">

          <!-- Header -->
          <div class="modal-header">
            <div>
              <p class="tag" style="margin-bottom:4px">Edit Portfolio</p>
              <h2 class="modal-title">Your Asset Values</h2>
            </div>
            <button class="close-btn" @click="$emit('update:modelValue', false)">✕</button>
          </div>

          <!-- Fields -->
          <div class="modal-body">
            <p class="modal-hint">Update your current holdings. Values in Ringgit Malaysia (RM).</p>

            <div class="fields-grid">
              <div v-for="field in fields" :key="field.key" class="field-group">
                <label class="field-label" :style="{ color: field.color }">
                  {{ field.label }}
                </label>
                <p class="field-desc">{{ field.desc }}</p>
                <div class="field-input-wrap">
                  <span class="field-prefix">RM</span>
                  <input
                    type="number"
                    :min="0"
                    :step="field.step || 100"
                    v-model.number="localAssets[field.key]"
                    class="field-input"
                  />
                </div>
              </div>
            </div>

            <!-- Japan special section -->
            <div class="japan-section">
              <p class="tag" style="margin-bottom:8px">Japan Pension (optional)</p>
              <p class="field-desc">Enter ¥ amount — will auto-convert to RM at current rate (0.02482)</p>
              <div class="japan-row">
                <div class="field-input-wrap" style="flex:1">
                  <span class="field-prefix">¥</span>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    v-model.number="japanYen"
                    class="field-input"
                    placeholder="1600000"
                  />
                </div>
                <div class="japan-converted">
                  = RM{{ japanRM.toLocaleString('en-MY') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <p class="total-line">
              Total net worth:
              <span class="total-val">RM{{ newTotal.toLocaleString('en-MY') }}</span>
            </p>
            <div class="modal-actions">
              <button class="btn btn-reset" @click="handleReset">↺ Reset to Zero</button>
              <button class="btn" @click="$emit('update:modelValue', false)">Cancel</button>
              <button class="btn-confirm" @click="handleSave">Save Changes</button>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'

const props = defineProps({ modelValue: Boolean })
const emit  = defineEmits(['update:modelValue'])

const store = usePortfolioStore()
const JPY_MYR = 0.02482

// Local copy of assets — only commit to store on Save
const localAssets = ref({ ...store.assets })
const japanYen    = ref(Math.round(store.assets.japan / JPY_MYR))
const japanRM     = computed(() => Math.round(japanYen.value * JPY_MYR))

// Sync local when modal opens
watch(() => props.modelValue, (open) => {
  if (open) {
    localAssets.value = { ...store.assets }
    japanYen.value    = Math.round(store.assets.japan / JPY_MYR)
  }
})

const fields = [
  { key: 'bank',   label: 'Cash / Bank',    desc: 'Savings account, FD, cash on hand',  color: '#94a3b8', step: 100  },
  { key: 'epf',    label: 'EPF (KWSP)',      desc: 'Your current EPF balance',            color: '#60a5fa', step: 100  },
  { key: 'asb',    label: 'ASB (ASNB)',      desc: 'Amanah Saham Bumiputera balance',     color: '#34d399', step: 100  },
  { key: 'stocks', label: 'US Stocks / ETF', desc: 'Moomoo portfolio — VOO, MGK, VT',    color: '#a78bfa', step: 100  },
  { key: 'btc',    label: 'Bitcoin',         desc: 'Current BTC holding value in RM',    color: '#f59e0b', step: 50   },
  { key: 'sol',    label: 'Solana',          desc: 'Current SOL holding value in RM',    color: '#8b5cf6', step: 50   },
]

const newTotal = computed(() => {
  return Object.entries(localAssets.value)
    .filter(([k]) => k !== 'japan')
    .reduce((s, [, v]) => s + (v || 0), 0)
    + japanRM.value
})

function handleSave() {
  store.assets = {
    ...localAssets.value,
    japan: japanRM.value,
  }
  emit('update:modelValue', false)
}

function handleReset() {
  Object.keys(localAssets.value).forEach(k => localAssets.value[k] = 0)
  japanYen.value = 0
  store.resetPortfolio()
}
</script>

<style scoped>
.backdrop {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.modal {
  background: #0c1020;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  width: 100%; max-width: 620px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  overflow: hidden;
}

/* Header */
.modal-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 24px 28px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.modal-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
.close-btn {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  color: #64748b; border-radius: 8px; width: 32px; height: 32px;
  cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; flex-shrink: 0;
}
.close-btn:hover { color: var(--text); background: rgba(255,255,255,0.1); }

/* Body */
.modal-body { padding: 24px 28px; overflow-y: auto; flex: 1; }
.modal-hint  { font-size: 13px; color: #475569; font-family: 'Space Mono', monospace; margin-bottom: 20px; }

.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}
.field-group {}
.field-label { font-size: 12px; font-weight: 700; display: block; margin-bottom: 3px; }
.field-desc  { font-size: 11px; color: #334155; font-family: 'Space Mono', monospace; margin-bottom: 8px; }
.field-input-wrap {
  display: flex; align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px; overflow: hidden;
  transition: border-color 0.15s;
}
.field-input-wrap:focus-within { border-color: rgba(255,255,255,0.2); }
.field-prefix {
  padding: 9px 12px;
  font-family: 'Space Mono', monospace;
  font-size: 12px; color: #475569;
  background: rgba(255,255,255,0.04);
  border-right: 1px solid rgba(255,255,255,0.08);
  flex-shrink: 0;
}
.field-input {
  background: transparent; border: none; outline: none;
  color: var(--text); font-family: 'Syne', sans-serif;
  font-size: 15px; font-weight: 700;
  padding: 9px 12px; width: 100%;
}

/* Japan section */
.japan-section {
  background: rgba(45,212,191,0.05);
  border: 1px solid rgba(45,212,191,0.15);
  border-radius: 12px; padding: 16px;
  margin-bottom: 4px;
}
.japan-row { display: flex; align-items: center; gap: 14px; margin-top: 10px; }
.japan-converted {
  font-size: 15px; font-weight: 700; color: #2dd4bf;
  font-family: 'Space Mono', monospace; white-space: nowrap;
}

/* Footer */
.modal-footer {
  padding: 20px 28px;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex; justify-content: space-between; align-items: center;
  gap: 16px;
}
.total-line { font-size: 13px; color: #475569; font-family: 'Space Mono', monospace; }
.total-val  { color: var(--accent); font-weight: 700; font-size: 16px; margin-left: 8px; }
.modal-actions { display: flex; gap: 8px; }
.btn-confirm {
  background: var(--accent); color: #05070f;
  border: none; font-family: 'Syne', sans-serif;
  font-weight: 700; font-size: 13px;
  padding: 9px 22px; border-radius: 8px; cursor: pointer;
  transition: opacity 0.15s;
}
.btn-confirm:hover { opacity: 0.85; }
.btn-reset {
  color: #f87171; border-color: rgba(248,113,113,0.2);
  background: rgba(248,113,113,0.05);
}
.btn-reset:hover { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.4); }

/* Transition */
.modal-enter-active, .modal-leave-active { transition: all 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.96); }

@media (max-width: 500px) {
  .fields-grid { grid-template-columns: 1fr; }
  .modal-footer { flex-direction: column; align-items: flex-start; }
}
</style>
