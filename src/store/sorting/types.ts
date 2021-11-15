import {TraitSortField, UserSort, UserSortField} from "@/breeding-insight/model/Sort";

export interface SortState {
    // active ontology table
    activeTraitSortField: TraitSortField,
    activeOntNameSortOrder: boolean,
    activeOntMethodSortOrder: boolean,
    activeOntScaleClassSortOrder: boolean,
    activeOntUnitSortOrder: boolean

    // archived ontology table
    archivedTraitSortField: TraitSortField,
    archivedOntNameSortOrder: boolean,
    archivedOntMethodSortOrder: boolean,
    archivedOntScaleClassSortOrder: boolean,
    archivedOntUnitSortOrder: boolean,

    // program users table
    programUserSort: UserSort
}