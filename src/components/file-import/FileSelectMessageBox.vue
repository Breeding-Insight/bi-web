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
  <div class="file-select">
    <div>
      <article>
        <!-- Select file -->
        <nav class="level">
          <div class="level-left">
            <div v-if="file" class="level-item">
              <div
                v-bind:class="{'has-text-dark': allErrors.length <= 0, 'has-text-danger': allErrors.length > 0}" :id="importFileNameId"
            >
                {{file.name}}                  
              </div>
            </div>
            <div class="level-item">
              <div class="has-text-dark">
                <FileSelector v-model="file"
                               v-bind:fileTypes="fileTypes">
                </FileSelector>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div>
                <a v-if="file" class="button is-primary has-text-weight-bold" :id="importButtonId" v-on:click="$emit('import')">Upload & Validate</a>
              </div>
            </div>
          </div>
        </nav>
        <MultipleErrors
            v-bind:formatted-errors="allErrors"
            v-bind:is-validation-error="isValidationError"
        />
      </article>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
  import FileSelector from "@/components/file-import/FileSelector.vue";
  import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
  import { AlertTriangleIcon } from 'vue-feather-icons';
  import {AxiosResponse} from "axios";
  import {ImportService} from "@/breeding-insight/service/ImportService";
  import MultipleErrors from "@/components/file-import/MultipleErrors.vue";
  import {ImportError} from "@/breeding-insight/model/errors/ImportError";

  @Component({
    components: {
      MultipleErrors,
      FileSelector,
      AlertTriangleIcon
    }
  })
  export default class FileSelectMessageBox extends Vue {

    private fileChosen = false;
    private file : File | null = null;

    @Prop()
    private errors!: ValidationError | AxiosResponse | null;

    private importButtonId: string = "fileselectmessagebox-import-button";
    private importFileNameId: string = "fileselectmessagebox-import-filename";

    mounted() {
      this.file = this.value;
    }

    @Prop()
    private value!: File;

    @Prop()
    private fileTypes!: string[];

    @Watch('file')
    onFileChanged() {
      this.$emit('input', this.file);
    }

    get isValidationError(): boolean {
      return this.errors instanceof ValidationError;
    }

    get allErrors(): ImportError[] {
      if (this.errors != null) {
        return ImportService.formatErrors(this.errors);
      }
      return [];
    }
  }
</script>