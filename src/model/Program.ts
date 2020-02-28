export class Program {
  id: string;
  name: string;
  species: string;
  numUsers: string;

  constructor(id:string, name:string, species:string, numUsers:string) {
    this.id = id;
    this.name = name;
    this.species = species;
    this.numUsers = numUsers;
  }
}