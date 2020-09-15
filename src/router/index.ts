/*
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Vue from 'vue'
import VueRouter, {Route} from 'vue-router'
import Index from '@/views/Index.vue'
import Home from '@/views/Home.vue'
import StyleGuide from '@/views/StyleGuide.vue'
import NotAuthorized from '@/views/NotAuthorized.vue'
import ProgramManagement from '@/views/ProgramManagement.vue'
import AdminProgramManagement from '@/views/AdminProgramManagement.vue'
import AdminUserManagement from '@/views/AdminUserManagement.vue'
import store from '@/store/index.ts';
import {
  LOGIN,
  LOGOUT,
  REQUESTED_PATH,
  ERROR_STATE,
  SET_ACTIVE_PROGRAM,
  FIRST_VISIT,
  RETURN_VISIT
} from '@/store/mutation-types';
import ProgramLocationsManagement from "@/views/ProgramLocationsManagement.vue";
import ProgramUserManagement from "@/views/ProgramUsersManagement.vue";
import Traits from '@/views/Traits.vue'
import TraitsList from "@/views/TraitsList.vue";
import TraitsFavorites from "@/views/TraitsFavorites.vue";
import TraitsImport from "@/views/TraitsImport.vue";
import TraitsArchived from "@/views/TraitsArchived.vue";
import ProgramSelection from "@/views/ProgramSelection.vue";
import {UserService} from "@/breeding-insight/service/UserService";
import {User} from "@/breeding-insight/model/User";
import {isProgramsPath, processProgramNavigation} from "@/router/guards.ts";


Vue.use(VueRouter);

const layouts = {
  adminSideBar: 'adminSideBar',
  userSideBar: 'userSideBar',
  simple: 'simple',
  noSideBar: 'noSideBar'
}

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Welcome',
      layout: layouts.simple
    },
    component: Index,
    props: (route: Route) => ({
      loginRedirect: route.params.loginRedirect || false,
      sessionExpired: route.params.sessionExpired || false
    })
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
  { path: '/admin',
    name: 'admin',
    redirect: '/admin/program-management' },
  {
    path: '/admin/program-management',
    name: 'admin-program-management',
    meta: {
      title: 'Admin Program Management',
      layout: layouts.userSideBar
    },
    component: AdminProgramManagement
  },
  {
    path: '/admin/user-management',
    name: 'admin-user-management',
    meta: {
      title: 'Admin User Management',
      layout: layouts.userSideBar
    }, 
    component: AdminUserManagement
  },
  {
    path: '/programs/:programId',
    name: 'program',
    redirect: (to: Route) => ({name: 'program-home', params: {programId: to.params.programId}}),
  },
  {
    path: '/programs/:programId/home',
    name: 'program-home',
    meta: {
      title: 'Welcome',
      layout: layouts.userSideBar
    },
    component: Home,
    beforeEnter: processProgramNavigation,
  },
  {
    path: '/programs/:programId/program-management',
    name: 'program-management',
    meta: {
      title: 'Program Management',
      layout: layouts.userSideBar
    },
    component: ProgramManagement,
    redirect: {name: 'program-locations'},
    beforeEnter: processProgramNavigation,
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
        path: 'users',
        name: 'program-users',
        meta: {
          title: 'Program User Management',
          layout: layouts.userSideBar
        },
        component: ProgramUserManagement
      }
    ]
  },
  {
    path: '/programs/:programId/traits',
    name: 'traits',
    meta: {
      title: 'Traits',
      layout: layouts.userSideBar
    },
    component: Traits,
    redirect: {name: 'traits-list'},
    beforeEnter: processProgramNavigation,
    children: [
      {
        path: 'list',
        name: 'traits-list',
        meta: {
          title: 'Trait List',
          layout: layouts.userSideBar
        },
        component: TraitsList
      },
      {
        path: 'favorites',
        name: 'traits-favorites',
        meta: {
          title: 'Favorites',
          layout: layouts.userSideBar
        },
        component: TraitsFavorites
      },
      {
        path: 'import',
        name: 'traits-import',
        meta: {
          title: 'Import Traits',
          layout: layouts.userSideBar
        },
        component: TraitsImport
      },
      {
        path: 'archived',
        name: 'traits-archived',
        meta: {
          title: 'Archived Traits',
          layout: layouts.userSideBar
        },
        component: TraitsArchived
      }
    ]
  },
  {
    path: '/program-selection',
    name: 'program-selection',
    meta: {
      title: 'Select A Program',
      layout: layouts.noSideBar
    },
    component: ProgramSelection
  },
  {
    path: '/401',
    name: 'not-authorized',
    meta: {
      title: 'Login Failed',
      layout: layouts.simple
    },
    component: NotAuthorized
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: Route, from: Route, next: Function) => {

  // TODO: Check if the page is a protected resource, if not, let them through
  // If page is protected, check if they are logged in.
  const loginRedirectUrlCookieName = Vue.prototype.$cookieNames.loginRedirectUrl;

  // Remove the redirect url from the cookie
  Vue.$cookies.remove(loginRedirectUrlCookieName);

  // Check the url for a redirect-login url. Also check if they were redirected because of expired session
  if (store.state.requestedPath){
    // Expires in 1 hr
    Vue.$cookies.set(loginRedirectUrlCookieName, store.state.requestedPath, 60*60);
    // reset our state
    store.commit(REQUESTED_PATH, {path: undefined});
  }

  const firstVisitCookie = Vue.prototype.$cookieNames.firstVisit;
  if (Vue.$cookies.get(firstVisitCookie) === null) {
    // expires after 1 week
    Vue.$cookies.set(firstVisitCookie, 'visited', 604800);
    store.commit(FIRST_VISIT);
  } else {
    store.commit(RETURN_VISIT);
  }

  // Clear path dependent store data for easier state management
  if (!isProgramsPath(to)){
    store.commit(SET_ACTIVE_PROGRAM, undefined);
  }

  if (!store.state.loggedIn) {

    //Get the user info
    UserService.getUserInfo()
    .then((user: User) => {
      store.commit(LOGIN, user);
      if (to.name !== 'home') { next(); }
      else { next({name: 'program-selection'})}
    })
    .catch((error) => {
      // Check if it is a 401
      if (error.response && error.response.status === 401) {
          Vue.$log.info(`Unauthorized login, ${error.response}`);
      } else {
        store.commit(ERROR_STATE, {'loginServerError':true});
      }
      // If logged in fail, send them to the home page
      //TODO: Change this to a route guard if we make our page protections more advanced.
      if (to.name !== 'home' && to.name !== 'not-authorized') {
        //TODO: Show error to login again.
        const targetUrl = `http://${window.location.host}${to.fullPath}`;
        store.commit(REQUESTED_PATH, {path: targetUrl});
        next({name: 'home', replace: true, params: {loginRedirect: true, sessionExpired: false}});
      } else next();
    });
  } else {
    next();
  }
  // Set page title
  document.title = to.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'
});

export default router
