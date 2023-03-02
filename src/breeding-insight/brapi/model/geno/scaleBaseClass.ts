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
import { ExternalReferencesInner } from './externalReferencesInner';
import { MethodBaseClassOntologyReference } from './methodBaseClassOntologyReference';
import { ScaleBaseClassValidValues } from './scaleBaseClassValidValues';

/**
 * A Scale describes the units and acceptable values for an ObservationVariable.  <br>For example, an ObservationVariable might be defined with a Trait of \"plant height\", a Scale of \"meters\", and a Method of \"tape measure\". This variable would be distinct from a variable with the Scale \"inches\" or \"pixels\".
 */
export interface ScaleBaseClass { 
    /**
     * A free space containing any additional information related to a particular object. A data source may provide any JSON object, unrestriced by the BrAPI specification.
     */
    additionalInfo?: { [key: string]: string; };
    /**
     * <p>Class of the scale, entries can be</p> <p>\"Code\" -  This scale class is exceptionally used to express complex traits. Code is a nominal scale that combines the expressions of the different traits composing the complex trait. For example a severity trait might be expressed by a 2 digit and 2 character code. The first 2 digits are the percentage of the plant covered by a fungus and the 2 characters refer to the delay in development, e.g. \"75VD\" means \"75 %\" of the plant is infected and the plant is very delayed.</p> <p>\"Date\" - The date class is for events expressed in a time format, See ISO 8601</p> <p>\"Duration\" - The Duration class is for time elapsed between two events expressed in a time format, e.g. days, hours, months</p> <p>\"Nominal\" - Categorical scale that can take one of a limited and fixed number of categories. There is no intrinsic ordering to the categories</p> <p>\"Numerical\" - Numerical scales express the trait with real numbers. The numerical scale defines the unit e.g. centimeter, ton per hectare, branches</p> <p>\"Ordinal\" - Ordinal scales are scales composed of ordered categories</p> <p>\"Text\" - A free text is used to express the trait.</p>
     */
    dataType?: ScaleBaseClass.DataTypeEnum;
    /**
     * For numerical, number of decimal places to be reported
     */
    decimalPlaces?: number;
    /**
     * An array of external reference ids. These are references to this piece of data in an external system. Could be a simple string or a URI.
     */
    externalReferences?: Array<ExternalReferencesInner>;
    ontologyReference?: MethodBaseClassOntologyReference;
    /**
     * Name of the scale <br/>MIAPPE V1.1 (DM-92) Scale Name of the scale associated with the variable
     */
    scaleName: string;
    /**
     * The Permanent Unique Identifier of a Scale, usually in the form of a URI
     */
    scalePUI?: string;
    /**
     * This field can be used to describe the units used for this scale. This should be the abbreviated  form of the units, intended to be displayed with every value using this scale. Usually this only  applies when `dataType` is Numeric, but could also be included for other dataTypes when applicable.
     */
    units?: string;
    validValues?: ScaleBaseClassValidValues;
}
export namespace ScaleBaseClass {
    export type DataTypeEnum = 'Code' | 'Date' | 'Duration' | 'Nominal' | 'Numerical' | 'Ordinal' | 'Text';
    export const DataTypeEnum = {
        Code: 'Code' as DataTypeEnum,
        Date: 'Date' as DataTypeEnum,
        Duration: 'Duration' as DataTypeEnum,
        Nominal: 'Nominal' as DataTypeEnum,
        Numerical: 'Numerical' as DataTypeEnum,
        Ordinal: 'Ordinal' as DataTypeEnum,
        Text: 'Text' as DataTypeEnum
    };
}