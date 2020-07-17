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
        <p class="has-text-dark">
          No traits will be added, and the import in progress will be completely removed.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
            class="button is-danger"
            v-on:click="handleAbortModal()"
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
    <template v-if="state === State.CHOOSE_FILE || state === State.FILE_CHOSEN">
      <h1 class="title">Import Traits</h1>
      <article class="message is-info">
        <div class="message-body">
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
                <div class="has-text-dark">
                  <strong>Before You Import...</strong>
                  <br/>Prepare trait information for import using the provided template.
                </div>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <div class="has-text-dark has-text-centered is-size-7">
                  <!-- temporary link until the backend card is done, need github access to our private repo -->
                  <a href="https://github.com/Breeding-Insight/requirements/raw/master/file-formats/bi_traits_import_template_v01.xls" 
                    class="button is-outlined is-primary">Download the Trait Import Template</a>
                  <br/>Template version placeholder
                </div>
              </div>
            </div>
          </nav>
        </div>
      </article>
      <div class="box">
        <article>
          <nav class="level">
            <div class="level-left">
              <div v-if="file" class="level-item">
                <div class="has-text-dark">
                  {{file.name}}                  
                </div>
              </div>
              <div class="level-item">
                <div class="has-text-dark">
                  <file-selector v-model="file"
                                  v-bind:fileTypes="'.csv, .xls, .xlsx'">
                  </file-selector>
                </div>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <div>
                  <a v-if="state === State.FILE_CHOSEN" class="button is-primary has-text-weight-bold" v-on:click="upload">Import</a>
                </div>
              </div>
            </div>
          </nav>
        </article>
      </div>
    </template>

    <template v-if="state === State.IMPORTING || state === State.LOADING">
      <importing-message-box v-bind:file="file" v-on:abort="abort"/>
    </template>

    <template v-if="state === State.LOADING || state === State.CURATE">
      <template v-if="tableLoaded">
        <h1 class="title">Curate and Confirm New Traits</h1>
        <article class="message is-success">
          <div class="message-body">
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <div class="has-text-dark">
                    <strong>{{numTraits}} new traits and duplicates not checked yet</strong>
                    <br/>Duplicate traits, highlighted in yellow and a X icon, will not be imported.
                    <br/>Traits in this list can be directly edited using the "Show details" link.
                  </div>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <div>
                    <button class="button is-success has-text-weight-bold" v-on:click="confirm">Confirm</button>
                  </div>
                </div>
                <div class="level-item">
                  <div>
                    <button class="button is-outlined" v-on:click="showAbortModal = true">Abort</button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </article>
      </template>
      <traits-import-table v-on:loaded="tableLoadedComplete"/>
    </template>

  </div>
</template>

<script lang="ts">
  import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
  import { mapGetters } from 'vuex'

  import ProgramsBase from "@/components/program/ProgramsBase.vue"
  import FileSelector from '@/components/forms/FileSelector.vue'
  import TraitsImportTable from "@/components/trait/TraitsImportTable.vue";
  import ImportingMessageBox from "@/components/trait/ImportingMessageBox.vue";
  import WarningModal from '@/components/modals/WarningModal.vue'

  import {ProgramUpload} from '@/breeding-insight/model/ProgramUpload'
  import {Program} from '@/breeding-insight/model/Program'
  import {TraitUploadService} from "@/breeding-insight/service/TraitUploadService";
  
  enum State {
    CHOOSE_FILE,
    FILE_CHOSEN,
    IMPORTING,
    LOADING,
    CURATE
  }

  enum Event {
    FILE_SELECTED,
    IMPORT_STARTED,
    ABORT_IMPORT,
    IMPORT_SUCCESS,
    IMPORT_ERROR,
    TABLE_LOADED
  }

  @Component({
    components: {
      FileSelector,
      TraitsImportTable,
      ImportingMessageBox,
      WarningModal
    },
    computed: {
    ...mapGetters([
      'activeProgram'
    ])
    }
  })
  export default class TraitsImport extends ProgramsBase {

    private State = State;
    private Event = Event;
    private state: State = State.CHOOSE_FILE;
    private file : File | null = null;
    private activeProgram?: Program;
    private tableLoaded = false;
    private numTraits = 0;
    private showAbortModal = false;

    @Watch('file')
    onFileChanged(value: string, oldValue: string) {
      if (oldValue === null && value !== null) {
        this.updateState(Event.FILE_SELECTED);
      }
    }

    upload() {
      this.updateState(Event.IMPORT_STARTED);
      TraitUploadService.uploadFile(this.activeProgram!.id!, this.file!).then((response) => {
        this.numTraits = response.data!.length;
        this.updateState(Event.IMPORT_SUCCESS);
      }).catch((error) => {
        // proper error handling is not part of ONT-21
        this.$emit('show-error-notification', error.response.statusText);
        this.updateState(Event.IMPORT_ERROR);
      });
    }

    abort() {
      // TODO: actually cancel request
      this.$emit('show-info-notification', 'Import cancelled');
      this.updateState(Event.ABORT_IMPORT);
    }

    handleAbortModal() {
      this.showAbortModal = false;
      // TODO: call DELETE /trait-upload
      this.abort();
    }

    tableLoadedComplete() {
      this.tableLoaded = true;
      this.updateState(Event.TABLE_LOADED);
    }

    confirm() {
      //TODO POST /traits
    }

    updateState(event: Event) {
      console.log(event);
      switch(this.state) {
        case State.CHOOSE_FILE:
          if (event === Event.FILE_SELECTED) {
            this.state = State.FILE_CHOSEN;
          }
          break;
        case State.FILE_CHOSEN:
          if (event === Event.IMPORT_STARTED) {
            this.state = State.IMPORTING;
          }
          break;
        case State.IMPORTING:
          if (event === Event.ABORT_IMPORT) {
            this.state = State.CHOOSE_FILE;
          }
          else if (event === Event.IMPORT_SUCCESS) {
            this.state = State.LOADING;
          }
          else if (event === Event.IMPORT_ERROR) {
            // TODO: transition to error page view
            this.state = State.CHOOSE_FILE;
          }
          break;
        case State.LOADING:
          if (event === Event.ABORT_IMPORT) {
            this.state = State.CHOOSE_FILE;
          }
          if (event === Event.TABLE_LOADED) {
            this.state = State.CURATE;
          }
          break;
        case State.CURATE:
          if (event === Event.ABORT_IMPORT) {
            this.state = State.CHOOSE_FILE;
          }
          break;
      }
      this.onEnterActions();
    }

    onEnterActions() {
      switch(this.state) {
        case State.CHOOSE_FILE:
          this.onEnterChooseFile();
          break;
      } 
    }

    onEnterChooseFile() {
      console.log('onEnterChooseFile');
      this.file = null;
      this.tableLoaded = false;
    }


  }
</script>