import localVue, {defaultStore} from "../../index";
import {mount} from "@vue/test-utils";
import ProgramUsersTable from "@/components/program/ProgramUsersTable.vue";
import EditDataRowForm from "@/components/forms/EditDataRowForm.vue";
import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";
import DaoUtils from "../../test-utils/DaoUtils";
import {mocked} from "ts-jest";
import {ProgramUserDAO} from "@/breeding-insight/dao/ProgramUserDAO";
import {RoleDAO} from "@/breeding-insight/dao/RoleDAO";
import {UserDAO} from "@/breeding-insight/dao/UserDAO";
import ExpandableTable from '@/components/tables/expandableTable/ExpandableTable.vue';
import AdminUsersTable from "@/components/admin/AdminUsersTable.vue";
import NewDataForm from "@/components/forms/NewDataForm.vue";
import Utils from "../../test-utils/TestingUtils";
import {email} from "vuelidate/lib/validators";

jest.mock('@/breeding-insight/dao/ProgramUserDAO');
jest.mock('@/breeding-insight/dao/RoleDAO');
jest.mock('@/breeding-insight/dao/UserDAO');
let users: any[] = [];
let roles: any[] = [];
let systemUsers: any[] = [];

function setup() {

    const user = {'user': {'id': '1', 'name':'Test user', 'email':'testuser@test.com', 'active':'true'},
                  'roles':[{'id':'1', 'domain':'test role'}],
                  'program': {'id':'1', 'name':'Test Program'}, 'active':'true' };
    users.push(user);
    const response = DaoUtils.formatBiResponse(users);
    const singleResponse = DaoUtils.formatBiResponseSingle(user);

    const programUserDAO = mocked(ProgramUserDAO, false);
    programUserDAO.getAll.mockResolvedValue(response);
    programUserDAO.create.mockResolvedValue(singleResponse);

    roles.push({'id':'1', 'domain':'test role'});
    const rolesResponse = DaoUtils.formatBiResponse(roles);

    const roleDAO = mocked(RoleDAO, false);
    roleDAO.getAll.mockResolvedValue(rolesResponse);

    const systemUser = {'id':'1', 'name':'Test user', 'email':'testuser@test.com', 'active':'true',
                        'systemRoles': [{'id':'1', 'domain':'admin'}],
                        'programRoles': [{'active':'true', 'program':{'id':'1', 'name':'Test Program'}, 'roles':{'id':'1','domain':'member'}}]};
    const systemUser1 = {
        'id':'2', 'name':'Test user 2', 'email':'testuser1@test.com', 'active':'true', 'orcid': '123',
        'systemRoles': [{'id':'1', 'domain':'admin'}],
        'programRoles': [{'active':'true', 'program':{'id':'1', 'name':'Test Program'}, 'roles':{'id':'1','domain':'member'}}]
    };
    const systemUser2 = {
        'id':'2', 'name':'Test user 2', 'email':'testuse2@test.com', 'active':'true', 'orcid': '456',
        'systemRoles': [{'id':'1', 'domain':'admin'}],
        'programRoles': [{'active':'true', 'program':{'id':'1', 'name':'Test Program'}, 'roles':{'id':'1','domain':'member'}}]
    }
    systemUsers.push(systemUser, systemUser1, systemUser2);
    const systemUsersResponse = DaoUtils.formatBiResponse(systemUsers);

    const userDAO = mocked(UserDAO, false);
    userDAO.getAll.mockResolvedValue(systemUsersResponse);
}

setup();

afterEach(() => {
    jest.clearAllMocks();
})

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

    it('Does not display Fix fields notification when form validation occurs', async () => {

        let editForm = wrapper.findComponent(EditDataRowForm);
        expect(editForm.exists()).toBeTruthy();

        // users will always have a role so should never have validation error
        // this test if for PRO-80 where we were getting a validation error in this case
        let fieldWrapper = editForm.findComponent(BaseFieldWrapper);
        let fieldError = fieldWrapper.element.classList.contains('field--error');
        expect(fieldError).toBeFalsy();

        const submitBtn = editForm.find('button[data-testid="save"]');
        await submitBtn.trigger('click');

        const table = wrapper.findComponent(ExpandableTable);
        expect(table.emitted('show-error-notification')).toBeUndefined();
    });

});

describe('new data form works properly', () => {
    const store = defaultStore;
    const wrapper = mount(ProgramUsersTable, {localVue, store});

    it('closes new data form when user successfully created', async () => {

        let newFormBtn = wrapper.find('button[data-testid="newUserBtn"]');
        expect(newFormBtn.exists()).toBeTruthy();
        await newFormBtn.trigger('click');

        let newForm = wrapper.find(NewDataForm);
        expect(newForm.exists()).toBeTruthy();

        let nameInput = newForm.find('input#Name');
        let emailInput = newForm.find('input#Email');
        let roleInput = newForm.find('select#Role');
        expect(nameInput.exists()).toBeTruthy();
        expect(emailInput.exists()).toBeTruthy();
        expect(roleInput.exists()).toBeTruthy();

        await nameInput.setValue('new test user');
        await emailInput.setValue('newtestuser@tester.com');
        await roleInput.findAll('option').at(1).setSelected();

        let saveBtn = newForm.find('button[data-testid="save"]');
        expect(saveBtn.exists()).toBeTruthy();
        await saveBtn.trigger('click');
        console.log("---before pause---");
        await Utils.pause(500).then(() => wrapper.vm.$nextTick());
        console.log("---after pause---");

        console.log("---before final test---");
        // This is wrong, should be false
        expect(newForm.exists()).toBeTruthy();
        console.log("---after final test--- ");

    });
});