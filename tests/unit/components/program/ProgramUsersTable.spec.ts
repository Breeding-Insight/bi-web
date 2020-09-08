import localVue, {defaultStore} from "../../index";
import {mount} from "@vue/test-utils";
import ProgramUsersTable from "@/components/program/ProgramUsersTable.vue";
import ExpandableTableRow from "@/components/tables/ExpandableTableRow.vue";
import EditDataRowForm from "@/components/forms/EditDataRowForm.vue";
import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";
import DaoUtils from "../../test-utils/DaoUtils";
import {mocked} from "ts-jest";
import {ProgramUserDAO} from "@/breeding-insight/dao/ProgramUserDAO";
import {RoleDAO} from "@/breeding-insight/dao/RoleDAO";
import {UserDAO} from "@/breeding-insight/dao/UserDAO";
import ExpandableRowTable from "@/components/tables/ExpandableRowTable.vue";
import NewDataForm from "@/components/forms/NewDataForm.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";

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

    const programUserDAO = mocked(ProgramUserDAO, true);
    programUserDAO.getAll.mockResolvedValue(response);

    roles.push({'id':'1', 'domain':'test role'});
    const rolesResponse = DaoUtils.formatBiResponse(roles);

    const roleDAO = mocked(RoleDAO, true);
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

    const userDAO = mocked(UserDAO, true);
    userDAO.getAll.mockResolvedValue(systemUsersResponse);
}

setup();

describe('Edit data form works properly', () => {
    const store = defaultStore;
    const wrapper = mount(ProgramUsersTable, {localVue, store});

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

        const table = wrapper.findComponent(ExpandableRowTable);
        expect(table.emitted('show-error-notification')).toBeUndefined();
    });

});

describe('New Program User action works properly', () => {
    const store = defaultStore;
    const wrapper = mount(ProgramUsersTable, {localVue, store});

    it('throws error when email and orcid reference different system users', async ()=> {
        let newUserBtn = wrapper.find('button[data-testid="newUserBtn"]');
        expect(newUserBtn.exists()).toBeTruthy();
        await newUserBtn.trigger('click');
        let newUserForm = wrapper.findComponent(NewDataForm);
        let nameInput = newUserForm.find('input#Name');
        expect(nameInput.exists()).toBeTruthy();
        let emailInput = newUserForm.find('input#Email');
        expect(emailInput.exists()).toBeTruthy();
        let orcidInput = newUserForm.find('input#Orcid');
        expect(orcidInput.exists()).toBeTruthy();
        let roleInput = newUserForm.find('select#Role');
        expect(roleInput.exists()).toBeTruthy();
        await roleInput.find('option:last-child').setSelected();
        await roleInput.trigger('input');
        await nameInput.setValue('test');
        await emailInput.setValue(systemUsers[1].email);
        await orcidInput.setValue(systemUsers[2].orcid);

        let saveBtn = newUserForm.find('button[data-testid="save"]');
        await saveBtn.trigger('click');
        await wrapper.vm.$nextTick();

        let error = wrapper.emitted('show-error-notification');
        console.log(error);
        expect(error!.length).toEqual(1);
        let notification = error!.pop();
        expect(notification.length).toEqual(1);
        expect(notification.pop()).toEqual('Email and Orcid match two different users.')
    });

    it('does not overwrite orcid when email matches existing system user', () => {
        //TODO: Spy on createUser service method
    });
})