<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    title="自定义项档案"
    @ok="handleOk()"
    @register="register"
    :canFullscreen="false"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height:40px;font-size: 28px;">
          <PlusCircleOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;自定义项档案
        </span>
      </div>
    </template>
    <div class="nc-open-content" >
      <div class="open-content-up" style="text-align: center;margin-top: 30px;">

        <label>自定义名称：</label>
        <a-input v-model:value="definedfile.defineName" :disabled="true" placeholder="自定义名称"/>
        <br/><br/>

        <label>字段类型：</label>
        <a-input v-model:value="shuxing" :disabled="true" placeholder="字段类型"/>
        <br/><br/>

        <label>档案名称：</label>
          <a-input v-if="definedfile.shuxing=='1'" v-model:value="formItems.cname" style="width:50%"/>
          <a-date-picker v-if="definedfile.shuxing=='2'" v-model:value="formItems.cname" :locale="localeCn" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width:50%"/>
          <a-input-number v-if="definedfile.shuxing=='3'" v-model:value="formItems.cname" :min="0" :precision="0" style="width:50%"/>
          <a-input-number v-if="definedfile.shuxing=='4'" v-model:value="formItems.cname" :min="0" :precision="5" style="width:50%"/>

      </div>
    </div>

    <template #footer>
      <div>
        <a-button @click="closeModal()">取消</a-button>
        <a-button @click="handleOk()" :disabled="saveClick" type="primary">保存</a-button>
      </div>
    </template>

  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import { ref, unref } from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import {Input as AInput,DatePicker as ADatePicker, InputNumber as AInputNumber } from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {
  findBukongCcode,
  findByCode,
  findByName,
  findMaxCcode
} from "/@/api/record/system/stock-define-body";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {
  PlusCircleOutlined
} from '@ant-design/icons-vue'
import {findByCode as findFileByCode} from "/@/api/record/system/stock-define-head"
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {add} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";

const {
  createErrorModal
} = useMessage()

const emit = defineEmits(['register', 'save'])

const formItems: any = ref({})

let changeBeforeModel: any = {}

const dynamicTenantId = ref('')
const defaultAdName = ref('')
const definedfile:any = ref({})
const shuxing = ref('')
const saveClick:any = ref(false)
const [register, {closeModal}] = useModalInner(async (data: any) => {
  saveClick.value=false
  dynamicTenantId.value = data.dynamicTenantId
  defaultAdName.value = data.defaultAdName

  const res = await useRouteApi(findFileByCode, {schemaName: dynamicTenantId})(data.data.defineCode)
  definedfile.value = res[0]
  if (definedfile.value.shuxing=='1'){
    shuxing.value = '文本'
  } else if (definedfile.value.shuxing=='2') {
    shuxing.value = '日期'
  } else if (definedfile.value.shuxing=='3') {
    shuxing.value = '整数'
  } else if (definedfile.value.shuxing=='4') {
    shuxing.value = '小数'
  } else if (definedfile.value.shuxing=='5') {
    shuxing.value = '是否'
  }
  // 方式2
  formItems.value = {
    id: data.data.id,
    defineCode: data.data.defineCode,
    ccode: data.data.ccode,
    cname: data.data.cname,
    flag: '1',
    remarks: data.data.remarks
  }
  await maxCode()
  changeBeforeModel = JSON.parse(JSON.stringify(formItems))
})
let isChanged:boolean = false
async function handleOk() {
  saveClick.value=true
  if (formItems.value.recordCode==''){
    createErrorModal({
      iconType: 'warning',
      title: '保存失败',
      content: '自定义项设置编码不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.recordName == '') {
    createErrorModal({
      iconType: 'warning',
      title: '保存失败',
      content: '自定义项设置名称不能为空！'
    })
    saveClick.value=false
    return false
  }
  isChanged = !(formItems.value.recordCode == changeBeforeModel._value.recordCode
    && formItems.value.recordName == changeBeforeModel._value.recordName
    && formItems.value.remarks == changeBeforeModel._value.remarks)
  console.log(isChanged)
  if (isChanged) {
    emit('save', unref(formItems))
    closeModal()
    saveClick.value=false
    return true
  }
  closeModal()
  saveClick.value=false
  // alert("没有改变过")
  return false
}

async function checkCode() {
  if ((changeBeforeModel._value.ccode != undefined && changeBeforeModel._value.ccode != '') && changeBeforeModel._value.ccode == formItems.value.ccode) {
    return true
  }
  if (formItems.value.ccode == null || formItems.value.ccode == '') {
    return true
  }
  const res = await useRouteApi(findByCode, {schemaName: dynamicTenantId})({
    defineCode: formItems.value.defineCode,
    ccode: formItems.value.ccode
  })
  if (res.length != 0) {
    createErrorModal({
      iconType: 'warning',
      title: '输入失败',
      content: '档案编码已存在，请重新输入！'
    })
    formItems.value.ccode = ''
    return false
  }
  return true
}

async function checkName() {
  if ((changeBeforeModel._value.cname != undefined && changeBeforeModel._value.cname != '') && changeBeforeModel._value.cname == formItems.value.cname) {
    return true
  }
  if (formItems.value.cname == null || formItems.value.cname == '') {
    return true
  }
  const res = await useRouteApi(findByName, {schemaName: dynamicTenantId})({
    defineCode: formItems.value.defineCode,
    cname: formItems.value.cname
  })
  if (res.length != 0) {
    createErrorModal({
      iconType: 'warning',
      title: '输入失败',
      content: '档案名称已存在，请重新输入！'
    })
    formItems.value.cname = ''
    return false
  }
  return true
}

async function maxCode(){
  let str = ''
  const item1 = await useRouteApi(findBukongCcode,{schemaName: dynamicTenantId})(definedfile.value.defineCode)
  if (item1!=null && item1.ccode!=null && item1.ccode!=''){
    str = item1.ccode
  } else {
    const item2 = await useRouteApi(findMaxCcode, {schemaName: dynamicTenantId})(definedfile.value.defineCode)
    if (item2 != null && item2.ccode != null && item2.ccode != '') {
      str = add(item2.ccode, 1)+''
    } else {
      str = '1'
    }
  }
  formItems.value.ccode = str
  // console.log(str)
  return str
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
:deep(.ant-calendar-picker-input.ant-input),
:deep(.ant-select-single:not(.ant-select-customize-input)
.ant-select-selector
.ant-select-selection-search-input) {
  border: none;
  width: 100%;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
}

:deep(.ant-select-single:not(.ant-select-customize-input)
.ant-select-selector
.ant-select-selection-search-input) {
  border: none !important;
}

:deep(.ant-picker){
  border: none !important;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  input {
    font-size: 14px;
    font-weight: bold;
    border: none !important;
  }
}

:deep(.vben-basic-title) {
  color: #0096c7 !important;
}
.ant-modal-header{
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

.nc-open-content {
  input {
    width: 50%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label {
    text-align: left;
    width: 110px;
    display: inline-block;
    padding-top: 5px;
    padding-bottom: 5px;
    color: #535353;
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
