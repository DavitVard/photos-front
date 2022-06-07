<template>
  <v-dialog :value="value" persistent max-width="600px">
    <validation-observer ref="form" v-slot="{invalid}">
      <v-card :loading="album.loading" :disabled="!!album.loading">
        <v-card-title>
          <span class="headline">Rename Album</span>
        </v-card-title>
        <v-card-text>
          <validation-provider name="name" :rules="album.rules.name" v-slot="{errors}">
            <v-text-field
              v-model="album.name"
              :error-messages="errors"
              label="Album name"
              color="primary"
              autofocus
              required
            />
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="close">Close</v-btn>
          <v-btn color="primary" text @click="renameAlbum">Save</v-btn>
        </v-card-actions>
      </v-card>
    </validation-observer>
  </v-dialog>
</template>

<script>
import { Album } from "@/models/Album";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "AlbumRename",
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
  components: {
    ValidationObserver,
    ValidationProvider
  },
  methods: {
    close() {
      this.album.reset();
      this.$refs.form.reset();
      this.$emit('input', false)
    },
    renameAlbum() {
      this.$refs.form.validate().then(valid => {
        if (!valid) return;

        this.album.update().only(['name']).send()
          .then(res => {
            this.$emit('album-renamed', res.data)
            this.close();
          })
          .catch(err => console.log(err));
      });
    }
  },
  watch: {
    editable(album) {
      this.album.set(album);
    }
  },
  data: () => ({
    album: new Album()
  })
}
</script>

<style scoped>

</style>
