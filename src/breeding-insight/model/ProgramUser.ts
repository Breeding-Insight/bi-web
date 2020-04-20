
export class ProgramUser {
  id?: string;
  programId?: string;
  name?: string;
  email?: string;
  roleId?: string;

  constructor(id?: string, name?:string, email?: string, programId?: string, roleId?: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.programId = programId;
    this.roleId = roleId;
  }
  
}