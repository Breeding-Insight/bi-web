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

import { mount, shallowMount } from '@vue/test-utils'
import UserManagement from '@/views/UserManagement.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import localVue from '../index'
import { User } from '@/breeding-insight/model/User'
import { TableRow } from '@/breeding-insight/model/view_models/TableRow'

describe('UserManagement.vue', () => {

  // TODO: Once we have the user management finalized, check the api calls
  // to make sure that what is being sent to the server is correct

  // We don't want to make our api calls
  jest.mock('axios');

  const wrapper = shallowMount(UserManagement, {localVue});

  it('populates rows correctly', () => {
    wrapper.vm.$data.users = [
      new TableRow(true, new User('1', 'Tester1', 'tester1@test.com', ['admin'])),
      new TableRow(true, new User('2', 'Tester2', 'tester2@test.com', ['admin']))
    ]

    expect(wrapper.html()).toContain('Tester1');
    expect(wrapper.html()).toContain('Tester2');

  });

  it('adds row when add is selected', () => {

    const addSpy = jest.spyOn((wrapper.vm as any), 'addUser');

    // Need to input data for this to work
    wrapper.find('input[title="New User Name"]').setValue('test');
    wrapper.find('input[title="New User Email"]').setValue('test@test.com');

    // Click our button
    const addButton = wrapper.find('#addUserBtn').trigger('click');

    // Check our addUser function was called
    expect(addSpy).toHaveBeenCalled();
  });

  it('removes row when delete is selected', () => {
    
    const deleteSpy = jest.spyOn((wrapper.vm as any), 'deleteUser');
    wrapper.find('button[title="Delete User"]').trigger('click');

    // Check our delete function was called
    expect(deleteSpy).toHaveBeenCalled();
    
  });

  it('changes to update form when update is selected and back when canceled', async () => {

    // Check the input fields aren't showing at start
    expect(wrapper.find('input[placeholder="User Name"]').exists()).not.toBeTruthy();
    expect(wrapper.find('input[placeholder="User Email"]').exists()).not.toBeTruthy();
    expect(wrapper.find('input[placeholder="Roles"]').exists()).not.toBeTruthy();
 
    wrapper.find('button[title="Edit User"]').trigger('click');

    await wrapper.vm.$nextTick();

    // Check that our input fields are shown after edit is clicked
    expect(wrapper.find('input[placeholder="User Name"]').exists()).toBeTruthy();
    expect(wrapper.find('input[placeholder="User Email"]').exists()).toBeTruthy();
    expect(wrapper.find('input[placeholder="Roles"]').exists()).toBeTruthy();

    wrapper.find('button[title="Cancel Edit"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Check the input fields aren't showing after cancel
    expect(wrapper.find('input[placeholder="User Name"]').exists()).not.toBeTruthy();
    expect(wrapper.find('input[placeholder="User Email"]').exists()).not.toBeTruthy();
    expect(wrapper.find('input[placeholder="Roles"]').exists()).not.toBeTruthy();

  });

  it('updates changes on confirm edits', async () => {

    const updateSpy = jest.spyOn((wrapper.vm as any), 'updateUser');

    // Enter edit mode
    wrapper.find('button[title="Edit User"]').trigger('click');
    await wrapper.vm.$nextTick();

    // Change one of our values
    wrapper.find('input[placeholder="User Name"]').setValue('newValue');

    // Confirm our edits
    wrapper.find('button[title="Confirm User"]').trigger('click');

    expect(updateSpy).toBeCalled();
  })
})
