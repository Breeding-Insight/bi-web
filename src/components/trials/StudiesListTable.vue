<!--
  - See the NOTICE file distributed with this work for additional information
  - regarding copyright ownership.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <section id="studyTableLabel">
    <WarningModal
      v-bind:active.sync="deactivateActive"
      v-bind:msg-title="deactivateWarningTitle"
      v-on:deactivate="deactivateActive = false"
    >
      <section>
        <p class="has-text-dark">
          Program-related data referencing this study will not be affected by this change.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
            class="button is-danger"
            v-on:click="modalDeleteHandler"
          >
            <strong>Yes, {{ focusStudy.active ? 'archive' : 'restore' }}</strong>
          </button>
          <button
            class="button"
            v-on:click="deactivateActive = false"
          >
            Cancel
          </button>
        </div>
      </div>              
    </WarningModal>

    <!-- <div class="columns has-text-right mb-0"> -->
    <!--   <div class="column"> -->
    <!--     <button -->
    <!--         data-testid="newDataForm" -->
    <!--         v-show="!newStudyActive & studies.length > 0" -->
    <!--         class="button is-primary has-text-weight-bold" -->
    <!--         v-on:click="activateNewStudyForm" -->
    <!--     > -->
    <!--     <span class="icon is-small"> -->
    <!--       <PlusCircleIcon -->
    <!--           size="1.5x" -->
    <!--           aria-hidden="true" -->
    <!--       /> -->
    <!--     </span> -->
    <!--       <span> -->
    <!--       New Study -->
    <!--     </span> -->
    <!--     </button> -->
    <!--   </div> -->
    <!-- </div> -->

    <NewDataForm
        v-if="newStudyActive"
        v-bind:new-record.sync="newStudy"
        v-bind:data-form-state="newStudyFormState"
        v-on:submit="saveStudy"
        v-on:cancel="cancelNewStudy"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <template v-slot="validations">
        <BaseStudyForm
            v-on:trait-change="newStudy = $event"
            v-bind:trait="newStudy"
            v-bind:scale-options="scaleClassOptions"
            v-bind:method-options="methodClassOptions"
            v-bind:program-observation-levels="observationLevelOptions"
            v-bind:validation-handler="validationHandler"
        ></BaseStudyForm>
      </template>
    </NewDataForm>

    <SidePanelTable
      ref="sidePanelTable"
      v-bind:records="studies"
      v-bind:pagination="studiesPagination"
      v-bind:auto-handle-close-panel-event="false"
      v-bind:side-panel-state="studySidePanelState"
      v-on:show-error-notification="$emit('show-error-notification', $event)"
      v-on:paginate="paginationController.updatePage($event)"
      v-on:paginate-toggle-all="paginationController.toggleShowAll()"
      v-on:paginate-page-size="paginationController.updatePageSize($event)"
    >

      <!-- 
        Table row column slot specification
        data: T
      -->
      <template v-slot:columns="data">
        <TableColumn name="name" v-bind:label="'Name'">
          <b-button
              size="is-small"
              class="archive-tag"
              v-if="!data.active && data.active !== undefined">
            Archived
          </b-button>
          {{ data.name }}
        </TableColumn>
        <TableColumn name="location" v-bind:label="'location'" v-bind:visible="!studySidePanelState.collapseColumns">
          {{ data.location }}
        </TableColumn>        
        <TableColumn name="start date" v-bind:label="'Start'" v-bind:visible="!studySidePanelState.collapseColumns">
          {{ data.startDate | dmyFormat }}
        </TableColumn>
        <TableColumn name="end date" v-bind:label="'End'" v-bind:visible="!studySidePanelState.collapseColumns">
          {{ data.endDate | dmyFormat }}
        </TableColumn>        
      </template>

      <!-- 
        Side panel data slot specification
        data: T
      -->
      <template v-slot:side-panel="{tableRow}">
        <StudyDetailPanel
          v-bind:data="studySidePanelState.openedRow"
          v-bind:observation-level-options="observationLevelOptions"
          v-bind:edit-active="studySidePanelState.editActive"
          v-bind:editable="currentStudyEditable"
          v-bind:loading-editable="loadingStudyEditable"
          v-bind:edit-form-state="studySidePanelState.dataFormState"
          v-bind:validation-handler="editValidationHandler"
          v-bind:archivable="true"
          v-on:activate-edit="activateEdit($event)"
          v-on:deactivate-edit="studySidePanelState.bus.$emit(studySidePanelState.closePanelEvent)"
          v-on:trait-change="editStudy = Study.assign({...$event})"
          v-on:submit="updateStudy"
          v-on:archive="activateArchive($event)"
          v-on:restore="activateArchive($event)"
        />
      </template>

      <template v-slot:emptyMessage>
        <EmptyTableMessage
            v-bind:button-view-toggle="!newStudyActive"
            v-bind:button-text="'New Study'"
            v-on:newClick="activateNewStudyForm"
        >
          <p class="has-text-weight-bold">
            No studies are currently defined for this trial.
          </p>
          Create new studies by clicking "New Study".
        </EmptyTableMessage>
      </template>
    </SidePanelTable>
  </section>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator'
