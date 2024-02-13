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
  <div class="corfirm-import">
    <article class="message is-warning" v-if="confirmImportState.saveStarted">
      <div class="message-body">
        Your import is being processed. You can view on its progress by going to the <router-link v-bind:to="{name: 'job-management', params:{programId: activeProgram.id}}">Jobs</router-link> page.
      </div>
    </article>
    <article class="message is-success">
      <div class="message-body">
        <nav class="columns">
          <div class="column">
            <slot></slot>
            <div
              v-if="$slots.default === undefined"
              class="has-text-dark">
              {{numRecords}} unique term(s) have been detected. Terms, highlighted and with
              a <alert-triangle-icon size="1x" class="has-vertical-align-middle"></alert-triangle-icon> icon,
              match existing terms in the database and will not be imported.
            </div>
          </div>
          <div class="column is-narrow">
            <div class="level">
              <div class="level-item">
                <button
                    class="button is-success has-text-weight-bold"
                    v-on:click="confirm"
                    v-bind:disabled="confirmImportState.saveStarted"
                    v-bind:class="{'is-loading': confirmImportState.saveStarted}">
                  Confirm
                </button>
              </div>
              <div class="level-item  ml-2">
                <div>
                  <button class="button is-outlined" v-on:click="abort">Abort</button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import {AlertTriangleIcon} from 'vue-feather-icons'
  import {StringFormatters} from '@/breeding-insight/utils/StringFormatters'
  import {DataFormEventBusHandler} from "@/components/forms/DataFormEventBusHandler";
  import {mapGetters} from "vuex";
  import { Program } from '@/breeding-insight/model/Program';

  @Component({
    components: {
      AlertTriangleIcon
    },
    computed: {
      ...mapGetters([
        'activeProgram',
      ])
    },
  })
  export default class ConfirmImportMessageBox extends Vue {

    @Prop()
    private numRecords!: number;

    @Prop()
    importTypeName! : string;

    @Prop()
    confirmImportState!: DataFormEventBusHandler;

    @Prop({default: true})
    private showLoadingOnConfirm!: boolean;

    private activeProgram?: Program;
    confirm() {
      this.$emit('confirm');
      if (this.showLoadingOnConfirm) {
        this.confirmImportState.bus.$emit(DataFormEventBusHandler.SAVE_STARTED_EVENT);
      }
    }

    abort() {
      this.$emit('abort');
    }

    toStartCase(str : string) {
      return StringFormatters.toStartCase(str);
    }

  }
</script>

<!-- keeping this scoped since it's only used here as a one-off -->
<style scoped>
.icon-align {
  margin-bottom: -0.25em;
}
</style>
