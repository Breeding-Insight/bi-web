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
      <div class="column is-half-desktop is-two-thirds-tablet is-full-mobile">
        <h1 class="title has-text-centered">Authorize Application</h1>
        <div class="card">
          <div class="card-content">
            <p class="has-text-dark">
              <strong>{{applicationName}}</strong> would like permission to access your account.
            </p>
            <button class="button is-success has-text-weight-bold is-fullwidth" v-on:click="getToken">Authorize {{applicationName}}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue} from 'vue-property-decorator'
import {ApiTokenService} from "@/breeding-insight/service/ApiTokenService";

@Component({
  components: { }
})
export default class BrapiAuthorize extends Vue {
  @Prop()
  public applicationName!: string;

  @Prop()
  public returnUrl!: string;

  async getToken() {
    // TODO: handle error case
    const token = await ApiTokenService.getApiToken();
    const redirectUrl = this.returnUrl + "?status=200&token=" + token.accessToken;
    window.location.href = redirectUrl;
  }

}
</script>