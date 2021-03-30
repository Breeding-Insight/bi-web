<!--
  - See the NOTICE file distributed with this work for additional information regarding copyright ownership.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div>
    <div class="columns">
      <div class="column is-half">
        <BasicSelectField
            v-bind:selected-id="selectedDataTypeId"
            v-bind:field-name="'Data Type'"
            v-bind:options="dataTypeOptions"
            v-on:input="setReportType($event)"
        />
      </div>
    </div>
    <div v-if="selectedDataTypeId === 'Observation Data'">
      <div class="columns">
        <div class="column" v-if="!traitsFilterOpen && !germplasmFilterOpen">
          <div class="card">
            <div class="field has-addons card-header">
              <button class="button is-fullwidth is-justify-content-space-between" v-on:click="studyFilterOpen = !studyFilterOpen">
                <h2>Studies</h2>
                <chevron-right-icon v-if="!studyFilterOpen"/>
                <chevron-down-icon v-if="studyFilterOpen"/>
              </button>
            </div>
            <div class="card-content" v-if="studyFilterOpen">
              <div class="content">
                <div class="columns">
                  <div class="column">
                    <AutoCompleteField
                        v-bind:field-name="'Study Search'"
                        v-bind:show-label="true"
                        v-bind:field-help="'Search for studies by typing keywords'"
                        v-bind:value="studySearchVal"
                        v-bind:open-on-focus="true"
                        v-bind:clearable="true"
                        v-bind:data="filteredStudyObj()"
                        v-on:input="studySearchVal = $event"
                        v-on:select="selectedStudy = $event"
                        v-bind:field="'studyName'"
                        v-bind:custom-formatter="option => option.studyName + ' (' + option.studyDescription + ' | '+ option.studyType + ')'"
                        placeholder="Start typing to see suggestions"
                        >
                      <template slot-scope="props">
                        <div class="autocomplete-option">
                          <div>
                            <span class="has-text-weight-bold">Study:</span><span> {{props.option.studyName}}</span>
                          </div>
                          <div>
                            <span class="has-text-weight-bold">Description:</span><span> {{props.option.studyDescription}}</span>
                          </div>
                          <div>
                            <span class="has-text-weight-bold">Type:</span><span> {{props.option.studyType}}</span>
                          </div>
                          <div>
                            <span class="has-text-weight-bold">Location:</span><span> {{props.option.locationName}}</span>
                          </div>
                        </div>
                      </template>
                    </AutoCompleteField>
                  </div>
                  <div class="column is-one-fifth">
                    <button class="button is-outlined is-primary btn-add-filter" v-on:click="addStudyToFilter()">Add Study to Filter</button>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field is-grouped is-grouped-multiline">
                    <div class="control" v-for="study in selectedStudies" v-bind:key="study.studyDbId">
                      <div class="tags has-addons">
                        <span class="tag is-medium is-primary">{{ study.studyName }}</span>
                        <a class="tag is-medium is-delete" v-on:click="removeStudyFromFilter(study)"></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer class="card-footer" v-if="studyFilterOpen">
              <a href="#" class="card-footer-item" v-on:click="studyFilterOpen = !studyFilterOpen">Done</a>
              <a href="#" class="card-footer-item" v-on:click="clearStudyFilter()">Clear Filters</a>
            </footer>
          </div>
        </div>
        <div class="column" v-if="!studyFilterOpen && !germplasmFilterOpen">
          <div class="card">
            <div class="field has-addons card-header">
              <button class="button is-fullwidth is-justify-content-space-between" v-on:click="traitsFilterOpen = !traitsFilterOpen">
                <h2>Traits</h2>
                <chevron-right-icon v-if="!traitsFilterOpen"/>
                <chevron-down-icon v-if="traitsFilterOpen"/>
              </button>
            </div>
            <div class="card-content" v-if="traitsFilterOpen">
              <div class="content">
                <div class="columns">
                  <div class="column">
                    <AutoCompleteField
                        v-bind:field-name="'Trait Search'"
                        v-bind:show-label="true"
                        v-bind:field-help="'Search for traits by typing keywords'"
                        v-bind:value="traitSearchVal"
                        v-bind:open-on-focus="true"
                        v-bind:clearable="true"
                        v-bind:data="filteredTraitObj()"
                        v-on:input="traitSearchVal = $event"
                        v-on:select="selectedTrait = $event"
                        v-bind:field="'observationVariableName'"
                        v-bind:custom-formatter="option => option.observationVariableName + ' (' + option.trait.traitDescription + ')'"
                        placeholder="Start typing to see suggestions"
                    >
                      <template slot-scope="props">
                        <div class="autocomplete-option">
                          <div>
                            <span class="has-text-weight-bold">Name:</span><span> {{props.option.observationVariableName}}</span>
                          </div>
                          <div>
                            <span class="has-text-weight-bold">Description:</span><span> {{props.option.trait.traitDescription}}</span>
                          </div>
                        </div>
                      </template>
                    </AutoCompleteField>
                  </div>
                  <div class="column is-one-fifth">
                    <button class="button is-outlined is-primary btn-add-filter" v-on:click="addTraitToFilter()">Add Trait to Filter</button>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field is-grouped is-grouped-multiline">
                    <div class="control" v-for="trait in selectedTraits.values()" v-bind:key="trait.observationVariableDbId">
                      <div class="tags has-addons">
                        <span class="tag is-medium is-primary">{{ trait.observationVariableName }}</span>
                        <a class="tag is-medium is-delete" v-on:click="removeTraitFromFilter(trait)"></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer class="card-footer" v-if="traitsFilterOpen">
              <a href="#" class="card-footer-item" v-on:click="traitsFilterOpen = !traitsFilterOpen">Done</a>
              <a href="#" class="card-footer-item" v-on:click="clearTraitFilter()">Clear Filters</a>
            </footer>
          </div>
        </div>
        <div class="column" v-if="!traitsFilterOpen && !studyFilterOpen">
          <div class="card">
            <div class="field has-addons card-header">
              <button class="button is-fullwidth is-justify-content-space-between" v-on:click="germplasmFilterOpen = !germplasmFilterOpen">
                <h2>Germplasm</h2>
                <chevron-right-icon v-if="!germplasmFilterOpen"/>
                <chevron-down-icon v-if="germplasmFilterOpen"/>
              </button>
            </div>
            <div class="card-content" v-if="germplasmFilterOpen">
              <div class="content">
                <div class="columns">
                  <div class="column">
                    <AutoCompleteField
                        v-bind:field-name="'Germplasm Search'"
                        v-bind:show-label="true"
                        v-bind:field-help="'Search for germplasm by typing keywords'"
                        v-bind:value="germplasmSearchVal"
                        v-bind:open-on-focus="true"
                        v-bind:clearable="true"
                        v-bind:data="filteredGermplasmObj()"
                        v-on:input="germplasmSearchVal = $event"
                        v-on:select="selectedGermplasm = $event"
                        v-bind:field="'germplasmName'"
                        v-bind:custom-formatter="option => option.germplasmName + ' (' + option.species + ')'"
                        placeholder="Start typing to see suggestions"
                    >
                      <template slot-scope="props">
                        <div class="autocomplete-option">
                          <div>
                            <span class="has-text-weight-bold">Name:</span><span> {{props.option.germplasmName}}</span>
                          </div>
                          <div>
                            <span class="has-text-weight-bold">Species:</span><span> {{props.option.species}}</span>
                          </div>
                        </div>
                      </template>
                    </AutoCompleteField>
                  </div>
                  <div class="column is-one-fifth">
                    <button class="button is-outlined is-primary btn-add-filter" v-on:click="addGermplasmToFilter()">Add Germplasm to Filter</button>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field is-grouped is-grouped-multiline">
                    <div class="control" v-for="germplasm in selectedGermplasms.values()" v-bind:key="germplasm.germplasmDbId">
                      <div class="tags has-addons">
                        <span class="tag is-medium is-primary">{{ germplasm.germplasmName }}</span>
                        <a class="tag is-medium is-delete" v-on:click="removeGermplasmFromFilter(germplasm)"></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer class="card-footer" v-if="germplasmFilterOpen">
              <a href="#" class="card-footer-item" v-on:click="germplasmFilterOpen = !germplasmFilterOpen">Done</a>
              <a href="#" class="card-footer-item" v-on:click="clearGermplasmFilter()">Clear Filters</a>
            </footer>
          </div>
        </div>
      </div>
      <div class="columns filters" v-if="selectedStudies.length > 0 || selectedTraits.length > 0 || selectedGermplasms.length > 0">
        <h2>Filters</h2>
        <div class="column">
          <div class="field is-grouped is-grouped-multiline">
            <div class="control" v-for="study in selectedStudies" v-bind:key="study.studyDbId">
              <div class="tags has-addons">
                <span class="tag is-medium is-primary is-light">Study</span>
                <span class="tag is-medium is-primary">{{ study.studyName }}</span>
                <a class="tag is-medium is-delete" v-on:click="removeStudyFromFilter(study)"></a>
              </div>
            </div>
            <div class="control" v-for="trait in selectedTraits" v-bind:key="trait.observationVariableDbId">
              <div class="tags has-addons">
                <span class="tag is-medium is-primary is-light">Trait</span>
                <span class="tag is-medium is-primary">{{ trait.observationVariableName }}</span>
                <a class="tag is-medium is-delete" v-on:click="removeTraitFromFilter(trait)"></a>
              </div>
            </div>
            <div class="control" v-for="germplasm in selectedGermplasms" v-bind:key="germplasm.germplasmDbId">
              <div class="tags has-addons">
                <span class="tag is-medium is-primary is-light">Germplasm</span>
                <span class="tag is-medium is-primary">{{ germplasm.germplasmName }}</span>
                <a class="tag is-medium is-delete" v-on:click="removeGermplasmFromFilter(germplasm)"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <button type="button" class="button is-outlined is-primary" v-on:click="fetchObservationData()">Preview Data</button>
        </div>
      </div>
      <div class="columns" v-if="showResults">
        <div class="column">
          <b-table
              v-bind:data="observationData"
              ref="observationDataTable"
              v-bind:backend-sorting="false"
              v-bind:sort-multiple="true"
              v-bind:loading="resultsLoading"
          >

            <b-table-column field="studyDbId" label="Study" sortable v-slot="props">
              {{ programStudies.filter(value => value.studyDbId === props.row.studyDbId)[0].studyName }}
            </b-table-column>
            <b-table-column field="observationVariableName" label="Trait" sortable v-slot="props">
              {{ props.row.observationVariableName }}
            </b-table-column>
            <b-table-column field="observationUnitName" label="Observation Unit" sortable v-slot="props">
              {{ props.row.observationUnitName }}
            </b-table-column>
            <b-table-column field="value" label="Value" sortable v-slot="props">
              {{ props.row.value }}
            </b-table-column>
            <b-table-column field="collector" label="Collector" sortable v-slot="props">
              {{ props.row.collector }}
            </b-table-column>
            <b-table-column field="observationTimestamp" label="Observation Date/Time" sortable v-slot="props">
              {{ props.row.observationTimestamp }}
            </b-table-column>
            <b-table-column field="germplasmName" label="Germplasm" sortable v-slot="props">
              {{ props.row.germplasmName }}
            </b-table-column>

          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BasicSelectField from '@/components/forms/BasicSelectField.vue';
