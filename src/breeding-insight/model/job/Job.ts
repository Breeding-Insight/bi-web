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

import { User } from '@/breeding-insight/model/User';
import { JobDetail } from '@/breeding-insight/model/job/JobDetail';

export class Job {
  id?: string;
  statuscode?: number;
  statusMessage?: string;
  jobType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdByUser?: User;
  jobDetail?: JobDetail;

  constructor ({statuscode, statusMessage, jobType, createdAt, updatedAt, createdByUser, jobDetail}: Job) {
    this.statuscode = statuscode;
    this.statusMessage = statusMessage;
    this.jobType = jobType;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdByUser = createdByUser;
    this.jobDetail = jobDetail;
  }
}