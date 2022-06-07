import { Restify } from "vue-restify";

export class Album extends Restify {
  static fields = {
    id: null,
    name: '',
    order: null,
    photos: []
  };

  static request = {
    prefix: 'api'
  };

  rules = {
    name: {
      required: true,
      string: true,
      max: 255
    },
    photos: {
      required: false,
      array: true
    }
  };

  constructor() {
    super({
      fields: Album.fields,
      request: Album.request
    });
  }

  get hasPhotos() {
    return this.photos.length > 0;
  }
}
