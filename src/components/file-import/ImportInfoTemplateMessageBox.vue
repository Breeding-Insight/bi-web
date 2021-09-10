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
  <div class="import-template">
    <article class="message is-info">
      <div class="message-body">
        <div class="columns is-vcentered">
          <div class="column">
            <div class="has-text-dark">
              <slot></slot>
            </div>
          </div>
          <div class="column is-narrow">
            <div class="has-text-dark has-text-centered is-size-7">
              <!-- temporary link until the backend card is done -->
              <a v-bind:href="templateUrl"
                 class="button is-outlined is-primary" :id="downloadTemplateId">Download the {{importTypeName}} Import Template</a>
              <br/>Template version placeholder
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {
  }
})
export default class ImportInfoTemplateMessageBox extends Vue {

  @Prop()
  templateUrl! : string;
  @Prop()
  importTypeName! : string;

  private downloadTemplateId: string = "importtemplatemessagebox-download-template";

}
</script>
