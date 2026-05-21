<template>
  <div class="salary-page">
    <div class="page-inner">

      <p class="tag" style="margin-bottom:10px">Budget Planner</p>
      <h1 class="page-title">Salary <span class="accent">Calculator</span></h1>
      <p class="page-sub">Model your take-home, expenses, and investable surplus</p>

      <!-- Input row -->
      <div class="input-grid card" style="margin-bottom:20px">
        <div class="input-group">
          <label class="tag">Gross Monthly Salary (RM)</label>
          <div class="rm-input">
            <span class="rm-prefix">RM</span>
            <input type="number" v-model.number="salary" min="1000" max="50000" step="500" />
          </div>
          <input type="range" v-model.number="salary" min="3000" max="20000" step="500" class="mt-2" />
          <div class="range-labels"><span>RM3,000</span><span>RM20,000</span></div>
        </div>

        <div class="input-group">
          <label class="tag">Bonus (months)</label>
          <div class="btn-group" style="margin-top:8px">
            <button
              v-for="m in [0, 1, 2, 3, 4]" :key="m"
              class="btn" :class="{ active: bonusMonths === m }"
              :style="bonusMonths === m ? { background:'#60a5fa', color:'#05070f' } : {}"
              @click="bonusMonths = m"
            >{{ m === 0 ? 'None' : m + 'x' }}</button>
          </div>
        </div>

        <div class="input-group">
          <label class="tag">Living Situation</label>
          <div class="btn-group flex-wrap" style="margin-top:8px">
            <button
              v-for="opt in housingOptions" :key="opt.key"
              class="btn" :class="{ active: housing === opt.key }"
              :style="housing === opt.key ? { background:'#a78bfa', color:'#05070f' } : {}"
              @click="housing = opt.key"
            >{{ opt.label }}</button>
          </div>
        </div>

        <div class="input-group">
          <label class="tag">Lifestyle</label>
          <div class="btn-group flex-wrap" style="margin-top:8px">
            <button
              v-for="opt in lifestyleOptions" :key="opt.key"
              class="btn" :class="{ active: lifestyle === opt.key }"
              :style="lifestyle === opt.key ? { background:'#34d399', color:'#05070f' } : {}"
              @click="lifestyle = opt.key"
            >{{ opt.label }}</button>
          </div>
        </div>
      </div>

      <!-- Main breakdown grid -->
      <div class="breakdown-grid">

        <!-- Deductions -->
        <div class="card">
          <h2 class="section-title">📋 Monthly Deductions</h2>
          <div class="line-items">
            <div class="line-item" v-for="item in deductions" :key="item.label">
              <span class="li-label">{{ item.label }}</span>
              <span class="li-value deduct">-RM{{ item.value.toLocaleString('en-MY') }}</span>
            </div>
            <div class="line-divider" />
            <div class="line-item total-line">
              <span class="li-label">Take-home</span>
              <span class="li-value accent-val">RM{{ takeHome.toLocaleString('en-MY') }}</span>
            </div>
          </div>
        </div>

        <!-- Expenses -->
        <div class="card">
          <h2 class="section-title">🛒 Monthly Expenses</h2>
          <div class="line-items">
            <div class="line-item" v-for="item in expenses" :key="item.label">
              <span class="li-label">{{ item.label }}</span>
              <span class="li-value deduct">-RM{{ item.value.toLocaleString('en-MY') }}</span>
            </div>
            <div class="line-divider" />
            <div class="line-item total-line">
              <span class="li-label">Total expenses</span>
              <span class="li-value deduct">-RM{{ totalExpenses.toLocaleString('en-MY') }}</span>
            </div>
          </div>
        </div>

        <!-- Surplus & allocation -->
        <div class="card surplus-card">
          <h2 class="section-title">💰 Investable Surplus</h2>
          <div class="surplus-hero">
            <p class="surplus-amount">RM{{ surplus.toLocaleString('en-MY') }}</p>
            <p class="surplus-label">per month</p>
            <div class="savings-rate-bar">
              <div class="savings-rate-fill" :style="{ width: savingsRate + '%' }" />
            </div>
            <p class="savings-rate-text">{{ savingsRate }}% savings rate</p>
          </div>

          <h3 class="alloc-title">Suggested Allocation</h3>
          <div class="line-items">
            <div class="line-item" v-for="item in allocation" :key="item.label">
              <div style="display:flex;align-items:center;gap:8px">
                <div class="alloc-dot" :style="{ background: item.color }" />
                <span class="li-label">{{ item.label }}</span>
              </div>
              <span class="li-value" :style="{ color: item.color }">RM{{ item.value.toLocaleString('en-MY') }}</span>
            </div>
          </div>
        </div>

        <!-- Bonus panel -->
        <div class="card" v-if="bonusMonths > 0">
          <h2 class="section-title">🎁 Bonus Deployment</h2>
          <div class="bonus-gross">
            <p class="tag">Gross bonus</p>
            <p class="bonus-amount">RM{{ bonusGross.toLocaleString('en-MY') }}</p>
            <p class="bonus-net-note">~RM{{ bonusNet.toLocaleString('en-MY') }} after tax (~10%)</p>
          </div>
          <div class="line-items" style="margin-top:16px">
            <div class="line-item" v-for="item in bonusAllocation" :key="item.label">
              <div style="display:flex;align-items:center;gap:8px">
                <div class="alloc-dot" :style="{ background: item.color }" />
                <span class="li-label">{{ item.label }}</span>
              </div>
              <span class="li-value" :style="{ color: item.color }">RM{{ item.value.toLocaleString('en-MY') }}</span>
            </div>
          </div>
          <div class="bonus-tip">
            💡 Invest ASB portion in January — ASB dividend based on lowest monthly balance.
          </div>
        </div>

      </div>

      <!-- Annual summary -->
      <div class="card annual-card" style="margin-top:16px">
        <h2 class="section-title">📅 Annual Summary</h2>
        <div class="annual-grid">
          <div v-for="item in annualSummary" :key="item.label" class="annual-item">
            <p class="tag">{{ item.label }}</p>
            <p class="annual-val" :style="{ color: item.color }">RM{{ item.value.toLocaleString('en-MY') }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const salary      = ref(10000)
const bonusMonths = ref(2)
const housing     = ref('housemate')
const lifestyle   = ref('moderate')

const housingOptions = [
  { key: 'family',    label: 'Family',    rent: 0 },
  { key: 'housemate', label: 'Housemate', rent: 600 },
  { key: 'alone',     label: 'Alone',     rent: 1200 },
  { key: 'own',       label: 'Own',       rent: 300 },
]
const lifestyleOptions = [
  { key: 'frugal',     label: 'Frugal',     mult: 0.8 },
  { key: 'moderate',   label: 'Moderate',   mult: 1.0 },
  { key: 'comfortable',label: 'Comfortable',mult: 1.3 },
]

const currentHousing   = computed(() => housingOptions.find(o => o.key === housing.value))
const currentLifestyle = computed(() => lifestyleOptions.find(o => o.key === lifestyle.value))

// ── Deductions ──────────────────────────────────────────────────────────
const epfEmployee  = computed(() => Math.round(salary.value * 0.11))
const socsoEis     = computed(() => 55)
const incomeTax    = computed(() => {
  const s = salary.value
  if (s <= 4000)  return 0
  if (s <= 6000)  return Math.round(s * 0.03)
  if (s <= 8000)  return Math.round(s * 0.05)
  if (s <= 10000) return Math.round(s * 0.065)
  if (s <= 12000) return Math.round(s * 0.08)
  if (s <= 15000) return Math.round(s * 0.10)
  return Math.round(s * 0.115)
})

const deductions = computed(() => [
  { label: 'EPF (11%)',       value: epfEmployee.value },
  { label: 'SOCSO + EIS',    value: socsoEis.value },
  { label: 'Income Tax (est)', value: incomeTax.value },
])
const takeHome = computed(() =>
  salary.value - epfEmployee.value - socsoEis.value - incomeTax.value
)

// ── Expenses ────────────────────────────────────────────────────────────
const baseExpenses = computed(() => {
  const rent   = currentHousing.value?.rent || 0
  const mult   = currentLifestyle.value?.mult || 1
  return {
    rent,
    food:      Math.round(600 * mult),
    transport: Math.round(400 * mult),
    utilities: 150,
    groceries: Math.round(200 * mult),
    shopping:  Math.round(200 * mult),
    entertainment: Math.round(150 * mult),
    misc:      200,
  }
})
const expenses = computed(() => [
  { label: 'Rent',              value: baseExpenses.value.rent },
  { label: 'Food & drinks',     value: baseExpenses.value.food },
  { label: 'Transport',         value: baseExpenses.value.transport },
  { label: 'Utilities + phone', value: baseExpenses.value.utilities },
  { label: 'Groceries',         value: baseExpenses.value.groceries },
  { label: 'Shopping',          value: baseExpenses.value.shopping },
  { label: 'Entertainment',     value: baseExpenses.value.entertainment },
  { label: 'Miscellaneous',     value: baseExpenses.value.misc },
].filter(e => e.value > 0))

const totalExpenses = computed(() => expenses.value.reduce((s, e) => s + e.value, 0))
const surplus       = computed(() => Math.max(takeHome.value - totalExpenses.value, 0))
const savingsRate   = computed(() => Math.round((surplus.value / takeHome.value) * 100))

// ── Allocation ──────────────────────────────────────────────────────────
const allocation = computed(() => {
  const s = surplus.value
  const asb  = Math.min(Math.round(s * 0.25), 2000)
  const etf  = Math.round(s * 0.28)
  const btc  = Math.min(Math.round(s * 0.09), 500)
  const epf  = Math.round(s * 0.05)
  const life = Math.round(s * 0.10)
  const buf  = s - asb - etf - btc - epf - life
  return [
    { label: 'ASB (ASNB)',       value: asb,  color: '#34d399' },
    { label: 'ETF DCA (VOO/MGK)',value: etf,  color: '#a78bfa' },
    { label: 'Bitcoin DCA',      value: btc,  color: '#f59e0b' },
    { label: 'EPF Voluntary',    value: epf,  color: '#60a5fa' },
    { label: 'Lifestyle/travel', value: life, color: '#94a3b8' },
    { label: 'Buffer/emergency', value: buf,  color: '#475569' },
  ].filter(a => a.value > 0)
})

// ── Bonus ───────────────────────────────────────────────────────────────
const bonusGross = computed(() => salary.value * bonusMonths.value)
const bonusNet   = computed(() => Math.round(bonusGross.value * 0.90))
const bonusAllocation = computed(() => {
  const b = bonusNet.value
  const asb  = Math.min(Math.round(b * 0.35), 10000)
  const etf  = Math.round(b * 0.28)
  const btc  = Math.round(b * 0.12)
  const life = Math.round(b * 0.12)
  const emer = b - asb - etf - btc - life
  return [
    { label: 'ASB lump sum (Jan!)', value: asb,  color: '#34d399' },
    { label: 'ETF lump sum',        value: etf,  color: '#a78bfa' },
    { label: 'BTC lump sum',        value: btc,  color: '#f59e0b' },
    { label: 'Emergency / buffer',  value: emer, color: '#475569' },
    { label: 'Reward yourself 🎉',  value: life, color: '#94a3b8' },
  ].filter(a => a.value > 0)
})

// ── Annual ──────────────────────────────────────────────────────────────
const annualSummary = computed(() => [
  { label: 'Gross annual',        value: salary.value * 12 + bonusGross.value,  color: '#e2e8f0' },
  { label: 'Total take-home',     value: takeHome.value * 12 + bonusNet.value,  color: '#60a5fa' },
  { label: 'Total invested',      value: surplus.value * 12 + bonusNet.value * 0.75, color: '#34d399' },
  { label: 'EPF contributions',   value: (epfEmployee.value + Math.round(salary.value * 0.13)) * 12, color: '#60a5fa' },
])
</script>

<style scoped>
.salary-page { padding: 32px 20px; }
.page-inner  { max-width: 1100px; margin: 0 auto; }
.page-title  { font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 6px; }
.page-sub    { color: #475569; font-size: 14px; margin-bottom: 28px; font-family: 'Space Mono', monospace; }
.accent      { color: var(--accent); }

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}
.input-group label { display: block; margin-bottom: 8px; }
.rm-input {
  display: flex; align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 8px; overflow: hidden;
}
.rm-prefix {
  padding: 10px 12px;
  background: rgba(255,255,255,0.06);
  font-family: 'Space Mono', monospace;
  font-size: 13px; color: var(--accent);
  border-right: 1px solid var(--border);
}
.rm-input input {
  background: transparent; border: none;
  color: var(--text); font-family: 'Syne', sans-serif;
  font-size: 18px; font-weight: 700;
  padding: 10px 14px; width: 100%; outline: none;
}
.range-labels {
  display: flex; justify-content: space-between;
  font-size: 10px; color: var(--muted);
  font-family: 'Space Mono', monospace; margin-top: 2px;
}
.btn-group { display: flex; gap: 6px; flex-wrap: wrap; }
.flex-wrap { flex-wrap: wrap; }

.breakdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.section-title { font-size: 15px; font-weight: 700; margin-bottom: 16px; }

.line-items  { display: flex; flex-direction: column; gap: 10px; }
.line-item   { display: flex; justify-content: space-between; align-items: center; }
.li-label    { font-size: 13px; color: #94a3b8; }
.li-value    { font-size: 13px; font-weight: 600; font-family: 'Space Mono', monospace; }
.deduct      { color: #f87171; }
.accent-val  { color: var(--accent); font-size: 15px; }
.line-divider { height: 1px; background: var(--border); margin: 4px 0; }
.total-line .li-label { font-weight: 700; color: var(--text); }

.surplus-card { grid-column: 1 / -1; }
.surplus-hero { text-align: center; padding: 20px 0; }
.surplus-amount { font-size: 48px; font-weight: 800; color: var(--accent); letter-spacing: -2px; }
.surplus-label  { color: var(--muted); font-size: 13px; font-family: 'Space Mono', monospace; margin-top: 4px; }
.savings-rate-bar {
  height: 4px; background: rgba(255,255,255,0.08);
  border-radius: 2px; margin: 16px auto 6px; max-width: 300px;
}
.savings-rate-fill {
  height: 100%; background: var(--accent);
  border-radius: 2px; transition: width 0.4s;
  max-width: 100%;
}
.savings-rate-text { font-size: 12px; color: var(--muted); font-family: 'Space Mono', monospace; }
.alloc-title { font-size: 13px; font-weight: 700; color: #64748b; margin: 20px 0 12px; text-transform: uppercase; letter-spacing: 1px; }
.alloc-dot   { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.bonus-gross  { text-align: center; padding: 16px; background: rgba(96,165,250,0.06); border-radius: 10px; }
.bonus-amount { font-size: 32px; font-weight: 800; color: #60a5fa; letter-spacing: -1px; margin: 6px 0 4px; }
.bonus-net-note { font-size: 11px; color: var(--muted); font-family: 'Space Mono', monospace; }
.bonus-tip {
  margin-top: 16px; padding: 10px 14px;
  background: rgba(52,211,153,0.06);
  border: 1px solid rgba(52,211,153,0.15);
  border-radius: 8px; font-size: 12px; color: #34d399;
}

.annual-card .section-title { margin-bottom: 20px; }
.annual-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
}
.annual-item {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 10px; padding: 14px 16px;
}
.annual-val { font-size: 22px; font-weight: 700; margin-top: 8px; }

.mt-2 { margin-top: 8px; }

@media (max-width: 700px) {
  .breakdown-grid { grid-template-columns: 1fr; }
  .surplus-card { grid-column: 1; }
}
</style>
