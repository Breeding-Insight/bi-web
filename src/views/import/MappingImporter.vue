<template>
  <div>
    <!-- Select the import template -->
    <template v-if="state === ImportState.TEMPLATE_SELECT">
      What type of data are you importing?
      <BasicSelectField
          v-bind:field-name="'Import Data Type'"
          v-bind:options="templateOptions"
          v-on:input="selectTemplate($event)"
      />
    </template>

    <!-- Import view -->
    <!-- TODO: Shrink down during preview -->
    <template v-if="state === ImportState.IMPORT || state === ImportState.CURATE || state === ImportState.PROCESSING">

      <!-- Choose file -->
      Choose a file to import:
      <FileSelector
          v-on:input="importFile()"
          v-model="file"
          fileTypes="'.csv, .xls, .xlsx'"
      />

      <!-- Select existing mapping -->
      <BasicSelectField
          v-bind:field-name="'Map file to template with existing mapping:'"
          v-bind:options="importMappingOptions"
          v-on:input="selectMapping($event)"
      />

      <!-- Create new mapping -->
      Create a new mapping from your selections below:
      <BasicInputField
          v-model="newMappingName"
          v-bind:field-name="'Mapping Name'"
      />

      <!-- Buttons -->
      <div class="level">
        <button
            v-on:click="saveMapping()"
            class="button is-primary"
        >
          Save Mapping
        </button>
        <button
            v-on:click="stateService.send(ImportEvent.PREVIEW)"
            class="button is-primary"
        >
          Preview Data
        </button>
        <button
            v-on:click="stateService.send(ImportEvent.CONFIRM)"
            class="button is-primary"
        >
          Commit Data
        </button>
      </div>
    </template>

    <template v-if="state !== ImportState.TEMPLATE_SELECT">
      <!-- Progress view -->
      <ImportProgress
        v-bind:current-import="currentImport"
        v-bind:import-errors="import_errors" />
    </template>

    <!-- Mapping view component-->
    <template v-if="state === ImportState.IMPORT || state === ImportState.CURATE || state === ImportState.PROCESSING">
      <ImportMappingView
        v-bind:template="selectedTemplate"
        v-bind:mapping="currentMapping"
        v-bind:file-cols="fileColumns"
        v-on:mapping="mapField($event)"
      />
    </template>

    <template v-if="state === ImportState.CURATE">
      <!-- Get our preview tables in here. Use the same ones as other importers -->
      <template v-if="selectedTemplate.id == 1">
        <GermplasmImportPreview
          v-bind:preview-data="previewData"
          v-bind:pagination="pagination"
        />
      </template>
      <template v-else-if="selectedTemplate.id == 2">
        TODO: Insert experiment import preview here
        {{ previewData }}
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {Program} from "@/breeding-insight/model/Program";
import {mapGetters} from "vuex";
import {User} from "@/breeding-insight/model/User";
import {ImportTemplate} from "@/breeding-insight/model/import/ImportTemplate";
import {ImportService} from "@/breeding-insight/service/ImportService";
import {createMachine, interpret} from "@xstate/fsm";
import {ImportMapping} from "@/breeding-insight/model/import/ImportMapping";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import FileSelector from "@/components/file-import/FileSelector.vue";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import ImportMappingView from "@/views/import/ImportMappingView.vue";
import {MapEvent} from "@/views/import/MapEvent";
import {Mapping} from "@/breeding-insight/model/import/Mapping";
import {ImportResponse} from "@/breeding-insight/model/import/ImportResponse";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import {DataFormEventBusHandler} from "@/components/forms/DataFormEventBusHandler";
import {Pagination} from "@/breeding-insight/model/BiResponse";
import ImportProgress from "@/views/import/ImportProgress.vue";
import ProgressBar from "@/components/forms/ProgressBar.vue";
import ImportGermplasm from "@/views/import/ImportGermplasm.vue";
import GermplasmImportPreview from "@/views/import/GermplasmImportPreview.vue";

enum ImportState {
  TEMPLATE_SELECT = "TEMPLATE_SELECT",
  IMPORT = "IMPORT",
  CURATE = "CURATE",
  PROCESSING = "PROCESSING"
}

enum ImportEvent {
  CANCEL_IMPORT = "CANCEL_IMPORT",
  TEMPLATE_SELECTED = "TEMPLATE_SELECTED",
  IMPORT_ERROR = "IMPORT_ERROR",
  IMPORT_SUCCESS = "IMPORT_SUCCESS",
  CONFIRM = "CONFIRM",
  PREVIEW = "PREVIEW",
  DONE = "DONE"
}

enum ImportAction {
  RESET = "RESET",
  SETUP_IMPORT = "SETUP_IMPORT",
  CONFIRM = "CONFIRM",
  PREVIEW = "PREVIEW",
  DONE_SUCCESS = "DONE_SUCCESS",
}

