<template>
<div class="containerElem md-size-50 md-small-size-100">
  <h1 class="md-title">Iniciar sesión</h1>
  <div class="loginOptions">
    <div id="registeredUsers" v-if="anyUserInLocalDB">
      <md-subheader class="md-primary">Usuario registrado</md-subheader>
      <md-list  v-if="!userSelected" id="userList" class="md-scrollbar" >
          <md-list-item v-bind:key="n" v-for="(usr,n) in users">
            <md-icon>account_circle</md-icon>
            <span class="md-list-item-text">{{usr}}</span>
            <md-button class="md-icon-button md-list-action" v-on:click="selectUser(n)">
              <md-icon class="md-primary">keyboard_arrow_right</md-icon>
            </md-button>
          </md-list-item>
      </md-list>
      <div key="login" v-else id="userLogin">
        <form id="loginForm" novalidate class="md-layout" @submit.prevent="validateUser">
          <div class="md-layout-item md-small-size-100">
            <md-content id="userSelected">
              <md-icon>account_circle</md-icon>
              <span>{{form.userName}}</span>
            </md-content>
            <md-field :class="getValidationClass('passwd')">
              <label for="user-passwd">Contraseña</label>
              <md-input name="user-passwd" id="user-passwd" type="password" v-model="form.passwd" :disabled="sending" />
              <span class="md-error" v-if="!$v.form.passwd.required">Por favor, inserta la contraseña para tu usuario</span>
            </md-field>
          </div>
          <md-button id="backButton" class="md-primary"  v-on:click="returnToUserSelection()">Atrás</md-button>
          <md-button id="loginButton" type="submit" class="md-primary md-raised" :disabled="sending">Iniciar sesión</md-button>
        </form>
      </div>
    </div>
    <div id="register">
      <md-subheader class="md-primary">Nuevo usuario</md-subheader>
      <md-button id="newUserButton" class="md-primary md-raised" v-on:click="goToProfileForm()">Crear nuevo usuario</md-button>
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
    anyUserInLocalDB: false,
    userSelected: false,
    sending: false,
    users: [],
    form: {
      userName: null,
      passwd: null
    }
  }),
  validations: {
    form: {
      passwd: {
        required
      }
    }
  },
  mounted() {
    if (localStorage.getItem('users')) {
      try {
        let userData = JSON.parse(localStorage.getItem('users'));
        if(userData.length != 0){
          for(var u = 0; u < userData.length; u++){
            this.users.push(userData[u].userName)
          }
          this.anyUserInLocalDB = true
        }
      } catch(e) {
        localStorage.removeItem('users');
      }
    }
    else{
      console.log("No hay usuarios")
    }
  },
  methods: {
    selectUser (n) {
      this.form.userName = this.users[n]
      this.userSelected =true
    },
    returnToUserSelection(){
      this.form.userName = null
      this.userSelected =false
    },
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.loginUser()
      }
    },
    loginUser(){
      localStorage.userName = this.form.userName
      this.$router.push({ name: 'Main' })
    },
    goToProfileForm(){
      this.$router.push({ name: 'ProfileForm' })
    }
  }
}
</script>

<style>
.containerElem {
  height: 100%;
  width: 100%
}
.loginOptions {
  height: 100%;
}
#userList{
  max-height:150px; 
  overflow:hidden;
  overflow-y:scroll;
  background-color: #fff8;
  border: 1px solid #ccc!important;
  border-radius: 1%
}

#userLogin {
  border:#ffff;
  padding: 20px;

}

.md-list-item-content{
  border-bottom: 1px solid #aaa!important;
}

#newUserButton, #loginButton, #backButton{
  text-transform: none
}

#loginForm {
  width: 100%;
  height: 100%;
  display: inline-block;
}

#loginButton {
  float: right;
}

#backButton {
  float: left;
}

#userSelected {
  background-color: rgba(0, 0, 0, 0.0);
  float: left;
}

@media (min-width: 501px){
  .containerElem {
    height: auto;
    min-height: 300px;
    overflow-y: auto;
    margin-top: 100px;
  }

  .loginOptions {
    margin: auto;
    width: 60%;
    padding:10px;
    border: 1px solid rgba(#000, .12);
  }

  #userLogin {
    max-height:180px;
    padding: 20px;
    background-color: #fff8;
    border: 1px solid #ccc!important;
    border-radius: 1%
  }

  #userSelected {
    float:none
  }

}
</style>
