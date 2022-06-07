import { Restify } from "vue-restify";

export class Photo extends Restify {
  formdata = true;

  rules = {
    files: {
      required: true,
      array: true,
      mimes: 'image/*',
    }
  };

  static fields = {
    id: null,
    name: '',
    path: '',
    size: '',
    ext: '',
    url: '',
  };

  static request = {
    prefix: 'api'
  };

  constructor() {
    super({
      fields: Photo.fields,
      request: Photo.request,
    });
  }
}
