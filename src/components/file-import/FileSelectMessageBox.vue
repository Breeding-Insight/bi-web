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
                               v-bind:fileTypes="fileTypes">
                </file-selector>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div>
                <a v-if="file" class="button is-primary has-text-weight-bold" v-on:click="$emit('import')">Import</a>
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

  @Component({
    components: {
      FileSelector
    }
  })
  export default class FileSelectMessageBox extends Vue {

    private fileChosen = false;
    private file : File | null = null;

    @Prop()
    private value!: File;

    @Prop()
    private fileTypes!: string[];

    @Watch('file')
    onFileChanged() {
      this.$emit('input', this.file);
    }

  }
</script>