<style scoped>
.v-container--full {
  height: calc(100vh - 64px);
}

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

.gallery {
  overflow-y: auto;
  padding-top: 64px;
  max-height: calc(100vh - 94px);
}

.provider {
  display: flex;
  flex: 1 1 auto;
}
</style>

<template>
  <v-container fluid>
    <v-card :loading="loading" :disabled="!!loading" flat>
      <v-app-bar :color="color" :dark="!!isSelected" scroll-target="#scrolling" elevate-on-scroll absolute>
        <v-btn v-if="isSelected" icon @click="selected = []">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <v-btn v-else to="/albums" exact icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title>
          {{ isSelected ? `${isSelected} selected` : `${album.name} photos` }}
        </v-toolbar-title>

        <v-spacer/>

        <validation-provider ref="provider" tag="div" name="photos" class="provider" :rules="photo.rules.files">
          <v-scale-transition>
            <v-file-input
              v-if="!isSelected"
              v-model="photo.file"
              :loading="photo.loading"
              :show-size="1000"
              @change="createPhotos"
              placeholder="Select your photos"
              prepend-icon="mdi-camera"
              label="Photos"
              color="gray"
              solo-inverted
              hide-details
              clearable
              multiple
              solo
              flat
            />
          </v-scale-transition>
        </validation-provider>

        <v-spacer/>

        <v-scale-transition>
          <v-btn v-if="isSelected" key="delete" icon @click="destroyPhotos">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-scale-transition>
      </v-app-bar>

      <v-sheet id="scrolling" class="gallery">
        <v-container fluid>
          <v-item-group v-model="selected" multiple>
            <v-row dense>
              <v-col v-for="photo in album.photos" :key="photo.id" xl="2" lg="3" md="3" sm="4" xs="6">
                <v-item v-slot:default="{ active, toggle }" :value="photo.id">
                  <v-card class="d-flex rounded-xl" flat tile>
                    <v-hover v-slot:default="{hover}">
                      <v-img
                        v-on="isSelected ? {click: toggle} : {click: preview}"
                        class="v-img--layer"
                        :src="photo.url"
                        height="300"
                      >
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="grey lighten-5"/>
                          </v-row>
                        </template>

                        <div class="v-card--layer" v-if="hover || isSelected">
                          <v-hover v-slot:default="{ hover }">
                            <v-fade-transition>
                              <v-btn icon medium @click.stop="toggle">
                                <v-scale-transition group leave-absolute hide-on-leave>
                                  <v-icon key="active" v-if="active" color="success">mdi-checkbox-marked-circle</v-icon>
                                  <v-icon key="hover" v-else-if="hover" color="white">mdi-checkbox-marked-circle
                                  </v-icon>
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
  </v-container>
</template>

<script>
import { Photo } from "@/models/Photo";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "Photos",
  props: {
    albumId: {
      required: true,
      type: Number
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider
  },
  computed: {
    isSelected() {
      return this.selected.length
    },
    color() {
      return this.isSelected ? 'grey darken-4' : 'white'
    },
  },
  data: () => ({
    loading: false,
    photo: new Photo(),
    album: {},
    selected: [],
  }),
  methods: {
    preview(index) {
      // this.dialog = true;
      // this.slide = index;
    },
    getPhotos() {
      this.loading = 'primary';

      Photo.all()
        .prefix(`albums/${this.albumId}`).send()
        .then(res => this.album = res.data)
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
    },
    createPhotos(files) {
      this.$refs.provider.validate(files).then(({valid, errors}) => {
        if (!valid) return;
        this.photo.create()
          .prefix(`albums/${this.albumId}`)
          .only(['file']).send()
          .then(res => this.album.photos = this.album.photos.concat(res.data))
          .catch(err => console.log(err))
          .finally(() => this.photo.reset());
      });
    },
    destroyPhotos() {
      this.loading = 'primary';

      Photo.destroyMany(this.selected).send()
        .then(res => this.album.photos = this.album.photos.filter(photo => !res.data.ids.includes(photo.id)))
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
    }
  },
  created() {
    this.getPhotos();
  }
}
</script>
