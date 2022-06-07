import { Restify } from "vue-restify";

export class Login extends Restify {
  static fields = {
    email: '',
    password: '',
    device_name: 'browser'
  };

  static request = {
    uri: 'login',
    prefix: 'api'
  };

  rules = {
    email: {
      required: true,
      string: true,
      email: true,
      max: 255
    },
    password: {
      required: true,
      string: true,
    }
  };

  constructor() {
    super({
      fields: Login.fields,
      request: Login.request
    });
  }
}
