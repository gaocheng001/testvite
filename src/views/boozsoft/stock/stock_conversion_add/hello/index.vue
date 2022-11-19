<template>
  <Button @click="openPingzheng" class="actod-btn">生成测试</Button>
   <div v-if="showPingzheng" style="position: fixed;left:0;top:0;;background: black;width:100vw;z-index: 10000000">
    <PingzhengModal
      @register="registerImportPage"></PingzhengModal>
   </div>
</template>
<script setup>
import { Button } from "ant-design-vue";
import PingzhengModal from './Modal/index.vue';
import {provide,ref} from "vue";
import {useModal} from "/@/components/Modal";


const [registerImportPage, {openModal: openImportPageM}] = useModal()

const showPingzheng=ref(false)

function openPingzheng(){
  showPingzheng.value=true
  openImportPageM()
}
</script>

