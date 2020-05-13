<template>
  <div class="sidebarlayout">
    <header>
      <div class="level header-title is-marginless is-mobile">
        <div class="level-left">
          <div class="level-item is-hidden-touch">
            <a href="/">
              <img
                  src="../../assets/img/bi-logo.svg"
                  alt="Breeding Insight home"
                  width="232"
              >
            </a>
          </div>
          <div class="level-item is-hidden-desktop is-pulled-left">
            <a role="button"
               class="navbar-hamburger has-text-dark"
               aria-label="menu"
               aria-expanded="false"
               @click="sideMenuShownMobile = !sideMenuShownMobile"
            >
              <MenuIcon></MenuIcon>
            </a>
          </div>
        </div>
        <div class="level-right program-selection-level">
          <slot name="title"></slot>
        </div>
      </div>
    </header>

    <div class="columns is-marginless">
      <div
          class="column side-menu is-one-fifth"
          :class="{ 'is-hidden-touch': !sideMenuShownMobile }"
      >
        <nav role="navigation" aria-label="main navigation">
          <aside id="sideMenu" class="menu">
            <slot name="menu"></slot>
          </aside>
        </nav>
      </div>


      <div class="column">
        <main>
          <div class="level is-mobile">
            <div class="level-left"></div>
            <div class="level-right">
              <div class="level-item">
                <p>Logged in as <strong>{{username}}</strong></p>
              </div>
              <div class="level-item">
                <button class="button is-outlined is-primary" @click="$emit('logout')">Log out</button>
              </div>
            </div>
          </div>
          <section class="section">
            <slot name="content"></slot>
          </section>
        </main>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Watch, Vue} from 'vue-property-decorator'
  import { MenuIcon } from 'vue-feather-icons'


  @Component( {
    components: {MenuIcon}
  })
  export default class SideBarMaster extends Vue {
    sideMenuShownMobile: boolean = false;

    @Prop()
    username!: string;

    @Watch('$route')
    onUrlChange(){
      this.sideMenuShownMobile = false;
    }
  }

</script>