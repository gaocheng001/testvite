<template>
  <div class="dynamic-form">
    <BasicForm @register="register"  ref="formElRef">
      <template #cvencode="{ model, field }">
        <Select :disabled="props.canzhao" @change="cvencodeJs(model)" placeholder="请选择" v-model:value="model[field]" ref="cvencodeRef" :show-search="true"
                :filter-option="filterOption" @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="testOpenGysModal(model)"/>
          </template>
        </Select>
      </template>
      <template #cvencodeJs="{ model, field }">
        <Select :disabled="true" placeholder="请选择" v-model:value="model[field]" ref="cvencodeJsRef" :show-search="true"
                :filter-option="filterOption" @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec('cvencode')"/>
          </template>
        </Select>
      </template>
      <template #cwhcode="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="cwhcodeRef"
                @keyup.enter.native="focusNext(field)"  option-label-prop="label"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
<!--            <SearchOutlined @click="exec(field)"/>-->
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
      <template #rate="{ model, field }">
        <Input v-model:value="model[field]" @blur="temp123(model[field],model, field)" ref="rateRef"/>
      </template>

      <template #ddate="{ model, field }">
        <DatePicker v-model:value="model[field]" ref="ddateRef" @change="dateChange(model[field],model, field)"></DatePicker>
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
import {SearchOutlined} from '@ant-design/icons-vue';
import {Select, Input, message,DatePicker} from "ant-design-vue";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {useNcModals} from "/@/views/boozsoft/stock/stock_out_add/otherServerReferences";
import dayjs from "dayjs";
import {findBillCode, findBillCode2} from "/@/api/record/stock/stock-ruku";

const emit = defineEmits(['register', 'open']);
const props = defineProps(['datasource', 'formDataFun', 'accId', 'readOnly','canzhao','sourceType','dynamicTenant'])
const { proxy } = getCurrentInstance()
const formElRef = ref(null)
const ddateRef = ref(null)
const cwhcodeRef = ref(null)
const cdepcodeRef = ref(null)
const cpersoncodeRef = ref(null)
const cmemoRef = ref(null)

async function testOpenGysModal(model){
  const {openGysModal} =  useNcModals()
  const params=props.dynamicTenant
  const result=await openGysModal(params)
  if(result.length>0){
    model.cvencode=result[result.length-1]?.id
    cvencodeJs(model)
  }
}
async function dateChange(data,val) {
  // 账套启用期间
  let a=dayjs(props.dynamicTenant.target.startDate+"-01")
  // 单据日期
  let b=data
  if(!b.isBefore(a)){
    message.error('单据日期不能大于账套启用期间！')
    val.ccode=null
    val.ddate=null
    return
  }

  let tempDate=formatTimer(b)
  val.ccode=await generateCode(tempDate.substring(0,tempDate.length-3))
}

async function generateCode(date) {
  return await useRouteApi(findBillCode2, {schemaName: props.accId})({
    type: "ZG", iyear: date.split('-')[0], time: date
  })
}

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
  return y + "-" + MM + "-" + d;
}

function temp123(val,a) {
  if(!isFinite(val)){
    message.error('税率不是正整数！')
    a.rate=null
  }
}
function cvencodeJs(a) {
  let temps:any=dynamicSchemas.value.filter(it=>it.field==='cvencodeJs')[0]['componentProps']['options']
  let tempss=temps.filter(aa=>aa?.id==a['cvencode'])
  if(!hasBlank(tempss[0]?.uniqueCodeCcus)){
    let tempss2=temps.filter(aa=>aa.uniqueCode==tempss[0]?.uniqueCodeCcus)
    a['cvencodeJs']=tempss2[0].id
  }else{
    a['cvencodeJs']=a['cvencode']
  }
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
    componentProps: (it['component'] == 'DatePicker' ? {locale: localeCn,disabled: true} : it['component'] == 'Select'?{
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
  q.push('operator','user','supplier','dept')
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
</script>
<style lang="less" scoped="scoped">
.dynamic-form{
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
