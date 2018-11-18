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
      <md-tab id="tab-monitor" md-label="Monitorización" @click="changeSubSection('monitor')"></md-tab>
      <md-tab id="tab-timer" md-label="Cronómetro" @click="changeSubSection('timer'); clearNewTimeRemaining()" :md-template-data="{ badge:timeRemaining}" ></md-tab>
    </md-tabs>

    <div v-if="this.subSection=='start'">
      <information></information>
    </div>  
    <div v-else-if="this.subSection=='timer'">
      <pomodoro></pomodoro>
    </div>
    <div v-else-if="this.subSection=='monitor'">
      <transition name="fadeSync">
        <sitting-monitor></sitting-monitor>
      </transition>
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
          // console.log(m + ':' + s)
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

</style>
