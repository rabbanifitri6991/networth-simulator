<template>
  <div class="how-page">
    <div class="page-inner">
      <p class="tag" style="margin-bottom:12px">Documentation</p>
      <h1 class="page-title">How It Works</h1>

      <div class="sections">

        <section class="card section">
          <h2 class="section-title">⚙️ The Compound Formula</h2>
          <p class="section-body">
            Every asset grows using the same core formula applied monthly:
          </p>
          <div class="code-block">
            <code>
              monthlyRate = (1 + annualRate)^(1/12) - 1<br>
              value = value × (1 + monthlyRate) + monthlyContribution
            </code>
          </div>
          <p class="section-body">
            This runs for <strong>years × 12</strong> iterations. Data points are
            captured every 12 months for charting. The magic is in the compounding —
            each month's gains earn gains themselves.
          </p>
        </section>

        <section class="card section">
          <h2 class="section-title">📊 Asset Return Assumptions</h2>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Asset</th><th>Bull 🚀</th><th>Base 📈</th><th>Bear 🐻</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>ETF/Stocks (VOO, MGK, VT)</td><td>+14%</td><td>+10%</td><td>-5%</td></tr>
                <tr><td>EPF (KWSP)</td><td>+6.5%</td><td>+6.0%</td><td>+5.5%</td></tr>
                <tr><td>ASB (ASNB)</td><td>+5.75%</td><td>+5.75%</td><td>+5.0%</td></tr>
                <tr><td>Cash / FD</td><td>+2.5%</td><td>+2.5%</td><td>+2.5%</td></tr>
                <tr><td>Bitcoin</td><td>+80%</td><td>+35%</td><td>-40%</td></tr>
                <tr><td>Solana</td><td>+90%</td><td>+40%</td><td>-50%</td></tr>
                <tr><td>SOL Staking</td><td>+3.4%</td><td>+3.4%</td><td>+3.4%</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="card section">
          <h2 class="section-title">🏗️ Tech Stack</h2>
          <div class="stack-grid">
            <div v-for="item in stack" :key="item.name" class="stack-item">
              <p class="stack-name">{{ item.name }}</p>
              <p class="stack-desc">{{ item.desc }}</p>
            </div>
          </div>
        </section>

        <section class="card section">
          <h2 class="section-title">🔄 Data Flow</h2>
          <div class="flow">
            <div v-for="(step, i) in flow" :key="i" class="flow-step">
              <div class="flow-num">{{ i + 1 }}</div>
              <div>
                <p class="flow-title">{{ step.title }}</p>
                <p class="flow-desc">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
const stack = [
  { name: 'Vue 3',        desc: 'Frontend framework — Composition API + reactivity' },
  { name: 'Vite',         desc: 'Build tool — fast HMR, optimized production bundle' },
  { name: 'Pinia',        desc: 'State management — single source of truth for portfolio data' },
  { name: 'Vue Router',   desc: 'Client-side routing — Dashboard, How It Works, About' },
  { name: 'Chart.js',     desc: 'Data visualization — stacked area + horizontal bar charts' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling via @tailwindcss/vite plugin' },
  { name: 'Express.js',   desc: 'Backend API — save/load portfolio via REST endpoints' },
  { name: 'Axios',        desc: 'HTTP client — frontend talks to backend API' },
]

const flow = [
  { title: 'User adjusts controls',   desc: 'Sliders, toggles, and scenario buttons update Pinia store reactively' },
  { title: 'Store recomputes',         desc: 'Computed properties in portfolio.js rebuild projection via compound.js' },
  { title: 'Charts re-render',         desc: 'Chart.js sees updated data and smoothly animates the changes' },
  { title: 'User saves portfolio',     desc: 'Axios POST /api/portfolio sends data to Express backend' },
  { title: 'Backend persists data',    desc: 'Express saves to JSON file (or DB in production)' },
  { title: 'On next visit, data loads', desc: 'App.vue onMounted calls loadPortfolio() → GET /api/portfolio' },
]
</script>

<style scoped>
.how-page { padding: 32px 20px; }
.page-inner { max-width: 860px; margin: 0 auto; }
.page-title { font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 28px; }
.sections { display: flex; flex-direction: column; gap: 16px; }
.section-title { font-size: 18px; font-weight: 700; margin-bottom: 14px; }
.section-body { color: #94a3b8; line-height: 1.7; font-size: 14px; margin-bottom: 12px; }
.code-block {
  background: #0a0f1a; border: 1px solid var(--border);
  border-radius: 10px; padding: 16px 20px; margin: 12px 0;
  font-family: 'Space Mono', monospace; font-size: 13px;
  color: var(--accent); line-height: 2;
}
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { text-align: left; padding: 10px 12px; color: var(--muted); font-family: 'Space Mono', monospace; font-size: 11px; border-bottom: 1px solid var(--border); }
td { padding: 10px 12px; color: #94a3b8; border-bottom: 1px solid rgba(255,255,255,0.04); }
tr:first-child td { color: var(--text); }
.stack-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.stack-item { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; }
.stack-name { font-weight: 700; font-size: 13px; color: var(--accent); margin-bottom: 4px; }
.stack-desc { font-size: 12px; color: #64748b; line-height: 1.5; }
.flow { display: flex; flex-direction: column; gap: 14px; }
.flow-step { display: flex; gap: 14px; align-items: flex-start; }
.flow-num {
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(110,231,183,0.1); border: 1px solid var(--accent);
  color: var(--accent); font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  font-family: 'Space Mono', monospace;
}
.flow-title { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
.flow-desc { font-size: 13px; color: #64748b; line-height: 1.5; }
</style>
