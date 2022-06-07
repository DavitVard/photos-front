<style scoped>
.albums {
  display: flex !important;
  flex-direction: row !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  width: 100% !important;
  height: calc(100vh - 191px) !important;
}

</style>

<template>
  <v-container fluid>
    <v-card :disabled="!!loading" :loading="loading" flat>
      <album-bar @add-album="onAddAlbum" flat/>

      <v-divider/>

      <v-card-text>
        <Container
          :tag="{value: 'v-row', props: {dense: true}}"
          class="albums"
          orientation="horizontal"
          drag-handle-selector=".draggier"
          @drop="onAlbumDropped"
        >
          <Draggable
            v-for="album in albums"
            :key="`albums-${album.id}`"
            :tag="{value: 'v-col', props: {cols: (album.photos.length ? false : 4)}}"
          >
            <album-list-item
              :item="album"
              @rename-album="onRenameAlbum"
              @remove-album="onRemoveAlbum"
            />
          </Draggable>
        </Container>
      </v-card-text>
    </v-card>

    <album-form
      v-model="dialog"
      @create-album="onCreateAlbum"
      :order="albums.length + 1"
    />

    <album-rename
      v-model="rename"
      :editable="album"
      @album-renamed="onAlbumRenamed"
    />

    <album-confirm
      v-model="confirm"
      :editable="album"
      @album-removed="onAlbumRemoved"
    />
  </v-container>
</template>

<script>
import { applyDrag } from "@/boot";
import { Album } from "@/models/Album";
import AlbumBar from "@/components/albums/Bar";
import AlbumForm from "@/components/albums/Form";
import AlbumList from "@/components/albums/List";
import AlbumRename from "@/components/albums/Rename";
import AlbumConfirm from "@/components/albums/Confirm";
import AlbumListItem from "@/components/albums/ListItem";
import { Container, Draggable } from "vue-smooth-dnd";

export default {
  name: "Albums",
  components: {
    AlbumBar,
    AlbumForm,
    AlbumList,
    AlbumRename,
    AlbumConfirm,
    AlbumListItem,
    Container,
    Draggable,
  },
  methods: {
    onAddAlbum() {
      this.dialog = true;
    },
    onCreateAlbum(album) {
      this.albums.push(album);
    },
    onRenameAlbum(album) {
      this.rename = true;
      this.album = album;
    },
    onRemoveAlbum(album) {
      this.confirm = true;
      this.album = album;
    },
    onAlbumDropped(dropped) {
      const {removedIndex, addedIndex} = dropped;

      if (removedIndex === addedIndex) return;

      const albums = Object.assign({}, this.albums);

      this.albums = applyDrag(this.albums, dropped);

      const sequence = this.albums.map(album => album.id);

      Album.req('patch').query({sequence}).send()
        .then(res => console.log(res.data))
        .catch(err => {
          console.log(err);

          this.albums = [...albums];
        });
    },
    onAlbumRenamed(album) {
      const i = this.albums.findIndex(a => a.id === album.id);

      this.albums.splice(i, 1, album);
    },
    onAlbumRemoved(album) {
      const i = this.albums.findIndex(a => a.id === album.id);

      this.albums.splice(i, 1);
    },
    getAlbums() {
      this.loading = 'primary';

      Album.all().send()
        .then(res => this.albums = [...res.data])
        .catch(err => console.log(err))
        .finally(() => this.loading = false);
    }
  },
  data: () => ({
    confirm: false,
    loading: false,
    rename: false,
    dialog: false,
    albums: [],
    album: {}
  }),
  created() {
    this.getAlbums();
  }
}
</script>
