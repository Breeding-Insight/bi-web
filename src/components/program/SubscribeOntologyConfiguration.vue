<template>
  <section id="shared-ontology-section">
    <h2 class="title is-5">Subscribe To Ontology</h2>

    <!-- Loading wheel container -->
    <template v-if="sharedProgramLoading">
      <div class="loading-indicator table-min-height"/>
    </template>
    <template v-else-if="shareOffers.length == 0">
      <p>No ontologies are currently shared with your program at this time.</p>
    </template>
    <template v-else-if="isSubscribed()">
      <!-- Show subscribed program and unsubscribe button -->
      <p>This program is current subscribed to the {{subscribedOntology.programName}} ontology</p>
      <button
          id="unSubscribeOntologyBtn"
          class="button is-primary"
          v-on:click="unsubscribeOntology(subscribedOntology.programId)"
      >
        Unsubscribe from {{subscribedOntology.programName}} ontology
      </button>
    </template>
    <template v-else>
      <!-- Dropdown for program subscription selection -->
      <BasicSelectField
          v-model="selectedOntology.id"
          v-bind:options="shareOffersOptions"
          v-bind:field-name="'Select an Ontology to Subscribe to:'"
      />
      <!-- Button for selection -->
      <button
          id="subscribeOntologyBtn"
          class="button is-primary"
          v-on:click="subscribeOntology()"
      >
        Subscribe to Ontology
      </button>
    </template>
  </section>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import {mapGetters} from "vuex";
import {SharedOntologyService} from "@/breeding-insight/service/SharedOntologyService";
import {SubscribedProgram} from "@/breeding-insight/model/SubscribedProgram";
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import {Program} from "@/breeding-insight/model/Program";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";

@Component({
  components: {BasicSelectField},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class SubscribeOntologyConfiguration extends ProgramsBase {

  private shareOffers: SubscribedProgram[] = [];
  private shareOffersOptions: any[] = [];
  private subscribedOntology?: SubscribedProgram;
  private selectedOntology?: any = {};

  private activeProgram?: Program;
  private sharedProgramLoading: boolean = false;
  private subscribeProcessing: boolean = false;

  mounted() {
    // Get the shared ontologies
    this.getSubscribedOntologyOptions();
  }

  async getSubscribedOntologyOptions() {
    // Get subscribed ontology options
    try {
      // Loading wheel show
      this.sharedProgramLoading = true;
      const [data, metadata] = await SharedOntologyService.getSubscriptionOptions(this.activeProgram!.id!);
      // Check if we are subscribed to one of the programs
      data.forEach((datum: SubscribedProgram) => {
        if (datum.subscribed) {
          this.subscribedOntology = datum;
        }
      });
      // Filter for shared programs
      this.shareOffers = data;
      this.shareOffersOptions = this.shareOffers.map(shareOffer => { return {'id': shareOffer.programId, 'name': shareOffer.programName} });
    } catch (e) {
      // Check error statuses, show errors
      this.$emit('show-error-notification', e);
    } finally {
      // Loading wheel hide
      this.sharedProgramLoading = false;
    }
  }

  async subscribeOntology() {

    try {
      // Loading wheel show
      this.subscribeProcessing = true;
      await SharedOntologyService.subscribeOntology(this.activeProgram!.id!, this.selectedOntology.id);
      // TODO: Send subscription event up to parents to have share ontology refresh
    } catch (e) {
      // Check error statuses, show errors
      this.$emit('show-error-notification', e);
    } finally {
      // Loading wheel hide
      this.subscribeProcessing = false;
      this.getSubscribedOntologyOptions();
    }
  }

  async unsubscribeOntology(subscribedProgramId: string) {
    try {
      // Loading wheel show
      this.subscribeProcessing = true;
      await SharedOntologyService.unsubscribeOntology(this.activeProgram!.id!, subscribedProgramId);
      this.subscribedOntology = undefined;
      // TODO: Send subscription event up to parents to have share ontology refresh
    } catch (e) {
      // Check error statuses, show errors
      this.$emit('show-error-notification', e);
    } finally {
      // Loading wheel hide
      this.subscribeProcessing = false;
      this.getSubscribedOntologyOptions();
    }
  }

  isSubscribed() {
    return this.subscribedOntology !== undefined;
  }
}
</script>

<style scoped>

</style>