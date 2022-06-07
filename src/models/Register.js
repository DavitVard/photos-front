import { Restify } from "vue-restify";

export class Register extends Restify {
  static fields = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    device_name: 'browser'
  };

  static request = {
    uri: 'register',
    prefix: 'api'
  };

  rules = {
    name: {
      required: true,
      string: true,
    },
    email: {
      required: true,
      string: true,
      email: true,
      max: 255
    },
    password: {
      password: '@confirm',
      required: true,
      string: true
    },
    password_confirmation: {
      required: true,
      string: true
    }
  };

  constructor() {
    super({
      fields: Register.fields,
      request: Register.request
    });
  }
}
