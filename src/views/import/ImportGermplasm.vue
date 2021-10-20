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
  <div id="import-germplasm">
    <!-- TODO: add template url when ready -->
    <ImportInfoTemplateMessageBox v-bind:import-type-name="'Germplasm'"
                                  v-bind:template-url="'https://cornell.box.com/shared/static/kv3l900otsea9zm3iowp7e9umpcjvsck.xls'"
                                  class="mb-5">
      <strong>Before You Import...</strong>
      <br/>
      Any file containing germplasm names, breeding methods, and sources can be imported regardless of header format.
      The system provides guidance for matching file column headers to their appropriate database location.
      If you use the headers specified in the import template, matching will be automatic.
      Any germplasm detail (attribute or passport information) not specified in the template can be added to the
      database via customized matching in the upcoming step.
    </ImportInfoTemplateMessageBox>
    <div class="box">
      <FileSelectMessageBox v-model="file"
                            v-bind:fileTypes="'.csv, .xls, .xlsx'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import ImportInfoTemplateMessageBox from "@/components/file-import/ImportInfoTemplateMessageBox.vue";
import FileSelectMessageBox from "@/components/file-import/FileSelectMessageBox.vue";

@Component({
  components: {ImportInfoTemplateMessageBox, FileSelectMessageBox
  }
})
export default class ImportGermplasm extends ProgramsBase {

  private file : File | null = null;

}
</script>