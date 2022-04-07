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
    <router-link v-bind:to="{name: 'germplasm-all', params: {programId: activeProgram.id}}">
      All Germplasm
    </router-link>
    <p></p>
    <h1 class="title">
      Germplasm Details
    </h1>

    <template v-if="!germplasmLoading">
    <div class="columns is-multiline is-align-items-stretch mt-4">
    <article class="column ">
    <section>
      <ul style="list-style-type: none;">
      <li><b>Preferred Name: </b> {{germplasm.defaultDisplayName}}</li>
      <li><b>GID: </b> {{ germplasm.accessionNumber }}</li>
      <li><b>Breeding Method: </b> {{ germplasm.additionalInfo.breedingMethod }}</li>
      <li><b>Source: </b> {{ germplasm.seedSource }}</li>
        <li><b>Pedigree: </b> {{ germplasm.additionalInfo.pedigreeByName }}</li>
        <li><b>Pedigree GID(s): </b> {{ germplasm.pedigree }}</li>
      </ul>
    </section>
    </article>
    <article class="column px-2">
      <section>
        <ul style="list-style-type: none;">
          <li><b>External UID: </b> {{ getExternalUID() }}</li>
          <li><b>User: </b> {{ germplasm.additionalInfo.createdBy.userName }}</li>
          <li><b>Creation Date: </b> {{ getCreatedDate() }}</li>
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
    </template>
  </div>
</template>

<script lang="ts">
import {Component, Watch} from 'vue-property-decorator'
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import GermplasmBase from "@/components/germplasm/GermplasmBase.vue";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import {GermplasmService} from "@/breeding-insight/service/GermplasmService";
import moment from "moment";

@Component({
  components: {},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class GermplasmDetails extends GermplasmBase {

  private activeProgram?: Program;
  private germplasm?: Germplasm;
  private germplasmLoading: boolean = true;
  private germplasmUUID: string = this.$route.params.germplasmId;

  mounted() {
    this.getGermplasm();
  }

  getGermplasm() {
    this.germplasmLoading = true;
    GermplasmService.getSingleGermplasm(this.activeProgram!.id!, this.germplasmUUID).then((germplasm) => {
      this.germplasm = germplasm;
    }).catch((error) => {
      // Display error that germplasm cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load germplasm');
      throw error;
    }).finally(() => this.germplasmLoading = false);
  }

  getExternalUID() {
    let val;
    if (this.germplasm!.externalReferences && this.germplasm!.seedSource) {
      val = this.germplasm!.externalReferences!.filter(ref => ref.referenceSource == this.germplasm!.seedSource!)
          .map(ref => ref.referenceID);
      return val ? val[0]: "";
    }
    return "";
  }

  getCreatedDate(){
    if (this.germplasm!.additionalInfo && this.germplasm!.additionalInfo.createdDate) {
      let dateTime = moment(this.germplasm!.additionalInfo!.createdDate!, "DD/MM/YYYY h:mm:ss");
      return dateTime.format("DD/MM/YYYY");
    }
    return "";
  }

}
</script>