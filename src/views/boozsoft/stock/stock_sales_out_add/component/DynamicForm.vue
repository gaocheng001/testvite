<template>
  <div class="dynamic-form">
    <BasicForm @register="register"  ref="formElRef">
      <template #cvencode="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" ref="cvencodeRef" :show-search="true"
                :filter-option="filterOption" @keyup.enter.native="focusNext(field)" @change="(v)=>custChange(v,1)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <template #cvencodeJs="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" ref="cvencodeJsRef" :show-search="true"  :disabled="true"
                :filter-option="filterOption" @keyup.enter.native="focusNext(field)"  @change="(v)=>custChange(v,2)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined/>
<!--            @click="exec(field)" -->
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
      <template #sgspperson="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="sgsppersonRef"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <!--          <template #suffixIcon>
                      <SearchOutlined @click="exec(field)"/>
                    </template>-->
        </Select>
      </template>
      <template #deliveryUser="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="deliveryUserRef"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <template #invoiceStyle="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ label }}</template>
<!--          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>-->
        </Select>
      </template>
      <template #methodPay="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :disabled="true"
                :filter-option="filterOption"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ label }}</template>
          <!--          <template #suffixIcon>
                      <SearchOutlined @click="exec(field)"/>
                    </template>-->
        </Select>
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
import {Select} from "ant-design-vue";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {
  changeCust,
  manualTypeConversionAttributes
} from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicForm";

const emit = defineEmits(['register', 'open']);
const props = defineProps(['datasource', 'formDataFun', 'accId', 'readOnly'])
const { proxy } = getCurrentInstance()
const defaultSchemas = [
  {
    field: 'field1',
    component: 'DatePicker',
    label: '入库日期：',
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
    label: '入库单号：',
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
const cvencodeJsRef = ref(null)
const cdepcodeRef = ref(null)
const cpersoncodeRef = ref(null)
const sgsppersonRef = ref(null)
const deliveryUserRef = ref(null)
const cmemoRef = ref(null)

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
    slot: it['component'] == 'Select' ? it['field'] : null,
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
const cvencodeGrade = ref('')
watch(() => props.datasource, async () => {
  props.formDataFun.getFormValue = () => {
   let e = getFieldsValue()
    e['cvencodeGrade'] = cvencodeGrade.value
    return e
  }
  props.formDataFun.setFormValue = (e) => {
    resetFields();
    setFieldsValue(e)
    if (!hasBlank(e['cvencodeGrade']))cvencodeGrade.value = e['cvencodeGrade']
  }
  let showList = props.datasource.filter(it => (it.isShow) && it.component == 'Select')
  let q = showList.map(it => it.componentProps)
  q.push('operator')
  let map = (await useRouteApi(findStockCaiGouList, {schemaName: props.accId})([...new Set(q)].join(',')))
  if (q.indexOf('invoice') != -1)map['invoice'] = [{value:'zyfp',label:'专用发票'},{value:'ptfp',label:'普通发票'},{value:'nfcpfp',label:'农副产品发票'},{value:'sj',label: '收据'}]
  if (q.indexOf('method') != -1)map['method'] = [{value:'QT',label:'其他'},{value:'QKXJ',label:'全款现结'},{value:'DJ',label:'订金'},{value:'XQSK',label: '限期收款'},{value:'YJ',label: '月结'}]
  dynamicSchemas.value = props.datasource.filter(it => it.isShow).map(it => {
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

function custChange(v,t) {
  let model = changeCust(v, selectModel.value['cust'],getFieldsValue())
  cvencodeGrade.value = model['cvencodeGrade']
  setFieldsValue(model)
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
