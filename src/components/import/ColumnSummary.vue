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
    <p>We found the following columns in your file:</p>
    <div class="tags">
      <template v-for="header in columns">
              <span
                  class="tag"
                  v-bind:key="header"
              >
                {{header}}
              </span>
      </template>
    </div>
  </div>
</template>


<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {EditIcon} from 'vue-feather-icons';

  @Component({
    components: {EditIcon}
  })
  export default class ColumnSummary extends Vue {
    @Prop()
    columns!: string[];
  }
</script>