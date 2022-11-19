<template>
  <div class="dynamic-form">
    <BasicForm @register="register"  ref="formElRef">
      <template #unitType="{ model, field }">
        <Select placeholder="其他/客户/供应商/员工/项目" v-model:value="model[field]" ref="cvencodeRef" :show-search="true" :disabled="['DBCK','PKCK','XTZHCK'].indexOf(model['bstyle']) != -1"
                :filter-option="filterOption"  @change="model['unitValue']='',resetSchemas()"
                :options="[{value: 'etc',label: '其他'},{value: 'cust',label: '客户'},{value: 'supplier',label: '供应商'},{value: 'user',label: '员工'},{value: 'project',label: '项目'}]">
          <template #option="{ value: val, label ,title }">{{ label }}</template>
          <template #suffixIcon>
            <SearchOutlined/>
          </template>
        </Select>
      </template>

      <template #unitValue="{ model, field }">
        <Select v-if="model['unitType'] != 'etc'" placeholder="请选择" v-model:value="model[field]" ref="cvencodeJsRef" :show-search="true" :disabled="['DBCK','PKCK','XTZHCK'].indexOf(model['bstyle']) != -1"
                :filter-option="filterOption"
                :options="selectModel[model['unitType']]">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined/>
          </template>
        </Select>
        <Input placeholder="输入"  v-else v-model:value="model[field]" :disabled="['DBCK','PKCK','XTZHCK'].indexOf(model['bstyle']) != -1" />
      </template>

      <template #cwhcode="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" :show-search="true"  :disabled="['DBCK','PKCK','XTZHCK'].indexOf(model['bstyle']) != -1"
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


      <template #bstyle="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" ref="bstyleRef" :disabled="true"
                @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ label }}</template>
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
import {Select,Input} from "ant-design-vue";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
const emit = defineEmits(['register', 'open']);
const props = defineProps(['datasource', 'formDataFun', 'accId', 'readOnly'])
const { proxy } = getCurrentInstance()

const formElRef = ref(null)
const ccodeRef = ref(null)
const ddateRef = ref(null)
const cwhcodeRef = ref(null)
const cvencodeJsRef = ref(null)
const cdepcodeRef = ref(null)
const cpersoncodeRef = ref(null)
const sgsppersonRef = ref(null)
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
  }
  let showList = props.datasource.filter(it => (it.isShow) && it.component == 'Select')
  let q = showList.filter(it=>!hasBlank(it.componentProps)).map(it => it.componentProps)
  q.push(...['operator','supplier','project'])
  let map = (await useRouteApi(findStockCaiGouList, {schemaName: props.accId})([...new Set(q)].join(',')))
  map['method'] = [{value: '其他出库',label: '其他出库'},{value: '调拨出库',label: '调拨出库'},{value: '盘亏出库',label: '盘亏出库'},{value: '形态转换出库',label: '形态转换出库'},{value: '借入还回出库',label: '借入还回出库'},{value: '借出借用出库',label: '借出借用出库'},{value: '组装出库',label: '组装出库'},{value: '拆卸出库',label: '拆卸出库'}]
  selectModel.value = map
  resetSchemas()
  props.formDataFun.getSelectMap = () => selectModel.value
})

const resetSchemas = () => {
  dynamicSchemas.value = props.datasource.filter(it => it.isShow).map(it => {
      // 动态切换
     if (it.field == 'unitValue') it.component = getFieldsValue()['unitType'] == 'etc' ?'Input':'Select'
     if (it.component === 'Select') it.list = selectModel.value[it.componentProps]
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
  :deep(.ant-select-selector), :deep(.ant-picker), :deep(.ant-input-affix-wrapper), .ant-input {
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
