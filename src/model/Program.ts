export class Program {
  id?: string;
  name?: string;
  speciesId?: string;
  numUsers?: string;

  constructor(id?:string, name?:string, speciesId?:string, numUsers?:string) {
    this.id = id;
    this.name = name;
    this.speciesId = speciesId;
    this.numUsers = numUsers;
  }
}