<template>
  <div class="dynamic-form">
    <BasicForm @register="register"  ref="formElRef">

      <template #cwhcode="{ model, field }">
        <Select :style="props.isEdit&&!props.cwhcodeEdit?{ pointerEvents: 'none'}:{}" placeholder="请选择" v-model:value="model[field]" :show-search="true"
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
      <template #unitType="{ model, field }">
        <Select :style="!props.zzcxFlag&&props.isEdit?{ pointerEvents: 'none'}:{}" placeholder="其他/客户/供应商/员工/项目" v-model:value="model[field]" ref="unitTypeRef" :show-search="true"
                :filter-option="filterOption"  @change="model['unitValue']='',resetSchemas()"
                :options="[{value: 'etc',label: '其他'},{value: 'cust',label: '客户'},{value: 'supplier',label: '供应商'},{value: 'user',label: '员工'},{value: 'project',label: '项目'}]">
          <template #option="{ value: val, label ,title }">{{ label }}</template>
          <template #suffixIcon>
            <SearchOutlined/>
          </template>
        </Select>
      </template>
      <template #unitValue="{ model, field }">
        <Select :style="!props.zzcxFlag&&props.isEdit?{ pointerEvents: 'none'}:{}" v-if="model['unitType'] != 'etc'" placeholder="请选择" v-model:value="model[field]" ref="unitValueRef" :show-search="true"
                :filter-option="filterOption"
                :options="selectModel[model['unitType']]">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="testOpenGysModal(model)"/>
          </template>
        </Select>
        <Input placeholder="输入" :style="!props.zzcxFlag&&props.isEdit?{ pointerEvents: 'none'}:{}" v-else v-model:value="model[field]" />
      </template>
      <template #bstyle="{ model, field }">
        <Select :style="{ pointerEvents: 'none'}" placeholder="请选择" v-model:value="model[field]" ref="bstyleRef" :show-search="true"
                :filter-option="filterOption"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ label }}</template>
        </Select>
      </template>
    </BasicForm>
  </div>
</template>
<script setup="props, { content } ,refs" lang="ts">
import {getCurrentInstance, ref, watch,onMounted} from 'vue';
import {BasicForm, useForm} from "/@/components/Form";
import {findStockCaiGouList,} from "/@/api/record/stock/stock-caigou";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {SearchOutlined} from '@ant-design/icons-vue';
import {Select, Input, message} from "ant-design-vue";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {useNcModals} from "/@/views/boozsoft/stock/stock_out_add/otherServerReferences";

const emit = defineEmits(['register', 'open']);
const props = defineProps(['datasource', 'formDataFun', 'accId', 'readOnly','dynamicTenant','isEdit','cwhcodeEdit','zzcxFlag'])
const { proxy } = getCurrentInstance()
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
]
const formElRef = ref(null)
const ccodeRef = ref(null)
const ddateRef = ref(null)
const cwhcodeRef = ref(null)
const cdepcodeRef = ref(null)
const cpersoncodeRef = ref(null)
const sgsppersonRef = ref(null)
const cmemoRef = ref(null)

async function testOpenGysModal(model){
  const {openGysModal,openCustomModal,openPsnModal} =  useNcModals()
  const params=props.dynamicTenant
  if(model.unitType=='supplier'){
    const result=await openGysModal(params)
    if(result.length>0){
      model.unitValue=result[result.length-1]?.id
    }
  }else if(model.unitType=='cust'){
    const result=await openCustomModal(params)
    if(result.length>0){
      model.unitValue=result[result.length-1]?.id
    }
  }else if(model.unitType=='user'){
    const result=await openPsnModal(params)
    if(result.length>0){
      model.unitValue=result[result.length-1]?.id
    }
  }
}
function cvencode(a) {
  let temps:any=dynamicSchemas.value.filter(it=>it.field==='cvencode')[0]['componentProps']['options']
  let tempss=temps.filter(aa=>aa?.id==a['cvencode'])
  if(!hasBlank(tempss[0]?.uniqueCodeCcus)){
    let tempss2=temps.filter(aa=>aa.uniqueCode==tempss[0]?.uniqueCodeCcus)
    a['cvencode']=tempss2[0].id
  }else{
    a['cvencode']=a['cvencode']
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
    slot: it['component'] == 'Select'? it['field'] : null,
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

const mapList = ref(new Map())
watch(() => props.datasource, async () => {
  props.formDataFun.getFormValue = () => getFieldsValue()
  props.formDataFun.setFormValue = (e) => {
    resetFields();
    setFieldsValue(e)
  }
  let showList = props.datasource.filter(it => (it.isShow) && it.component == 'Select')
  let q = showList.map(it => it.componentProps)
  q.push('operator','cust','supplier','project','user','dept','shoufa')
  let map = (await useRouteApi(findStockCaiGouList, {schemaName: props.accId})([...new Set(q)].join(',')))
  mapList.value = map
  dynamicSchemas.value = props.datasource.map(it => {
    if (it.component === 'Select') {
      it.list = map[it.componentProps]
    }
    return createItem(it)
  })
  selectModel.value = map
  resetSchemas()
  props.formDataFun.getSelectMap = () => selectModel.value
})
const resetSchemas = () => {
  dynamicSchemas.value = props.datasource.filter(it => it.isShow).map(it => {
    // 动态切换
    if (it.field == 'unitValue') it.component = getFieldsValue()['unitType'] == 'etc' ?'Input':'Select'
    if (it.component === 'Select') {
      it.list = selectModel.value[it.componentProps]
    }
    return createItem(it)
  })
}
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
      margin-bottom: 7px;
    }
  }
  :deep(.ant-col-4){
    display: none;
  }
}
</style>
