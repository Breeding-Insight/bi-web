<template>
  <div>
    <template v-if="importErrors !== undefined">
      {{ importErrors }}
    </template>
    <template v-else>
      <ProgressBar
          v-bind:max="currentImport.progress ? currentImport.progress.total : undefined"
          v-bind:value="currentImport.progress ? currentImport.progress.finished : undefined"
          v-bind:estimated-time-text="currentImport.progress ? currentImport.progress.message: undefined"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {mapGetters} from "vuex";
import {ImportResponse} from "@/breeding-insight/model/import/ImportResponse";
import {ImportService} from "@/breeding-insight/service/ImportService";
import {Program} from "@/breeding-insight/model/Program";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";

@Component({
  components: {},
  computed: {
    ...mapGetters([
      'activeProgram',
      'activeUser'
    ])
  }
})
export default class ImportProgress extends Vue {
  @Prop()
  private currentImport!: ImportResponse;
  @Prop()
  private importErrors!: ValidationError | String;
}
</script>

<style scoped>

</style>