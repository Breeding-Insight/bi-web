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
import {GermplasmDAO} from "@/breeding-insight/dao/GermplasmDAO";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {SortOrder} from "@/breeding-insight/model/Sort";
import * as api from "@/util/api";
import {GermplasmFilter} from "@/breeding-insight/model/Filter";

export class GermplasmService {

    static async getAllInList<T>(programId: string,
                         sort: { field: T, order: SortOrder },
                         pagination: { pageSize: number, page: number },
                         { listDbId, listName, ...brapiFilters  }: GermplasmFilter):
        Promise<BiResponse> {
        //Form the query params including sorting, pagination, and filtering
        let params: any = { ...brapiFilters };

        if (sort.field) {
            params['sortField'] = sort.field;
        }
        if (sort.order) {
            params['sortOrder'] = sort.order;
        }
        if (pagination.page || pagination.page == 0) { //have to account for 0-index pagination since 0 falsy
            params ['page'] = pagination.page;
        }
        if (pagination.pageSize) {
            params['pageSize'] = pagination.pageSize;
        }

        try {
            let listId: String = '';

            if(listName && !listDbId) {
                //Get the list db id
                const paginationQuery = new PaginationQuery(0, 20, true);
                const {result: {lists}} = await GermplasmDAO.getAllLists(programId, paginationQuery);
                const matchingLists = lists.filter(list => list.name === listName);
                if (matchingLists.length === 0) throw Error("List name is not valid for this program");
                if (matchingLists.length > 1) throw Error("List name must be unique");
                listId = matchingLists[0].id;
            } else if(listDbId) {
                listId = listDbId;
            } else {
                throw Error("Missing list id and name");
            }

            //Get the list germplasm
            const {data} = await api.call({
                url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/germplasm/lists/${listId}/records`,
                method: 'get',
                params: params
            }) as Response;

            return new BiResponse(data);

        } catch(error) {
            throw error;
        }
    }

    static getAll(programId: string, paginationQuery: PaginationQuery = new PaginationQuery(0, 0, true)): Promise<[GermplasmList[], Metadata]> {
        return new Promise<[GermplasmList[], Metadata]>(((resolve, reject) => {

            let germplasmLists: GermplasmList[] = [];

            if (programId) {
                GermplasmDAO.getAllLists(programId, paginationQuery).then((biResponse: BiResponse) => {
                    if (biResponse.result.data) {
                        //TODO: Remove when backend default sorting is implemented
                        biResponse.result.data = PaginationController.mockSortRecords(biResponse.result.data);
                        germplasmLists = biResponse.result.data.map((germplasmList: any) => {
                            return germplasmList as GermplasmList;
                        });
                    }

                    resolve([germplasmLists, biResponse.metadata]);
                }).catch((error) => {
                    reject(error);
                })
            } else {
                reject();
            }
        }));
    }

    static async getSingleGermplasm(programId: string, germplasmId: string): Promise<Result<Error, Germplasm>> {
        try {
              if (!programId) throw new Error('Missing or invalid program id');
              let response: Result<Error, Germplasm> = await GermplasmDAO.getSingleGermplasm(programId, germplasmId);
              return response;
          } catch(error) {
              return ResultGenerator.err(error);
          }
    }

}
