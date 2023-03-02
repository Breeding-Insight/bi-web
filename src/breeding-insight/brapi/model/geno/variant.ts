/**
 * BrAPI-Genotyping
 * The Breeding API (BrAPI) is a Standardized REST ful Web Service API Specification for communicating Plant Breeding Data. BrAPI allows for easy data sharing between databases and tools involved in plant breeding. <div class=\"brapi-section\"> <h2 class=\"brapi-section-title\">General Reference Documentation</h2> <div class=\"gen-info-link\"><a href=\"https://wiki.brapi.org/index.php/RESTfulness\">URL Structure</a></div> <div class=\"gen-info-link\"><a href=\"https://wiki.brapi.org/index.php/Response_Structure\">Response Structure</a></div> <div class=\"gen-info-link\"><a href=\"https://wiki.brapi.org/index.php/Dates_and_Times\">Date/Time Encoding</a></div> <div class=\"gen-info-link\"><a href=\"https://wiki.brapi.org/index.php/Location_Coordinates\">Location Encoding</a></div> <div class=\"gen-info-link\"><a href=\"https://wiki.brapi.org/index.php/Error_Handling\">Error Handling</a></div> <div class=\"gen-info-link\"><a href=\"https://wiki.brapi.org/index.php/Search_Services\">Search Services</a></div> </div>  <div class=\"brapi-section\"> <h2 class=\"brapi-section-title\">BrAPI Core</h2> <div class=\"brapi-section-description\">The BrAPI Core module contains high level entities used for organization and management. This includes Programs, Trials, Studies, Locations, People, and Lists</div> <div class=\"version-number\">V2.1</div> <div class=\"link-btn\"><a href=\"https://github.com/plantbreeding/API/tree/brapi-V2.1/Specification/BrAPI-Core\">GitHub</a></div> <div class=\"link-btn\"><a href=\"https://app.swaggerhub.com/apis/PlantBreedingAPI/BrAPI-Core/2.1\">SwaggerHub</a></div> <div class=\"link-btn\"><a href=\"https://brapicore21.docs.apiary.io\">Apiary</a></div> <div class=\"stop-float\"></div> </div>  <div class=\"brapi-section\"> <h2 class=\"brapi-section-title\">BrAPI Phenotyping</h2> <div class=\"brapi-section-description\">The BrAPI Phenotyping module contains entities related to phenotypic observations. This includes Observation Units, Observations, Observation Variables, Traits, Scales, Methods, and Images</div> <div class=\"version-number\">V2.1</div> <div class=\"link-btn\"><a href=\"https://github.com/plantbreeding/API/tree/brapi-V2.1/Specification/BrAPI-Phenotyping\">GitHub</a></div> <div class=\"link-btn\"><a href=\"https://app.swaggerhub.com/apis/PlantBreedingAPI/BrAPI-Phenotyping/2.1\">SwaggerHub</a></div> <div class=\"link-btn\"><a href=\"https://brapiphenotyping21.docs.apiary.io\">Apiary</a></div> <div class=\"stop-float\"></div> </div>  <div class=\"current-brapi-section brapi-section\"> <h2 class=\"brapi-section-title\">BrAPI Genotyping</h2> <div class=\"brapi-section-description\">The BrAPI Genotyping module contains entities related to genotyping analysis. This includes Samples, Markers, Variant Sets, Variants, Call Sets, Calls, References, Reads, and Vendor Orders</div> <div class=\"version-number\">V2.1</div> <div class=\"link-btn\"><a href=\"https://github.com/plantbreeding/API/tree/brapi-V2.1/Specification/BrAPI-Genotyping\">GitHub</a></div> <div class=\"link-btn\"><a href=\"https://app.swaggerhub.com/apis/PlantBreedingAPI/BrAPI-Genotyping/2.1\">SwaggerHub</a></div> <div class=\"link-btn\"><a href=\"https://brapigenotyping21.docs.apiary.io\">Apiary</a></div> <div class=\"stop-float\"></div> </div>  <div class=\"brapi-section\"> <h2 class=\"brapi-section-title\">BrAPI Germplasm</h2> <div class=\"brapi-section-description\">The BrAPI Germplasm module contains entities related to germplasm management. This includes Germplasm, Germplasm Attributes, Seed Lots, Crosses, Pedigree, and Progeny</div> <div class=\"version-number\">V2.1</div> <div class=\"link-btn\"><a href=\"https://github.com/plantbreeding/API/tree/brapi-V2.1/Specification/BrAPI-Germplasm\">GitHub</a></div> <div class=\"link-btn\"><a href=\"https://app.swaggerhub.com/apis/PlantBreedingAPI/BrAPI-Germplasm/2.1\">SwaggerHub</a></div> <div class=\"link-btn\"><a href=\"https://brapigermplasm21.docs.apiary.io\">Apiary</a></div> <div class=\"stop-float\"></div> </div>  <style> .link-btn{ float: left;  margin: 2px 10px 0 0;  padding: 0 5px;  border-radius: 5px;  background-color: #ddd; } .stop-float{   clear: both; } .version-number{   float: left;    margin: 5px 10px 0 5px; } .brapi-section-title{   margin: 0 10px 0 0;   font-size: 20px; } .current-brapi-section{   font-weight: bolder;   border-radius: 5px;    background-color: #ddd; } .brapi-section{   padding: 5px 5px;  } .brapi-section-description{   margin: 5px 0 0 5px; } </style>
 *
 * OpenAPI spec version: 2.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ExternalReferences } from './externalReferences';

/**
 * A `Variant` represents a change in DNA sequence relative to some reference. For example, a variant could represent a classic marker, a SNP, or an insertion. This is equivalent to a row in VCF.
 */
