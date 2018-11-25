<template>
<div>
  <md-dialog :md-active.sync="showDialog">
    <md-dialog-title>{{dialog.title}}</md-dialog-title>
    <md-dialog-content>
      <span><b>{{dialog.subtitle}}</b></span>
      <p>{{dialog.content}}</p>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="showDialog = false">Salir</md-button>
    </md-dialog-actions>
  </md-dialog>
  <md-list class="md-triple-line" key="message">
    <div v-bind:key="n" v-for="(msg,n) in messages">
      <md-list-item >
        <md-avatar>
          <md-icon class="md-primary">{{iconType(msg.type)}}</md-icon>
        </md-avatar>
        <div @click="showMessage(msg.type, msg.title, msg.content)" class="md-list-item-text">
          <span >{{messageType(msg.type)}}</span>
          <span>{{msg.title}}</span>
          <p>{{msg.content}}</p>
        </div>
        <md-button class="md-icon-button md-list-action" v-on:click="changeFavorite(msg)">
          <md-icon class="md-primary" >{{iconFavorite(msg.favorite)}}</md-icon>
        </md-button>
      </md-list-item>
      <md-divider class="md-inset"></md-divider>
    </div>
  </md-list>
  <md-button class="md-primary" v-on:click="returnBack()">Volver</md-button>
</div>
</template>

<script>
var defaultMessages = [
            {
              type:'notice',
              title:'Bienvenido a Consejos',
              content: 'En esta sección podrás acceder a los consejos que te iremos mandando con el tiempo. Puedes marcar los que te gusten como favoritos para localizarlos mejor.',
              favorite: false
            },
            {
              type:'tip',
              title:'Las piernas en la postura',
              content: '¿Lo sabías? Las piernas han de estar dobladas a la altura de las rodillas, de tal forma que estén un poco más arriba de tus caderas. Si para conseguirlo tienes que bajar demasiado tu asiento, necesitas un reposapies. Si lo necesitas trabajando, solicítalo a tu empresa; está recogido en riesgos laborales la obligación de proporcionarte uno.',
              favorite: false
            }
          ]
export default {
  name: 'ReceivedTips',
  data : () => ({
    messages: [],
    showDialog: false,
    dialog: {
      title: "",
      subtitle: "",
      content: ""
    }
  }),
  mounted() {
    if (localStorage.getItem('userSendMessages')) {
      try {
        var usrName = localStorage.userName
        console.log(usrName)
        let messagesData = JSON.parse(localStorage.getItem('userSendMessages'));
        if(messagesData.length != 0){
            var userMessages = messagesData[String(usrName)]
            if(userMessages){
              this.messages = userMessages
            } else {
              this.messages = defaultMessages
              messagesData = {
                usrName : this.messages
              }
              localStorage.setItem('userSendMessages', JSON.stringify(messagesData))
            }
        } else {
          this.messages = defaultMessages
          messagesData = {
            usrName : this.messages
          }
          localStorage.setItem('userSendMessages', JSON.stringify(messagesData))
        }
      } catch(e) {
        console.log(e)
        msgData = {
          usrName : defaultMessages
        }
        localStorage.setItem('userSendMessages', JSON.stringify(msgData))
      }
    }
    else{
      console.log("No hay mensajes")
      this.tryToGenerateDefaultMessages()
    }
  },
  methods : {
    iconType(type) {
      var iconType = "chat_bubble"
      switch (type) {
        case "notice":
          console.log("Es info")
          iconType = "info"
          break
        case "tip":
          console.log("Es consejo")
          iconType = "message"
          break
        default:
          console.log("Es desconocido")
          break
      }
      return iconType
    },
    messageType(type) {
      var iconType = "Mensaje"
      switch (type) {
        case "notice":
          iconType = "Información"
          break
        case "tip":
          iconType = "Consejo"
          break
        default:
          break
      }
      return iconType
    },
    iconFavorite(isFavorite) {
      return isFavorite ? "start" : "star_border"
    },
    showMessage (type, msgSubtitle, msgContent) {
      this.dialog = {
        title : this.messageType(type),
        subtitle : msgSubtitle,
        content : msgContent
      }
      this.showDialog = true
    },
    changeFavorite(message){
      console.log("El mensaje " + message.title + " es favorito?: " + message.favorite)
      message.favorite = !message.favorite
    },
    returnBack() {
      try {
        let usrName = localStorage.userName
        let messagesData = JSON.parse(localStorage.getItem('userSendMessages'))
        messagesData[String(usrName)] = this.messages
        localStorage.setItem('userSendMessages', JSON.stringify(messagesData))
      }
      catch (e){
        console.log(e)
        this.tryToGenerateDefaultMessages()
      }
      window.setTimeout(() => {
        this.$emit('back-to-summary')
      }, 500)
    },
    tryToGenerateDefaultMessages() {
      let usrName = localStorage.userName
      let data = {
        usrName : defaultMessages
      }
      localStorage.setItem('userSendMessages', JSON.stringify(data))
    }
  }
}
</script>

<style>
.md-list {
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.md-dialog {
  max-width: 768px;
}
</style>
