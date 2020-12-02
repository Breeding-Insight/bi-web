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
    <template v-for="[i, item] of data.entries()">
      <LabelValueRow
        v-bind:label="item.label"
        v-bind:value="item.value"
        v-on:delete="removeRow(i)"
        v-on:value-change="item.value = $event"
        v-on:label-change="item.label = $event"
        v-bind:id="item.label"
      />
    </template>
  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {Category} from "@/breeding-insight/model/Category";
import LabelValueRow from "@/components/trait/forms/LabelValueRow.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";

@Component({
  components: {BasicInputField, LabelValueRow}
})
export default class OrdinalTraitForm extends Vue {

  @Prop({default: () => []})
  private data!: Category[];
  @Prop({default: true})
  private new!: boolean;

  @Watch('data', {immediate: true, deep: true})
  emitData(){
    this.$emit('update', this.data);
  }


  mounted() {
    if (this.new) {
      for (const i of Array(5).keys()) {
        this.data.push(new Category(i.toString(), ''));
      }
    }
  }

  removeRow(index: number) {
    this.data.splice(index,1);
  }
}
</script>