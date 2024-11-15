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

import {GermplasmSortField} from "@/breeding-insight/model/Sort";
import {BaseFilter} from "@/breeding-insight/model/BaseFilter";

export enum ListBIField {
    ListDbId = "listDbId",
    ListName = "listName",
}

export class ListFilter extends BaseFilter {
    [ListBIField.ListDbId]: string;
    [ListBIField.ListName]: string;
}

export class GermplasmFilter extends ListFilter {
    [GermplasmSortField.AccessionNumber]: string;
    [GermplasmSortField.DefaultDisplayName]: string;
    [GermplasmSortField.BreedingMethod]: string;
    [GermplasmSortField.SeedSource]: string;
    [GermplasmSortField.Pedigree]: string;
    [GermplasmSortField.FemaleParent]: string;
    [GermplasmSortField.MaleParent]: string;
    [GermplasmSortField.CreatedDate]: string;
    [GermplasmSortField.UserName]: string;
}
