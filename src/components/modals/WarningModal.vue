<template>
  <b-modal v-bind:active.sync="active">
    <div class="modal-card" style="width: 400px">
      <div class="message is-danger">
        <div class="message-body">
          <div class="columns">
            <div class="column is-narrow">
              <alert-triangle-icon size="1.5x"></alert-triangle-icon>
            </div>
            <div class="column">
              <h3 class="is-size-5 has-text-weight-bold">
                {{msg_title}}
              </h3>
            </div>
          </div>
          <p>
            {{msg_body}}
          </p>
          <div class="columns">
            <div class="column is-whole has-text-centered buttons">
              <button v-on:click="$emit('submit')" class="button is-danger"><strong>{{btn_submit_txt}}</strong></button>
              <button v-on:click="$emit('cancel')" class="button">{{btn_cancel_txt}}</button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AlertTriangleIcon } from 'vue-feather-icons'

@Component({
  components: {AlertTriangleIcon}
})
export default class WarningModal extends Vue {
  public active: boolean = false;
  public msg_title : string = 'Message Title';
  public msg_body: string = 'Message Body';
  public btn_submit_txt: string = 'Submit';
  public btn_cancel_txt: string = 'Cancel';
}

</script>