@Component({
  components: {
    GermplasmImportPreview,
    ImportGermplasm,
    ImportProgress, ImportMappingView, BasicInputField, BasicSelectField, FileSelector, ProgressBar},
  computed: {
    ...mapGetters([
      'activeProgram',
      'activeUser'
    ])
  }
})
export default class MappingImporter extends Vue {
  private activeProgram?: Program;
  private activeUser?: User;

  // File variables
  private file : File | null = null;
  private fileColumns: String[] = [];

  // Template variables
  private templates: ImportTemplate[] = [];
  private templateOptions: any[] = [];
  private selectedTemplate?: ImportTemplate | null = null;

  // Mapping variables
  private importMappings: ImportMapping[] = [];
  private importMappingOptions: any[] = [];
  private selectedMapping: ImportMapping | null = null;
  private currentMapping: ImportMapping = new ImportMapping();
  private newMappingName: string = '';

  // Import response variables
  private currentImport?: ImportResponse = new ImportResponse({});
  private import_errors: ValidationError | String | null = null;
  private previewData: any[] = [];
  private previewTotalRows: number = 0;
  private newObjectCounts: any = [];
  private pagination = new Pagination();

  // TODO: State stuff makes class bulky, try to put in separate class
  private ImportState = ImportState;
  private ImportEvent = ImportEvent;
  private ImportAction = ImportAction;

  private state = ImportState.TEMPLATE_SELECT;
  private importStateMachine = createMachine({
    id: 'import',
    initial: ImportState.TEMPLATE_SELECT,
    states: {
      [ImportState.TEMPLATE_SELECT]: {
        entry: ImportAction.RESET,
        on: {
          [ImportEvent.TEMPLATE_SELECTED]: ImportState.IMPORT
        }
      },
      [ImportState.IMPORT]: {
        entry: ImportAction.SETUP_IMPORT,
        on: {
          [ImportEvent.CANCEL_IMPORT]: ImportState.TEMPLATE_SELECT,
          [ImportEvent.PREVIEW]: ImportState.PROCESSING,
        }
      },
      [ImportState.PROCESSING]: {
        entry: ImportAction.PREVIEW,
        on: {
          [ImportEvent.IMPORT_SUCCESS]: ImportState.CURATE,
          [ImportEvent.IMPORT_ERROR]: ImportState.IMPORT
        }
      },
      [ImportState.CURATE]: {
        on: {
          [ImportEvent.PREVIEW]: ImportState.PROCESSING,
          [ImportEvent.CONFIRM]: {
            actions: ImportAction.CONFIRM
          },
          [ImportEvent.DONE]: {
            actions: ImportAction.DONE_SUCCESS,
          }
        }
      }
    }},
    {
      actions: {
        [ImportAction.RESET]: (context, event) => {
          this.reset();
        },
        [ImportAction.SETUP_IMPORT]: (context, event) => {
          this.setupImport();
        },
        [ImportAction.CONFIRM]: (context, event) => {
          this.upload(true);
        },
        [ImportAction.PREVIEW]: (context, event) => {
          this.upload(false);
        }
      }
  });
  private initialState = this.importStateMachine;
  private stateService = interpret(this.importStateMachine);

  created() {
    this.stateService.subscribe(state => {
      this.state = ImportState[state.value as keyof typeof ImportState];
    });
    this.stateService.start();
  }

  mounted() {
    this.getTemplates();
  }

  reset() {
    // TODO: Clear variables
  }

  setupImport() {
    // Get the existing mappings for the given template
    this.getImportMappings();
  }

  selectTemplate(importId: number) {
    this.selectedTemplate = this.templates.filter(template => template.id == importId)[0];
    this.currentMapping.importerTemplateId = this.selectedTemplate.id;
    this.stateService.send(ImportEvent.TEMPLATE_SELECTED);
  }

  selectMapping(mappingId: string) {
    this.selectedMapping = this.importMappings.filter(mapping => mapping.id == mappingId)[0];
    // Get the details for the mapping
    // TODO: Get mapping details
  }

  async importFile() {
    // TODO: Add loading function as file columns are being retrieved
    await this.getFileColumns();
    if (this.selectedMapping) {
      // TODO: Process existing mapping
      // If a mapping is present, use the mapping to map the file columns.
      // Show errors on any missing matchings
    } else {
      // TODO: Automap matching columns
      // If mapping is not present, try to automatically map the file columns
    }
  }

  mapField(mapEvent: MapEvent) {
    ImportMapping.createOrUpdateMapping(this.currentMapping!.mapping!, mapEvent.path!, mapEvent.column!);
    this.$set(this.currentMapping, 'mapping', this.currentMapping.mapping);
  }

