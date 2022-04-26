<template>
  <div>
    <!-- View all imports -->
    <ImportStepCard
        title="Previous Imports"
        v-if="panelIsVisible(PanelState.ALL_IMPORT_PANEL) && prevImports.length > 0"
        v-bind:completed="panelIsActive(PanelState.ALL_IMPORT_PANEL)"
        v-bind:readonly="panelIsActive(PanelState.ALL_IMPORT_PANEL)"
    >
    </ImportStepCard>

    <!-- Select Import Option -->
    <ImportStepCard
        title="Step 1: Select Import Option"
        v-if="panelIsVisible(PanelState.IMPORT_START_PANEL)"
        v-bind:completed="panelIsActive(PanelState.IMPORT_START_PANEL)"
        v-bind:readonly="panelIsActive(PanelState.IMPORT_START_PANEL)"
    >
      <template v-slot:write-display>
        <div class="columns">
          <div class="column is-half">
            <BasicSelectField
                v-bind:selected-id="selectedMappingId"
                v-bind:field-name="'Import Type'"
                v-bind:options="importMappingOptions"
                v-on:input="selectedMappingId = $event"
            />
          </div>
          <div class="column is-half">
            <!-- TODO: Only available for admins -->
            <a
                v-on:click="createNewMapping"
            >
              Create New Import
            </a>
          </div>
        </div>
        <div class="columns">
          <div class="column is-half is-offset-half has-text-right">
            <button
                v-on:click="selectMapping"
                class="button is-primary"
            >
              Select Import
            </button>
          </div>
        </div>
      </template>
      <template v-slot:summary-display>
      </template>
    </ImportStepCard>

    <!-- Choose File -->
    <ImportStepCard
        title="Step 2: Upload File"
        v-if="panelIsVisible(PanelState.CHOOSE_FILE_PANEL)"
        v-bind:completed="panelIsActive(PanelState.CHOOSE_FILE_PANEL)"
        v-bind:readonly="panelIsActive(PanelState.CHOOSE_FILE_PANEL)"
    >
      <!-- Editing view -->
      <template v-slot:write-display>
        <FileSelectMessageBox
            v-model="file"
            v-bind:fileTypes="'.csv, .xls, .xlsx'"
            v-bind:errors="import_errors"
            v-on:import="pageState === PageState.CREATE_MAPPING ? uploadMappingFile() : viewPreview()"
        />
      </template>

      <!-- Summary View -->
      <template v-slot:summary-display>
        I am the summary
      </template>
    </ImportStepCard>

    <!-- Specify Mapping Metadata -->
    <ImportStepCard
        title="Step 3: Mapping Metadata"
        v-if="panelIsVisible(PanelState.CHOOSE_IMPORT_PANEL)"
        v-bind:completed="panelIsActive(PanelState.CHOOSE_IMPORT_PANEL)"
        v-bind:readonly="panelIsActive(PanelState.CHOOSE_IMPORT_PANEL)"
    >
      <!-- Editing view -->
      <template v-slot:write-display>
        <!-- TODO: Show how many times each column is used -->
        What type of data are you importing?
        <BasicSelectField
            v-bind:field-name="'Import Data Type'"
            v-bind:options="importConfigOptions"
            v-on:input="selectImportConfig($event)"
        />
        <template
            v-if="selectedImportConfig !== null"
        >
          <p>{{selectedImportConfig.description}}</p>
        </template>
        <BasicInputField
          v-bind:field-name="'Import Mapping Name'"
          v-bind:field-help="'This is the name of the import mapping users will start when importing a file. Reserved import names: Germplasm.'"
          v-bind:value="mapping.name"
          v-on:input="mapping.name = $event"
        />

        <button
            class="button is-primary"
            v-on:click="updateMappingMetadata"
        >
          Confirm
        </button>
      </template>
      <!-- Summary view -->
      <template v-slot:summary-display>
      </template>
    </ImportStepCard>

    <!-- Create the Mapping -->
    <ImportStepCard
        title="Step 4: Create Mapping"
        v-if="panelIsVisible(PanelState.MAPPING_PANEL)"
        v-bind:completed="panelIsActive(PanelState.MAPPING_PANEL)"
        v-bind:readonly="panelIsActive(PanelState.MAPPING_PANEL)"
    >
      <!-- Editing View -->
      <template v-slot:write-display>
        <ColumnSummary v-bind:columns="getFileHeaders()"></ColumnSummary>

        <template v-if="focusObjectId !== null">
          <template v-for="({config, mappedField, path}) in [getMapping(focusObjectId)]">
            <h1 class="h1" v-bind:key="`title${config.id}`">{{config.name}}</h1>
            <p v-bind:key="`description${config.id}`">{{config.description}}</p>

            <nav class="breadcrumb" aria-label="breadcrumbs" v-bind:key="`nav${mappedField.id}`">
              <ul>
                <li>
                  <a v-on:click="setFocusObject(null)">
                    <span>Mapping - {{selectedImportConfig.name}} Import</span>
                  </a>
                </li>
                <template v-for="{pathConfig, pathMapping} in getMappingPathWithConfig(path)">
                  <li
                      v-bind:key="`breadcrumb${pathMapping.id}`"
                      v-bind:class="{'is-active': pathMapping.id === focusObjectId}"
                  >
                    <a href="#" v-on:click="setFocusObject(pathMapping.id)">
                  <span class="icon is-small">
                    <i class="fas fa-thumbs-up" aria-hidden="true"></i>
                  </span>
                      <span>{{pathConfig.name}}</span>
                    </a>
                  </li>
                </template>
              </ul>
            </nav>
          </template>
        </template>
        <template v-else>
          <h1 class="h1">{{selectedImportConfig.name}}</h1>
          <p>{{selectedImportConfig.description}}</p>
        </template>
        <!-- TODO: Add description of our focused object -->
        <!-- Focused Fields -->
        <template v-for="({config, mappedField}, i) in getFocusedFields()">

          <!-- Object fields -->
          <template v-if="config.type === ImportDataType.OBJECT">
            <ObjectMappingRow
                v-bind:key="`${config.id}${i}`"
                v-bind:config="config"
                v-bind:mapping="mappedField"
                v-bind:import-mapping="mapping"
                v-on:focus-object="setFocusObject($event)"
            />
          </template>

          <!-- List fields -->
          <template v-else-if="config.type === ImportDataType.LIST">
            <div
                v-bind:key="config.id"
                class="box"
            >
              <ListMappingRow
                  v-bind:field="config"
                  v-bind:mapping="mappedField"
                  v-bind:import-mapping="mapping"
                  v-on:focus-object="focusObjectId = $event"
              />
            </div>
          </template>

          <!-- Relationship objects -->
          <template v-else-if="config.type === ImportDataType.RELATIONSHIP">
            <div
                v-bind:key="config.id"
                class="box"
            >
              <RelationMappingRow
                  v-bind:field="config"
                  v-bind:mapping="mappedField"
                  v-bind:import-mapping="mapping"
                  v-bind:file-columns="getFileHeaders()"
                  v-on:mapping-change="$forceUpdate()"
              />
            </div>
          </template>


          <!-- Simple fields -->
          <template v-else>
            <div
                v-bind:key="config.id"
                class="box mb-5"
            >
              <FieldMappingRow
                  v-bind:key="config.id"
                  v-bind:field="config"
                  v-bind:mapping="mappedField"
                  v-bind:import-mapping="mapping"
                  v-bind:fileFields="getFileHeaders()"
              />
            </div>
          </template>


        </template>

        <div class="columns">
          <div class="column has-text-right">
            <button
              class="button"
              v-on:click="cancelMapping"
            >
              Return to Import Start
            </button>
            <button
              class="button"
              v-on:click="updateMapping"
            >
              Save Mapping
            </button>
            <button
              class="button is-primary ml-2"
              v-on:click="updateMappingAndPreview"
            >
              Save Mapping and Preview Import
            </button>
          </div>
        </div>
      </template>

      <!-- Summary View -->
      <template v-slot:summary-display>
      </template>

    </ImportStepCard>

    <!-- Preview Import -->
    <ImportStepCard
        title="Step 5: Preview Import"
        v-if="panelIsVisible(PanelState.PREVIEW_PANEL)"
        v-bind:completed="panelIsActive(PanelState.PREVIEW_PANEL)"
        v-bind:readonly="panelIsActive(PanelState.PREVIEW_PANEL)"
    >
      <!-- Editing View -->
      <template v-slot:write-display>
        <!-- Progress -->
        <template v-if="currentImport.progress.statusCode == 202">
          <ProgressBar
              v-bind:max="currentImport.progress.total"
              v-bind:value="currentImport.progress.finished"
              v-bind:estimated-time-text="currentImport.progress.message"
          />
        </template>

        <!-- Preview -->
        <template v-else-if="currentImport.progress.statusCode == 200">
          <!-- User Input -->
          <template v-if="getUserInputFields(selectedImportConfig.fields).length > 0">
            <div class="box mb-5">
              <h3>User Input</h3>
              <template v-for="field of getUserInputFields(selectedImportConfig.fields)">

                <BasicInputField
                    v-bind:key="field.id"
                    v-bind:field-name="field.name"
                    v-bind:field-help="field.description"
                    v-bind:value="userInput[field.id]"
                    v-on:input="userInput[field.id] = $event"
                />
              </template>
            </div>
          </template>

          <p>Total number of rows: {{previewTotalRows}}</p>
          <template v-for="key of Object.keys(newObjectCounts)">
            <p v-bind:key="key">New {{key}} count: {{newObjectCounts[key].newObjectCount}}</p>
          </template>
          <p>Sample data:</p>
          <div>
            <tree-view :data="previewData" :options="{maxDepth: 0}"></tree-view>
          </div>
          <div class="columns">
            <div class="column is-half is-offset-half has-text-right">
              <button
                  v-on:click="commitData"
                  class="button is-primary"
              >
                Save Data
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <MultipleErrors
              v-bind:formatted-errors.sync="formattedErrors"
              v-bind:is-validation-error="isValidationError"
          />
        </template>
      </template>

      <!-- Summary View -->
      <template v-slot:summary-display>
      </template>

    </ImportStepCard>

    <ImportStepCard
      title="Commit Data"
      v-if="panelIsVisible(PanelState.COMMIT_PANEL)"
      v-bind:completed="panelIsActive(PanelState.COMMIT_PANEL)"
      v-bind:readonly="panelIsActive(PanelState.COMMIT_PANEL)"
    >
      <template v-slot:write-display>
        <!-- In Progress -->
        <template v-if="currentImport.progress.statusCode == 202">
          <ProgressBar
              v-bind:max="currentImport.progress.total"
              v-bind:value="currentImport.progress.finished"
              v-bind:estimated-time-text="currentImport.progress.message"
          />
        </template>

        <!-- Finished -->
        <template v-else-if="currentImport.progress.statusCode == 200">
          <p>
            Your data was uploaded successfully.
          </p>
          <p>
            <a href="#">Go see your data</a>
          </p>
          <p>
            <a v-on:click="cancelMapping">Start another import</a>
          </p>
        </template>

        <!-- Error -->
        <template v-else>
          <MultipleErrors
            v-bind:formatted-errors="formattedErrors"
            v-bind:is-validation-error="isValidationError"
          />
        </template>
      </template>

      <template v-slot:summary-display></template>
    </ImportStepCard>


  </div>
