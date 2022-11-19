<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    title="自定义项设置"
    @ok="handleOk()"
    @register="register"
    :canFullscreen="false"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height:40px;font-size: 28px;" v-if="isState=='0'">
          <PlusCircleOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;自定义项设置
        </span>
        <span style="line-height:40px;font-size: 28px;" v-if="isState=='1'">
          <FormOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;自定义项设置
        </span>
        <span style="line-height:40px;font-size: 28px;" v-if="isState=='2'">
          <FileSearchOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;自定义项设置
        </span>
      </div>
    </template>
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-up" style="text-align: center;margin-top: 30px;margin-bottom: 30px;">

        <label>自定义项编码：</label>
        <a-input v-model:value="formItems.defineCode" :disabled="true" @blur="checkCode()" placeholder="自定义项设置编码"/>
        <span class="red_span"></span>

        <br><br>
        <label>自定义项名称：</label>
        <a-input v-model:value="formItems.defineName" @blur="checkName()" placeholder="自定义项设置名称"/>
        <span class="red_span">*</span>
        <br/><br/>
        <label>字段类型：</label>
        <a-select v-model:value="formItems.shuxing" :disabled="isState=='1'" @change="changeShuxing()" placeholder="字段类型" style="width: 50%;">
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
          <a-select-option value="1">文本</a-select-option>
          <a-select-option value="2">日期</a-select-option>
          <a-select-option value="3">整数</a-select-option>
          <a-select-option value="4">小数</a-select-option>
          <a-select-option value="5">是否</a-select-option>
        </a-select>
        <span class="red_span"></span>
        <br/><br/>
        <label>功能模块：</label>
        <a-select v-model:value="formItems.model" :disabled="isState=='1'" placeholder="" style="width: 50%;">
          <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
          <a-select-option value="1">表头</a-select-option>
          <a-select-option value="2">表体</a-select-option>
        </a-select>
        <span class="red_span"></span>

      </div>
    </div>
    <template #footer>
      <div v-if="isState=='2'">
        <a-button @click="closeModal()" type="primary">关闭</a-button>
      </div>
      <div v-if="isState=='0'">
        <a-button @click="closeModal()">取消</a-button>
        <a-button @click="handleOk()" :disabled="saveClick">保存</a-button>
        <a-button @click="handleOkAdd()" :disabled="saveClick" type="primary">保存并新增</a-button>
      </div>
      <div v-if="isState=='1'">
        <a-button @click="closeModal()">放弃</a-button>
        <a-button @click="handleOk()" :disabled="saveClick" type="primary">保存</a-button>
      </div>
    </template>

  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import { ref, unref } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import {Input as AInput,Select as ASelect } from 'ant-design-vue'
import {
  PlusCircleOutlined,
  FormOutlined,
  FileSearchOutlined,
  CaretDownOutlined
} from '@ant-design/icons-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {
  findAllStockDefineHeadList,
  findBukongDefineCode,
  findByCode,
  findByName,
  findMaxDefineCode, saveStockDefineHead
} from "/@/api/record/system/stock-define-head";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {mul} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import {saveStockDefineBody} from "/@/api/record/system/stock-define-body";

const ASelectOption = ASelect.Option

const {
  createErrorModal
} = useMessage()

const emit = defineEmits(['register', 'save'])

const formItems: any = ref({})

let changeBeforeModel: any = {}

