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
  <footer class="footer">
    <div class="level mb-4">
      <div class="level-left">
        <nav class="level-item">
          <div class="level">
            <div class="level-item">
              <a href="/">Terms of Use</a>
            </div>
            <div class="level-item">
              <a href="/">Privacy Policy</a>
            </div>
            <div class="level-item">
              <a href="/">Contact Us</a>
            </div>
            <div class="level-item">
              <a href="/">About</a>
            </div>
          </div>
        </nav>
      </div>

      <div class="level-right">

        <div class="level-item">
          <div class="level-item">
            <p class="has-text-right is-hidden-touch">
              <strong>&copy; 2020 Breeding Insight</strong>
              <br>
              Funded by the USDA through Cornell University
            </p>
            <p class="has-text-centered is-hidden-desktop">
              <strong>&copy; 2020 Breeding Insight</strong>
              <br>
              Funded by the USDA through Cornell University
            </p>
          </div>
          <div class="level-item">
            <img
                src="../../assets/img/usda.svg"
                alt="USDA Logo"
                width="75"
            >
          </div>
          <div class="level-item">
            <img
                src="../../assets/img/cornell_seal.svg"
                alt="Cornell University Logo"
                width="56"
            >
          </div>
        </div>
      </div>
    </div>
    <div class="level">
      <div class="level-left"></div>
      <div class="level-right">
        <div class="level-item is-size-7">
          <a :href="versionInfo" target="_blank">web {{ versionName }}</a> / <a :href="apiVersionInfo" target="_blank">api {{ apiVersionName }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
import * as api from "@/util/api";
import {ApiInfo} from "@/breeding-insight/model/ApiInfo";

@Component
export default class Footer extends Vue {
  private apiInfo: ApiInfo = new ApiInfo("v0.0.0", "");

  mounted() {
    this.fetchApiVersion();
  }

  get versionName() {
    console.log("version name: "+process.env.VUE_APP_VERSION);
    return process.env.VUE_APP_VERSION;
  }

  get versionInfo () {
    console.log("version info: "+process.env.VUE_APP_VERSION_INFO);
    return process.env.VUE_APP_VERSION_INFO;
  }

  get apiVersionName() {
    // console.log("api version name: "+this.apiInfo.version);
    return this.apiInfo.version;
  }

  get apiVersionInfo () {
    // console.log("api version info: "+this.apiInfo.versionInfo);
    return this.apiInfo.versionInfo;
  }

  fetchApiVersion () {
    api.call({
      url: `${process.env.VUE_APP_BI_API_V1_PATH}/serverInfo`,
      method: 'get'
    }).then((response:any) => {
      this.apiInfo = new ApiInfo(response.data.version, response.data.versionInfo);
    })
  }
}

</script>