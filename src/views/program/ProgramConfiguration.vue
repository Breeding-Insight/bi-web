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
  <div id="program-configuration">
    <b-tabs vertical :animated="false" :type="'is-boxed'">
      <b-tab-item label="Ontology" >
        <SharedOntologyConfiguration
            v-on="$listeners"
            class="mb-6"
            v-bind:subscription-change="subscribeAction"
            v-on:share-change="shareAction += 1"
        />
        <SubscribeOntologyConfiguration
            v-on="$listeners"
            v-on:subscription-change="subscribeAction += 1"
            v-bind:share-change="shareAction"
        />
      </b-tab-item>
      <b-tab-item label="Genotyping" v-if="$ability.can('submit', 'Submission')">
        <div id="genotype-vendor-configuration">
          <template v-for="vendor in vendors">
          <section class="vendor" :key="vendor.id">
            <h2 class="title is-5">{{ vendor.name }}</h2>
            <DataForm
                v-bind:record.sync="vendor"
                v-bind:row-validations="vendorValidations"
                v-bind:data-form-state="vendor.state"
                v-on:submit="() => saveVendorDetails(vendor)"
                v-on:cancel="() => resetVendor(vendor)"
                v-on:show-error-notification="$emit('show-error-notification', $event)"
            >
              <template v-slot="validations">
                <div class="column is-12">
                  <BasicInputField
                      class="pb-2"
                      v-bind:value="vendor.clientId"
                      v-bind:field-name="'Client ID'"
                      v-bind:validations="validations.clientId"
                      v-on:input="setClientId(vendor, $event)"
                  />
                </div>
              </template>
            </DataForm>
          </section>
          </template>
        </div>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import {mapGetters} from "vuex";
import SharedOntologyConfiguration from "@/components/program/SharedOntologyConfiguration.vue";
import SubscribeOntologyConfiguration from "@/components/program/SubscribeOntologyConfiguration.vue";
import DataForm from "@/components/forms/DataForm.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import {DataFormEventBusHandler} from "@/components/forms/DataFormEventBusHandler";
import { required } from 'vuelidate/lib/validators';

@Component({
  components: {
    BasicInputField,
    DataForm,
    SubscribeOntologyConfiguration,
    SharedOntologyConfiguration,
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ProgramConfiguration extends ProgramsBase {
  // Change tracker to pass to children for refresh
  private subscribeAction: number = 0;
  private shareAction: number = 0;

  private vendors: VendorConfig[] = [new VendorConfig({id: 'dart', name: 'DArT', state: new DataFormEventBusHandler(), clientId: '', authToken: ''})];

  private vendorValidations = {
    clientId: {required},
    // authToken: {required}
  }

  setClientId(vendor:VendorConfig, value:string) {
    console.log(`setting clientId to ${value}`);
    vendor.clientId = value;
  }

  saveVendorDetails(vendor: VendorConfig) {
    console.log("saving vendor config");
    console.log(JSON.stringify(vendor));
  }

  resetVendor(vendor: VendorConfig) {
    vendor.clientId = '';
  }
}

class VendorConfig {
  id?: string;
  name?: string;
  state?: DataFormEventBusHandler;
  clientId?: string;
  authToken?: string;

  constructor({id, name, state, clientId, authToken}: VendorConfig) {
    this.id = id;
    this.name = name;
    this.state = state;
    this.clientId = clientId;
    this.authToken = authToken;
  }
}
</script>