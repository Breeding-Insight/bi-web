<template>
  <div class="container">
    <div class="card">
      <div class="card-content">
        <h1 class="title has-text-danger">Unable to log you in</h1>
        <p>You could be experiencing this issue for one of the following reasons:</p>
        <ul>
          <li>You have not been added to this program.</li>
          <li>Your Breeding Insight account has been deactivated.</li>
        </ul>
        <p>To resolve this issue, contact the program to send a new invite or reactivate your account.</p>
        <router-link v-bind:to="{name:'home'}">
          Return to Home Page
        </router-link>
      </div>
    </div>
  </div>
</template>