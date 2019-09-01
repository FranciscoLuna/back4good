<template>
  <div class="main">
    <md-empty-state
      md-icon="event_seat"
      md-label="Conecta tu Back4Good Sensor"
      md-description="No se ha conectado aún nigún Back4Good Sensor">
      <md-button id="syncButton" v-on:click="listBluethoothDevices" class="md-primary md-raised">Conectar dispositivo</md-button>
      <md-button class="md-accent md-raised">Obtener un Back4Good Sensor</md-button>
      <div>
          <md-content>{{t1}}</md-content>
          <md-content>{{t2}}</md-content>
          <md-content>{{t3}}</md-content>
          <md-content>{{t4}}</md-content>
        </div>
    </md-empty-state>
  </div>
</template>

<script>

export default {
  name: 'TestBluetooth',
  data: () => ({
    msg: 'Welcome to Test Bluetooth Section',
    t1: 0,
    t2: 0,
    t3: 0,
    t4: 0
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
    listBluethoothDevices () {
      navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
      .then(device => device.gatt.connect())
      .then(server => server.getPrimaryService('heart_rate'))
      .then(service => service.getCharacteristic('heart_rate_measurement'))
      .then(characteristic => characteristic.startNotifications())
      .then(characteristic => {
        characteristic.addEventListener('characteristicvaluechanged',
                                        handleCharacteristicValueChanged);
        console.log('Notifications have been started.');
      })
      .catch(error => { console.log(error); });

      function parseHeartRate(value) {
        // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
        value = value.buffer ? value : new DataView(value);
        let flags = value.getUint8(0);
        let rate16Bits = flags & 0x1;
        let result = {};
        let index = 1;
        if (rate16Bits) {
          result.heartRate = value.getUint16(index, /*littleEndian=*/true);
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
          result.energyExpended = value.getUint16(index, /*littleEndian=*/true);
          index += 2;
        }
        let rrIntervalPresent = flags & 0x10;
        if (rrIntervalPresent) {
          let rrIntervals = [];
          for (; index + 1 < value.byteLength; index += 2) {
            rrIntervals.push(value.getUint16(index, /*littleEndian=*/true));
          }
          result.rrIntervals = rrIntervals;
        }
        return result;
      }
      function handleCharacteristicValueChanged(event) {
        var value = event.target.value;
        console.log('Received ' + parseHeartRate(value).heartRate);
        // TODO: Parse Heart Rate Measurement value.
        // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
      }
      
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
