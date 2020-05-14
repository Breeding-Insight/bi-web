<template>
  <div class="container">
    <div class="card">
      <div class="card-content">
        <h1 class="title has-text-danger">Unable to log you in</h1>
        <p>We were not able to log you into our system.</p>
        <p>You could be experiencing this issue for the following reasons:</p>
        <ul class="is-left" style="list-style-position: inside">
          <li>The head of your program has not added you to their program</li>
          <li>Your account has been made inactive in the system.</li>
          <li>You did not link your Breeding Insight account to your OrcID account
            <ul>
              <li>
                If you did not receive an email for this action, contact the head of your program to
                receive another invite.
              </li>
            </ul>
          </li>
        </ul>
        <router-link v-bind:to="{name:'home'}">
          Return to Home Page
        </router-link>
      </div>
    </div>
  </div>
</template>