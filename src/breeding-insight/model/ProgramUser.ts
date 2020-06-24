
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

import {Program} from "@/breeding-insight/model/Program";

export class ProgramUser {
  id?: string;
  name?: string;
  email?: string;
  roleId?: string;
  program?: Program;
  active?: boolean;

  constructor(id?: string, name?:string, email?: string, roleId?: string, program?: Program, active?: boolean) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.roleId = roleId;
    this.program = program;
    this.active = active;
  }
  
}