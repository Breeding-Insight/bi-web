<template>
  <b-notification type="is-success" v-bind:active.sync="active" aria-close-label="Close Notification" 
    role="alert">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <CheckCircleIcon size="1.5x"></CheckCircleIcon>
        </div>
        <div class="level-item">
          {{msg}}
        </div>
      </div>
    </div>
  </b-notification>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';
import { CheckCircleIcon } from 'vue-feather-icons'

@Component({
  components: {CheckCircleIcon}
})
export default class SuccessNotification extends Vue {
  public active: boolean = false;
  public msg : string = '';
}

</script>