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

import {SharedOntology} from "@/breeding-insight/model/SharedOntology";
import {BiResponse, Metadata} from "@/breeding-insight/model/BiResponse";
import {ValidationErrorService} from "@/breeding-insight/service/ValidationErrorService";
import {SharedOntologyDAO} from "@/breeding-insight/dao/SharedOntologyDAO";
import {SharedOntologyRequest} from "@/breeding-insight/model/SharedOntologyRequest";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import {SubscribedOntology} from "@/breeding-insight/model/SubscribedOntology";

export class SharedOntologyService {

  static async get(programId: string): Promise<[SharedOntology[], Metadata]> {
    if (!programId) throw 'Program ID required';

    try {
      const { result: { data }, metadata } = await SharedOntologyDAO.get(programId);
      const sharedPrograms: SharedOntology[] = [];
      for (const datum of data) {
        sharedPrograms.push(new SharedOntology(datum));
      }
      return [sharedPrograms, metadata];
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw error.response.statusText;
      } else {
        throw 'An unknown error has occurred';
      }
    }

  }

  static async share(programId: string, shareRequests: SharedOntologyRequest[]): Promise<[SharedOntology[], Metadata]> {

    try {
      const { result: { data }, metadata } = await SharedOntologyDAO.share(programId, shareRequests);
      // Parse into SharedPrograms
      const sharedPrograms: SharedOntology[] = [];
      for (const datum of data) {
        sharedPrograms.push(new SharedOntology(datum));
      }
      return [sharedPrograms, metadata];
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw error.response.statusText;
      } else if (error.response && error.response.status == 422) {
        const parsedErrors: ValidationError | string =  ValidationErrorService.parseError(error);
        // Stringify and format msg
        throw ValidationErrorService.stringify(parsedErrors, {includeRowNum: false, includeField: false}).join(" ");
      } else {
        throw 'An unknown error has occurred';
      }
    }
  }

  static async revokeAll(programId: string, programsToRemove: string[]) {

    if (!programId) throw 'Program ID required';

    // TODO: Collect errors
    for (const programToRemove of programsToRemove) {
      try {
        await SharedOntologyDAO.revoke(programId, programToRemove);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw error.response.statusText;
        } else {
          throw 'An unknown error has occurred';
        }
      }
    }
  }

  static async getSubscriptionOptions(programId: string): Promise<[SubscribedOntology[], Metadata]> {
    if (!programId) throw 'Program ID required';

    try {
      const { result: { data }, metadata } = await SharedOntologyDAO.getSubscriptionOptions(programId);
      const subscribedPrograms: SubscribedOntology[] = [];
      for (const datum of data) {
        subscribedPrograms.push(new SubscribedOntology(datum));
      }
      return [subscribedPrograms, metadata];
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw error.response.statusText;
      } else if (error.response && error.response.status === 403) {
        throw 'You do not have permissions required to manage program configurations.';
      } else {
        throw 'An unknown error has occurred';
      }
    }
  }

  static async subscribeOntology(programId: string, subscribedProgramId: string) {
    if (!programId) throw 'Program ID required';

    try {
      const { result: { data }, metadata } = await SharedOntologyDAO.subscribeOntology(programId, subscribedProgramId);
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw error.response.statusText;
      } else if (error.response && error.response.status === 403) {
        throw 'You do not have permissions required to manage program configurations.';
      } else if (error.response && error.response.status == 422) {
        throw error.response.statusText;
      } else {
        throw 'An unknown error has occurred';
      }
    }
  }

  static async unsubscribeOntology(programId: string, subscribedProgramId: string) {
    if (!programId) throw 'Program ID required';

    try {
      await SharedOntologyDAO.unsubscribeOntology(programId, subscribedProgramId);
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw error.response.statusText;
      } else if (error.response && error.response.status === 403) {
        throw 'You do not have permissions required to manage program configurations.';
      } else if (error.response && error.response.status == 422) {
        throw error.response.statusText;
      } else {
        throw 'An unknown error has occurred';
      }
    }
  }
}