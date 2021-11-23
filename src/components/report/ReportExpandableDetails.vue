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
    <div v-for="[key, value] of Object.entries(getDisplayedDetails())" v-bind:key="key">
      <template v-if="value !== Object(value)">
        <!-- Primitive type, simple display -->
        <div class="columns is-centered is-mobile is-variable is-0 mt-5 my-0">
          <div class="column is-one-quarter p-0">
            <span class="is-pulled-left has-text-weight-bold mr-2">{{getDisplayName(key)}}</span>
          </div>
          <div class="column is-three-quarters p-0">
            <span class="is-size-7 ml-2 is-pulled-left">{{ value }}</span>
          </div>
        </div>
      </template>
      <!-- Primitive array type -->
      <template v-else-if="value.length > 0 && value[0] !== Object(value[0])">
        <div class="columns is-centered is-mobile is-variable is-0 mt-5 my-0">
          <div class="column is-one-quarter p-0">
            <span class="is-pulled-left has-text-weight-bold mr-2">{{getDisplayName(key)}}</span>
          </div>
          <div class="column is-three-quarters p-0">
            <template v-for="[index, item] of value.entries()">
              <span class="is-size-7 ml-2 is-pulled-left" v-bind:key="index">
                {{ item }} {{ !lastElement(index, value.length) ? ',' : undefined }}
              </span>
            </template>
          </div>
        </div>
      </template>
      <!-- Array of objects -->
      <template v-else>
        <!-- Value is an array -->
        <template v-for="[index, item] of value.entries()">
          <div class="columns is-centered is-mobile is-variable is-0 mt-5 my-0" v-bind:key="index">
            <div class="column is-one-quarter p-0">
              <span class="is-pulled-left has-text-weight-bold mr-2">{{getDisplayName(key)}} {{index + 1}}</span>
            </div>
            <div class="column is-three-quarters p-0">
              <template v-for="[subKey, subValue] of Object.entries(item)">
                <div class="columns is-centered is-mobile is-variable is-0 my-0" v-bind:key="subKey">
                  <div class="column is-one-quarter p-0">
                    <span class="is-pulled-left has-text-weight-bold mr-2">{{getDisplayName(subKey)}}</span>
                  </div>
                  <div class="column is-three-quarters p-0">
                    <span class="is-size-7 ml-2 is-pulled-left">{{ subValue }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";
import {DisplayNameManager} from "@/breeding-insight/model/report/DisplayNameManager";
import {ChevronUpIcon, ChevronDownIcon} from 'vue-feather-icons';
import flatten from "flat";

@Component({
  components: {ChevronUpIcon, ChevronDownIcon}
})
export default class ReportExpandableDetails extends Vue {
  @Prop()
  details!: any;
  @Prop()
  report!: ReportStruct;
  @Prop()
  config!: any;

  getDisplayName(name: string) {
    return DisplayNameManager.getDisplayName(name, this.config);
  }

  lastElement(index: number, listLength: number) {
    return index >= listLength - 1;
  }

  isDisplayed(column: string) {
    return this.config.detailDisplay === '*' || this.config.detailDisplay.includes(column);
  }

  getDisplayedDetails() {
    const flattenedDetails = flatten(this.details, {safe:true});
    const displayedDetails:any = {};
    for (const key of Object.keys(flattenedDetails)) {
      if (this.isDisplayed(key)) {
        displayedDetails[key] = flattenedDetails[key];
      }
    }
    return displayedDetails;
  }
}

</script>