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

import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";

export default class DaoUtils {

  static formatBiResponse(data: any[]): BiResponse {
    const metadata: Metadata = new Metadata({
      pagination: {
        totalPages: 1,
        currentPage: 1,
        totalCount: data.length,
        pageSize: data.length
      },
      status: []
    });

    return new BiResponse({
      metadata,
      result: {
        data: data
      }
    });
  }

  static formatBiResponseWithPaging(data: any[], totalPages: number, currentPage: number,
                                    totalCount : number, pageSize : number): BiResponse {
    const metadata: Metadata = new Metadata({
      pagination: {
        totalPages: totalPages,
        currentPage: currentPage,
        totalCount: totalCount,
        pageSize: pageSize
      },
      status: []
    });

    let pagedData = data.slice((currentPage * pageSize - pageSize), (currentPage * pageSize > data.length ? data.length : currentPage * pageSize));
    return new BiResponse({
      metadata,
      result: {
        data: pagedData
      }
    });
  }

  static formatBiResponseSingle(data: any): BiResponse {
    const metadata: Metadata = new Metadata({
      pagination: {
        totalPages: 1,
        currentPage: 1,
        totalCount: 1,
        pageSize: 1
      },
      status: []
    });

    return new BiResponse({
      metadata,
      result: data
    });
  }
}