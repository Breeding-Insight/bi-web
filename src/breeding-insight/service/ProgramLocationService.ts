import {ProgramLocationDAO} from "@/breeding-insight/dao/ProgramLocationDAO";
import {ProgramLocation} from "@/breeding-insight/model/ProgramLocation";

export class ProgramLocationService {

  static create(programLocation: ProgramLocation): Promise<ProgramLocation> {

    return new Promise<ProgramLocation>((resolve, reject) => {

      if (programLocation.id === undefined) {
        ProgramLocationDAO.create(programLocation).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgramLocation  = new ProgramLocation(result.id, result.programId, result.name);
          resolve(newProgramLocation);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static update(programLocation: ProgramLocation): Promise<ProgramLocation> {

    return new Promise<ProgramLocation>((resolve, reject) => {

      if (programLocation.id && programLocation.programId) {
        ProgramLocationDAO.update(programLocation).then((biResponse) => {
          const result: any = biResponse.result;
          const newProgramLocation = new ProgramLocation(result.id, result.programId, result.name);
          resolve(newProgramLocation);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }

  static delete(programId: string, locationId: string): Promise<ProgramLocation> {

    return new Promise<any>(((resolve, reject) => {

      if (programId && locationId){
        return ProgramLocationDAO.archive(programId, locationId)
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        reject();
      }

    }));
  }

  static getAll(programId: string): Promise<ProgramLocation[]> {
    return new Promise<ProgramLocation[]>(((resolve, reject) => {

      if (programId) {
        ProgramLocationDAO.getAll(programId).then((biResponse) => {

          let programLocations: ProgramLocation[] = [];
      
          // TODO: workaround for no program locations for now
          if (biResponse.result.data) {
            programLocations = biResponse.result.data.map((programLocation: any) => {
              return new ProgramLocation(programLocation.id, programLocation.programId, programLocation.name);
            });
          }
      
          resolve(programLocations);
      
        }).catch((error) => reject(error));
      
      } else {
        reject();
      }
    }));
  }
}
