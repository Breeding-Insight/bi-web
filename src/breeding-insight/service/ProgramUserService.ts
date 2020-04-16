import {ProgramUserDAO} from "@/breeding-insight/dao/ProgramUserDAO";
import {ProgramUser} from "@/breeding-insight/model/ProgramUser";
import { Role } from "@/breeding-insight/model/Role";

export class ProgramUserService {

  static create(programUser: ProgramUser): Promise<ProgramUser> {
    //TODO: Check everything is good
    return new Promise<ProgramUser>((resolve, reject) => {

      if (programUser.id === undefined) {
        ProgramUserDAO.create(programUser).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram: ProgramUser = new ProgramUser(result.id, result.name);
          resolve(newProgram);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static update(programUser: ProgramUser): Promise<ProgramUser> {
    //TODO: Check everything is good
    return new Promise<ProgramUser>((resolve, reject) => {

      if (programUser.id && programUser.programId) {
        ProgramUserDAO.update(programUser).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgram: ProgramUser = new ProgramUser(result.id, result.name, result.species.id);
          resolve(newProgram);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static delete(programId: string, userId: string): Promise<ProgramUser> {
    //TODO: Check everything is good
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
    
        // TODO: workaround for no programs for now
        if (biResponse.result.data) {
          programUsers = biResponse.result.data.map((programUser: any) => {
            const role: Role = new Role(programUser.roles[0].id, programUser.roles[0].domain);
            return new ProgramUser(programUser.user.id, programUser.user.name, programUser.user.email, role, programId);
          });
        }
    
        resolve(programUsers);
    
      }).catch((error) => reject(error));
    
    }));
  }

}

