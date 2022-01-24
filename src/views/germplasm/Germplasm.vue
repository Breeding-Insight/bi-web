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
  <div class="germplasm">
    <h1 class="title">
      Germplasm
    </h1>

    <section>
      <nav class="tabs is-boxed">
        <ul>
          <router-link
              v-bind:to="{name: 'germplasm-all', params: {programId: activeProgram.id}}"
              tag="li"
              active-class="is-active"
          >
            <a>All Germplasm</a>
          </router-link>
          <router-link
              v-bind:to="{name: 'germplasm-lists', params: {programId: activeProgram.id}}"
              tag="li"
              active-class="is-active"
          >
            <a>Germplasm Lists</a>
          </router-link>
        </ul>
      </nav>
    </section>

    <div class="tab-content">
      <router-view
          @show-success-notification="$emit('show-success-notification', $event)"
          @show-info-notification="$emit('show-info-notification', $event)"
          @show-error-notification="$emit('show-error-notification', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import GermplasmBase from "@/components/germplasm/GermplasmBase.vue";

@Component({
  components: {},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class Germplasm extends GermplasmBase {

  private activeProgram?: Program;

}
</script>
