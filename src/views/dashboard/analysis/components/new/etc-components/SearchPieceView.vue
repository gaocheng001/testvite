<template>
  <div class="nc-search-piece-view">
<!--
       @row-dbClick="doubleClick"
      @row-click="doubleClick"
  -->
    <BasicTable
      :pagination="false"
      :showIndexColumn="true"
      :rowKey='record=>record.id'
      :columns="[
          {title: '编码',dataIndex: 'code',width: 100,align: 'left',slots: {customRender: 'code'}},
          {title: '名称',dataIndex: 'name',align: 'left',slots: {customRender: 'name'}},
          {title: '查看',dataIndex: 'operate',width: 60,align: 'center',slots: {customRender: 'operate'}}
      ]"
      :data-source="props.data"
      :scroll="{y: 260} "
      class="alone-basic-table"
      size="small">
            <template #operate="{ record }">
              <Button size="small" type="primary" @click="look(record)">  <SearchOutlined/></Button>
            </template>
    </BasicTable>
  </div>
</template>
<script setup lang="ts">
import {SearchOutlined} from '@ant-design/icons-vue';
import {Button} from "ant-design-vue";
import {ref, reactive} from "vue";
import BasicTable from "/@/components/Table/src/BasicTable.vue";

const props = defineProps(['modelValue', 'data'])
const emit = defineEmits(['jump'])
const doubleClick = (e) => {

}
const look = (e) => {
  emit('jump', e)
}
</script>
<style lang="less" scoped>
@import '/@/assets/styles/alone-basic-table.less';
.nc-search-piece-view {
  width: 600px;
  height: 300px;
}
</style>
