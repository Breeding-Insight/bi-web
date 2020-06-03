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
  <form
      class="edit-form"
      novalidate="true"
  >
    <slot></slot>
    <div class="columns">
      <div class="column is-whole has-text-centered buttons">
        <button type="button" class="button is-primary" @click="$emit('submit')">
          <span class="icon is-small">
            <CheckCircleIcon size="1.5x" aria-hidden="true"></CheckCircleIcon>
            <span class="is-sr-only">Confirm Edits</span>
          </span>
          <span>
            Save
          </span>
        </button>
        <button type="button" class="button" @click="$emit('cancel')">Cancel</button>

      </div>
    </div>
  </form>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import { CheckCircleIcon } from 'vue-feather-icons';

  @Component({
      components: {CheckCircleIcon}
    }
  )
  export default class EditDataRowForm extends Vue {
  }

</script>