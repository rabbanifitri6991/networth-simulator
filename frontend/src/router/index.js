import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard  from '@/views/Dashboard.vue'
import SalaryCalc from '@/views/SalaryCalc.vue'
import HowItWorks from '@/views/HowItWorks.vue'
import About      from '@/views/About.vue'

const routes = [
  { path: '/',        component: Dashboard,  name: 'dashboard',  meta: { title: 'Dashboard' } },
  { path: '/salary',  component: SalaryCalc, name: 'salary',     meta: { title: 'Salary Calculator' } },
  { path: '/how',     component: HowItWorks, name: 'how',        meta: { title: 'How It Works' } },
  { path: '/about',   component: About,      name: 'about',      meta: { title: 'About' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

// Update page title on route change
router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — NetWorth.sim`
    : 'NetWorth.sim'
})

export default router
