export class Location {
  id: string;
  name: string;
  experiments: string;

  constructor(id:string, name: string, experiments: string) {
    this.id = id;
    this.name = name;
    this.experiments = experiments; // for now even though it won't exist here
  }
}