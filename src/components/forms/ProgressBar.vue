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
  <div class="progress-bar">
    <label for="progress" class="has-text-weight-bold">{{label}}</label>
    <p/> <!-- not the greatest, let me know any css recommendations -->
    <progress class="progress is-primary" id="progress" :value=value :max=max>{{valuePercent}}</progress>
    {{estimatedTimeText}}
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    components: {
    }
  })
  export default class ProgressBar extends Vue {

    @Prop()
    private value!: number;

    @Prop()
    private max!: number;

    @Prop()
    private label!: string;

    @Prop()
    private estimatedTimeText!: string;

    // will give 'undefined%' when no value has been specified 
    get valuePercent() : string {
      return this.value + "%";
    }

  }
</script>
