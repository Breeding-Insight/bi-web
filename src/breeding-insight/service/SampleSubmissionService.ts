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

import { BiResponse } from '@/breeding-insight/model/BiResponse';
import {SampleSubmission} from "@/breeding-insight/model/SampleSubmission";
import {SampleSubmissionDAO} from "@/breeding-insight/dao/SampleSubmissionDAO";
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {VendorOrderSubmission} from "@/breeding-insight/brapi/model/geno/vendorOrderSubmission";

export class SampleSubmissionService {
  private static getSampleSubmissionUnknown: string = 'An unknown error occurred while retrieving sample submissions';

  static async getProgramSampleSubmissions(programId: string): Promise<SampleSubmission[]> {
    if (!programId) {
      throw 'Program ID not provided';
    }

    try {
      const response: BiResponse = await SampleSubmissionDAO.getProgramSampleSubmissions(programId);
      const data: any = response.result.data;
      if(data) {
        return data.map((response: SampleSubmission) => new SampleSubmission(response));
      } else {
        return [];
      }
    } catch (e) {
      if (e.response && e.response.statusText) {
        e.errorMessage = e.response.statusText;
      } else {
        e.errorMessage = this.getSampleSubmissionUnknown;
      }
      throw e;
    }
  }

  static async getSubmission(programId: string, submissionId: string): Promise<Result<Error, SampleSubmission>> {
    if (!programId) {
      return ResultGenerator.err(new Error('Missing or invalid program id'));
    }
    return await SampleSubmissionDAO.getSubmissionById(programId, submissionId, false);
  }

  static async getSubmissionDetails(programId: string, submissionId: string): Promise<Result<Error, SampleSubmission>> {
    if (!programId) {
      return ResultGenerator.err(new Error('Missing or invalid program id'));
    }
    return await SampleSubmissionDAO.getSubmissionById(programId, submissionId, true);
  }

    static async submitToDArT(programId: string, submissionId: string): Promise<Result<Error, VendorOrderSubmission>> {
      if (!programId) {
        return ResultGenerator.err(new Error('Missing or invalid program id'));
      }
      return await SampleSubmissionDAO.submitToDArT(programId, submissionId);
    }

    static async checkVendorStatus(programId: string, submissionId: string): Promise<Result<Error, SampleSubmission>> {
      if (!programId) {
        return ResultGenerator.err(new Error('Missing or invalid program id'));
      }
      return await SampleSubmissionDAO.checkVendorStatus(programId, submissionId);
    }

    static async updateSubmissionStatus(programId: string, submissionId: string, status: string): Promise<Result<Error, SampleSubmission>> {
      if (!programId) {
        return ResultGenerator.err(new Error('Missing or invalid program id'));
      }
      return await SampleSubmissionDAO.updateSubmissionStatus(programId, submissionId, status);
    }
}