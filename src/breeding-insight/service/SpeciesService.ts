/*
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {SpeciesDAO} from "@/breeding-insight/dao/SpeciesDAO";
import {Species} from "@/breeding-insight/model/Species";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";

export class SpeciesService{

  static getAll(paginationQuery?: PaginationQuery): Promise<[Species[], Metadata]> {
    return new Promise<[Species[], Metadata]>(((resolve, reject) => {

      if (paginationQuery === undefined){
        paginationQuery = new PaginationQuery(0, 0, true);
      }

      SpeciesDAO.getAll(paginationQuery).then((biResponse) => {

        // Parse our users into the vue users param
        const species = biResponse.result.data.map((species: any) => {
          return new Species(species.id, species.commonName);
        });

        resolve([species, biResponse.metadata]);

      }).catch((error) => reject(error));

    }));
  }

}