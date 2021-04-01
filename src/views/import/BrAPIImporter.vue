<template>
  <div>
    <!-- Select Import Option -->
    <ImportStepCard
        title="Step 1: Select Import Option"
        v-bind:completed="1 < this.currentStep"
        v-bind:readonly="1 < this.currentStep"
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
                v-on:click="importService.send(ImportEvent.CREATE_NEW_IMPORT)"
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
        I am a summary
      </template>
    </ImportStepCard>

    <!-- Choose File -->
    <ImportStepCard
        v-if="showImport"
        title="Step 2: Upload File"
        v-bind:completed="2 < this.currentStep"
        v-bind:readonly="2 < this.currentStep"
    >
      <!-- Editing view -->
      <template v-slot:write-display>
        <FileSelectMessageBox
            v-model="file"
            v-bind:fileTypes="'.csv, .xls, .xlsx'"
            v-bind:errors="import_errors"
            v-on:import="pageState === PageState.CREATE_MAPPING ? upload() : uploadData()"
        />
      </template>

      <!-- Summary View -->
      <template v-slot:summary-display>
        I am the summary
      </template>
    </ImportStepCard>

    <!-- Specify Mapping Metadata -->
    <ImportStepCard
        v-if="importTypeShow"
        title="Step 3: Mapping Metadata"
        v-bind:completed="3 < this.currentStep"
        v-bind:readonly="3 < this.currentStep"
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
          v-bind:field-help="'This is the name of the import mapping users will start when importing a file'"
          v-bind:value="mapping.name"
          v-on:input="mapping.name = $event"
        />

        <button
            class="button is-primary"
            v-on:click="importService.send(ImportEvent.SAVE_MAPPING)"
        >
          Confirm
        </button>
      </template>
      <!-- Summary view -->
      <template v-slot:summary-display>
        I am a summary
      </template>
    </ImportStepCard>

    <!-- Create the Mapping -->
    <ImportStepCard
        v-if="showMapping"
        title="Step 4: Create Mapping"
        v-bind:completed="4 < this.currentStep"
        v-bind:readonly="4 < this.currentStep"
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
              v-on:click="importService.send(ImportEvent.CANCEL_MAPPING)"
            >
              Cancel Mapping
            </button>
            <button
              class="button is-primary ml-2"
              v-on:click="updateMapping"
            >
              Save Mapping and Preview Import
            </button>
          </div>
        </div>
      </template>

      <!-- Summary View -->
      <template v-slot:summary-display>
        I am a summary
      </template>

    </ImportStepCard>

    <!-- Preview Import -->
    <ImportStepCard
        v-if="5 === this.currentStep"
        title="Step 5: Preview Import"
        v-bind:completed="5 < this.currentStep"
        v-bind:readonly="5 < this.currentStep"
    >
      <!-- Editing View -->
      <template v-slot:write-display>
        <p>Total number of rows: {{previewTotalRows}}</p>
        <template v-for="key of Object.keys(newObjectCounts)">
          <p v-bind:key="key">New {{key}} count: {{newObjectCounts[key]}}</p>
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

      <!-- Summary View -->
      <template v-slot:summary-display>
        I am a summary
      </template>

    </ImportStepCard>

    <ImportStepCard
      v-if="6 === this.currentStep"
      title="Upload Successful!"
      v-bind:completed="6 < this.currentStep"
      v-bind:readonly="6 < this.currentStep"
    >
      <template v-slot:write-display>
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
  import {ImportDataType, ImportField} from "@/breeding-insight/model/import/ImportField";
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

  enum PageState {
    CREATE_MAPPING = "CREATE_MAPPING",
    IMPORT_DATA = "IMPORT_DATA"
  }

  enum ImportState {
    CHOOSE_IMPORT = "CHOOSE_IMPORT",
    CHOOSE_MAPPING_FILE = "CHOOSE_MAPPING_FILE",
    CHOOSE_DATA_FILE = "CHOOSE_DATA_FILE",
    CHOOSE_IMPORT_TYPE = "CHOOSE_IMPORT_TYPE",
    SAVING_IMPORT_TYPE = "SAVING_IMPORT_TYPE",
    IMPORT_TYPE_ERROR = "IMPORT_TYPE_ERROR",
    MAPPING = "MAPPING",
    PREVIEW_IMPORT = "PREVIEW_IMPORT"
  }

  enum ImportEvent {
    CREATE_NEW_IMPORT = "CREATE_NEW_IMPORT",
    IMPORT_SUCCESS = "IMPORT_SUCCESS",
    IMPORT_ERROR = "IMPORT_ERROR",
    LOADING_COMPLETE = "LOADING_COMPLETE",
    SAVE_MAPPING = "SAVE_MAPPING",
    SAVE_MAPPING_ERROR = "SAVE_MAPPING_ERROR",
    SAVE_MAPPING_SUCCESS = "SAVE_MAPPING_SUCCESS",
    SAVE_MAPPING_METADATA_SUCCESS = "SAVE_MAPPING_METADATA_SUCCESS",
    CANCEL_MAPPING = "CANCEL_MAPPING",
    SELECTED_MAPPING = "SELECTED_MAPPING",
    UPLOAD_DATA_SUCCESS = "UPLOAD_DATA_SUCCESS"
  }

  enum ImportAction {
    RESET = "RESET",
    SHOW_IMPORT = "SHOW_IMPORT",
    UPLOAD_FILE = "UPLOAD_FILE",
    LOADED = "LOADED",
    GET_UPLOADED_FILE = "GET_UPLOADED_FILE",
    SHOW_IMPORT_TYPE = "SHOW_IMPORT_TYPE",
    MAPPING_STARTED = "MAPPING_STARTED",
    SAVE_MAPPING = "SAVE_MAPPING",
    SAVE_MAPPING_METADATA = "SAVE_MAPPING_METADATA",
    CANCEL_MAPPING = "CANCEL_MAPPING",
    NEXT_STEP = "NEXT_STEP",
    UPLOAD_DATA = "UPLOAD_DATA",
    SELECT_MAPPING = "SELECT_MAPPING",
    CREATE_NEW_MAPPING = "CREATE_NEW_MAPPING"
  }

  @Component({
    components: {
      BasicInputField,
      ListMappingRow,
      RelationMappingRow,
      ColumnSummary,
      ObjectMappingRow, ImportStepCard, FieldMappingRow, BasicSelectField, FileSelectMessageBox, ChevronDownIcon},
    data: () => ({ImportState, ImportEvent, ImportAction, PageState, ImportDataType, ImportRelationType}),
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
    private showImportOption: boolean = false;
    private showImport: boolean = false;
    private dataLoaded: boolean = false;
    private importTypeShow: boolean = false;
    private showMapping: boolean = false;
    private focusObjectId: string | null = null;

    private currentImportId: string = '1';
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

    private currentStep = 1;
    private pageState = PageState.IMPORT_DATA;
    private state = ImportState.CHOOSE_IMPORT;
    private importStateMachine = createMachine({
        id: 'import',
        initial: ImportState.CHOOSE_IMPORT,
        states: {
          [ImportState.CHOOSE_IMPORT]: {
            entry: ImportAction.RESET,
            on: {
              [ImportEvent.CREATE_NEW_IMPORT]: {
                target: ImportState.CHOOSE_MAPPING_FILE,
                actions: [ImportAction.CREATE_NEW_MAPPING, ImportAction.NEXT_STEP]
              },
              [ImportEvent.SELECTED_MAPPING]: {
                target: ImportState.CHOOSE_DATA_FILE,
                actions: [ImportAction.SELECT_MAPPING, ImportAction.NEXT_STEP]
              }
            }
          },
          [ImportState.CHOOSE_DATA_FILE]: {
            entry: ImportAction.SHOW_IMPORT,
            on: {
              [ImportEvent.UPLOAD_DATA_SUCCESS]: ImportState.PREVIEW_IMPORT
            }
          },
          [ImportState.CHOOSE_MAPPING_FILE]: {
            entry: ImportAction.SHOW_IMPORT,
            on: {
              [ImportEvent.IMPORT_SUCCESS]: {
                target: ImportState.CHOOSE_IMPORT_TYPE,
                actions: ImportAction.NEXT_STEP
              }
            }
          },
          [ImportState.CHOOSE_IMPORT_TYPE]: {
            entry: ImportAction.SHOW_IMPORT_TYPE,
            on: {
              [ImportEvent.SAVE_MAPPING]: ImportState.SAVING_IMPORT_TYPE
            }
          },
          [ImportState.SAVING_IMPORT_TYPE]: {
            entry: ImportAction.SAVE_MAPPING_METADATA,
            on: {
              [ImportEvent.SAVE_MAPPING_METADATA_SUCCESS]: {
                target: ImportState.MAPPING,
                actions: ImportAction.NEXT_STEP
              }
            }
          },
          [ImportState.MAPPING]: {
            entry: ImportAction.MAPPING_STARTED,
            on: {
              [ImportEvent.CANCEL_MAPPING]: {
                target: ImportState.CHOOSE_IMPORT,
                actions: ImportAction.CANCEL_MAPPING
              },
              [ImportEvent.SAVE_MAPPING_SUCCESS]: {
                target: ImportState.PREVIEW_IMPORT,
                actions: [ImportAction.NEXT_STEP]
              }
            }
          },
          [ImportState.PREVIEW_IMPORT]: {
            on: {}
          }
        }
      },
      {
        actions: {
          [ImportAction.NEXT_STEP]: (context, event) => {
            this.incrementStep();
          },
          [ImportAction.RESET]: (context, event) => {
            this.currentStep = 1;
            this.showImport = false;
            this.importTypeShow = false;
          },
          [ImportAction.SHOW_IMPORT]: (context, event) => {
            this.importSelected();
          },
          [ImportAction.UPLOAD_FILE]: (context, event) => {
            this.upload();
          },
          [ImportAction.LOADED]: (context, event) => {
            this.loaded();
          },
          [ImportAction.GET_UPLOADED_FILE]: (context, event) => {
            this.getImport();
          },
          [ImportAction.SHOW_IMPORT_TYPE]: (context, event) => {
            this.showImportType();
            this.getImportConfigs();
          },
          [ImportAction.MAPPING_STARTED]: (context, event) => {
            this.startMapping();
          },
          [ImportAction.SAVE_MAPPING]: (context, event) => {
            this.updateMapping();
          },
          [ImportAction.SAVE_MAPPING_METADATA]: (context, event) => {
            this.updateMappingMetadata()
          },
          [ImportAction.CANCEL_MAPPING]: (context, event) => {
            this.cancelMapping();
          },
          [ImportAction.UPLOAD_DATA]: (context, event) => {
            this.uploadData();
          },
          [ImportAction.SELECT_MAPPING]: (context, event) => {
            this.selectMapping();
          },
          [ImportAction.CREATE_NEW_MAPPING]: (context, event) => {
            this.createNewMapping();
          }
        }
    });

    private initialState = this.importStateMachine;
    private importService = interpret(this.importStateMachine);

    created() {
      this.getImportMappings();
      this.importService.subscribe(state => {
        this.state = ImportState[state.value as keyof typeof ImportState];
      });
      this.importService.start();
    }

    incrementStep() {
      this.currentStep += 1;
    }

    async upload() {
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
        this.importService.send(ImportEvent.SELECTED_MAPPING);
      } else {
        this.$emit('show-error-notification', 'Error selecting mapping');
      }
    }

    createNewMapping() {
      this.pageState = PageState.CREATE_MAPPING;
    }

    loaded() {
      this.dataLoaded = true;
    }

    importSelected() {
      this.showImport = true;
    }

    showImportType() {
      this.importTypeShow = true;
    }

    startMapping() {
      // Get the import config
      this.selectedImportConfig!.fields.forEach(field => this.mapping.addMapping(field));
      this.showMapping = true;
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

    async getImport() {
      try {
        const importDataResult: ImportData = await ImportService.getImport(this.currentImportId);
        this.importData = importDataResult;
        this.importService.send(ImportEvent.LOADING_COMPLETE);
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Unable to load imported file`);
      }
    }

    async updateMapping() {
      try {
        this.mapping = await ImportService.updateMapping(this.activeProgram!.id!, this.mapping, {validate: true, draft: false});
        this.importService.send(ImportEvent.SAVE_MAPPING_SUCCESS);
        await this.uploadData();
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Unable to save import mapping`);
      }
    }

    async updateMappingMetadata() {
      try {
        this.mapping = await ImportService.updateMapping(this.activeProgram!.id!, this.mapping, {validate: false, draft: true});
        this.importService.send(ImportEvent.SAVE_MAPPING_METADATA_SUCCESS);
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Unable to save import mapping`);
      }
    }

    async uploadData() {
      try {
        const previewResponse: any = await ImportService.uploadData(this.activeProgram!.id!, this.mapping.id!, this.file!, false);
        // Calculate some stuff for the preview data display
        this.previewTotalRows = previewResponse.data.length;
        let newObjectCounts: any = {};
        for (const datum of previewResponse.data) {
          const keys = Object.keys(datum);
          for (const key of keys) {
            if (datum[key].state == "NEW") {
              if (key in newObjectCounts) { newObjectCounts[key] += 1; }
              else { newObjectCounts[key] = 1; }
            } else {
              newObjectCounts[key] = 0;
            }
          }
        }
        this.newObjectCounts = newObjectCounts;
        this.previewData = previewResponse.data.slice(0, 100);
        this.importService.send(ImportEvent.UPLOAD_DATA_SUCCESS);
        this.currentStep = 5;
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Unable to upload file`);
      }
    }

    async commitData() {
      try {
        this.previewData = await ImportService.uploadData(this.activeProgram!.id!, this.mapping.id!, this.file!, true);
        this.importService.send(ImportEvent.UPLOAD_DATA_SUCCESS);
        this.currentStep = 6;
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Unable to upload file`);
      }
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
      const results = focusedFields.map(field => {
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
  // - Organize the state data. Its messy right now. Maybe make it reflect the step cards
  // - Make UI pretty
  //    - Have summary one liner to put in the title
  //    - Add descriptions for each step
  //    - Add a mapping summary
  //    - Make mapping fields prettier
  //      - Make mapping fields cards
  //    - Complete summary fields
  // - Create phenotyping upload config in service. Allow the dev user to switch back and forth
  // - Prototype a real-time lookup relationship
  // - Save to local storage, so if they hit the back button, it doesn't lose all of their data

</script>

<style scoped>

</style>