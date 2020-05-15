export class ProgramLocation {
  id?: string;
  programId?: string;
  name?: string;
  numExperiments?: string;

  constructor(id?: string, programId?: string, name?: string, numExperiments?: string) {
    this.id = id;
    this.programId = programId;
    this.name = name;
    this.numExperiments = numExperiments;
  }
}