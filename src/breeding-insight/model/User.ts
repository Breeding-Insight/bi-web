import {Role} from "@/breeding-insight/model/Role";

export class User {
  id?: string;
  name?: string;
  orcid?: string;
  email?: string;
  roleId?: string;
  roleName?: string;

  constructor(id?:string, name?: string, orcid?: string, email?: string, role?: Role) {
    this.id = id;
    this.name = name;
    this.orcid = orcid;
    this.email = email;
    if (role) {
      this.roleId = role.id;
      this.roleName = role.name;
    }

  }

  hasRole(roleName: string){
    return this.roleName === roleName;
  }
}