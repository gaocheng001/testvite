<template>
  <div>

    <div
      class="ant-btn-group"
      data-v-a1ccd506=""
      style="float: right; position: absolute; right: 0; bottom: 10px"
    >
      <div
        class="app-container-neck"
        style="
          float: right;
          margin-left: 10px;
          position: absolute;
          right: 10px;
          bottom: 0px;
          width: 200px;
        "
      >
        <div style="float: right; margin-left: 10px">
          <Button @click="recordData.reload">
            <SyncOutlined :style="{ fontSize: '14px' }" />
          </Button>
          <Popover v-if="recordData.activeKey" placement="bottom">
            <template #content></template>
            <Button>
              <SettingFilled :style="{ fontSize: '14px' }" />
            </Button>
          </Popover>
          <Button @click="recordData.activeKey = !recordData.activeKey">
            <PieChartFilled :style="{ fontSize: '14px' }" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { inject } from 'vue';
  import { SettingFilled, SyncOutlined, PieChartFilled } from '@ant-design/icons-vue';
  import { Popover, Button } from 'ant-design-vue';
  const recordData = inject('recordData');
</script>
