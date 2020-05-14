export class ProgramLocation {
  id?: string;
  programId?: string;
  name?: string;

  constructor(id?: string, programId?: string, name?: string) {
    this.id = id;
    this.programId = programId;
    this.name = name;
  }
}