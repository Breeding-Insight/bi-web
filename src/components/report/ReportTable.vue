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



-->
<template>
  <b-table
      v-bind:data="report.data"
      v-bind:columns="report.columns">
  </b-table>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {TableRow} from "@/breeding-insight/model/view_models/TableRow"
import TableColumn from "@/components/tables/TableColumn.vue";
import { VBreakpoint } from '@/components/VBreakpoint';
import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";

@Component({
  components: {}
})
export default class ReportTable extends Vue {
  @Prop()
  report!: ReportStruct;
  //TODO: Allow all other props to be passed through
}

</script>