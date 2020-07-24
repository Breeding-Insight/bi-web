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
  <div class="traits-list">
    <h1 class="title">All Traits</h1>
    <TraitListsTable
    v-on:show-success-notification="$emit('show-success-notification', $event)"
    v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
    </TraitListsTable>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import TraitListsTable from '@/components/trait/TraitListsTable.vue'
  import ProgramsBase from "@/components/program/ProgramsBase.vue";
  @Component({
    components: {
      TraitListsTable
    }
  })
  export default class TraitsList extends ProgramsBase {
  }
</script>
