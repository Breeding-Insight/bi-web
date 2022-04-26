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

export class ValidationError {
  rowErrors?: RowError[];
  errors?: FieldError[];

  constructor(rows?: RowError[], errors?: FieldError[]){
    if (rows) {
      this.rowErrors = rows.map(row => new RowError(row));
    }
    if (errors) {
      this.errors = errors.map(error => new FieldError(error));
    }
  }

  getValidation(rowIndex: number, errorName: string) {
    return this.getFieldErrorMessage(rowIndex, errorName);
  }

  private getFieldErrorMessage(rowIndex: number, errorName: string): FieldError[] {

    const rowError: RowError | undefined = this.rowErrors ? this.rowErrors[rowIndex] : undefined;
    if (rowError) {
      return rowError.getValidation(errorName);
    } else {
      return [];
    }
  }

  overrideMessage(rowIndex: number, errorName: string, message: string, statusCode: number) {
    let errors: FieldError[] = this.getFieldErrorMessage(rowIndex, errorName);
    for (const [index, error] of errors.entries()) {
      if (error.httpStatusCode === statusCode) {
        errors[index].errorMessage = message;
      }
    }
  }

  condenseErrorsSingleRow(deletions?: string[]) {

    let errorSentence: string = '';
    if (this.rowErrors) {
      for (const row of this.rowErrors) {
        if (row.errors) {
          for (const field of row.errors) {

            // Check our deletions
            let addMsg: boolean = true;
            if (deletions && deletions.length) {
              if (deletions.indexOf(field.field) !== -1) {
                addMsg = false;
              }
            }

            if (addMsg) {
              errorSentence += `${field.errorMessage}; `;
            }
          }
        }
      }
    }
    return errorSentence;
  }

  clearValidation(rowIndex: number, errorName: string) {
    if (this.rowErrors && this.rowErrors[rowIndex]) {
      for (const [errorIndex, field] of this.rowErrors[rowIndex].errors!.entries()) {
        if ((field) && (field.field === errorName)) {
          delete this.rowErrors[rowIndex].errors![errorIndex];
        }
      }
    }
  }
}