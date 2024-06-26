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

    <WarningModal
        v-bind:active.sync="showWarningModal"
        v-bind:msg-title="'Are you sure you would like to proceed?'"
        v-on:deactivate="closeProceed()"
    >
      <section>
        <p class="has-text-dark" :class="this.$modalTextClass">
          Are you sure you would like to proceed?
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
              class="button is-danger"
              v-on:click="handleWarningModal()" :id="yesWarningId"
          >
            <strong>Yes</strong>
          </button>
          <button
              class="button"
              v-on:click="closeProceed()"
          >
            Cancel
          </button>
        </div>
      </div>
    </WarningModal>

    <template v-if="state === ImportState.CHOOSE_FILE || state === ImportState.FILE_CHOSEN">

      <slot name="importInfoTemplateMessageBox" />
      <div class="box">
        <FileSelectMessageBox v-model="file"
                              v-bind:fileTypes="'.csv, .xls, .xlsx'"
                              v-bind:errors="import_errors"
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
            v-bind:dynamicColumns="dynamicColumns"
            v-bind:abort="handleAbortEvent"
            v-bind:confirm="handleConfirmEvent"
            v-bind:confirm-import-state="confirmImportState"
            v-bind:rows="previewImport.preview !== undefined ? previewImport.preview.rows : []"
      />

      <slot name="userInput"/>

      <slot name="importPreviewTable" v-bind:import="previewData" v-bind:pagination="pagination"/>
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
import {ImportMappingConfig} from "@/breeding-insight/model/import/ImportMapping";
import {ImportService} from "@/breeding-insight/service/ImportService";
import {ImportResponse} from "@/breeding-insight/model/import/ImportResponse";
import { titleCase } from "title-case";
import {DataFormEventBusHandler} from "@/components/forms/DataFormEventBusHandler";
import {ValidationErrorService} from "@/breeding-insight/service/ValidationErrorService";
import {
  DEACTIVATE_ALL_NOTIFICATIONS
} from "@/store/mutation-types";
import { PaginationController } from '@/breeding-insight/model/view_models/PaginationController';

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
  PROCEED = "PROCEED",
  IMPORT_ERROR = "IMPORT_ERROR",
  TABLE_LOADED = "TABLE_LOADED",
  DONE = "DONE"
}

enum ImportAction {
  RESET = "RESET",
  START = "START",
  LOADED = "LOADED",
  CONFIRM = "CONFIRM",
  PROCEED = "PROCEED",
  ABORT = "ABORT",
  STOP_LOADING = "STOP_LOADING",
  DELETE = "DELETE",
  DONE_SUCCESS = "DONE_SUCCESS"
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

  @Prop({default: false})
  private showProceedWarning!: boolean;

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

  @Prop()
  userInput!: any;

  @Prop({default: 10})
  initialPageSize!: number;

  private systemImportTemplateId!: string;
  private currentImport?: ImportResponse = new ImportResponse({});
  private previewImport?: ImportResponse = new ImportResponse({});
  private previewData: any[] = [];
  private previewTotalRows: number = 0;
  private newObjectCounts: any = [];
  private dynamicColumns: string[] | undefined = [];

  private file : File | null = null;
  private import_errors: ValidationError | String | null = null;
  private activeProgram?: Program;
  private tableLoaded = false;
  private showAbortModal = false;
  private showWarningModal = false;
  private pagination = new PaginationController();

