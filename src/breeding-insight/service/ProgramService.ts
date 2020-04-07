import {ProgramDAO} from "@/breeding-insight/dao/ProgramDAO";
import {Program} from "@/breeding-insight/model/Program";

export class ProgramService {

  static create(program: Program): Promise<Program> {
    //TODO: Check everything is good
    return new Promise<Program>((resolve, reject) => {

      if (program.id === undefined) {
        ProgramDAO.create(program).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram: Program = new Program(result.id, result.name);
          resolve(newProgram);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static update(program: Program): Promise<Program> {
    //TODO: Check everything is good
    return new Promise<Program>((resolve, reject) => {

      if (program.id) {
        ProgramDAO.update(program.id, program).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram: Program = new Program(result.id, result.name, result.species.id);
          resolve(newProgram);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static archive(id: string): Promise<Program> {
    //TODO: Check everything is good
    return new Promise<any>(((resolve, reject) => {

      if (id){
        return ProgramDAO.archive(id)
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        reject();
      }

    }));
  }

  static getAll(): Promise<Program[]> {
    return new Promise<Program[]>(((resolve, reject) => {

      ProgramDAO.getAll().then((biResponse) => {

        let programs: Program[] = [];
    
        // TODO: workaround for no programs for now
        if (biResponse.result.data) {
          // Parse our programs into the vue programs param
          programs = biResponse.result.data.map((program: any) => {
            return new Program(program.id, program.name, program.species.id);
          });
        }
    
        resolve(programs);
    
      }).catch((error) => reject(error));
    
    }));
  }

}

