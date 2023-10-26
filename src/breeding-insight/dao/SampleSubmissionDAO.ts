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

import * as api from '@/util/api';
import { BiResponse, Response } from '@/breeding-insight/model/BiResponse';
import { BreedingMethod } from '@/breeding-insight/model/BreedingMethod';
import {Result, ResultGenerator} from "@/breeding-insight/model/Result";
import {SampleSubmission} from "@/breeding-insight/model/SampleSubmission";
import {VendorOrderSubmission} from "@/breeding-insight/brapi/model/geno/vendorOrderSubmission";
import {BrAPIDAOUtil} from "@/breeding-insight/dao/BrAPIDAOUtil";

export class SampleSubmissionDAO {

  static async getProgramSampleSubmissions(programId: string) {
    const {data} = await api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/submissions`,
      method: 'get',
    }) as Response;

    return new BiResponse(data);
  }

  static async getSubmissionById(programId: string, submissionId: string, fetchDetails: boolean): Promise<Result<Error, SampleSubmission>> {
    const config: any = {};
    config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/submissions/${submissionId}`;
    config.method = 'get';
    config.programId = programId;
    config.submissionId = submissionId;
    config.params = {'details': fetchDetails};
    try {
      const res = await api.call(config) as Response;
      let { result } = res.data;
      return ResultGenerator.success(result);
    } catch (error) {
      return ResultGenerator.err(error);
    }
  }

    static async submitToDArT(programId: string, submissionId: string): Promise<Result<Error, VendorOrderSubmission>> {
      const config: any = {};
      config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/submissions/${submissionId}/submit?vendor=dart`;
      config.method = 'post';
      config.programId = programId;
      config.submissionId = submissionId;
      try {
        const res = await api.call(config) as Response;
        let { result } = res.data;
        return ResultGenerator.success(result);
      } catch (error) {
        return ResultGenerator.err(error);
      }
    }

    static async checkVendorStatus(programId: string, submissionId: string): Promise<Result<Error, SampleSubmission>> {
      const config: any = {};
      config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/submissions/${submissionId}/status`;
      config.method = 'get';
      config.programId = programId;
      config.submissionId = submissionId;
      try {
        const res = await api.call(config) as Response;
        let { result } = res.data;
        return ResultGenerator.success(result);
      } catch (error) {
        return ResultGenerator.err(error);
      }
    }

    static async updateSubmissionStatus(programId: string, submissionId: string, status: string): Promise<Result<Error, SampleSubmission>> {
      const config: any = {};
      config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${programId}/submissions/${submissionId}/status`;
      config.method = 'put';
      config.programId = programId;
      config.submissionId = submissionId;
      config.data = {'status': status};
      try {
        const res = await api.call(config) as Response;
        let { result } = res.data;
        return ResultGenerator.success(result);
      } catch (error) {
        return ResultGenerator.err(error);
      }
    }
}
