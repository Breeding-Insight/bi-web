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

import {ProgramUpload} from "@/breeding-insight/model/ProgramUpload";
import { TraitUploadDAO } from '@/breeding-insight/dao/TraitUploadDAO';

export class TraitUploadService {

  static uploadFile(programId: string, file: File): Promise<ProgramUpload> {

    return new Promise<ProgramUpload>((resolve, reject) => {

      if (file !== null) {
        TraitUploadDAO.update(programId, file).then((biResponse) => {
          const result: any = biResponse.result;
          const upload = new ProgramUpload(result.id);
          resolve(upload);

        }).catch((error) => reject(error));
      }
      else {
        reject();
      }

    });
  }
}