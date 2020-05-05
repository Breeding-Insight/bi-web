import {User} from "@/breeding-insight/model/User";
import {Program} from "@/breeding-insight/model/Program";

export interface RootState {
  loggedIn: boolean;
  user?: User;
  program?: Program;
  apiError: boolean;
  apiUnavailable: boolean;
  loginFailed: boolean;
  loginServerError: boolean;
  requestedPath?: string;
}
