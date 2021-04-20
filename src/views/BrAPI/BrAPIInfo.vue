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
  <div class="container">
    <div class="columns is-centered">
      <div class="column">
        <h1 class="title">BrAPI Information</h1>
        <div>
          <strong>BrAPI Base URL: </strong><span class="has-text-link">{{getBrAPIRootPath()}}</span>
        </div>
        <div class="mt-5">
          <qr-code v-bind:text="getBrAPIRootPath()" v-bind:size="100" v-bind:error-level="'L'"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">

import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from "vuex";
import { Program } from '@/breeding-insight/model/Program';

@Component({
  components: { },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class BrapiInfo extends Vue {

  private activeProgram?: Program;

  getBrAPIRootPath() {
    return `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${this.activeProgram.id}`;
  }
}
</script>