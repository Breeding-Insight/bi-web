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

import { GermplasmUtils } from "@/breeding-insight/utils/GermplasmUtils";

describe('GermplasmUtils External UID helper returns the correct values.', () => {

    it('Returns External UID from canonical External UID reference source', () => {
        const germplasm: any = {
            seedSource: "USDA",
            externalReferences: [
                { referenceSource: "USDA", referenceID: "OLD-123" },
                { referenceSource: "External UID", referenceID: "ABC-123" }
            ]
        };

        expect(GermplasmUtils.getExternalUID(germplasm)).toBe("ABC-123");
    });

    it('Returns External UID when seed source is blank and canonical External UID reference exists', () => {
        const germplasm: any = {
            externalReferences: [
                { referenceSource: "External UID", referenceID: "ABC-456" }
            ]
        };

        expect(GermplasmUtils.getExternalUID(germplasm)).toBe("ABC-456");
    });

    it('Returns undefined when canonical External UID reference does not exist', () => {
        const germplasm: any = {
            seedSource: "USDA",
            externalReferences: [
                { referenceSource: "USDA", referenceID: "OLD-123" }
            ]
        };

        expect(GermplasmUtils.getExternalUID(germplasm)).toBeUndefined();
    });

    it('Returns empty string when external references are missing', () => {
        const germplasm: any = {};

        expect(GermplasmUtils.getExternalUID(germplasm)).toBe("");
    });

});