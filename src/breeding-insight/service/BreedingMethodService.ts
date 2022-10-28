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

import { BiResponse, Metadata } from '@/breeding-insight/model/BiResponse';
import { BreedingMethod } from '@/breeding-insight/model/BreedingMethod';
import { BreedingMethodDAO } from '@/breeding-insight/dao/BreedingMethodDAO';
import { ValidationErrorService } from '@/breeding-insight/service/ValidationErrorService';

export class BreedingMethodService {
  private static getBreedingMethodUnknown: string = 'An unknown error occurred while retrieving breeding methods';
  private static errorEnablingMethods: string = 'Error enabling system breeding methods';
  private static unableToEnableMethods: string = 'Unable to enable system breeding methods';
  private static errorCreatingMethod: string = 'Error creating program breeding method';
  private static unableToCreateMethod: string = 'Unable to create program breeding method';
  private static errorUpdatingMethod: string = 'Error updating program breeding method';
  private static unableToUpdateMethod: string = 'Unable to update program breeding method';

  static async getProgramBreedingMethods(programId: string): Promise<BreedingMethod[]> {
    if (!programId) {
      throw 'Program ID not provided';
    }

    try {
      const response: BiResponse = await BreedingMethodDAO.getProgramBreedingMethods(programId);
      const data: any = response.result.data;
      if(data) {
        return data.map((response: BreedingMethod) => new BreedingMethod(response));
      } else {
        return [];
      }
    } catch (e) {
      if (e.response && e.response.statusText) {
        e.errorMessage = e.response.statusText;
      } else {
        e.errorMessage = this.getBreedingMethodUnknown;
      }
      throw e;
    }
  }

  static async getSystemBreedingMethods(): Promise<BreedingMethod[]> {
    try {
      const response: BiResponse = await BreedingMethodDAO.getSystemBreedingMethods();
      const data: any = response.result.data;
      if(data) {
        return data.map((response: BreedingMethod) => new BreedingMethod(response));
      } else {
        return [];
      }
    } catch (e) {
      if (e.response && e.response.statusText) {
        e.errorMessage = e.response.statusText;
      } else {
        e.errorMessage = this.getBreedingMethodUnknown;
      }
      throw e;
    }
  }

  static async enableSystemMethods(programId: string, systemMethods: BreedingMethod[]): Promise<any> {
    if (programId && systemMethods) {
      // Check that they all have a breeding method id
      if (systemMethods.filter(method => method.id).length !== systemMethods.length) {
        throw this.unableToEnableMethods;
      }

      try {
        let ids: string[] = systemMethods.map(value => value.id!);
        await BreedingMethodDAO.enableSystemBreedingMethods(programId, ids);
      } catch (e) {
        if (e.response && e.response.statusText) {
          e.errorMessage = e.response.statusText;
        } else {
          e.errorMessage = this.errorEnablingMethods;
        }
        throw e;
      }
    }
    else throw this.unableToEnableMethods;
  }

  static async createProgramBreedingMethod(programId: string, method: BreedingMethod): Promise<BreedingMethod> {
    if (programId && method) {
      try {
        const response: BiResponse = await BreedingMethodDAO.createProgramBreedingMethod(programId, method);
        const data: any = response.result;
        if(data) {
          return new BreedingMethod(data);
        }
      } catch (e) {
        if (e.response && e.response.statusText) {
          e.errorMessage = e.response.statusText;
        } else {
          e.errorMessage = this.errorCreatingMethod;
        }
        throw e;
      }
    }

    throw this.unableToCreateMethod;
  }

  static async updateProgramBreedingMethod(programId: string, method: BreedingMethod): Promise<BreedingMethod> {
    if (programId && method) {
      try {
        const response: BiResponse = await BreedingMethodDAO.updateProgramBreedingMethod(programId, method);
        const data: any = response.result;
        if(data) {
          return new BreedingMethod(data);
        }
      } catch (e) {
        if (e.response && e.response.statusText) {
          e.errorMessage = e.response.statusText;
        } else {
          e.errorMessage = this.errorUpdatingMethod;
        }
        throw e;
      }
    }

    throw this.unableToUpdateMethod;
  }
}