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

    <template v-slot:detail="props">
      <slot name="details" v-bind:row="props.row"></slot>

      <!-- Default content if slot not used -->
      <ReportExpandableDetails
        v-if="!hasDetailSlot()"
        v-bind:details="getDetails(props.row.rowId)"
      ></ReportExpandableDetails>
    </template>
  </b-table>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";
import ReportExpandableDetails from "@/components/report/ReportExpandableDetails.vue";

@Component({
  components: {ReportExpandableDetails}
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
    return !!this.$scopedSlots.details;
  }
}

</script>