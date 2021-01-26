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
  <div class="columns is-centered">
    <div class="card column is-half">
      <div class="card-content">
        <div class="newaccount message is-success">
          <div class="message-body">
            <article class="media">
              <figure class="media-left">
                <p class="image is-24x24">
                  <check-circle-icon size="1.5x"></check-circle-icon>
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <h3 class="is-5 title has-text-success">
                    Account Successfully Activated
                  </h3>
                </div>
              </div>
            </article>
            <p class="has-text-dark">
              Your account has been successfully activated. Visit your account page to get started!
            </p>
            <router-link
              tag="button"
              v-bind:to="{name:'program-selection'}"
              v-bind:replace="true"
              class="button is-primary"
            >
              Go to my account
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Component from "vue-class-component";
  import {Vue} from "vue-property-decorator";
  import {CheckCircleIcon} from "vue-feather-icons";

  @Component({
    components: {CheckCircleIcon}
  })
  export default class AccountCreationSuccess extends Vue {

  }
</script>
