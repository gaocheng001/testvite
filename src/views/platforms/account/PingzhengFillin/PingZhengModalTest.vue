<template>
  <PingzhengIndex @register="registerPingZhengModal"></PingzhengIndex>
</template>
<script setup>
// import PingzhengIndex from '/@/components/pingzheng-fillin/index.vue'
import {createApp, onMounted,ref} from "vue";
// import {usePingZhengModal} from "/@/components/pingzheng-fillin/components/Modal/usePingzhengModal";
const pingzhengModalContainerRef = ref()


const usePingZhengModal=null
const {registerPingZhengModal,openPingzhengModal} = usePingZhengModal(pingzhengModalContainerRef)

function openInsertPingZheng(){
  const apiData=[]
  openPingzhengModal(apiData)
}

onMounted(()=>{
  setTimeout(()=>{
    openInsertPingZheng()
  },2000)
})
</script>
