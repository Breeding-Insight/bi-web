import { createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Buefy from 'buefy'
import router from '@/router/index.ts'

const localVue = createLocalVue();
localVue.use(VueRouter);

// Setup beufy
localVue.use(Buefy); 

// Set our Vuex library
localVue.use(Vuex);

export default localVue;