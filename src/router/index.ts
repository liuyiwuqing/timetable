import { createRouter, createWebHistory } from 'vue-router'
import TimetableView from '@/views/TimetableView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'timetable',
      component: TimetableView
    }
  ]
})

export default router