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

import { shallowMount } from '@vue/test-utils'
import Index from '@/views/Index.vue'
import localVue from '../index'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import router from '@/router'

// Test the login flow
describe('login failed displays display when appropriate', () => {

  // We want to test a specific route
  const router = new VueRouter({
    routes: [{
      path: '/', 
      component: Index
    }]
  });

  // Set the route to get our child component
  router.push('/?new-login=true');      

  it('displays login failed when they are not logged in', async () => {
      
    // Set up vuex so we can log in
    const store = new Vuex.Store({'state': {'loginFailed': true, 'loginServerError': false}});

    const wrapper = shallowMount(Index, { router, localVue, store});
    
    // Make sure our server error modal is not shown
    expect((wrapper.vm as any).isLoginServerErrorModalActive).toBe(false);
    // Check if the error login modal was shown
    expect((wrapper.vm as any).isFailedLoginModalActive).toBe(true);
  });

  it('displays login server error when there was an error during login', async () => {
      
    // Set up vuex so we can log in
    const store = new Vuex.Store({'state': {'loginFailed': true, 'loginServerError': true}});

    const wrapper = shallowMount(Index, { router, localVue, store});
    
    // Check our login failed modal is not show
    expect((wrapper.vm as any).isFailedLoginModalActive).toBe(false);
    // Check if the error login modal was shown
    expect((wrapper.vm as any).isLoginServerErrorModalActive).toBe(true);
  });

});

// Test login flow
describe('login failed models do not display when not intended', () => {

  // Go to home as if it is not after login event
  router.push('/');

  it('login failed modal does not display when appropriate', () => {
    // Set error state to be login failed error
    const store = new Vuex.Store({'state': {'loginFailed': true, 'loginServerError': false}});

    const wrapper = shallowMount(Index, { router, localVue, store});
        
    // Check our login failed modal is not show
    expect((wrapper.vm as any).isFailedLoginModalActive).toBe(false);
    // Check if the error login modal was shown
    expect((wrapper.vm as any).isLoginServerErrorModalActive).toBe(false);
  });

  it('server error login failed modal does not display when appropriate', () => {

    // Set error state to be login failed error
    const store = new Vuex.Store({'state': {'loginFailed': true, 'loginServerError': true}});

    const wrapper = shallowMount(Index, { router, localVue, store});
        
    // Check our login failed modal is not show
    expect((wrapper.vm as any).isFailedLoginModalActive).toBe(false);
    // Check if the error login modal was shown
    expect((wrapper.vm as any).isLoginServerErrorModalActive).toBe(false);

  });

});