<template>
  <div class="app-container" style="margin-top:0;background:none !important;">
    <div style="position:relative;margin-bottom:10px;  padding:10px;  background: rgb(241, 241, 241);height:97px;border-radius: 10px;">
      <div class="app-container-head" style="background: none !important">
        <img :src="getThisIndexImg()" class="container-head-img" draggable="false">
        <div class="container-head-title"><b class="noneSpan">日志档案</b></div>
        <div class="ant-btn-group" data-v-a1ccd506="" style="float: right">
          <template v-for="it in recordData.arr">
            <button v-if="it.enable"
                    @click="it.fun"
                    class="ant-btn ant-btn-me" v-text="it.label"/>
          </template>
        </div>
        <div style="position:absolute;bottom:5px;left:12px;width:450px">
          <AccountPicker theme="one" @reloadTable="recordData.dynamicAdReload"/>
        </div>
      </div>
      <div class="app-container-neck">
        <div style="float: right; margin-left: 10px">
          <Button @click="recordData.reload">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Popover v-if="recordData.activeKey" placement="bottom">
            <template #content></template>
            <Button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
          <Button @click="recordData.activeKey = !recordData.activeKey">
            <PieChartFilled :style="{ fontSize: '14px' }"/>
          </Button>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">

import {inject} from 'vue'
import {
  SettingFilled,
  SyncOutlined,
  PieChartFilled
} from '@ant-design/icons-vue';
import {Popover, Button} from 'ant-design-vue'
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
const recordData = inject('recordData')
import {getThisIndexImg} from '/@/api/task-api/tast-bus-api';

</script>
<style scope
       src="../../../assets/styles/generate-code-record-style/record.less"
       lang="less">
</style>
