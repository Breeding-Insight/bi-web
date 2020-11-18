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
  member(user, { can }) {
  },
  breeder(user, { can }) {
    can('create', 'ProgramUser');
    can('update', 'ProgramUser');
    can('archive', 'ProgramUser');
    can('create', 'Location');
    can('update', 'Location');
    can('archive', 'Location');
    can('create', 'Trait');
  },
  admin(user, { can }) {
    can('create', 'ProgramUser');
    can('update', 'ProgramUser');
    can('archive', 'ProgramUser');
    can('manage', 'User');
    can('access', 'AdminSection');
  }
};

export function defineAbilityFor(user: User | undefined, program: Program | undefined): AppAbility {
  const builder = new AbilityBuilder<AppAbility>();

  if (user) {
    // Check system roles
    if (user.roleName) {
      if (typeof rolePermissions[user.roleName] === 'function') {
        rolePermissions[user.roleName](user, builder);
      }
    }

    if (program) {
      // Check program roles
      if (user.programRoles) {
        for (const programRole of user.programRoles) {
          if (programRole.program && programRole.program.id &&
            programRole.program.id === program.id && programRole.domain &&
            programRole.active &&
            typeof rolePermissions[programRole.domain] === 'function') {

            rolePermissions[programRole.domain](user, builder);
          }
        }
      }
    }
  }

  return builder.build();
}