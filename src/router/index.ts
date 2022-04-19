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
import BrapiAuthorize from '@/views/BrAPI/BrapiAuthorize.vue'
import BrAPIInfo from '@/views/BrAPI/BrAPIInfo.vue'
import ProgramManagement from '@/views/program/ProgramManagement.vue'
import TrialsAndStudies from "@/views/trials-and-studies/TrialsAndStudies.vue";
import Trials from "@/views/trials-and-studies/Trials.vue";
import StudiesList from "@/views/trials-and-studies/StudiesList.vue";
import ObservationsList from '@/views/observations/ObservationsList.vue';
import AdminProgramManagement from '@/views/admin/AdminProgramManagement.vue'
import AdminUserManagement from '@/views/admin/AdminUserManagement.vue'
import BrAPIImporter from '@/views/import/BrAPIImporter.vue'
import GermplasmTable from '@/views/germplasm/GermplasmTable.vue';
import store from '@/store/index.ts';
import {
  LOGIN,
  LOGOUT,
  REQUESTED_PATH,
  ERROR_STATE,
  SET_ACTIVE_PROGRAM,
  FIRST_VISIT,
  RETURN_VISIT,
  DEACTIVATE_ALL_NOTIFICATIONS,
} from '@/store/mutation-types';
import ProgramLocationsManagement from "@/views/program/ProgramLocationsManagement.vue";
import ProgramUserManagement from "@/views/program/ProgramUsersManagement.vue";
import ProgramSelection from "@/views/program/ProgramSelection.vue";
import {UserService} from "@/breeding-insight/service/UserService";
import {User} from "@/breeding-insight/model/User";
import {isProgramsPath, processProgramNavigation, signupRequireAccountToken} from "@/router/guards.ts";
import AccountSignUp from "@/views/account/AccountSignUp.vue";
import AccountCreationFailure from "@/views/account/AccountCreationFailure.vue"
import AccountCreationSuccess from "@/views/account/AccountCreationSuccess.vue"
import {defineAbilityFor} from "@/config/ability";
import ImportFile from "@/views/import/ImportFile.vue";
import ImportOntology from "@/views/import/ImportOntology.vue";
import ImportGermplasm from "@/views/import/ImportGermplasm.vue";
import Ontology from "@/views/ontology/Ontology.vue";
import OntologyActiveTable from "@/components/ontology/OntologyActiveTable.vue";
import OntologyArchivedTable from "@/components/ontology/OntologyArchivedTable.vue";
import PageNotFound from "@/views/PageNotFound.vue";
import Germplasm from "@/views/germplasm/Germplasm.vue";
import GermplasmLists from "@/views/germplasm/GermplasmLists.vue";
import GermplasmDetails from "@/views/germplasm/GermplasmDetails.vue";
import ProgramConfiguration from "@/views/program/ProgramConfiguration.vue";
import JobManagement from '@/views/program/JobManagement.vue';

Vue.use(VueRouter);

