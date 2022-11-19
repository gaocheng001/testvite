<template>
  <div class="dynamic-form">
    <BasicForm @register="register"  ref="formElRef">
      <template #cvencode="{ model, field }">
        <Select :disabled="canzhao" cvencode="请选择" v-model:value="model[field]" ref="customerCodeRef" :show-search="true"
                :filter-option="filterOption" @keyup.enter.native="focusNext(field)" @change="(v)=>custChange(model)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <template #wuliuSup="{ model, field }">
        <Select @change="cvencode(model)" placeholder="请选择" v-model:value="model[field]" ref="wuliuSupRef" :show-search="true"
                :filter-option="filterOption" @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <template #cdepcode="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="cdepcodeRef"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <template #cwhcodeUser="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="cwhcodeUserRef"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <template #cpersoncode="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="cpersoncodeRef"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <template #deliveryName="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="deliveryNameRef"
                mode="multiple"
                :max-tag-count="1"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
        </Select>
        &nbsp;
        <a style="font-weight: bold;font-size: 18px;"><LinkOutlined @click="exec('deliveryName')" /></a>
      </template>
      <template #ddate="{ model, field }">
        <DatePicker :disabled="canzhao" v-model:value="model[field]" ref="ddateRef" @change="dateChange"></DatePicker>
      </template>
    </BasicForm>
  </div>
</template>
<script setup="props, { content } ,refs" lang="ts">
import {getCurrentInstance, ref, watch} from 'vue';
import {BasicForm, useForm} from "/@/components/Form";
import {findStockCaiGouList,} from "/@/api/record/stock/stock-caigou";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {SearchOutlined,LinkOutlined} from '@ant-design/icons-vue';
import {Select, Input, message,DatePicker} from "ant-design-vue";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import dayjs from "dayjs";
import {findById as findBySupplierId} from "/@/api/record/supplier_data/supplier";
import {findById as findByCustId} from "/@/api/record/costomer_data/customer";
import {findByStockPeriodIsClose} from "/@/api/record/stock/stock-ruku";

const emit = defineEmits(['register', 'open']);
const props = defineProps(['datasource', 'formDataFun', 'accId', 'readOnly','rukuMainData','canzhao'])
const { proxy } = getCurrentInstance()
const defaultSchemas = [
  {
    field: 'field1',
    component: 'DatePicker',
    label: '送货日期：',
    colProps: {
      span: 4,
    },
    required: false,
    componentProps: {locale: localeCn},
  },
  {
    field: 'field2',
    component: 'Input',
    label: '送货单号：',
    required: true,
    colProps: {
      span: 6,
    }
  },
  {
    field: 'field3',
    component: 'Select',
    label: '供应商：',
    componentProps: {
      options: [],
    },
    required: true,
    colProps: {
      span: 6,
    }
  },
]
const formElRef = ref(null)
const ccodeRef = ref(null)
const ddateRef = ref(null)
const cwhcodeRef = ref(null)
const cdepcodeRef = ref(null)
const cpersoncodeRef = ref(null)
const sgsppersonRef = ref(null)
const cmemoRef = ref(null)

const dateFormat = 'YYYY-MM-DD';
const disabledDate = (current: dayjs) => {
  console.log(formatTimer(dayjs().endOf('month')))
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

// 时间格式化
function formatTimer(value) {
  let date:any = new Date(value);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m;
  let s = date.getSeconds();
  s = s < 10 ? "0" + s : s;
  return y + "-" + MM + "-" + d + " " + h + ":" + m;
}

function createItem(it) {
  return {
    field: it['field'],
    component: it['component'],
    label: it['label'] + "：",
    colProps: {
      span: it['component'] == 'DatePicker' ? 5 : 5,
    },
    required: it['required'],
    componentProps: (it['component'] == 'DatePicker' ? {locale: localeCn,disabled: false} : it['component'] == 'Select'?{
      options: it['list'],
    }:it['component'] == 'Input'?{readonly: it['readonly']}:{}),
    slot: it['component'] == 'Select' || it['field'] == 'rate' || it['field'] == 'ddate' ? it['field'] : null,
    show: it['isShow']
  }
}

const dynamicSchemas = ref([])
const selectModel = ref({})
const [register, {getFieldsValue, resetFields, setFieldsValue}] = useForm({
  labelWidth: 100,
  /*  actionColOptions: {
      span: 24,
    },*/
  showResetButton: false,
  showSubmitButton: false,
  schemas: dynamicSchemas,
  autoFocusFirstItem: false,
});

const filterOption = (input: string, option: any) => {
  return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
watch(() => props.datasource, async () => {
  props.formDataFun.getFormValue = () => getFieldsValue()
  props.formDataFun.setFormValue = (e) => {
    resetFields();
    setFieldsValue(e)
  }
  let showList = props.datasource.filter(it => (it.isShow) && it.component == 'Select')
  let q = showList.map(it => it.componentProps)
  q.push('operator')
  let map = (await useRouteApi(findStockCaiGouList, {schemaName: props.accId})([...new Set(q)].join(',')))
  dynamicSchemas.value = props.datasource.map(it => {
    if (it.component === 'Select') {
      it.list = map[it.componentProps]
    }
    return createItem(it)
  })
  selectModel.value = map
  props.formDataFun.getSelectMap = () => selectModel.value
})
const exec = (k) => {
  emit('open', k)
}

const focusNext = (t) => {
  let list = dynamicSchemas.value.filter(it => it.show && it.component == 'Select')
  let field = list[list.findIndex(it => it.field === t) + 1]?.field
  if (null != field) proxy.$refs[field + 'Ref'].focus()
}

async function cvencode(a) {
  let sup=await useRouteApi(findBySupplierId, {schemaName: props.accId})(a['wuliuSup'])
  let text=''
  if(!hasBlank(sup.telephone)){
    a['wuliuTel']=sup.telephone
  }else{
    a['wuliuTel']=''
  }
}

async function custChange(a) {
  let cus=await useRouteApi(findByCustId, {schemaName: props.accId})(a['cvencode'])
  a['cuserTel']=''
  a['caddress']=''
  if(!hasBlank(cus.contacts)){
    a['cuserTel']=cus.contacts
  }
  if(!hasBlank(cus.contacts)&&!hasBlank(cus.telephone)){
    a['cuserTel']=cus.contacts+','+cus.telephone
  }
  if(!hasBlank(cus.address2)){
    a['caddress']=cus.address2
  }
}
async function dateChange(data) {
  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: props.accId})({iyear:formatTimer(data).split('-')[0],month:formatTimer(data).split('-')[1]})
  if(temp>0){
    message.error('单据日期已结账！')
  }
}
</script>
<style lang="less" scoped="scoped">
.dynamic-form{
  :deep(.ant-form-item .ant-select, .ant-form-item .ant-cascader-picker){
    width: 78%;
  }
  :deep(.ant-select-selector), :deep(.ant-picker), :deep(.ant-input-affix-wrapper),:deep(#form_item_rate){
    border: none;
    border-bottom: 1px solid #c9c9c9;
    background-color: white;
    color: black;

    .ant-picker-input {
      > input {
        color: black;
      }
    }
  }
  :deep(.ant-col){
    margin-left: 1em;
    .ant-form-item-label{
      text-align: left;
      .ant-form-item-no-colon{
        font-weight: bold;
        color: #666666;
      }
    }
    .ant-form-item:not(.ant-form-item-with-help) {
      margin-bottom: 0px;
    }
  }
  :deep(.ant-col-4){
    display: none;
  }
}
</style>
