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

        mounted () {
            const currentRoute = window.location.pathname;

            api.call({url: 'http://localhost:8081/userinfo'})
            .then((response) => {
              //console.log(response);
              this.$store.commit(LOGIN, {'id': response.data.orcid, 'name': response.data.name, 'roles':[] });
              this.$router.push('/userhome');

            })
            .catch((error) => {
              // Check if it is a 401
              if (error.response && error.response.status === 401) {
                this.$store.commit(ERROR_STATE, {'loginFailed': true});
              }

              console.log(error);
            });

            if(!this.$store.state.loggedIn && currentRoute !== '/') {
                this.$store.commit(REQUESTED_PATH, {path: currentRoute});

                this.$router.push('/');
            } else {
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
