<template>
  <div class="dynamic-form">
    <BasicForm @register="register"  ref="formElRef">
      <!-- BOM存货名称 -->
      <template #bomCode="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="bomCodeRef"
                @keyup.enter.native="focusNext(field)"
                @change="bomCheck(model)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <!-- BOM版本号 -->
      <template #bomVer="{ model, field }">
        <Select disabled placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="bomVerRef"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
          </template>
        </Select>
      </template>
      <!-- 计量单位 -->
      <template #cunitid="{ model, field }">
        <Select disabled placeholder="请选择" v-model:value="model[field]" :show-search="true"
                :filter-option="filterOption" ref="cunitidRef"
                style="text-align: center;"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
        </Select>
      </template>
      <!-- 部门 -->
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
      <!-- 业务员 -->
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
      <!-- 业务类型 -->
      <template #adStyle="{ model, field }">
        <Select placeholder="组装/拆卸" v-model:value="model[field]" ref="adStyleRef" :show-search="true"
                style="text-align: center;"
                :filter-option="filterOption"
                :options="[{value: 'ZZ',label: '组装'},{value: 'CX',label: '拆卸'}]">
          <template #option="{ value: val, label ,title }">{{ label }}</template>
        </Select>
      </template>
      <!-- 级次 -->
      <template #bomLevel="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" ref="adStyleRef" :show-search="true"
                style="text-align: center;"
                :filter-option="filterOption"
                :options="[{value: '1',label: '一级'},{value: '2',label: '二级'},{value: '3',label: '三级'},{value: '4',label: '四级'},{value: '5',label: '五级'},{value: '6',label: '六级'}
                ,{value: '7',label: '七级'},{value: '8',label: '八级'},{value: '9',label: '九级'},{value: '10',label: '十级'},{value: '11',label: '十一级'},{value: '12',label: '十二级'},{value: '13',label: '十三级'}
                ,{value: '14',label: '十四级'},{value: '15',label: '十五级'},{value: '16',label: '十六级'},{value: '17',label: '十七级'},{value: '18',label: '十八级'},{value: '19',label: '十九级'},{value: '20',label: '二十级'}]">
          <template #option="{ value: val, label ,title }">{{ label }}</template>
        </Select>
      </template>
      <!-- 数量 -->
      <template #cnumber="{ model, field }">
          <InputNumber v-model:value="model[field]" @blur="cnumberCheck(model[field],model, field)" ref="cnumberRef"/>
      </template>
      <!-- 费用 -->
      <template #feiyongJe="{ model, field }">
        <Input ref="feiyongJeRef" placeholder="输入" :min="0" v-model:value="model[field]" @focus="uninputMoney(model,field,model[field])" @blur="inputMoney(model,field,model[field])" style="text-align: right;" />
      </template>
    </BasicForm>
  </div>
</template>
<script setup="props, { content } ,refs" lang="ts">
import {getCurrentInstance, ref, watch,inject,onMounted} from 'vue';
import {BasicForm, useForm} from "/@/components/Form";
import {findCunHuoAllList, findStockCaiGouList,} from "/@/api/record/stock/stock-caigou";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {SearchOutlined} from '@ant-design/icons-vue';
import {Select, Input, InputNumber} from "ant-design-vue";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {useNcModals} from "/@/views/boozsoft/stock/stock_out_add/otherServerReferences";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import {useMessage} from "/@/hooks/web/useMessage";

const emit = defineEmits(['register', 'open','feiyongJeCheck']);
const props = defineProps(['datasource', 'formDataFun', 'accId', 'readOnly','dynamicTenant','trCheckFlag'])
const { proxy:any } = getCurrentInstance()
const formElRef = ref(null)
const ccodeRef = ref(null)
const ddateRef = ref(null)
const cwhcodeRef = ref(null)
const cdepcodeRef = ref(null)
const cpersoncodeRef = ref(null)
const sgsppersonRef = ref(null)
const cmemoRef = ref(null)
const simpJlList:any = inject('simpJlList')
const manyJlList:any = inject('manyJlList')
const {createErrorModal, createConfirm, createWarningModal} = useMessage()


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
    }:it['component'] == 'Input'?{readonly: it['readonly']}:it['component'] == 'InputNumber'?(it['field']!='cnumber'?{min: 1}:{min: 1}):{}),
    slot: it['component'] == 'Select' || it['field']=='feiyongJe'|| it['field']=='cnumber' ? it['field'] : null,
    show: it['isShow']
  }
}

const dynamicSchemas:any = ref([])
const selectModel = ref({})
const [register, {getFieldsValue, resetFields, setFieldsValue}] = useForm({
  labelWidth: 100,
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
    if (!hasBlank(e['bomCode']))bomCheck(e)
  }
  let showList = props.datasource.filter(it => (it.isShow) && it.component == 'Select')
  let q = showList.map(it => it.componentProps)
  q.push('operator','cust','supplier','project','user','dept','bom')
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

let bomCheckCount=0
const bomCheck = async (model) => {
  bomCheckCount++
  if(bomCheckCount>1&&props.trCheckFlag){
    emit('bomCheck', true)
  }
  if(!hasBlank(model.bomCode)){
    let bomData=dynamicSchemas.value.filter(it=>it.field==='bomCode')[0]['componentProps']['options'].filter(tx=>tx.value==model.bomCode)[0]
    model.bomVerName=bomData?.bomName
    model.bomVer=bomData.bomVersion
    let stockListData = (await useRouteApi(findCunHuoAllList, {schemaName: props.accId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
    let stockData=stockListData.filter(tx=>tx.stockNum==bomData.bomId)[0]
    assembleUnitList(model,stockData)
  }
}
const assembleUnitList = (record,o) => {
  // 计量类型
  let unitList:any = []
  if (o.stockMeasurementType != '单计量' && !hasBlank(o?.stockMeasurementUnit) && record?.unitInfo == null) {
    let res = manyJlList.value.filter(it => it.id == o?.stockMeasurementUnit)[0]
    if (res != null) {
      let list = JsonTool.parseObj(res.detail) || []
      unitList = list.map(it => {
        it.value = it.id;
        it.label = it.unitName;
        it.ggxh = '';
        it.barcode = '';
        return it;
      })
      if (list.length > 0 && record.id == null) {
        record.cunitid = list[0].id
      }
    }
  }
  else if (o.stockMeasurementType == '单计量' &&  !hasBlank(o?.stockMeasurementUnit)){
    let res = simpJlList.value.filter(it => it.id == o?.stockMeasurementUnit)
    if (null !=  res && res.length >0){
      unitList = res.map(it=>{it.value=it.id;it.label=it.unitName;it.ggxh=o?.stockGgxh;it.barcode =o?.stockBarcode;return it;})
      record.cunitid = unitList[0].value
    }
  }
  dynamicSchemas.value.filter(it=>it.field=='cunitid')[0]['componentProps']['options']=unitList
  return record
}

const feiyongJeCheck = (data) => {
  emit('feiyongJeCheck', data)
}
const cnumberCheck = (data) => {
  emit('cnumberCheck',  data)
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
