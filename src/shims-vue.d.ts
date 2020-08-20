/*
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'validations' {
  import {Validation} from 'vuelidate';

  type TableValidation = {
    tableRows: {
      $each: [{
        editData: Validation
      }]
    }
  }

  type TableRowValidation = {
    currentValidationRow: {
      editData: Validation
    }
  }

  type NewRecord = {
    newRecord: Validation;
  }

  module 'vue/types/vue' {
    interface Vue {
      $v: TableValidation & NewRecord & TableRowValidation;
    }
  }

}

declare module 'vue/types/vue' {
  import VueRouter, { Route } from 'vue-router'

  interface Vue {
    $router: VueRouter
  }
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

// Shim out our global variables
declare module 'constants' {
  module 'vue/types/vue' {
    interface Vue {
      $cookieNames: {
        loginRedirectUrl: string
      }
    }
  }
}

declare module 'vue-feather-icons';
declare module 'vue-click-outside';
declare module 'vue-breakpoint-component';