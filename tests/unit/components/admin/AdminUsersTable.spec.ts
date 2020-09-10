import DaoUtils from "../../test-utils/DaoUtils";
import {mocked} from "ts-jest";
import {SystemRoleDao} from "@/breeding-insight/dao/SystemRoleDao";
import {UserDAO} from "@/breeding-insight/dao/UserDAO";
import localVue, {defaultStore} from "../../index";
import {mount} from "@vue/test-utils";
import AdminUsersTable from "@/components/admin/AdminUsersTable.vue";
import NewDataForm from "@/components/forms/NewDataForm.vue";
import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";
import ExpandableTableRow from "@/components/tables/ExpandableTableRow.vue";
import EditDataRowForm from "@/components/forms/EditDataRowForm.vue";
import {UserService} from "@/breeding-insight/service/UserService";

jest.mock('@/breeding-insight/dao/SystemRoleDao');
jest.mock('@/breeding-insight/dao/UserDAO');
let roles: any[] = [];
let systemUsers: any[] = [];

function setup() {

  const systemUser = {'id':'1', 'name':'Test user', 'email':'testuser@test.com', 'active':'true', 'orcid':'1111-1111-1111-1111',
    'systemRoles': [{'id':'1', 'domain':'admin'}],
    'programRoles': [{'active':'true', 'program':{'id':'1', 'name':'Test Program'}, 'roles':{'id':'1','domain':'member'}}]};
  systemUsers.push(systemUser);
  const systemUsersResponse = DaoUtils.formatBiResponse(systemUsers);
  const userDAO = mocked(UserDAO, true);
  userDAO.getAll.mockResolvedValue(systemUsersResponse);

  roles.push({'id':'1', 'domain':'test role'});
  const rolesResponse = DaoUtils.formatBiResponse(roles);

  const roleDAO = mocked(SystemRoleDao, true);
  roleDAO.getAll.mockResolvedValue(rolesResponse);

}

setup();

afterEach(() => {
  jest.clearAllMocks();
});

describe('validations work properly', () => {
  const store = defaultStore;
  const wrapper = mount(AdminUsersTable, {localVue, store});

  it('shows validation error when new form orcid is empty', async () => {
    let newFormBtn = wrapper.find('button[data-testid="newFormBtn"]');
    expect(newFormBtn.exists()).toBeTruthy();
    await newFormBtn.trigger('click');

    let newForm = wrapper.find(NewDataForm);
    expect(newForm.exists()).toBeTruthy();

    let saveBtn = newForm.find('button[data-testid="save"]');
    expect(saveBtn.exists()).toBeTruthy();
    await saveBtn.trigger('click');

    // Get orcid field
    let orcidWrapper = wrapper.findAll(BaseFieldWrapper).at(2);
    let orcidInput = orcidWrapper.find('input#Orcid');
    expect(orcidInput.exists()).toBeTruthy();
    expect(orcidWrapper.element.classList.contains('field--error')).toBeTruthy()
    await orcidInput.setValue('');
    let error = orcidWrapper.find('span[data-testid="formError"]:not(.is-hidden)');
    expect(error.exists()).toBeTruthy();
    expect(error.text()).toEqual('Orcid is required');
  });

  it ('shows validation error when new form orcid is improper format', async () => {

    let orcidWrapper = wrapper.findAll(BaseFieldWrapper).at(2);
    let orcidInput = orcidWrapper.find('input#Orcid');
    expect(orcidInput.exists()).toBeTruthy();
    await orcidInput.setValue('1234');

    expect(orcidWrapper.element.classList.contains('field--error')).toBeTruthy()
    let error = orcidWrapper.find('span[data-testid="formError"]:not(.is-hidden)');
    expect(error.exists()).toBeTruthy();
    expect(error.text()).toEqual('Orcid must be in orcid format');
  });

  it('does not show validation error when orcid in proper format', async () => {

    let orcidWrapper = wrapper.findAll(BaseFieldWrapper).at(2);
    let orcidInput = orcidWrapper.find('input#Orcid');
    expect(orcidInput.exists()).toBeTruthy();
    await orcidInput.setValue('1234-5678-9101-1121');

    expect(orcidWrapper.element.classList.contains('field--error')).toBeFalsy();

    // close form
    let closeBtn = wrapper.find('button[data-testid="cancel"]');
    expect(closeBtn.exists()).toBeTruthy();
    await closeBtn.trigger('click');
  })

  it('shows validation error when edit form orcid is empty', async () => {

    let row = wrapper.findComponent(ExpandableTableRow);
    expect(row.exists()).toBeTruthy();
    const editBtn = row.find('a[data-testid="edit"]');
    expect(editBtn.exists()).toBeTruthy();
    await editBtn.trigger('click');

    let editForm = wrapper.findComponent(EditDataRowForm);
    expect(editForm.exists()).toBeTruthy();
    let orcidWrapper = editForm.findAll(BaseFieldWrapper).at(2);
    let orcidInput = orcidWrapper.find('input#Orcid');
    expect(orcidInput.exists()).toBeTruthy();
    await orcidInput.setValue('');

    let saveBtn = editForm.find('button[data-testid="save"]');
    expect(saveBtn.exists()).toBeTruthy();
    await saveBtn.trigger('click');

    expect(orcidWrapper.element.classList.contains('field--error')).toBeTruthy();
    let error = orcidWrapper.find('span[data-testid="formError"]:not(.is-hidden)');
    expect(error.exists()).toBeTruthy();
    expect(error.text()).toEqual('Orcid is required');
  });

  it ('shows validation error when edit form orcid is improper format', async () => {

    let editForm = wrapper.findComponent(EditDataRowForm);
    let orcidWrapper = editForm.findAll(BaseFieldWrapper).at(2);
    let orcidInput = orcidWrapper.find('input#Orcid');
    expect(orcidInput.exists()).toBeTruthy();
    await orcidInput.setValue('1234');

    expect(orcidWrapper.element.classList.contains('field--error')).toBeTruthy();
    let error = orcidWrapper.find('span[data-testid="formError"]:not(.is-hidden)');
    expect(error.exists()).toBeTruthy();
    expect(error.text()).toEqual('Orcid must be in orcid format');
  });

  it('does not show validation error when edit form orcid is properly formatted', async () => {

    let editForm = wrapper.findComponent(EditDataRowForm);
    let orcidWrapper = editForm.findAll(BaseFieldWrapper).at(2);
    let orcidInput = orcidWrapper.find('input#Orcid');
    expect(orcidInput.exists()).toBeTruthy();
    await orcidInput.setValue('1234-6789-1012-1234');

    expect(orcidWrapper.element.classList.contains('field--error')).toBeFalsy();
  });
});

