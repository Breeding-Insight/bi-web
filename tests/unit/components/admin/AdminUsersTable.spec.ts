import DaoUtils from "../../test-utils/DaoUtils";
import {mocked} from "ts-jest";
import {SystemRoleDao} from "@/breeding-insight/dao/SystemRoleDao";
import {UserDAO} from "@/breeding-insight/dao/UserDAO";
import localVue, {defaultStore} from "../../index";
import {mount} from "@vue/test-utils";
import AdminUsersTable from "@/components/admin/AdminUsersTable.vue";
import NewDataForm from "@/components/forms/NewDataForm.vue";
import Utils from '../../test-utils/TestingUtils';
import { User } from '@/breeding-insight/model/User';
import { Role } from '@/breeding-insight/model/Role';

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

describe('new data form works properly', () => {
  const store = defaultStore;
  const wrapper = mount(AdminUsersTable, {localVue, store});

  it('closes new data form when user successfully created', async () => {

    let newFormBtn = wrapper.find('button[data-testid="newFormBtn"]');
    expect(newFormBtn.exists()).toBeTruthy();
    await newFormBtn.trigger('click');

    let newForm = wrapper.find(NewDataForm);
    expect(newForm.exists()).toBeTruthy();

    let nameInput = newForm.find('input#Name');
    let emailInput = newForm.find('input#Email');
    expect(nameInput.exists()).toBeTruthy();
    expect(emailInput.exists()).toBeTruthy();

    await nameInput.setValue('new test user');
    await emailInput.setValue('newtestuser@tester.com');

    const userDAO = mocked(UserDAO, true);
    userDAO.create.mockResolvedValue(DaoUtils.formatBiResponseSingle(systemUsers[0]));
    try {
      console.log("attempting to call userDAO.create...")
      // @ts-ignore
      let mockedResponse = userDAO.create(new User(undefined, undefined, undefined, undefined, undefined, undefined), Role[0]);
      console.log(JSON.stringify(mockedResponse));
    } catch (e) {
      console.error("error creating user via mock", e);
    }
    console.log("searching for save button");
    let saveBtn = newForm.find('button[data-testid="save"]');
    console.log("verifying save button exists");
    expect(saveBtn.exists()).toBeTruthy();
    console.log("clicking save button");
    await saveBtn.trigger('click');
    console.log("waiting 500ms");
    await Utils.pause(500);
    console.log("next tick (1)")
    await wrapper.vm.$nextTick();
    // Wait another DOM update. A little hacky, probably should find better way to do this in the future.
    console.log("next tick (2)")
    await wrapper.vm.$nextTick();

    console.log("search for NewDataForm after save")
    newForm = wrapper.findComponent(NewDataForm);
    console.log("verify it's no longer there")
    expect(newForm.exists()).toBeFalsy();
  });
});
