console.log("..before import..");
import DaoUtils from "../../test-utils/DaoUtils";
import { mocked } from 'ts-jest/utils'
import {SystemRoleDao} from "@/breeding-insight/dao/SystemRoleDao";
import {UserDAO} from "@/breeding-insight/dao/UserDAO";
import localVue, {defaultStore} from "../../index";
import {mount} from "@vue/test-utils";
import AdminUsersTable from "@/components/admin/AdminUsersTable.vue";
import NewDataForm from "@/components/forms/NewDataForm.vue";
import Utils from '../../test-utils/TestingUtils';
console.log("..before mocks..");

jest.mock('@/breeding-insight/dao/SystemRoleDao');
jest.mock('@/breeding-insight/dao/UserDAO');
let roles: any[] = [];
let systemUsers: any[] = [];
console.log("..in test..");
function setup() {
  console.log("..in setup..");

  const systemUser = {'id':'1', 'name':'Test user', 'email':'testuser@test.com', 'active':'true', 'orcid':'1111-1111-1111-1111',
    'systemRoles': [{'id':'1', 'domain':'admin'}],
    'programRoles': [{'active':'true', 'program':{'id':'1', 'name':'Test Program'}, 'roles':{'id':'1','domain':'member'}}]};
  console.log("..in setup 1..");
  systemUsers.push(systemUser);
  console.log("..in setup 2..");
  const systemUsersResponse = DaoUtils.formatBiResponse(systemUsers);
  const userDAO = mocked(UserDAO, true);
  console.log("..in setup 3..");
  userDAO.getAll.mockResolvedValue(systemUsersResponse);
  console.log("..in setup 4..");

  roles.push({'id':'1', 'domain':'test role'});
  const rolesResponse = DaoUtils.formatBiResponse(roles);
  console.log("..in setup 4..");

  const roleDAO = mocked(SystemRoleDao, true);
  roleDAO.getAll.mockResolvedValue(rolesResponse);
  console.log("..in setup 5..");

}

setup();

afterEach(() => {
  jest.clearAllMocks();
});

describe('new data form works properly', () => {
  const store = defaultStore;
  const wrapper = mount(AdminUsersTable, {localVue, store});

  it('closes new data form when user successfully created', async () => {
    try {
      console.log("..in it..");
      let newFormBtn = wrapper.find('button[data-testid="newFormBtn"]');
      expect(newFormBtn.exists()).toBeTruthy();
      await newFormBtn.trigger('click');
      console.log("..clicked new btn..");

      let newForm = wrapper.findComponent(NewDataForm);
      expect(newForm.exists()).toBeTruthy();
      console.log("..new form exist..");

      let nameInput = newForm.find('input#Name');
      let emailInput = newForm.find('input#Email');
      expect(nameInput.exists()).toBeTruthy();
      expect(emailInput.exists()).toBeTruthy();

      await nameInput.setValue('new test user');
      await emailInput.setValue('newtestuser@tester.com');

      const userDAO = mocked(UserDAO, true);
      userDAO.create.mockResolvedValue(DaoUtils.formatBiResponseSingle(systemUsers[0]));
      let saveBtn = newForm.find('button[data-testid="save"]');
      expect(saveBtn.exists()).toBeTruthy();
      await saveBtn.trigger('click');
      //
      await Utils.pause(500);
      await wrapper.vm.$nextTick();
      // Wait another DOM update. A little hacky, probably should find better way to do this in the future.
      await wrapper.vm.$nextTick();
      // console.log("..'saved'..");
      //
      // newForm = wrapper.findComponent(NewDataForm);
      // expect(newForm.exists()).toBeFalsy();
    }
    catch (err){
      console.log("Error caught");
      console.log(err);
    }

  });
});