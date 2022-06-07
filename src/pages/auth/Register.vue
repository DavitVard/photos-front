<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col xs="4" sm="8" md="4" lg="4">
        <validation-observer ref="form" v-slot="{ invalid }">
          <v-card :disabled="!!auth.loading" :loading="auth.loading">
            <v-toolbar color="white" flat>
              <v-btn icon @click="$router.go(-1)">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-spacer/>

              <v-toolbar-title>
                <router-link class="text-decoration-none" to="/">
                  <v-avatar tile size="36">
                    <v-img :src="require('@/assets/shutter.svg')" alt="photos"/>
                  </v-avatar>
                </router-link>
              </v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-title>
              <div class="text-center" style="width: 100%">
                <div class="headline">Sign up</div>
                <span class="body-2 grey--text">Photos App</span>
              </div>
            </v-card-title>

            <v-card-text>
              <validation-provider name="name" :rules="auth.rules.name" v-slot="{ errors }">
                <v-text-field
                  v-model="auth.name"
                  :error-messages="errors"
                  label="Full name"
                  autofocus
                  outlined
                />
              </validation-provider>

              <validation-provider name="email" :rules="auth.rules.email" v-slot="{ errors }">
                <v-text-field
                  v-model="auth.email"
                  :error-messages="errors"
                  prepend-inner-icon="mdi-account-check-outline"
                  label="Email Or Username"
                  name="email"
                  outlined
                />
              </validation-provider>

              <validation-provider name="password" :rules="auth.rules.password" v-slot="{ errors }">
                <v-text-field
                  v-model="auth.password"
                  :error-messages="errors"
                  @click:append="show = !show"
                  :append-icon="icon"
                  :type="type"
                  prepend-inner-icon="mdi-lock-outline"
                  label="Password"
                  name="password"
                  outlined
                />
              </validation-provider>

              <validation-provider name="confirm" :rules="auth.rules.password_confirmation" v-slot="{ errors }">
                <v-text-field
                  v-model="auth.password_confirmation"
                  :error-messages="errors"
                  prepend-inner-icon="mdi-lock-outline"
                  label="Password"
                  type="password"
                  outlined
                />
              </validation-provider>
            </v-card-text>

            <v-card-actions>
              <v-btn to="/login" color="primary" text>
                Has an account ?
              </v-btn>

              <v-spacer/>

              <v-btn :disabled="invalid" color="primary" @click="register">
                Register
              </v-btn>
            </v-card-actions>
          </v-card>
        </validation-observer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { RestifyConfig } from "vue-restify";
import { Register } from "@/models/Register";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "Register",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  computed: {
    type() {
      return this.show ? 'text' : 'password';
    },
    icon() {
      return this.show ? 'mdi-eye-off' : 'mdi-eye';
    }
  },
  methods: {
    register() {
      this.auth.create().send()
        .then(res => {
          this.$store.dispatch('login', res.data);
          this.$router.push({name: 'albums'});

          RestifyConfig.set('headers', {
            Authorization: `Bearer ${res.data}`
          });
        })
        .catch(err => {
          console.log(err);
          this.$refs.form.setErrors(this.auth.errors);
        });
    }
  },
  data: () => ({
    show: false,
    auth: new Register()
  })
}
</script>

<style scoped>

</style>
