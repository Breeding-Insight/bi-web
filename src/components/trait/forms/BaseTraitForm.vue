<template>
  <div class="columns">
    <div class="column">
      <BasicInputField
        v-bind:field-name="'Trait name'"
        v-bind:field-help="'All unicode characters are accepted.'"
        :placeholder="'Trait Name'"
        v-on:input="trait.traitName = $event"
      />
      <div class="sentence-input">
        <p class="is-input-prepend mt-2">
          is collected on
        </p>
        <b-field
          label="Observation Level"
          v-bind:custom-class="'is-sr-only'"
          class="is-flex-grow-1"
        >
          <b-autocomplete
            v-model="name"
            v-bind:open-on-focus="true"
            v-bind:data="filteredDataObj(programObservationLevels)"
            v-on:input="setObservationLevel($event)"
            placeholder="Start typing to see suggestions"
          />
        </b-field>
      </div>
      <div class="sentence-input">
        <p class="is-input-prepend mt-3">
          by
        </p>
        <BasicSelectField
          v-bind:options="methodOptions"
          v-bind:field-name="'Method'"
          v-bind:show-label="false"
          v-on:input="setMethodClass($event)"
        />
      </div>
      <div class="sentence-input">
        <p class="is-input-prepend mt-3">
          using
        </p>
        <BasicSelectField
          v-bind:selected-id="trait.scale ? trait.scale.dataType : undefined"
          v-bind:options="getScaleOptions()"
          v-bind:field-name="'Scale'"
          v-bind:show-label="false"
          v-bind:field-help="'Note: additional options for this field will appear after selection'"
          v-on:input="setScaleClass($event)"
        />
      </div>

      <!-- Formula -->
      <template v-if="trait.method && trait.method.methodClass === MethodClass.Computation">
        <BasicInputField
            v-bind:value="trait.method.formula"
            v-bind:field-name="'Formula'"
            v-bind:field-help="'Operations accepted: *^.+/(); calculations will use FOIL order of operations.'"
            :placeholder="'Number of flowers on single plant / 100'"
            v-on:input="trait.method.formula = $event"
        />
      </template>

      <!-- Scale options -->
      <template v-if="trait.scale && (trait.scale.dataType === DataType.Ordinal || trait.scale.dataType === DataType.Nominal)">
        <CategoryTraitForm
          v-bind:data="trait.scale.categories"
          v-on:update="trait.scale.categories = $event"
          v-bind:type="trait.scale.dataType"
        />
      </template>
      <template v-if="trait.scale && trait.scale.dataType === DataType.Text">
        <TextTraitForm />
      </template>
      <template v-if="trait.scale && trait.scale.dataType === DataType.Date">
        <DateTraitForm />
      </template>
      <template v-if="trait.scale && trait.scale.dataType === DataType.Duration">
        <DurationTraitForm
            v-bind:unit="trait.scale.scaleName"
            v-bind:valid-min="trait.scale.validValueMin"
            v-bind:valid-max="trait.scale.validValueMax"
            v-on:unit-change="trait.scale.scaleName = $event"
            v-on:min-change="trait.scale.validValueMin = $event"
            v-on:max-change="trait.scale.validValueMax = $event"/>
      </template>
      <template v-if="trait.scale && trait.scale.dataType === DataType.Numerical">
        <NumericalTraitForm
          v-bind:unit="trait.scale.scaleName"
          v-bind:decimal-places="trait.scale.decimalPlaces"
          v-bind:valid-min="trait.scale.validValueMin"
          v-bind:valid-max="trait.scale.validValueMax"
          v-on:unit-change="trait.scale.scaleName = $event"
          v-on:decimal-change="trait.scale.decimalPlaces = $event"
          v-on:min-change="trait.scale.validValueMin = $event"
          v-on:max-change="trait.scale.validValueMax = $event"
        />
      </template>
    </div>
    <div class="divider is-vertical" />

    <!-- Right Side -->
    <div class="column">
      <BasicInputField
        v-bind:field-name="'Description of collection method'"
        v-bind:field-help="'All unicode characters are accepted.'"
        v-bind:placeholder="'Trait Name'"
        v-on:input="trait.method.description = $event"
      />

      <BasicInputField
        v-bind:field-name="'Abbreviation(s)'"
        v-bind:field-help="'Semicolon separated list, with primary abbreviation as first term.'"
        v-on:input="setAbbreviations($event)"
      />

      <BasicInputField
        v-bind:field-name="'Synonyms'"
        v-bind:field-help="'Semicolon separated list.'"
        v-on:input="trait.synonyms = parseSemiColonList($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import {Trait} from "@/breeding-insight/model/Trait";
