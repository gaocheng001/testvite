<template>
  <BasicModal width="600px"
              v-bind="$attrs"
              :title="formItems.id==''?'新增':'编辑'"
              @ok="handleOk()"
              @register="register">
      <div class="nc-open-content" style="height: 100%">
          <div class="open-content-up">
            <div v-if="formItems.type==='TYPE'" style="padding: 20px 10px">
              <span><span style="color: red">*</span>凭证字：</span>
              <a-input v-model:value="formItems.voucherTypeCode" />
              <span>&emsp;&emsp;<span style="color: red">*</span>凭证类型：</span>
              <a-input v-model:value="formItems.voucherTypeName" /><br/><br/>
              <span>限制类型：</span>
              <a-select v-model:value="formItems.limitClass" style="width: 50%">
                <a-select-option value="无限制">
                  无限制
                </a-select-option>
                <a-select-option value="借方必有">
                  借方必有
                </a-select-option>
                <a-select-option value="贷方必有">
                  贷方必有
                </a-select-option>
                <a-select-option value="借方必无">
                  借方必无
                </a-select-option>
                <a-select-option value="贷方必无">
                  贷方必无
                </a-select-option>
                <a-select-option value="凭证必有">
                  凭证必有
                </a-select-option>
                <a-select-option value="凭证必无">
                  凭证必无
                </a-select-option>
              </a-select><br/><br/>
              <span>限制科目：</span>
              <a-select
                mode="tags"
                size="default"
                v-model:value="keMuValues"
                :disabled="formItems.limitClass=='无限制'"
                style="width: 85%"
              >
                <a-select-option v-for="item in keMuList" :key="item.id" :value="item.ccode" >{{item.ccode}} {{item.ccodeName}}</a-select-option>
              </a-select>
            </div>
            <div v-if="formItems.type==='AI'" style="padding: 20px 10px">
              <span><span style="color: red">*</span>账户名称：</span>
              <a-input v-model:value="formItems.corpBankName" style="width: 180px" />
              <span>&emsp;<span style="color: red">*</span>对应科目：</span>
              <a-select
                show-search
                option-filter-prop="children"
                :filter-option="filterKeMuOption"
                v-model:value="formItems.ccode"
                style="width: 180px"
              >
                <a-select-option v-for="item in (keMuList || [])" :key="item.id" :value="item.ccode">{{item.ccode}} {{item.ccodeName}}</a-select-option>
              </a-select><br/><br/>
              <span>开户机构：</span>
              <a-input v-model:value="formItems.beiyong1"  style="width: 82%" /><br/><br/>
              <span>开户地&emsp;：</span>
              <a-input v-model:value="formItems.beiyong2"  style="width: 82%" /><br/><br/>
              <span>账&emsp;户&emsp;：</span>
              <a-input v-model:value="formItems.beiyong3"   style="width: 82%"/>
            </div>
            <div v-if="formItems.type==='JS'" style="padding: 20px 10px">
              <span><span style="color: red">*</span>结算方式编码：</span>
              <a-input v-model:value="formItems.settModesCode" style="width: 120px" />
              <span>&emsp;<span style="color: red">*</span>结算方式名称：</span>
              <a-input v-model:value="formItems.settModesName" style="width: 180px" /><br/><br/>
              <span>默认账户：</span>
              <a-select
                show-search
                option-filter-prop="children"
                :filter-option="filterKeMuOption"
                v-model:value="formItems.beiyong1"
                style="width: 82%"
              >
                <a-select-option v-for="item in (keMuList || [])" :key="item.id" :value="item.corpBankName">{{item.corpBankName}}</a-select-option>
              </a-select><br/><br/>
              <span>说&emsp;明&emsp;：</span>
              <a-input v-model:value="formItems.beiyong2"   style="width: 82%"/>
            </div>
          </div>
          <div class="open-content-down"></div>
      </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import { ref, unref,  onMounted } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { PageWrapper } from '/@/components/Page';
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput,
  Checkbox as ACheckbox,
  Popover as APopover,
  Switch as ASwitch,
  Radio as ARadio,
  Upload as AUpload,
  Table as ATable,
  Tabs as ATabs,
  message,
} from 'ant-design-vue';
import CheckboxGroup from 'ant-design-vue/lib/checkbox/Group';
import { useTabs } from '/@/hooks/web/useTabs';
import router from '/@/router';
import { Moment } from 'moment';
import {findAllMJList, findAllXjOrLlList, saveVoucherData} from "/@/api/record/system/financial-settings";

