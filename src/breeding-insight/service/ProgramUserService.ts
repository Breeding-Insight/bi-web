import {ProgramUserDAO} from "@/breeding-insight/dao/ProgramUserDAO";
import {ProgramUser} from "@/breeding-insight/model/ProgramUser";
import { Role } from "@/breeding-insight/model/Role";

export class ProgramUserService {

  static create(programUser: ProgramUser): Promise<ProgramUser> {

    return new Promise<ProgramUser>((resolve, reject) => {

      if (programUser.id === undefined) {
        ProgramUserDAO.create(programUser).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram: ProgramUser = new ProgramUser(result.user.id, result.user.name, result.user.email, programUser.programId, result.roles[0].id);
          resolve(newProgram);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static update(programUser: ProgramUser): Promise<ProgramUser> {

    return new Promise<ProgramUser>((resolve, reject) => {

      if (programUser.id && programUser.programId) {
        ProgramUserDAO.update(programUser).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram: ProgramUser = new ProgramUser(result.user.id, result.user.name, result.user.email, programUser.programId, result.roles[0].id);
          resolve(newProgram);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static delete(programId: string, userId: string): Promise<ProgramUser> {

    return new Promise<any>(((resolve, reject) => {

      if (programId && userId){
        return ProgramUserDAO.delete(programId, userId)
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        reject();
      }

    }));
  }

  static getAll(programId: string): Promise<ProgramUser[]> {
    return new Promise<ProgramUser[]>(((resolve, reject) => {

      ProgramUserDAO.getAll(programId).then((biResponse) => {

        let programUsers: ProgramUser[] = [];
    
        // TODO: workaround for no program users for now
        if (biResponse.result.data) {
          programUsers = biResponse.result.data.map((programUser: any) => {
            return new ProgramUser(programUser.user.id, programUser.user.name, programUser.user.email, programId, programUser.roles[0].id);
          });
        }
    
        resolve(programUsers);
    
      }).catch((error) => reject(error));
    
    }));
  }

}

