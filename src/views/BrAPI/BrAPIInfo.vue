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
      <div class="column is-half">
        <div class="card">
          <div class="card-content">
            <h3 class="is-4 title">BrAPI Information</h3>

            <nav class="tabs is-boxed mt-5">
              <ul class="ml-0">
                <li :class="activeTab=='fieldbook' ? 'is-active' :''"><a v-on:click="activeTab = 'fieldbook'">Field Book BrAPI Settings</a></li>
                <li :class="activeTab=='brapi' ? 'is-active' :''"><a v-on:click="activeTab = 'brapi'">BrAPI Base URL</a></li>
              </ul>
            </nav>
            <div class="tab-content">
              <template v-if="activeTab=='brapi'">
                <div><span class="has-text-link">{{getBrAPIRootPath()}}</span></div>
                <div class="mt-5">
                  <qr-code v-bind:text="getBrAPIRootPath()" v-bind:size="100" v-bind:error-level="'L'"/>
                </div>
                <article class="message is-info mt-5">
                  <div class="message-body high-contrast">
                    Example BrAPI call:<br>
                    <a :href="getBrAPIRootPath()+'/brapi/v2/serverinfo'" target="_blank">{{getBrAPIRootPath() + '/brapi/v2/serverinfo'}}</a>
                  </div>
                </article>
              </template>
              <template v-if="activeTab=='fieldbook'">
                <div class="mt-5">
                  <qr-code v-bind:text="getFieldBookSettings()" v-bind:size="200" v-bind:error-level="'L'"/>
                </div>
                <article class="message is-info mt-5">
                  <div class="message-body field-book-info high-contrast">
                    From Field Book's BrAPI settings screen, tap:<br>"<strong>Scan a configuration code</strong>",<br> then scan the above QR code.<br><br>
                    The settings that will be set are:
                    <div class="columns mt-1">
                      <div class="column">
                        <strong>Base URL:</strong></div>
                      <div class="column is-two-thirds" style="overflow-wrap: break-word"> {{ getBrAPIRootPath() }}</div>
                    </div>
                    <div class="columns">
                      <div class="column"><strong>Display Name:</strong></div>
                      <div class="column is-two-thirds">DeltaBreed</div>
                    </div>
                    <div class="columns">
                      <div class="column"><strong>BrAPI Version:</strong></div>
                      <div class="column is-two-thirds">V2</div>
                    </div>
                    <div class="columns">
                      <div class="column"><strong>Page Size:</strong></div>
                      <div class="column is-two-thirds">1000</div>
                    </div>
                    <div class="columns">
                      <div class="column"><strong>Chunk Size:</strong></div>
                      <div class="column is-two-thirds">500</div>
                    </div>
                    <div class="columns">
                      <div class="column"><strong>Server Timeout:</strong></div>
                      <div class="column is-two-thirds">120</div>
                    </div>
                    <div class="columns">
                      <div class="column"><strong>OIDC Flow:</strong></div>
                      <div class="column is-two-thirds">OAuth2 Implicit Grant</div>
                    </div>
                    <div class="columns">
                      <div class="column"><strong>OIDC Discovery URL:</strong></div>
                      <div class="column is-two-thirds" style="overflow-wrap: break-word">{{ getBrAPIRootPath() }}/.well-known/openid-configuration</div>
                    </div>
                    <div class="columns">
                      <div class="column"><strong>Value vs Label Display:</strong></div>
                      <div class="column is-two-thirds">Value</div>
                    </div>
                  </div>
                </article>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="card">
          <div class="card-content">
            <h3 class="title is-4">Access Token</h3>
            <article class="message is-info mt-5">
              <div class="message-body high-contrast">
                Executing BrAPI calls to DeltaBreed via scripts (e.g. R or Python) requires an authorization token.  Click "<strong>Generate Token</strong>" to create a new token to inject into your scripts.
              </div>
            </article>

            <template v-if="accessToken != ''">
              <pre class="access-token">{{accessToken}}</pre>

              <div class="mb-5">
                <strong>Expires at:</strong> {{tokenExpiration}}
              </div>
            </template>

            <div class="has-text-centered">
              <button class="button is-primary is-outlined is-centered"
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
  private activeTab = 'fieldbook';

  getBrAPIRootPath() {
    return `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${this.activeProgram!.id}`;
  }

  getFieldBookSettings() {
    const brapiRootPath = this.getBrAPIRootPath();
    let settings = {
      'url': brapiRootPath,
      'name': 'DeltaBreed',
      'v': '2',
      'ps': '1000',
      'cs': '500',
      'st': '120',
      'flow': 'implicit',
      'oidc': this.getBrAPIRootPath() + '/.well-known/openid-configuration',
      'cat': 'value'
    };

    return JSON.stringify(settings)
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