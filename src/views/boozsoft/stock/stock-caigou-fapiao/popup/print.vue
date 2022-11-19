<template>
  <BasicModal
    v-bind="$attrs"
    width="650px"
    @ok="handleOk()"
    :canFullscreen="false"
    :footer="null"
    @register="register"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 13px">采购管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <PrinterOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;采购发票</span>
        </div>
        <div
          class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span style="color: #5a5a5a">业务范围</span>
              <AccountPicker  theme="three" @reloadTable="dynamicAdReload"/>
            </div>
            <div class="border-div">
              <span style="color: #5a5a5a">打印条件</span>
              <div style="margin-left: 14px;">
                <label style="font-weight: bold;color: #5a5a5a;">打印模板：</label>
                &nbsp;
                <a-select
                  v-model:value="formItems.printType"
                  show-search
                  style="width: 277px;text-align: center;"
                >
                  <a-select-option value="1" >A4横向</a-select-option>
                  <a-select-option value="2" >二等分</a-select-option>
                  <a-select-option value="3" >三等分</a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                <p/>
                <label style="font-weight: bold;color: #5a5a5a;">纸张大小：</label>
                &nbsp;
                <a-select
                  v-model:value="formItems.printSize"
                  show-search
                  style="width: 277px;text-align: center;"
                >
                  <a-select-option value="1" >A4</a-select-option>
                  <a-select-option value="2" >二等分</a-select-option>
                  <a-select-option value="3" >三等分</a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
                <p/>
                <label style="font-weight: bold;color: #5a5a5a;">纸张方向：</label>
                &nbsp;
                <a-select
                  v-model:value="formItems.printDirection"
                  show-search
                  style="width: 277px;text-align: center;"
                >
                  <a-select-option value="1" >横向</a-select-option>
                  <a-select-option value="2" >纵向</a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                </a-select>
              </div>
            </div>
            <div class="border-div">
              <span style="color: #5a5a5a">表尾打印</span>
              <div style="margin-left: 14px;">
                <a-checkbox v-model:checked="formItems.printUser" style="width: 130px"> 打印制表人 </a-checkbox>
                <a-checkbox v-model:checked="formItems.bcheck" style="width: 130px"> 打印审核人 </a-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-btns">
        <a-button style="width: 100px;" shape="round" @click="handleOk"  type="primary">打印</a-button>
        <a-button style="width: 100px;margin-top: 10px" shape="round" @click="handleClose">取消</a-button>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup="props, { content }">
import {ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  Select as ASelect,
  Checkbox as ACheckbox,
  Input as AInput,
  Radio as ARadio,
  Tabs as ATabs
} from 'ant-design-vue';
import {AppstoreOutlined, PrinterOutlined,CaretDownOutlined} from '@ant-design/icons-vue'

import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";

const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const ARadioGroup = ARadio.Group;
const ARadioButton = ARadio.Button;
const ACheckboxGroup = ACheckbox.Group;
const ATabPane = ATabs.TabPane;
const emit = defineEmits(['register', 'save']);
const formItems: any = ref({});
// 数据库模式名称
const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)
const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  formItems.value.printUser = true
  formItems.value.printDirection = '1'
  formItems.value.printSize = '1'
  formItems.value.printType = '1'
});

async function handleOk() {
  emit('save', unref(formItems));
  closeModal();
  return true;
}
function handleClose() {
  closeModal();
}
async function dynamicAdReload(data) {
  defaultAdName.value = data.accId
  dynamicTenantId.value = data.accountMode
}
</script>
<style lang="less" scoped>
:deep(.ant-checkbox){
  margin-top: -8px;
}
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;
  :deep(.ant-input),:deep(.ant-select-selector), :deep(.ant-input-affix-wrapper) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    background: none;
  }
  .border-div {
    position: relative;
    border: 1px #a29f9f solid;
    margin: 20px 10px;
    padding: 2.5%;

    > span {
      display: block;
      width: 80px;
      text-align: center;
      background-color: white;
      position: absolute;
      left: 50px;
      top: -10px;
      color: #888888;
      font-size: 12px;
      font-weight: bold;
    }
    :deep(.account-picker){
      >div{
        text-align: left;
      }
    }
  }
}

.right-btns{
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 360px;
  :deep(.ant-btn-primary:hover){
    border: 1px solid #5f375c;
  }
}
:global(.ant-modal-header) {
  padding: 10px 0 !important;
}
:global(.ant-modal-close-x){
  height: 30px !important;
  color: white;
}
</style>
