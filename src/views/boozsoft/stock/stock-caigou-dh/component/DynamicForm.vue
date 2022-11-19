<template>
  <div class="dynamic-form">
    <BasicForm @register="register"  ref="formElRef">
      <template #cvencode="{ model, field }">
        <Select :disabled="props.biandong=='1'||props.canzhao" @change="cvencodeJs(model)" placeholder="请选择" v-model:value="model[field]" ref="cvencodeRef" :show-search="true"
                :filter-option="filterOption" @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="testOpenGysModal(model)"/>
          </template>
        </Select>
      </template>
      <template #cvencodeJs="{ model, field }">
        <Select disabled placeholder="请选择" v-model:value="model[field]" ref="cvencodeJsRef" :show-search="true"
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
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <template #invoiceStyle="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" ref="invoiceStyleRef" :show-search="true"
                :filter-option="filterOption" @keyup.enter.native="focusNext(field)"
                :options="[
                  {label:'专用发票',title:'专用发票',value:'zyfp'},
                  {label:'普通发票',title:'普通发票',value:'ptfp'},
                  {label:'农副产品发票',title:'农副产品发票',value:'nfcpfp'},
                  {label:'收据',title:'收据',value:'sj'},
                  ]">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
        </Select>
      </template>
      <template #methodPay="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" ref="methodPayRef" :show-search="true"
                :filter-option="filterOption" @keyup.enter.native="focusNext(field)"
                :options="[
                  {label:'其他',title:'其他',value:'QT'},
                  {label:'全款现结',title:'全款现结',value:'QKXJ'},
                  {label:'订金',title:'订金',value:'DJ'},
                  {label:'限期收款',title:'限期收款',value:'XQSK'},
                  {label:'月结',title:'月结',value:'YJ'},
                  ]">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
        </Select>
      </template>
      <template #cdepcode="{ model, field }">
        <Select :disabled="props.biandong=='1'||props.canzhao" placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="cdepcodeRef"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <template #cpersoncode="{ model, field }">
        <Select :disabled="props.canzhao" placeholder="请选择" v-model:value="model[field]" :show-search="true"
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
        <InputNumber v-model:value="model[field]" :min="0" :max="100" ref="rateRef" :formatter="value => `${value}%`"
                     :parser="value => value.replace('%', '')"
        />
      </template>
      <template #ddate="{ model, field }">
        <DatePicker :disabled="props.biandong=='1'" v-model:value="model[field]" ref="ddateRef" @change="dateChange" style="width: 100%;"></DatePicker>
      </template>
      <template #payDate="{ model, field }">
        <DatePicker v-model:value="model[field]" ref="payDateRef" style="width: 100%;"></DatePicker>
      </template>
      <template #theDeposit="{ model, field }">
        <Input ref="theDepositRef" placeholder="输入" :min="0" v-model:value="model[field]" @focus="uninputMoney(model,field,model[field])" @blur="inputMoney(model,field,model[field])" style="text-align: right;" />
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
import {DatePicker, Input, message, Select,InputNumber} from "ant-design-vue";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findBillCode, findByStockPeriodIsClose} from "/@/api/record/stock/stock-ruku";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import dayjs from "dayjs";
import {useNcModals} from "/@/views/boozsoft/stock/stock_out_add/otherServerReferences";

const emit = defineEmits(['register', 'open']);
const props = defineProps(['datasource', 'formDataFun', 'accId', 'readOnly','biandong','newDateMsg','canzhao','sourceType','dynamicTenant'])
const { proxy:any } = getCurrentInstance()
const defaultSchemas = [
  {
    field: 'field1',
    component: 'DatePicker',
    label: '单据日期：',
    colProps: {
      span: 4,
    },
    required: true,
    componentProps: {locale: localeCn},
    /* slot: 'customSlot',
     show: ({ values }) => {
       return !!values.field5;
     },*/
  },
  {
    field: 'field2',
    component: 'Input',
    label: '单据编号：',
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

// 获得焦点金额去掉格式
const uninputMoney  = (model,field,val) => {
  return model[field]=val.replace(/\$\s?|(,*)/g, '')
}
// 失去焦点金额格式化
const inputMoney   = (model,field,val) => {
  if(parseFloat(val)<0){
    return model[field]=''
  }
  return model[field]=parseFloat(val).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

async function testOpenGysModal(model){
  const {openGysModal} =  useNcModals()
  const params=props.dynamicTenant
  const result=await openGysModal(params)
  if(result.length>0){
    model.cvencode=result[result.length-1]?.id
    cvencodeJs(model)
  }
}

async function dateChange(data) {
  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: props.accId})({iyear:formatTimer(data).split('-')[0],month:formatTimer(data).split('-')[1]})
  if(temp>0){
    message.error('单据日期已结账！')
  }
  // 暂时注释
  // newDate(formatTimer(data))
}
async function generateCode(date) {
  return await useRouteApi(findBillCode, {schemaName: props.accId})({
    type: "CGDHD",
    date: date,
    prefix: "",key: '3-1'
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
const dateFormat = 'YYYY-MM-DD';
function cvencodeJs(a) {
  let temps:any=dynamicSchemas.value.filter(it=>it.field==='cvencodeJs')[0]['componentProps']['options']
  let tempss=temps.filter(aa=>aa?.id==a['cvencode'])
  a['methodPay']=tempss[0].payType
  a['payDate']=null
  if(tempss[0].payType=='XQSK'){
    a['payDate']=dayjs(formatTimer(useCompanyOperateStoreWidthOut().getLoginDate), dateFormat).add(parseInt(tempss[0].payNumber), 'day')
  }else if(tempss[0].payType=='YJ'){
    let tempDate=formatTimer(dayjs(formatTimer(useCompanyOperateStoreWidthOut().getLoginDate), dateFormat).add(parseInt(tempss[0].payNumber), 'month'))
    a['payDate']=dayjs(tempDate.substring(0,tempDate.length-2)+'01')
  }
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
    slot: it['component'] == 'Select' || it['field'] == 'rate'|| it['field'] == 'ddate' || it['field']=='payDate' || it['field']=='theDeposit' ? it['field'] : null,
    show: it['isShow']
  }
}

const dynamicSchemas = ref([])
const selectModel = ref({})
const [register, {getFieldsValue, resetFields, setFieldsValue,updateSchema}] = useForm({
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
    if(props.newDateMsg=='0'){
      resetFields();
    }else{
      updateSchema({filed: 'ccode',componentProps:e})
    }
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
  debugger
  emit('open', k)
}
const newDate = (k) => {
  emit('newDate', {data:k,msg:'1'})
}

const focusNext = (t) => {
  let list = dynamicSchemas.value.filter(it => it.show && it.component == 'Select')
  let field = list[list.findIndex(it => it.field === t) + 1]?.field
  if (null != field) proxy.$refs[field + 'Ref'].focus()
}
</script>
<style lang="less" scoped="scoped">
.dynamic-form{
  :deep(.ant-select-selector), :deep(.ant-picker), :deep(.ant-input-affix-wrapper) {
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
  :deep(.ant-input-number){
    width: 100%;
    border: none;
    border-bottom: 1px solid #c9c9c9;
    background-color: white;
    color: black;
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
      margin-bottom: 5px;
    }
  }
  :deep(.ant-col-4){
    display: none;
  }
}
</style>
