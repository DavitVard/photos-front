<style scoped>
  .welcome {
    height: calc(100vh - 124px);
  }
</style>

<template>
  <v-container>
    <v-row align="center" class="welcome text-center">
      <v-col v-if="!$store.getters.isLogged" cols="3" offset="10">
        <v-spacer/>

        <v-btn color="primary" text to="/login">Login</v-btn>
        <v-btn color="primary" text to="/register">Register</v-btn>
      </v-col>

      <v-divider/>

      <v-col cols="12">
        <v-img
          :src="require('../assets/shutter.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Photos
        </h1>

        <p class="subheading font-weight-regular">
          Make your photo albums.
        </p>

        <v-btn v-if="isLogged" color="primary" to="/albums">My Albums</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Welcome',
    computed: {
      isLogged() {
        return this.$store.getters.isLogged;
      }
    }
  }
</script>
