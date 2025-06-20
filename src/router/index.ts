import { createRouter, createWebHistory } from "vue-router"

import MainView from "../views/MainView.vue"
import CompanyView from "../views/CompanyView.vue"
import ContactView from "../views/ContactView.vue"
import DocumentView from "../views/DocumentView.vue"
import NotFoundView from "../views/NotFoundView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Main",
      component: MainView,
      meta: { title: 'Главная | АО "СВЕТ"' },
    },
    {
      path: "/company",
      name: "Company",
      component: CompanyView,
      meta: { title: 'Компания | АО "СВЕТ"' },
    },
    {
      path: "/kontakty",
      name: "Contact",
      component: ContactView,
      meta: { title: 'Контакты | АО "СВЕТ"' },
    },
    {
      path: "/contact",
      name: "Contact",
      component: ContactView,
      meta: { title: 'Контакты | АО "СВЕТ"' },
    },
    {
      path: "/document",
      name: "Document",
      component: DocumentView,
      meta: { title: 'Доументы | АО "СВЕТ"' },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
      meta: { title: 'Страница не найдена | АО "СВЕТ"' },
    }
  ],
})

export default router
