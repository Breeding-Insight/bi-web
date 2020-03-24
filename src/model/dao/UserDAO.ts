import {Program} from "@/model/Program";
import {User} from "@/model/User";
import * as api from "@/util/api";
import {BiResponse} from "@/model/BiResponse";
import {Vue} from "vue-property-decorator";

export class UserDAO {

  static create(user: User): Promise<BiResponse> {


    return new Promise<BiResponse>((resolve, reject) => {

      // Construct request body
      const body = {'name': user.name, 'email': user.email};

      // Make api request
      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users`, method: 'post', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {reject(error)});

    });
  }

  static update(id: string, user: User): Promise<BiResponse> {


    return new Promise<BiResponse>((resolve, reject) => {

      const body = {'name': user.name, 'email': user.email};

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users/${id}`, method: 'put', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });
  }

  static delete(id: string): Promise<any> {
    return api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users/${id}`, method: 'delete'});
  }

  static getAll(): Promise<BiResponse> {

    return new Promise<BiResponse>(((resolve, reject) => {

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users`, method: 'get' })
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {
          reject(error);
        })

    }))

  }

}