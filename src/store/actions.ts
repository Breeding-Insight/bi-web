import {ERROR_STATE, SET_ACTIVE_PROGRAM} from './mutation-types';

export const actions = {
  // Example: Clears our login failed state after we have notified user
  clearLoginFailed(context: any) {
    context.commit(ERROR_STATE, {'loginFailed': false, 'loginServerError': false});
  },
  clearActiveProgram(context: any) {
    context.commit(SET_ACTIVE_PROGRAM, undefined);
  }
}