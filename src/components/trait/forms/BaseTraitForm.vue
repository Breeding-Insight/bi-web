<template>
  <div class="columns is-multiline">
    <div class="column" v-bind:class="{'is-full': editFormat}">
      <BasicInputField
        v-bind:value="trait.traitName"
        v-bind:field-name="'Trait name'"
        v-bind:field-help="'All unicode characters are accepted.'"
        v-bind:placeholder="'Trait Name'"
        v-bind:server-validations="validationHandler.getValidation(0, TraitError.TraitName)"
        v-on:input="trait.traitName = $event"
      />
      <div class="sentence-input">
        <p class="is-input-prepend mt-3">
          is collected on
        </p>
        <AutoCompleteField
          v-bind:options="programObservationLevels"
          v-bind:value="trait.programObservationLevel ? trait.programObservationLevel.name : undefined"
          v-bind:field-name="'Observation Level'"
          v-bind:show-label="false"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.ObservationLevel)"
          v-on:input="setObservationLevel($event)"
        />
      </div>
      <div class="sentence-input">
        <p class="is-input-prepend mt-3">
          by
        </p>
        <BasicSelectField
          v-bind:selected-id="trait.method.methodClass"
          v-bind:options="methodOptions"
          v-bind:field-name="'Method'"
          v-bind:show-label="false"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.MethodClass)"
          v-on:input="setMethodClass($event)"
        />
      </div>
      <div class="sentence-input">
        <p class="is-input-prepend mt-3">
          using
        </p>
        <BasicSelectField
          v-bind:selected-id="StringFormatters.toStartCase(trait.scale.dataType)"
          v-bind:options="getScaleOptions()"
          v-bind:field-name="'Scale'"
          v-bind:show-label="false"
          v-bind:field-help="'Note: additional options for this field will appear after selection'"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.ScaleType)"
          v-on:input="setScaleClass($event)"
        />
      </div>

      <!-- Formula -->
      <template v-if="trait.method && trait.method.methodClass === MethodClass.Computation">
        <BasicInputField
            v-bind:value="trait.method.formula"
            v-bind:field-name="'Formula'"
            v-bind:field-help="'Operations accepted: *^.+/(); calculations will use FOIL order of operations.'"
            v-bind:placeholder="'Number of flowers on single plant / 100'"
            v-bind:server-validations="validationHandler.getValidation(0, TraitError.MethodFormula)"
            v-on:input="trait.method.formula = $event"
        />
      </template>

      <!-- Scale options -->
      <template v-if="trait.scale && (Scale.dataTypeEquals(trait.scale.dataType, DataType.Ordinal) || Scale.dataTypeEquals(trait.scale.dataType, DataType.Nominal))">
        <CategoryTraitForm
          v-bind:data="trait.scale.categories"
          v-on:update="setCategories($event)"
          v-bind:type="trait.scale.dataType"
          v-bind:validation-handler="validationHandler"
          v-bind:validation-index="0"
        />
      </template>
      <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Text)">
        <TextTraitForm />
      </template>
      <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Date)">
        <DateTraitForm />
      </template>
      <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Duration)">
        <DurationTraitForm
            v-bind:unit="trait.scale.scaleName"
            v-bind:valid-min="trait.scale.validValueMin"
            v-bind:valid-max="trait.scale.validValueMax"
            v-on:unit-change="trait.scale.scaleName = $event"
            v-on:min-change="trait.scale.validValueMin = $event"
            v-on:max-change="trait.scale.validValueMax = $event"
            v-bind:client-validations="clientValidations"
            v-bind:validation-handler="validationHandler"
            v-bind:validation-index="0"
        />
      </template>
      <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Numerical)">
        <NumericalTraitForm
          v-bind:unit="trait.scale.scaleName"
          v-bind:decimal-places="trait.scale.decimalPlaces"
          v-bind:valid-min="trait.scale.validValueMin"
          v-bind:valid-max="trait.scale.validValueMax"
          v-on:unit-change="trait.scale.scaleName = $event"
          v-on:decimal-change="trait.scale.decimalPlaces = $event"
          v-on:min-change="trait.scale.validValueMin = $event"
          v-on:max-change="trait.scale.validValueMax = $event"
          v-on:show-error-notification="$emit('show-error-notification', $event)"
          v-bind:client-validations="clientValidations"
          v-bind:validation-handler="validationHandler"
          v-bind:validation-index="0"
        />
      </template>
    </div>

    <div class="divider is-vertical" />

    <!-- Right Side -->
    <div class="column" v-bind:class="{'is-full': editFormat}">
      <BasicInputField
        v-bind:value="trait.method.description"
        v-bind:field-name="'Description of collection method'"
        v-bind:field-help="'All unicode characters are accepted.'"
        v-bind:placeholder="'Method Description'"
        v-bind:server-validations="validationHandler.getValidation(0, TraitError.MethodDescription)"
        v-on:input="trait.method.description = $event"
      />

      <BasicInputField
        v-bind:value="trait.abbreviations ? trait.abbreviations.join(';') : undefined"
        v-bind:field-name="'Abbreviation(s)'"
        v-bind:field-help="'Semicolon separated list, with primary abbreviation as first term.'"
        v-bind:server-validations="validationHandler.getValidation(0, TraitError.Abbreviations)"
        v-on:input="setAbbreviations($event)"
      />

      <BasicInputField
        v-bind:value="trait.synonyms ? trait.synonyms.join(';') : undefined"
        v-bind:field-name="'Synonyms'"
        v-bind:field-help="'Semicolon separated list.'"
        v-on:input="trait.synonyms = parseSemiColonList($event)"
      />

      <!-- Tags -->
      <div>
        <TagField
            v-bind:options="tags"
            v-bind:value="trait.tags"
            v-bind:field-name="'Tags'"
            v-bind:show-label="true"
            v-on:add="addTag($event)"
            v-on:remove="removeTag($event)"
        />
      </div>
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
import {TraitError} from "@/breeding-insight/model/errors/TraitError";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import AutoCompleteField from "@/components/forms/AutoCompleteField.vue";
import { StringFormatters } from '@/breeding-insight/utils/StringFormatters';
import {Category} from "@/breeding-insight/model/Category";
import {integer} from "vuelidate/lib/validators";
import TagField from "@/components/forms/TagField.vue";

