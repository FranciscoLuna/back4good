<template>
  <div class="login">
    <img id="logo" src="../assets/logo no oficial b4g.jpg">
    <div>
      <div v-if="!this.state">
        <md-button v-on:click="goToProfileForm()">Nuevo usuario</md-button>
        <md-button v-on:click="changeToSignIn()">Ya tengo usuario</md-button>
      </div>
      <div v-else>
        <form novalidate class="md-layout" @submit.prevent="validateUser">
          <md-field :class="getValidationClass('userName')">
            <label for="user-name">Nombre de usuario</label>
            <md-input name="user-name" id="user-name" maxlength="10" v-model="form.userName" :disabled="sending"/>
            <span class="md-error" v-if="!$v.form.userName.required">El nombre de usuario está vacío</span>
          </md-field>
          <md-field :md-toggle-password="false" :class="getValidationClass('passwd')">
            <label for="password">Contraseña</label>
            <md-input name="password" id="password" maxlength="12" v-model="form.passwd" type="password" :disabled="sending"></md-input>
            <span class="md-error" v-if="!$v.form.passwd.required">la contraseña está vacía</span>
          </md-field>
          <md-button v-on:click="changeToSignUp()">Atras</md-button>
          <md-button type="submit" class="md-primary" v-on:click="loadProfile()" :disabled="sending">Acceder</md-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required
} from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  mixins: [validationMixin],
  data: () => ({
    form: {
      userName: null,
      passwd: null
    },
    sending: false,
    state: false
  }),
  validations: {
    form: {
      userName: {
        required
      },
      passwd: {
        required
      }
    }
  },
  methods: {
    changeToSignIn: function () {
      this.state = true
    },
    changeToSignUp: function () {
      this.state = false
    },
    goToProfileForm: function () {
      this.$router.push({ name: 'ProfileForm' })
    },
    loadProfile: function () {
      this.$router.push({ name: 'Main' })
    },
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    loginUser () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      window.setTimeout(() => {
        this.userSaved = true
        this.sending = false
        this.$router.push({ name: 'MainSection' })
      }, 1500)
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.loginUser()
      }
    }
  }
}
</script>

<style scoped>
 #logo {
   margin-top: 70px;
   max-width: 500px;
 }

</style>
