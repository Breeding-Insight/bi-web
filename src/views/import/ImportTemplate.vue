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
  <div class="template-import">
    <WarningModal
        v-bind:active.sync="showAbortModal"
        v-bind:msg-title="'Abort This Import'"
        v-on:deactivate="showAbortModal = false"
    >
      <section>
        <p class="has-text-dark" :class="this.$modalTextClass">
          {{abortMsg}}
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
              class="button is-danger"
              v-on:click="handleAbortModal()" :id="yesAbortId"
          >
            <strong>Yes, abort</strong>
          </button>
          <button
              class="button"
              v-on:click="showAbortModal = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </WarningModal>

    <template v-if="state === ImportState.CHOOSE_FILE || state === ImportState.FILE_CHOSEN">
      <h1 class="title" v-if="showTitle">{{title}}</h1>
      <slot name="importInfoTemplateMessageBox" />
      <div class="box">
        <FileSelectMessageBox v-model="file"
                              v-bind:fileTypes="'.csv, .xls, .xlsx'"
                              v-on:import="importService.send(ImportEvent.IMPORT_STARTED)"/>
      </div>
    </template>

    <template v-if="state === ImportState.IMPORTING || state === ImportState.LOADING">
      <h1 class="title">Importing...</h1>
      <ImportingMessageBox v-bind:file="file" v-on:abort="importService.send(ImportEvent.ABORT_IMPORT)"/>
    </template>

    <template v-if="state === ImportState.CURATE"> <!-- state === ImportState.LOADING ||-->
      <h1 class="title">{{toTitleCase(confirmMsg)}}</h1>

      <slot name="confirmImportMessageBox"
            v-bind:statistics="newObjectCounts"
            v-bind:abort="handleAbortEvent"
            v-bind:confirm="handleConfirmEvent"
            v-bind:confirm-import-state="confirmImportState"
            v-bind:rows="currentImport.preview.rows"
      />

      <slot name="importPreviewTable" v-bind:import="currentImport" />
    </template>

    <template v-if="state === ImportState.IMPORT_ERROR">
      <h1 class="title">Importing...</h1>
      <slot name="importInfoTemplateMessageBox" />
      <div class="box">
        <FileSelectMessageBox v-model="file"
                              v-bind:fileTypes="'.csv, .xls, .xlsx'"
                              v-bind:errors="import_errors"
                              v-bind:confirm-import-state="confirmImportState"
                              v-on:import="importService.send(ImportEvent.IMPORT_STARTED)"/>
      </div>
    </template>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import ProgramsBase from "@/components/program/ProgramsBase.vue"
import ImportingMessageBox from "@/components/file-import/ImportingMessageBox.vue";
import ConfirmImportMessageBox from "@/components/trait/ConfirmImportMessageBox.vue";
import ImportInfoTemplateMessageBox from "@/components/file-import/ImportInfoTemplateMessageBox.vue";
import FileSelectMessageBox from "@/components/file-import/FileSelectMessageBox.vue"
import WarningModal from '@/components/modals/WarningModal.vue'
import {Program} from '@/breeding-insight/model/Program'
import { createMachine, interpret } from '@xstate/fsm';
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import {AxiosResponse} from "axios";
import {ImportMappingConfig} from "@/breeding-insight/model/import/ImportMapping";
import {ImportService} from "@/breeding-insight/service/ImportService";
import {ImportResponse} from "@/breeding-insight/model/import/ImportResponse";
import { titleCase } from "title-case";
import {DataFormEventBusHandler} from "@/components/forms/DataFormEventBusHandler";

enum ImportState {
  CHOOSE_FILE = "CHOOSE_FILE",
  FILE_CHOSEN = "FILE_CHOSEN",
  IMPORTING = "IMPORTING",
  LOADING = "LOADING",
  CURATE = "CURATE",
  IMPORT_ERROR = "IMPORT_ERROR"
}

enum ImportEvent {
  FILE_SELECTED = "FILE_SELECTED",
  IMPORT_STARTED = "IMPORT_STARTED",
  ABORT_IMPORT = "ABORT_IMPORT",
  IMPORT_SUCCESS = "IMPORT_SUCCESS",
  CONFIRMED = "CONFIRMED",
  IMPORT_ERROR = "IMPORT_ERROR",
  TABLE_LOADED = "TABLE_LOADED",
  DONE = "DONE"
}

enum ImportAction {
  RESET = "RESET",
  START = "START",
  LOADED = "LOADED",
  CONFIRM = "CONFIRM",
  ABORT = "ABORT",
  STOP_LOADING = "STOP_LOADING",
  DELETE = "DELETE"
}

