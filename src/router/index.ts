import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import UserHome from '@/views/UserHome.vue'
import StyleGuide from '@/views/StyleGuide.vue'
import UserManagement from '@/views/UserManagement.vue'
import ProgramManagement from '@/views/ProgramManagement.vue'
import store from '@/store/index.ts';
import { LOGIN, LOGOUT, REQUESTED_PATH, ERROR_STATE } from '@/store/mutation-types';
import * as api from '@/util/api';
import { BiResponse } from '@/model/BiResponse';

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
  },
  {
    path: '/usermanagement', 
    name: 'usermanagement', 
    meta: {
      title: 'User Management'
    }, 
    component: UserManagement
  },
  {
    path: '/program-management', 
    name: 'program-management', 
    meta: {
      title: 'Program Management'
    }, 
    component: ProgramManagement
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  // TODO: Check if the page is a protected resource, if not, let them through
  // If page is protected, check if they are logged in. 
  // TODO: Check if their token has expired. 
  if (!store.state.loggedIn) {

    //Get the user info
    api.call({url: `${process.env.VUE_APP_BI_API_V1_PATH}/userinfo`})
    .then((response: any) => {
      
      let biResponse = new BiResponse(response.data);
      store.commit(LOGIN, {'id': biResponse.result.orcid, 'name': biResponse.result.name, 'roles':[] });

      // If they are logged in and trying to go home, send them to user home
      if (to.path == '/') next('/userhome')
      else next();
    })
    .catch((error) => {

      // Check if it is a 401
      if (error.response && error.response.status === 401) {
          Vue.$log.info(`Unauthorized login, ${error.response}`);
          store.commit(ERROR_STATE, {'loginFailed': true});
      }

      // If logged in fail, send them to the home page
      if (to.path != '/') next('/')
      else next();
        
    });

  } else {
    // If the user is trying to go home and they are logged in, send them to user home. 
    if (to.path == '/' && store.state.loggedIn) next('/userhome')
    else next();
  }

  // Set page title
  document.title = to.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'

});


export default router
