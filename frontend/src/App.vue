<template>
  <div class="app-shell">
    <nav class="navbar">
      <div class="nav-inner">
        <router-link to="/" class="nav-brand">
          <span class="brand-icon">◈</span>
          <span class="brand-name">NetWorth<span class="brand-accent">.sim</span></span>
        </router-link>

        <div class="nav-links">
          <router-link to="/"       class="nav-link" active-class="nav-link--active" exact>Dashboard</router-link>
          <router-link to="/salary" class="nav-link" active-class="nav-link--active">Salary</router-link>
          <router-link to="/how"    class="nav-link" active-class="nav-link--active">How It Works</router-link>
          <router-link to="/about"  class="nav-link" active-class="nav-link--active">About</router-link>
        </div>

        <div class="nav-actions">
          <span v-if="store.lastSaved" class="saved-ts">
            Saved {{ savedAgo }}
          </span>
          <button class="btn-save" @click="handleSave" :disabled="store.isLoading">
            {{ store.isLoading ? 'Saving...' : '↑ Save' }}
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <p>NetWorth.sim · Built with Vue 3 + Express · <span style="color:#475569">Not financial advice</span></p>
    </footer>

    <transition name="slide-up">
      <div v-if="toast" class="toast" :class="toast.type">{{ toast.message }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()
const toast = ref(null)

const savedAgo = computed(() => {
  if (!store.lastSaved) return ''
  const diff = Math.round((Date.now() - new Date(store.lastSaved)) / 60000)
  if (diff < 1)  return 'just now'
  if (diff < 60) return `${diff}m ago`
  return `${Math.floor(diff / 60)}h ago`
})

onMounted(() => store.loadPortfolio())

async function handleSave() {
  const result = await store.savePortfolio()
  toast.value = result.success
    ? { message: '✓ Portfolio saved', type: 'success' }
    : { message: '✗ Save failed — is the API running?', type: 'error' }
  setTimeout(() => toast.value = null, 3000)
}
</script>

<style scoped>
.app-shell { min-height: 100vh; display: flex; flex-direction: column; }

.navbar {
  position: sticky; top: 0; z-index: 100;
  background: rgba(5,7,15,0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 1100px; margin: 0 auto;
  display: flex; align-items: center; gap: 8px;
  padding: 14px 24px;
}
.nav-brand {
  display: flex; align-items: center; gap: 8px;
  text-decoration: none; margin-right: 8px;
}
.brand-icon  { font-size: 20px; color: var(--accent); }
.brand-name  { font-size: 16px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); }
.brand-accent { color: var(--accent); }

.nav-links   { display: flex; gap: 2px; margin-left: auto; }
.nav-link {
  font-size: 13px; font-weight: 600;
  color: #475569; padding: 6px 14px;
  border-radius: 8px; text-decoration: none;
  transition: all 0.15s;
}
.nav-link:hover       { color: var(--text); background: rgba(255,255,255,0.05); }
.nav-link--active     { color: var(--text); background: rgba(255,255,255,0.08); }

.nav-actions { display: flex; align-items: center; gap: 10px; margin-left: 12px; }
.saved-ts    { font-size: 11px; color: #334155; font-family: 'Space Mono', monospace; }
.btn-save {
  background: var(--accent); color: #05070f;
  border: none; font-family: 'Syne', sans-serif;
  font-weight: 700; font-size: 13px;
  padding: 7px 18px; border-radius: 8px; cursor: pointer;
  transition: opacity 0.15s;
}
.btn-save:hover    { opacity: 0.85; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

.main-content { flex: 1; }

.footer {
  border-top: 1px solid var(--border);
  text-align: center;
  padding: 16px 24px;
  font-size: 12px;
  color: #334155;
  font-family: 'Space Mono', monospace;
}

.toast {
  position: fixed; bottom: 24px; right: 24px;
  padding: 12px 20px; border-radius: 10px;
  font-size: 13px; font-weight: 600;
  font-family: 'Space Mono', monospace; z-index: 999;
}
.toast.success { background: #064e3b; color: var(--accent); border: 1px solid var(--accent); }
.toast.error   { background: #450a0a; color: #f87171; border: 1px solid #f87171; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.18s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s; }
.slide-up-enter-from, .slide-up-leave-to       { opacity: 0; transform: translateY(12px); }
</style>
