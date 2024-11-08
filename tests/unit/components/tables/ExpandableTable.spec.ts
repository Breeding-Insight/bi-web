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

// Uses program user management to test

import { mocked } from 'ts-jest';
import DaoUtils from '../../test-utils/DaoUtils';
import ProgramUsersTable from '@/components/program/ProgramUsersTable.vue';
import localVue, { defaultStore } from '../../index';
import { mount, Wrapper } from '@vue/test-utils';
import EditDataRowForm from '@/components/forms/EditDataRowForm.vue';
import PaginationControls from '@/components/tables/PaginationControls.vue';
import BaseFieldWrapper from '@/components/forms/BaseFieldWrapper.vue';
import NewDataForm from '@/components/forms/NewDataForm.vue';
import Utils from '../../test-utils/TestingUtils';
import { ProgramUserDAO } from '@/breeding-insight/dao/ProgramUserDAO';
import { RoleDAO } from '@/breeding-insight/dao/RoleDAO';
import { UserDAO } from '@/breeding-insight/dao/UserDAO';
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import BasicSelectField from '@/components/forms/BasicSelectField.vue';

jest.mock('@/breeding-insight/dao/ProgramUserDAO');
jest.mock('@/breeding-insight/dao/RoleDAO');
jest.mock('@/breeding-insight/dao/UserDAO');
let users: any[] = [];
let roles: any[] = [];
let systemUsers: any[] = []

function setup() {

  const range = [...Array(200).keys()];
  range.forEach(i => {
    const user = {
      'user': { 'id': `${i}`, 'name': `Test user ${i}`, 'email': `testuser_${i}@test.com`, 'active': 'true' },
      'roles': [{ 'id': '1', 'domain': 'test role' }],
      'program': { 'id': '1', 'name': 'Test Program' }, 'active': 'true'
    };
    users.push(user);
  });
  const response = DaoUtils.formatBiResponseWithPaging(users, 4, 1, 200, 50);
  const singleResponse = DaoUtils.formatBiResponseSingle({
    'user': { 'id': '1-1', 'name': 'Test user', 'email': 'testuser_new@test.com', 'active': 'true' },
    'roles': [{ 'id': '1', 'domain': 'test role' }],
    'program': { 'id': '1', 'name': 'Test Program' }, 'active': 'true'
  });

  const programUserDAO = mocked(ProgramUserDAO, false);
  programUserDAO.getAll.mockResolvedValue(response);
  programUserDAO.create.mockResolvedValue(singleResponse);

  roles.push({'id':'1', 'domain':'test role'});
  const rolesResponse = DaoUtils.formatBiResponse(roles);

  const roleDAO = mocked(RoleDAO, false);
  roleDAO.getAll.mockResolvedValue(rolesResponse);

  const systemUser = {'id':'1', 'name':'Test user', 'email':'testuser@test.com', 'active':'true',
    'systemRoles': [{'id':'1', 'domain':'System Administrator'}],
    'programRoles': [{'active':'true', 'program':{'id':'1', 'name':'Test Program'}, 'roles':{'id':'1','domain':'Read Only'}}]};
  const systemUser1 = {
    'id':'2', 'name':'Test user 2', 'email':'testuser1@test.com', 'active':'true', 'orcid': '123',
    'systemRoles': [{'id':'1', 'domain':'System Administrator'}],
    'programRoles': [{'active':'true', 'program':{'id':'1', 'name':'Test Program'}, 'roles':{'id':'1','domain':'Read Only'}}]
  };
  const systemUser2 = {
    'id':'2', 'name':'Test user 2', 'email':'testuse2@test.com', 'active':'true', 'orcid': '456',
    'systemRoles': [{'id':'1', 'domain':'System Administrator'}],
    'programRoles': [{'active':'true', 'program':{'id':'1', 'name':'Test Program'}, 'roles':{'id':'1','domain':'Read Only'}}]
  }
  systemUsers.push(systemUser, systemUser1, systemUser2);
  users.forEach(user => {
    systemUsers.push({
      'id':user.id, 'name':user.name, 'email':user.email, 'active':'true', 'orcid': `456-${user.id}`,
      'systemRoles': [{'id':'1', 'domain':'System Administrator'}],
      'programRoles': [{'active':'true', 'program':{'id':'1', 'name':'Test Program'}, 'roles':{'id':'1','domain':'Read Only'}}]
    })
  })
  const systemUsersResponse = DaoUtils.formatBiResponse(systemUsers);

  const userDAO = mocked(UserDAO, false);
  userDAO.getAll.mockResolvedValue(systemUsersResponse);

}

