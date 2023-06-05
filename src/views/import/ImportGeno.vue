<!--
  - See the NOTICE file distributed with this work for additional information
  - regarding copyright ownership.
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
  <div id="import-geno">
    <div class="import-template">
      <article class="message is-info">
        <div class="message-body">
          <div class="columns is-vcentered">
            <div class="column">
              <div class="has-text-dark">
                <strong>Before You Import...</strong>
                <br/>
                Ensure that Sample IDs match to an Exp Unit ID within the chosen experiment
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
    <article class="message is-warning" v-if="importState.saveStarted">
      <div class="message-body">
        Your import is being processed. You can view its progress by going to the <router-link v-bind:to="{name: 'job-management', params:{programId: activeProgram.id}}">Jobs</router-link> page.
      </div>
    </article>
    <div class="card import-form">
      <div class="card-content">
        <NewDataForm
            v-bind:row-validations="uploadValidations"
            v-bind:new-record.sync="upload"
            v-bind:data-form-state="importState"
            v-bind:save-button-label="'Import'"
            v-bind:show-cancel-button="false"
            v-on:submit="save"
            v-on:cancel="cancel"
            v-on:show-error-notification="$emit('show-error-notification', $event)"
        >
          <template v-slot="validations">
            <div class="columns is-vcentered">
              <div class="column">
                <BasicSelectField
                    v-model="upload.experimentId"
                    v-bind:validations="validations.experimentId"
                    v-bind:options="experimentOptions"
                    v-bind:field-name="'Experiment'"
                />
              </div>
            </div>
            <div class="columns">
              <div class="column file-selector">
                <div v-if="upload.file">
                  <div id="fileselectmessagebox-import-filename">
                    {{upload.file.name}}
                  </div>
                </div>
                <FileSelector v-model="upload.file"
                              v-bind:fileTypes="['.vcf']">
                </FileSelector>
              </div>
            </div>
          </template>
        </NewDataForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import ProgramsBase from '@/components/program/ProgramsBase.vue';
import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
import { Trial } from '@/breeding-insight/model/Trial';
import { mapGetters } from 'vuex';
import { Program } from '@/breeding-insight/model/Program';
import { BrAPIService, BrAPIType } from '@/breeding-insight/service/BrAPIService';
import { SortOrder } from '@/breeding-insight/model/Sort';
import NewDataForm from '@/components/forms/NewDataForm.vue';
import BasicInputField from '@/components/forms/BasicInputField.vue';
import BasicSelectField from '@/components/forms/BasicSelectField.vue';
import FileSelector from '@/components/file-import/FileSelector.vue';
import { BrAPIUtils } from '@/breeding-insight/utils/BrAPIUtils';
import { required } from 'vuelidate/lib/validators';
import { ImportResponse } from '@/breeding-insight/model/import/ImportResponse';
import { GenoService } from '@/breeding-insight/service/GenoService';
import { DEACTIVATE_ALL_NOTIFICATIONS } from '@/store/mutation-types';
import { ImportMappingConfig } from '@/breeding-insight/model/import/ImportMapping';
import { ImportService } from '@/breeding-insight/service/ImportService';

@Component({
  components: {
    NewDataForm, BasicInputField, BasicSelectField, FileSelector
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ImportExperiment extends ProgramsBase {
  private activeProgram?: Program;
  private experimentOptions: Array<ExperimentOption> = [];
  private importState: DataFormEventBusHandler = new DataFormEventBusHandler();
  private currentImport?: ImportResponse = new ImportResponse({});
  private systemImportTemplateId?: string;

  upload: Upload = new Upload({});

  uploadValidations = {
    experimentId: {required},
    file: {required}
  }

  mounted() {
    this.loadExperiments();
    this.getSystemImportTemplateMapping();
  }

  async loadExperiments () {
    let expResponse = await BrAPIService.get(BrAPIType.EXPERIMENT, this.activeProgram!.id!, { field: undefined, order: SortOrder.Ascending }, { page: 0, pageSize: 1000 }, {"metadata": false});
    if (expResponse.result && expResponse.result.data) {
      this.experimentOptions = expResponse.result.data.map((exp: Trial) => {
        let breedingInsightId = BrAPIUtils.getBreedingInsightId(exp.externalReferences!, "/trials");
        return new ExperimentOption({
          id: breedingInsightId!,
          name: exp.trialName!
        });
      });
      this.$log.debug(JSON.stringify(this.experimentOptions));
    }
  }

  async save() {
    try {
      this.$store.commit( DEACTIVATE_ALL_NOTIFICATIONS );
      this.currentImport = await GenoService.uploadData(this.activeProgram!.id!, this.upload.experimentId!, this.upload.file!);
      const response: ImportResponse = await this.getDataUpload();
      if (response.progress!.statuscode == 500) {
        this.$emit('show-error-notification', 'An unknown error has occurred when processing your import.');
      } else if (response.progress!.statuscode !== 200) {
        this.$emit('show-error-notification', `Error: ${response.progress!.message}`);
      } else {
        this.$emit('show-success-notification', `Genotypic data has uploaded and is being processed.  Check the 'Jobs' page for processing status`);
      }
    } catch (e) {
      if (e.response && e.response.statusText && e.response.status != 500) {
        this.$emit('show-error-notification', e.response.statusText);
      } else {
        this.$emit('show-error-notification', 'An unknown error has occurred when uploading your import.');
      }
    } finally {
      this.importState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
    }
  }

  cancel() {
    this.upload = new Upload({});
  }

  async getSystemImportTemplateMapping() {
    let importMappings: ImportMappingConfig[];
    try {
      importMappings = await ImportService.getSystemMappings('GenotypicDataImport');
    } catch (e) {
      this.$log.error(e);
      throw 'Unable to load system import mappings';
    }

    if (importMappings.length === 1) {
      this.systemImportTemplateId = importMappings[0].id!;
    } else {
      throw 'Expected system import mapping named GenotypicDataImport';
    }
  }

  async getDataUpload(): Promise<ImportResponse> {
    try {
      const previewResponse: ImportResponse = await ImportService.getDataUpload(this.activeProgram!.id!, this.systemImportTemplateId!, this.currentImport!.importId!, false);
      this.currentImport = previewResponse;

      if (!previewResponse.progress) {
        this.$log.error('Progress object was not returned with progress response.')
        throw 'Progress object not returned';
      } else if (previewResponse.progress.statuscode === 202) {
        // Wait a second, and call GET call again
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getDataUpload();
      }

      return previewResponse;
    } catch (e) {
      throw e;
    }
  }

}

class ExperimentOption {
  id: string;
  name: string;

  constructor({id, name}: ExperimentOption) {
    this.id = id;
    this.name = name;
  }
}

class Upload {
  experimentId?: string;
  file?: File;

  constructor ({experimentId, file}: Upload) {
    this.experimentId = experimentId;
    this.file = file;
  }
}
</script>

<style scoped>
.file-selector {
  padding-top: 30px;
}
</style>
