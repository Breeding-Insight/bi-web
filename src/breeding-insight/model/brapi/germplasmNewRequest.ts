/**
 * BrAPI-Germplasm
 * The Breeding API (BrAPI) is a Standardized REST ful Web Service API Specification for communicating Plant Breeding Data. BrAPI allows for easy data sharing between databases and tools involved in plant breeding. <div class=\"brapi-section\"> <h2 class=\"brapi-section-title\">General Reference Documentation</h2> <div class=\"gen-info-link\"><a href=\"https://github.com/plantbreeding/API/blob/master/Specification/GeneralInfo/URL_Structure.md\">URL Structure</a></div> <div class=\"gen-info-link\"><a href=\"https://github.com/plantbreeding/API/blob/master/Specification/GeneralInfo/Response_Structure.md\">Response Structure</a></div> <div class=\"gen-info-link\"><a href=\"https://github.com/plantbreeding/API/blob/master/Specification/GeneralInfo/Date_Time_Encoding.md\">Date/Time Encoding</a></div> <div class=\"gen-info-link\"><a href=\"https://github.com/plantbreeding/API/blob/master/Specification/GeneralInfo/Location_Encoding.md\">Location Encoding</a></div> <div class=\"gen-info-link\"><a href=\"https://github.com/plantbreeding/API/blob/master/Specification/GeneralInfo/Error_Handling.md\">Error Handling</a></div> <div class=\"gen-info-link\"><a href=\"https://github.com/plantbreeding/API/blob/master/Specification/GeneralInfo/Search_Services.md\">Search Services</a></div> </div>  <div class=\"brapi-section\"> <h2 class=\"brapi-section-title\">BrAPI Core</h2> <div class=\"brapi-section-description\">The BrAPI Core module contains high level entities used for organization and management. This includes Programs, Trials, Studies, Locations, People, and Lists</div> <div class=\"version-number\">V2.0</div> <div class=\"link-btn\"><a href=\"https://github.com/plantbreeding/API/tree/master/Specification/BrAPI-Core\">GitHub</a></div> <div class=\"link-btn\"><a href=\"https://app.swaggerhub.com/apis/PlantBreedingAPI/BrAPI-Core\">SwaggerHub</a></div> <div class=\"link-btn\"><a href=\"https://brapicore.docs.apiary.io\">Apiary</a></div> <div class=\"stop-float\"></div> </div>  <div class=\"brapi-section\"> <h2 class=\"brapi-section-title\">BrAPI Phenotyping</h2> <div class=\"brapi-section-description\">The BrAPI Phenotyping module contains entities related to phenotypic observations. This includes Observation Units, Observations, Observation Variables, Traits, Scales, Methods, and Images</div> <div class=\"version-number\">V2.0</div> <div class=\"link-btn\"><a href=\"https://github.com/plantbreeding/API/tree/master/Specification/BrAPI-Phenotyping\">GitHub</a></div> <div class=\"link-btn\"><a href=\"https://app.swaggerhub.com/apis/PlantBreedingAPI/BrAPI-Phenotyping\">SwaggerHub</a></div> <div class=\"link-btn\"><a href=\"https://brapiphenotyping.docs.apiary.io\">Apiary</a></div> <div class=\"stop-float\"></div> </div>  <div class=\"brapi-section\"> <h2 class=\"brapi-section-title\">BrAPI Genotyping</h2> <div class=\"brapi-section-description\">The BrAPI Genotyping module contains entities related to genotyping analysis. This includes Samples, Markers, Variant Sets, Variants, Call Sets, Calls, References, Reads, and Vendor Orders</div> <div class=\"version-number\">V2.0</div> <div class=\"link-btn\"><a href=\"https://github.com/plantbreeding/API/tree/master/Specification/BrAPI-Genotyping\">GitHub</a></div> <div class=\"link-btn\"><a href=\"https://app.swaggerhub.com/apis/PlantBreedingAPI/BrAPI-Genotyping\">SwaggerHub</a></div> <div class=\"link-btn\"><a href=\"https://brapigenotyping.docs.apiary.io\">Apiary</a></div> <div class=\"stop-float\"></div> </div>  <div class=\"current-brapi-section brapi-section\"> <h2 class=\"brapi-section-title\">BrAPI Germplasm</h2> <div class=\"brapi-section-description\">The BrAPI Germplasm module contains entities related to germplasm management. This includes Germplasm, Germplasm Attributes, Seed Lots, Crosses, Pedigree, and Progeny</div> <div class=\"version-number\">V2.0</div> <div class=\"link-btn\"><a href=\"https://github.com/plantbreeding/API/tree/master/Specification/BrAPI-Germplasm\">GitHub</a></div> <div class=\"link-btn\"><a href=\"https://app.swaggerhub.com/apis/PlantBreedingAPI/BrAPI-Germplasm\">SwaggerHub</a></div> <div class=\"link-btn\"><a href=\"https://brapigermplasm.docs.apiary.io\">Apiary</a></div> <div class=\"stop-float\"></div> </div>  <style> .link-btn{ float: left;  margin: 2px 10px 0 0;  padding: 0 5px;  border-radius: 5px;  background-color: #ddd; } .stop-float{   clear: both; } .version-number{   float: left;    margin: 5px 10px 0 5px; } .brapi-section-title{   margin: 0 10px 0 0;   font-size: 20px; } .current-brapi-section{   font-weight: bolder;   border-radius: 5px;    background-color: #ddd; } .brapi-section{   padding: 5px 5px;  } .brapi-section-description{   margin: 5px 0 0 5px; } </style>
 *
 * OpenAPI spec version: 2.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ExternalReferences } from './externalReferences';
import { GermplasmNewRequestDonors } from './germplasmNewRequestDonors';
import { GermplasmNewRequestStorageTypes } from './germplasmNewRequestStorageTypes';
import { GermplasmNewRequestSynonyms } from './germplasmNewRequestSynonyms';
import { GermplasmOrigin } from './germplasmOrigin';
import { TaxonID } from './taxonID';

export interface GermplasmNewRequest { 
    /**
     * This is the unique identifier for accessions within a genebank, and is assigned when a sample is entered into the genebank collection  MCPD (v2.1) (ACCENUMB) 2. This is the unique identifier for accessions within a genebank, and is assigned when a sample is entered into the genebank collection (e.g. \"PI 113869\").
     */
    accessionNumber?: string;
    /**
     * The date this germplasm was acquired by the genebank   MCPD (v2.1) (ACQDATE) 12. Date on which the accession entered the collection [YYYYMMDD] where YYYY is the year, MM is the month and DD is the day. Missing data (MM or DD) should be indicated with hyphens or \"00\" [double zero].
     */
    acquisitionDate?: string;
    /**
     * Additional arbitrary info
     */
    additionalInfo?: { [key: string]: string; };
    /**
     * MCPD (v2.1) (SAMPSTAT) 19. The coding scheme proposed can be used at 3 different levels of detail: either by using the general codes such as 100, 200, 300, 400, or by using the more specific codes such as 110, 120, etc.   100) Wild  110) Natural  120) Semi-natural/wild  130) Semi-natural/sown  200) Weedy  300) Traditional cultivar/landrace  400) Breeding/research material  410) Breeders line  411) Synthetic population  412) Hybrid  413) Founder stock/base population  414) Inbred line (parent of hybrid cultivar)  415) Segregating population  416) Clonal selection  420) Genetic stock  421) Mutant (e.g. induced/insertion mutants, tilling populations)  422) Cytogenetic stocks (e.g. chromosome addition/substitution, aneuploids,  amphiploids)  423) Other genetic stocks (e.g. mapping populations)  500) Advanced or improved cultivar (conventional breeding methods)  600) GMO (by genetic engineering)  999) Other (Elaborate in REMARKS field)
     */
    biologicalStatusOfAccessionCode?: GermplasmNewRequest.BiologicalStatusOfAccessionCodeEnum;
    /**
     * Supplemental text description for 'biologicalStatusOfAccessionCode'
     */
    biologicalStatusOfAccessionDescription?: string;
    /**
     * The unique identifier for the breeding method used to create this germplasm
     */
    breedingMethodDbId?: string;
    /**
     * A specific panel/collection/population name this germplasm belongs to.
     */
    collection?: string;
    /**
     * Common name for the crop   MCPD (v2.1) (CROPNAME) 10. Common name of the crop. Example: \"malting barley\", \"mas\".
     */
    commonCropName: string;
    /**
     * 3-letter ISO 3166-1 code of the country in which the sample was originally collected   MCPD (v2.1) (ORIGCTY) 13. 3-letter ISO 3166-1 code of the country in which the sample was originally collected (e.g. landrace, crop wild relative, farmers variety), bred or selected (breeding lines, GMOs, segregating populations, hybrids, modern cultivars, etc.). Note- Descriptors 14 to 16 below should be completed accordingly only if it was \"collected\".
     */
    countryOfOriginCode?: string;
    /**
     * Human readable name used for display purposes
     */
    defaultDisplayName?: string;
    /**
     * A URL to the human readable documentation of this object
     */
    documentationURL?: string;
    /**
     * List of donor institutes
     */
    donors?: Array<GermplasmNewRequestDonors>;
    externalReferences?: ExternalReferences;
    /**
     * Genus name for taxon. Initial uppercase letter required.  MCPD (v2.1) (GENUS) 5. Genus name for taxon. Initial uppercase letter required.  MIAPPE V1.1 (DM-43) Genus - Genus name for the organism under study, according to standard scientific nomenclature.
     */
    genus?: string;
    /**
     * Name of the germplasm. It can be the preferred name and does not have to be unique.  MCPD (v2.1) (ACCENAME) 11. Either a registered or other designation given to the material received, other than the donors accession number (23) or collecting number (3). First letter uppercase. Multiple names are separated by a semicolon without space.
     */
    germplasmName: string;
    /**
     * Information for material (orchard, natural sites, ...). Geographic identification of the plants from which seeds or cutting have been taken to produce that germplasm.
     */
    germplasmOrigin?: Array<GermplasmOrigin>;
    /**
     * The Permanent Unique Identifier which represents a germplasm  MIAPPE V1.1 (DM-41) Biological material ID - Code used to identify the biological material in the data file. Should be unique within the Investigation. Can correspond to experimental plant ID, seed lot ID, etc This material identification is different from a BiosampleID which corresponds to Observation Unit or Samples sections below.  MCPD (v2.1) (PUID) 0. Any persistent, unique identifier assigned to the accession so it can be unambiguously referenced at the global level and the information associated with it harvested through automated means. Report one PUID for each accession. The Secretariat of the International Treaty on Plant Genetic Resources for Food and Agriculture (PGRFA) is facilitating the assignment of a persistent unique identifier (PUID), in the form of a DOI, to PGRFA at the accession level. Genebanks not applying a true PUID to their accessions should use, and request recipients to use, the concatenation of INSTCODE, ACCENUMB, and GENUS as a globally unique identifier similar in most respects to the PUID whenever they exchange information on accessions with third parties.
     */
    germplasmPUI: string;
    /**
     * Description of any process or treatment applied uniformly to the germplasm, prior to the study itself. Can be provided as free text or as an accession number from a suitable controlled vocabulary.
     */
    germplasmPreprocessing?: string;
    /**
     * The code for the institute that maintains the material.   MCPD (v2.1) (INSTCODE) 1. FAO WIEWS code of the institute where the accession is maintained. The codes consist of the 3-letter ISO 3166 country code of the country where the institute is located plus a number (e.g. PER001). The current set of institute codes is available from http://www.fao.org/wiews. For those institutes not yet having an FAO Code, or for those with \"obsolete\" codes, see \"Common formatting rules (v)\".
     */
    instituteCode?: string;
    /**
     * The name of the institute that maintains the material
     */
    instituteName?: string;
    /**
     * The cross name and optional selection history.  MCPD (v2.1) (ANCEST) 20. Information about either pedigree or other description of ancestral information (e.g. parent variety in case of mutant or selection). For example a pedigree 'Hanna/7*Atlas//Turk/8*Atlas' or a description 'mutation found in Hanna', 'selection from Irene' or 'cross involving amongst others Hanna and Irene'.
     */
    pedigree?: string;
    /**
     * The source of the seed 
     */
    seedSource?: string;
    /**
     * Description of the material source  MIAPPE V1.1 (DM-56) Material source description - Description of the material source
     */
    seedSourceDescription?: string;
    /**
     * Specific epithet portion of the scientific name in lowercase letters.  MCPD (v2.1) (SPECIES) 6. Specific epithet portion of the scientific name in lowercase letters. Only the following abbreviation is allowed: \"sp.\"   MIAPPE V1.1 (DM-44) Species - Species name (formally: specific epithet) for the organism under study, according to standard scientific nomenclature.
     */
    species?: string;
    /**
     * The authority organization responsible for tracking and maintaining the species name   MCPD (v2.1) (SPAUTHOR) 7. Provide the authority for the species name.
     */
    speciesAuthority?: string;
    /**
     * The type of storage this germplasm is kept in at a genebank.
     */
    storageTypes?: Array<GermplasmNewRequestStorageTypes>;
    /**
     * Subtaxon can be used to store any additional taxonomic identifier.  MCPD (v2.1) (SUBTAXA) 8. Subtaxon can be used to store any additional taxonomic identifier. The following abbreviations are allowed: \"subsp.\" (for subspecies); \"convar.\" (for convariety); \"var.\" (for variety); \"f.\" (for form); \"Group\" (for \"cultivar group\").  MIAPPE V1.1 (DM-44) Infraspecific name - Name of any subtaxa level, including variety, crossing name, etc. It can be used to store any additional taxonomic identifier. Either free text description or key-value pair list format (the key is the name of the rank and the value is the value of  the rank). Ranks can be among the following terms: subspecies, cultivar, variety, subvariety, convariety, group, subgroup, hybrid, line, form, subform. For MCPD compliance, the following abbreviations are allowed: subsp. (subspecies); convar. (convariety); var. (variety); f. (form); Group (cultivar group).
     */
    subtaxa?: string;
    /**
     * The authority organization responsible for tracking and maintaining the subtaxon information  MCPD (v2.1) (SUBTAUTHOR) 9. Provide the subtaxon authority at the most detailed taxonomic level.
     */
    subtaxaAuthority?: string;
    /**
     * List of alternative names or IDs used to reference this germplasm  MCPD (v2.1) (OTHERNUMB) 24. Any other identifiers known to exist in other collections for this accession. Use the following format: INSTCODE:ACCENUMB;INSTCODE:identifier;INSTCODE and identifier are separated by a colon without space. Pairs of INSTCODE and identifier are separated by a semicolon without space. When the institute is not known, the identifier should be preceded by a colon.
     */
    synonyms?: Array<GermplasmNewRequestSynonyms>;
    /**
     * The list of IDs for this SPECIES from different sources. If present, NCBI Taxon should be always listed as \"ncbiTaxon\" preferably with a purl. The rank of this ID should be species.  MIAPPE V1.1 (DM-42) Organism - An identifier for the organism at the species level. Use of the NCBI taxon ID is recommended.
     */
    taxonIds?: Array<TaxonID>;
}
export namespace GermplasmNewRequest {
    export type BiologicalStatusOfAccessionCodeEnum = '100' | '110' | '120' | '130' | '200' | '300' | '400' | '410' | '411' | '412' | '413' | '414' | '415' | '416' | '420' | '421' | '422' | '423' | '500' | '600' | '999';
    export const BiologicalStatusOfAccessionCodeEnum = {
        _100: '100' as BiologicalStatusOfAccessionCodeEnum,
        _110: '110' as BiologicalStatusOfAccessionCodeEnum,
        _120: '120' as BiologicalStatusOfAccessionCodeEnum,
        _130: '130' as BiologicalStatusOfAccessionCodeEnum,
        _200: '200' as BiologicalStatusOfAccessionCodeEnum,
        _300: '300' as BiologicalStatusOfAccessionCodeEnum,
        _400: '400' as BiologicalStatusOfAccessionCodeEnum,
        _410: '410' as BiologicalStatusOfAccessionCodeEnum,
        _411: '411' as BiologicalStatusOfAccessionCodeEnum,
        _412: '412' as BiologicalStatusOfAccessionCodeEnum,
        _413: '413' as BiologicalStatusOfAccessionCodeEnum,
        _414: '414' as BiologicalStatusOfAccessionCodeEnum,
        _415: '415' as BiologicalStatusOfAccessionCodeEnum,
        _416: '416' as BiologicalStatusOfAccessionCodeEnum,
        _420: '420' as BiologicalStatusOfAccessionCodeEnum,
        _421: '421' as BiologicalStatusOfAccessionCodeEnum,
        _422: '422' as BiologicalStatusOfAccessionCodeEnum,
        _423: '423' as BiologicalStatusOfAccessionCodeEnum,
        _500: '500' as BiologicalStatusOfAccessionCodeEnum,
        _600: '600' as BiologicalStatusOfAccessionCodeEnum,
        _999: '999' as BiologicalStatusOfAccessionCodeEnum
    };
}