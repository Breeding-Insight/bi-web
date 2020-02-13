declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vuejs-logger' {
  import {PluginFunction} from "vue";
  export const install: PluginFunction<{}>

  module 'vue/types/vue' {
    interface VueConstructor<V extends Vue = Vue> {
      $log: {
        debug(...args: any[]): void;
        info(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
        fatal(...args: any[]): void;
      };
    }
  }
}

declare module 'vue-feather-icons';