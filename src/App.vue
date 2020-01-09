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
    import { LOGIN, LOGOUT, REQUESTED_PATH, ERROR_STATE } from '@/store/mutation-types';
    import * as api from '@/util/api';
    import { AxiosResponse, AxiosPromise } from 'axios';

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

        beforeCreate() {
            
            //Get the user info
            api.call({url: 'http://localhost:8081/userinfo'})
            .then((response: any) => {
                this.$store.commit(LOGIN, {'id': response.data.orcid, 'name': response.data.name, 'roles':[] });
            })
            .catch((error) => {
                // Check if it is a 401
                if (error.response && error.response.status === 401) {
                    this.$store.commit(ERROR_STATE, {'loginFailed': true});
                }
            }).finally(() => this.directUser());
            
        }

        directUser() {
            // Directs the user to the appropriate route based on the logged in status, roles, and destination

            const currentRoute = window.location.pathname;

            // Check they have access to the route they are supposed to have access to
            //TODO: Have a better way to check protected routes
            if(!this.$store.state.loggedIn && currentRoute !== '/') {

                // If they are not logged in and are trying to access a protected resource, send them home
                this.$store.commit(REQUESTED_PATH, {path: currentRoute});
                this.$router.push('/');

            } else if (this.$store.state.loggedIn && currentRoute == '/'){

                // If they are trying to go to the home page, and they are logged in, send them to user home
                this.$router.replace('/userhome');
            }
            else {

                // Let them do what they want if the page is unprotected
                document.title = this.$route.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'
            }

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
