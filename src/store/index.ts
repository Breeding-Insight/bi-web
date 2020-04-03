import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { mutations } from './mutations';
import {actions} from './actions';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV !== 'production',
  state: {
    apiError: false,
    apiUnavailable: false,
    loginFailed: false,
    loginServerError: false,
    loggedIn: false,
    requestedPath: undefined,
    user: undefined,
    program: undefined
  },
  mutations,
  actions
};

export default new Vuex.Store(store);