import BasicInputField from '@/components/forms/BasicInputField.vue';
import AutoCompleteField from '@/components/forms/AutoCompleteField.vue';
import { Study } from '@/breeding-insight/model/brapi/study';
import { ObservationVariable } from '@/breeding-insight/model/brapi/observationVariable';
import { ObservationSearchRequest } from '@/breeding-insight/model/brapi/observationSearchRequest';
import { Germplasm } from '@/breeding-insight/model/brapi/germplasm';
import { Location } from '@/breeding-insight/model/brapi/location';
import StyleGuide from '@/views/StyleGuide.vue';
import { ChevronDownIcon, ChevronRightIcon } from 'vue-feather-icons';
import BaseFieldWrapper from '@/components/forms/BaseFieldWrapper.vue';
import * as api from '@/util/api';
import { BiResponse, Response } from '@/breeding-insight/model/BiResponse';
import { Observation } from '@/breeding-insight/model/brapi/observation';

const BB_SERVER = "https://sweetpotatobase.org/"

@Component({
  components: { StyleGuide, AutoCompleteField, BasicInputField, BasicSelectField, ChevronRightIcon, ChevronDownIcon, BaseFieldWrapper }
})
export default class BrAPIReporter extends Vue {
  private dataTypeOptions: any[] = ['Observation Data', 'Germplasm'];

