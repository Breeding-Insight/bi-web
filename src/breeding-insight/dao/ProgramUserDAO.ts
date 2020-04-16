import {ProgramUser} from "@/breeding-insight/model/ProgramUser";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";

export class ProgramUserDAO {

  static create(programUser: ProgramUser): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      // Construct request body
      const body = {'user': {'id': programUser.id, 'name': programUser.name, 'email': programUser.email}, 'roles': { 'id': programUser.role } };

      // Make api request
      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programUser.programId}/users`, method: 'post', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {reject(error)});

    });
  }

  static update(programUser: ProgramUser): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      const body = {'name': programUser.name, 'email': programUser.email, 'roles': { 'id': programUser.role } };

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programUser.programId}/users/${programUser.id}`, method: 'put', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });
  }

  static delete(programId: string, userId: string): Promise<any> {
    return api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/users/${userId}`, method: 'delete'});
  }

  static getAll(programId: string): Promise<BiResponse> {

    return new Promise<BiResponse>(((resolve, reject) => {

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/users`, method: 'get' })
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {
          reject(error);
        })

    }))
  }

}
