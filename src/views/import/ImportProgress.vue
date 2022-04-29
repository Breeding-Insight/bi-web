<template>
  <div v-if="uploadId !== undefined">
    <template v-if="loading">
      Loading...
    </template>
    <template v-else-if="import_errors !== undefined">
      {{ import_errors }}
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
  uploadId?: string;
  @Prop()
  commit!: string;

  private activeProgram?: Program;

  private loading: boolean = false;
  private response: ImportResponse = new ImportResponse();
  private import_errors: ValidationError | String | null = null;

  @Watch('uploadId')
  getImport() {
    if (this.uploadId) {
      this.getDataUpload();
    }
  }

  async getDataUpload() {
    try {
      this.loading = true;

      this.response = await ImportService.getDataUpload(this.activeProgram!.id!, this.uploadId);

      console.log('here!');
      console.log(this.response);

      if (!this.response.progress) {
        this.$log.error('Progress object was not returned with progress response.')
        throw 'Progress object not returned';
      } else if (this.response.progress.statusCode === 202) {
        // Wait a second, and call GET call again
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.getDataUpload();
      } else {
        // Our call is finished, check the response
        if (this.response.progress && this.response.progress.statusCode != 200) {
          this.parseErrorResponse(this.response);
        }

        // Calculate some stuff for the preview data display
        // TODO: Add pagination to this
        /*
        if (this.response && this.response.preview && this.response.preview.rows) {
          this.previewTotalRows = this.response.preview.rows.length;
          this.previewData = this.response.preview.rows as any[];
          this.newObjectCounts = this.response.preview.statistics;
          // TODO: Temp pagination
          this.pagination.totalCount = this.response.preview.rows.length;
          this.pagination.pageSize = 10;
          this.pagination.currentPage = 1;
          this.pagination.totalPages = 1;
        }
         */

        if (this.commit) {
          this.$emit('show-success-notification', `Imported records have been added to ${this.activeProgram!.name}.`);
          this.emitFinished();
        }
      }

    } catch (e) {
      console.log(e);
      this.$emit('show-error-notification', e.response.statusText);
    } finally {
      this.loading = false;
    }
  }

  parseErrorResponse(response: ImportResponse) {
    if (response.progress) {
      this.import_errors = ImportService.parseError(e);
      if (commit) {
        const formattedErrors = ImportService.formatErrors(this.import_errors as ValidationError).join(' ');
        this.$emit('show-error-notification', formattedErrors);
      } else {
        this.$emit('show-error-notification', response.progress.message);
      }
    } else {
      this.$emit('show-error-notification', 'An unknown error has occurred during import');
    }
    this.emitError()
  }

  emitFinished() {
    this.$emit('import-finished', this.response);
  }

  emitError() {
    this.$emit('import-error', this.import_errors);
  }
}
</script>

<style scoped>

</style>