  private selectedDataTypeId: string | null = null;
  private programStudies: Study[] | null = null;
  private programTraits: ObservationVariable[] | null = null;
  private programGermplasm: Germplasm[] | null = null;
  private locations: Location[] | null = null;
  private studyFilterOpen: boolean = false;
  private traitsFilterOpen: boolean = false;
  private germplasmFilterOpen: boolean = false;

  private selectedStudies: Study[] = [];
  private selectedStudy :Study | null = null;
  private studySearchVal: string = null;

  private selectedTraits: ObservationVariable[] = []
  private selectedTrait :ObservationVariable | null = null;
  private traitSearchVal: string = null;

  private selectedGermplasms: Germplasm[] = [];
  private selectedGermplasm :Germplasm | null = null;
  private germplasmSearchVal: string = null;

  private observationData: Observation[] = [];
  private showResults: boolean = false;
  private resultsLoading: boolean = false;

  mounted() {
    this.fetchObservationFilterData();
  }

  setReportType (selection: string) {
    this.selectedDataTypeId = selection;

    // if (this.selectedDataTypeId == 'Observation Data') {
    //   this.fetchObservationFilterData();
    // }
  }

  async fetchObservationFilterData() {
    const { data: studyData } =  await api.call({
        url: `${BB_SERVER}/brapi/v2/studies`,
        method: 'get'
      }, true) as Response;
    this.programStudies = new BiResponse(studyData).result.data as Study[];

    const { data: germplasmData } = await api.call({
      url: `${BB_SERVER}/brapi/v2/germplasm?pageSize=1000`,
      method: 'get'
    }, true) as Response;
    this.programGermplasm = new BiResponse(germplasmData).result.data as Germplasm[];

    const { data: traitData } = await api.call({
      url: `${BB_SERVER}/brapi/v2/variables?pageSize=1000`,
      method: 'get'
    }, true) as Response;
    this.programTraits = new BiResponse(traitData).result.data as ObservationVariable[];
  }

