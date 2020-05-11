<script lang="ts">

  import {Component, Vue} from "vue-property-decorator";
  import {processProgramNavigation} from "@/router/guards";

  @Component({
    beforeRouteUpdate: processProgramNavigation
  })
  export default class ProgramsBase extends Vue {
  }
</script>
