import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store/index'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path:'/admin',
    name:'admin',
    component:()=> import('../views/AdminView.vue'),
    meta:{
      requireAuth: true
    }
  },
  {
    path:'/login',
    name:'login',
    component:() => import('../views/LoginView.vue'),
    meta:{
      requireGuest: true
    }
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (!store.getters.isLoggedIn) {
      next('/login');
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requireGuest)) {
    if (store.getters.isLoggedIn) {
      next('/admin');
    } else {
      next();
    }
  } else {
    next();
  }
});



export default router
