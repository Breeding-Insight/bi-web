import {Route} from "vue-router";
import store from "@/store";
import {ProgramService} from "@/breeding-insight/service/ProgramService";
import {Program} from "@/breeding-insight/model/Program";
import {SET_ACTIVE_PROGRAM} from "@/store/mutation-types";

export function processProgramNavigation(to: Route, from: Route, next: Function) {

  // Navigating to programs path
  if (to.path.startsWith('/programs/')) {
    if (store.state.program == undefined || store.state.program.id != to.params.programId) {
      ProgramService.getOne(to.params['programId'])
        .then((program: Program) => {
          store.commit(SET_ACTIVE_PROGRAM, program);
          next();
        })
        .catch((error) => {
          //TODO: Redirect to internal server page, or not found page
          next({name: 'program-selection'});
        });
    } else { next(); }
  } else { next(); }
}