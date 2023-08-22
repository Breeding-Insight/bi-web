<template>
  <DownloadButton
    v-bind:unique-id="listDbId"
    v-bind:modal-title="modalTitle"
    v-bind:download="downloadList"
    v-on:deactivate="cancelDownload"
  >
    <template #form>
      <fieldset>
        <legend class="label">
          {{ fieldsetLegend }}
        </legend>
        <div
          v-for="option in fileOptions"
          v-bind:key="option.id"
        >
          <label class="radio">
            <input
              v-model="fileExtension"
              type="radio"
              name="fileType"
              v-bind:value="option.id"
            ><span class="check" />
            <span class="control-label"> {{ option.name }} </span>
          </label>
        </div>
      </fieldset>
    </template>
    <slot />
  </DownloadButton>
</template>

<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {FileTypeOption} from "@/breeding-insight/model/FileTypeOption";
import DownloadButton from "@/components/DownloadButton.vue";

@Component({
  mixins: [validationMixin],
  components: {DownloadButton},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class GermplasmDownloadButton extends Vue {

  @Prop()
  listDbId!: string;
  @Prop()
  modalTitle?: string;
  @Prop()
  fieldsetLegend?: string;

  private activeProgram?: Program;
  private fileOptions: FileTypeOption[] = Object.values(FileTypeOption);
  private fileExtension: string = this.fileOptions[0].id;

  downloadList(): boolean {
    if (this.activeProgram) {
      window.open(process.env.VUE_APP_BI_API_ROOT + '/v1/programs/' + this.activeProgram.id + '/germplasm/lists/' + this.listDbId + '/export?fileExtension=' + this.fileExtension, '_blank');
      return true;
    }
    return false;
  }

  cancelDownload(){
    // Reset fileExtension.
    this.fileExtension = this.fileOptions[0].id;
  }
}
</script>