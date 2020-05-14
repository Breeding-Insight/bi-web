import {ProgramLocation} from "@/breeding-insight/model/ProgramLocation";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";

export class ProgramLocationDAO {

  static create(programLocation: ProgramLocation): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      // Construct request body
      const body = {'name': programLocation.name };
  
      // Make api request
      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programLocation.programId}/locations`, method: 'post', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {reject(error)});

    });
  }

  static update(programLocation: ProgramLocation): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      const body = {'name': programLocation.name };

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programLocation.programId}/locations/${programLocation.id}`, method: 'put', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });
  }

  static archive(programId: string, locationId: string): Promise<any> {
    return api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/locations/${locationId}`, method: 'delete'});
  }

  static getAll(programId: string): Promise<BiResponse> {

    return new Promise<BiResponse>(((resolve, reject) => {

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/locations`, method: 'get' })
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {
          reject(error);
        })

    }))
  }

}
