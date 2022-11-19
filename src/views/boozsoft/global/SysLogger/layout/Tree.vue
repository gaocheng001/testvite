<template>
  <div style="width: 300px">
    <Tabs type="card" size="small" :tabBarGutter="0" v-model:activeKey="activeKey">
      <TabPane
        key="1"
        tab="按月显示"
        :style="activeKey == '1' ? { height: windowHeight - 285 + 'px' } : {}"
      >
        <div style="text-align: center; height: 50px; background-color: #f1f1f1"></div>
        <Type1 />
      </TabPane>
      <TabPane
        key="2"
        tab="按天显示"
        :style="activeKey == '2' ? { height: windowHeight - 285 + 'px' } : {}"
      >
        <div style="text-align: center; height: 50px; line-height: 50px; background-color: #f1f1f1">
          <span>2022年</span>
          <Select style="width: 80px; text-align: center" @change="monthChange">
            <Option v-for="i in showYearList" :value="i">{{ i }}月</Option>
          </Select>
        </div>
        <Type2 />
      </TabPane>
    </Tabs>
  </div>
</template>

<script setup>
  import { Select, Tabs } from 'ant-design-vue';
  import Type1 from './Tree/components/Type1.vue';
  import Type2 from './Tree/components/Type2.vue';
  import { ref } from 'vue';

  const Option = Select.Option;
  const windowHeight = document.documentElement.clientHeight;
  const showYearList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const activeKey = ref('1');
  function monthChange() {}
  const TabPane = Tabs.TabPane;
</script>
