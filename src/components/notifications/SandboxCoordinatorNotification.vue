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
  <b-notification type="is-info" v-bind:active.sync="notificationActive" aria-close-label="Close Notification"
                  role="alert">
    <div class="content">
      <h1 class="title is-4">Coordinator Sandbox</h1>
      <ul class="is-size-5">
        <li>Data submitted to this site is private, but may be shared if screenshots or Zoom sessions with other groups are shared.
          Only use data that is cleared for public viewing.</li>
        <li><strong>This database will be refreshed by the development team on request.</strong> If there is a need to delete
        data that you have submitted, contact the development team for assistance.</li>
        <p><a href="#" v-on:click="$showCollectorDialog()" class="has-text-white">If you find a bug or need support, use this link.</a></p>
      </ul>
      <div class="buttons is-centered">
        <button class="button is-dark" v-on:click="$emit('update:active', false)">I understand, close this message</button>
      </div>
    </div>
  </b-notification>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { InfoIcon } from 'vue-feather-icons'

@Component({
  components: {InfoIcon}
})
export default class SandboxCoordinatorNotificationNotification extends Vue {
  @Prop({default: false})
  public active!: boolean;

  get notificationActive() {
    return this.active;
  }

  set notificationActive(active: boolean) {
    this.$emit('update:active', active);
  }
}

</script>