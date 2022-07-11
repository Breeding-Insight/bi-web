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
  <div class="ontology">
    <h1 class="title">
      Ontology<br>
    </h1>
    <p v-if="isSubscribed" class="has-text-weight-bold">
      This ontology is shared from {{subscribedOntology.programName}}.
    </p>

    <section>
      <nav class="tabs is-boxed">
        <ul>
          <router-link
            v-bind:to="{name: 'active-terms', params: {programId: activeProgram.id}}"
            tag="li"
            active-class="is-active"
          >
            <a>Active</a>
          </router-link>
          <router-link
            v-bind:to="{name: 'archived-terms', params: {programId: activeProgram.id}}"
            tag="li"
            active-class="is-active"
          >
            <a>Archived</a>
          </router-link>
          <button
              v-if="$ability.can('create', 'Trait') && !isSubscribed"
              class="button is-primary is-pulled-right has-text-weight-bold above-tabs-button"
              v-on:click="$router.push({name: 'import-ontology', params: {programId: activeProgram.id}})"
          >
        <span class="icon is-small">
          <PlusCircleIcon
              size="1.5x"
              aria-hidden="true"
          />
        </span>
            <span>
          Import Batch File
        </span>
          </button>
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
  import OntologyBase from "@/components/ontology/OntologyBase.vue";
  import OntologyActiveTable from "@/components/ontology/OntologyActiveTable.vue";
  import OntologyArchivedTable from "@/components/ontology/OntologyArchivedTable.vue";
  import {SubscribedOntology} from "@/breeding-insight/model/SubscribedOntology";
  import {PlusCircleIcon} from 'vue-feather-icons'

  @Component({
    components: {
      OntologyArchivedTable, OntologyActiveTable, PlusCircleIcon
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
  export default class Ontology extends OntologyBase {

    private activeProgram?: Program;
    private isSubscribed?: boolean;
    private subscribedOntology?: SubscribedOntology;

  }
</script>
