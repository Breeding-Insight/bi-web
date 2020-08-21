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


  const wrapper = mount(BaseTable, {localVue, store, propsData: {records}});

  it('Mobile event fires', async () => {

    const breakpoint = wrapper.findComponent(VBreakpoint);
    expect(breakpoint.exists()).toBeTruthy();

    await breakpoint.vm.$emit('mobile');
    expect(wrapper.emitted('mobile')).toHaveLength(1);
    const emitted = wrapper.emitted('is-mobile');
    expect(emitted).toHaveLength(1);
    expect(emitted!.pop().pop()).toBeTruthy();
  });

  it('Tablet event fires', async () => {

    const breakpoint = wrapper.findAllComponents(VBreakpoint).at(1);
    expect(breakpoint.exists()).toBeTruthy();
    await breakpoint.vm.$emit('tablet');
    expect(wrapper.emitted('tablet')).toHaveLength(1);
    const emitted = wrapper.emitted('is-mobile');
    expect(emitted).toHaveLength(1);
    expect(emitted!.pop().pop()).toBeFalsy();
  });

  it('Desktop event fires, is-mobile does not switching from tablet to desktop', async () => {
    const breakpoint = wrapper.findAllComponents(VBreakpoint).at(2);
    expect(breakpoint.exists()).toBeTruthy();
    await breakpoint.vm.$emit('desktop');
    expect(wrapper.emitted('desktop')).toHaveLength(1);
    //
    const emitted = wrapper.emitted('is-mobile');
    expect(emitted).toHaveLength(0);
  });
});