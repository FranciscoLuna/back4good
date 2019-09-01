<template>
<div class="profileform" >
  <form novalidate class="md-layout" @submit.prevent="validateUser">
    <md-card class="md-layout-item md-size-50 md-small-size-100">
      <md-card-header >
        <div class="md-title">Formulario de registro</div>
      </md-card-header>
      <md-card-content>
          <md-subheader class="md-primary">Datos de usuario</md-subheader>
          <md-field :class="getValidationClass('userName')">
            <label for="user-name">Nombre de usuario</label>
            <md-input name="user-name" id="user-name" maxlength="10" v-model="form.userName" :disabled="sending"/>
            <span class="md-error" v-if="!$v.form.userName.required">Indique un nombre de usuario</span>
            <span class="md-error" v-else-if="!$v.form.userName.minlength">El nombre de usuario debe contener al menos cinco caracteres</span>
            <span class="md-error" v-else-if="!$v.form.userName.invalidCharacters">El nombre de usuario solo admite letras minúsculas sin acento (al menos una) y números</span>
            <span class="md-error" v-else-if="!$v.form.userName.alreadyExists">El nombre de usuario ya existe</span>
          </md-field>
          <md-field :md-toggle-password="false" :class="getValidationClass('passwd')">
            <label for="password">Contraseña</label>
            <md-input name="password" id="password" maxlength="12" v-model="form.passwd" type="password" :disabled="sending"></md-input>
            <span class="md-error" v-if="!$v.form.passwd.required">Indique una contraseña</span>
            <span class="md-error" v-else-if="!$v.form.passwd.minlength">La contraseña debe contener al menos seis carateres</span>
            <span class="md-error" v-else-if="!$v.form.passwd.invalidCharacters">La contraseña debe poseer al menos una letra mayúscula, una minúscula y un número</span>
          </md-field>
          <md-field :md-toggle-password="false" :class="getValidationClass('repPasswd')">
            <label for="rep-passwd">Repita la contraseña</label>
            <md-input name="rep-passwd" id="rep-passwd" maxlength="12" v-model="form.repPasswd" type="password" :disabled="sending"></md-input>
            <span class="md-error" v-if="!$v.form.repPasswd.equalToPasswd">Las contraseñas no coinciden</span>
          </md-field>

          <md-divider></md-divider>
          <md-subheader class="md-primary">Datos de perfil</md-subheader>
          <md-field :class="getValidationClass('nickName')">
            <label for="nick-name">Apodo (el nombre con el que nos dirigiremos a tí)</label>
            <md-input name="nick-name" id="nick-name" maxLength="8" v-model="form.nickName" :disabled="sending"/>
            <span class="md-error" v-if="!$v.form.nickName.required">Indique un apodo</span>
          </md-field>
          <md-datepicker name="birthdate" id="birthdate" v-model="form.birthdate" :disabled="sending" :class="getValidationClass('birthdate')">
            <label>Fecha de nacimiento</label>
            <span class="md-error" v-if="!$v.form.birthdate.required">Indique su fecha de nacimiento</span>
          </md-datepicker>
          <md-field :class="getValidationClass('gender')">
            <label for="gender">Sexo</label>
            <md-select name="gender" id="gender" v-model="form.gender" md-dense :disabled="sending">
              <md-option></md-option>
              <md-option value="male">Masculino</md-option>
              <md-option value="female">Femenino</md-option>
            </md-select>
            <span class="md-error" v-if="!$v.form.gender.required">Indique su sexo</span>
          </md-field>
          <md-field :class="getValidationClass('height')">
            <label for="height">Altura</label>
            <md-input name="height" id="height" maxLength="3" v-model="form.height" :disabled="sending"/>
            <span class="md-suffix">cm</span>
            <span class="md-error" v-if="!$v.form.height.required">Indique su altura</span>
            <span class="md-error" v-if="!$v.form.height.between">Altura no válida</span>
          </md-field>
          <md-field :class="getValidationClass('weight')">
            <label for="weight">Peso</label>
            <md-input name="weight" id="weight" maxLength="3" v-model="form.weight" :disabled="sending"/>
            <span class="md-suffix">Kg</span>
            <span class="md-error" v-if="!$v.form.weight.required">Indique su peso</span>
            <span class="md-error" v-if="!$v.form.weight.between">Peso no válido</span>
          </md-field>

          <md-divider></md-divider>
          <md-subheader class="md-primary">Opciones de registro</md-subheader>

      </md-card-content>
      <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Crear usuario</md-button>
      </md-card-actions>
    </md-card>
  </form>
</div>
</template>
<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  between,
  minLength,
  sameAs
} from 'vuelidate/lib/validators'

export default {
  name: 'ProfileForm',
  mixins: [validationMixin],
  data: () => ({
    form: {
      userName: null,
      passwd: null,
      repPasswd: null,
      nickName: null,
      birthdate: null,
      gender: null,
      height: null,
      weight: null
    },
    userSaved: false,
    sending: false
  }),
  validations: {
    form: {
      userName: {
        required,
        minLength: minLength(5)
      },
      passwd: {
        required,
        minLength: minLength(6)
      },
      repPasswd: {
        required,
        equalToPasswd: sameAs('passwd')
      },
      nickName: {
        required
      },
      birthdate: {
        required
      },
      gender: {
        required
      },
      height: {
        required,
        between: between(60, 250)
      },
      weight: {
        required,
        between: between(20, 200)
      }
    }
  },
  methods: {
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    saveUser () {
      console.log("Guardando usuario")
      this.sending = true
      let usersData = []
      if (localStorage.getItem('users')){
        usersData = JSON.parse(localStorage.getItem('users'))
      }
      let currentuser = {
        userName: this.form.userName,
        nickName: this.form.nickName,
        birthdate: this.form.birthdate,
        gender: this.form.gender,
        height: this.form.height,
        weight: this.form.weight 
      }
      usersData.push(currentuser)
      console.log(usersData)
      // Instead of this timeout, here you can call your API
      window.setTimeout(() => {
        this.userSaved = true
        this.sending = false
        localStorage.setItem('users', JSON.stringify(usersData))
        localStorage.userName = currentuser.userName
        this.$router.push({ name: 'Main' })
      }, 1500)
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.saveUser()
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