import {Method, MethodClass} from "@/breeding-insight/model/Method";
import { Scale, DataType } from '@/breeding-insight/model/Scale';
import { ProgramObservationLevel } from '@/breeding-insight/model/ProgramObservationLevel';
import OrdinalTraitForm from "@/components/trait/forms/CategoryTraitForm.vue";
import TextTraitForm from "@/components/trait/forms/TextTraitForm.vue";
import DateTraitForm from "@/components/trait/forms/DateTraitForm.vue";
import DurationTraitForm from "@/components/trait/forms/DurationTraitForm.vue";
import NumericalTraitForm from "@/components/trait/forms/NumericalTraitForm.vue";
import CategoryTraitForm from "@/components/trait/forms/CategoryTraitForm.vue";

@Component({
  components: {
    CategoryTraitForm,
    NumericalTraitForm,
    DurationTraitForm, DateTraitForm, TextTraitForm, OrdinalTraitForm, BasicSelectField, BasicInputField},
  data: () => ({DataType, MethodClass})
})
export default class TraitTable extends Vue {
  @Prop()
  programObservationLevels?: string[];
  @Prop()
  methodOptions?: string[];
  @Prop()
  scaleOptions?: string[];

  name: string = '';
  private trait: Trait = new Trait();
  private methodHistory: {[key: string]: Method} = {};
  private scaleHistory: {[key: string]: Scale} = {};

  mounted() {
    this.trait.method = new Method();
    this.trait.scale = new Scale();
  }

  @Watch('trait', {deep: true})
  emitTrait(val: Trait) {
    this.$emit('trait-change', val);
  }

  filteredDataObj(data: string[]): string[] {
    const result = data.filter(option => {
      return (
        option
          .toLowerCase()
          .indexOf(this.name.toLowerCase()) >= 0
      )
    });

    return result;
  }

  getScaleOptions() {
    if (this.trait.method && this.trait.method!.methodClass === MethodClass.Computation) {
      return [DataType.Numerical];
    } else {
      return this.scaleOptions;
    }
  }

  setMethodClass(value: string) {
    // Save our current method
    if (this.trait!.method!.methodClass) {
      this.methodHistory[this.trait!.method!.methodClass] = {...this.trait!.method!};
    }

    // Set the new method class and get formula history if available
    this.trait!.method!.methodClass = value;
    if (this.methodHistory[value]) {
      this.trait.method!.formula = this.methodHistory[value].formula;
    } else {
      this.trait.method!.formula = undefined;
    }

    // Computation method class is always numerical
    if (this.trait!.method!.methodClass === MethodClass.Computation) {
      this.setScaleClass(DataType.Numerical);
    }
  }

  setScaleClass(value: string) {

    // Save history of current scale class
    if (this.trait.scale!.dataType) {
      this.scaleHistory[this.trait.scale!.dataType] = {...this.trait.scale!};
    }

    // Look in history for existing scale
    if (this.scaleHistory[value]) {
      this.trait.scale = this.scaleHistory[value];
    } else {
      this.trait.scale = new Scale();
      this.trait.scale.dataType = value;

      // Allow for units in the numerical and duration traits
      if (value === DataType.Numerical || value === DataType.Duration) {
        this.trait!.scale!.scaleName = undefined;
      } else {
        this.trait!.scale!.scaleName = value;
      }
    }
  }

  setObservationLevel(value: string) {
    this.trait!.programObservationLevel = new ProgramObservationLevel(value);
  }
  setAbbreviations(value: string) {
    const abbreviations = this.parseSemiColonList(value);
    this.trait.abbreviations = abbreviations;
    if (abbreviations.length > 0) {this.trait.mainAbbreviation = this.trait.abbreviations[0]}
  }
  parseSemiColonList(value: string): string[] {
    return value.split(';');
  }
}

</script>

<style scoped>

</style>