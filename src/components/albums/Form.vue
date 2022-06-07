<style scoped>
.v-img--layer {
  background-color: #e0e0e0 !important;
  border-color: #e0e0e0 !important;
  cursor: pointer;
}

.v-card--layer {
  justify-content: space-between;
  align-items: flex-start;
  display: flex;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  padding: 8px;
}
</style>

<template>
  <v-dialog :value="value" transition="dialog-bottom-transition" hide-overlay fullscreen>
    <validation-observer tag="div" ref="form" v-slot="{ invalid }">
      <v-card :loading="album.loading" :disabled="!!album.loading" flat tile>
        <v-toolbar flat tile>
          <v-btn @click="close(false)" x-large icon>

            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <v-toolbar-title>Create Album</v-toolbar-title>

          <v-spacer/>

          <v-btn v-if="album.hasPhotos" @click="openPhotos" x-large icon>
            <v-icon>mdi-image-plus</v-icon>
          </v-btn>

          <v-btn @click="createAlbum" x-large icon>
            <v-icon>mdi-content-save-outline</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <validation-provider name="title" :rules="album.rules.name" v-slot="{errors}">
            <v-text-field
              v-model="album.name"
              :error-messages="errors"
              placeholder="Add a title"
              class="x-large"
              color="primary"
              single-line
              autofocus
            />
          </validation-provider>
        </v-card-text>

        <v-card-text>
          <v-row v-if="album.hasPhotos">
            <v-col v-for="photo in selected" :key="`selected-photo-${photo.id}`" cols="3">
              <v-img aspect-ratio="1" :src="photo.url" contain>
                <template v-slot:placeholder>
                  <v-row align="center" justify="center">
                    <v-spacer/>

                    <v-btn color="error" icon>
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-row>
                </template>
              </v-img>
            </v-col>
          </v-row>

          <div v-else class="d-flex flex-column align-center justify-center" style="min-height: 400px; height: 55vh">
            <v-card-subtitle class="text-left" style="width: 330px;">Add photos</v-card-subtitle>

            <v-card width="330" outlined>
              <v-list-item style="height: 90px" color="primary" @click="openPhotos">
                <v-list-item-icon style="margin: 25px 0">
                  <v-icon color="primary" x-large>mdi-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content style="margin-left: 25px;">
                  <v-list-item-title>
                    <div class="title">Select photos</div>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </div>
        </v-card-text>
      </v-card>

      <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen hide-overlay>
        <v-card :loading="loading" :disabled="!!loading" class="overflow-hidden">
          <v-app-bar scroll-target="#photos-list" color="white" elevate-on-scroll absolute>
            <v-btn @click="closePhotos" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>

            <v-toolbar-title>Add to album</v-toolbar-title>

            <v-spacer/>

            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search your photos"
              class="rounded-lg elevation-3"
              hide-details
              clearable
              flat
              solo
            />

            <v-spacer/>

            <v-btn @click="closePhotos(false)" color="primary" :disabled="!album.hasPhotos">done</v-btn>
          </v-app-bar>

          <v-sheet id="photos-list" class="overflow-y-auto" max-height="calc(100vh - 64px)">
            <v-container style="margin-top: 64px;">
              <v-item-group v-model="album.photos" multiple>
                <v-row>
                  <v-col v-for="photo in photos" :key="`photos-${photo.id}`" class="d-flex child-flex">
                    <v-item v-slot:default="{active, toggle}" :value="photo.id">
                      <v-card flat tile class="d-flex">
                        <v-hover v-slot:default="{hover}">
                          <v-img class="v-img--layer" aspect-ratio="1" :src="photo.url" @click="toggle">
                            <template v-slot:placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="grey lighten-5"/>
                              </v-row>
                            </template>

                            <div class="v-card--layer" v-if="hover || album.hasPhotos">
                              <v-hover v-slot:default="{ hover }">
                                <v-fade-transition>
                                  <v-btn icon medium @click.stop="toggle">
                                    <v-scale-transition group leave-absolute hide-on-leave>
                                      <v-icon key="active" v-if="active" color="success">mdi-checkbox-marked-circle</v-icon>
                                      <v-icon key="hover" v-else-if="hover" color="white">mdi-checkbox-marked-circle</v-icon>
                                      <v-icon key="default" v-else>mdi-checkbox-blank-circle-outline</v-icon>
                                    </v-scale-transition>
                                  </v-btn>
                                </v-fade-transition>
                              </v-hover>
                            </div>
                          </v-img>
                        </v-hover>
                      </v-card>
                    </v-item>
                  </v-col>
                </v-row>
              </v-item-group>
            </v-container>
          </v-sheet>
        </v-card>
      </v-dialog>
    </validation-observer>
  </v-dialog>
</template>

<script>
import { Photo } from "@/models/Photo";
import { Album } from "@/models/Album";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "AlbumForm",
  props: {
    value: {
      required: false,
      default: false,
      type: Boolean
    },
    order: {
      required: true,
      default: 1,
      type: Number
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  computed: {
    selected() {
      return this.photos.filter(photo => this.album.photos.includes(photo.id));
    }
  },
  methods: {
    close(input = false) {
      this.$emit('input', input);
      this.$nextTick(() => {
        this.$refs.form.reset();
        this.album.reset();
      });
    },
    createAlbum() {
      this.$refs.form.validate().then(valid => {
        if (!valid) return;

        this.album.set({order: this.order});

        this.album.create().send()
          .then(res => {
            this.$emit('create-album', res.data);
            this.close();
          })
          .catch(err => {
            console.log(err);

            this.$refs.form.setErrors(this.album.errors);
          });
      });
    },
    closePhotos(reset = true) {
      this.dialog = false;

      if (reset) {
        this.album.resetFields('photos');
      }
    },
    openPhotos() {
      this.dialog = true;
      this.getPhotos();
    },
    getPhotos() {
      this.loading = 'primary';

      Photo.all()
        .query({search: this.search})
        .send()
        .then(res => this.photos = res.data)
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
    }
  },
  watch: {
    search() {
      this.getPhotos();
    }
  },
  data: () => ({
    loading: false,
    dialog: false,
    search: '',
    photos: [],
    album: new Album()
  })
}
</script>
