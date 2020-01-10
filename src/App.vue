<template>
    <div id="app">
        <header class="container">
            <div v-if="loggedIn">
                <nav class="navbar" role="navigation" aria-label="main navigation">
                    <div class="navbar-menu">
                        <ul class="navbar-start">
                            <li class="navbar-item"><router-link to="/">Home</router-link></li>
                            <li class="navbar-item"><router-link to="/about">About</router-link></li>
                            <li class="navbar-item"><router-link to="/styleguide">Style Guide</router-link></li>
                            <li class="navbar-item"><a v-on:click="logOut">Logout</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
        <main class="container">
            <router-view/>
        </main>
        <footer class="footer">
            <p class="has-text-centered">
                <strong>&copy; Breeding Insight</strong>
            </p>
        </footer>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { LOGIN, LOGOUT, REQUESTED_PATH } from '@/store/mutation-types';

    @Component({
        watch: {
            $route(to, from) {
                document.title = to.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'
            },
            loggedIn(isLoggedIn) {
                if(!isLoggedIn) {
                    this.$router.push('/login');
                }
            }
        }
    })
    export default class App extends Vue {
        public loading: boolean = false;

        mounted () {
            const currentRoute = window.location.pathname;
            if(!this.$store.state.loggedIn && currentRoute !== '/login') {
                this.$store.commit(REQUESTED_PATH, {path: currentRoute});
                this.$router.push('/login');
            } else if(this.$store.state.loggedIn && currentRoute === '/login') {
                this.$router.push('/');
            } else {
                document.title = this.$route.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'
            }
        }

        get loggedIn () {
            return this.$store.state.loggedIn;
        }

        get requestedPath () {
            return this.$store.state.requestedPath;
        }

        logOut (): void {
            this.$store.commit(LOGOUT);
        }
    }
</script>
