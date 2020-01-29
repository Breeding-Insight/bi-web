<template>
  <b-notification type="is-info" v-bind:active.sync="active" aria-close-label="Close Notification" 
    role="alert">
    <div class="level">
        <div class="level-left">
            <div class="level-item">
                <InfoIcon size="1.5x"></InfoIcon>
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
import { InfoIcon } from 'vue-feather-icons'

@Component({
  components: {InfoIcon}
})
export default class InfoNotification extends Vue {
  public active: boolean = false;
  public msg : string = '';
}

</script>