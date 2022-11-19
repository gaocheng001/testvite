<template>
  <BasicModal
    width="700px"
    v-bind="$attrs"
    title="账套信息"
    @ok="handleOk"
    @register="register"
  >
    <div style="margin: 2% 5% 0%;text-align: center">
      <span>模糊过滤: &emsp;</span>
      <a-input-search
        @search="fiterTable"
        style="width: 160px;border-radius: 4px"
      />
      <BasicTable
        :row-selection="{ type: 'radio',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
        @row-dbClick="handleOk"
        @row-click="onSelectChange"
        :pagination="false"
        :rowKey='record=>record.coCode'
        :columns="[
          {title: '公司代码',dataIndex: 'coCode',width: '150px'},
          {title: '公司简称',dataIndex: 'accNameCn',width: '300px'},
          ]"
        :data-source="tableData"
        :scroll="{ y: 400 }"
        size="small"
      >
        <template #serialNumber="{record,index }">
          <span slot="serialNumber" slot-scope="text,record,index">
           {{index+1}}
          </span>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import {ref, unref} from 'vue'
import { BasicTable } from '/@/components/Table'
import {BasicModal, useModalInner} from '/@/components/Modal'
import {
  Input as AInput,
} from "ant-design-vue"
import {hasBlank, pointMessage} from "/@/api/task-api/tast-bus-api";
const AInputSearch = AInput.Search
const emit = defineEmits(['register','modify'])

const tableSelectedRowKeys = ref([])
const oldTableData=ref([])
const tableData=ref([])
const [register, {closeModal}] = useModalInner((data) => {
  /*for (let index=0;index<50;index++) {
    let d = {key: index,coCode:index+'1',accNameCn: '名字'+index}
    tableData.value.push(d)
  }*/
  tableData.value =  data.data.accAuthList
  oldTableData.value = unref(tableData.value)
})
const handleOk = async (obj) => {
  if (hasBlank(obj)){
    if (tableSelectedRowKeys.value.length === 0){
      await pointMessage({title: '温馨提示', content: '请先选择数据！',delay: true})
      return
    }else {
      obj = {coCode: tableSelectedRowKeys.value[0]}
    }
  }
  emit('modify', unref(obj['coCode']))
  closeModal()
  return true
}

const onSelectChange = (selectedRowKeys) => {
  if (Array.isArray(selectedRowKeys)){
    tableSelectedRowKeys.value = selectedRowKeys;
  }else {
    tableSelectedRowKeys.value = [selectedRowKeys.coCode];
  }
}
const fiterTable = (value) => {
  tableData.value = []
  if(hasBlank(value)){
    tableData.value = oldTableData.value
  }else {
  tableData.value = oldTableData.value.filter(item=>item.coCode.indexOf(value) != -1 || item.accNameCn.indexOf(value) != -1)
  }
}
</script>
<style lang="less" scoped>
:deep(.ant-calendar-picker-input.ant-input), :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
}


:deep(.ant-upload-list-text){
  width: 68%;
  float: right;
  display: inline-block;
}
</style>
