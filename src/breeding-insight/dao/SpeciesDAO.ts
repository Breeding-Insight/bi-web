import {Species} from "@/breeding-insight/model/Species";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";

export class SpeciesDAO {

  static getAll(): Promise<BiResponse> {

    return new Promise<BiResponse>(((resolve, reject) => {

      api.call({ url: `${process.env.VUE_APP_BI_API_V1_PATH}/species`, method: 'get' })
        .then((response: any) => {
          const biResponse = new BiResponse(response.data);
          resolve(biResponse);
        }).catch((error) => {
          reject(error);
        })

    }))
  }

}