import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import UserHome from '@/views/UserHome.vue'
import StyleGuide from '@/views/StyleGuide.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Welcome',
    },
    component: Home
  },
  {
    path: '/userhome',
    name: 'userhome',
    meta: {
      title: 'Welcome',
    },
    component: UserHome
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login',
    },
    component: Login
  },
    {
    path: '/styleguide',
    name: 'style-guide',
    meta: {
      title: 'Style Guide',
    },
    component: StyleGuide
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title: 'About',
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
