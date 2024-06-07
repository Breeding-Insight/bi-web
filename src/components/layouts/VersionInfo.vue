<!--
  - See the NOTICE file distributed with this work for additional information regarding copyright ownership.
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
  <span role="contentinfo" aria-label="versions">
    <a :href="versionInfo" target="_blank">web {{ versionName }}</a> /
    <a :href="apiVersionInfo" target="_blank"> api
      <template v-if="apiInfoLoading"><span class="is-italic">loading</span></template>
      <template v-else>{{ apiVersionName }}</template>
    </a>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ApiInfo } from '@/breeding-insight/model/ApiInfo';
import { ServerManagementDAO } from '@/breeding-insight/dao/ServerManagementDAO';

@Component
export default class VersionInfo extends Vue {
  private apiInfo: ApiInfo = new ApiInfo('', '');
  private apiInfoLoading = true;

  mounted () {
    this.fetchApiVersion();
  }

  get versionName () {
    return process.env.VUE_APP_VERSION;
  }

  get versionInfo () {
    return process.env.VUE_APP_VERSION_INFO;
  }

  get apiVersionName () {
    return this.apiInfo.version;
  }

  get apiVersionInfo () {
    return this.apiInfo.versionInfo;
  }

  fetchApiVersion () {
    ServerManagementDAO.getApiInfo().then(value => {
      this.apiInfo = value;
      this.apiInfoLoading = false;
    }).catch(() => {
      this.apiInfo = new ApiInfo("unknown", "");
      this.apiInfoLoading = false;
    });
  }
}
</script>