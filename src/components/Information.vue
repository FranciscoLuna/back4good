<template>
<div>
  <div id="summary" v-if="this.infoSection=='summary'">
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
  <user-profile v-if="this.infoSection=='profile'" v-on:back-to-summary="onBackToSummary"></user-profile>
</div>
</template>

<script>
export default {
  name: 'Information',
  data: () => ({
    infoSection: 'summary'
  }),
  methods: {
    goToProfile () {
      this.infoSection='profile'
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
