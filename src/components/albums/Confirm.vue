<template>
  <v-dialog :value="value" persistent max-width="300">
    <v-card :loading="album.loading" :disabled="!!album.loading">
      <v-card-title class="headline">Are you sure to delete?</v-card-title>
      <v-card-text>Your album will permanently deleted with photos.</v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="error" text @click="deleteAlbum">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Album } from "@/models/Album";

export default {
  name: "AlbumConfirm",
  props: {
    value: {
      required: false,
      default: false,
      type: Boolean
    },
    editable: {
      default: () => ({}),
      required: true,
      type: Object
    }
  },
  methods: {
    close() {
      this.$emit('input', false);
      this.$nextTick(() => this.album.reset());
    },
    deleteAlbum() {
      this.album.destroy().send()
        .then(() => {
          this.$emit('album-removed', this.album.fields.all);
          this.close();
        })
        .catch(err => console.log(err));
    }
  },
  watch: {
    editable(album) {
      this.album.set(album);
    }
  },
  data: () => ({
    album: new Album()
  }),
}
</script>

<style scoped>

</style>
