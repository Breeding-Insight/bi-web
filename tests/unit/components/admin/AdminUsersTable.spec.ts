import DaoUtils from "../../test-utils/DaoUtils";
import { mocked } from 'ts-jest/utils'
import {SystemRoleDao} from "@/breeding-insight/dao/SystemRoleDao";
import {UserDAO} from "@/breeding-insight/dao/UserDAO";
import localVue, {defaultStore} from "../../index";
import {mount} from "@vue/test-utils";
import AdminUsersTable from "@/components/admin/AdminUsersTable.vue";
import NewDataForm from "@/components/forms/NewDataForm.vue";
import Utils from '../../test-utils/TestingUtils';

// jest.mock('@/breeding-insight/dao/SystemRoleDao');
// jest.mock('@/breeding-insight/dao/UserDAO');
// let roles: any[] = [];
// let systemUsers: any[] = [];
function setup() {

  // const systemUser = {'id':'1', 'name':'Test user', 'email':'testuser@test.com', 'active':'true', 'orcid':'1111-1111-1111-1111',
  //   'systemRoles': [{'id':'1', 'domain':'admin'}],
  //   'programRoles': [{'active':'true', 'program':{'id':'1', 'name':'Test Program'}, 'roles':{'id':'1','domain':'member'}}]};
  // systemUsers.push(systemUser);
  // const systemUsersResponse = DaoUtils.formatBiResponse(systemUsers);
  // const userDAO = mocked(UserDAO, true);
  // userDAO.getAll.mockResolvedValue(systemUsersResponse);
  //
  // roles.push({'id':'1', 'domain':'test role'});
  // const rolesResponse = DaoUtils.formatBiResponse(roles);
  //
  // const roleDAO = mocked(SystemRoleDao, true);
  // roleDAO.getAll.mockResolvedValue(rolesResponse);

}

setup();

afterEach(() => {
  //jest.clearAllMocks();
});

describe('new data form works properly', () => {
  //const store = defaultStore;
 // const wrapper = mount(AdminUsersTable, {localVue, store});

  it('closes new data form when user successfully created', async () => {
      // let newFormBtn = wrapper.find('button[data-testid="newFormBtn"]');
      // expect(newFormBtn.exists()).toBeTruthy();
      // await newFormBtn.trigger('click');
      //
      // let newForm = wrapper.findComponent(NewDataForm);
      // expect(newForm.exists()).toBeTruthy();
      //
      // let nameInput = newForm.find('input#Name');
      // let emailInput = newForm.find('input#Email');
      // expect(nameInput.exists()).toBeTruthy();
      // expect(emailInput.exists()).toBeTruthy();
      //
      // await nameInput.setValue('new test user');
      // await emailInput.setValue('newtestuser@tester.com');

      // const userDAO = mocked(UserDAO, true);
      // userDAO.create.mockResolvedValue(DaoUtils.formatBiResponseSingle(systemUsers[0]));
      // let saveBtn = newForm.find('button[data-testid="save"]');
      // expect(saveBtn.exists()).toBeTruthy();
      // await saveBtn.trigger('click');
      //
      //await Utils.pause(500);
      // await wrapper.vm.$nextTick();
      // // Wait another DOM update. A little hacky, probably should find better way to do this in the future.
      // await wrapper.vm.$nextTick();
      //
      // newForm = wrapper.findComponent(NewDataForm);
      // expect(newForm.exists()).toBeFalsy();

  });
});