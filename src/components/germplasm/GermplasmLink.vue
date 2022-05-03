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
    <div v-else>
      {{ this.germplasmGID }}
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import {Program} from "@/breeding-insight/model/Program";

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

}

</script>
