import {Program} from "@/breeding-insight/model/Program";
import { BiResponse } from '../model/BiResponse';
import * as api from "@/util/api";

export class ProgramDAO {

  static create(program: Program): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      // Construct request body
      const body = {'name': program.name, 'species': { 'id': program.speciesId } };

      // Make api request
      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs`, method: 'post', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {reject(error)});

    });
  }

  static update(id: string, program: Program): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      const body = {'name': program.name, 'species': { 'id': program.speciesId } };

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${id}`, method: 'put', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });
  }

  static archive(id: string): Promise<any> {
    return api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/archive/${id}`, method: 'delete'});
  }

  static getAll(): Promise<BiResponse> {

    return new Promise<BiResponse>(((resolve, reject) => {

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs`, method: 'get' })
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {
          reject(error);
        })

    }))
  }

}