import WarningModal from '@/components/modals/WarningModal.vue'
import {PlusCircleIcon} from 'vue-feather-icons'
import {validationMixin} from 'vuelidate';
import {Study} from '@/breeding-insight/model/Study'
import { mapGetters } from 'vuex'
import {Program} from "@/breeding-insight/model/Program";
import NewDataForm from '@/components/forms/NewDataForm.vue'
import BasicInputField from "@/components/forms/BasicInputField.vue";
import SidePanelTable from "@/components/tables/SidePanelTable.vue";
import StudyDetailPanel from "@/components/trials/StudyDetailPanel.vue";
import {StudyService} from "@/breeding-insight/service/StudyService";
import EmptyTableMessage from "@/components/tables/EmtpyTableMessage.vue";
import TableColumn from "@/components/tables/TableColumn.vue";
import {Metadata, Pagination} from "@/breeding-insight/model/BiResponse";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import { StringFormatters } from '@/breeding-insight/utils/StringFormatters';
import BaseStudyForm from "@/components/trials/forms/BaseStudyForm.vue";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import {ProgramService} from "@/breeding-insight/service/ProgramService";
import {MethodClass} from "@/breeding-insight/model/Method";
import {DataType, Scale} from "@/breeding-insight/model/Scale";
import {SidePanelTableEventBusHandler} from "@/components/tables/SidePanelTableEventBus";
import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
import { dmyFormat } from '@/breeding-insight/utils/filters';
import {Result} from '@/breeding-insight/model/Result';

