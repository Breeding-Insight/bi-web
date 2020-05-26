export class ProgramLocation {
  id?: string;
  programId?: string;
  name?: string;
  numExperiments?: number;

  constructor(id?: string, programId?: string, name?: string, numExperiments?: number) {
    this.id = id;
    this.programId = programId;
    this.name = name;
    this.numExperiments = numExperiments;
  }
}