  private yesAbortId: string = "import-yes-abort";
  private yesWarningId: string = "import-yes-warning";

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
                actions: ImportAction.PROCEED
              },
              [ImportEvent.PROCEED]: {
                actions: ImportAction.CONFIRM
              },
              [ImportEvent.DONE]: {
                actions: ImportAction.DONE_SUCCESS,
                target: ImportState.CHOOSE_FILE,
              },
            }
          },
          [ImportState.IMPORT_ERROR]: {
            entry: ImportAction.RESET,
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
          [ImportAction.PROCEED]: (context, event) => {
            this.proceed();
          },
          [ImportAction.DELETE]: (context, event) => {
            this.delete();
          },
          [ImportAction.DONE_SUCCESS]: (context, event) => {
            this.finish();
          },
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
    //New button submit, clear prior notifications
    this.$store.commit( DEACTIVATE_ALL_NOTIFICATIONS );
    try {
      await this.getSystemImportTemplateMapping();
      this.import_errors=null;
      await this.uploadData();
      const response: ImportResponse = await this.updateDataUpload(this.currentImport!.importId!, false);
      if (response.progress!.statuscode == 500) {
        this.$emit('show-error-notification', 'An unknown error has occurred when processing your import.');
        this.importService.send(ImportEvent.IMPORT_ERROR);
      } else if (response.progress!.statuscode != 200) {
        this.import_errors = ImportService.parseError(response);
        if( this.import_errors==null) {
          this.$emit('show-error-notification', `Error(s) detected in file, ${this.file.name}. ${response!.progress!.message!}. Import cannot proceed.`);
        }
        else {
          this.$emit('show-error-notification', `Error(s) detected in file, ${this.file.name}. (See details below.) Import cannot proceed.`);
        }
        this.importService.send(ImportEvent.IMPORT_ERROR);
      }
      this.previewImport = response;
      // this.importService.send(ImportEvent.IMPORT_SUCCESS) is in getDataUpload()
    } catch(e) {
      let fileName = this.file.name; //capture filename before this.file is set to null.
      this.importService.send(ImportEvent.IMPORT_ERROR);
      if (e.response && e.response.status == 422 && e.response.data && e.response.data.rowErrors) {
        this.import_errors = ValidationErrorService.parseError(e);
        this.$emit('show-error-notification',`Error(s) detected in file, ${fileName}. (See details below.) Import cannot proceed.` );
      } else if (e.response && e.response.status == 422 && e.response.statusText) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Error detected in file, ${fileName}. ${e.response.statusText}. Import cannot proceed.`);
      } else if (e.response.status == 400 && e.response && e.response.data && e.response.data.message) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Error detected in file, ${fileName}. ${e.response.data.message}. Import cannot proceed.`);
      } else {
        this.$log.error(e);
        this.$emit('show-error-notification', 'An unknown error has occurred when uploading your import.');
      }
    }
  }

  handleAbortEvent() {
    this.showAbortModal = true
  }

  handleConfirmEvent() {
    this.importService.send(ImportEvent.CONFIRMED);
  }

  abort() {
    //Clear prior notifications
    this.$store.commit( DEACTIVATE_ALL_NOTIFICATIONS );

    // TODO: actually cancel request
    this.finish();
    this.showCancelledNotification();
  }

  stopLoading() {
    // upload will still be there but didn't want to wait for it to load
    this.finish();
    this.showCancelledNotification();
  }

  delete() {
    this.finish();
    this.showCancelledNotification();
  }

  showCancelledNotification() {
    this.$emit('show-info-notification', 'Import cancelled');
  }

  handleAbortModal() {
    this.showAbortModal = false;
    this.importService.send(ImportEvent.ABORT_IMPORT);
  }

  handleWarningModal() {
    this.showWarningModal = false;
    this.importService.send(ImportEvent.PROCEED);
  }

  loaded() {
    this.tableLoaded = true;
  }

  proceed() {
    if (this.showProceedWarning) {
      this.showWarningModal = true;
    } else {
      this.importService.send(ImportEvent.PROCEED);
    }
  }

  closeProceed() {
    this.showWarningModal = false;
  }

  async confirm() {
    this.confirmImportState.bus.$emit(DataFormEventBusHandler.SAVE_STARTED_EVENT);

    //New button submit, clear prior notifications
    this.$store.commit( DEACTIVATE_ALL_NOTIFICATIONS );

    const name = this.activeProgram && this.activeProgram.name ? this.activeProgram.name : 'the program';
    try {
      const response: ImportResponse = await this.updateDataUpload(this.currentImport!.importId!, true);
      if (response.progress!.statuscode == 500) {
        this.$emit('show-error-notification', 'An unknown error has occurred when processing your import.');
      } else if (response.progress!.statuscode != 200) {
        this.$emit('show-error-notification', `Error: ${response.progress!.message}`);
      } else {
        this.$emit('show-success-notification', `Imported ${this.importTypeName.toLowerCase()} records have been added to ${name}.`);
        // TODO: navigate to appropriate record list page when we have it
        this.importService.send(ImportEvent.DONE);
      }
    } catch (e) {
      if (e.response && e.response.statusText && e.response.status != 500) {
        this.$emit('show-error-notification', e.response.statusText);
      } else {
        this.$emit('show-warning-notification', 'Upload status unclear, check Jobs page for status.');
      }
    } finally {
      this.confirmImportState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
    }

  }

  reset() {
    this.file = null;
    this.tableLoaded = false;
    this.finish();
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

  async updateDataUpload(uploadId: string, commit: boolean) {
    let previewResponse: ImportResponse = await ImportService.updateDataUpload(this.activeProgram!.id!,
        this.systemImportTemplateId, uploadId!, this.userInput, commit);

    this.currentImport = previewResponse;

    // Start check for our data upload
    const includeMapping = !commit;

    return this.getDataUpload(includeMapping);
  }

  async getDataUpload(includeMapping: boolean): Promise<ImportResponse> {
    try {
      const previewResponse: ImportResponse = await ImportService.getDataUpload(this.activeProgram!.id!, this.systemImportTemplateId, this.currentImport!.importId!, includeMapping);
      this.currentImport = previewResponse;

      if (!previewResponse.progress) {
        this.$log.error('Progress object was not returned with progress response.')
        throw 'Progress object not returned';
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
            this.$emit('statistics-loaded', this.newObjectCounts);
            this.dynamicColumns = previewResponse.preview.dynamicColumnNames;
            this.$emit('preview-data-loaded', this.dynamicColumns);
            this.importService.send(ImportEvent.IMPORT_SUCCESS);
            // TODO: Temp pagination
            this.pagination.totalCount = previewResponse.preview.rows.length;
            this.pagination.pageSize = this.initialPageSize;
            this.pagination.currentPage = 1;
            this.pagination.totalPages = this.pagination.totalCount.valueOf() / this.pagination.pageSize.valueOf();
          }
        }
        return previewResponse;
      }

    } catch (e) {
      throw e;
    }
  }
  private finish() {
    this.$emit('finished');
  }
}
</script>
