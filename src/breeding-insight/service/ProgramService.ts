import {ProgramDAO} from "@/breeding-insight/dao/ProgramDAO";
import {Program} from "@/breeding-insight/model/Program";

export class ProgramService {

  static create(program: Program): Promise<Program> {
    //TODO: Check everything is good
    return ProgramDAO.create(program);
  }

  static update(program: Program): Promise<Program> {
    //TODO: Check everything is good
    if (program.id != undefined){
      return ProgramDAO.update(program.id, program);
    }
    else {
      alert('throwing a fit');
      return new Promise<any>(() => {});
    }
  }

  static archive(id: string): Promise<Program> {
    //TODO: Check everything is good
    return ProgramDAO.archive(id);
  }

  static getAll(): Promise<Program[]> {
    return ProgramDAO.getAll();
  }

  static getOne(id: string): Promise<Program> {
    return ProgramDAO.getOne(id);
  }
}