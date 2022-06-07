import { Restify } from "vue-restify";

export class Logout extends Restify {
  static request = {
    uri: 'logout',
    prefix: 'api'
  }

  constructor() {
    super({
      fields: {},
      request: Logout.request
    });
  }
}
