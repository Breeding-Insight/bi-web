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
  <div v-bind:class="['box', backgroundColorClass]">
    <button
      class="delete is-pulled-right has-text-right px-0"
      v-on:click="state.bus.$emit(state.closePanelEvent)"
      aria-label="close"
    />
    <slot/>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {SidePanelTableEventBusHandler} from "@/components/tables/SidePanelTableEventBus";

  @Component({
    components: {}
  })
  export default class SidePanel extends Vue {

    @Prop()
    backgroundColorClass!: string;
    @Prop()
    state!: SidePanelTableEventBusHandler;
  }
</script>
