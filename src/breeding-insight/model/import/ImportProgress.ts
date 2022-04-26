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
import {FieldError} from "@/breeding-insight/model/errors/FieldError";

export class ImportProgress {
  statusCode?: number;
  message?: string;
  total?: number;
  finished?: number;
  inProgress?: number;
  rowErrors?: RowError[];
  errors?: FieldError[];

  constructor({statusCode, message, total, finished, inProgress, rowErrors, errors}: ImportProgress) {
    this.statusCode = statusCode;
    this.message = message;
    this.total = total;
    this.finished = finished;
    this.inProgress = inProgress;
    this.rowErrors = rowErrors;
    this.errors = errors;
  }
}