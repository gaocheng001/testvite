<template>
  <Tabs tabPosition="left" type="card" size="small" :tabBarGutter="0" v-model:activeKey="activeKey">
    <TabPane
      key="1"
      tab="标准模式"
      :style="activeKey == '1' ? { height: windowHeight - 285 + 'px' } : {}"
    >
      <Month />
    </TabPane>
    <TabPane
      key="2"
      tab="按天显示"
      :style="activeKey == '2' ? { height: windowHeight - 285 + 'px' } : {}"
    >
      <Day />
    </TabPane>
  </Tabs>
</template>
<script setup>
  import { ref } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import Month from './content/Month/index.vue';
  import Day from './content/Day/index.vue';
  const TabPane = Tabs.TabPane;
  const activeKey = ref('1');
  const windowHeight = document.documentElement.clientHeight;
</script>
