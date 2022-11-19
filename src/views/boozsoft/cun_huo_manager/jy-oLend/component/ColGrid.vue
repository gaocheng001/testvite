<template>
  <slot v-if="visible"></slot>
  <div @click="clickFun" style="width:100%;height:20px;" v-else>
    {{props.label}}
  </div>
</template>
<script setup>
import {provide, ref} from 'vue'
const props=defineProps(['visible','label','record'])
const emits = defineEmits(['update:visible'])
const visible=ref(false)
function clickFun(){
  visible.value=true
  emits('update:visible',true)
}
function setGridVisible(bol){
  visible.value=bol
}
function getRecord(){
  return props.record
}

function setRecord(obj){
  Object.assign(props.record,obj)
}


provide('setGridVisible',setGridVisible)
provide('getRecord',getRecord)
provide('setRecord',setRecord)
</script>
<style>
</style>
