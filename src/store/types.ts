export interface User {
  id: string;
  name: string;
  roles: string[];
}

export interface Program {
  id: string;
  name: string;
}

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
