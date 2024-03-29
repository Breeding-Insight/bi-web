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

import {BiResponse, Response} from "@/breeding-insight/model/BiResponse";
import * as api from "@/util/api";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import {ListType} from "@/util/ListType";

export class GermplasmDAO {

    static getAllLists(programId: string, paginationQuery: PaginationQuery): Promise<BiResponse> {

        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/lists`;
        config.method = 'get';
        config.programId = programId;
        config.params = {listType: ListType.Germplasm};
        if (paginationQuery.page) config.params.page = paginationQuery.page - 1;
        if (paginationQuery.pageSize) config.params.pageSize = paginationQuery.pageSize;

        return new Promise<BiResponse>(((resolve, reject) => {
            api.call(config)
                .then((response: any) => {
                    const biResponse = new BiResponse(response.data);
                    resolve(biResponse);
                }).catch((error) => {
                reject(error);
            })
        }))
    }

    static async getSingleGermplasm(programId: string, germplasmId: string): Promise<Result<Error, Germplasm>> {
        const config: any = {};
        config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/brapi/v2/germplasm/${germplasmId}`;
        config.method = 'get';
        config.programId = programId;
        config.germplasmId = germplasmId;
        config.params = {};

        try {
            const res = await api.call(config) as Response;
            let { result } = res.data;
            return ResultGenerator.success(result);
        } catch (error) {
            return ResultGenerator.err(error);
        }
    }
}
