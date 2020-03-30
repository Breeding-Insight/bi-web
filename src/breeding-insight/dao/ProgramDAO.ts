import {Program} from "@/breeding-insight/model/Program";

export class ProgramDAO {

  static programs: Program[] = [
    new Program('1', 'Lance Grape Program', '1', '5'),
    new Program('2', 'Phil Sweet Potato Program', '2', '2'),
    new Program('3', 'Some Other Program', '3', '10')
  ];

  static create(program: Program): Promise<Program> {

    return new Promise<Program>((resolve, reject) => {

      if (program === undefined){
        reject();
      } else {
        this.programs.push(program);
        resolve(program);
      }
    });
  }

  static update(id: string, program: Program): Promise<Program> {


    return new Promise<Program>((resolve, reject) => {
      const recordIndex: number = this.programs.findIndex(program => program.id === id);

      if (recordIndex === undefined){
        reject();
      } else {
        this.programs[recordIndex] = program;
        resolve(program);
      }

    });
  }

  static archive(id: string): Promise<Program> {

    return new Promise<Program>((resolve, reject) => {
      if (id === undefined){
        reject();
      } else {
        const deleteIndex: number = this.programs.findIndex(program => program.id === id);
        const deletedProgram: Program = this.programs[deleteIndex];
        this.programs.splice(deleteIndex, 1);
        resolve(deletedProgram);
      }
    });
  }

  static getAll(): Promise<Program[]> {

    return new Promise<Program[]>((resolve, reject) => {

      resolve(this.programs);

      if (this.programs.length < 0){
        reject();
      }
    });
  }

  static getOne(id: string): Promise<Program> {
    alert('get one program!');
    return new Promise<Program>(() => {return new Program()});
  }
}