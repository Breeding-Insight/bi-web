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

import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import AdminUserManagement from '@/views/admin/AdminUserManagement.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import localVue from '../index'

 // Test the notifications are show when custom event is emitted
describe('notifications display', () => {

  // We want to go to the home route to test the emit
  const router = new VueRouter({
    routes: [{
        path: '/usermanagement', 
        component: AdminUserManagement
    }]
  });
    
  const store = new Vuex.Store({
    state: {
      loggedIn: true,
      successNotificationMsg: '',
      successNotificationActive: false,
      errorNotificationActive: false,
      errorNotificationMsg: '',
      infoNotificationActive: false,
      infoNotificationMsg: '',
    },
    mutations: {
      showSuccessNotification(state, msg: string) {
        state.successNotificationMsg = msg;
        state.successNotificationActive = true;
      },
      showErrorNotification(state, msg: string) {
        state.errorNotificationMsg = msg;
        state.errorNotificationActive = true;
      },
      showInfoNotification(state, msg: string) {
        state.infoNotificationMsg = msg;
        state.infoNotificationActive = true;
      }
    }
  });

  // Set the route to get our child component
  router.push('usermanagement');

  const wrapper = mount(App, { router, localVue, store});      
  const successMsg = 'Success:Message';
  const errorMsg = 'Error:Message';
  const infoMsg = 'Info:Message';

  it('displays success notification when function is called', async () => {

    // Make sure the notification is not seen before
    expect(wrapper.html()).not.toContain(successMsg);

    // Emit event
    wrapper.findComponent(AdminUserManagement).vm.$emit('show-success-notification', successMsg);

    // Wait for our page to load
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain(successMsg);
      
  });

  it('displays error notification when function is called', async () => {

    // Make sure the notification is not seen before
    expect(wrapper.html()).not.toContain(errorMsg);

    // Emit event
    wrapper.findComponent(AdminUserManagement).vm.$emit('show-error-notification', errorMsg);

    // Wait for our page to load
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain(errorMsg);
      
  });

  it('displays info notification when function is called', async () => {

    // Make sure the notification is not seen before
    expect(wrapper.html()).not.toContain(infoMsg);

    // Emit event
    wrapper.findComponent(AdminUserManagement).vm.$emit('show-info-notification', infoMsg);

    // Wait for our page to load
    await wrapper.vm.$nextTick();

    expect(wrapper.html()).toContain(infoMsg);
      
  });
})