const layouts = {
  adminSideBar: 'adminSideBar',
  userSideBar: 'userSideBar',
  simple: 'simple',
  noSideBar: 'noSideBar',
  infoSideBar: 'infoSideBar',
  baseSideBar: 'baseSideBar'
}

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Welcome',
      layout: layouts.infoSideBar
    },
    component: Index,
    props: (route: Route) => ({
      loginRedirect: route.params.loginRedirect || false,
      sessionExpired: route.params.sessionExpired || false,
      loginError: route.query.loginError || false
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
    path: '/programs/:programId/study/:studyId/observations',
    name: 'observations',
    component: ObservationsList,
    meta: {
      title: 'Observations',
      layout: layouts.userSideBar
    },
    beforeEnter: processProgramNavigation
  },
  {
    path: '/programs/:programId/trial/:trialId/studies',
    name: 'studies',
    meta: {
      title: 'Studies',
      layout: layouts.userSideBar
    },
    component: StudiesList
  },
  {
    path: '/programs/:programId/trials-studies',
    name: 'trials-studies',
    meta: {
      title: 'Trials and Studies',
      layout: layouts.userSideBar
    },
    component: TrialsAndStudies,
    redirect: {name: 'trials-list'},
    beforeEnter: processProgramNavigation,
    children: [
     {
        path: 'studies',
        name: 'studies-list',
        meta: {
          title: 'Studies',
          layout: layouts.userSideBar
        },
        component: StudiesList
      },
      {
        path: 'trials',
        name: 'trials-list',
        meta: {
          title: 'Trials',
          layout: layouts.userSideBar
        },
        component: Trials
      }
    ]
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
      },
      {
        path: 'configure',
        name: 'program-configuration',
        meta: {
          title: 'Program Configuration',
          layout: layouts.userSideBar
        },
        component: ProgramConfiguration
      }
    ]
  },
  {
    path: '/programs/:programId/ontology',
    name: 'ontology',
    meta: {
      title: 'Ontology',
      layout: layouts.userSideBar
    },
    component: Ontology,
    redirect: {name: 'active-terms'},
    beforeEnter: processProgramNavigation,
    children: [
      {
        path: 'archived-terms',
        name: 'archived-terms',
        meta: {
          title: 'Archived Terms',
          layout: layouts.userSideBar
        },
        component: OntologyArchivedTable
      },
      {
        path: 'active-terms',
        name: 'active-terms',
        meta: {
          title: 'Active Terms',
          layout: layouts.userSideBar
        },
        component: OntologyActiveTable
      }
    ]
  },
  {
    path: '/programs/:programId/germplasm',
    name: 'germplasm',
    meta: {
      title: 'Germplasm',
      layout: layouts.userSideBar
    },
    component: Germplasm,
    redirect: {name: 'germplasm-all'},
    beforeEnter: processProgramNavigation,
    children: [
      {
        path: 'germplasm-all',
        name: 'germplasm-all',
        meta: {
          title: 'All Germplasm',
          layout: layouts.userSideBar
        },
        component: GermplasmTable
      },
      {
        path: 'germplasm-lists',
        name: 'germplasm-lists',
        meta: {
          title: 'Germplasm Lists',
          layout: layouts.userSideBar
        },
        component: GermplasmLists
      }
    ]
  },
  {
    path: '/programs/:programId/germplasm/:germplasmId',
    name: 'germplasm-details',
    component: GermplasmDetails,
    meta: {
      title: 'Germplasm Details',
      layout: layouts.userSideBar
    },
    beforeEnter: processProgramNavigation
  },
  {
    path: '/programs/:programId/import',
    name: 'import',
    meta: {
      title: 'File Import',
      layout: layouts.userSideBar
    },
    component: ImportFile,
    redirect: {name: 'germplasm-import'},
    beforeEnter: processProgramNavigation,
    children: [
      {
        path: 'ontology',
        name: 'import-ontology',
        meta: {
          title: 'Ontology',
          layout: layouts.userSideBar
        },
        component: ImportOntology
      },
      {
        path: 'germplasm',
        name: 'germplasm-import',
        meta: {
          title: 'Germplasm',
          layout: layouts.userSideBar
        },
        component: ImportGermplasm
      },
      {
        path: 'brapi-import',
        name: 'brapi-import',
        meta: {
          title: 'BrAPI Import',
          layout: layouts.userSideBar
        },
        component: BrAPIImporter
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
  },
  {
    path: '/programs/:programId/brapi',
    name: 'brapi-info',
    meta: {
      title: 'BrAPI Information',
      layout: layouts.userSideBar
    },
    component: BrAPIInfo,
    beforeEnter: processProgramNavigation
  },
  {
    path: '/programs/:programId/jobs',
    name: 'job-management',
    meta: {
      title: 'Job Management',
      layout: layouts.userSideBar
    },
    component: JobManagement,
    beforeEnter: processProgramNavigation
  },
  {
    path: '/programs/:programId/brapi/authorize',
    name: 'brapi-authorize',
    meta: {
      title: 'BrAPI Authorize',
      layout: layouts.noSideBar
    },
    component: BrapiAuthorize,
    props: (route: Route) => ({
      applicationName: route.query.display_name,
      returnUrl: route.query.return_url
    }),
    beforeEnter: processProgramNavigation
  },
  {
    path: '/signup',
    name: 'signup',
    meta: {
      title: 'Activate Account',
      layout: layouts.noSideBar
    },
    component: AccountSignUp,
    props: (route: Route) => ({
      accountToken: route.query['account-token']
    }),
    beforeEnter: signupRequireAccountToken
  },
  {
    path: '/account-error',
    name: 'account-error',
    meta: {
      title: 'Account Activation Error',
      layout: layouts.noSideBar
    },
    component: AccountCreationFailure,
    props: (route: Route) => ({
      error: route.query.error
    }),
  },
  {
    path: '/account-success',
    name: 'account-success',
    meta: {
      title: 'Account Activation Success',
      layout: layouts.noSideBar
    },
    component: AccountCreationSuccess
  },
  {
    path: '*',
    name: 'page-does-not-exist',
    meta: {
      title: 'Page Does Not Exist',
      layout: layouts.simple
    },
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: Route, from: Route, next: Function) => {
  store.commit(DEACTIVATE_ALL_NOTIFICATIONS);

  // TODO: Check if the page is a protected resource, if not, let them through
  // If page is protected, check if they are logged in.
  const loginRedirectUrlCookieName = Vue.prototype.$cookieNames.loginRedirectUrl;

  // Check if the login redirect is valid
  if (Vue.$cookies.isKey(loginRedirectUrlCookieName) && to.name == 'page-does-not-exist') {
    next({name: 'home', replace: true, params: {loginRedirect: false, sessionExpired: false}});
  }

  // Remove the redirect url from the cookie
  Vue.$cookies.remove(loginRedirectUrlCookieName);
  Vue.$cookies.remove(Vue.prototype.$cookieNames.accountToken);

  // Check the url for a redirect-login url. Also check if they were redirected because of expired session
  if (store.state.requestedPath && to.params.loginRedirect) {
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

  const unauthUsersOnly: string[] = ['home', 'signup'];
  const unprotected: string[] = ['home', 'not-authorized', 'signup', 'account-error', 'account-success'];

  // Pages only for not logged in users
  if (!store.state.loggedIn) {

    //Get the user info
    UserService.getUserInfo()
    .then((user: User) => {
      store.commit(LOGIN, user);
      const { rules } = defineAbilityFor(store.state.user, store.state.program);
      Vue.prototype.$ability.update(rules);
      if (!unauthUsersOnly.includes(to.name!)) { next(); }
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
      if (!unprotected.includes(to.name!)) {
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
