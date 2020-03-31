import {Role} from '@/breeding-insight/model/Role'

export class ProgramUser {
  id?: string;
  name?: string;
  email?: string;
  role?: Role;

  constructor(id?: string, name?:string, email?: string, role?: Role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}