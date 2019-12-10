import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { mutations } from './mutations';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
    strict: process.env.NODE_ENV !== 'production',
    state: {
        apiError: false,
        apiUnavailable: false,
        loggedIn: false,
        user: undefined
    },
    mutations,
};

export default new Vuex.Store(store);
