import {ServerManagementDAO} from "@/breeding-insight/dao/ServerManagementDAO";

export class ServerManagementService {

  static checkHealth(): Promise<any> {
      return new Promise<any>(((resolve, reject) => {
        ServerManagementDAO.checkHealth().then((response) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      }));
  }

}