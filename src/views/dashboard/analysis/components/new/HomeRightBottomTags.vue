<template>
  <div class="nc-hr-tags">
    <a-tabs type="card" v-model:activeKey="activeKey" tabPosition="top" :tabBarGutter="0">
      <a-tab-pane key="1" tab="即时状态">

      </a-tab-pane>
      <a-tab-pane key="2" tab="登录日志">Content of Tab Pane 2</a-tab-pane>
      <a-tab-pane key="3" tab="备份情况">Content of Tab Pane 3</a-tab-pane>
      <template #tabBarExtraContent>
        <span><BarChartOutlined /><span>系统仪表盘</span> 即时登录状态</span>
      </template>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import {BarChartOutlined} from '@ant-design/icons-vue';
import {
  message,
  Input as AInput,
  Select as ASelect,
  Tabs as ATabs
} from "ant-design-vue";
import {ref} from "vue";
import router from "/@/router";
const ATabPane = ATabs.TabPane
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const activeKey = ref('1')
</script>
<style lang="less" scoped>
.nc-hr-tags{
  background-color: white;
  height: 100%;
  :deep(.ant-tabs){
    border: 1px solid #c1bebe;
   .ant-tabs-tabpane {
      div:nth-of-type(1){
        width: 70%;
        height: 250px;
        background-color: #b4c8e3;
      }
    }
  }
  :deep(.ant-tabs-nav-scroll){
    text-align: right;
  }
  :deep(.ant-tabs-extra-content){
    float: left !important;
    color: #545454;
    span{
      font-weight: bold;
      margin: 0 5px;
      >span{
        font-size: 18px;
      }
    }
  }

}

</style>