export interface Variant { 
    /**
     * A free space containing any additional information related to a particular object. A data source may provide any JSON object, unrestriced by the BrAPI specification.
     */
    additionalInfo?: { [key: string]: string; };
    /**
     * The bases that appear instead of the reference bases. Multiple alternate alleles are possible.
     */
    alternateBases?: Array<string>;
    /**
     * **Deprecated in v2.1** Please use `alternateBases`. Github issue number #549 <br>The bases that appear instead of the reference bases. Multiple alternate alleles are possible.
     */
    alternateBases?: Array<string>;
    /**
     * Similar to \"cipos\", but for the variant's end position (which is derived from start + svlen).
     */
    ciend?: Array<number>;
    /**
     * In the case of structural variants, start and end of the variant may not be known with an exact base position. \"cipos\" provides an interval with high confidence for the start position. The interval is provided by 0 or 2 signed integers which are added to the start position. Based on the use in VCF v4.2
     */
    cipos?: Array<number>;
    /**
     * The timestamp when this variant was created.
     */
    created?: Date;
    /**
     * This field is optional and may be ignored if there is no relevant map or reference to be associated with. <br>The end position (exclusive), resulting in [start, end) closed-open interval. This is typically calculated  by `start + referenceBases.length`.
     */
    end?: number;
    externalReferences?: ExternalReferences;
    /**
     * True if filters were applied for this variant. VCF column 7 \"FILTER\" any value other than the missing value.
     */
    filtersApplied?: boolean;
    /**
     * Zero or more filters that failed for this variant. VCF column 7 \"FILTER\" shared across all alleles in the same VCF record.
     */
    filtersFailed?: Array<string>;
    /**
     * True if all filters for this variant passed. VCF column 7 \"FILTER\" value PASS.
     */
    filtersPassed?: boolean;
    /**
     * The reference bases for this variant. They start at the given start position.
     */
    referenceBases?: string;
    /**
     * The unique identifier for a Reference
     */
    referenceDbId?: string;
    /**
     * The reference on which this variant occurs. (e.g. `chr_20` or `X`)
     */
    referenceName?: string;
    /**
     * The unique identifier for a ReferenceSet
     */
    referenceSetDbId?: string;
    /**
     * The human readable name of the ReferenceSet
     */
    referenceSetName?: string;
    /**
     * This field is optional and may be ignored if there is no relevant map or reference to be associated with. <br> The start position at which this variant occurs (0-based). This corresponds to the first base of the string  of reference bases. Genomic positions are non-negative integers less than reference length. Variants spanning  the join of circular genomes are represented as two variants one on each side of the join (position 0).
     */
    start?: number;
    /**
     * Length of the - if labeled as such in variant_type - structural variation. Based on the use in VCF v4.2
     */
    svlen?: number;
    /**
     * The time at which this variant was last updated.
     */
    updated?: Date;
    /**
     * The ID which uniquely identifies a `Variant`
     */
    variantDbId?: string;
    /**
     * A human readable name associated with a `Variant`
     */
    variantNames?: Array<string>;
    /**
     * An array of `VariantSet` IDs this variant belongs to. This also defines the `ReferenceSet` against which the `Variant` is to be interpreted.
     */
    variantSetDbId?: Array<string>;
    /**
     * The \"variant_type\" is used to denote e.g. structural variants. Examples:   DUP  : duplication of sequence following \"start\"   DEL  : deletion of sequence following \"start\"
     */
    variantType?: string;
}