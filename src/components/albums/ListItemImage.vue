<template>
  <v-img v-bind="$attrs">
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="grey lighten-5"/>
      </v-row>
    </template>

    <slot></slot>
  </v-img>
</template>

<script>
export default {
  name: "AlbumListItemImage",
  props: {
    showAction: {
      required: false,
      default: true,
      type: Boolean
    }
  }
}
</script>

<style scoped>

</style>
