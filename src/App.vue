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
  <div id="app">
    <div style="position:fixed;top:1px;z-index:9999;left:1px;right:1px;">
      <header>
        <a class="skip-link" href="#main">Skip to main content</a>
      </header>
      <SuccessNotification ref="successNotification" class="is-marginless"></SuccessNotification>
      <ErrorNotification ref="errorNotification" class="is-marginless"></ErrorNotification>
      <InfoNotification ref="infoNotification" class="is-marginless"></InfoNotification>
      <SandboxPublicNotification v-bind:active.sync="showPublicSandboxNotification" class="is-marginless"></SandboxPublicNotification>
      <SandboxCoordinatorNotification v-bind:active.sync="showCoordinatorSandboxNotification" class="is-marginless"></SandboxCoordinatorNotification>
      <WarningNotification ref="warningNotification" class="is-marginless"></WarningNotification>
    </div>

    <component v-bind:is="layout" v-bind:username="username" @logout="logOut">
        <router-view
            @show-success-notification="showSuccessNotification"
            @show-info-notification="showInfoNotification"
            @show-error-notification="showErrorNotification"
            @show-warning-notification="showWarningNotification"
        />
    </component>
    <Footer />

  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import {
  SHOW_ERROR_NOTIFICATION,
  SHOW_SUCCESS_NOTIFICATION,
  SHOW_WARNING_NOTIFICATION,
  SHOW_INFO_NOTIFICATION,
} from '@/store/mutation-types'
import SuccessNotification from '@/components/notifications/SuccessNotification.vue'
import InfoNotification from '@/components/notifications/InfoNotification.vue'
import ErrorNotification from '@/components/notifications/ErrorNotification.vue'
import SimpleLayout from '@/components/layouts/SimpleLayout.vue'
import UserSideBarLayout from './components/layouts/UserSideBarLayout.vue'
import NoSideBarLayout from './components/layouts/NoSideBarLayout.vue'
import InfoSideBarLayout from './components/layouts/InfoSideBarLayout.vue'
import BaseSideBarLayout from './components/layouts/BaseSideBarLayout.vue'
import SandboxPublicNotification from "@/components/notifications/SandboxPublicNotification.vue";
import SandboxCoordinatorNotification from "@/components/notifications/SandboxCoordinatorNotification.vue";
import {SandboxMode} from "@/util/config";
import WarningNotification from "@/components/notifications/WarningNotification.vue";
import Footer from "@/components/layouts/Footer.vue";

@Component({
  watch: {
    $route(to, from) {
      document.title = to.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform';
    },
    loggedIn(isLoggedIn) {
      if(!isLoggedIn) {
        this.$router.push({name: 'home',
          params: {
            sessionExpired: 'true'
          }
        });
      }
    }
  },
  computed: {
    layout() {
      return this.$route.meta.layout ? `${this.$route.meta.layout}Layout` : 'simpleLayout';
    },
    layoutTitle() {
      return this.$route.meta.title;
    }
  },
  components: {
    SandboxCoordinatorNotification,
    SandboxPublicNotification,
    WarningNotification,
    SuccessNotification,
    InfoNotification,
    ErrorNotification,
    simpleLayout: SimpleLayout,
    userSideBarLayout: UserSideBarLayout,
    noSideBarLayout: NoSideBarLayout,
    infoSideBarLayout: InfoSideBarLayout,
    baseSideBarLayout: BaseSideBarLayout,
    Footer
  }
})
export default class App extends Vue {
  public loading: boolean = false;
  public t: string = "Title";

  public showPublicSandboxNotification = false;
  public showCoordinatorSandboxNotification = false;

  public $refs!: {
    successNotification: SuccessNotification,
    infoNotification: InfoNotification,
    errorNotification: ErrorNotification
    warningNotification: WarningNotification
  };

  @Watch('firstVisit', {immediate: true})
  onFirstVisitChanged(newVal: any, oldVal: any) {
    if(newVal) {
      if (process.env.VUE_APP_SANDBOX === SandboxMode.Public) {
        this.showPublicSandboxNotification = true;
      } else if (process.env.VUE_APP_SANDBOX === SandboxMode.Coordinator) {
        this.showCoordinatorSandboxNotification = true;
      }
    }
  }

  mounted() {
    // load the appropriate JIRA issue collector script depending on sandbox type
    let issueCollectorScript = document.createElement('script');
    issueCollectorScript.setAttribute('type', 'text/javascript');
    if (process.env.VUE_APP_SANDBOX === SandboxMode.Public) {
      issueCollectorScript.setAttribute('src', 'https://breedinginsight.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-egccmf/b/24/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=d2cbfe89');
    } else if (process.env.VUE_APP_SANDBOX === SandboxMode.Coordinator) {
      issueCollectorScript.setAttribute('src', 'https://breedinginsight.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/vd1cif/b/24/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=b57acf4a');
    }
    document.head.appendChild(issueCollectorScript);
  }

  get firstVisit() {
    return this.$store.state.firstVisit;
  }

  get loggedIn () {
    return this.$store.state.loggedIn;
  }

  get username(): string {
    return this.$store.state.user ? this.$store.state.user.name : '';
  }

  get requestedPath () {
    return this.$store.state.requestedPath;
  }

  logOut (): void {
    window.location.href = process.env.VUE_APP_BI_API_ROOT+'/logout';
  }

  showSuccessNotification(msg: string) {
    this.$store.commit(SHOW_SUCCESS_NOTIFICATION, msg);
  }

  showInfoNotification(msg: string) {
    this.$store.commit(SHOW_INFO_NOTIFICATION);
  }

  showErrorNotification(msg: string) {
    this.$store.commit(SHOW_ERROR_NOTIFICATION, msg);
  }

  showWarningNotification(msg: string) {
    this.$store.commit(SHOW_WARNING_NOTIFICATION);
  }
}
</script>
