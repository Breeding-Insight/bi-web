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
  <footer class="footer p-0">
    <div class="columns is-marginless">
      <div
          class="column side-menu p-0 is-narrow"
          :class="{ 'is-hidden': !showSidebar}"
      >
        <div class="is-300px"></div>
      </div>
      <div class="column">
      <div>
      <div class="level mb-4">
        <div class="level-left">
          <nav class="level-item">
            <div class="level">
<!--              <div class="level-item">-->
<!--                <a href="/">Terms of Use</a>-->
<!--              </div>-->
<!--              <div class="level-item">-->
<!--                <a href="/">Privacy Policy</a>-->
<!--              </div>-->
              <div class="level-item">
                <a href="https://breedinginsight.atlassian.net/wiki/spaces/LH/pages/1680179235/DeltaBreed+User+Manual">User Manual</a>
              </div>
              <div class="level-item">
                <a href="https://breedinginsight.org/contact-us/">Contact Us</a>
              </div>
              <div class="level-item">
                <a href="https://breedinginsight.org/about-bi/">About</a>
              </div>
            </div>
          </nav>
        </div>

        <div class="level-right">

          <div class="level-item">
            <div class="level-item">
              <p class="has-text-right is-hidden-touch">
                <strong>&copy; {{copyrightYear}} Breeding Insight</strong>
                <br>
                Funded by the USDA through Cornell University
              </p>
              <p class="has-text-centered is-hidden-desktop">
                <strong>&copy; {{copyrightYear}} Breeding Insight</strong>
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
      <div v-if="showVersionInfo" class="level">
        <div class="level-left">
          <div class="level-item is-size-7">
            <VersionInfo/>
          </div>
        </div>
        <div class="level-right"></div>
      </div>

      </div>
      </div>
    </div>

  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VersionInfo from '@/components/layouts/VersionInfo.vue';
import {mapGetters} from "vuex";
import { SandboxMode } from '@/util/config';

@Component({
  components: { VersionInfo },
  computed: {
    ...mapGetters([
      'showSidebarMobile',
    ])
  }
})
export default class Footer extends Vue {
  showSidebarMobile?: boolean;
  copyrightYear = new Date().getFullYear();

  get showVersionInfo () {
    return !this.$route.meta.layout || this.$route.meta.layout == 'simple' || this.$route.meta.layout == 'noSideBar' || (this.$route.meta.layout == 'infoSideBar' && process.env.VUE_APP_SANDBOX !== SandboxMode.Public && process.env.VUE_APP_SANDBOX !== SandboxMode.Coordinator);
  }

  get showSidebar() {
    return this.showSidebarMobile && (this.$route.meta.layout == 'adminSideBar' || this.$route.meta.layout == 'userSideBar' ||
        (this.$route.meta.layout == 'infoSideBar' && process.env.VUE_APP_SANDBOX !== '') || this.$route.meta.layout == 'baseSideBar');

  }
}

</script>