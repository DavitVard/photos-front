<style scoped>

</style>

<template>
  <v-app-bar color="primary" height="70" dark app>
    <v-avatar size="48">
      <img :src="require('@/assets/shutter.svg')" alt="Photo logo">
    </v-avatar>

    <v-toolbar-title class="ml-3">
      <router-link class="text-decoration-none white--text" to="/">Photos</router-link>
    </v-toolbar-title>

    <v-spacer/>

    <v-btn v-if="isLogged" @click="logout" class="mr-1" icon>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { Logout } from "@/models/Logout";

export default {
  name: "AppBar",
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    }
  },
  methods: {
    logout() {
      (new Logout()).create().send()
        .then(() => this.$store.dispatch('logout'))
        .then(() => this.$router.push({name: 'welcome'}))
        .catch(err => console.log(err));
    }
  }
}
</script>
