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
    <div class="pedigree-legend">
      <span>
        <MoveIcon size="1x" aria-hidden="true"/>  Drag to Pan
      </span>
      <span>
        <ZoomInIcon size="1x" aria-hidden="true"/> Scroll to Zoom
      </span>
      <span>
        <MinusIcon size="1x" aria-hidden="true" class="female-parent"/> Female Parent
      </span>
      <span>
        <MinusIcon size="1x" aria-hidden="true" class="male-parent"/> Male Parent
      </span>
      <span>
        <ArrowRightCircleIcon size="1x" aria-hidden="true" class="expand-ped"/> Expand Pedigree
      </span>
    </div>
    <div v-bind:id="pedigreeWrapId" v-bind:class="{'loading-indicator': pedigreeLoading}" ref="pedigreeWrap"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import GermplasmBase from '@/components/germplasm/GermplasmBase.vue';
import { Program } from '@/breeding-insight/model/Program';
import { Germplasm } from '@/breeding-insight/brapi/model/germplasm';
import PedigreeViewer from '@solgenomics/brapi-pedigree-viewer'; //todo change source
import { mapGetters } from 'vuex';
import { Pedigree } from '@/breeding-insight/model/import/germplasm/Pedigree';
import { GermplasmUtils } from '@/breeding-insight/utils/GermplasmUtils';
import BrAPI from '@solgenomics/brapijs';
import * as d3 from 'd3';
import * as pedigreeTree from '@solgenomics/d3-pedigree-tree';
import { Result } from '@/breeding-insight/model/Result';
import { GermplasmService } from '@/breeding-insight/service/GermplasmService';
import { ArrowRightCircleIcon, MinusIcon, MoveIcon, ZoomInIcon } from 'vue-feather-icons';

@Component({
  components: { GermplasmPedigreesView, ZoomInIcon, MinusIcon, ArrowRightCircleIcon, MoveIcon },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  data: () => ({ Pedigree, GermplasmUtils })
})
export default class GermplasmPedigreesView extends GermplasmBase {
  $refs!: {
    pedigreeWrap: HTMLElement
  }

  private pedigreeWrapId: String = 'pedigree-wrap';

  private activeProgram?: Program;
  private pedigreeLoading: boolean = true; //todo add loading symbol when loading
  private resolvedGermplasmDbId?: string;

  @Prop()
  private germplasmDbId?: string;

  mounted () {
    window.d3 = Object.assign(
        d3,
        pedigreeTree
    );
    window.BrAPI = Object.assign(BrAPI);
    this.getPedigreeView();
  }

  get germplasmUUID (): string {
    return this.$route.params.germplasmId;
  }

  @Watch('$route')
  async getPedigreeView () {
    if (this.activeProgram) {
      this.pedigreeLoading = true;

      if (!this.germplasmDbId) {
        try {
          const response: Result<Error, Germplasm> = await GermplasmService.getSingleGermplasm(this.activeProgram!.id!, this.germplasmUUID);
          if (response.isErr()) {
            throw response.value;
          }
          this.resolvedGermplasmDbId = response.value.germplasmDbId;
        } catch (err) {
          // Display error that germplasm cannot be loaded
          this.$emit('show-error-notification', 'Error while trying to load germplasm');
          throw err;
        }
      } else {
        this.resolvedGermplasmDbId = this.germplasmDbId;
      }

      try {
        let pedigree = PedigreeViewer(`${process.env.VUE_APP_BI_API_V1_PATH}/programs/${this.activeProgram!.id}/brapi/v2`, undefined, 'v2.0',
            // function (dbId: any) {
            //   return dbId;
            // } //commenting this out for now, as it's not straight forward to create the URL given we use our own ID instead of the germplasmDbId for navigation
            undefined,
            {
              credentials: 'include',
              urlTarget: '_self',
              nodeNameFn: function (d: any) {
                const leftBracket = d.value.name.indexOf(' [');
                const rightBracket = d.value.name.indexOf(']');
                const name = d.value.name.substring(0, leftBracket);
                const keyGid = d.value.name.substring(leftBracket + 2, rightBracket);
                const gid = keyGid.substring(keyGid.indexOf('-') + 1);

                return name + ' [GID: ' + gid + ']';
              },
              arrowUp: function () {
                return '&uarr;';
              },
              arrowDown: function () {
                return '&darr;';
              },
              arrowRight: function () {
                return '&rarr;';
              }
            });

        //for now, this gets set on render,
        // so dynamically resizing the window won't update the width of the pedigree viewer
        let clientWidth = this.$refs.pedigreeWrap.clientWidth;
        const self = this;
        pedigree.newTree(this.resolvedGermplasmDbId, function () {
          pedigree.drawViewer('#' + self.pedigreeWrapId, clientWidth, 500);
          self.pedigreeLoading = false;
        });
      } catch (err) {
        // Display error that pedigree view cannot be loaded
        this.$emit('show-error-notification', 'Error while trying to load pedigree viewer');
        this.pedigreeLoading = false;
        throw err;
      }
    }
  }

}
</script>