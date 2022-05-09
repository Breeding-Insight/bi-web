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
  <div id="germplasm-pedigrees">
    <p>{{ "you can do this!" }} </p>
    <div id="pdgv-wrap" style="border:solid thin #ddd;width:100%;"></div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import GermplasmBase from "@/components/germplasm/GermplasmBase.vue";
import {Program} from "@/breeding-insight/model/Program";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import PedigreeViewer from "@solgenomics/brapi-pedigree-viewer";
import {mapGetters} from "vuex";
import {Pedigree} from "@/breeding-insight/model/import/germplasm/Pedigree";
import {GermplasmUtils} from "@/breeding-insight/utils/GermplasmUtils";
import BrAPI from "@solgenomics/brapijs";
import * as d3 from "d3";

@Component({
  components: {GermplasmPedigreesView},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  data: () => ({Pedigree, GermplasmUtils})
})
export default class GermplasmPedigreesView extends GermplasmBase {

  private activeProgram?: Program;
  private germplasm?: Germplasm;
  private pedigreeLoading: boolean = true; //todo add loading symbol when loading

  mounted() {
    this.getPedigreeView();
    //window.d3 = d3; //for testing d3 dependency expectation
    //console.log(d3.pedigreeTree);
  }

  get germplasmUUID(): string {
    return this.$route.params.germplasmId;
  }

  @Watch('$route')
  async getPedigreeView() {
    if (this.activeProgram) {
      this.pedigreeLoading = true;
      console.log("trying");
      try {
        console.log(PedigreeViewer);
        let pedigree = PedigreeViewer(
            //REQUIRED Server: BrAPI.js handle for target endpoint
            BrAPI(this.activeProgram.brapiUrl+"brapi/v2"),
            //OPTIONAL a function which returns a link to a germplasm information page, returning null will create a node without a link.
            //function(germplasmDbId){
            //  return "https://brapi.myserver.org/germ/"+germplasmDbId+".html"; //want germplasm details page, we use router link..
            //http://localhost:8080/programs/61743aca-78e9-4929-8775-5b97ea94a363/germplasm/450c1abd-d743-4d8d-a966-f07ec28559b1/pedigrees
            //}
        );
        console.log('hereA');
        pedigree.newTree(
            //REQUIRED root germplasmDbId of germplasm which should be displayed on start (highlighted in pink)
            //this.germplasmUUID //need germplasm.dbid
            42024

        )
        console.log('hereB');
        pedigree.drawViewer(
            "div#pdgv-wrap"
            //REQUIRED selector for the parent node of the new viewer SVG element.
            //"div#pdgv-wrap",
            //OPTIONAL width of viewer
            //800,
            //OPTIONAL height of viewer
            //400
        );
        console.log('hereC');

      } catch (err) {
        // Display error that pedigree view cannot be loaded
        this.$emit('show-error-notification', 'Error while trying to load pedigree viewer');
        throw err;
      } finally {
        this.pedigreeLoading = false
      }
    }
  }

}
</script>