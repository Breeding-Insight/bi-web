<template>
  <div class="germplasm">
    <h1 class="title">
      Germplasm Details
    </h1>

    <div class="columns is-multiline is-align-items-stretch mt-4">
    <article class="column ">
    <section>
      <ul style="list-style-type: none;">
      <li><b>Preferred Name: </b> {{ }}</li>
      <li><b>GID: </b> {{ }}</li>
      <li><b>Breeding Method: </b> {{ }}</li>
      <li><b>Source: </b> {{ }}</li>
      <li><b>Synonyms: </b> {{ }}</li>
      <li><b>External UID: </b> {{ }}</li>
      <li><b>User: </b> {{ }}</li>
      <li><b>Creation Date: </b> {{ }}</li>
      </ul>
    </section>
    </article>
    <article class="column px-2">
      <section>
        <ul style="list-style-type: none;">
        <li><b>Female Parent: </b> {{ }}</li>
        <li><b>Female Parent GID: </b> {{ }}</li>
        <li><b>Male Parent: </b> {{ }}</li>
        <li><b>Male Parent GID: </b> {{ }}</li>
        <li><b>Cross: </b> {{ }}</li>
        <li><b>Cross GID(s): </b> {{ }}</li>
        </ul>
      </section>
    </article>
      </div>

    <section>
      <nav class="tabs is-boxed">
        <ul>
            <router-link
                v-bind:to="{name: '', params: {programId: activeProgram.id}}"
                tag="li"
            >
              <a>Images</a>
            </router-link>
            <router-link
                v-bind:to="{name: '', params: {programId: activeProgram.id}}"
                tag="li"
            >
              <a>Pedigrees</a>
            </router-link>
              <router-link
                  v-bind:to="{name: '', params: {programId: activeProgram.id}}"
                  tag="li"
              >
                <a>Attributes</a>
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
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";

@Component({
  components: {},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  data: () => ({})
})
export default class GermplasmDetails extends GermplasmBase {

  private activeProgram?: Program;
  private data!: Germplasm;

  //when page loads get details for uuid, create service, axios, api, call reference dao components in frontend re pathing

}
</script>