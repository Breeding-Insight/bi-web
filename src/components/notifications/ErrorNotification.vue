<template>
  <b-notification type="is-danger" v-bind:active.sync="active" aria-close-label="Close Notification" 
    role="alert">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
            <AlertCircleIcon size="1.5x"></AlertCircleIcon>
        </div>
        <div class="level-item">
            {{msg}}
        </div>
      </div>
    </div>
  </b-notification>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AlertCircleIcon } from 'vue-feather-icons'

@Component({
  components: {AlertCircleIcon}
})
export default class ErrorNotification extends Vue {
  public active: boolean = false;
  public msg : string = '';
}

</script>