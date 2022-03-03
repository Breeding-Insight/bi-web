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
  MethodDescription = 'methodDescription',
  ScaleClass = 'scaleClass',
  ScaleName = 'scaleName'
}

export class OntologySort {
  field: OntologySortField;
  order: SortOrder;

  constructor(field: OntologySortField, order: SortOrder) {
    this.field = field;
    this.order = order;
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
  AccessionNumber = "accessionNumber",
  DefaultDisplayName = "defaultDisplayName",
  BreedingMethod = "additionalInfo.breedingMethod",
  SeedSource = "seedSource",
  FemaleParent = "femaleParent",
  MaleParent = "maleParent",
  CreatedDate = "additionalInfo.createdDate",
  UserName = "additionalInfo.createdBy.userName"
}

export class GermplasmSort {
  field: GermplasmSortField;
  order: SortOrder;

  constructor(field: GermplasmSortField, order: SortOrder) {
    this.field = field;
    this.order = order;
  }
}
