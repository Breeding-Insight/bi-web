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

import {UPDATE_SHARED_ONTOLOGY} from './mutation-types';
import {SharedOntologyService} from "@/breeding-insight/service/SharedOntologyService";

export const actions = {
  async getSubscribedOntology({commit, rootGetters}: any) {
    const [data, metadata] = await SharedOntologyService.getSubscriptionOptions(rootGetters.activeProgram!.id!);
    // Check if we are subscribed to one of the programs
    commit(UPDATE_SHARED_ONTOLOGY, data);
  }
}