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
        >
          <b-autocomplete
            v-model="name"
            v-bind:open-on-focus="true"
            v-bind:data="filteredDataObj(programObservationLevels)"
            v-on:input="setObservationLevel($event)"
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
          v-bind:options="scaleOptions"
          v-bind:field-name="'Scale'"
          v-bind:show-label="false"
          v-bind:field-help="'Note: additional options for this field will appear after selection'"
          v-on:input="setScaleClass($event)"
        />
      </div>

      <!-- Scale options -->
    </div>
    <div class="divider is-vertical" />

    <!-- Right Side -->
    <div class="column">
      <!--TODO: needs to be a paragraph -->
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
        v-bind:field-help="'Comma separated list.'"
        v-on:input="trait.synonyms = parseCommaList($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import {Trait} from "@/breeding-insight/model/Trait";
import {Method} from "@/breeding-insight/model/Method";
import { Scale } from '@/breeding-insight/model/Scale';
import { ProgramObservationLevel } from '@/breeding-insight/model/ProgramObservationLevel';

@Component({
  components: {BasicSelectField, BasicInputField}
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

  setMethodClass(value: string) {
    this.trait!.method!.methodClass = value;
  }
  setScaleClass(value: string) {
    this.trait!.scale!.scaleName = value;
    this.trait!.scale!.dataType = value;
  }
  setObservationLevel(value: string) {
    // TODO: update model to accept id for program observation level
    this.trait!.programObservationLevel = new ProgramObservationLevel(value);
  }
  setAbbreviations(value: string) {
    const abbreviations = this.parseCommaList(value);
    this.trait.abbreviations = abbreviations;
    if (abbreviations.length > 0) {this.trait.mainAbbreviation = this.trait.abbreviations[0]}
  }
  parseCommaList(value: string): string[] {
    return value.split(',');
  }

}

</script>

<style scoped>

</style>