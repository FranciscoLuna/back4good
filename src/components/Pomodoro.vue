<template>
<div id="pomodoro-app">
  <div id="container">
    <div id="timer">
      <md-progress-spinner md-mode="determinate" :md-value="remainingPercentage" :md-diameter="120" :md-stroke="60">Hola</md-progress-spinner>
      <div id="time">
        <span id="minutes">{{strMinutes}}</span>
        <span id="colon">:</span>
        <span id="seconds">{{strSeconds}}</span>
      </div>
    </div>
    <div id="buttons">

      <div id="timer-events">
      <small>Pomodoro steps</small>
      <md-button class="md-icon-button md-raised md-primary" id="work" v-on:click="this.startWork">
         <md-icon>airline_seat_recline_normal</md-icon>
      </md-button>
      <md-button class="md-icon-button md-raised md-primary" id="shortBreak" v-on:click="this.startShortBreak">
        <md-icon>replay_5</md-icon>
      </md-button>
      <md-button class="md-icon-button md-raised md-primary" id="longBreak" v-on:click="this.startLongBreak">
        <md-icon>replay_10</md-icon>
      </md-button>
      </div>
      <div id="time-actions" v-show="started">
      <small>Time actions</small>
      <md-button v-show="paused" class="md-icon-button md-raised md-primary" id="resume" v-on:click="this.resumeTimer">
        <md-icon>play_arrow</md-icon>
      </md-button>
      <md-button v-show="!paused" class="md-icon-button md-raised md-primary" id="pause" v-on:click="this.pauseTimer">
        <md-icon>pause</md-icon>
      </md-button>
      <md-button class="md-icon-button md-raised md-primary" id="stop" v-on:click="this.stopTimer">
        <md-icon>stop</md-icon>
      </md-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: "PomodoroTimer",
  data: () => ({
    totalSeconds : 0,
    remainingSeconds: 0,
    remainingPercentage : 100,
    started : false,
    paused: false,
    minutes : 0,
    seconds : 0,
    strMinutes: "00",
    strSeconds: "00",
    timer: null,
  }),
  methods : {
    updateTimerView () {
      this.remainingSeconds = this.minutes*60 + this.seconds
      this.remainingPercentage = Math.round((this.remainingSeconds/this.totalSeconds)*100)
      console.log(this.remainingSeconds)
      console.log(this.remainingPercentage)
      this.strMinutes = this.minutes > 9 ? this.minutes : ("0" + this.minutes)
      this.strSeconds = this.seconds > 9 ? this.seconds : ("0" + this.seconds)
    },
    resetVariables (mins, secs){
      this.minutes = mins
      this.seconds = secs
      this.totalSeconds = mins*60 + secs
      this.updateTimerView()
      this.started = true
    },
    startWork () {
      this.resetVariables(25, 0)
      this.timer = setInterval(this.regresiveCount, 1000)
    },
    startShortBreak (){
      this.resetVariables(5, 0)
      this.timer = setInterval(this.regresiveCount, 1000)
    },
    startLongBreak (){
      this.resetVariables(10, 0);
      this.timer = setInterval(this.regresiveCount, 1000)
    },
    stopTimer (){
      this.resetVariables(0, 0)
      this.timerComplete()
    },
    pauseTimer () {
      clearInterval(this.timer)
      this.paused = true
    },
    resumeTimer () {
      this.timer = setInterval(this.regresiveCount, 1000)
      this.paused = false
    },
    regresiveCount (){
      console.log(this.minutes + ":" + this.seconds)
      if(this.seconds == 0) {
        if(this.minutes == 0) {
          this.timerComplete()
          return
        }
        this.seconds = 59
        this.minutes--
      } else {
        this.seconds--
      }
      this.updateTimerView()
    },
    timerComplete (){
      this.started = false
      clearInterval(this.timer)
    }
  }
}
</script>

<style>

small {
    display: block;
}
#container{

  width:200px;
  margin:20px auto;
  padding:20px;
  text-align:center;
}

#timer{ 
  color:rgb(14, 2, 53); 
  font-size:50px; 
  margin:10px auto;
  height:190px;
  overflow:hidden;
  position:relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor:default;
}

#time{
  margin-top:20px;
  z-index : 1;
  position:relative;
}

#work{
  background : rgb(11, 84, 231);
}

#shortBreak{
  background : #0c0;
}

#longBreak{
  background : #080;
}

#stop{
  background : #f00;
}

#pause{
  background : rgb(255, 187, 0);
}

#timer-events{
  margin-bottom:20px;
}


</style>