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

import Ontology from "@/views/ontology/Ontology.vue";

export enum SortOrder {
  Ascending = 'ASC',
  Descending = 'DESC'
}

export class Sort {
  static orderMap: any = {
    'asc': SortOrder.Ascending,
    'desc': SortOrder.Descending
  };
  static buefySortOrder: any = {
    [SortOrder.Ascending]: 'asc',
    [SortOrder.Descending]: 'desc'
  }

  static orderAsBI(order: string) {
    if (order in this.orderMap) {
      return this.orderMap[order];
    }
    return SortOrder.Ascending;
  }

  static orderAsBuefy(order: SortOrder) {
    return this.buefySortOrder[order];
  }
}

export enum TraitSortField {
  Name = 'name',
  MethodDescription = 'methodDescription',
  ScaleClass = 'scaleClass',
  ScaleName = 'scaleName'
}

// ontology
export enum OntologySortField {
  Name = 'name',
  MethodHandle = 'methodHandle',
  ScaleClass = 'scaleClass',
  ScaleName = 'scaleName',
  entityAttributeSortLabel = 'entityAttribute',
  TermType = 'termType'
}

export class OntologySort {
  field: OntologySortField;
  order: SortOrder;

  constructor(field: string, order: SortOrder) {
    this.field = OntologySortField.Name;
    this.order = SortOrder.Ascending;
    if (this.isSortField(field)) {
      this.field = field;
      this.order = order;
    }
  }

  private isSortField(field: string): field is OntologySortField {
    return Object.values(OntologySortField).includes(field);
  }
}

// location
export enum LocationSortField {
  Name = 'name',
  Abbreviation = 'abbreviation',
  Slope = 'slope'
}

export class LocationSort {
  field: LocationSortField;
  order: SortOrder;

  constructor(field: LocationSortField, order: SortOrder) {
    this.field = field;
    this.order = order;
  }
}

// system user
export enum SystemUserSortField {
  Name = 'name',
  Email = 'email',
  Roles = 'systemRoles',
  Programs = 'programs'
}

export class SystemUserSort {
  field: SystemUserSortField;
  order: SortOrder;

  constructor(field: SystemUserSortField, order: SortOrder) {
    this.field = field;
    this.order = order;
  }
}

// user
export enum UserSortField {
  Name = 'name',
  Email = 'email',
  Roles = 'roles',
  Active = 'active'
}

export class UserSort {
  field: UserSortField;
  order: SortOrder;

  constructor(field: UserSortField, order: SortOrder) {
    this.field = field;
    this.order = order;
  }
}

// program
export enum ProgramSortField {
  Name = 'name',
  Key = 'key',
  Abbreviation = 'abbreviation',
  Objective = 'objective',
  DocumentationUrl = 'documentationUrl',
  Active = 'active',
  BrapiUrl = 'brapiUrl',
  NumUsers = 'numUsers',
  SpeciesId = 'speciesId',
  SpeciesName = 'speciesName'
}

export class ProgramSort {
  field: ProgramSortField;
  order: SortOrder;

  constructor(field: ProgramSortField, order: SortOrder) {
    this.field = field;
    this.order = order;
  }
}

// germplasm
export enum GermplasmSortField {
  ImportEntryNumber = "importEntryNumber",
  AccessionNumber = "accessionNumber",
  DefaultDisplayName = "defaultDisplayName",
  BreedingMethod = "breedingMethod",
  SeedSource = "seedSource",
  Pedigree = "pedigree",
  FemaleParent = "femaleParentGID",
  MaleParent = "maleParentGID",
  CreatedDate = "createdDate",
  UserName = "createdByUserName"
}

// experiments
export enum ExperimentSortField {
  Name = "name",
  Active = "active",
  CreatedBy = "createdBy",
  CreatedDate = "createdDate"
}

export class ExperimentSort {
  field: ExperimentSortField;
  order: SortOrder;

  constructor(field: ExperimentSortField, order: SortOrder) {
    this.field = field;
    this.order = order;
  }
}

// germplasm
export class GermplasmSort {
  field: GermplasmSortField;
  order: SortOrder;

  constructor(field: GermplasmSortField, order: SortOrder) {
    this.field = field;
    this.order = order;
  }
}

export enum GermplasmListSortField {
  Name = "name",
  Description = "description",
  TotalEntries = "size",
  CreatedDate = "dateCreated",
  CreatedBy = "ownerName"
}

export class GermplasmListSort {
  field: GermplasmListSortField;
  order: SortOrder;

  constructor(field: GermplasmListSortField, order: SortOrder) {
    this.field = field;
    this.order = order;
  }
}