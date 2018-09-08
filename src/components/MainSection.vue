<template>
  <div class="main">
    <md-toolbar class="md-primary">
        <div class="md-toolbar-section-start">
          <md-button class="md-icon-button">
            <md-icon>menu</md-icon>
          </md-button>
          <h3 class="md-title">{{ msg }}</h3>
        </div>
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button">
            <md-icon>more_vert</md-icon>
          </md-button>
        </div>
    </md-toolbar>

    <md-tabs class="md-transparent" md-alignment="fixed" @md-changed="checkTimeRemaining">
      <template slot="md-tab" slot-scope="{ tab }">
        {{ tab.label }} <i class="badge" v-if="tab.data.badge">{{ tab.data.badge }}</i>
      </template>
      <md-tab id="tab-start" md-label="Inicio" @click="changeSubSection('start')"></md-tab>
      <md-tab id="tab-timer" md-label="Cronómetro" @click="changeSubSection('timer'); clearNewTimeRemaining()" :md-template-data="{ badge:timeRemaining}" ></md-tab>
      <md-tab id="tab-monitor" md-label="Monitorización" @click="changeSubSection('monitor')"></md-tab>
    </md-tabs>

    <div v-if="this.subSection=='start'">
      <div>
        <md-card>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">Último logro</div>
              <div class="md-subhead">Normal size</div>
            </md-card-header-text>
            <md-card-media>
              <img src="../assets/logo.png" alt="Badges">
            </md-card-media>
          </md-card-header>
          <md-card-actions>
            <md-button class="md-primary">Ver logros</md-button>
          </md-card-actions>
        </md-card>
        <md-card>
          <md-card-header>
            <div class="md-title">Estadísticas</div>
          </md-card-header>
          <md-card-content>
            <span>Horas monitorizadas: {}</span>
            <md-divider class="md-inset"></md-divider>
            <span>Tiempo en una buena postura: {}</span>
            <md-divider class="md-inset"></md-divider>
            <span>Número total de monitorizaciones: {}</span>
          </md-card-content>
          <md-card-actions>
            <md-button class="md-primary">Ver perfil</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
    <div v-else-if="this.subSection=='timer'">
      <span>Sección Cronómetro</span>
    </div>
    <div v-else-if="this.subSection=='monitor'">
      <!-- Other icons: "devices_other" -->
      <md-empty-state
        md-icon="event_seat"
        md-label="Conecta tu Back4Good Sensor"
        md-description="No se ha conectado aún nigún Back4Good Sensor">
        <md-button class="md-primary md-raised">Conectar dispositivo</md-button>
        <md-button class="md-accent md-raised">Obtener un Back4Good Sensor</md-button>
      </md-empty-state>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainSection',
  data: () => ({
    msg: 'Welcome to Main Section',
    timeRemaining: 0,
    checkInterval: null,
    subSection: 'start'
  }),
  methods: {
    changeSubSection (subSection) {
      if (this.subSection !== subSection) {
        this.subSection = subSection
      }
    },
    clearCheckTimeRemaining () {
      window.clearInterval(this.checkInterval)
      this.checkInterval = null
    },
    clearNewTimeRemaining () {
      this.clearCheckTimeRemaining()
      this.timeRemaining = 0
    },
    addZero (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    checkTimeRemaining (activeTab) {
      if (activeTab !== 'tab-timer' && !this.checkInterval) {
        this.checkInterval = window.setInterval(() => {
          var currentDate = new Date()
          var m = this.addZero(currentDate.getMinutes())
          var s = this.addZero(currentDate.getSeconds())
          this.timeRemaining = m + ':' + s
          console.log(m + ':' + s)
        }, 1000)
      }
    },
    mounted () {
      this.checkTimeRemaining()
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-tabs {
    margin-bottom: 24px;
  }
  .badge {
    width: 32px;
    height: 19px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 28px;
    right: 2px;
    background: green;
    border-radius: 15%;
    color: #fff;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    letter-spacing: -.05em;
    font-family: 'Roboto Mono', monospace;
  }
  .md-card {
    width: 320px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
</style>
