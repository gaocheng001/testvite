<template>
  <div>账号<input/></div>
  <div>密码<input/></div>
  <button>登陆</button>
  <button>网关登陆</button>
  <button>3秒内无动作，自动跳转到SSO单点登陆</button>
</template>
<script setup>
import {onMounted} from 'vue'
// 根据用户名，密码，校验是否正确
// 返回用户信息
// 返回token
// 返回用户信息
import {loginxxxx} from '/@/api/sys/user';

onMounted(async ()=>{
  const a=await loginxxxx({username:'dev',password:'1'})
  console.log(a)
})
function abc(){
  alert(1)
}
</script>
