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
  <p
    v-if="range.total > 0"
    class="table-result-count"
    aria-live="polite"
  >
    {{ message }}
  </p>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {TableResultRange} from '@/breeding-insight/model/view_models/TableResultRange';

/**
 * The line above a table saying which rows it shows, e.g. "Showing 1–200 of 2,000 observation units".
 */
@Component
export default class TableResultCount extends Vue {

  @Prop()
  range!: TableResultRange;
  // What the table's rows are, e.g. "observation units".
  @Prop({default: 'results'})
  recordNoun!: string;
  // Singular of recordNoun, e.g. "observation unit". Defaults to recordNoun.
  @Prop()
  recordNounSingular?: string;

  get message(): string {
    const total = TableResultCount.formatNumber(this.range.total);
    const noun = this.range.total === 1 && this.recordNounSingular ? this.recordNounSingular : this.recordNoun;
    if (this.range.showAll) {
      return `Showing all ${total} ${noun}`;
    }
    const start = TableResultCount.formatNumber(this.range.start);
    const end = TableResultCount.formatNumber(this.range.end);
    const shown = this.range.start === this.range.end ? start : `${start}–${end}`;
    return `Showing ${shown} of ${total} ${noun}`;
  }

  private static formatNumber(value: number): string {
    return value.toLocaleString('en-US');
  }
}
</script>
