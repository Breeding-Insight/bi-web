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

import { createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Buefy from 'buefy'
import Vue from "vue";
import {Program} from "@/breeding-insight/model/Program";
import Vuelidate from "vuelidate";

const localVue = createLocalVue();
localVue.use(VueRouter);

// Setup beufy
localVue.use(Buefy);

// Set our Vuex library
localVue.use(Vuex);

Vue.use(Vuelidate);

export const defaultStore = new Vuex.Store({
  getters: {
    activeProgram: () => new Program('1', 'Test Program')
  }
});

export default localVue;