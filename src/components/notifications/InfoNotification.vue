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
  <b-notification type="is-info" v-bind:active.sync="isInfoNotificationActive" aria-close-label="Close Notification"
    role="alert" v-on:close="onClose">
    <div class="level">
        <div class="level-left">
            <div class="level-item">
                <InfoIcon size="1.5x"></InfoIcon>
            </div>
            <div class="level-item" :class="bannerTextClass">
                {{infoNotificationMsg}}
            </div>
        </div>
    </div>
  </b-notification>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { InfoIcon } from 'vue-feather-icons';
import {DEACTIVATE_INFO_NOTIFICATION} from "@/store/mutation-types";
import {mapGetters} from "vuex";


@Component({
  components: {InfoIcon},
  computed: {
    ...mapGetters([
      'isInfoNotificationActive',
      'infoNotificationMsg'
    ])
  }
})
export default class InfoNotification extends Vue {
  private bannerTextClass: string = "banner-text";

  onClose(){
    this.$store.commit(DEACTIVATE_INFO_NOTIFICATION);
  }
}

</script>