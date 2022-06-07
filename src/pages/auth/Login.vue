<style scoped>

</style>

<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col xs="4" sm="8" md="4" lg="4">
        <validation-observer ref="form" v-slot="{ invalid }">
          <v-card :disabled="!!auth.loading" :loading="auth.loading">
            <v-toolbar color="white" flat>
              <v-btn icon @click="back">
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
                <div class="headline" v-text="heading.header"></div>
                <span class="body-2 grey--text" v-html="heading.text"></span>
              </div>
            </v-card-title>

            <v-window v-model="step">
              <v-window-item :value="1" eager>
                <v-card-text>
                  <validation-provider name="email" :rules="auth.rules.email" v-slot="{ errors }">
                    <v-text-field
                      v-model="auth.email"
                      :error-messages="errors"
                      @keypress.enter.prevent="next"
                      prepend-inner-icon="mdi-account-check-outline"
                      label="Email Or Username"
                      name="email"
                      persistent-hint
                      autofocus
                      outlined
                    />
                  </validation-provider>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="2">
                <v-card-text>
                  <v-row justify="center">
                    <v-chip class="ma-2" outlined @click="step=1">
                      <v-avatar left>
                        <v-icon>mdi-account-circle-outline</v-icon>
                      </v-avatar>
                      {{ auth.email }}
                      <v-icon right>mdi-chevron-down</v-icon>
                    </v-chip>
                  </v-row>

                  <validation-provider name="password" :rules="auth.rules.password" v-slot="{ errors }">
                    <v-text-field
                      v-model="auth.password"
                      :error-messages="errors"
                      @click:append="show = !show"
                      @keypress.enter="next"
                      :append-icon="icon"
                      :type="type"
                      prepend-inner-icon="mdi-lock-outline"
                      label="Password"
                      name="password"
                      autofocus
                      outlined
                    />
                  </validation-provider>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="3">
                <v-card-text>
                  <v-row justify="center" align="center">
                    <v-progress-circular
                      color="primary"
                      indeterminate
                      :width="5"
                      :size="50"
                    />
                  </v-row>
                </v-card-text>
              </v-window-item>
            </v-window>

            <v-card-actions>
              <v-btn to="/register" color="primary" text>
                Create an account
              </v-btn>

              <v-spacer/>

              <v-btn v-show="step < 3" :disabled="invalid" color="primary" @click="next">
                {{ text }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </validation-observer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="js">
import {Login} from "@/models/Login";
import { mapActions } from "vuex";
import {ValidationObserver, ValidationProvider} from 'vee-validate';
import {RestifyConfig} from "vue-restify";

export default {
  name: "Login",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  computed: {
    type() {
      return this.show ? 'text' : 'password';
    },
    icon() {
      return this.show ? 'mdi-eye-off' : 'mdi-eye';
    },
    text() {
      return this.step === 2 ? 'Login' : 'Next';
    },
    heading() {
      switch (this.step) {
        case 1:
          return {
            header: 'Sign in',
            text: 'To continue to Photos App'
          };
        case 2:
          return {
            header: 'Welcome',
            text: ''
          };
        default:
          return {}
      }
    },
  },
  methods: {
    next() {
      this.$refs.form.validate().then(valid => {
        if (valid) this.step++;

        if (this.step === 3) {
          this.auth.create().send()
            .then(res => {
              this.$store.dispatch('login', res.data);
              this.$router.push({name: 'albums'});
              RestifyConfig.set('headers', {
                Authorization: `Bearer ${this.$store.getters.token}`
              });
            })
            .catch(err => {
              console.log(err);
              this.step = 1;
              this.$refs.form.setErrors(this.auth.errors);
            });
        }
      });
    },
    back() {
      (this.step > 1) ? this.step-- : this.$router.go(-1);
    }
  },
  data: () => ({
    show: false,
    auth: new Login(),
    step: 1
  })
}
</script>
