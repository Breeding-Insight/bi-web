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
  <div class="card mb-5 expandable-card">
    <header class="card-header" v-on:click="expanded = !expanded">
      <h2 class="card-header-title mb-0">
        {{title}}
      </h2>
      <button class="card-header-icon is-button-transparent is-pulled-right" aria-label="expand" v-on:click="expanded = !expanded">
          <span class="icon">
            <PlusIcon v-if="!expanded" size="1x" aria-hidden="true"></PlusIcon>
            <MinusIcon v-if="expanded" size="1x" aria-hidden="true"></MinusIcon>
          </span>
      </button>
    </header>
    <div class="card-content" v-if="expanded">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {PlusIcon, MinusIcon} from 'vue-feather-icons';

  @Component({
    components: {PlusIcon, MinusIcon}
  })
  export default class ExpandableCard extends Vue {
    @Prop()
    title!: string;
    @Prop({default: true})
    show?: boolean;

    private expanded = true;

    mounted() {
      if(this.show !== undefined) {
        this.expanded = this.show;
      }
    }
  }

</script>