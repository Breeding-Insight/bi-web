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
  <div class="import-file">
    <h1 class="title">
      Import File
    </h1>

    <section>
      <nav class="tabs is-boxed">
        <ul>
          <router-link
              v-bind:to="{name: 'germplasm-import', params: {programId: activeProgram.id}}"
              tag="li" active-class="is-active">
            <a>Germplasm</a>
          </router-link>
          <router-link
              v-if="!isSubscribed"
              v-bind:to="{name: 'import-ontology', params: {programId: activeProgram.id}}"
              tag="li" active-class="is-active">
            <a>Ontology</a>
          </router-link>
          <router-link
              v-bind:to="{name: 'experiment-import', params: {programId: activeProgram.id}}"
              tag="li" active-class="is-active">
            <a>Experiments & Observations</a>
          </router-link>
          <router-link
              v-if="!isProduction"
              v-bind:to="{name: 'geno-import', params: {programId: activeProgram.id}}"
              tag="li" active-class="is-active">
            <a>Genotypic Data</a>
          </router-link>
          <router-link
            v-bind:to="{name: 'sample-import', params: {programId: activeProgram.id}}"
            tag="li" active-class="is-active">
            <a>Genotype Samples</a>
          </router-link>
          <!-- BI-1963 - Comment out data mapping tab, left url access in case want to get to it -->
          <!--
          <router-link
              v-bind:to="{name: 'data-mapping', params: {programId: activeProgram.id}}"
              tag="li" active-class="is-active">
            <a>Data Mapping<span class="ml-2 tag is-warning">Beta</span></a>
          </router-link>
          -->
        </ul>
      </nav>
    </section>

    <div class="tab-content">
      <router-view
          @show-success-notification="$emit('show-success-notification', $event)"
          @show-info-notification="$emit('show-info-notification', $event)"
          @show-error-notification="$emit('show-error-notification', $event)"
          @show-warning-notification="$emit('show-warning-notification', $event)"
      ></router-view>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {mapGetters, mapActions} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import ProgramsBase from "@/components/program/ProgramsBase.vue";

@Component({
  components: {
  },
  methods: {
    ...mapActions('programManagement', {
      getSubscribedOntology: 'getSubscribedOntology'
    })
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ]),
    ...mapGetters('programManagement',[
      'isSubscribed', 'subscribedOntology'
    ])
  }
})
export default class ImportFile extends ProgramsBase {

  private activeProgram?: Program;
  private isSubscribed?: boolean;
  private isProduction: boolean = process.env.NODE_ENV === "production";
  private getSubscribedOntology!: () => any;

  mounted() {
    this.getSubscribedOntology();
  }
}
</script>