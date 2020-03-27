import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/views/Index.vue'
import Home from '@/views/Home.vue'
import StyleGuide from '@/views/StyleGuide.vue'
import ProgramManagement from '@/views/ProgramManagement.vue'
import AdminProgramManagement from '@/views/AdminProgramManagement.vue'
import AdminUserManagement from '@/views/AdminUserManagement.vue'
import store from '@/store/index.ts';
import { LOGIN, LOGOUT, REQUESTED_PATH, ERROR_STATE } from '@/store/mutation-types';
import * as api from '@/util/api';
import { BiResponse } from '@/breeding-insight/model/BiResponse';
import ProgramLocationsManagement from "@/views/ProgramLocationsManagement.vue";
import ProgramUserManagement from "@/views/ProgramUsersManagement.vue";

Vue.use(VueRouter);

const layouts = {
  adminSideBar: 'adminSideBar',
  userSideBar: 'userSideBar',
  simple: 'simple'
}

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Welcome',
      layout: layouts.simple
    },
    component: Index
  },
  {
    path: '/home',
    name: 'home',
    meta: {
      title: 'Welcome',
      layout: layouts.userSideBar
    },
    component: Home
  },
  {
    path: '/style-guide',
    name: 'style-guide',
    meta: {
      title: 'Style Guide',
      layout: layouts.simple
    },
    component: StyleGuide
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title: 'About',
      layout: layouts.userSideBar
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/admin', 
    name: 'admin', 
    meta: {
      title: 'System Administration',
      layout: layouts.adminSideBar
    }, 
    component: AdminProgramManagement
  },
  {
    path: '/admin-user-management',
    name: 'admin-user-management',
    meta: {
      title: 'Admin User Management',
      layout: layouts.adminSideBar
    }, 
    component: AdminUserManagement
  },
  {
    path: '/admin-program-management',
    name: 'admin-program-management',
    meta: {
      title: 'Admin Program Management',
      layout: layouts.adminSideBar
    }, 
    component: AdminProgramManagement
  },
  {
    path: '/program-management',
    redirect: {name: 'program-locations'},
    name: 'program-management',
    meta: {
      title: 'Program Management',
      layout: layouts.userSideBar
    }, 
    component: ProgramManagement,
    children: [
      {
        path: 'locations',
        name: 'program-locations',
        meta: {
          title: 'Program Location Management',
          layout: layouts.userSideBar
        },
        component: ProgramLocationsManagement
      },
      {
        path: 'program-users',
        name: 'program-users',
        meta: {
          title: 'Program User Management',
          layout: layouts.userSideBar
        },
        component: ProgramUserManagement
      }
    ]
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
      if (to.path == '/') next('/home')
      else next();
    })
    .catch((error) => {

      // Check if it is a 401
      if (error.response && error.response.status === 401) {
          Vue.$log.info(`Unauthorized login, ${error.response}`);
          store.commit(ERROR_STATE, {'loginFailed': true});
      } else {
        store.commit(ERROR_STATE, {'loginFailed': false, 'loginServerError':true});
      }

      // If logged in fail, send them to the home page
      if (to.path != '/') next('/')
      else next();
        
    });

  } else {
    // If the user is trying to go home and they are logged in, send them to user home. 
    if (to.path == '/' && store.state.loggedIn) next('/home')
    else next();
  }

  // Set page title
  document.title = to.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'

});


export default router
