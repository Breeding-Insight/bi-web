import {
    GermplasmSort,
    LocationSort,
    OntologySort,
    ProgramSort, Sort, SortOrder, SystemUserSort,
    TraitSortField,
    UserSort,
    UserSortField
} from "@/breeding-insight/model/Sort";

export interface SortState {
    // active ontology table
    activeOntologySort: OntologySort,

    // archived ontology table
    archivedOntologySort: OntologySort,

    // import preview ontology table
    importPreviewOntologySort: OntologySort,

    // program users table
    programUserSort: UserSort,

    // program locations table
    locationSort: LocationSort,

    // system users table
    systemUserSort: SystemUserSort,

    // program table
    programSort: ProgramSort,

    // germplasm table
    germplasmSort: GermplasmSort
}