@Component({
  components: {
    ImportingMessageBox,
    ConfirmImportMessageBox,
    FileSelectMessageBox,
    ImportInfoTemplateMessageBox,
    WarningModal
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ImportTemplate extends ProgramsBase {

  @Prop()
  private title!: string;

  @Prop({default: true})
  private showTitle!: boolean;

  @Prop()
  private abortMsg!: string;

  @Prop()
  private confirmMsg!: string;

  @Prop()
  private systemImportTemplateName!: string;

  @Prop()
  importTypeName!: string;

  @Prop()
  confirmImportState!: DataFormEventBusHandler;

  private systemImportTemplateId!: string;
  private currentImport?: ImportResponse = new ImportResponse({});
  private previewData: any[] = [];
  private previewTotalRows: number = 0;
  private newObjectCounts: any = [];

  private file : File | null = null;
  private import_errors: ValidationError | AxiosResponse | null = null;
  private activeProgram?: Program;
  private tableLoaded = false;
  private showAbortModal = false;

  private yesAbortId: string = "import-yes-abort";

  private ImportState = ImportState;
  private ImportEvent = ImportEvent;
  private ImportAction = ImportAction;

  private state = ImportState.CHOOSE_FILE;
  private importStateMachine = createMachine({
        id: 'import',
        initial: ImportState.CHOOSE_FILE,
        states: {
          [ImportState.CHOOSE_FILE]: {
            entry: ImportAction.RESET,
            on: {
              [ImportEvent.FILE_SELECTED]: ImportState.FILE_CHOSEN
            }
          },
          [ImportState.FILE_CHOSEN]: {
            on: {
              [ImportEvent.IMPORT_STARTED]: ImportState.IMPORTING
            }
          },
          [ImportState.IMPORTING]: {
            entry: ImportAction.START,
            on: {
              [ImportEvent.ABORT_IMPORT]: {
                target: ImportState.CHOOSE_FILE,
                actions: ImportAction.ABORT
              },
              [ImportEvent.IMPORT_SUCCESS]: ImportState.CURATE,
              [ImportEvent.IMPORT_ERROR]: ImportState.IMPORT_ERROR,
            }
          },
          //TODO: This is skipped for now
          [ImportState.LOADING]: {
            on: {
              [ImportEvent.ABORT_IMPORT]: {
                target: ImportState.CHOOSE_FILE,
                actions: ImportAction.STOP_LOADING
              },
              [ImportEvent.TABLE_LOADED]: {
                target: ImportState.CURATE,
                actions: ImportAction.LOADED
              },
            }
          },
          [ImportState.CURATE]: {
            on: {
              [ImportEvent.ABORT_IMPORT]: {
                target: ImportState.CHOOSE_FILE,
                actions: ImportAction.DELETE
              },
              [ImportEvent.CONFIRMED]: {
                actions: ImportAction.CONFIRM
              },
              [ImportEvent.DONE]: {
                target: ImportState.CHOOSE_FILE,
              },
            }
          },
          [ImportState.IMPORT_ERROR]: {
            on: {
              [ImportEvent.IMPORT_STARTED]: ImportState.IMPORTING
            }
          }
        }
      },
      {
        actions: {
          [ImportAction.RESET]: (context, event) => {
            this.reset();
          },
          [ImportAction.START]: (context, event) => {
            this.upload();
          },
          [ImportAction.LOADED]: (context, event) => {
            this.loaded();
          },
          [ImportAction.ABORT]: (context, event) => {
            this.abort();
          },
          [ImportAction.STOP_LOADING]: (context, event) => {
            this.stopLoading();
          },
          [ImportAction.CONFIRM]: (context, event) => {
            this.confirm();
          },
          [ImportAction.DELETE]: (context, event) => {
            this.delete();
          }
        }

      });

  private initialState = this.importStateMachine;
  private importService = interpret(this.importStateMachine);

  created() {
    this.importService.subscribe(state => {
      this.state = ImportState[state.value as keyof typeof ImportState];
    });
    this.importService.start();
  }

  @Watch('file')
  onFileChanged(value: string, oldValue: string) {
    if (oldValue === null && value !== null) {
      this.importService.send(ImportEvent.FILE_SELECTED);
    }
  }

  toTitleCase(str: string) {
    return titleCase(str);
  }

  async upload() {

    try {
      await this.getSystemImportTemplateMapping();
      await this.uploadData();
      const response = await this.updateDataUpload(this.currentImport!.importId!, false);
      console.log(response);
      if (response.progress!.statuscode == 500) {
        this.$emit('show-error-notification', 'An unknown error has occurred when processing your import.');
        this.importService.send(ImportEvent.IMPORT_ERROR);
      } else if (response.progress!.statuscode != 200) {
        this.$emit('show-error-notification', `Error: ${response.progress!.message}`);
        this.importService.send(ImportEvent.IMPORT_ERROR);
      }
      // this.importService.send(ImportEvent.IMPORT_SUCCESS) is in getDataUpload()
    } catch(e) {
      if (e.response && e.response.status == 422 && e.response.statusText) {
        this.$log.error(e);
        this.$emit('show-error-notification', e.response.statusText);
      } else {
        this.$log.error(e);
        this.$emit('show-error-notification', 'An unknown error has occurred when uploading your import.');
      }

      this.importService.send(ImportEvent.IMPORT_ERROR);
    }
  }

  handleAbortEvent() {
    this.showAbortModal = true
  }

  handleConfirmEvent() {
    this.importService.send(ImportEvent.CONFIRMED);
  }

  abort() {
    // TODO: actually cancel request
    this.showCancelledNotification();
  }

  stopLoading() {
    // upload will still be there but didn't want to wait for it to load
    this.showCancelledNotification();
  }

  delete() {
    this.showCancelledNotification();
  }

  showCancelledNotification() {
    this.$emit('show-info-notification', 'Import cancelled');
  }

  handleAbortModal() {
    this.showAbortModal = false;
    this.importService.send(ImportEvent.ABORT_IMPORT);
  }

  loaded() {
    this.tableLoaded = true;
  }

  async confirm() {
    const name = this.activeProgram && this.activeProgram.name ? this.activeProgram.name : 'the program';
    try {
      const response = await this.updateDataUpload(this.currentImport!.importId!, true);
      if (response.progress.statuscode == 500) {
        this.$emit('show-error-notification', 'An unknown error has occurred when processing your import.');
      } else if (response.progress.statuscode != 200) {
        this.$emit('show-error-notification', `Error: ${response.progress.message}`);
      } else {
        this.$emit('show-success-notification', `Imported ${this.importTypeName.toLowerCase()} records have been added to ${name}.`);
        // TODO: navigate to appropriate record list page when we have it
        this.importService.send(ImportEvent.DONE);
      }
    } catch (e) {
      this.$emit('show-error-notification', 'An unknown error has occurred when uploading your import.');
    } finally {
      this.confirmImportState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
    }

  }

  reset() {
    this.file = null;
    this.tableLoaded = false;
  }

  async getSystemImportTemplateMapping() {
    let importMappings: ImportMappingConfig[];
    try {
      importMappings = await ImportService.getSystemMappings(this.systemImportTemplateName);
    } catch (e) {
      this.$log.error(e);
      throw 'Unable to load system import mappings';
    }

    if (importMappings.length === 1) {
      this.systemImportTemplateId = importMappings[0].id!;
    } else {
      throw 'Expected system import mapping named ' + this.systemImportTemplateName;
    }
  }

  async uploadData() {
    try {
      let previewResponse: ImportResponse = await ImportService.uploadData(this.activeProgram!.id!, this.systemImportTemplateId, this.file!, false);
      this.currentImport = previewResponse;
      // Get the import id
    } catch (e) {
      throw e;
    }
  }

  async updateDataUpload(uploadId: string, commit: boolean): ImportResponse {
    let previewResponse: ImportResponse = await ImportService.updateDataUpload(this.activeProgram!.id!, this.systemImportTemplateId, uploadId!, commit);
    this.currentImport = previewResponse;

    // Start check for our data upload
    const includeMapping = !commit;
    return this.getDataUpload(includeMapping);
  }

  async getDataUpload(includeMapping: boolean): ImportResponse {
    try {
      const previewResponse: ImportResponse = await ImportService.getDataUpload(this.activeProgram!.id!, this.systemImportTemplateId, this.currentImport!.importId!, includeMapping);
      this.currentImport = previewResponse;

      if (!previewResponse.progress) {
        this.$log.error('Progress object was not returned with progress response.')

      } else if (previewResponse.progress.statuscode === 202) {
        // Wait a second, and call GET call again
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getDataUpload(includeMapping);
      } else {
        // Our call is finished, check the response
        if (previewResponse.progress && previewResponse.progress.statuscode != 200){
          return previewResponse;
        }

        // Calculate some stuff for the preview data display
        // TODO: Add pagination to this
        if (previewResponse && previewResponse.preview){
          if (previewResponse.preview && previewResponse.preview.rows) {
            this.previewTotalRows = previewResponse.preview.rows.length;
            this.previewData = previewResponse.preview.rows as any[];
            this.newObjectCounts = previewResponse.preview.statistics;
            this.importService.send(ImportEvent.IMPORT_SUCCESS);
          }
        }
        console.log('no returned here');
        return previewResponse;
      }

    } catch (e) {
      throw e;
    }
  }

}
</script>
