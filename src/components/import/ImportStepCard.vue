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
  <div class="card mb-5">
    <header class="card-header">
      <h2 class="card-header-title mb-0">
        {{title}}
        <span
            v-if="completed"
            class="has-text-success ml-3"
        >
        Completed
        <CheckCircleIcon class="has-vertical-align-middle"></CheckCircleIcon>
      </span>
      </h2>
      <button class="card-header-icon is-button-transparent is-pulled-right" aria-label="more options" v-on:click="show = !show">
          <span class="icon">
            <PlusIcon v-if="!show" size="1x" aria-hidden="true"></PlusIcon>
            <MinusIcon v-if="show" size="1x" aria-hidden="true"></MinusIcon>
          </span>
      </button>
    </header>
    <div class="card-content" v-if="show">
      <div class="content">
        <slot v-if="!readonly" name="write-display"/>
        <slot v-else name="summary-display"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {PlusIcon, MinusIcon, CheckCircleIcon} from 'vue-feather-icons';

  @Component({
    components: {PlusIcon, MinusIcon, CheckCircleIcon}
  })
  export default class ImportStepCard extends Vue {
    @Prop()
    title!: string;
    @Prop()
    completed!: boolean;
    @Prop()
    readonly!: boolean;

    private show: boolean = true;

    @Watch('completed')
    watchCompleted(newVal: boolean, oldVal: boolean) {
      if (newVal === true) {
        this.show = false;
      }
    }
  }

</script>

<style scoped>
  .is-button-transparent {
    background: transparent;
    border: none;
  }
</style>