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

import {mount} from '@vue/test-utils';
import localVue from '../../index';
import TableResultCount from '@/components/tables/TableResultCount.vue';
import {TableResultRange} from '@/breeding-insight/model/view_models/TableResultRange';

function render(range: TableResultRange, props: object = {}) {
  return mount(TableResultCount, {
    localVue,
    propsData: {range, recordNoun: 'observation units', recordNounSingular: 'observation unit', ...props}
  });
}

describe('TableResultCount says which rows a table shows.', () => {

  it('Shows the range and total with thousands separators', () => {
    const wrapper = render(new TableResultRange(1, 200, 25218, false));
    expect(wrapper.text()).toEqual('Showing 1–200 of 25,218 observation units');
  });

  it('Shows a single row without a range', () => {
    const wrapper = render(new TableResultRange(1, 1, 1, false));
    expect(wrapper.text()).toEqual('Showing 1 of 1 observation unit');
  });

  it('Shows every row with Show All', () => {
    const wrapper = render(new TableResultRange(1, 2000, 2000, true));
    expect(wrapper.text()).toEqual('Showing all 2,000 observation units');
  });

  it('Shows matches on the page when a column filter narrows a server page', () => {
    const wrapper = render(new TableResultRange(0, 0, 2000, false, 3, 200));
    expect(wrapper.text()).toEqual('Showing 3 matching observation units of the 200 on this page (2,000 in all)');
  });

  it('Uses "results" when the table names no noun', () => {
    const wrapper = mount(TableResultCount, {localVue, propsData: {range: new TableResultRange(1, 5, 5, false)}});
    expect(wrapper.text()).toEqual('Showing 1–5 of 5 results');
  });

  it('Shows nothing when there are no rows', () => {
    const wrapper = render(TableResultRange.EMPTY);
    expect(wrapper.find('.table-result-count').exists()).toBe(false);
  });

  it('Shows nothing while loading', () => {
    const wrapper = render(new TableResultRange(1, 200, 2000, false), {loading: true});
    expect(wrapper.find('.table-result-count').exists()).toBe(false);
  });

});
