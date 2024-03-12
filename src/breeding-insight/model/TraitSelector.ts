import {OntologySortField} from "@/breeding-insight/model/Sort";

export enum TraitField {
  NAME = 'name',
  MAIN_ABBREVIATION = 'mainAbbreviation',
  SYNONYMS = 'synonyms',
  LEVEL = 'level',
  STATUS = 'status',
  METHOD_DESCRIPTION = 'methodDescription',
  METHOD_CLASS = 'methodClass',
  METHOD_FORMULA = 'methodFormula',
  METHOD_HANDLE = 'methodHandle',
  SCALE_NAME = 'scaleName',
  SCALE_CLASS = 'scaleClass',
  SCALE_DECIMAL_PLACES = 'scaleDecimalPlaces',
  SCALE_LOWER_LIMIT = 'scaleLowerLimit',
  SCALE_UPPER_LIMT = 'scaleUpperLimit',
  SCALE_CATEGORIES = 'scaleCategories',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  CREATED_BY_USER_ID = 'createdByUserId',
  CREATED_BY_USER_NAME = 'createdByUserName',
  UPDATED_BY_USER_ID = 'updatedByUserId',
  UPDATED_BY_USER_NAME = 'updatedByUserName',
  TERM_TYPE = 'termType',
  ENTITY_ATTRIBUTE = 'entityAttribute',
  FULL_NAME = 'fullName'
}

export enum TermType {
  PHENOTYPE = 'Phenotype',
  GERM_ATTRIBUTE = 'Germplasm Attribute',
  GERM_PASSPORT = 'Germplasm Passport'
}

export class TraitFilter {
  field?: TraitField;
  value?: string | number | boolean;

  constructor(field: string, value: any) {
    if (this.isTraitField(field)) {
      this.field = field;
      this.value = value;
    }
  }

  private isTraitField(field: string): field is TraitField {
    return Object.values(TraitField).includes(field);
  }
}

export class TraitSelector {
  filters: TraitFilter[]

  constructor(filters: TraitFilter[] = []) {
    this.filters = filters;
  }

  addFilter(filter: TraitFilter) {
    if (filter.field && filter.value !== '') {
      this.filters.push(filter);
    }
  }

}