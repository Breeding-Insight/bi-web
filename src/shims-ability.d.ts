import { AppAbility } from './config/AppAbility'

declare module 'vue/types/vue' {
  interface Vue {
    $ability: AppAbility;
    $can(this: this, ...args: Parameters<this['$ability']['can']> | Parameters<string>): boolean;
  }
}
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    ability?: AppAbility;
  }
}