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

import BaseTable from "@/components/tables/BaseTable.vue";
import localVue, {defaultStore} from "../../index";
import {mount, shallowMount} from "@vue/test-utils";
import {TableRow} from "@/breeding-insight/model/view_models/TableRow";
import {VBreakpoint} from "@/components/VBreakpoint";

describe('Breakpoints emit properly', () => {
  const store = defaultStore;
  const records: TableRow<any>[] = [
    new TableRow(false, {name: 'test'})
  ]
  // Change the viewport to 500px.
  global.innerWidth = 500;
  // Trigger the window resize event.
  global.dispatchEvent(new Event('resize'));

  const wrapper = mount(BaseTable, {localVue, store, propsData: {records}});

  const emitted = wrapper.emitted();

  it('Test starts out set at 1024px', () => {
    expect(global.innerWidth).toEqual(1024);
    expect(emitted['is-mobile']).toBeUndefined();
  });

  it('Is mobile event fires when switching from desktop to mobile', async () => {
    // Change the viewport to 500px.
    global.innerWidth = 500;
    // Trigger the window resize event.
    global.dispatchEvent(new Event('resize'));
    expect(global.innerWidth).toEqual(500);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('mobile')).toHaveLength(1);
  });

  it('Is mobile event fires when switching from mobile to desktop', async () => {
    // Change the viewport to 500px.
    global.innerWidth = 1024;
    // Trigger the window resize event.
    await global.dispatchEvent(new Event('resize'));
    expect(global.innerWidth).toEqual(1024);
    expect(emitted['desktop']).toBeTruthy();
  });

  it('Is mobile event fires when switching from tablet to mobile', () => {});

  it('Is mobile event fires when switching from mobile to tablet', () => {});

});