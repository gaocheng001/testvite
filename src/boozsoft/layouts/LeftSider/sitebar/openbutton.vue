<template>
  <div tiao ref="tiao" style="width:18px;position:fixed;left:0;top:10px;height:100%;overflow: hidden"
       @mouseleave="onmouseleave"
       @mouseenter="onmouseenter">
    <div  @click="onmouseleave(tiao,true)"  style="cursor:pointer;height: 54px;width: 39px;padding: 11px 0px 0px 6px;box-sizing: border-box;position: fixed;left: 0px;top: calc(((100% - 30px) / 2) - 50px);opacity: 3.5;background: rgb(0 150 199);color: white;/* color: black; */cursor: pointer;border-radius: 0px 5px 5px 0px;font-size: 20px;">
      <HomeOutlined />
    </div>
  </div>
</template>

<script setup>

import {HomeOutlined} from '@ant-design/icons-vue';
import {inject, onMounted, ref} from "vue";
const showOption=inject('showOption')


function onmouseenter(){
  if(showOption.value){
    return
  }
  if(tiao.value!=null){
    tiao.value.style.opacity='1'
  }
}
function onmouseleave (e,imm) {
  if(imm){
    e.style.opacity = '0'
  }

  let dom = e.target
  if (window.widthTimeout != null) {
    window.clearTimeout(window.widthTimeout)
  }
  window.widthTimeout = setTimeout(() => dom.style.opacity = '0', 1000)
}

const tiao=ref()
onMounted(()=>{

  window.widthTimeout = setTimeout(() => {
    tiao.value.style.opacity = '0'
  }, 1000)
})
</script>

<style scoped>

</style>
