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
  <div class="trait-import-template">
    <article class="message is-info">
      <div class="message-body">
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <div class="has-text-dark">
                <strong>Before You Import...</strong>
                <br/>Prepare ontology information for import using the provided template.
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="has-text-dark has-text-centered is-size-7">
                <!-- temporary link until the backend card is done -->
                <a href="https://cornell.box.com/shared/static/8sp0qvccpjotosiv8576tczeg09nnvao.xls"
                  class="button is-outlined is-primary" :id="downloadTraitTemplateId">Download the Ontology Import Template</a>
                <br/>Template version placeholder
              </div>
            </div>
          </div>
        </nav>
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
  export default class TraitImportTemplateMessageBox extends Vue {

    private downloadTraitTemplateId: string = "traitimporttemplatemessagebox-download-trait-template";

  }
</script>
