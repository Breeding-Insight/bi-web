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
    <router-link v-if="this.germplasmUUID" v-bind:to="{name: 'germplasm-details', params: {programId: activeProgram.id, germplasmId: this.germplasmUUID}}">
      {{ this.germplasmGID }}
    </router-link>
    <router-link v-else v-bind:to="{name: 'germplasm-details', params: {programId: activeProgram.id, germplasmId: 'gid-'+this.germplasmGID}}">
      {{ this.germplasmGID }}
    </router-link>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import { Germplasm } from '@/breeding-insight/brapi/model/germplasm';

@Component({
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class GermplasmLink extends Vue {

  private activeProgram?: Program;
  @Prop()
  private germplasmUUID!: String;
  @Prop()
  private germplasmGID!: String;
  private loading = true;
  private germplasm?: Germplasm;

  fetchGermplasm() {
    if(this.germplasm === undefined) {
      setTimeout(() => {
        this.germplasm = {germplasmName: "X2_33649_W6_B4"} as Germplasm;
        this.loading = false;
      }, 1000);
    }
  }

}

</script>
