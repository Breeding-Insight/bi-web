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

import { Call } from '@/breeding-insight/brapi/model/geno/call';
import { Variant } from '@/breeding-insight/brapi/model/geno/variant';

export class GenotypeCallsPage {
  callSetDbId?: string;
  calls?: Array<Call>;
  // Only the variants referenced by this page's calls, keyed by variantDbId
  variants?: {[variantDbId: string]: Variant};

  constructor({callSetDbId, calls, variants}: GenotypeCallsPage) {
    this.callSetDbId = callSetDbId;
    this.calls = calls;
    this.variants = variants;
  }
}
