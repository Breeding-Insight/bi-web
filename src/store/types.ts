export interface User {
  id: String;
  name: String;
  roles: String[];
}

export interface RootState {
  loggedIn: boolean;
  user?: User;
  apiError: boolean;
  apiUnavailable: boolean;
  requestedPath?: String;
}
