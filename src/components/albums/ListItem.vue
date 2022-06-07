<style lang="css" scoped>
.album-card {
  position: relative;
}
.v-card--layer {
  justify-content: space-between;
  align-items: flex-start;
  display: flex;
  position: absolute;
  z-index: 1;
  height: 64px;
  padding: 12px;
  width: 100%;
  top: 0;
}
.v-img--layer {
  background-color: #e0e0e0!important;
  border-color: #e0e0e0!important;
  cursor: pointer;
}
</style>

<template>
  <div class="album-card">
    <div class="v-card--layer">
      <v-btn class="draggier" color="primary" large icon>
        <v-icon>mdi-drag-variant</v-icon>
      </v-btn>

      <v-spacer/>

      <v-menu close-on-click offset-y>
        <template v-slot:activator="{on, attrs}">
          <v-btn v-on.stop="on" v-bind="attrs" large icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item :to="{name: 'albums.photos', params: {albumId: item.id}}">
            <v-list-item-title>Add photos</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$emit('rename-album', item)">
            <v-list-item-title>Rename Album</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$emit('remove-album', item)">
            <v-list-item-title>Delete Album</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <v-card class="rounded-xl" min-width="300" flat>
      <v-carousel
        :show-arrows-on-hover="hasPhotos"
        :show-arrows="hasPhotos"
        hide-delimiters
        height="300"
        cycle
      >
        <v-carousel-item v-if="!hasPhotos">
          <album-list-item-image
            :src="require('@/assets/photo.svg')"
            :show-action="false"
            class="v-img--layer rounded-xl"
            height="300"
          />
        </v-carousel-item>
        <v-carousel-item
          v-for="photo in item.photos"
          :key="`albums-${item.id}-photos-${photo.id}`"
          v-else
        >
          <album-list-item-image
            :src="photo.url"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            class="rounded-xl"
            aspect-ratio="1"
            height="300"
          />
        </v-carousel-item>
      </v-carousel>
    </v-card>

    <div class="title mt-2">{{ item.name }}</div>
    <div class="subtitle-2" v-if="hasPhotos">{{ item.photos.length }} items</div>
  </div>
</template>

<script>
import AlbumListItemImage from "@/components/albums/ListItemImage";

export default {
  name: "AlbumListItem",
  props: {
    item: {
      required: true,
      type: Object
    }
  },
  components: {
    AlbumListItemImage
  },
  computed: {
    hasPhotos() {
      return !!this.item.photos.length;
    }
  }
}
</script>
