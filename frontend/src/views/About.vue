<template>
  <div class="about-page">
    <div class="page-inner">

      <div class="profile-header card">
        <div class="avatar">A</div>
        <div>
          <h1 class="profile-name">Azrul</h1>
          <p class="profile-role">Data Engineer · KL, Malaysia</p>
          <p class="profile-bio">
            7 years at NTT Research Inc. Japan (Photonics & Quantum Division) →
            transitioning into Data Engineering in Malaysia. JLPT N2 · Python · ETL · AWS.
          </p>
          <div class="profile-tags">
            <span class="ptag" v-for="t in tags" :key="t">{{ t }}</span>
          </div>
        </div>
      </div>

      <div class="about-grid">
        <div class="card">
          <h2 class="section-title">🛠 About This Project</h2>
          <p class="body-text">
            This net worth simulator was built as a personal finance tool and
            frontend portfolio project. It models compound growth across multiple
            Malaysian asset classes — EPF, ASB, US ETFs, and crypto — with
            configurable scenarios and DCA inputs.
          </p>
          <p class="body-text" style="margin-top:12px">
            The project demonstrates full-stack development skills:
            Vue 3 Composition API, Pinia state management, Chart.js visualizations,
            and a REST API backend with Express.js.
          </p>
        </div>

        <div class="card">
          <h2 class="section-title">📦 Tech Used</h2>
          <ul class="tech-list">
            <li v-for="t in techList" :key="t.name">
              <span class="tech-name">{{ t.name }}</span>
              <span class="tech-desc">{{ t.desc }}</span>
            </li>
          </ul>
        </div>

        <div class="card">
          <h2 class="section-title">🔗 Links</h2>
          <div class="links">
            <a href="https://github.com/azrul" target="_blank" class="link-btn">
              ⬡ GitHub
            </a>
            <a href="https://linkedin.com/in/azrul" target="_blank" class="link-btn">
              ∷ LinkedIn
            </a>
          </div>
          <p class="body-text" style="margin-top:16px; font-size:12px; color:#475569">
            Open for Data Engineer / Data Analyst roles in KL/Selangor.
            Strong in Python, ETL pipelines, SQL, and Japan-ASEAN bridge roles.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const tags = ['Vue 3', 'Python', 'ETL', 'SQL', 'JLPT N2', 'AWS', 'Data Engineering']
const techList = [
  { name: 'Vue 3 + Vite',   desc: 'Frontend framework & build tool' },
  { name: 'Pinia',          desc: 'Global state management' },
  { name: 'Vue Router',     desc: 'SPA routing' },
  { name: 'Chart.js',       desc: 'Data visualization' },
  { name: 'Express.js',     desc: 'REST API backend' },
  { name: 'Tailwind CSS',   desc: 'Utility styling' },
  { name: 'Axios',          desc: 'HTTP client' },
  { name: 'GitHub Pages',   desc: 'Free hosting' },
]
</script>

<style scoped>
.about-page { padding: 32px 20px; }
.page-inner { max-width: 900px; margin: 0 auto; }
.profile-header {
  display: flex; gap: 24px; align-items: flex-start;
  margin-bottom: 20px;
}
.avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #60a5fa);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: 800; color: #05070f; flex-shrink: 0;
}
.profile-name { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
.profile-role { color: var(--accent); font-size: 13px; font-family: 'Space Mono', monospace; margin: 4px 0 10px; }
.profile-bio { color: #94a3b8; font-size: 14px; line-height: 1.6; max-width: 580px; }
.profile-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.ptag {
  font-size: 11px; font-family: 'Space Mono', monospace;
  padding: 4px 10px; border-radius: 6px;
  background: rgba(110,231,183,0.08); border: 1px solid rgba(110,231,183,0.2);
  color: var(--accent);
}
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.about-grid > .card:first-child { grid-column: 1 / -1; }
.section-title { font-size: 17px; font-weight: 700; margin-bottom: 14px; }
.body-text { color: #94a3b8; font-size: 14px; line-height: 1.7; }
.tech-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.tech-list li { display: flex; justify-content: space-between; font-size: 13px; }
.tech-name { color: var(--text); font-weight: 600; }
.tech-desc { color: #475569; font-family: 'Space Mono', monospace; font-size: 11px; }
.links { display: flex; gap: 10px; }
.link-btn {
  padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 13px;
  text-decoration: none; border: 1px solid var(--border);
  color: var(--text); background: rgba(255,255,255,0.04);
  transition: all 0.15s;
}
.link-btn:hover { border-color: var(--accent); color: var(--accent); }
@media (max-width: 640px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-grid > .card:first-child { grid-column: 1; }
  .profile-header { flex-direction: column; }
}
</style>
