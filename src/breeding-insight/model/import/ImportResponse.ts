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

import {ImportProgress} from "@/breeding-insight/model/import/ImportProgress";
import {ImportPreview} from "@/breeding-insight/model/import/ImportPreview";
import { User } from '@/breeding-insight/model/User';
import { JobDetail } from '@/breeding-insight/model/job/JobDetail';

export class ImportResponse extends JobDetail{
  importId?: string;
  progress?: ImportProgress;
  preview?: ImportPreview;
  uploadFileName?: string;
  importMappingName?:string;
  importType?:string;
  createdByUser?: User;
  updatedByUser?: User;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({importId, progress, preview, uploadFileName, importMappingName, importType, createdByUser, updatedByUser, createdAt, updatedAt, jobType}: ImportResponse) {
    super();
    this.importId = importId;
    this.progress = progress;
    this.preview = preview;
    this.uploadFileName = uploadFileName;
    this.importMappingName = importMappingName;
    this.importType = importType;
    this.createdByUser = createdByUser;
    this.updatedByUser = updatedByUser;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.jobType = jobType;
  }
}