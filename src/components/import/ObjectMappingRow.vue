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
  <div>
    <div class="card mb-5">
      <header class="card-header">
        <h2 class="card-header-title mb-0">
          {{config.name}}
        </h2>
        <!-- TODO: Need to create a mapping for this object if it doesn't exist -->
        <button class="is-pulled-right" aria-label="edit mapping" v-on:click="$emit('focus-object', mapping.id)">
        <span>
          Edit Mapping
          <EditIcon size="1x"></EditIcon>
        </span>
        </button>
      </header>
      <!-- TODO: Get some summary in here -->
      <!--<p>{{config.description}}</p>-->
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {EditIcon} from 'vue-feather-icons';
  import {Mapping} from "@/breeding-insight/model/import/Mapping";
  import {ImportField} from "@/breeding-insight/model/import/ImportField";

  @Component({
    components: {EditIcon}
  })
  export default class ObjectMappingRow extends Vue {
    @Prop()
    config!: ImportField;
    @Prop()
    mapping!: Mapping;


  }
</script>

<style scoped>

</style>