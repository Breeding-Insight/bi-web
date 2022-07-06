<template>
  <section id="shared-ontology-section">
    <h2 class="title is-5">Subscribe to Shared Ontology</h2>

    <!-- Loading wheel container -->
    <template v-if="sharedProgramLoading">
      <div class="loading-indicator table-min-height"/>
    </template>
    <template v-else-if="sharedPrograms.length > 0">
      <p>You cannot subscribe to another programs ontology when you have shared your own program's ontology.</p>
    </template>
    <template v-else-if="hasTraits && !isSubscribed()">
      <p>This program contains traits and therefore cannot subscribe to another program's ontology.</p>
    </template>
    <template v-else-if="shareOffers.length == 0">
      <p>No ontologies have been shared with {{activeProgram.name}}.</p>
    </template>
    <template v-else-if="isSubscribed()">
      <p>This program is currently subscribed to the {{subscribedOntology.programName}} ontology</p>

      <!-- Program has observations, cannot unsubscribe -->
      <template v-if="!subscribedOntology.editable">
        <p>This program has collected observations on the traits in the subscribed ontology and cannot unsubscribe from the ontology.</p>
      </template>
      <!-- Show subscribed program and unsubscribe button -->
      <template v-else>
        <button
            id="unSubscribeOntologyBtn"
            class="button is-primary"
            v-on:click="unsubscribeOntology(subscribedOntology.programId)"
            v-bind:class="{'is-loading': subscribeProcessing}"
            v-bind:disabled="subscribeProcessing"
        >
          Unsubscribe from {{subscribedOntology.programName}} ontology
        </button>
      </template>
    </template>
    <template v-else>
      <!-- Dropdown for program subscription selection -->
      <BasicSelectField
          v-model="selectedOntology.id"
          v-bind:options="shareOffersOptions"
          v-bind:field-name="'Choose ontology to subscribe to:'"
      />
      <!-- Button for selection -->
      <button
          id="subscribeOntologyBtn"
          class="button is-primary"
          v-on:click="subscribeOntology()"
          v-bind:class="{'is-loading': subscribeProcessing}"
          v-bind:disabled="subscribeProcessing"
      >
        Save
      </button>
    </template>
  </section>
</template>

<script lang="ts">
import {Component, Prop, Watch} from "vue-property-decorator";
import {mapGetters} from "vuex";
import {SharedOntologyService} from "@/breeding-insight/service/SharedOntologyService";
import {SubscribedOntology} from "@/breeding-insight/model/SubscribedOntology";
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import {Program} from "@/breeding-insight/model/Program";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import {SharedOntology} from "@/breeding-insight/model/SharedOntology";
import {TraitService} from "@/breeding-insight/service/TraitService";

@Component({
  components: {BasicSelectField},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class SubscribeOntologyConfiguration extends ProgramsBase {

  @Prop()
  private shareChange?: number;

  private shareOffers: SubscribedOntology[] = [];
  private shareOffersOptions: any[] = [];
  private subscribedOntology?: SubscribedOntology;
  private selectedOntology?: any = {};
  private sharedPrograms?: SharedOntology[] = [];
  private hasTraits: boolean = false;

  private activeProgram?: Program;
  private sharedProgramLoading: boolean = false;
  private subscribeProcessing: boolean = false;

  mounted() {
    // Get the shared ontologies
    this.getSharedOntologyData();
  }

  @Watch('shareChange', {immediate: false})
  async getSharedOntologyData() {

    try {
      // Loading wheel show
      this.sharedProgramLoading = true;
      await Promise.all([this.getSubscribedOntologyOptions(), this.getSharedPrograms(), this.getTraits()]);
    } catch (e) {
      // Check error statuses, show errors
      this.$emit('show-error-notification', e);
    } finally {
      // Loading wheel hide
      this.sharedProgramLoading = false;
    }
  }

  async getSubscribedOntologyOptions() {
    // Get subscribed ontology options
    const [data, metadata] = await SharedOntologyService.getSubscriptionOptions(this.activeProgram!.id!);
    // Check if we are subscribed to one of the programs
    data.forEach((datum: SubscribedOntology) => {
      if (datum.subscribed) {
        this.subscribedOntology = datum;
      }
    });
    // Filter for shared programs
    this.shareOffers = data;
    this.shareOffersOptions = this.shareOffers.map(shareOffer => { return {'id': shareOffer.programId, 'name': shareOffer.programName} });
  }

  async getSharedPrograms() {
    const [data, metadata] = await SharedOntologyService.get(this.activeProgram!.id!);
    // Filter for shared programs
    this.sharedPrograms = data.filter(datum => datum.shared);
  }

  async subscribeOntology() {

    try {
      if (!this.selectedOntology.id) throw 'Please select an ontology to subscibe to.';
      // Loading wheel show
      this.subscribeProcessing = true;
      await SharedOntologyService.subscribeOntology(this.activeProgram!.id!, this.selectedOntology.id);
      this.$emit('show-success-notification', `Successful subscribed to ontology`);
      this.$emit('subscription-change');
    } catch (e) {
      // Check error statuses, show errors
      this.$emit('show-error-notification', e);
    } finally {
      // Loading wheel hide
      this.subscribeProcessing = false;
      this.getSharedOntologyData();
    }
  }

  async unsubscribeOntology(subscribedProgramId: string) {
    try {
      // Loading wheel show
      this.subscribeProcessing = true;
      await SharedOntologyService.unsubscribeOntology(this.activeProgram!.id!, subscribedProgramId);
      this.subscribedOntology = undefined;
      this.$emit('show-success-notification', `Successfully unsubscribed from ontology`);
      this.$emit('subscription-change');
    } catch (e) {
      // Check error statuses, show errors
      this.$emit('show-error-notification', e);
    } finally {
      // Loading wheel hide
      this.subscribeProcessing = false;
      this.getSharedOntologyData();
    }
  }

  async getTraits() {

    TraitService.getAll(this.activeProgram!.id!, undefined, false).then(([traits, metadata]) => {
      this.hasTraits = traits && traits.length > 0;
    }).catch((error) => {
      // Non-crucial error, fail silently
      this.$log.error(`Unable to query traits ${error}`)
    });
  }

  isSubscribed() {
    return this.subscribedOntology !== undefined;
  }
}
</script>

<style scoped>

</style>