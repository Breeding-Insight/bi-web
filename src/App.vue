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
