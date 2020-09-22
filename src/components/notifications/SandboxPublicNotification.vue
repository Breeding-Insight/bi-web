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
  <b-notification type="is-warning" v-bind:active.sync="notificationActive" aria-close-label="Close Notification"
                  role="alert">
    <div class="content">
      <h1 class="title is-4">This is a sandbox site open to the general public.</h1>
      <ul class="is-size-5">
        <li>Anything you submit to this site is viewable by others. Please use discretion and courtesy.</li>
        <li>Data submitted to this site is not private in any way. Only enter data that is cleared for public viewing.</li>
        <li>This site is refreshed regularly as development updates occur to demonstrate new features. <strong>The database is frequently deleted during updates.</strong></li>
        <li><a href="#" v-on:click="$showCollectorDialog()" class="has-text-link">Send feedback or report issues</a> to the development team.</li>
      </ul>
      <div class="buttons is-centered">
        <button class="button is-dark" v-on:click="$emit('update:active', false)">I understand, close this message</button>
      </div>
    </div>
  </b-notification>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import { InfoIcon } from 'vue-feather-icons'

@Component({
  components: {InfoIcon}
})
export default class SandboxPublicNotification extends Vue {
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


