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
  <label class="file-select">
    <div v-if="value" :id="chooseDiffFileId" class="button is-outlined is-primary">
      <span class="icon is-small">
        <UploadIcon
          size="1.5x"
          aria-hidden="true"
        />
      </span>
      <span>
        Choose a different file...
      </span>
    </div>
    <div v-else :id="chooseFileId" class="button is-primary">
      <span class="icon is-small">
        <UploadIcon
          size="1.5x"
          aria-hidden="true"
        />
      </span>
      <span>
        Choose a file...
      </span>
    </div>
    <input type="file" name="file" :accept=fileTypesString v-on:change="fileChanged"/>
  </label>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import {UploadIcon} from 'vue-feather-icons'

  @Component({
    components: {
      UploadIcon
    }
  })
  export default class FileSelector extends Vue {

    @Prop()
    private value!: File;

    private chooseFileId: string = "fileselector-choose-file";
    private chooseDiffFileId: string = "fileselector-choose-different-file";

    @Prop()
    private fileTypes!: string[];

    fileChanged(e: any) {
      this.$emit('input', e.target.files[0]);
    }

    get fileTypesString(): string {
      return this.fileTypes.toString();
    }

  }
</script>

<!-- keeping this scoped since it's only used here -->
<style scoped>
.file-select > input[type="file"] {
  display: none;
}
</style>