@Component({
  mixins: [validationMixin],
  components: {
    BaseStudyForm, NewDataForm, BasicInputField, SidePanelTable, EmptyTableMessage, TableColumn,
                WarningModal, StudyDetailPanel,
                PlusCircleIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  data: () => ({Study, StringFormatters}),
  filters: {
    dmyFormat
  }
})
export default class StudyTable extends Vue {

  private activeProgram?: Program;
  private studies: Study[] = [];
  private trialId: string = this.$route.params.trialId;
  private methodClassOptions: string[] = Object.values(MethodClass);
  private observationLevelOptions?: string[];
  private scaleClassOptions: string[] = Object.values(DataType);
  private editStudy?: Study;
  private originalStudy?: Study;
  private newStudy: Study = new Study();
  private currentStudyEditable = false;
  private loadingStudyEditable = true;

  // New study form
  private newStudyActive: boolean = false;
  private validationHandler: ValidationError = new ValidationError();
  private newStudyFormState: DataFormEventBusHandler = new DataFormEventBusHandler();

  // Side panel table
  private studySidePanelState: SidePanelTableEventBusHandler = new SidePanelTableEventBusHandler();

  // Edit form
  private editValidationHandler: ValidationError = new ValidationError();

  // Archive study
  private focusStudy: Study = new Study();
  private deactivateWarningTitle = 'Archive study in this trial?';
  private deactivateActive: boolean = false;

  // TODO: Move these into an event bus in the future
  private studiesPagination?: Pagination = new Pagination();
  private paginationController: PaginationController = new PaginationController();

  mounted() {
    this.getStudies();

    // Events
    // this.traitSidePanelState.bus.$on(this.studySidePanelState.requestClosePanelEvent, (showWarningEvent: Function, confirmCloseEvent: Function) => {
    //   if (this.editStudy && !this.editStudy.equals(this.originalStudy)) {
    //     showWarningEvent();
    //   } else {
    //     confirmCloseEvent();
    //   }
    // });
    // this.studySidePanelState.bus.$on(this.studySidePanelState.confirmCloseEditEvent, () => {
    //   this.clearSelectedRow();
    // });

    // this.studySidePanelState.bus.$on(this.studySidePanelState.selectRowEvent, (row: any) => {
    //   this.editable(row);
    // })
  }

  @Watch('paginationController', { deep: true})
  async getStudies() {

    let paginationQuery: PaginationQuery = PaginationController.getPaginationSelections(
      this.paginationController.currentPage,
      this.paginationController.pageSize,
      this.paginationController.showAll);

    this.paginationController.setCurrentCall(paginationQuery);

    try {
      const response: Result<Error, [Study[], Metadata]> = await StudyService.getAll(this.activeProgram!.id!, this.trialId!, paginationQuery);
      if(response.isErr()) throw response.value;
      let [studies, metadata] = response.value;

      if (this.paginationController.matchesCurrentRequest(metadata.pagination)) {
        this.studies = studies;
        this.studiesPagination = metadata.pagination;
      }
    } catch (error) {
      // Display error that studies cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load studies');
    }
  }

  // async editable(study: Study) {
  //   let studyEditable = false;
  //   this.loadingStudyEditable = true;
  //   try {
  //     const [editable] = await StudyService.getStudyEditable(this.activeProgram!.id!, study.id!) as [boolean, Metadata]
  //     studyEditable = editable;
  //     this.currentStudyEditable = studyEditable;
  //   } catch (error) {
  //     // Display error that studies cannot be loaded
  //     this.$emit('show-error-notification', 'Error getting editable status');
  //     throw error;
  //   } finally {
  //     this.loadingStudyEditable = false;
  //   }
  // }

  // activateArchive(focusStudy: Study){
  //   if (focusStudy.active) {
  //     this.deactivateWarningTitle = `Archive "${focusStudy.studyName}" in ${this.activeProgram!.name!}?`;
  //   } else {
  //     this.deactivateWarningTitle = `Restore "${focusStudy.studyName}" to ${this.activeProgram!.name!}?`;
  //   }
  //   this.focusStudy = focusStudy;
  //   this.deactivateActive = true;
  // }

  async modalDeleteHandler(){
  //   try {
  //     const studyClone = JSON.parse(JSON.stringify(this.focusStudy));
  //     studyClone.active = !studyClone.active;
  //     const updatedStudy: Study = await StudyService.archiveStudy(this.activeProgram!.id!, studyClone);

  //     // Replace studies in queried studies
  //     const studyIndex = this.studies.findIndex(study => study.id === updatedStudy.id);
  //     if (studyIndex !== -1) { this.studies.splice(studyIndex, 1, updatedStudy); }

  //     this.deactivateActive = false;
  //     this.paginationController.updatePage(1);
  //     this.traitSidePanelState.bus.$emit(this.studySidePanelState.closePanelEvent);
  //     this.$emit('show-success-notification', `"${studyClone.studyName}" successfully ${ studyClone.active ? 'restored' : 'archived'}`);
  //   } catch(err) {
  //     this.$log.error(err);
  //     this.$emit('show-error-notification', `"${this.focusStudy.studyName}" could not be ${ this.focusStudy.active ? 'archived' : 'restored'}`);
  //   }
  }

  // activateEdit(editStudy: Study) {
  //   this.studySidePanelState.bus.$emit(this.studySidePanelState.activateEditEvent);
  //   this.originalStudy = Study.assign({...editStudy} as Study);
  //   this.editStudy = Study.assign({...editStudy} as Study);
  // }

  activateNewStudyForm() {
    this.studySidePanelState.bus.$emit(this.studySidePanelState.closePanelEvent, () => { this.newStudyActive = true; });
  }

  // clearSelectedRow() {
  //   this.editStudy = undefined;
  //   this.originalStudy = undefined;
  //   this.editValidationHandler = new ValidationError();
  // }

  // async saveStudy() {
  //   try {
  //     this.validationHandler = new ValidationError();
  //     await StudyService.createStudies(this.activeProgram!.id!, [this.newStudy]);
  //     this.$emit('show-success-notification', 'Study creation successful.');
  //     this.getStudies();
  //     await this.getObservationLevels();
  //     this.newStudy = new Study();
  //     this.newStudyActive = false;
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       this.validationHandler = error;
  //       const deletions: string[] = this.processValidationErrors(this.validationHandler, this.newStudy);
  //       this.$emit('show-error-notification', `Error creating study. ${this.validationHandler.condenseErrorsSingleRow(deletions)}`);
  //     } else {
  //       this.$emit('show-error-notification', 'Error creating study.');
  //     }
  //   } finally {
  //     this.newTraitFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
  //   }
  // }

  // processValidationErrors(handler: ValidationError, study: Study): string[] {

  //   // // Set up overrides for error messages
  //   // let deletions: string[] = [];
  //   // //TODO: Move this into the class perhaps
  //   // if (!study.scale!.dataType) {
  //   //   // Remove scale name error
  //   //   deletions.push('scale.scaleName');
  //   // } else if (Scale.dataTypeEquals(trait.scale!.dataType!, DataType.Numerical)) {
  //   //   // Rename scale name to unit
  //   //   handler.overrideMessage(0, 'scale.scaleName', 'Missing unit', 400);
  //   // } else if (Scale.dataTypeEquals(trait.scale!.dataType!, DataType.Duration)) {
  //   //   // Rename scale name to unit of time
  //   //   handler.overrideMessage(0, 'scale.scaleName', 'Missing unit of time', 400);
  //   // }
  //   // return deletions;
  // }

  // async updateTrait() {
  //   try {
  //     this.editValidationHandler = new ValidationError();
  //     const [data] = await StudyService.updateStudies(this.activeProgram!.id!, [this.editStudy!]) as [Study[], Metadata];

  //     // Temporary: Only update the given study.
  //     // TODO: Select all studies and find the edited study within results to keep row open
  //     if (data.length > 0){
  //       const studyInd = this.studies.findIndex(study => study.id === data[0].id);
  //       const studyCopy = [...this.studies];
  //       if (studyInd >= 0) {
  //         studyCopy[studyInd] = {...data[0]} as Study;
  //       }
  //       this.studies = studyCopy;
  //     }

  //     this.studySidePanelState.bus.$emit(this.studySidePanelState.successEditEvent, data[0]);
  //     this.clearSelectedRow();
  //     await this.getObservationLevels();
  //     this.$emit('show-success-notification', 'Study edit successful.');
  //   } catch (error) {
  //     if (error instanceof ValidationError) {
  //       this.editValidationHandler = error;
  //       const deletions: string[] = this.processValidationErrors(this.editValidationHandler, this.editStudy!);
  //       this.$emit('show-error-notification', `Error updating study. ${this.editValidationHandler.condenseErrorsSingleRow(deletions)}`);
  //     } else {
  //       this.$emit('show-error-notification', error);
  //     }
  //   } finally {
  //     this.studySidePanelState.dataFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
  //   }
  // }

  // cancelNewStudy() {
  //   this.newStudy = new Study();
  //   this.validationHandler = new ValidationError();
  //   this.newStudyActive = false;
  // }
}

</script>
