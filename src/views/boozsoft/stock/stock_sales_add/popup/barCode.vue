<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    :closable="false"
    @register="register"
    @ok="handleOk()"
    @cancel="handleClose()"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">条码录入框</span>
      </div>
    </template>
    <div style="width: 100%;padding: 5%;">
    <div  style="margin-top: 5%;"><span style="font-weight: bold;color: #666666;">条码方案：</span><Select default-value="1">
      <SelectOption value="1">条形码/存货编码/GS1码/MA码</SelectOption>
    </Select>
    </div>
      <div style="margin-top: 5%;">
        <TextArea placeholder="条形码扫描录入框"/>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {AppstoreOutlined} from '@ant-design/icons-vue'
import {ref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  Input ,
  Select,
   message
} from 'ant-design-vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
const { createConfirm } = useMessage()
  const SelectOption = Select.Option;
  const TextArea = Input.TextArea;
  const emit=defineEmits(['register','modify']);
  const formItems:any = ref({})
  const [register, { closeModal,setModalProps }] = useModalInner( async (data) => {
    setModalProps({minHeight: 200});
  });
  function handleClose() {
        return true;
  }
async function handleOk() {

  emit('throwData', {})
  closeModal()
  return true;
}
</script>
<style lang="less" scoped>
:deep(.ant-checkbox){
  margin-top: -8px;
}

:deep(.ant-select-selector) {
  border: none !important;
  border-bottom: 1px solid #bdb9b9 !important;
  background: none;
  width: 80%;
  text-align-last: center;
  .ant-select-selection-item{
    font-weight: bold;color: black;
  }
}

:deep(.ant-input){
  border: 1px solid;
}

:deep(.ant-input)::placeholder{
  font-weight: bold;
  font-size: 28px;
}

.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;
}

:global(.ant-modal-header) {
  padding: 10px 0 !important;
}

:global(.ant-modal-close-x){
  height: 30px !important;
  color: white;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 600;
}
</style>
