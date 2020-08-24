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

// Uses user location management to test

import {ProgramLocation} from "@/breeding-insight/model/ProgramLocation";
import {mocked} from "ts-jest";
import DaoUtils from "../../test-utils/DaoUtils";
import {ProgramLocationDAO} from "@/breeding-insight/dao/ProgramLocationDAO";
import ProgramLocationsTable from "@/components/program/ProgramLocationsTable.vue";
import localVue, {defaultStore} from "../../index";
import {mount, Wrapper} from "@vue/test-utils";
import ExpandableTableRow from "@/components/tables/ExpandableTableRow.vue";
import EditDataRowForm from "@/components/forms/EditDataRowForm.vue";
import PaginationControls from "@/components/tables/PaginationControls.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";
import NewDataForm from "@/components/forms/NewDataForm.vue";

jest.mock('@/breeding-insight/dao/ProgramLocationDAO');
let locations: ProgramLocation[] = [];

function setup() {

  const range = [...Array(200).keys()];
  locations = range.map((i:number) => new ProgramLocation(i.toString(), '1', `Test${i}`));
  const response = DaoUtils.formatBiResponse(locations);

  const programLocationDAO = mocked(ProgramLocationDAO, true);
  programLocationDAO.getAll.mockResolvedValue(response);

}

setup();

describe('Edit data form works properly', () => {
  const store = defaultStore;
  const wrapper = mount(ProgramLocationsTable, {localVue, store});

  it('Displays edit form when edit button is clicked', async() => {

    const row = wrapper.findComponent(ExpandableTableRow);
    expect(row.exists()).toBeTruthy();
    const editBtn = row.find('a[data-testid="edit"]');
    expect(editBtn.exists()).toBeTruthy();
    let editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
    await editBtn.trigger('click');

    editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeTruthy();
  });

  it('Displays input error when form validation occurs', async () => {

    let editForm = wrapper.findComponent(EditDataRowForm);
    const nameInput = editForm.findComponent(BasicInputField);
    const input = nameInput.find('input');
    await input.setValue('');

    let fieldWrapper = editForm.findComponent(BaseFieldWrapper);
    let fieldError = fieldWrapper.element.classList.contains('field--error');
    expect(fieldError).toBeFalsy();

    const submitBtn = editForm.find('button[data-testid="save"]');
    await submitBtn.trigger('click');

    fieldError = fieldWrapper.element.classList.contains('field--error');
    expect(fieldError).toBeTruthy();
  });

  it('Closes edit form when cancel button is clicked', async() => {

    let editForm = wrapper.findComponent(EditDataRowForm);
    const cancelBtn = editForm.find('button[data-testid="cancel"]');
    expect(cancelBtn.exists()).toBeTruthy();
    await cancelBtn.trigger('click');

    editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
  });

});


describe('New data form works properly', () => {
  const store = defaultStore;
  const wrapper = mount(ProgramLocationsTable, {localVue, store});

  it('Input error is displayed appropriately when validation error occurs.', async () => {
    const newBtn = wrapper.find('button[data-testid="newDataForm"]');
    expect(newBtn.exists()).toBeTruthy();
    await newBtn.trigger('click');

    const newDataForm = wrapper.findComponent(NewDataForm);
    expect(newDataForm.exists()).toBeTruthy();

    let fieldWrapper = newDataForm.findComponent(BaseFieldWrapper);
    let fieldError = fieldWrapper.element.classList.contains('field--error');
    expect(fieldError).toBeFalsy();

    const saveBtn = newDataForm.find('button[data-testid="save"]');
    await saveBtn.trigger('click');

    fieldWrapper = newDataForm.findComponent(BaseFieldWrapper);
    fieldError = fieldWrapper.element.classList.contains('field--error');
    expect(fieldError).toBeTruthy();
  });

  it('Emits submit event with edited object on editing save', async () => {
    const newDataForm = wrapper.findComponent(NewDataForm);

    const nameInput = newDataForm.findComponent(BasicInputField);
    const input = nameInput.find('input');
    await input.setValue('test');

    const saveBtn = newDataForm.find('button[data-testid="save"]');
    expect(saveBtn.exists()).toBeTruthy();
    await saveBtn.trigger('click');
    expect(newDataForm.emitted('submit')).toHaveLength(1);
  });

  it('Emits cancel event with edited object on editing cancel', async () => {
    const newDataForm = wrapper.findComponent(NewDataForm);
    const cancelBtn = newDataForm.find('button[data-testid="cancel"]');
    expect(cancelBtn.exists()).toBeTruthy();
    await cancelBtn.trigger('click');
    expect(newDataForm.emitted('cancel')).toHaveLength(1);
  });
});


