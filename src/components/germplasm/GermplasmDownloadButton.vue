<template>
  <section :id="'germplasmDownloadButton-' + listDbId">
    <SelectModal
        v-bind:active.sync="modalActive"
        v-bind:title="modalTitle"
        v-bind:fieldset-legend="fieldsetLegend"
        v-bind:options="fileOptions"
        v-on:deactivate="modalActive = false"
        v-on:select-change="setFileExtension"
    >
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
    </SelectModal>
    <a href="#" v-on:click="activateExtensionSelect">
      <slot></slot>
    </a>
  </section>
</template>

<script lang="ts">
import {Component, Vue, Prop} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import SelectModal from "@/components/modals/SelectModal.vue";
import {FileTypeOption} from "@/breeding-insight/model/FileTypeOption";

@Component({
  mixins: [validationMixin],
  components: { SelectModal },
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
  private fileExtension: string = "";
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