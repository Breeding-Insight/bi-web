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

    @Component({
        watch: {
            $route(to, from) {
                document.title = to.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'
            },
            loggedIn(isLoggedIn) {
                if(!isLoggedIn) {
                    this.$router.push('/');
                }             
            }
        }
    })
    export default class App extends Vue {
        public loading: boolean = false;

        get loggedIn () {
            return this.$store.state.loggedIn;
        }

        get requestedPath () {
            return this.$store.state.requestedPath;
        }

        logOut (): void {
            window.location.href = process.env.VUE_APP_BI_API_ROOT+'/logout';
        }
    }
</script>