describe('Pagination works with expandable table', () => {

  const store = defaultStore;
  const wrapper = mount(ProgramLocationsTable, {localVue, store});
  const pagination = wrapper.findComponent(PaginationControls);

  it('Displays only specified number of rows', () => {
    expect(pagination.exists()).toBeTruthy();
    expect(pagination.isVisible()).toBeTruthy();

    const rows = wrapper.findAllComponents(ExpandableTableRow);
    expect(rows.length).toEqual(pagination.props().pagination.pageSize);
  });

  it('Page size selection works when expandable closed', async () => {
    const editForm = wrapper.find(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();

    const numSelect = pagination.find('select#paginationSelect');
    await numSelect.find('option[value="100"]').setSelected();
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAllComponents(ExpandableTableRow);
    expect(rows.length).toEqual(100);
  });

  it('Page selection button works when expandable open', async () => {
    await openEditForm(wrapper);

    const numSelect = pagination.find('select#paginationSelect');
    await numSelect.find('option[value="50"]').setSelected();
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAllComponents(ExpandableTableRow);
    expect(rows.length).toEqual(50);

    const editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Show all selection works when expandable closed', async () => {

    let editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();

    const showAllBtn = wrapper.find('a[data-testid="showAll"]');
    await showAllBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAllComponents(ExpandableTableRow);
    expect(rows.length).toEqual(200);

    // Unselect
    await showAllBtn.trigger('click');
    await wrapper.vm.$nextTick();
  });

  it('Show all selection works when expandable open', async () => {
    await openEditForm(wrapper);

    const showAllBtn = wrapper.find('a[data-testid="showAll"]');
    await showAllBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAllComponents(ExpandableTableRow);
    expect(rows.length).toEqual(200);

    const editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Next page button works when expandable closed', async () => {

    let editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();

    const numSelect = pagination.find('select#paginationSelect');
    await numSelect.find('option[value="50"]').setSelected();
    await wrapper.vm.$nextTick();

    const nextPageBtn = wrapper.find('a[aria-label="Next page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const row = wrapper.findComponent(ExpandableTableRow);
    const firstRowName = row.find('td[name="name"]');
    expect(firstRowName.text()).toEqual('Test50');

  });

  it('Next page button works when expandable open', async () => {
    await openEditForm(wrapper);

    const nextPageBtn = wrapper.find('a[aria-label="Next page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const row = wrapper.findComponent(ExpandableTableRow);
    const firstRowName = row.find('td[name="name"]');
    expect(firstRowName.text()).toEqual('Test100');
  });

  it('Previous page button works when expandable open', async () => {
    await openEditForm(wrapper);

    const nextPageBtn = wrapper.find('a[aria-label="Previous page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const row = wrapper.findComponent(ExpandableTableRow);
    const firstRowName = row.find('td[name="name"]');
    expect(firstRowName.text()).toEqual('Test50');

    const editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Previous page button works when expandable closed', async () => {
    let editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();

    const nextPageBtn = wrapper.find('a[aria-label="Previous page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const row = wrapper.findComponent(ExpandableTableRow);
    const firstRowName = row.find('td[name="name"]');
    expect(firstRowName.text()).toEqual('Test0');
  });
});

async function openEditForm(wrapper: Wrapper<any>) {
  const row = wrapper.findComponent(ExpandableTableRow);
  const editBtn = row.find('a[data-testid="edit"]');
  await editBtn.trigger('click');
  let editForm = wrapper.findComponent(EditDataRowForm);
  expect(editForm.exists()).toBeTruthy();
}