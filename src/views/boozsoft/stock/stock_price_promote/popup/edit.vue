<template>
  <BasicModal
    width="700px"
    v-bind="$attrs"
    title="资产组"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height:40px;font-size: 28px;">
          <PlusCircleOutlined v-if="!isEdit" style="font-size: 34px;font-weight: bold;"/>
          <FormOutlined v-if="isEdit" style="font-size: 34px;font-weight: bold;" /> &nbsp;&nbsp;客户促销活动
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 40px;top: 10px;z-index: 100000;background:#ffffff">
        <img src="../../../../../assets/images/012.png" style="height:80px;margin-right: 10px;"/>
      </div>
    </template>
    <div
      class="nc-open-content"
    >
      <div class="open-content-up" style="text-align: center;margin-top: 50px;">
        <label style="font-size: 18px;margin-left: 0;">活动名称：</label>
        <a-input v-model:value="formItems.activityCode" placeholder="活动名称" class="abc" style="width: 55%;" />
        <span class="red_span">*</span>
        <br/><br/><br/>

        <label>活动编码:</label>
        <a-input v-model:value="formItems.activityName" @blur="checkCode()" placeholder="活动编码" />
        <br/><br/>
        <label>活动内容:</label>
        <a-textarea style="width: 50%" maxlength="100" v-model:value="formItems.activityContent" @blur="checkCode()" :rows="4" placeholder="活动内容" />
        <br/><br/>
        <label>活动范围:</label>
        <a-select
          v-model:value="formItems.activityScope"
          style="width: 300px;text-align: center;"
          ref="select"
        >
          <a-select-option value="1">全部客户</a-select-option>
          <a-select-option value="0">选定客户</a-select-option>
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
        </a-select>
        <br/><br/>
        <label>生效日期:</label>
        <a-date-picker style="width: 300px"  v-model:value="formItems.startDate"  placeholder="价格生效日期" />
        <br/><br/>
        <label>失效日期:</label>
        <a-date-picker  style="width: 300px"  v-model:value="formItems.stopDate"  placeholder="价格失效日期" />
      </div>
    </div>
    <template #footer>
      <a-button @click="closeModal()">取消</a-button>
      <a-button v-if="isEdit" @click="handleOk(false)" type="primary" :disabled="saveClick">确定</a-button>
      <a-button v-if="!isEdit" @click="handleOk(false)" :disabled="saveClick">保存</a-button>
      <a-button v-if="!isEdit" @click="handleOk(true)" :disabled="saveClick" type="primary">保存并新增</a-button>
    </template>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import { ref, unref } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import {findBySettModes,findByBsName,editFlag} from "/@/api/record/stock/stock_promote_price";
import {Select as ASelect,Input as AInput,   DatePicker as ADatePicker} from "ant-design-vue"
import {useMessage} from "/@/hooks/web/useMessage";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {
  PlusCircleOutlined,
  FormOutlined,
  CaretDownOutlined
} from '@ant-design/icons-vue'
const ARangePicker = ADatePicker.RangePicker
const ATextarea=AInput.TextArea
const ASelectOption = ASelect.Option

const {
  createErrorModal
} = useMessage()

const emit=defineEmits(['register','save'])

const formItems:any = ref({

})

let changeBeforeModel:any = {}

const database:any = ref({})
const isEdit:any = ref(false)
const [register, { closeModal }] = useModalInner((data) => {
  // 方式2
 formItems.value = {
    activityCode: data.data.activityCode,
    activityName: data.data.activityName,
    activityContent: data.data.activityContent,
    activityScope: data.data.activityScope,
    startDate: data.data.startDate,
    stopDate: data.data.stopDate,
  }
  database.value = data.data.database
  if(data.data.id){
    formItems.value.id = data.data.id
    isEdit.value = true

  }
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
})
let isChanged:boolean = false
import moment from "moment";
async function handleOk(fls) {
  isChanged = !(formItems.value.activityCode == changeBeforeModel.activityCode
    && formItems.value.activityName == changeBeforeModel.activityName)
  if (formItems.value.activityCode==undefined || formItems.value.activityCode=='') {
    // alert('请输入资产组编码！')
    createErrorModal({
      iconType: 'error',
      title: '提示',
      content: '请输入活动编码！'
    })
    return false
  }
  if (formItems.value.activityName==undefined || formItems.value.activityName=='') {
    // alert('请输入资产组名称！')
    createErrorModal({
      iconType: 'error',
      title: '提示',
      content: '请输入活动名称！'
    })
    return false
  }
  formItems.startDate = moment(formItems.startDate, 'YYYY-MM-DD')
  formItems.stopDate = moment(formItems.stopDate, 'YYYY-MM-DD')
  if(isChanged){
    if(fls === true){
      emit('save', unref(formItems))
      formItems.value = {}
      changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
    }else{
      emit('save', unref(formItems))
      closeModal()
    }
    return true
  }
}

async function checkCode(){
  if((changeBeforeModel.bsCode!=undefined && changeBeforeModel.bsCode!='') || changeBeforeModel.bsCode==formItems.value.bsCode){
    return false
  }
  if(formItems.value.bsCode == ''){
    return false
  }
  const res = await useRouteApi(findBySettModes,{schemaName: database})(formItems.value.bsCode)
  if(res.length!=0){
    createErrorModal({
      iconType: 'error',
      title: '提示',
      content: '活动编码已存在，请重新输入！'
    })
    // alert('资产组编码已存在，请重新输入！')
    formItems.value.bsCode = ''
    return false
  }
  return true
}
async function checkName(){
  if((changeBeforeModel.bsName!=undefined && changeBeforeModel.bsName!='') || changeBeforeModel.bsName==formItems.value.bsName){
    return false
  }
  if(formItems.value.bsName == ''){
    return false
  }
  console.log(database.value)
  const res2 = await useRouteApi(findByBsName,{schemaName: database})(formItems.value.bsName)
  if(res2.length!=0){
    createErrorModal({
      iconType: 'error',
      title: '提示',
      content: '活动名称已存在，请重新输入！'
    })
    // alert('资产组编码已存在，请重新输入！')
    formItems.value.bsCode = ''
    return false
  }
  return true
}
</script>
<style>
.vben-basic-title {
  color: #0096c7 !important;
  border:none !important;
}

.ant-modal-body {
  padding: 0px;
  border-bottom: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
  border-top: none !important;
}
.ant-modal-header{
  border: none !important;
}
</style>
<style lang="less" scoped>
:deep(.vben-basic-title) {
  color: #0096c7 !important;
}
.ant-modal-header{
  border: none !important;
}


:deep(.ant-select-single:not(.ant-select-customize-input)
.ant-select-selector
.ant-select-selection-search-input) {
  border: none !important;
}

.vben-basic-title {
  color: #0096c7 !important;
  border: none !important;
}

.ant-modal-body {
  padding: 0px;
  border-bottom: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
  border-top: none !important;
}

.red_span {
  color: red;
  font-weight: bold;
  display: inline-block;
  width: 20px;
  text-align: right;
}

.nc-open-content {
  input {
    width: 50%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  .abc{
    border-bottom: 2px solid #666666 !important;
    font-size: 18px;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  label {
    text-align: left;
    width: 120px;
    display: inline-block;
    padding-top: 5px;
    padding-left: 5px;
    padding-bottom: 5px;
    color: #535353;
    font-size: 13px;
    margin-left: 1em;
    font-weight: bold;
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