  async saveMapping() {
    try {
      if (this.selectedMapping!.id) {
        // If there is a mapping id update the mapping
        await this.updateMapping();
      } else {
        // If there is no mapping id, create a new mapping
        await this.createMapping(true);
      }
    } catch (e) {
        this.$emit('show-error-notification', e.errorMessage);
    }
  }

  async updateMapping() {
    const result: ImportMapping = await ImportService.updateMapping(this.activeProgram!.id!, this.currentMapping);
    this.selectedMapping = result;
  }

  async createMapping(saved: boolean) {
      const result: ImportMapping = await ImportService.saveMapping(this.activeProgram!.id!, this.currentMapping, {saved});
      this.selectedMapping = result;
  }

  async getTemplates() {
      try {
        const templates: ImportTemplate[] = await ImportService.getAllTemplates();
        this.templates = templates;
        this.templateOptions = templates.map(template => { return { 'id': template.id, 'name': template.name}; });
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Unable to load import templates`);
      }
  }

  async getImportMappings() {
    try {
      const importMappings: ImportMapping[] = await ImportService.getAllMappings(this.activeProgram!.id!);
      this.importMappings = importMappings;
      this.importMappingOptions = importMappings.map(importMapping => { return { 'id': importMapping.id, 'name': importMapping.name}; });
    } catch (e) {
      this.$log.error(e);
      this.$emit('show-error-notification', `Unable to load existing import mappings`);
    }
  }

  async getFileColumns() {
    const fileColumns: string[] = await ImportService.getFileColumns(this.file!);
    this.fileColumns = fileColumns;
  }

  async upload(commit: boolean) {
    // TODO: Try to combine code from the ImportTemplate, all this code is the same
    // TODO: Loading wheel
    try {
      // Save the mapping if necessary before uploading
      await this.createMapping(false);

      let previewResponse: ImportResponse = await ImportService.uploadData(
        this.activeProgram!.id!,
        this.selectedTemplate!.id!,
        this.file!,
        {
          userInput: {},
          commit,
          mappingId: this.selectedMapping!.id
        });

      this.currentImport = previewResponse;
      // Check import response
      const response: ImportResponse = await this.getDataUpload();
      this.currentImport = response;

      if (commit) {
        this.$emit('show-success-notification', `Imported records have been added to ${this.activeProgram!.name}.`);
        // TODO: navigate to appropriate record list page when we have it
        this.stateService.send(ImportEvent.DONE);
      } else {
        this.stateService.send(ImportEvent.IMPORT_SUCCESS);
      }
    } catch (e) {

      if (e.progress) {
        this.import_errors = ImportService.parseError(e);
        if (commit) {
          const formattedErrors = ImportService.formatErrors(this.import_errors as ValidationError).join(' ');
          this.$emit('show-error-notification', formattedErrors);
        } else {
          this.$emit('show-error-notification', e.progress.message);
        }
      } else if (e.errorMessage) {
        this.$emit('show-error-notification', e.errorMessage);
      } else {
        this.$log.error(e);
        this.$emit('show-error-notification', 'An unknown error has occurred during import');
      }
      this.stateService.send(ImportEvent.IMPORT_ERROR);
    } finally {
      // TODO: Turn off loading wheel
    }
  }

  async getDataUpload(): Promise<ImportResponse> {
    try {
      const previewResponse: ImportResponse = await ImportService.getDataUpload(this.activeProgram!.id!, this.currentImport!.importId!);
      this.currentImport = previewResponse;

      if (!previewResponse.progress) {
        this.$log.error('Progress object was not returned with progress response.')
        throw 'Progress object not returned';
      } else if (previewResponse.progress.statusCode === 202) {
        // Wait a second, and call GET call again
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getDataUpload();
      } else {
        // Our call is finished, check the response
        if (previewResponse.progress && previewResponse.progress.statusCode != 200){
          return previewResponse;
        }

        // Calculate some stuff for the preview data display
        // TODO: Add pagination to this
        if (previewResponse && previewResponse.preview){
          if (previewResponse.preview && previewResponse.preview.rows) {
            this.previewTotalRows = previewResponse.preview.rows.length;
            this.previewData = previewResponse.preview.rows as any[];
            this.newObjectCounts = previewResponse.preview.statistics;
            this.stateService.send(ImportEvent.IMPORT_SUCCESS);
            // TODO: Temp pagination
            this.pagination.totalCount = previewResponse.preview.rows.length;
            this.pagination.pageSize = 10;
            this.pagination.currentPage = 1;
            this.pagination.totalPages = 1;
          }
        }
        return previewResponse;
      }

    } catch (e) {
      // TODO: Throw error here
      throw e;
    }
  }
}
</script>
