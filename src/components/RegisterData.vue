<template>
  <div class="monitorSection">
    <md-empty-state v-if="!this.monitorEnabled"
      md-icon="event_seat"
      md-label="Conecta tu Back4Good Sensor"
      md-description="No se ha conectado aún nigún Back4Good Sensor">
      <md-button id="syncButton" v-on:click="listBluethoothDevices" class="md-primary md-raised">Conectar dispositivo</md-button>
      <md-button class="md-accent md-raised">Obtener un Back4Good Sensor</md-button>
    </md-empty-state>

    <md-empty-state v-else
      md-label="Monitorizando tu postura"
      md-description="El color representa la fuerza ejercida. Procura que sea equilibrada.">
      <div id='heatmapContainerWrapper' class='heatmapContainerWrapper'>
        <div class='heatmapContainer'></div>
      </div>
      <md-button class="md-accent md-raised" v-on:click="stopBluetoothReading">Parar monitorización</md-button>
      <div class='recording'>
        <h3>Grabación con protocolo</h3>
        <p><b>Parámetros para el nuevo registro:</b></p>
        <label>Nombre de usuario: </label>
        <input v-model="providedData.userName"/>
        <br/>
        
        <!-- <label>Numero de muestras por segundo:</label>
        <input v-model="providedData.samplesPerSecond"/>
        <br/> -->

        <label>Tipo de tarea:</label>
        <select v-model="providedData.taskName">
          <option disabled value=''>Selecciona una tarea</option>
          <option value='A'>A: Postura correcta</option>
          <option value='B'>B: Gluteos hacia delante, espalda superior apoyada en el respaldo</option>
          <option value='C'>C: Espalda separada del respaldo, llevando el torso hacia alante con los brazos de apoyo contra las piernas</option>
          <option value='D_der'>D_der: Ladeado hacia la derecha</option>
          <option value='D_izq'>D_izq: Ladeado hacia la izquierda</option>
          <option value='E_der'>E_der: Pierna derecha cruzada sobre la otra</option>
          <option value='E_izq'>E_izq: Pierna izquierda cruzada sobre la otra</option>
          <option></option>
        </select>
        <br/>
        <label>Tiempo asignado:</label>
        <input v-model="providedData.seconds"/>
        <br/>
        <md-button id='startTask' class='md-accent' v-on:click="protocolRecord()"> Comenzar a registrar tarea</md-button>
        <div v-show="this.recordingEnabled">
          <p>Tomadas {{samplesCount}} de {{samplesRequired}} muestras </p>
          <p> Tiempo transcurrido: {{(time - recordInitTime)/ 1000}}</p>
        </div>
      </div>
    </md-empty-state>
  </div>
</template>

<script>

//const fs = require('fs')
//const { join } = require('path')

//const registeredDataFolder = '../records'


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
    },
    providedData: {
      samplesPerSecond: 5,
      userName: "User",
      protocolFileName: "firstProtocolLong"
    },
    currentTaskData: {
      name: "",
      seconds: 0,
      description: ""
    },
    recordingEnabled: false,
    samplesRequired: 0,
    time: 0,
    updatesCount: 0,
    previousUpdCount: 0,
    samplesCount: 0,
    recordInitTime: 0,
    taskJSON : {
      /*
      username: "",
      protocol: "",
      task: "",
      date: "",
      "Number of samples": "",
      samples: []
      */
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
    listBluethoothDevices () {
      navigator.bluetooth.requestDevice({ filters: [{ services: [sittingPostureService] }] })
      .then(device => {
        this.bleDevice = device
        return device.gatt.connect()
      })
      .then(server => {
        console.log("Connected")
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
    handleCharacteristicValueChanged(event) {
      var value = event.target.value;
      var uuid = parseInt('0x' + event.target.uuid.split('-')[0])
      switch(uuid){
        case (postureSensor0Charact):
          this.t0 = value.getUint16(0, true)
          p_h0.value = (this.t0 / 200) >> 0
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
      if (this.recordingEnabled) {
        this.updatesCount++
      }
      this.h_data.data = [p_h0, p_h1, p_h2, p_h3]
      //console.log("[" + p_h0.value + ", " + p_h1.value + ", " +  p_h2.value + ", " +  p_h3.value + "]")
      heatmapInstance.setData(this.h_data)
    },
    stopBluetoothReading() {
      if(this.bleDevice && this.bleDevice.gatt.connected){
        this.bleDevice.gatt.disconnect()
        this.monitorEnabled = false
      }
    },
    protocolRecord(){

      this.taskJSON.username = this.providedData.userName
      this.taskJSON.protocol = this.providedData.protocolFileName
      
      this.currentTaskData = {
        name: this.providedData.taskName.split(": ")[0],
        seconds: this.providedData.seconds,
        description: this.providedData.taskName.split(": ")[1]
      }

      this.taskJSON.task = this.currentTaskData.name

      this.recordingEnabled = true
        
      this.samplesRequired = this.currentTaskData.seconds*this.providedData.samplesPerSecond
      this.recordInitTime = new Date().getTime()
      this.time = this.recordInitTime
      this.taskJSON.date = this.recordInitTime
      this.taskJSON["Number of samples"] = this.samplesRequired
      
      var intervalEstab = setInterval(_ => {

        if ((this.updatesCount != this.previousUpdCount) && (this.updatesCount % 4 == 0) && (this.updatesCount > 3)) {
          console.log(this.updatesCount)
          this.registerSample()
          this.samplesCount++
          this.previousUpdCount = this.updatesCount
          if (this.samplesCount >= this.samplesRequired) {
            this.recordingEnabled = false
            clearInterval(intervalEstab)

            let taskJSONStr = JSON.stringify(this.taskJSON)

            this.saveFile(taskJSONStr, this.taskJSON.task + '_')

            this.taskJSON.samples = []
            this.updatesCount = 0
            this.samplesCount = 0
            
          }
        }
        else {
          console.log("Count ")
        }
      },20)
    },
    saveFile(dataJSON, taskName) {
      const data = dataJSON
      const blob = new Blob([data], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = taskName + '.json';
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    registerSample() {
      let currentTime = new Date().getTime()
      var currentSample = {
        sample: this.samplesCount,
        "relapse in milliseconds": currentTime - this.time,
        "sensor_1": this.t0, //Modificado
        "sensor_2": this.t1, //Modificado
        "sensor_3": this.t2, //Modificado
        "sensor_4": this.t3, //Modificado
        "class": this.currentTaskData.name //Modificado
      }
      this.taskJSON.samples.push(currentSample)
      this.time = currentTime
    }
  }
}
</script>

<style lang="scss" scoped>

  select {
    width:150px;
  }
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
