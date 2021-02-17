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

import {ImportTypeConfig} from "@/breeding-insight/model/import/ImportTypeConfig";
import {ImportDataType} from "@/breeding-insight/model/import/ImportField";

const germplasmImport: ImportTypeConfig =  new ImportTypeConfig({
  id: '1',
  name: 'Germplasm',
  description: 'This import is used to import germplasm and to create crosses to connect germplasm together in order to construct a pedigree.',
  fields: [
    {
      name: 'Germplasm Name',
      id: 'germplasmName',
      description: 'The name of the germplasm',
      type: ImportDataType.Text,
      required: true
    },
    {
      name: 'Germplasm PUI',
      id: 'germplasmPUI',
      description: 'The personal unique identifier, or "PUI", of the germplasm. Will be set to the germplasm name if not specified.',
      type: ImportDataType.Text,
      required: false
    },
    {
      name: 'Cross Date',
      id: 'pollinationTimeStamp',
      description: 'The date that the cross occurred',
      type: ImportDataType.Date,
      required: false
    },
    {
      name: 'Cross Attributes',
      id: 'crossAttributes',
      description: 'An optional list of attributes to associate with the cross. You can have any number of these',
      type: ImportDataType.List,
      required: false,
      list_object: [
        {
          name: 'Cross Attribute Name',
          id: 'crossAttributeName',
          description: 'Name to identify the cross attribute',
          required: true
        },
        {
          name: 'Cross Attribute Value',
          id: 'crossAttributeValue',
          description: 'Value of the cross attribute',
          required: true
        },
      ]


    }
  ]
} as ImportTypeConfig);

export { germplasmImport }
