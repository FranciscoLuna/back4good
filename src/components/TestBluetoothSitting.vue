<template>
  <div class="main">
    <md-empty-state
      md-icon="event_seat"
      md-label="Conecta tu Back4Good Sensor"
      md-description="No se ha conectado aún nigún Back4Good Sensor">
      <md-button id="syncButton" v-on:click="listBluethoothDevices" class="md-primary md-raised">Conectar dispositivo</md-button>
      <md-button class="md-accent md-raised">Obtener un Back4Good Sensor</md-button>
      <div>
          <md-content>{{t0}}</md-content>
          <md-content>{{t1}}</md-content>
          <md-content>{{t2}}</md-content>
          <md-content>{{t3}}</md-content>
        </div>
      <div id='heatmapContainerWrapper' class='heatmapContainerWrapper'>
        <div class='heatmapContainer'></div>
      </div>
    </md-empty-state>
  </div>
</template>

<script>


import h337 from 'heatmap.js/build/heatmap.js'


let sittingPostureService = 0x1818
let postureSensor0Charact = 0x2A70
let postureSensor1Charact = 0x2A71
let postureSensor2Charact = 0x2A72
let postureSensor3Charact = 0x2A73

var wrapperHeight
var wrapperWidth

var p_h0 = {x: 0, y: 0, value: 0 }
var p_h1 = {x: 0, y: 0, value: 0 }
var p_h2 = {x: 0 , y: 0, value: 0 }
var p_h3 = {x: 0 , y: 0, value: 0 }

var heatmapInstance = null
/*
window.onload = function() {
  var heatmapInstance = h337.create({
    container: document.querySelector('.heatmapContainer')
  })
  window.h = heatmapInstance
  h.addData({x: 150, y: 150, value: 0 })
  h.addData(p_h0)
  h.addData(p_h1)
  h.addData(p_h2)
  h.addData(p_h3)
  console.log(heatmapInstance)
}*/




export default {
  name: 'TestBluetoothSitting',
  data: () => ({
    msg: 'Welcome to Test Bluetooth Sitting Section',
    t0: 0,
    t1: 0,
    t2: 0,
    t3: 0,
    h_data: { 
      max: 15,
      min: 0,
      data: [p_h0, p_h1, p_h2, p_h3]
    }
  }),
  methods: {
    mounted () {
      this.checkTimeRemaining()
    },
    addRawData (event) {
      var value = event.target.value
      for (var i = 0; i < byteLength; i++) {
        this.rawData = this.rawData + String.fromCharCode(value.getUint8(i))
      }
      this.bluetoothData = this.rawData
    },
    resizeHeatmap () {
      wrapperHeight = document.getElementById('heatmapContainerWrapper').clientHeight;
      wrapperWidth = document.getElementById('heatmapContainerWrapper').clientWidth;
      p_h0.x = (wrapperWidth*(3 / 8)) >> 0 
      p_h0.y = (wrapperHeight*(8 / 13)) >> 0
      p_h1.x = (wrapperWidth*(5 / 8)) >> 0 
      p_h1.y = (wrapperHeight*(8 / 13)) >> 0
      p_h2.x = (wrapperWidth*(3 / 8)) >> 0
      p_h2.y = (wrapperHeight*(11 / 13)) >> 0
      p_h3.x = (wrapperWidth*(5 / 8)) >> 0
      p_h3.y = (wrapperHeight*(11 / 13)) >> 0
      console.log('Cambio de tamanio')
      console.log('Ejemplos posicion: ' + p_h0.x + ' '  + p_h3.y + ' '+ p_h1.x)
    },
    listBluethoothDevices () {
      navigator.bluetooth.requestDevice({ filters: [{ services: [sittingPostureService] }] })
      .then(device => device.gatt.connect())
      .then(server => {
        console.log("Connected")
        return server.getPrimaryService(sittingPostureService)})
      .then(service => {
        console.log("Service found")
        return service.getCharacteristics()})
      .then(characteristics => {
        console.log("Characteristics found")
        let queue = Promise.resolve()
        characteristics.forEach(characteristic => characteristic.startNotifications()
          .then(characteristic => {
            console.log("Notification allowed")
            characteristic.addEventListener('characteristicvaluechanged',
                                            this.handleCharacteristicValueChanged);
            console.log('Notifications have been started.');
          })
        )
        heatmapInstance = h337.create({
          container: document.querySelector('.heatmapContainer')
        })
        this.resizeHeatmap()
        window.addEventListener('resize', this.resizeHeatmap)
        console.log('OK')
      })
      .catch(error => { console.log(error); });
      /*
      function parseHeartRate(value) {
        // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
        value = value.buffer ? value : new DataView(value);
        let flags = value.getUint8(0);
        let rate16Bits = flags & 0x1;
        let result = {};
        let index = 1;
        if (rate16Bits) {
          result.heartRate = value.getUint16(index, true);
          index += 2;
        } else {
          result.heartRate = value.getUint8(index);
          index += 1;
        }
        let contactDetected = flags & 0x2;
        let contactSensorPresent = flags & 0x4;
        if (contactSensorPresent) {
          result.contactDetected = !!contactDetected;
        }
        let energyPresent = flags & 0x8;
        if (energyPresent) {
          result.energyExpended = value.getUint16(index, true);
          index += 2;
        }
        let rrIntervalPresent = flags & 0x10;
        if (rrIntervalPresent) {
          let rrIntervals = [];
          for (; index + 1 < value.byteLength; index += 2) {
            rrIntervals.push(value.getUint16(index, true));
          }
          result.rrIntervals = rrIntervals;
        }
        return result;
      }*/  
    },
    handleCharacteristicValueChanged(event) {
        //console.log("on event")
        var value = event.target.value;

        var uuid = parseInt('0x' + event.target.uuid.split('-')[0])

        switch(uuid){
          case (postureSensor0Charact):
            this.t0 = value.getUint16(0, true)
            p_h0.value = (this.t0 / 300) >> 0
            break
          case (postureSensor1Charact):
            this.t1 = value.getUint16(0, true)
            p_h1.value = (this.t1 / 300) >> 0
            break
          case (postureSensor2Charact):
            this.t2 = value.getInt16(0, true)
            p_h2.value = (this.t2 / 300) >> 0
            break
          case (postureSensor3Charact):
            this.t3 = value.getInt16(0, true)
            p_h3.value = (this.t3 / 300) >> 0
            break
          default:
            break
        }
        this.h_data.data = [p_h0, p_h1, p_h2, p_h3]
        heatmapInstance.setData(this.h_data)
        // TODO: Parse Heart Rate Measurement value.
        // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
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
  .heatmapContainerWrapper {
    position: relative;
    width:100%;
    padding-bottom: 90%;
    height: 0;
    margin:auto;
    background:rgba(0,0,0,.1);
    background-image: url('../assets/seatOnly.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .heatmapContainer {
    width: 1000px;
    height: 200px;
    text-align: center;
    font-family: sans-serif;
    max-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  @media (min-width: 500px) {
    .md-card {
      width: 90%;
      margin: 16px;
      vertical-align: top;
    }
    .md-card-content {
      text-align: left;
    }
    .md-card-content span{
      margin-left: 80px
    }
  }
</style>
