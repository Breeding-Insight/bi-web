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

import {RowError} from "@/breeding-insight/model/errors/RowError";

export class FieldError {
  field: string;
  errorMessage: string;
  httpStatus: string;
  httpStatusCode: number;
  rowErrors?: RowError[];

  constructor(field: string, errorMessage: string, httpStatus: string, httpStatusCode: number, rowErrors?: RowError[]){
    this.field = field;
    this.errorMessage = errorMessage;
    this.httpStatus = httpStatus;
    this.httpStatusCode = httpStatusCode;
    if (rowErrors) {
      this.rowErrors = rowErrors.map(row => new RowError(row.rowIndex, row.errors));
    }
  }
}