describe('new data form works properly', () => {
  const store = defaultStore;
  const wrapper = mount(AdminUsersTable, {localVue, store});

  it('cancels save if orcid is already in use', async () => {

    let newFormBtn = wrapper.find('button[data-testid="newFormBtn"]');
    expect(newFormBtn.exists()).toBeTruthy();
    await newFormBtn.trigger('click');

    let newForm = wrapper.find(NewDataForm);
    expect(newForm.exists()).toBeTruthy();

    let nameInput = newForm.find('input#Name');
    let emailInput = newForm.find('input#Email');
    let orcidInput = newForm.find('input#Orcid');
    expect(nameInput.exists()).toBeTruthy();
    expect(emailInput.exists()).toBeTruthy();
    expect(orcidInput.exists()).toBeTruthy();

    await nameInput.setValue('new test user');
    await emailInput.setValue('newtestuser@tester.com');
    await orcidInput.setValue(systemUsers[0].orcid);

    let saveBtn = newForm.find('button[data-testid="save"]');
    expect(saveBtn.exists()).toBeTruthy();
    await saveBtn.trigger('click');
    await wrapper.vm.$nextTick();

    // make sure the create function was not called
    const createSpy = jest.spyOn(UserService, 'create');
    expect(createSpy).toHaveBeenCalledTimes(0);

    let error = wrapper.emitted('show-error-notification');
    expect(error!.length).toEqual(1);
    let notification = error!.pop();
    expect(notification.length).toEqual(1);
    expect(notification.pop()).toEqual('Orcid is in use by another user.');
  });

  it('closes new data form when user successfully created, but update orcid returns error', async () => {

    let newForm = wrapper.find(NewDataForm);
    expect(newForm.exists()).toBeTruthy();

    let orcidInput = newForm.find('input#Orcid');
    expect(orcidInput.exists()).toBeTruthy();

    await orcidInput.setValue('2222-2222-2222-2222');

    const userDAO = mocked(UserDAO, true);
    userDAO.updateOrcid.mockRejectedValueOnce({error: {response: {status: 409}}});
    userDAO.create.mockResolvedValue(DaoUtils.formatBiResponseSingle(systemUsers[0]));
    let saveBtn = newForm.find('button[data-testid="save"]');
    expect(saveBtn.exists()).toBeTruthy();
    await saveBtn.trigger('click');
    await wrapper.vm.$nextTick();
    // Wait another DOM update. A little hacky, probably should find better way to do this in the future.
    await wrapper.vm.$nextTick();

    newForm = wrapper.find(NewDataForm);
    expect(newForm.exists()).toBeFalsy();
  });
});