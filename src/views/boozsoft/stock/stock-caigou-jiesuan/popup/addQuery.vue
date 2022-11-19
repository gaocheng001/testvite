<template>
  <BasicModal width="1000px"
              :height="500"
              v-bind="$attrs"
              :title="''"
              :maskClosable="false"
              :draggable="false"
              @ok="handleOk()"
              @cancel="handleClose()"
              @register="register">
    <template #title>
      <div style="display: flex;margin-left: 10px;margin-top: 5px;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;color: rgb(21, 142, 184)"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;color: rgb(21, 142, 184)">手动结算</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      123123
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {reactive, ref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {SearchOutlined,CaretDownOutlined} from '@ant-design/icons-vue';
import { Select as ASelect,Button, DatePicker, InputNumber, message, Radio,Popconfirm} from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import dayjs from "dayjs";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
const ARangePicker=DatePicker.RangePicker
const RangePicker = DatePicker.RangePicker;
const SelectOption = ASelect.Option;
const RadioGroup = Radio.Group;
const emit = defineEmits(['register', 'query']);
const formItems = ref({
  openOne: 0
})

const filterOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {

});
async function handleOk() {
  emit('throwData', {})
  closeModal()
  return true;
}
const {closeCurrent} = useTabs(router);
async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1)
    await closeCurrent()
  closeModal()
}
</script>
<style lang="less" scoped="scoped">
@import '/@/assets/styles/part-open.less';
@import '/@/assets/styles/alone-basic-table.less';

.nc-query-open-content {
  padding: 1%;
  height: 100%;

  .content-head {
    text-align: left;
    margin-bottom: 1em;
  }
}
</style>