const { closeCurrent } = useTabs(router);
const ARangePicker = ADatePicker.RangePicker;
const ASelectOption = ASelect.Option;
const AInputSearch = AInput.Search;
const ARadioGroup = ARadio.Group;
const ARadioButton = ARadio.Button;
const ACheckboxGroup = ACheckbox.Group;
const emit=defineEmits(['register']);
const formItems: any = ref({});
const keMuList = ref([])
const keMuValues = ref([])
const [register, { closeModal, setModalProps }] = useModalInner((data) => {
  // 方式2
  formItems.value = data.data
  setModalProps({ minHeight: 300 });
  if (formItems.value.type == 'TYPE'){
      findAllMJList({}).then(res=>{
        keMuList.value = res
      })
      if (null == formItems.value.limitClass  || formItems.value.limitClass == '' )formItems.value.limitClass='无限制'
      if (null != formItems.value.limitKemu  && formItems.value.limitKemu != '' ){
        keMuValues.value = formItems.value.limitKemu.trim().split(",")
      }
  }else if(formItems.value.type == 'AI'){
    findAllXjOrLlList({}).then(res=>{
      keMuList.value =  res.filter(item=> item.bend == '1')
    })
  }else if(formItems.value.type == 'JS'){
    keMuList.value = formItems.value.list
    formItems.value.list = []
  }
});


async function handleOk() {
  if (formItems.value.type == 'TYPE'){
    if (formItems.value.voucherTypeCode == '' || formItems.value.voucherTypeName == ''){
      message.error('凭证字与凭证类型为必填项！')
      return false
    }
    if (keMuValues.value.length > 0){
      let strs = ''
      keMuValues.value.filter(value => {
        strs+=(value+',')
      })
      strs= strs.substring(0,strs.length-1)
      formItems.value.limitKemu = strs.trim()
    }
  }else if(formItems.value.type == 'AI'){
    if (formItems.value.corpBankName == '' || formItems.value.ccode == ''){
      message.error('账户名称与对应科目为必填项！')
      return false
    }
    if (keMuList.value.filter(item=>item.ccode==formItems.value.ccode)[0].bbank == '1')formItems.value.ibank = '1'
  }else if(formItems.value.type == 'JS'){
    if (formItems.value.settModesCode == '' || formItems.value.settModesName == ''){
      message.error('结算方式编码与名称必填项！')
      return false
    }
  }
  emit('save', unref(formItems));
  closeModal();
  return true;
}
async function handleClose() {
}
const filterKeMuOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
</script>
<style lang="less" scoped>
.vben-basic-title {
  color: rgb(1, 129, 226) !important;
}
.ant-modal-body {
  padding: 0px;
  border: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
}

.nc-open-content {
  .ant-input {
    width: 35%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }
  .ant-input:focus {
    box-shadow: none;
  }
  .ant-select-selector {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }
  label {
    text-align: right;
    width: 110px;
    display: inline-block;
    padding: 5px 10px;
  }
  .open-content-down {
    margin-top: 5%;
    .ant-tabs-tab-active::before {
      position: absolute;
      top: 0px;
      left: 0;
      width: 100%;
      border-top: 2px solid transparent;
      border-radius: 2px 2px 0 0;
      transition: all 0.3s;
      content: '';
      pointer-events: none;
      background-color: rgb(1, 143, 251);
    }
  }
}
</style>
