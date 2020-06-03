<!--
  - See the NOTICE file distributed with
  - this work for additional information regarding copyright ownership.
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
  <section id="emptyTableMessage">
    <div class="columns">
      <div class="column is-10">
        <slot />
      </div>
      <div class="column">
        <button
          class="button is-primary has-text-weight-bold is-pulled-right"
          v-on:click="$emit('newClick')"
          v-show="buttonViewToggle"
        >
          <span class="icon is-small">
            <PlusCircleIcon size="1.5x" aria-hidden="true"></PlusCircleIcon>
          </span>
          <span>
            {{buttonText}}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Component from "vue-class-component";
import {Prop, Vue} from "vue-property-decorator";
import {PlusCircleIcon} from 'vue-feather-icons';

@Component({
  components: {
    PlusCircleIcon
  }
})
export default class EmptyTableMessage extends Vue {
  @Prop()
  buttonViewToggle!: boolean;
  @Prop()
  buttonText!: string;
}
</script>