@Component({
  components: {
    TagField,
    AutoCompleteField,
    CategoryTraitForm,
    NumericalTraitForm,
    DurationTraitForm, DateTraitForm, TextTraitForm, OrdinalTraitForm, BasicSelectField, BasicInputField},
  data: () => ({DataType, MethodClass, TraitError, StringFormatters, Scale})
})
export default class BaseTraitForm extends Vue {
  @Prop()
  programObservationLevels?: string[];
  @Prop()
  methodOptions?: string[];
  @Prop()
  scaleOptions?: string[];
  @Prop()
  clientValidations: any;
  @Prop()
  validationHandler!: ValidationError;
  @Prop({default: () => new Trait()})
  trait!: Trait;
  @Prop({default: false})
  editFormat!: boolean;
  @Prop()
  tags?: string[];

  name: string = '';
  private methodHistory: {[key: string]: Method} = {};
  private scaleHistory: {[key: string]: Scale} = {};
  private lastCategoryType: string = '';

  created() {
    if (!this.trait.method) {
      this.trait.method = new Method();
    }
    if (!this.trait.scale){
      this.trait.scale = new Scale();
    }
  }

  @Watch('trait', {deep: true})
  emitTrait(val: Trait) {
    this.$emit('trait-change', val);
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
      this.methodHistory[this.trait!.method!.methodClass] = {...this.trait!.method!} as Method;
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
      this.scaleHistory[this.trait.scale!.dataType.toLowerCase()] = Scale.assign({...this.trait.scale!} as Scale);
      if (Scale.dataTypeEquals(this.trait!.scale!.dataType, DataType.Nominal) || Scale.dataTypeEquals(this.trait!.scale!.dataType, DataType.Ordinal)) {
        this.lastCategoryType = this.trait!.scale!.dataType;
      }
    }

    if (Scale.dataTypeEquals(value, DataType.Nominal) && Scale.dataTypeEquals(this.lastCategoryType, DataType.Ordinal)) {
      this.trait.scale = Scale.assign(this.scaleHistory[DataType.Ordinal.toLowerCase()]);
      // Clear the labels
      if (this.trait.scale.categories) {
        this.trait.scale.categories.forEach(category => category.label = undefined);
      }

      this.trait.scale.dataType = value;
      this.trait!.scale!.scaleName = value;
    } else if (Scale.dataTypeEquals(value, DataType.Ordinal) && Scale.dataTypeEquals(this.lastCategoryType, DataType.Nominal)) {
      this.trait.scale = Scale.assign(this.scaleHistory[DataType.Nominal.toLowerCase()]);
      // Add 1-based index labels to categories
      if (this.trait.scale.categories) {
        this.trait.scale.categories.forEach((category, index, categories) => {
          // Use prior labels if they exist
          const historicalCats: Category[] = this.scaleHistory[DataType.Ordinal.toLowerCase()] ? this.scaleHistory[DataType.Ordinal.toLowerCase()].categories as Category[] : [] as Category[];
          if (historicalCats[index] && historicalCats[index].label) {
            category.label = historicalCats[index].label;
          } else {
            const autoLabel: string = index + 1 + '';
            if(categories.find(anyCategory => anyCategory.label === autoLabel)) {
              category.label = autoLabel + '_dup';
            } else {
              category.label = autoLabel;
            }
          }
        })
      }
      this.trait.scale.dataType = value;
      this.trait!.scale!.scaleName = value;

    } else if (this.scaleHistory[value.toLowerCase()]) {
      this.trait.scale = this.scaleHistory[value.toLowerCase()];
      this.trait.scale.dataType = value;
      this.trait!.scale!.scaleName = value;

    } else {
      // No history
      this.trait.scale = new Scale();
      this.trait.scale.dataType = value;

      // Allow for units in the numerical and duration traits
      if (Scale.dataTypeEquals(value, DataType.Numerical) || Scale.dataTypeEquals(value, DataType.Duration)) {
        this.trait!.scale!.scaleName = undefined;

      } else {
        this.trait!.scale!.scaleName = value;
      }
    }
  }

  setCategories(categories: Category[]) {
    this.trait.scale!.categories = categories;
    this.emitTrait(this.trait);
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
  addTag(tag: string) {
    this.trait.addTag(tag);
  }
  removeTag(tag: string) {
    this.trait.removeTag(tag);
  }
}

</script>

<style scoped>

</style>