  async fetchObservationData() {
    this.showResults = true;
    this.resultsLoading = true;

    const searchRequest: ObservationSearchRequest = {pageSize: 1000};

    if(this.selectedStudies.length > 0) {
      searchRequest.studyDbIds = this.selectedStudies.map(value => value.studyDbId);
    }

    if(this.selectedTraits.length > 0) {
      searchRequest.observationVariableDbIds = this.selectedTraits.map(value => value.observationVariableDbId);
    }

    if(this.selectedGermplasms.length > 0) {
      searchRequest.germplasmDbIds = this.selectedGermplasms.map(value => value.germplasmDbId);
    }

    console.log(searchRequest);

    api.call({
      url: `${BB_SERVER}/brapi/v2/search/observations`,
      method: 'post',
      data: searchRequest
    }, true).then((response: any) => {
      //todo handle 202
      api.call({
        url: `${BB_SERVER}/brapi/v2/search/observations/${response.data.result.searchResultDbId}`,
        method: 'get',
        params: {
          pageSize: 1000
        }
      }, true).then((searchResults: any) => {
        this.observationData = searchResults.data.result.data as Observation[];
        this.resultsLoading = false;
      }).catch((error) => {
        //todo
      })
    }).catch((error) => {
      //todo
    });

  }

  filteredStudyObj (): Study[] {
    if (!this.studySearchVal) {
      return this.programStudies;
    }

    return this.programStudies.filter(study => {
      return study.studyName.toLowerCase().indexOf(this.studySearchVal) >= 0
          || study.studyDescription.toLowerCase().indexOf(this.studySearchVal) >= 0
          || study.studyType.toLowerCase().indexOf(this.studySearchVal) >= 0
          || study.locationName.toLowerCase().indexOf(this.studySearchVal) >= 0;
    });
  }

