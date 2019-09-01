<template>
<div class="profileform" >
  <form novalidate class="md-layout" @submit.prevent="validateUser">
    <md-card class="md-layout-item md-size-50 md-small-size-100">
      <md-card-header >
        <div class="md-title">Formulario de registro</div>
      </md-card-header>
      <md-card-content>
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
      </md-card-content>
      <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Guardar y salir</md-button>
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
  minLength
} from 'vuelidate/lib/validators'

export default {
  name: 'ProfileForm',
  mixins: [validationMixin],
  data: () => ({
    form: {
      userName: null,
      nickName: null,
      birthdate: null,
      gender: null,
      height: null,
      weight: null
    },
    userIndex: -1,
    userSaved: false,
    sending: false
  }),
  validations: {
    form: {
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
  mounted() {
    if (localStorage.getItem('users')) {
      try {
        let userData = JSON.parse(localStorage.getItem('users'));
        if(userData.length != 0){
          for(var u = 0; u < userData.length; u++){
            var userAux = userData[u]
            if(localStorage.userName == userAux.userName){
              this.form = userAux
              this.userIndex = u
            }
          }
        }
      } catch(e) {
        console.log(e)
        //localStorage.removeItem('users');
      }
    }
    else{
      console.log("No hay usuarios")
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
      usersData[this.userIndex] = currentuser
      // Instead of this timeout, here you can call your API
      window.setTimeout(() => {
        this.userSaved = true
        this.sending = false
        localStorage.setItem('users', JSON.stringify(usersData))
        this.$emit('back-to-summary')
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
