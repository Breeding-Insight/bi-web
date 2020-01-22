import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import UserManagement from '@/views/UserManagement.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import localVue from '../index'

 // Test the notifications are show when custom event is emitted
describe('notifications display', () => {

    // We want to go to the home route to test the emit
    const router = new VueRouter({
        routes: [{
            path: '/usermanagement', 
            component: UserManagement
        }]});
    
    const store = new Vuex.Store({'state': {'loggedIn': true}});

    // Set the route to get our child component
    router.push('usermanagement');

    const wrapper = mount(App, { router, localVue, store});      
    const successMsg = 'Success:Message';
    const errorMsg = 'Error:Message';
    const infoMsg = 'Info:Message';

    it('displays success notification when function is called', async () => {

        // Make sure the notification is not seen before
        expect(wrapper.html()).not.toContain(successMsg);

        // Emit event
        wrapper.find(UserManagement).vm.$emit('show-success-notification', successMsg);     

        // Wait for our page to load
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toContain(successMsg);
        
    });

    it('displays error notification when function is called', async () => {

        // Make sure the notification is not seen before
        expect(wrapper.html()).not.toContain(errorMsg);

        // Emit event
        wrapper.find(UserManagement).vm.$emit('show-error-notification', errorMsg);     

        // Wait for our page to load
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toContain(errorMsg);
        
    });

    it('displays info notification when function is called', async () => {

        // Make sure the notification is not seen before
        expect(wrapper.html()).not.toContain(infoMsg);

        // Emit event
        wrapper.find(UserManagement).vm.$emit('show-info-notification', infoMsg);     

        // Wait for our page to load
        await wrapper.vm.$nextTick();

        expect(wrapper.html()).toContain(infoMsg);
        
    });
})

