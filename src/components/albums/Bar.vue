<template>
  <v-toolbar v-bind="$attrs">
    <v-toolbar-title>Albums</v-toolbar-title>

    <v-spacer/>

    <v-btn @click="$emit('add-album')" text>
      <v-icon>mdi-folder-plus-outline</v-icon> create album
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: "AlbumBar"
}
</script>

<style scoped>

</style>