setup();

describe('Edit data form works properly', () => {
  const store = defaultStore;
  const wrapper = mount(ProgramUsersTable, {localVue, store});

  it('Displays edit form when edit button is clicked', async() => {

    const table = wrapper.findComponent(ExpandableTable);
    const row = table.find('tbody tr');
    expect(row.exists()).toBeTruthy();
    const editBtn = row.find('a[data-testid="edit"]');
    expect(editBtn.exists()).toBeTruthy();
    let editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
    await editBtn.trigger('click');

    editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeTruthy();
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
  const wrapper = mount(ProgramUsersTable, {localVue, store});

  it('Input error is displayed appropriately when validation error occurs.', async () => {
    const newBtn = wrapper.find('button[data-testid="newUserBtn"]');
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

    const nameInput = newDataForm.find('#Name');
    await nameInput.setValue('test');
    const emailInput = newDataForm.find('#Email');
    await emailInput.setValue('test_new_user@test.com');
    const roleSelect = newDataForm.findComponent(BasicSelectField);
    await roleSelect.find("select").setValue("1");
    await roleSelect.trigger('change');

    // @ts-ignore
    expect(wrapper.find('#Role').element.value).toBe('1')

    const saveBtn = newDataForm.find('button[data-testid="save"]');
    expect(saveBtn.exists()).toBeTruthy();
    await saveBtn.trigger('click');
    await Utils.pause(1000);
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
  const wrapper = mount(ProgramUsersTable, {localVue, store});
  const pagination = wrapper.findComponent(PaginationControls);

  it('Displays only specified number of rows', () => {
    expect(pagination.exists()).toBeTruthy();
    expect(pagination.isVisible()).toBeTruthy();

    const table = wrapper.findComponent(ExpandableTable);
    const rows = table.findAll('tbody tr');
    expect(rows.length).toEqual(pagination.props().pagination.pageSize);
  });

  it('Page size selection works when expandable closed', async () => {

    const response = DaoUtils.formatBiResponseWithPaging(users, 2, 1, 200, 100);
    const programUserDAO = mocked(ProgramUserDAO, false);
    programUserDAO.getAll.mockResolvedValue(response);

    const editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();

    const numSelect = pagination.find('select#paginationSelect');
    await numSelect.find('option[value="100"]').setSelected();
    await wrapper.vm.$nextTick();

    const table = wrapper.findComponent(ExpandableTable);
    const rows = table.findAll('tbody tr');
    expect(rows.length).toEqual(100);
  });

  it('Page selection button works when expandable open', async () => {

    const response = DaoUtils.formatBiResponseWithPaging(users, 4, 1, 200, 50);
    const programUserDAO = mocked(ProgramUserDAO, false);
    programUserDAO.getAll.mockResolvedValue(response);

    await openEditForm(wrapper);

    const numSelect = pagination.find('select#paginationSelect');
    await numSelect.find('option[value="50"]').setSelected();
    await wrapper.vm.$nextTick();

    const table = wrapper.findComponent(ExpandableTable);
    const rows = table.findAll('tbody tr');
    expect(rows.length).toEqual(50);

    const editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Show all selection works when expandable closed', async () => {

    const response = DaoUtils.formatBiResponseWithPaging(users, 1, 1, 200, 200);
    const programUserDAO = mocked(ProgramUserDAO, false);
    programUserDAO.getAll.mockResolvedValue(response);

    let editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
    const showAllBtn = wrapper.find('button[data-testid="showAll"]');
    await showAllBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const table = wrapper.findComponent(ExpandableTable);
    const rows = table.findAll('tbody tr');
    expect(rows.length).toEqual(200);

    // Unselect
    await showAllBtn.trigger('click');
    await wrapper.vm.$nextTick();
  });

  it('Show all selection works when expandable open', async () => {
    await openEditForm(wrapper);

    const showAllBtn = wrapper.find('button[data-testid="showAll"]');
    await showAllBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const table = wrapper.findComponent(ExpandableTable);
    const rows = table.findAll('tbody tr');
    expect(rows.length).toEqual(200);

    const editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Next page button works when expandable closed', async () => {

    const response = DaoUtils.formatBiResponseWithPaging(users, 4, 2, 200, 50);
    const programUserDAO = mocked(ProgramUserDAO, false);
    programUserDAO.getAll.mockResolvedValue(response);

    let editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();

    const numSelect = pagination.find('select#paginationSelect');
    await numSelect.find('option[value="50"]').setSelected();
    await wrapper.vm.$nextTick();

    const nextPageBtn = wrapper.find('button[aria-label="Next page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const table = wrapper.findComponent(ExpandableTable);
    const row = table.find('tbody tr');
    const firstRowName = row.find('td[data-label="Name"]');
    expect(firstRowName.text()).toEqual('Test user 50');

  });

  it('Next page button works when expandable open', async () => {

    const response = DaoUtils.formatBiResponseWithPaging(users, 4, 3, 200, 50);
    const programUserDAO = mocked(ProgramUserDAO, false);
    programUserDAO.getAll.mockResolvedValue(response);

    await openEditForm(wrapper);

    const nextPageBtn = wrapper.find('button[aria-label="Next page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const table = wrapper.findComponent(ExpandableTable);
    const row = table.find('tbody tr');
    const firstRowName = row.find('td[data-label="Name"]');
    expect(firstRowName.text()).toEqual('Test user 100');

    const editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Previous page button works when expandable open', async () => {

    const response = DaoUtils.formatBiResponseWithPaging(users, 4, 2, 200, 50);
    const programUserDAO = mocked(ProgramUserDAO, false);
    programUserDAO.getAll.mockResolvedValue(response);

    await openEditForm(wrapper);

    const nextPageBtn = wrapper.find('button[aria-label="Previous page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const table = wrapper.findComponent(ExpandableTable);
    const row = table.find('tbody tr');
    const firstRowName = row.find('td[data-label="Name"]');
    expect(firstRowName.text()).toEqual('Test user 50');

    const editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();
  });

  it('Previous page button works when expandable closed', async () => {

    const response = DaoUtils.formatBiResponseWithPaging(users, 4, 1, 200, 50);
    const programUserDAO = mocked(ProgramUserDAO, false);
    programUserDAO.getAll.mockResolvedValue(response);

    let editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeFalsy();

    const nextPageBtn = wrapper.find('button[aria-label="Previous page"');
    await nextPageBtn.trigger('click');
    await wrapper.vm.$nextTick();

    const table = wrapper.findComponent(ExpandableTable);
    const row = table.find('tbody tr');
    const firstRowName = row.find('td[data-label="Name"]');
    expect(firstRowName.text()).toEqual('Test user 0');
  });
});

async function openEditForm(wrapper: Wrapper<any>) {
  const table = wrapper.findComponent(ExpandableTable);
  const row = table.find('tbody tr');
  const editBtn = row.find('a[data-testid="edit"]');
  await editBtn.trigger('click');
  let editForm = wrapper.findComponent(EditDataRowForm);
  expect(editForm.exists()).toBeTruthy();
}
