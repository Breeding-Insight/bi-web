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
  <div class="traits-import">
    <WarningModal
      v-bind:active.sync="showAbortModal"
      v-bind:msg-title="'Abort This Import'"
      v-on:deactivate="showAbortModal = false"
    >
      <section>
        <p class="has-text-dark" :class="this.$modalTextClass">
          No ontology terms will be added, and the import in progress will be completely removed.
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
      <h1 class="title" v-if="showTitle">Import Ontology</h1>
      <ImportInfoTemplateMessageBox v-bind:import-type-name="'Ontology'"
                                    v-bind:template-url="'https://cornell.box.com/shared/static/pdphm5nr8vd6wc60n2cg6bvtndmkg4vr.xls'"
                                    class="mb-5">
        <strong>Before You Import...</strong>
        <br/>Prepare ontology information for import using the provided template.
      </ImportInfoTemplateMessageBox>
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
    
    <template v-if="state === ImportState.LOADING || state === ImportState.CURATE">
      <template v-if="tableLoaded">
        <h1 class="title">Confirm New Ontology Term</h1>
        <ConfirmImportMessageBox v-bind:num-traits="numTraits"
                                    v-on:abort="showAbortModal = true" 
                                    v-on:confirm="importService.send(ImportEvent.CONFIRMED)"
                                    class="mb-4"/>
      </template>
      <TraitsImportTable v-on:loaded="importService.send(ImportEvent.TABLE_LOADED)"/>
    </template>

    <template v-if="state === ImportState.IMPORT_ERROR">
        <h1 class="title">Importing...</h1>
      <TraitImportTemplateMessageBox class="mb-5"/>
        <div class="box">
          <FileSelectMessageBox v-model="file"
                                v-bind:fileTypes="'.csv, .xls, .xlsx'"
                                v-bind:errors="import_errors"
                                v-on:import="importService.send(ImportEvent.IMPORT_STARTED)"/>
        </div>
    </template>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import ProgramsBase from "@/components/program/ProgramsBase.vue"
import TraitsImportTable from "@/components/trait/TraitsImportTable.vue";
import ImportingMessageBox from "@/components/file-import/ImportingMessageBox.vue";
import ConfirmImportMessageBox from "@/components/trait/ConfirmImportMessageBox.vue";
import ImportInfoTemplateMessageBox from "@/components/file-import/ImportInfoTemplateMessageBox.vue";
import FileSelectMessageBox from "@/components/file-import/FileSelectMessageBox.vue"
import WarningModal from '@/components/modals/WarningModal.vue'

import {Program} from '@/breeding-insight/model/Program'
import {TraitUploadService} from "@/breeding-insight/service/TraitUploadService";
import {TraitService} from "@/breeding-insight/service/TraitService";

import { createMachine, interpret } from '@xstate/fsm';
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {Trait} from "@/breeding-insight/model/Trait";
import {ProgramUpload} from "@/breeding-insight/model/ProgramUpload";
import {AxiosResponse} from "axios";

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
  TABLE_LOADED = "TABLE_LOADED"
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
    TraitsImportTable,
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
export default class TraitsImport extends ProgramsBase {

  @Prop({default: true})
  private showTitle! : boolean;

  private file : File | null = null;
  private import_errors: ValidationError | AxiosResponse | null = null;
  private activeProgram?: Program;
  private tableLoaded = false;
  private numTraits = 0;
  private showAbortModal = false;

  private yesAbortId: string = "traitsimport-yes-abort";
  
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
          [ImportEvent.IMPORT_SUCCESS]: ImportState.LOADING,
          [ImportEvent.IMPORT_ERROR]: ImportState.IMPORT_ERROR,
        }
      },
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

  upload() {
    TraitUploadService.uploadFile(this.activeProgram!.id!, this.file!).then((response) => {
      this.numTraits = response.data!.length;
      this.importService.send(ImportEvent.IMPORT_SUCCESS);
    }).catch((error: ValidationError | AxiosResponse) => {
      this.import_errors = error;
      this.importService.send(ImportEvent.IMPORT_ERROR);
    });
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
    // TODO: call DELETE /trait-upload
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
      // fetch uploaded traits
      const [ upload ] = await TraitUploadService.getTraits(this.activeProgram!.id!) as [ProgramUpload, Metadata];
      await TraitUploadService.confirmUpload(this.activeProgram!.id!, upload!.id!);

      // show all program traits
      this.$emit('show-success-notification', `Imported ontology terms have been added to ${name}.`);
      this.$router.push({
        name: 'traits-list',
        params: {
          programId: this.activeProgram!.id!
        },
      });
    } catch(err) {
      const note = err.message ? err.message : `Error: Imported ontology terms were not added to ${name}.`;
      this.$emit('show-error-notification', `${note}`);
      Vue.$log.error(err);
    }
  }

  reset() {
    this.file = null;
    this.tableLoaded = false;
  }

}
</script>
