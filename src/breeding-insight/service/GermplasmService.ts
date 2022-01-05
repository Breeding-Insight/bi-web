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

import {GermplasmList} from "@/breeding-insight/model/GermplasmList";
import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import * as api from "@/util/api";

export class GermplasmService {

    static getAll(programId: string, paginationQuery?: PaginationQuery): Promise<[GermplasmList[], Metadata]> {
        return new Promise<[GermplasmList[], Metadata]>(((resolve, reject) => {

            let germplasmLists: GermplasmList[] = [];

            if (paginationQuery === undefined) {
                paginationQuery = new PaginationQuery(0, 0, true);
            }

            if (programId) {
                const config: any = {};
                config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/lists`;
                //http://localhost:8081/v1/lists

                config.method = 'get';
                config.programId = programId;

                return new Promise<[GermplasmList[], Metadata]>(((resolve, reject) => {
                    api.call(config)
                        .then((response: any) => {
                            const biResponse = new BiResponse(response.data);
                            if (biResponse.result.data) {
                                //TODO: Remove when backend default sorting is implemented
                                biResponse.result.data = PaginationController.mockSortRecords(biResponse.result.data);
                                germplasmLists = biResponse.result.data.map((germplasmList: any) => {
                                    return germplasmList as GermplasmList;
                                });
                            }

                            //TODO: Remove when backend pagination is implemented
                            let newPagination;
                            [germplasmLists, newPagination] = PaginationController.mockPagination(germplasmLists, paginationQuery!.page, paginationQuery!.pageSize, paginationQuery!.showAll);
                            biResponse.metadata.pagination = newPagination;

                            resolve([germplasmLists, biResponse.metadata]);
                            //resolve(biResponse);
                        }).catch((error) => {
                        reject(error);
                    })

                }))
            } else {
                reject();
            }
        }));
    }

}
