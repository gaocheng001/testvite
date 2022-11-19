<template>
  <div style="width:100vw;height:100vh;padding:10vh">
    <Result
      status="500"
      title="服务未启动!"
      sub-title="模块名称：system-gdzc(存货档案，固定资产，应收应付) 服务名称: StockApplication 端口: 8085, 服务未启动或超时，请联系管理员."

    >
      <template #extra>
        <Button key="console" type="primary" @click="repeatApp">重试</Button>
      </template>
    </Result>
  </div>
</template>
<script setup>

import 'ant-design-vue/dist/antd.less';
import { Result, Button } from 'ant-design-vue';
function repeatApp(){
  window.top.location.reload()
}
</script>
