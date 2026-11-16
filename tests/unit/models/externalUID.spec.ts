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

import { ExternalUID } from "@/breeding-insight/model/import/germplasm/ExternalUID";

describe('ExternalUID helper returns the correct values.', () => {

    it('Returns External UID when canonical External UID reference exists', () => {
        const externalReferences = [
            { referenceSource: "USDA", referenceID: "OLD-123" },
            { referenceSource: "External UID", referenceID: "ABC-123" }
        ];

        expect(ExternalUID.getExternalUIDFromExternalReferences(externalReferences)).toBe("ABC-123");
    });

    it('Returns External UID when canonical External UID reference exists and source is blank', () => {
        const externalReferences = [
            { referenceSource: "External UID", referenceID: "ABC-456" }
        ];

        expect(ExternalUID.getExternalUIDFromExternalReferences(externalReferences)).toBe("ABC-456");
    });

    it('Returns undefined when canonical External UID reference does not exist', () => {
        const externalReferences = [
            { referenceSource: "USDA", referenceID: "OLD-123" }
        ];

        expect(ExternalUID.getExternalUIDFromExternalReferences(externalReferences)).toBeUndefined();
    });

    it('Returns undefined when external references are undefined', () => {
        expect(ExternalUID.getExternalUIDFromExternalReferences(undefined as any)).toBeUndefined();
    });

});