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

import {mount, Wrapper} from "@vue/test-utils";
import SidePanel from "@/components/tables/SidePanel.vue";
import localVue, {defaultStore} from "../../index";
import TraitsImportTable from "@/components/trait/TraitsImportTable.vue";
import {Trait} from "@/breeding-insight/model/Trait";
import {Method} from "@/breeding-insight/model/Method";
import {Scale} from "@/breeding-insight/model/Scale";
import {ProgramObservationLevel} from "@/breeding-insight/model/ProgramObservationLevel";
import {mocked} from 'ts-jest'
import {TraitUploadDAO} from "@/breeding-insight/dao/TraitUploadDAO";
import SidePanelTableRow from "@/components/tables/SidePanelTableRow.vue";
import DaoUtils from "../../test-utils/DaoUtils";
import PaginationControls from "@/components/tables/PaginationControls.vue";
import EditDataRowForm from "@/components/forms/EditDataRowForm.vue";
import {VBreakpoint} from "@/components/VBreakpoint";
import SidePanelTable from "@/components/tables/SidePanelTable.vue";

jest.mock('@/breeding-insight/dao/TraitUploadDAO');
let traits: Trait[] = [];

function setup() {

  // Mock trait response
  const method = new Method('Test Method', 'Computation', 'A method', '1=1');
  const scale = new Scale('Test Scale', 'Number', undefined, 3, 0, 999);
  const level = new ProgramObservationLevel('Plant');
  const range = [...Array(200).keys()];
  traits = range.map((i:number) => new Trait(i.toString(), `Trait${i}`, level, method, scale));

  const response = DaoUtils.formatBiResponse(traits);

  const traitUploadDAO = mocked(TraitUploadDAO, true);
  traitUploadDAO.getTraitUpload.mockResolvedValue(response);
}

setup();

describe('Details panel works properly', () => {
  const store = defaultStore;
  const wrapper = mount(TraitsImportTable, {localVue, store});

  it('Displays details panel when row is clicked', async () => {

    // Check on row click
    const row = wrapper.findComponent(SidePanelTableRow);
    expect(row.exists()).toBeTruthy();
    await row.trigger('click');

    const sidePanel = wrapper.findComponent(SidePanel);
    expect(sidePanel.exists()).toBeTruthy();
    // Sanity check to see if the trait information can be found
    expect(sidePanel.text()).toContain(traits[0].traitName);
    expect(sidePanel.text()).toContain(traits[0].scale!.dataType);
    expect(sidePanel.text()).toContain(traits[0].method!.methodClass);

    const closeBtn = sidePanel.find('[aria-label="close"]');
    expect(closeBtn.exists()).toBeTruthy();
    await closeBtn.trigger('click');
  });

  it('Displays details panel when Show Details button is clicked', async () => {

    const row = wrapper.findComponent(SidePanelTableRow);
    const showDetailsLink = row.find('a[data-testid="showDetails"]');
    expect(showDetailsLink.exists()).toBeTruthy();

    await showDetailsLink.trigger('click');
    const sidePanel = wrapper.findComponent(SidePanel);
    expect(sidePanel.exists()).toBeTruthy();
    // Sanity check to see if the trait information can be found
    expect(sidePanel.html()).toContain(traits[0].traitName);
    expect(sidePanel.html()).toContain(traits[0].scale!.dataType);
    expect(sidePanel.html()).toContain(traits[0].method!.methodClass);
  });

});

