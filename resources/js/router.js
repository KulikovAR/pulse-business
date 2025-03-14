import { createWebHistory, createRouter } from 'vue-router'

// import MainPage from './pages/MainPage.vue'
import MainPage from './pages/MainPage.vue'
import CalendarPage from './pages/CalendarPage.vue'
import ClientsPage from './pages/ClientsPage.vue'
import NewClientPage from './pages/NewClientPage.vue'
import WorkerksPage from './pages/WorkersPage.vue'
import ServicesPage from './pages/ServicesPage.vue'
import NotesPage from './pages/NotesPage.vue'
import PublicApiPage from './pages/PublicApiPage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import ConfirmPhonePage from './pages/ConfirmPhonePage.vue'




const routes = [
  { path: '/', name: 'main', component: MainPage },
  { path: '/calendar', name: 'calendar', component: CalendarPage },
  { path: '/clients', name: 'clients', component: ClientsPage },
  { path: '/new-client', name: 'new-client', component: NewClientPage },
  { path: '/workers', name: 'workers', component: WorkerksPage },
  { path: '/services', name: 'services', component: ServicesPage },
  { path: '/notes', name: 'notes', component: NotesPage },
  { path: '/public-api', name: 'public-api', component: PublicApiPage},
  { path: '/settings', name: 'settings', component: SettingsPage},
  { path: '/confirm-phone', name: 'confirm-phone', component: ConfirmPhonePage}


]

export default createRouter({
  history: createWebHistory(),
  routes,
})
