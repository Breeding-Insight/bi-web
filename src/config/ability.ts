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

import {AbilityBuilder} from '@casl/ability';
import { User } from '../breeding-insight/model/User';
import {AppAbility} from "@/config/AppAbility";
import {ProgramUser} from "@/breeding-insight/model/ProgramUser";
import {Program} from "@/breeding-insight/model/Program";

type DefinePermissions = (user: User, builder: AbilityBuilder<AppAbility>) => void;

const rolePermissions: Record<string, DefinePermissions> = {
  readonly(user, { can }) {
    can('access', 'Experiment');
    can('access', 'Ontology');
    can('access', 'Germplasm');
    can('access', 'ProgramAdministration');
    can('access', 'SampleManagement');
    can('access', 'BrAPI');
    can('access', 'JobManagement');
  },
  experimentalcollaborator(user, { can }) {
    can('access', 'Experiment');
    can('access', 'BrAPI');
  },
  programadministrator(user, { can }) {
    can('create', 'ProgramUser');
    can('update', 'ProgramUser');
    can('archive', 'ProgramUser');
    can('create', 'Location');
    can('update', 'Location');
    can('archive', 'Location');
    can('create', 'Trait');
    can('update', 'Trait');
    can('archive', 'Trait');
    can('create', 'Import');
    can('access', 'ProgramConfiguration');
    can('create', 'ProgramConfiguration');
    can('update', 'ProgramConfiguration');
    can('access', 'Experiment');
    can('access', 'Ontology');
    can('access', 'Germplasm');
    can('access', 'SampleManagement');
    can('access', 'ProgramAdministration');
    can('access', 'BrAPI');
    can('access', 'JobManagement');
    can('manage', 'Collaborator');
    can('delete', 'List');

  },
  systemadministrator(user, { can }) {
    can('create', 'ProgramUser');
    can('update', 'ProgramUser');
    can('archive', 'ProgramUser');
    can('create', 'Location');
    can('update', 'Location');
    can('archive', 'Location');
    can('manage', 'User');
    can('access', 'AdminSection');
    can('submit', 'Submission');
    can('access', 'Experiment');
    can('access', 'Ontology');
    can('access', 'Germplasm');
    can('access', 'SampleManagement');
    can('access', 'ProgramAdministration');
    can('access', 'BrAPI');
    can('access', 'JobManagement');
    can('manage', 'Collaborator');
    can('delete', 'List');

  }
};

//Helper method to convert domain name to associated rolePermissions function
//Necessary as functions depend on no whitespace and present domain names have whitespace
function toRoleFunctionName(domain: String){
  return domain.replace(/\s/g, "").toLowerCase();
}

export function defineAbilityFor(user: User | undefined, program: Program | undefined): AppAbility {
  const builder = new AbilityBuilder<AppAbility>();

  if (user) {
    let roleFunctionName = "";
    // Check system roles
    if (user.roleName) {
      roleFunctionName = toRoleFunctionName(user.roleName);
      if (typeof rolePermissions[roleFunctionName] === 'function') {
        rolePermissions[roleFunctionName](user, builder);
      }
    }

    if (program) {
      // Check program roles
      if (user.programRoles) {
        for (const programRole of user.programRoles) {
          if (programRole.domain) {
            roleFunctionName = toRoleFunctionName(programRole.domain);
          }
          if (programRole.program && programRole.program.id &&
            programRole.program.id === program.id && programRole.domain &&
            programRole.active &&
            typeof rolePermissions[roleFunctionName] === 'function') {
            rolePermissions[roleFunctionName](user, builder);
          }
        }
      }
    }
  }

  return builder.build();
}