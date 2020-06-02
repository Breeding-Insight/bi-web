import {User} from "@/breeding-insight/model/User";
import * as api from "@/util/api";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import {Role} from "@/breeding-insight/model/Role";

export class UserDAO {

  static getUserInfo(): Promise<BiResponse> {

    return new Promise<BiResponse>((resolve, reject) => {

      api.call({url: `${process.env.VUE_APP_BI_API_V1_PATH}/userinfo`})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {reject(error)});
    });
  }

  static create(user: User, systemRoles: Role[]): Promise<BiResponse> {


    return new Promise<BiResponse>((resolve, reject) => {

      // Construct request body
      const body = {'name': user.name, 'email': user.email, 'systemRoles': systemRoles};

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

  static archive(id: string): Promise<any> {
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

  static updateSystemRoles(id: string, systemRoles: Array<Role>) {

    return new Promise<BiResponse>((resolve, reject) => {
      const body = {'systemRoles': systemRoles.map((role: Role) => {
        return {'id': role.id, 'domain': role.name}
      })};

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/users/${id}/roles`, method: 'put', data: body})
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => reject(error));

    });
  }

}