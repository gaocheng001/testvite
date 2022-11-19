<template>
  <div v-show="isShow" style="position:fixed;width:600px;height:70%;right:0;bottom:0" class="bg-gray-700 fixed ">
  <div style="float:right">
    <Button @click="abc()">关闭</Button>
    <Checkbox @click="dd()">不再显示</Checkbox>

  </div>
    <Form style="color:white;margin-top:50px;padding:20px">
      <Item style="color:white">注意几点：</Item>
      <Item style="color:white">所有业务,用户Id，取开发账号中的几个用户</Item>
      <Item style="color:white">回滚表，由分表完成，暂时停止写回滚表</Item>
      <Item style="color:white">日志功能</Item>
      <Item style="color:white">任务管理</Item>
      <Item style="color:white">准备集成表单设计，简写增加，修改弹出框</Item>
    </Form>
  </div>
</template>
<script setup>
import {Form,Button,Checkbox} from 'ant-design-vue'
const Item=Form.Item
import {ref} from 'vue';
let isShowTz=window.localStorage.getItem('isShowTz')
if(isShowTz==null){
  isShowTz=true
}else{
  isShowTz=false
}
const isShow=ref(isShowTz)
function dd(){
  window.localStorage.setItem('isShowTz','false')
}
function abc(){

  isShow.value=false
}
</script>
