import {
    LocationSort,
    OntologySort,
    ProgramSort, Sort, SortOrder,
    TraitSortField,
    UserSort,
    UserSortField
} from "@/breeding-insight/model/Sort";

export interface SortState {
    // active ontology table
    activeOntologySort: OntologySort,

    // archived ontology table
    archivedOntologySort: OntologySort,

    // program users table
    programUserSort: UserSort,

    // program locations table
    locationSort: LocationSort,

    // system users table
    systemUserSort: UserSort,

    // program table
    programSort: ProgramSort
}