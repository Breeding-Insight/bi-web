export interface User {
  id: string;
  name: string;
  roles: string[];
}

export interface RootState {
  loggedIn: boolean;
  user?: User;
  apiError: boolean;
  apiUnavailable: boolean;
  requestedPath?: string;
}
