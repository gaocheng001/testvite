<template>
  <div class="showPromissSiteBar" @click="SystemOption.showOpenButton()">
    <span style="transform: scale(1, 1.5); display: inline-block" v-html="'<'"> </span>
  </div>
</template>
<script setup>
import {provide,inject} from "vue";

const SystemOption=inject('SystemOption')
</script>
<style scoped>
.showPromissSiteBar {
  height: 40px;
  width: 22px;
  padding: 9px 0px 0px 7px;
  box-sizing: border-box;
  position: absolute;
  right: 0px;
  top: calc((100% - 0px) / 2 - 100px);
  opacity: 3.5;
  background: rgba(229, 229, 229, 0.5);
  color: black;
  cursor: pointer;
  border-radius: 0px 5px 5px 0px;
  font-size: 10px;
}
</style>
