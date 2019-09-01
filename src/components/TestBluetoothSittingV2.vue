<template>
  <div class="monitorSection">
    <md-empty-state v-if="!this.monitorEnabled"
      md-icon="event_seat"
      md-label="Conecta tu Bertical Sensor"
      md-description="No se ha conectado aún nigún Back4good Sensor">
      <md-button id="syncButton" v-on:click="listBluethoothDevices" class="md-primary md-raised">Conectar dispositivo</md-button>
      <!--<md-button id="syncButton" v-on:click="simuleBLE" class="md-primary md-raised">Conectar dispositivo</md-button>-->
      <md-button class="md-accent md-raised">Obtener un Back4Good Sensor</md-button>
    </md-empty-state>

    <md-empty-state v-else
      md-label="Monitorizando tu postura"
      md-description="El color representa la fuerza ejercida. Procura que sea equilibrada.">
      <input type="text" name="textboxSensors" id="textboxSensors" readonly="true" />
      <div id='heatmapContainerWrapper' class='heatmapContainerWrapper'>
        <div class='heatmapContainer'></div>
      </div>
      <md-button class="md-accent md-raised" v-on:click="stopBluetoothReading">Parar monitorización</md-button>
      <!--<md-button class="md-accent md-raised" v-on:click="classifyPosture" value="=">Clasificación</md-button>-->
    </md-empty-state>
  </div>
</template>

<script>

import h337 from 'heatmap.js/build/heatmap.js'
import * as tf from '@tensorflow/tfjs' //Necesario instalar @tensorflow/tfjs: npm install @tensorflow/tfjs

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

//var loadedModel = null; //Añadido por LDL

var heatmapInstance = null

export default {
  name: 'TestBluetoothSittingV2',
  data: () => ({
    msg: 'Welcome to Bluetooth reading component',
    monitorEnabled: false,
    bleDevice: null,
    t0: 0,
    t1: 0,
    t2: 0,
    t3: 0,
    h_data: { 
      max: 25,
      min: 0,
      data: [p_h0, p_h1, p_h2, p_h3]
    }
  }),
  methods: {
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
      //console.log('Cambio de tamanio')
      //console.log('Ejemplos posicion: ' + p_h0.x + ' '  + p_h3.y + ' '+ p_h1.x)
      
    },
    simuleBLE(){
      
      this.monitorEnabled = true
      this.t0 = 2500
      p_h0.value = (this.t0 / 200) >> 0

      this.t1 = 4500
      p_h1.value = (this.t0 / 200) >> 0

      this.t2 = 3500
      p_h2.value = (this.t0 / 200) >> 0

      this.t3 = 5000
      p_h3.value = (this.t0 / 200) >> 0

      this.h_data.data = [p_h0, p_h1, p_h2, p_h3]

      this.$nextTick(_ =>{
        heatmapInstance = h337.create({
          container: document.querySelector('.heatmapContainer')
        })
      this.resizeHeatmap()
      window.addEventListener('resize', this.resizeHeatmap)
      heatmapInstance.setData(this.h_data)
      //console.log("[" + p_h0.value + ", " + p_h1.value + ", " +  p_h2.value + ", " +  p_h3.value + "]")
      
      

      })
    },
    listBluethoothDevices () {
      
      navigator.bluetooth.requestDevice({ filters: [{ services: [sittingPostureService] }] })
      .then(device => {
        this.bleDevice = device
        console.log("Detected")
        return device.gatt.connect()
      })
      .then(server => {
        console.log("Connected")
        console.log(server)
        return server.getPrimaryService(sittingPostureService)})
      .then(service => {
        console.log("Service found")
        return service.getCharacteristics()})
      .then(characteristics => {
        console.log("Characteristics found")
        //let queue = Promise.resolve()
        this.monitorEnabled = true
        
        characteristics.forEach(characteristic => characteristic.startNotifications()
          .then(characteristic => {
            console.log("Notification allowed")
            characteristic.addEventListener('characteristicvaluechanged',
                                            this.handleCharacteristicValueChanged);
            characteristic.addEventListener('characteristicvaluechanged',  //Añadido por LDL
                                            this.handleclassifyPosture);   //Añadido por LDL
            console.log('Notifications have been started.');
          })
        )
        this.$nextTick(_ =>{
          heatmapInstance = h337.create({
            container: document.querySelector('.heatmapContainer')
          })
          this.resizeHeatmap()
          window.addEventListener('resize', this.resizeHeatmap)
        })
        
        console.log('OK')
      })
      .catch(error => { console.log(error); });      
    },
    handleclassifyPosture(event) {     //Añadido por LDL

      async function loadNNModel() {

        loadedModel = await tf.loadLayersModel('http://localhost:8080/static/model.json')

      }
      
      (async() => {

        await loadNNModel();
        
        const testingData =  tf.tensor2d([p_h0.value, p_h1.value, p_h2.value, p_h3.value], [1, 4])
        var posture = loadedModel.predict(testingData);

        var arr = posture.dataSync()
        let i = arr.indexOf(Math.max(...arr));

        textboxSensors.value = i;
      })();

      
    },
    handleCharacteristicValueChanged(event) {
      var value = event.target.value;
      var uuid = parseInt('0x' + event.target.uuid.split('-')[0])
      switch(uuid){
        case (postureSensor0Charact):
          this.t0 = value.getUint16(0, true)
          p_h0.value = (this.t0 / 200) >> 0
          console.log(this.t0)
          console.log(p_h0.value)
          break
        case (postureSensor1Charact):
          this.t1 = value.getUint16(0, true)
          p_h1.value = (this.t1 / 200) >> 0
          break
        case (postureSensor2Charact):
          this.t2 = value.getInt16(0, true)
          p_h2.value = (this.t2 / 200) >> 0
          break
        case (postureSensor3Charact):
          this.t3 = value.getInt16(0, true)
          p_h3.value = (this.t3 / 200) >> 0
          break
        default:
          break
      }
      this.h_data.data = [p_h0, p_h1, p_h2, p_h3]
      //console.log("[" + p_h0.value + ", " + p_h1.value + ", " +  p_h2.value + ", " +  p_h3.value + "]")
      heatmapInstance.setData(this.h_data)
      //textboxSensors.value = "[" + p_h0.value + ", " + p_h1.value + ", " +  p_h2.value + ", " +  p_h3.value + "]" //Editado por LD

    },
    
    stopBluetoothReading() {
      if(this.bleDevice && this.bleDevice.gatt.connected){
        this.bleDevice.gatt.disconnect()
        this.monitorEnabled = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .heatmapContainerWrapper {
    position: relative;
    width:100%;
    padding-bottom: 90%;
    height: 0;
    margin:auto;
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

</style>
