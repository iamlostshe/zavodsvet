import MainPage from '@/features/MainPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: MainPage,
      meta: { title: 'Главная | АО "СВЕТ"' },
    },
    {
      path: '/company',
      name: 'Company',
      component: () => import('@/features/CompanyPage.vue'),
      meta: { title: 'Компания | АО "СВЕТ"' },
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('@/features/ContactPage.vue'),
      meta: { title: 'Контакты | АО "СВЕТ"' },
    },
    {
      path: '/document',
      name: 'Document',
      component: () => import('@/features/DocumentPage.vue'),
      meta: { title: 'Документы | АО "СВЕТ"' },
    },
    {
      path: '/tour',
      name: 'Tour',
      component: () => import('@/features/TourPage.vue'),
      meta: { title: 'Экскурсия по заводу | АО "СВЕТ"' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/features/NotFoundPage.vue'),
      meta: { title: 'Страница не найдена | АО "СВЕТ"' },
    },
  ],
})
