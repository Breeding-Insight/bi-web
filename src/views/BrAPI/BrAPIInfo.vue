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
  <div class="container brapi-info">
    <div class="columns is-centered">
      <div class="column">

      </div>
      <div class="column is-half">
        <div class="card">
          <div class="card-content">
            <h3 class="is-4 title">BrAPI Information</h3>
            <div>
              <strong>BrAPI Base URL: </strong><span class="has-text-link">{{getBrAPIRootPath()}}</span>
            </div>
            <div class="mt-5">
              <qr-code v-bind:text="getBrAPIRootPath()" v-bind:size="100" v-bind:error-level="'L'"/>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="card">
          <div class="card-content">
            <h3 class="title is-4">Access Token</h3>

            <template v-if="accessToken != ''">
              <pre class="access-token">{{accessToken}}</pre>

              <div class="mb-5">
                <strong>Expires at:</strong> {{tokenExpiration}}
              </div>
            </template>

            <div class="has-text-centered">
              <button class="button is-primary is-centered"
                      v-on:click="generateAccessToken"
                      v-bind:class="{'is-loading': generatingToken}"
                      v-bind:disabled="generatingToken">
                {{accessToken != '' ? 'Regenerate' : 'Generate'}} Access Token
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">

import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from "vuex";
import { Program } from '@/breeding-insight/model/Program';
import * as api from "@/util/api";
import moment from 'moment';

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
  private accessToken?: string = '';
  private generatingToken = false;
  private tokenExpiration?: string;

  getBrAPIRootPath() {
    return `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${this.activeProgram!.id}`;
  }

  async generateAccessToken() {
    this.generatingToken = true;
    const config: any = {};
    config.url = `${process.env.VUE_APP_BI_API_V1_PATH}/api-token`;
    config.method = 'get';
    try {
      const res: any = await api.call(config);
      this.accessToken = res.data.token;
      const encodedTokenData = this.accessToken!.split(".")[1];
      const tokenData = JSON.parse(atob(encodedTokenData));
      this.tokenExpiration = moment(tokenData.exp*1000).format();
    } catch (error) {
      this.$emit('show-error-notification', 'Error while trying to generate access token');
    } finally {
      this.generatingToken = false;
    }
  }
}
</script>