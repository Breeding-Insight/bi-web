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

<!--
  Documentation
  -------------
  Displays brapi objects in table format. Requires a formatter to get the data into the correct
  shape. Accepts a ReportStruct as input.

  - You can define your own content for the details panel by using the 'details' slot. The details
  slot is passed the flatten brapi content, without the arrays flattened. Example:
  <template v-slot:details="row"></template>

  - If you do not specify your own details slot, this component will display all the details for you. 


-->
<template>
  <b-table
      v-bind:data="report.data"
      v-bind:columns="report.columns"
      detailed
  >

    <template #detail="props">
      <slot name="details" v-bind:row="props.row"></slot>

      <!-- Default content if slot not used -->
      <template v-if="!hasDetailSlot()">
        <div v-for="[key, value] of Object.entries(getDetails(props.row.rowId))" v-bind:key="key">
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
      </template>
    </template>
  </b-table>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";

@Component({
  components: {}
})
export default class ReportTable extends Vue {
  @Prop()
  report!: ReportStruct;
  //TODO: Allow all other props to be passed through

  getDetails(rowId: string): any {
    if (this.report.details) {
      // TODO: Remove rowId
      console.log(this.report.details[rowId]);
      return this.report.details[rowId];
    }
  }

  hasDetailSlot() {
    console.log(!!this.$slots.details);
    console.log(this.$slots);
    console.log(this.$scopedSlots);
    return !!this.$scopedSlots.details;
  }
}

</script>