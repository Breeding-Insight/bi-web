export enum TraitField {
  NAME = 'name',
  ABBREVIATIONS = 'abbreviations',
  MAIN_ABBREVIATION = 'mainAbbreviation',
  SYNONYMS = 'synonyms',
  LEVEL = 'level',
  STATUS = 'status',
  METHOD_DESCRIPTION = 'methodDescription',
  METHOD_CLASS = 'methodClass',
  METHOD_FORMULA = 'methodFormula',
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
  UPDATED_BY_USER_NAME = 'updatedByUserName'
}

export class Filter {
  field?: TraitField;
  value?: string | number | boolean;
}

export class TraitSelector {
  filters: Filter[]

  constructor(filters: Filter[] = []) {
    this.filters = filters;
  }

  addFilter(filter: Filter) {
    this.filters.push(filter);
  }

}