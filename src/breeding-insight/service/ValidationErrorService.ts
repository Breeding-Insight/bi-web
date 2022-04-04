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

import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";

export class ValidationErrorService {

  static errorUnknown: string = "Unable to determine reason for failure upload. Please check file and try again.";

  static parseError(error: any): ValidationError | string {

    const jsonError = error.response;
    if (jsonError.data) {
      const rowErrors = jsonError.data.rowErrors;
      if (rowErrors) {
        let validationError: ValidationError = new ValidationError(rowErrors);
        return validationError;
      } else {
        return jsonError;
      }
    } else {
      if (jsonError.statusText) {
        return jsonError.statusText;
      } else {
        return this.errorUnknown;
      }
    }
  }
}