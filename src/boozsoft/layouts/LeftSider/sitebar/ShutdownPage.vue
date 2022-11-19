<template>
<div style="position: fixed;left:0;top:0;width:100%;height:100%;background:#7cb4fd">
  <div style="position: absolute;z-index:-1;width:100%;height:100%;" @click="emit('close')"> </div>
  <div class="menu2" style="display: flex">
    <div>
      <img src="../../../../assets/svg/system_option/app2.svg" style="margin:-1px auto 0;width: 55px;"/>
      <span>锁定</span>
    </div>

    <div @click="logout()">
      <img src="../../../../assets/svg/system_option/app2.svg" style="margin:-1px auto 0;width: 55px;"/>
      <span>注销</span>
    </div>
    <div @click="reload()">
      <img src="../../../../assets/svg/system_option/app2.svg" style="margin:-1px auto 0;width: 55px;"/>
      <span>重启</span>
    </div>

    <div @click="exitSystem()">
      <img src="../../../../assets/svg/system_option/app2.svg" style="margin:-1px auto 0;width: 55px;"/>
      <span>退出系统</span>
    </div>
  </div>
  <div style="position: absolute;bottom:10px;text-align: center;width:100%">$$查看活动监视器</div>
</div>
</template>
<script setup>
import {useUserStore} from "/@/store/modules/user";

const emit=defineEmits(['close'])


function backFun(){
  console.log(1)
}

function exitSystem(){
  window.close()
}

function logout() {
  useUserStore().logout(true)
}

function reload(){
  window.location.reload()
}
</script>
<style scoped>
.menu2{
  width:400px;
  position: absolute;
  left:calc((100% - 400px) / 2);
  top:calc((100% - 100px - 5%) / 2)
}
.menu2 div{
  padding-top:10px;
  width:100px;
  height:100px;
  /*border:solid 1px black;*/
  text-align: center;
  cursor: pointer;
}

.menu2 span{
  display: block;
  margin-top:10px;
  color:white;
}
</style>
