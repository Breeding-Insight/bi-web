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
import { Job } from '@/breeding-insight/model/job/Job';
import { JobDAO } from '@/breeding-insight/dao/JobDAO';

export class JobService {
  static getJobsUnknown: string = 'An unknown error occurred while retrieving job statuses';

  static async getProgramJobs(programId: string): Promise<Job[]> {
    if (!programId) {
      throw 'Program ID not provided';
    }

    try {
      const response: BiResponse = await JobDAO.getProgramJobs(programId);
      const data: any = response.result;
      if(data) {
        return data.map((response: Job) => new Job(response));
      } else {
        return [];
      }
    } catch (e) {
      if (e.response && e.response.statusText) {
        e.errorMessage = e.response.statusText;
      } else {
        e.errorMessage = this.getJobsUnknown;
      }
      throw e;
    }

  }
}