describe('Pagination works with side table', () => {

  const store = defaultStore;
  const wrapper = mount(TraitsImportTable, {localVue, store});
  let pagination: Wrapper<any>;

  it('Displays only specified number of rows', () => {
    pagination = wrapper.findComponent(PaginationControls);
    expect(pagination.exists()).toBeTruthy();
    expect(pagination.isVisible()).toBeTruthy();

    const rows = wrapper.findAllComponents(SidePanelTableRow);
    expect(rows.length).toEqual(pagination.props().pagination.pageSize);
  });

  it('Page size selection works when details closed', async () => {
    const editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();

    const numSelect = pagination.find('select#paginationSelect');
    await numSelect.find('option[value="100"]').setSelected();
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAllComponents(SidePanelTableRow);
    expect(rows.length).toEqual(100);
  });

  it('Page selection button works when details open', async () => {
    await openEditForm(wrapper);

    const numSelect = pagination.find('select#paginationSelect');
    await numSelect.find('option[value="50"]').setSelected();
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAllComponents(SidePanelTableRow);
    expect(rows.length).toEqual(50);

    const editForm = wrapper.findComponent(SidePanel);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Show all selection works when details closed', async () => {

    let editForm = wrapper.findComponent(SidePanel);
    expect(editForm.exists()).toBeFalsy();

    const showAllBtn = wrapper.find('a[data-testid="showAll"]');
    await showAllBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAllComponents(SidePanelTableRow);
    expect(rows.length).toEqual(200);

    // Unselect
    await showAllBtn.trigger('click');
    await wrapper.vm.$nextTick();
  });

  it('Show all selection works when details open', async () => {
    await openEditForm(wrapper);

    const showAllBtn = wrapper.find('a[data-testid="showAll"]');
    await showAllBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAllComponents(SidePanelTableRow);
    expect(rows.length).toEqual(200);

    const editForm = wrapper.findComponent(SidePanel);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Next page button works when details closed', async () => {

    let editForm = wrapper.findComponent(SidePanel);
    expect(editForm.exists()).toBeFalsy();

    const numSelect = pagination.find('select#paginationSelect');
    await numSelect.find('option[value="50"]').setSelected();
    await wrapper.vm.$nextTick();

    const nextPageBtn = wrapper.find('a[aria-label="Next page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const row = wrapper.findComponent(SidePanelTableRow);
    const firstRowName = row.find('td[name="name"]');
    expect(firstRowName.text()).toEqual('Trait50');

  });

  it('Next page button works when details open', async () => {
    await openEditForm(wrapper);

    const nextPageBtn = wrapper.find('a[aria-label="Next page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const row = wrapper.findComponent(SidePanelTableRow);
    const firstRowName = row.find('td[name="name"]');
    expect(firstRowName.text()).toEqual('Trait100');

    const editForm = wrapper.findComponent(SidePanel);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Previous page button works when details open', async () => {
    await openEditForm(wrapper);

    const nextPageBtn = wrapper.find('a[aria-label="Previous page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const row = wrapper.findComponent(SidePanelTableRow);
    const firstRowName = row.find('td[name="name"]');
    expect(firstRowName.text()).toEqual('Trait50');

    const editForm = wrapper.findComponent(SidePanel);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Previous page button works when details closed', async () => {
    let editForm = wrapper.findComponent(SidePanel);
    expect(editForm.exists()).toBeFalsy();

    const nextPageBtn = wrapper.find('a[aria-label="Previous page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const row = wrapper.findComponent(SidePanelTableRow);
    const firstRowName = row.find('td[name="name"]');
    expect(firstRowName.text()).toEqual('Trait0');
  });
});

describe('Column collpase state machine works properly', () => {

  const store = defaultStore;
  const wrapper = mount(TraitsImportTable, {localVue, store});
  let sidePanelTable: Wrapper<any>;
  let row: Wrapper<any>;

  it('Collapses columns when panel is opened and change to mobile', async () => {

    sidePanelTable = wrapper.findComponent(SidePanelTable);
    row = wrapper.findComponent(SidePanelTableRow);
    await row.trigger('click');
    const sidePanel = wrapper.findComponent(SidePanel);
    expect(sidePanel.exists()).toBeTruthy();

    const breakpoint = wrapper.findComponent(VBreakpoint);
    expect(breakpoint.exists()).toBeTruthy();
    await breakpoint.vm.$emit('mobile');

    const emmitted = sidePanelTable.emitted('collapse-columns');
    expect(emmitted).toHaveLength(1);
    emmitted!.pop();
  });

  it('Uncollapses columns when on mobile and panel closed', async () => {

    const sidePanel = wrapper.findComponent(SidePanel);
    const closeBtn = sidePanel.find('[aria-label="close"]');
    await closeBtn.trigger('click');

    const emmitted = sidePanelTable.emitted('uncollapse-columns');
    expect(emmitted).toHaveLength(1);
    emmitted!.pop();
  });

  it('Collapses columns when on mobile and panel opened', async () => {

    await row.trigger('click');
    const sidePanel = wrapper.findComponent(SidePanel);
    expect(sidePanel.exists()).toBeTruthy();

    const emmitted = sidePanelTable.emitted('collapse-columns');
    expect(emmitted).toHaveLength(1);
    emmitted!.pop();
  });

  it('Columns stay collapsed when panel is opened and switch to tablet', async () => {

    const breakpoint = wrapper.findAllComponents(VBreakpoint).at(1);
    expect(breakpoint.exists()).toBeTruthy();
    await breakpoint.vm.$emit('tablet');

    // Columns stay collapsed
    const emmitted = sidePanelTable.emitted('collapse-columns');
    expect(emmitted).toHaveLength(0);
  });

  it('Uncollapses colums when on tablet and panel closed', async () => {

    const sidePanel = wrapper.findComponent(SidePanel);
    const closeBtn = sidePanel.find('[aria-label="close"]');
    await closeBtn.trigger('click');

    const emmitted = sidePanelTable.emitted('uncollapse-columns');
    expect(emmitted).toHaveLength(1);
    emmitted!.pop();
  });

  it('Collapses when on tablet and panel is open', async () => {

    await row.trigger('click');
    const sidePanel = wrapper.findComponent(SidePanel);
    expect(sidePanel.exists()).toBeTruthy();

    const emmitted = sidePanelTable.emitted('collapse-columns');
    expect(emmitted).toHaveLength(1);
    emmitted!.pop();
  });

  it('Uncollapses when panel opened and switch to desktop', async () => {

    const breakpoint = wrapper.findAllComponents(VBreakpoint).at(2);
    expect(breakpoint.exists()).toBeTruthy();
    await breakpoint.vm.$emit('desktop');

    const emmitted = sidePanelTable.emitted('uncollapse-columns');
    expect(emmitted).toHaveLength(1);
    emmitted!.pop();
  });

  it('Stays uncollapsed when panel is closed', async () => {

    const sidePanel = wrapper.findComponent(SidePanel);
    const closeBtn = sidePanel.find('[aria-label="close"]');
    await closeBtn.trigger('click');

    // No events should be called
    let emmitted = sidePanelTable.emitted('uncollapse-columns');
    expect(emmitted).toHaveLength(0);

    emmitted = sidePanelTable.emitted('collapse-columns');
    expect(emmitted).toHaveLength(0);
  });

})

async function openEditForm(wrapper: Wrapper<any>) {
  const row = wrapper.findComponent(SidePanelTableRow);
  const editBtn = row.find('a[data-testid="showDetails"]');
  await editBtn.trigger('click');
  let editForm = wrapper.findComponent(SidePanel);
  expect(editForm.exists()).toBeTruthy();
}