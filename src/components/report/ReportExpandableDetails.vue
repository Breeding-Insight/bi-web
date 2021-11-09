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
    <div v-for="[key, value] of Object.entries(details)" v-bind:key="key">
      <template v-if="value !== Object(value)">
        <!-- Primitive type, simple display -->
        <p>{{key}} {{value}}</p>
      </template>
      <template v-else>
        <!-- Array, parse into separate info -->
        <div v-for="[index, item] of value.entries()" v-bind:key="index">
          <!-- Check if its a string or object -->
          <template v-if="item !== Object(item)">
            <p>{{item}}</p>
          </template>
          <template v-else>
            <p v-for="[subKey, subValue] of Object.entries(item)" v-bind:key="subKey">
              {{subKey}} {{subValue}}
            </p>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

@Component({
  components: {}
})
export default class ReportExpandableDetails extends Vue {
  @Prop()
  details!: any;

  mount() {
    console.log('HERE!!')
  }
}

</script>