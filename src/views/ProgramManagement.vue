import {EditIcon} from "vue-feather-icons";import {DeleteIcon} from "vue-feather-icons";import {CheckSquareIcon} from "vue-feather-icons";import {XIcon} from "vue-feather-icons";
<template>
    <h1 class="title">Program Management</h1>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import SideBarMaster from '@/components/layouts/SideBarLayout.vue'

  @Component({
    components: {SideBarMaster}
  })
  export default class ProgramManagement extends Vue {
  }
</script>