</template>

<script lang="ts">


import {Component, Vue} from "vue-property-decorator";
import {createMachine, interpret} from "@xstate/fsm";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import FileSelectMessageBox from "@/components/file-import/FileSelectMessageBox.vue";
import {ImportService} from "@/breeding-insight/service/ImportService";
import {ImportTypeConfig} from "@/breeding-insight/model/import/ImportTypeConfig";
import {ImportData} from "@/breeding-insight/model/import/ImportData";
import {ImportCollectTime, ImportDataType, ImportField} from "@/breeding-insight/model/import/ImportField";
import {ImportMappingConfig} from "@/breeding-insight/model/import/ImportMapping";
import FieldMappingRow from "@/components/import/FieldMappingRow.vue";
import {ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";
import {ChevronDownIcon} from "vue-feather-icons";
import ImportStepCard from "@/components/import/ImportStepCard.vue";
import ObjectMappingRow from "@/components/import/ObjectMappingRow.vue";
import ColumnSummary from "@/components/import/ColumnSummary.vue";
import RelationMappingRow from "@/components/import/RelationMappingRow.vue";
import {Mapping} from "@/breeding-insight/model/import/Mapping";
import ListMappingRow from "@/components/import/ListMappingRow.vue";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {User} from "@/breeding-insight/model/User";
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import {ImportResponse} from "@/breeding-insight/model/import/ImportResponse";
import ProgressBar from "@/components/forms/ProgressBar.vue";
import MultipleErrors from "@/components/file-import/MultipleErrors.vue";
import {ValidationErrorService} from "@/breeding-insight/service/ValidationErrorService";

enum PageState {
    CREATE_MAPPING = "CREATE_MAPPING",
    IMPORT_DATA = "IMPORT_DATA"
  }

  enum ImportState {
    CHOOSE_IMPORT = "CHOOSE_IMPORT",
    CHOOSE_MAPPING_FILE = "CHOOSE_MAPPING_FILE",
    CHOOSE_DATA_FILE = "CHOOSE_DATA_FILE",
    CHOOSE_IMPORT_TYPE = "CHOOSE_IMPORT_TYPE",
    MAPPING = "MAPPING",
    PREVIEW_IMPORT = "PREVIEW_IMPORT",
    COMMIT_IMPORT = "COMMIT_IMPORT"
  }

  enum ImportEvent {
    CREATE_NEW_IMPORT = "CREATE_NEW_IMPORT",
    IMPORT_SUCCESS = "IMPORT_SUCCESS",
    PREVIEW_IMPORT = "PREVIEW_IMPORT",
    SAVE_MAPPING_METADATA_SUCCESS = "SAVE_MAPPING_METADATA_SUCCESS",
    CANCEL_MAPPING = "CANCEL_MAPPING",
    SELECTED_MAPPING = "SELECTED_MAPPING",
    UPLOAD_DATA_SUCCESS = "UPLOAD_DATA_SUCCESS",
    COMMIT_IMPORT = "COMMIT_IMPORT"
  }

  enum ImportAction {
    CHOOSE_IMPORT_START = "CHOOSE_IMPORT_START",
    CHOOSE_MAPPING_FILE_START = "CHOOSE_MAPPING_FILE_START",
    CHOOSE_MAPPING_FILE_CANCEL = "CHOOSE_MAPPING_FILE_CANCEL",
    CHOOSE_DATA_FILE_START = "CHOOSE_DATA_FILE_START",
    CHOOSE_DATA_FILE_CANCEL = "CHOOSE_DATA_FILE_CANCEL",
    CHOOSE_IMPORT_TYPE_START = "CHOOSE_IMPORT_TYPE_START",
    CHOOSE_IMPORT_TYPE_CANCEL = "CHOOSE_IMPORT_TYPE_CANCEL",
    MAPPING_START = "MAPPING_START",
    MAPPING_CANCEL = "MAPPING_CANCEL",
    PREVIEW_IMPORT_START = "PREVIEW_IMPORT_START",
    PREVIEW_IMPORT_CANCEL = "PREVIEW_IMPORT_CANCEL",
    COMMIT_IMPORT_START = "COMMIT_IMPORT_START",
    COMMIT_IMPORT_CANCEL = "COMMIT_IMPORT_START"
  }

  // Determines what panels are shown when
  const PanelState = {
    ALL_IMPORT_PANEL: {
      activeState: [ImportState.CHOOSE_IMPORT],
      visibleState: Object.keys(ImportState),
      pageState: [PageState.IMPORT_DATA, PageState.CREATE_MAPPING]
    },
    IMPORT_START_PANEL: {
      activeState: [ImportState.CHOOSE_IMPORT],
      visibleState: Object.keys(ImportState),
      pageState: [PageState.IMPORT_DATA, PageState.CREATE_MAPPING]
    },
    CHOOSE_FILE_PANEL: {
      activeState: [ImportState.CHOOSE_DATA_FILE, ImportState.CHOOSE_MAPPING_FILE],
      visibleState: Object.keys(ImportState).filter(state => state != ImportState.CHOOSE_IMPORT),
      pageState: [PageState.IMPORT_DATA, PageState.CREATE_MAPPING]
    },
    CHOOSE_IMPORT_PANEL: {
      activeState: [ImportState.CHOOSE_IMPORT_TYPE],
      visibleState: [ImportState.CHOOSE_IMPORT_TYPE, ImportState.MAPPING,
        ImportState.PREVIEW_IMPORT, ImportState.COMMIT_IMPORT],
      pageState: [PageState.CREATE_MAPPING]
    },
    MAPPING_PANEL: {
      activeState: [ImportState.MAPPING],
      visibleState: [ImportState.MAPPING,
        ImportState.PREVIEW_IMPORT, ImportState.COMMIT_IMPORT],
      pageState: [PageState.CREATE_MAPPING]
    },
    PREVIEW_PANEL: {
      activeState: [ImportState.PREVIEW_IMPORT],
      visibleState: [ImportState.PREVIEW_IMPORT, ImportState.COMMIT_IMPORT],
      pageState: [PageState.IMPORT_DATA, PageState.CREATE_MAPPING]
    },
    COMMIT_PANEL: {
      activeState: [ImportState.COMMIT_IMPORT],
      visibleState: [ImportState.COMMIT_IMPORT],
      pageState: [PageState.IMPORT_DATA, PageState.CREATE_MAPPING]
    }
  }

  @Component({
    components: {
      MultipleErrors,
      ProgressBar,
      BasicInputField,
      ListMappingRow,
      RelationMappingRow,
      ColumnSummary,
      ObjectMappingRow, ImportStepCard, FieldMappingRow, BasicSelectField, FileSelectMessageBox, ChevronDownIcon},
    data: () => ({ImportState, ImportEvent, ImportAction, PageState, ImportDataType, ImportRelationType, PanelState}),
    computed: {
      ...mapGetters([
        'activeProgram',
        'activeUser'
      ])
    }
  })
  export default class BrAPIImporter extends Vue {

    private activeProgram?: Program;
    private activeUser?: User;
    private file : File | null = null;
    private import_errors: ValidationError | string | null = null;
    private formattedErrors: string[] = [];
    private focusObjectId: string | null = null;

    private prevImports: any[] = []
    private currentImport?: ImportResponse = new ImportResponse({});
    private selectedMappingId: string | null = null;
    private importConfigs: ImportTypeConfig[] = [];
    private selectedImportConfig: ImportTypeConfig | null = null
    private importData?: ImportData;
    private importConfigOptions: any[] = [];
    private mapping: ImportMappingConfig = new ImportMappingConfig(undefined);
    private importMappings: ImportMappingConfig[] = [];
    private importMappingOptions: any[] = [];
    private previewData: any[] = [];
    private previewTotalRows: number = 0;
    private newObjectCounts: any = [];
    private userInput: any = {};

    private pageState = PageState.IMPORT_DATA;
    private state = ImportState.CHOOSE_IMPORT;
    private importStateMachine = createMachine({
        id: 'import',
        initial: ImportState.CHOOSE_IMPORT,
        states: {
          [ImportState.CHOOSE_IMPORT]: {
            entry: ImportAction.CHOOSE_IMPORT_START,
            on: {
              [ImportEvent.CREATE_NEW_IMPORT]: {
                target: ImportState.CHOOSE_MAPPING_FILE,
                actions: [ImportAction.MAPPING_START]
              },
              [ImportEvent.SELECTED_MAPPING]: ImportState.CHOOSE_DATA_FILE
            }
          },
          [ImportState.CHOOSE_DATA_FILE]: {
            entry: ImportAction.CHOOSE_DATA_FILE_START,
            on: {
              [ImportEvent.PREVIEW_IMPORT]: ImportState.PREVIEW_IMPORT
            }
          },
          [ImportState.CHOOSE_MAPPING_FILE]: {
            entry: ImportAction.CHOOSE_MAPPING_FILE_START,
            on: {
              [ImportEvent.IMPORT_SUCCESS]: ImportState.CHOOSE_IMPORT_TYPE
            }
          },
          [ImportState.CHOOSE_IMPORT_TYPE]: {
            entry: ImportAction.CHOOSE_IMPORT_TYPE_START,
            on: {
              [ImportEvent.SAVE_MAPPING_METADATA_SUCCESS]: ImportState.MAPPING
            }
          },
          [ImportState.MAPPING]: {
            entry: ImportAction.MAPPING_START,
            on: {
              [ImportEvent.PREVIEW_IMPORT]: ImportState.PREVIEW_IMPORT,
              [ImportEvent.CANCEL_MAPPING]: ImportState.CHOOSE_IMPORT
            }
          },
          [ImportState.PREVIEW_IMPORT]: {
            entry: ImportAction.PREVIEW_IMPORT_START,
            on: {
              [ImportEvent.COMMIT_IMPORT]: ImportState.COMMIT_IMPORT
            }
          },
          [ImportState.COMMIT_IMPORT]: {
            entry: ImportAction.COMMIT_IMPORT_START,
            on: {}
          }
        }
      },
      {
        actions: {
          [ImportAction.CHOOSE_IMPORT_TYPE_START]: (context, event) => {
          }
        }
    });

    private initialState = this.importStateMachine;
    private importService = interpret(this.importStateMachine);

    created() {
      this.getImportMappings();
      this.getImportConfigs();
      this.importService.subscribe(state => {
        this.state = ImportState[state.value as keyof typeof ImportState];
      });
      this.importService.start();
    }

    async uploadMappingFile() {
      //TODO: Show a loading wheel somewhere while uploading
      try {
        this.mapping = await ImportService.saveMappingFile(this.activeProgram!.id!, this.file!);
        this.importService.send(ImportEvent.IMPORT_SUCCESS);
      } catch (e) {
        this.$emit('show-error-notification', `Unable to upload file.`);
      }
    }

    selectMapping() {
      this.pageState = PageState.IMPORT_DATA;
      const foundMapping: ImportMappingConfig | undefined = this.importMappings.find(importMapping => importMapping.id === this.selectedMappingId);
      if (foundMapping) {
        this.mapping = foundMapping;
        this.selectImportConfig(this.mapping.importTypeId!);
        this.importService.send(ImportEvent.SELECTED_MAPPING);
      } else {
        this.$emit('show-error-notification', 'Error selecting mapping');
      }
    }

    createNewMapping() {
      this.pageState = PageState.CREATE_MAPPING;
      this.importService.send(ImportEvent.CREATE_NEW_IMPORT)
    }

    panelIsVisible(panelState: any) {
      return panelState.visibleState.includes(this.state) &&
        panelState.pageState.includes(this.pageState);
    }

    panelIsActive(panelState:any) {
      return !panelState.activeState.includes(this.state);
    }

    async getImportMappings() {
      try {
        const importMappings: ImportMappingConfig[] = await ImportService.getAllMappings(this.activeProgram!.id!);
        this.importMappings = importMappings;
        this.importMappingOptions = importMappings.map(importMapping => { return { 'id': importMapping.id, 'name': importMapping.name}; });
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Unable to load existing import mappings`);
      }
    }

    async getImportConfigs() {
      try {
        const importConfigs: ImportTypeConfig[] = await ImportService.getAllImportTypeConfigs();
        this.importConfigs = importConfigs;
        this.importConfigOptions = importConfigs.map(importConfig => { return { 'id': importConfig.id, 'name': importConfig.name}; });
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Unable to load import configs file`);
      }
    }

    async updateMappingAndPreview() {
      await this.updateMapping();
      await this.viewPreview();
    }

    async updateMapping() {
      try {
        this.mapping = await ImportService.updateMapping(this.activeProgram!.id!, this.mapping, {validate: true, draft: false});
        this.$emit('show-success-notification', `Mapping saved successfully`);
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', e.errorMessage);
        throw e;
      }
    }

    async updateMappingMetadata() {
      try {
        this.mapping = await ImportService.updateMapping(this.activeProgram!.id!, this.mapping, {validate: false, draft: true});
        this.importService.send(ImportEvent.SAVE_MAPPING_METADATA_SUCCESS);
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', e.errorMessage);
      }
    }

    async viewPreview() {
      try {
        await this.uploadData();
        await this.updateDataUpload(this.currentImport!.importId!, false);
      } catch (e) {
        this.$log.error(e);
      }
    }

    async uploadData() {
      try {
        let previewResponse: ImportResponse = await ImportService.uploadData(this.activeProgram!.id!, this.mapping.id!, this.file!, false);
        this.currentImport = previewResponse;
        // Get the import id
      } catch (e) {
        this.parseImmediateErrorResponse(e);
        throw e;
      }
    }

    async updateDataUpload(uploadId: string, commit: boolean) {
      try {
        let previewResponse: ImportResponse = await ImportService.updateDataUpload(this.activeProgram!.id!, this.mapping.id!, uploadId!, this.userInput, commit);
        this.currentImport = previewResponse;

        // Start check for our data upload
        const includeMapping = !commit;
        this.getDataUpload(includeMapping);

        if (commit) {
          this.importService.send(ImportEvent.COMMIT_IMPORT);
        } else {
          this.importService.send(ImportEvent.PREVIEW_IMPORT);
        }
      } catch (e) {
        this.$log.error(e);
        this.parseImmediateErrorResponse(e);
      }
    }

    async getDataUpload(includeMapping: boolean) {
      try {
        const previewResponse: ImportResponse = await ImportService.getDataUpload(this.activeProgram!.id!, this.mapping.id!, this.currentImport!.importId!, includeMapping);
        this.currentImport = previewResponse;

        if (!previewResponse.progress) {
          this.$log.error('Progress object was not returned with progress response.')

        } else if (previewResponse.progress.statusCode === 202) {
          // Wait a second, and call GET call again
          setTimeout(() => this.getDataUpload(includeMapping), 1000);

        } else {
          this.parseErrorResponse(previewResponse);
        }

        // Calculate some stuff for the preview data display
        // TODO: Add pagination to this
        if (previewResponse && previewResponse.preview){
          if (previewResponse.preview && previewResponse.preview.rows) {
            this.previewTotalRows = previewResponse.preview.rows.length;
            this.previewData = previewResponse.preview.rows.slice(0, 100);
            this.newObjectCounts = previewResponse.preview.statistics;
          }
        }


      } catch (e) {
        throw e;
      }
    }

    parseErrorResponse(previewResponse: ImportResponse) {
      if (previewResponse.progress && previewResponse.progress.statusCode != 200 && previewResponse.progress.rowErrors){
        // Check for multiple errors
        this.import_errors = ImportService.parseError(previewResponse);
        if (this.import_errors != null) {
          this.formattedErrors = ImportService.formatErrors(this.import_errors as ValidationError);
        }
        this.$emit('show-error-notification', `Unable to import file, multiple errors found`);
      } else if (previewResponse.progress && previewResponse.progress.statusCode != 200) {
        if (previewResponse.progress.message) {
          this.formattedErrors = [previewResponse.progress.message];
          this.$emit('show-error-notification', `Unable to import file.`);
        } else {
          const unknownError = `An unknown error has occurred`;
          this.formattedErrors = [unknownError];
          this.$emit('show-error-notification', unknownError);
        }
      }
    }

    parseImmediateErrorResponse(immediateResponse: any) {
      const errorResponse = immediateResponse.response;
      if (errorResponse.status != 200 && errorResponse.data.rowErrors) {
        this.import_errors = ValidationErrorService.parseError(immediateResponse);
        this.$emit('show-error-notification', `Unable to import file, multiple errors found`);
      } else if (errorResponse.statusText){
        this.import_errors = errorResponse.statusText;
        this.$emit('show-error-notification', `Unable to import file.`);
      } else {
        const unknownError = `An unknown error has occurred`;
        this.import_errors = unknownError;
        this.$emit('show-error-notification', unknownError);
      }
    }

    get isValidationError(): boolean {
      return this.import_errors instanceof ValidationError;
    }

    async commitData() {
      await this.updateDataUpload(this.currentImport!.importId!, true);
    }

    cancelMapping() {
      // Abort mapping, go back to step 1
      this.$router.go(0);
    }

    selectImportConfig(importId: string) {
      this.selectedImportConfig = this.importConfigs.filter(importConfig => importConfig.id === importId)[0];
      this.mapping.importTypeId = this.selectedImportConfig.id;
    }

    // Does not actually have possibility for object to be undefined
    getFocusedFields(): {config: ImportField, mappedField?: Mapping}[] {
      // Find object we are focused on, if any
      let focusedMapping: Mapping | undefined = undefined;
      if (this.focusObjectId) {
        const {searchMapping, searchPath} = this.mapping.getMapping(this.focusObjectId);
        if (searchMapping) focusedMapping = searchMapping;
      }

      // Get the import level that we care about
      let focusedFields: ImportField[] = this.selectedImportConfig!.fields;
      if (focusedMapping) {
        const searchImportField = this.selectedImportConfig!.getImportFieldById(focusedMapping.objectId!);
        focusedFields = searchImportField!.fields!;
      }

      const mappings: Mapping[] = focusedMapping ? focusedMapping.mapping! : this.mapping.mapping!;
      // Pair the config with its mapping
      const results = focusedFields.filter(field => field.collectTime !== ImportCollectTime.UPLOAD).map(field => {

        const mapping = mappings.find(mapping => mapping.objectId == field.id);

        // Create new object if one doesn't exist
        if (!mapping) {
          this.mapping.addMapping(field, this.focusObjectId!);
        }
        return {config: field, mappedField: mapping}
      });

      return results;
    }

    getMapping(id: string): {config?: ImportField, mappedField?: Mapping, path?: Mapping[]} | undefined {
      const {searchMapping, searchPath} = this.mapping.getMapping(id);
      if (searchMapping){
        return {config: this.selectedImportConfig!.getImportFieldById(searchMapping.objectId!), mappedField: searchMapping, path: searchPath}
      } else {
        return undefined;
      }
    }

    getUserInputFields(fields: ImportField[]): ImportField[] {
      // Go through all objects and look for user inputs
      const userFields: ImportField[] = [];
      for (const field of fields) {
        if (field.type === ImportDataType.OBJECT) {
          userFields.push(...this.getUserInputFields(field.fields!));
        } else {
          if (field.collectTime === ImportCollectTime.UPLOAD) {
            userFields.push(field);
          }
        }
      }
      return userFields;
    }

    //TODO: We can make one funtion to combine object and config
    getMappingPathWithConfig(path: Mapping[]): {pathConfig?: ImportField, pathMapping?: Mapping}[] {
      const result = path.map(pathMapping => { return {pathConfig: this.selectedImportConfig!.getImportFieldById(pathMapping.objectId!), pathMapping}});
      return result;
    }

    setFocusObject(id: string) {
      this.focusObjectId = id;
    }

    getFileHeaders(): string[] {
      let headers: string[] = [];
      if (this.mapping && this.mapping.file) {
        headers = this.mapping.getFileHeaders();
      }
      return headers;
    }

  }

  //TODO:
  // - Make UI pretty
  //    - Have summary one liner to put in the title
  //    - Add descriptions for each step
  //    - Add a mapping summary
  //    - Make mapping fields prettier
  //      - Make mapping fields cards
  //    - Complete summary fields
  // - Prototype a real-time lookup relationship
  // - Save to local storage, so if they hit the back button, it doesn't lose all of their data
  //    - Timing out on auth before saving is also a real bummer
</script>

<style scoped>

</style>