const dynamicTenantId = ref('')
const defaultAdName = ref('')
const isState = ref('0')
const saveClick:any = ref(false)
const [register, {closeModal}] = useModalInner((data: any) => {
  saveClick.value=false
  dynamicTenantId.value = data.dynamicTenantId
  defaultAdName.value = data.defaultAdName
  isState.value = data.isState

  // 方式2
  formItems.value = {
    id: data.data.id,
    defineCode: data.data.defineCode,
    defineName: data.data.defineName,
    flag: data.data.flag,
    remarks: data.data.remarks,
    shuxing: data.data.shuxing,
    ctype: data.data.ctype,
    numWeishu: data.data.numWeishu,
    model: data.data.model,
  }
  changeBeforeModel = JSON.parse(JSON.stringify(formItems))
  if (data.isState=='0') {
    maxCode()
  }
})
let isChanged:boolean = false
async function handleOk() {
  saveClick.value=true
  if (formItems.value.defineCode==null || formItems.value.defineCode==''){
    createErrorModal({
      iconType: 'warning',
      title: '保存失败',
      content: '自定义项设置编码不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.defineName == null || formItems.value.defineName == '') {
    createErrorModal({
      iconType: 'warning',
      title: '保存失败',
      content: '自定义项设置名称不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.shuxing == null || formItems.value.shuxing == '') {
    createErrorModal({
      iconType: 'warning',
      title: '保存失败',
      content: '字段类型不能为空！'
    })
    saveClick.value=false
    return false
  }
  isChanged = !(formItems.value.defineCode == changeBeforeModel._value.defineCode
    && formItems.value.defineName == changeBeforeModel._value.defineName
    && formItems.value.remarks == changeBeforeModel._value.remarks
    && formItems.value.shuxing == changeBeforeModel._value.shuxing
    && formItems.value.ctype == changeBeforeModel._value.ctype
    && formItems.value.numWeishu == changeBeforeModel._value.numWeishu
    && formItems.value.model == changeBeforeModel._value.model)
  console.log(isChanged)
  if (isChanged) {
    emit('save', unref(formItems))
    closeModal()
    saveClick.value=false
    return true
  }
  closeModal()
  // alert("没有改变过")
  saveClick.value=false
  return false
}

async function handleOkAdd() {
  saveClick.value=true
  if (formItems.value.defineCode==null || formItems.value.defineCode==''){
    createErrorModal({
      iconType: 'warning',
      title: '保存失败',
      content: '自定义项设置编码不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.defineName == null || formItems.value.defineName == '') {
    createErrorModal({
      iconType: 'warning',
      title: '保存失败',
      content: '自定义项设置名称不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.shuxing == null || formItems.value.shuxing == '') {
    createErrorModal({
      iconType: 'warning',
      title: '保存失败',
      content: '字段类型不能为空！'
    })
    saveClick.value=false
    return false
  }
  isChanged = !(formItems.value.defineCode == changeBeforeModel._value.defineCode
    && formItems.value.defineName == changeBeforeModel._value.defineName
    && formItems.value.remarks == changeBeforeModel._value.remarks
    && formItems.value.shuxing == changeBeforeModel._value.shuxing
    && formItems.value.ctype == changeBeforeModel._value.ctype
    && formItems.value.numWeishu == changeBeforeModel._value.numWeishu
    && formItems.value.model == changeBeforeModel._value.model)
  console.log(isChanged)
  if (isChanged) {
    emit('save', unref(formItems))
    if (formItems.value.shuxing=='5'){
      const item1 = {
        defineCode: formItems.value.defineCode,
        ccode: '0',
        cname: '否',
        flag: '1',
        remarks: ''
      }
      await useRouteApi(saveStockDefineHead, {schemaName: dynamicTenantId.value})(item1)
      const item2 = {
        defineCode: formItems.value.defineCode,
        ccode: '1',
        cname: '是',
        flag: '1',
        remarks: ''
      }
      await useRouteApi(saveStockDefineBody, {schemaName: dynamicTenantId.value})(item2)
    }
    formItems.value = changeBeforeModel._value
    await maxCode()
    saveClick.value=false
    return true
  }
  // closeModal()
  // alert("没有改变过")
  saveClick.value=false
  return false
}

function changeShuxing(){
  if (formItems.value.shuxing=='1'){
    formItems.value.ctype = 'Input'
    formItems.value.numWeishu = null
  } else if (formItems.value.shuxing=='2'){
    formItems.value.ctype = 'DatePicker'
    formItems.value.numWeishu = null
  } else if (formItems.value.shuxing=='3'){
    formItems.value.ctype = 'InputNumber'
    formItems.value.numWeishu = '0'
  } else if (formItems.value.shuxing=='4'){
    formItems.value.ctype = 'InputNumber'
    formItems.value.numWeishu = '5'
  } else if (formItems.value.shuxing=='5'){
    formItems.value.ctype = 'Checkbox'
    formItems.value.numWeishu = null
  }
}

async function checkCode() {
  if ((changeBeforeModel._value.defineCode != undefined && changeBeforeModel._value.defineCode != '') && changeBeforeModel._value.defineCode == formItems.value.defineCode) {
    return false
  }
  if (formItems.value.defineCode == null || formItems.value.defineCode == '') {
    return false
  }
  const res = await useRouteApi(findByCode, {schemaName: dynamicTenantId})(formItems.value.defineCode)
  if (res.length != 0) {
    createErrorModal({
      iconType: 'warning',
      title: '输入失败',
      content: '自定义项设置编码已存在，请重新输入！'
    })
    formItems.value.defineCode = ''
    return false
  }
  return true
}

async function checkName() {
  let defineName = formItems.value.defineName
  if ((changeBeforeModel._value.defineName != undefined && changeBeforeModel._value.defineName != '') && changeBeforeModel._value.defineName == defineName) {
    return false
  }
  if (formItems.value.defineName == null || formItems.value.defineName == '') {
    return false
  }
  const res = await useRouteApi(findAllStockDefineHeadList, {schemaName: dynamicTenantId})({})
  for (let i = 0; i < res.length; i++) {
    const item = res[i]
    if (item.defineName == defineName){
      createErrorModal({
        iconType: 'warning',
        title: '输入失败',
        content: '自定义项设置名称已存在，请重新输入！'
      })
      formItems.value.defineName = ''
      return false
    }
  }
  return true
}

async function maxCode(){
  const item1 = await useRouteApi(findBukongDefineCode,{schemaName: dynamicTenantId})({})
  if (item1!=null && item1.defineCode!=null && item1.defineCode!=''){
    formItems.value.defineCode = pad(item1.defineCode,3)
  } else {
    const item2 = await useRouteApi(findMaxDefineCode, {schemaName: dynamicTenantId})({})
    if (item2 != null && item2.defineCode != null && item2.defineCode != '') {
      formItems.value.defineCode = pad(add(item2.defineCode, 1), 3)
    } else {
      formItems.value.defineCode = '001'
    }
  }
}

/**
 * 字符串前补0
 * @param num
 * @param n
 */
function pad(num, n) {
  let len = num.toString().length;
  while(len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}

/**
 * 加法
 * @param a
 * @param b
 */
function add(a, b) {
  let c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
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

.is_show{
  pointer-events: none;
  cursor: default;
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
