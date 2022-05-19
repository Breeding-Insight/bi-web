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
    <div id="pdgv-wrap" style="border:solid thin #ddd;"></div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import GermplasmBase from "@/components/germplasm/GermplasmBase.vue";
import {Program} from "@/breeding-insight/model/Program";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import PedigreeViewer from "@solgenomics/brapi-pedigree-viewer"; //todo change source
import {mapGetters} from "vuex";
import {Pedigree} from "@/breeding-insight/model/import/germplasm/Pedigree";
import {GermplasmUtils} from "@/breeding-insight/utils/GermplasmUtils";
import BrAPI from "@solgenomics/brapijs";
import * as d3 from "d3";
import * as pedigreeTree from "@solgenomics/d3-pedigree-tree";

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
  private pedigreeLoading: boolean = true; //todo add loading symbol when loading

  @Prop()
  private germplasmDbId: string;
  //maybe need to make computed?

  mounted() {
    window.d3 = Object.assign(
        d3,
        pedigreeTree
    );
    window.BrAPI = Object.assign(BrAPI);
    //version = 2.0;
    this.getPedigreeView();
    console.log("pedigree stuff");
    console.log(d3.pedigreeTree);
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
            BrAPI(this.activeProgram.brapiUrl+"brapi/v1"), 'v1.3'
            //TODO seems like there's dependencies other than version
            //so keeping at 1 for now so i can do other fixes
            //even though those fixes might be rendered null by other changes

            //OPTIONAL a function which returns a link to a germplasm information page, returning null will create a node without a link.
            //function(germplasmDbId){
            //  return "https://brapi.myserver.org/germ/"+germplasmDbId+".html"; //want germplasm details page, we use router link..
            //http://localhost:8080/programs/61743aca-78e9-4929-8775-5b97ea94a363/germplasm/450c1abd-d743-4d8d-a966-f07ec28559b1/pedigrees
            //}
        );
        console.log('hereA');
        console.log(pedigree);
        pedigree.newTree(
            //REQUIRED root germplasmDbId of germplasm which should be displayed on start (highlighted in pink)
            //need germplasm.germplasmDbId
            //move to method?
            //todo clean up other attempts to retrieve/pass dbid
            this.$store.state.currentGermplasm.germplasmDbId
        )
        console.log('hereB');
        console.log(pedigree);
        pedigree.drawViewer("div#pdgv-wrap", 800, 400); //todo make more flexible for screen sizes?
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