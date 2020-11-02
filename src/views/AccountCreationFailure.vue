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
        <div class="message is-danger">
          <div class="message-body">
            <article class="media">
              <figure class="media-left">
                <p class="image is-24x24">
                  <alert-triangle-icon size="1.5x"></alert-triangle-icon>
                </p>
              </figure>
              <div class="media-content">
                <div class="content">
                  <h3
                    v-if="error==='409'"
                    class="is-5 title has-text-danger">
                    A Breeding Insight user with this ORCID iD already exists.
                  </h3>
                  <h3
                    v-else
                    class="is-5 title has-text-danger">
                      Error Activating Account
                  </h3>

                </div>
              </div>
            </article>
            <p
              v-if="error==='409'"
              class="has-text-dark"
              >
              Check with your program to confirm that you do not have an account under another email address.
              Contact a system administrator if the problem persists.
            </p>
            <p
              v-else
              class="has-text-dark">
              There was an error creating your account. Ask your administrator for assistance
              in retrying the account creation process.
            </p>
            <p class="has-text-dark">
              If you continue to experience problems, try
              <a href="http://status.orcid.org/">checking the ORCID status page</a>.
              If all else fails,
              <a href="#!">contact Breeding Insight support</a>.
            </p>
            <router-link v-bind:to="{name:'home'}" v-bind:replace="true">
              Return to Home Page
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import {Prop, Vue} from "vue-property-decorator";
  import {AlertTriangleIcon} from "vue-feather-icons";

  @Component({
    components: {AlertTriangleIcon}
  })
  export default class AccountCreationFailure extends Vue {
    @Prop()
    public error: string | undefined;
  }
</script>
