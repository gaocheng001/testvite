<template>
  <div style="position: fixed; width: 100%; height: 100%;padding:10px">
    <div class="app-container" style="margin-top: 0;height:100%; background: none !important">
      <div
        style="
          position: relative;
          margin-bottom: 10px;
          padding: 10px;
          background: rgb(241, 241, 241);
          height: 97px;
          border-radius: 4px;
        "
      >
        <Header />
      </div>
      <div style="height: calc(100% - 120px); background: white">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { inject } from 'vue';
  import { SettingFilled, SyncOutlined, PieChartFilled } from '@ant-design/icons-vue';
  import { Popover, Button } from 'ant-design-vue';
  import Header from './header/index.vue';

  const recordData = inject('recordData');
</script>
<style scope src="/@/assets/styles/generate-code-record-style/record.less" lang="less"></style>
