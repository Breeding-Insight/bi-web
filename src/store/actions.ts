import {ERROR_STATE, SET_ACTIVE_PROGRAM} from './mutation-types';

export const actions = {
  clearActiveProgram(context: any) {
    context.commit(SET_ACTIVE_PROGRAM, undefined);
  }
}