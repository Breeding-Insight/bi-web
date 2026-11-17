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
    v-if="!loading && range.total > 0"
    class="table-result-count"
    aria-live="polite"
  >
    {{ message }}
  </p>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {TableResultRange} from '@/breeding-insight/model/view_models/TableResultRange';
import {StringFormatters} from '@/breeding-insight/utils/StringFormatters';

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
  // Hides the line while the table's rows are loading.
  @Prop({default: false})
  loading!: boolean;

  get message(): string {
    const format = StringFormatters.formatCount;
    const total = format(this.range.total);
    if (this.range.filteredOnPage) {
      const matched = this.range.matchedOnPage as number;
      return `Showing ${format(matched)} matching ${this.noun(matched)} of the ${format(this.range.pageCount as number)} on this page (${total} in all)`;
    }
    const noun = this.noun(this.range.total);
    if (this.range.showAll) {
      return `Showing all ${total} ${noun}`;
    }
    const start = format(this.range.start);
    const shown = this.range.start === this.range.end ? start : `${start}–${format(this.range.end)}`;
    return `Showing ${shown} of ${total} ${noun}`;
  }

  private noun(count: number): string {
    return count === 1 && this.recordNounSingular ? this.recordNounSingular : this.recordNoun;
  }
}
</script>
