<template>
  <section :id="'germplasmDownloadButton-' + listDbId">
    <FormModal
      v-bind:active.sync="modalActive"
      v-bind:title="modalTitle"
      v-on:deactivate="modalActive = false"
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
      <template #buttons>
        <div class="columns">
          <div class="column is-whole has-text-centered buttons">
            <button
              class="button is-primary has-text-weight-bold"
              v-on:click="downloadList"
            >
              <strong>Download</strong>
            </button>
            <button
              class="button"
              v-on:click="cancelDownload"
            >
              Cancel
            </button>
          </div>
        </div>
      </template>
    </FormModal>
    <a
      href="javascript:void(0)"
      v-on:click="activateExtensionSelect"
    >
      <slot />
    </a>
  </section>
</template>

<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import FormModal from "@/components/modals/FormModal.vue";
import {FileTypeOption} from "@/breeding-insight/model/FileTypeOption";

@Component({
  mixins: [validationMixin],
  components: { FormModal },
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
  private modalActive: boolean = false;
  private fileExtension: string = FileTypeOption.xls.id;
  private fileOptions = Object.values(FileTypeOption);

  setFileExtension(value: string){
    this.fileExtension = value;
  }

  activateExtensionSelect(){
    this.modalActive = true;
  }

  downloadList() {
    this.modalActive = false;
    if (this.activeProgram) {
      window.open(process.env.VUE_APP_BI_API_ROOT + '/v1/programs/' + this.activeProgram.id + '/germplasm/lists/' + this.listDbId + '/export?fileExtension=' + this.fileExtension, '_blank');
    }
  }

  cancelDownload(){
    this.modalActive = false;
    this.fileExtension = "";
  }
}
</script>