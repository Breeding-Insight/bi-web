import {BiResponse} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";

export class ServerManagementDAO {

  static checkHealth() {
    return new Promise<BiResponse>(((resolve, reject) => {

      api.call({ url: `${process.env.VUE_APP_BI_API_ROOT}/health`, method: 'get' })
        .then((response: any) => {
          resolve(response);
        }).catch((error) => {
        reject(error);
      })

    }))
  }
}