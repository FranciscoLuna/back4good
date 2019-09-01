<template>
<div>
  <div id="summary" v-if="this.infoSection=='summary'">
    <md-card id="lastAdward">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Último consejo</div>
          <div class="md-subhead">{{lastMessageTitle}}</div>
        </md-card-header-text>
        <md-card-media>
          <md-icon class="md-size-2x">message</md-icon>
        </md-card-media>
      </md-card-header>
      <md-card-actions>
        <md-button class="md-primary" v-on:click="goToTips()">Ver consejos</md-button>
      </md-card-actions>
    </md-card>
    <md-card id="lastAdward">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Último logro</div>
          <div class="md-subhead">Aún no has alcanzado ningún logro</div>
        </md-card-header-text>
        <md-card-media>
          <md-icon class="md-size-2x">star</md-icon>
        </md-card-media>
      </md-card-header>
      <md-card-actions>
        <md-button class="md-primary">Ver logros</md-button>
      </md-card-actions>
    </md-card>
    <md-card id="statistics">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Estadísticas</div>
        </md-card-header-text>
        <md-card-media>
          <md-icon class="md-size-2x">insert_chart</md-icon>
        </md-card-media>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-size-90">
            <span>Horas monitorizadas:</span>
          </div>
          <div class="md-layout-item md-size-10">
            <span>{}</span>
          </div>
        </div>
        <div class="md-layout">
          <div class="md-layout-item md-size-90">
            <span>Tiempo en una buena postura:</span>
          </div>
          <div class="md-layout-item md-size-10">
            <span>{}</span>
          </div>
        </div>
        <div class="md-layout">
          <div class="md-layout-item md-size-90">
            <span>Número total de monitorizaciones:</span>
          </div>
          <div class="md-layout-item md-size-10">
            <span>{}</span>
          </div>
        </div>
      </md-card-content>
      <md-card-actions>
        <md-button class="md-primary" v-on:click="goToProfile()">Ver perfil</md-button>
      </md-card-actions>
    </md-card>
  </div>
  <user-profile v-else-if="this.infoSection=='profile'" v-on:back-to-summary="onBackToSummary"></user-profile>
  <received-tips v-else-if="this.infoSection=='tips'" v-on:back-to-summary="onBackToSummary"></received-tips>
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
  name: 'Information',
  data: () => ({
    infoSection: 'summary',
    lastMessageTitle : ""
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
                this.lastMessageTitle = userMessages[userMessages.length-1].title
              } else {
                this.messages = defaultMessages
                messagesData = {
                  usrName : this.messages
                }
                this.lastMessageTitle = defaultMessages[defaultMessages.length-1].title
                localStorage.setItem('userSendMessages', JSON.stringify(messagesData))
              }
          } else {
            this.messages = defaultMessages
            messagesData = {
              usrName : this.messages
            }
            this.lastMessageTitle = defaultMessages[defaultMessages.length-1].title
            localStorage.setItem('userSendMessages', JSON.stringify(messagesData))
          }
        } catch(e) {
          console.log(e)
          this.messages = defaultMessages
          messagesData = {
            usrName : this.messages
          }
          this.lastMessageTitle = defaultMessages[defaultMessages.length-1].title
          localStorage.setItem('userSendMessages', JSON.stringify(msgData))
        }
      }
      else{
        console.log("No hay mensajes")
        this.tryToGenerateDefaultMessages()
      }
  },
  methods: {
    tryToGenerateDefaultMessages() {
      let usrName = localStorage.userName
      let data = {
        usrName : defaultMessages
      }
      this.lastMessageTitle = defaultMessages[defaultMessages.length-1].title
      localStorage.setItem('userSendMessages', JSON.stringify(data))
    },
    goToProfile () {
      this.infoSection='profile'
    },
    goToTips () {
      this.infoSection='tips'
    },
    onBackToSummary () {
      this.infoSection='summary'
    }
  }
}
</script>

<style>
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
  .md-card-content {
    text-align: left;
    margin-left: 10px;
    margin-right: 10px;
    padding-bottom: 8px
  }
  #lastAdward .md-card-header {
    height: 85px;
  }

  #statistics .md-card-header {
    height: 75px;
  }

  @media (min-width: 500px) {
    .md-card {
      width: 90%;
      margin: 4px;
      vertical-align: top;
    }
    .md-card-content {
      margin-left: 25px;
      margin-right: 25px
    }

  }
</style>
