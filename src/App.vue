<template>
    <div id="app">
        <div class="container is-fluid">
            <div v-if="loggedIn">
                <div id="nav">
                    <router-link to="/">Home</router-link>
                    |
                    <router-link to="/about">About</router-link>
                    |
                    <a v-on:click="logOut">Logout</a>
                </div>
                <router-view/>
            </div>
            <div v-if="!loggedIn">
                <Login/>
            </div>
        </div>
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    <strong>&copy; Breeding Insight</strong>
                </p>
            </div>
        </footer>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { LOGIN, LOGOUT } from '@/store/mutation-types';
    import Login from '@/views/Login.vue';

    @Component({
        components: { Login }
    })
    export default class App extends Vue {
        public loading: boolean = false;

        get loggedIn () {
            return this.$store.state.loggedIn;
        }

        logOut (): void {
            this.$store.commit(LOGOUT);
        }
    }
</script>
