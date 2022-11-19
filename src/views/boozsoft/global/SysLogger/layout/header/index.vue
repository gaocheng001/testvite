<template>
  <div class="app-container-head" style="background: none !important">
    <img :src="getThisIndexImg()" class="container-head-img" draggable="false" />
    <div
      class="container-head-title"
      style="position: absolute; left: calc((100% - 100px) / 2); top: 10px"
      ><b class="noneSpan">日志档案</b></div
    >
    <Bottom />
    <Top />
    <div style="position: absolute; bottom: 5px; left: 12px; width: 550px">
      <AccountPicker theme="one" @reloadTable="recordData.dynamicAdReload" />
    </div>
  </div>
</template>
<script setup>
  import { getThisIndexImg } from '/@/api/task-api/tast-bus-api';
  import { provide, inject } from 'vue';
  import { SettingFilled, SyncOutlined, PieChartFilled } from '@ant-design/icons-vue';
  import { Popover, Button } from 'ant-design-vue';
  import Top from './components/Top.vue';
  import Bottom from './components/Bottom.vue';

  const recordData = inject('recordData');

  provide('recordData', recordData);

  import AccountPicker from '/@/boozsoft/components/AccountPicker/AccountPicker.vue';
</script>
