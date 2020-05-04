import {Role} from "@/breeding-insight/model/Role";

export class User {
  id?: string;
  name?: string;
  email?: string;
  roleId?: string;

  constructor(id?:string, name?: string, email?: string, roleId?: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.roleId = roleId;
  }
}