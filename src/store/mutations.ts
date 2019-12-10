import { MutationTree } from 'vuex';
import { User, RootState } from '@/store/types';
import { ERROR_STATE, LOGIN, LOGOUT, REQUESTED_PATH } from '@/store/mutation-types';

export const mutations: MutationTree<RootState> = {
  [LOGIN] (state, user: User) {
    state.apiError = false;
    state.apiUnavailable = false;
    state.loggedIn = true;
    state.user = user;
  },
  [LOGOUT] (state) {
    state.apiError = false;
    state.apiUnavailable = false;
    state.loggedIn = false;
    state.user = undefined;
  },
  [ERROR_STATE] (state, payload: any) {
    state.apiError = payload.apiError;
    state.apiUnavailable = payload.apiUnavailable;
  },
  [REQUESTED_PATH] (state, payload: any) {
    state.requestedPath = payload.path;
  }
};
