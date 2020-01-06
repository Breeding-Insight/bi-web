<template>
    <div id="app">
        <div class="container is-fluid">
            <!-- <div v-if="loggedIn">
                <div id="nav">
                    <router-link to="/">Home</router-link>
                    |
                    <router-link to="/about">About</router-link>
                    |
                    <router-link to="/userhome">UserHome</router-link>
                    |
                    <a v-on:click="logOut">Logout</a>
                </div>
            </div> -->
            <router-view/>
        </div>

        <!-- <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    <strong>&copy; Breeding Insight</strong>
                </p>
            </div>
        </footer> -->

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
                /*
                if(!isLoggedIn) {
                    this.$router.push('/login');
                }
                */
            }
        }
    })
    export default class App extends Vue {
        public loading: boolean = false;

        mounted () {
            const currentRoute = window.location.pathname;
            /*
            if(!this.$store.state.loggedIn && currentRoute !== '/login') {
                this.$store.commit(REQUESTED_PATH, {path: currentRoute});
                this.$router.push('/login');
            } else if(this.$store.state.loggedIn && currentRoute === '/login') {
                this.$router.push('/');
            } else {
                document.title = this.$route.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'
            }
            */
            document.title = this.$route.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'
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