  addStudyToFilter () {
    if(this.selectedStudy) {
      if (!this.selectedStudies.filter(value => value.studyDbId === this.selectedStudy.studyDbId).length > 0) {
        this.selectedStudies.push(this.selectedStudy);
      }

      this.selectedStudy = null;
      this.studySearchVal = null;
    }
  }

  removeStudyFromFilter(study: Study) {
    const index = this.selectedStudies.indexOf(study);
    if(index > -1) {
      this.selectedStudies.splice(index, 1);
    }
  }

  filteredTraitObj (): ObservationVariable[] {
    if (!this.traitSearchVal) {
      return this.programTraits;
    }

    return this.programTraits.filter(trait => {
      return trait.observationVariableName.toLowerCase().indexOf(this.traitSearchVal) >= 0
          || (trait.trait.description ? trait.trait.description.toLowerCase().indexOf(this.traitSearchVal) >= 0 : false);
    });
  }

  addTraitToFilter () {
    if(this.selectedTrait) {
      if (!this.selectedTraits.filter(value => value.observationVariableDbId === this.selectedTrait.observationVariableDbId).length > 0) {
        this.selectedTraits.push(this.selectedTrait);
      }

      this.selectedTrait = null;
      this.traitSearchVal = null;
    }
  }

  removeTraitFromFilter(trait: ObservationVariable) {
    const index = this.selectedTraits.indexOf(trait);
    if(index > -1) {
      this.selectedTraits.splice(index, 1);
    }
  }

  filteredGermplasmObj (): Germplasm[] {
    if (!this.germplasmSearchVal) {
      return this.programGermplasm;
    }

    return this.programGermplasm.filter(germplasm => {
      return germplasm.germplasmName.toLowerCase().indexOf(this.germplasmSearchVal) >= 0
          || germplasm.species.toLowerCase().indexOf(this.germplasmSearchVal) >= 0;
    });
  }

  addGermplasmToFilter () {
    if(this.selectedGermplasm) {
      if (!this.selectedGermplasms.filter(value => value.germplasmDbId === this.selectedGermplasm.germplasmDbId).length > 0) {
        this.selectedGermplasms.push(this.selectedGermplasm);
      }

      this.selectedGermplasm = null;
      this.germplasmSearchVal = null;
    }
  }

  removeGermplasmFromFilter(germplasm: Germplasm) {
    const index = this.selectedGermplasms.indexOf(germplasm);
    if(index > -1) {
      this.selectedGermplasms.splice(index, 1);
    }
  }

  clearStudyFilter () {
    this.selectedStudies = [];
  }

  clearTraitFilter () {
    this.selectedTraits = [];
  }

  clearGermplasmFilter () {
    this.selectedGermplasms = [];
  }
}

</script>

<style scoped>
.column {
  padding-top: 0;
}

.btn-add-filter {
  margin-top: 30px;
}

.card {
  overflow: initial;
}

</style>
<style>
.dropdown-item:not(:last-child) {
  border-bottom: 1px solid lightgray;
}
</style>