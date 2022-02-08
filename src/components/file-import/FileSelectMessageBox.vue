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

        <!-- Error messages -->
        <div v-if="allErrors.length > 0" class="has-text-danger mb-6">

          <!-- Multiple errors list -->
          <template v-if="isValidationError">
            <AlertTriangleIcon size="1x" aria-hidden="true" class="has-vertical-align-middle"></AlertTriangleIcon>
            <span class="has-text-weight-bold ml-1">File contains data errors</span>
            <ul>
              <template v-if="displayAllErrors">
                <li v-for="(errorMessage, rowIndex) of allErrors" v-bind:key="rowIndex">{{errorMessage}}</li>
              </template>
              <template v-else>
                <li v-for="(errorMessage, rowIndex) of allErrors.slice(0, numDisplayedErrors)" v-bind:key="rowIndex">{{errorMessage}}</li>
              </template>
            </ul>
            <div v-if="allErrors.length > this.numDisplayedErrors">
              <template v-if="displayAllErrors">
                <a href="#" v-on:click="displayAllErrors = false" class="is-underlined">
                  &lt; Show Less Errors
                </a>
              </template>
              <template v-else>
                <span>... and {{allErrors.length - numDisplayedErrors}} more.</span>
                <a href="#" v-on:click="displayAllErrors = true" class="is-underlined ml-3">
                  View All Errors &gt;
                </a>
              </template>
            </div>
          </template>

          <!-- Single Error -->
          <template v-else>
            <AlertTriangleIcon size="1x" aria-hidden="true" class="has-vertical-align-middle"></AlertTriangleIcon>
            <span class="has-text-weight-bold ml-1">{{allErrors[0]}}</span>
          </template>

        </div>

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
                <a v-if="file" class="button is-primary has-text-weight-bold" :id="importButtonId" v-on:click="$emit('import')">Import</a>
              </div>
            </div>
          </div>
        </nav>
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

  @Component({
    components: {
      FileSelector,
      AlertTriangleIcon
    }
  })
  export default class FileSelectMessageBox extends Vue {

    private fileChosen = false;
    private file : File | null = null;

    private numDisplayedErrors: number = 10;
    private displayAllErrors: boolean = false;

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

    get allErrors(): string[] {
      let errors = [];
      if (this.isValidationError){
        const validationErrors = this.errors as ValidationError;
        if (validationErrors.rowErrors) {
          for (const error of validationErrors.rowErrors){
            if (error.errors) {
              for (const fieldError of error.errors){
                errors.push(`${fieldError.field}: ${fieldError.errorMessage} in row ${error.rowIndex}`);
              }
            }
          }
        }
        return errors;
      } else if (this.errors != null) {
        // Parse 400 responses and display the message if its not empty
        const apiResponse = this.errors as AxiosResponse;
        if (apiResponse.status && apiResponse.status === 400 &&
            apiResponse.data && apiResponse.data.message && apiResponse.data.message !== '') {
          return [apiResponse.data.message] as string[];
        }
      }

      // A catch all for anything we haven't explicitly caught
      if (this.errors) {
        return ["An unknown error has occurred"] as string[];
      }
      return [];
    }
  }
</script>