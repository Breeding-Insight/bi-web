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

import {User} from "@/breeding-insight/model/User";
import {Plate} from "@/breeding-insight/brapi/model/geno/plate";
import {Sample} from "@/breeding-insight/brapi/model/geno/sample";
import {ShipmentForm} from "@/breeding-insight/brapi/model/geno/shipmentForm";

export class SampleSubmission {
    id?: string;
    name?: string;
    submitted?: boolean;
    submittedDate?: string;
    vendorOrderId?: string;
    vendorStatus?: string;
    vendorStatusLastCheck?: string;
    shipmentForms?: Array<ShipmentForm>;
    programId?: string;
    createdAt?: string;
    updatedAt?: string;
    createdByUser?: User;
    updatedByUser?: User;
    submittedByUser?: User;
    plates?: Array<Plate>;
    samples?: Array<Sample>;

    constructor({
                    id,
                    name,
                    submitted,
                    submittedDate,
                    vendorOrderId,
                    vendorStatus,
                    vendorStatusLastCheck,
                    shipmentForms,
                    programId,
                    createdAt,
                    updatedAt,
                    createdByUser,
                    updatedByUser,
                    plates,
                    samples
                }: SampleSubmission) {
        this.id = id;
        this.name = name;
        this.submitted = submitted;
        this.submittedDate = submittedDate;
        this.vendorOrderId = vendorOrderId;
        this.vendorStatus = vendorStatus;
        this.vendorStatusLastCheck = vendorStatusLastCheck;
        this.shipmentForms = shipmentForms;
        this.programId = programId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdByUser = createdByUser;
        this.updatedByUser = updatedByUser;
        this.plates = plates;
        this.samples = samples;
    }
}