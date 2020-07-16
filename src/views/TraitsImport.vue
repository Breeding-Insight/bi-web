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
    <h1 class="title">Import Traits</h1>

    <template v-if="state == State.CHOOSE_FILE || state == State.FILE_CHOSEN">
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

      <article class="message is-light">
        <div class="message-body">
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
                  <a v-if="state == State.FILE_CHOSEN" class="button is-primary" v-on:click="upload">Import</a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </article>
    </template>

  </div>
</template>

<script lang="ts">
  import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
  import { mapGetters } from 'vuex'

  import ProgramsBase from "@/components/program/ProgramsBase.vue"
  import FileSelector from '@/components/forms/FileSelector.vue'

  import {ProgramUpload} from '@/breeding-insight/model/ProgramUpload'
  import {Program} from '@/breeding-insight/model/Program'
  import {TraitUploadService} from "@/breeding-insight/service/TraitUploadService";

  enum State {
    CHOOSE_FILE,
    FILE_CHOSEN,
    IMPORTING
  }

  @Component({
    components: {
      FileSelector
    },
    computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
  })
  export default class TraitsImport extends ProgramsBase {

    private State = State;
    private state: State = State.CHOOSE_FILE;
    private file : File | null = null;
    private activeProgram?: Program;

    @Watch('file')
    onFileChanged(value: string, oldValue: string) {
      this.state = State.FILE_CHOSEN;
    }

    upload() {
      TraitUploadService.uploadFile(this.activeProgram!.id!, this.file!).then((response) => {
        this.$emit('show-success-notification', 'Success! '+ this.file!.name + ' imported.');
      }).catch((error) => {
        // proper error handling is not part of ONT-21
        this.$emit('show-error-notification', error.response.statusText);
      });

    }

  }
</script>