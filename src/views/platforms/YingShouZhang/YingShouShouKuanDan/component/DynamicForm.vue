<template>
  <div class="dynamic-form">
    <BasicForm @register="register"  ref="formElRef">
      <template #busStyle="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" ref="busStyleRef">
          <template #suffixIcon><CaretDownOutlined/></template>
          <SelectOption value="PTSK">普通收款</SelectOption>
          <SelectOption value="YSK">预收款</SelectOption>
        </Select>
      </template>
      <template #cvencode="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" ref="cvencodeRef" :show-search="true"
                :filter-option="filterOption" @keyup.enter.native="focusNext(field)"
                :options="dynamicSchemas.filter(it=>it.field===field)[0]['componentProps']['options']">
          <template #option="{ value: val, label ,title }">{{ title }}</template>
          <template #suffixIcon>
            <SearchOutlined @click="exec(field)"/>
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

      <template #currency="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" ref="currencyRef">
          <template #suffixIcon><CaretDownOutlined/></template>
        </Select>
      </template>

      <template #itemCode="{ model, field }">
        <Select placeholder="请选择" v-model:value="model[field]" ref="itemCodeRef">
          <template #suffixIcon><CaretDownOutlined/></template>
        </Select>
      </template>

    </BasicForm>
  </div>
</template>
<script setup="props, { content } ,refs" lang="ts">
import {getCurrentInstance, ref, watch} from 'vue';
import {BasicForm, useForm} from "/@/components/Form";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {SearchOutlined,CaretDownOutlined} from '@ant-design/icons-vue';
import {Select} from "ant-design-vue";

const SelectOption = Select.Option;

const emit = defineEmits(['register', 'open']);
const props = defineProps(['datasource', 'formDataFun', 'accId', 'readOnly'])
const { proxy } = getCurrentInstance()
const defaultSchemas = [
  {
    field: 'field1',
    component: 'DatePicker',
    label: '收款日期：',
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
    label: '业务类型：',
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

function createItem(it) {
  return {
    field: it['field'],
    component: it['component'],
    label: it['label'] + "：",
    colProps: {
      span: it['component'] == 'DatePicker' ? 5 : 5,
    },
    required: it['required'],
    componentProps: (it['component'] == 'DatePicker' ? {locale: localeCn} : it['component'] == 'Select'?{
      options: it['list'],
    }:{ref: (it['field']+'Ref')}),
    slot: it['component'] == 'Select' ? it['field'] : null,
    /*    renderComponentContent: it['component'] == 'Select' || it['field']=='cvencode' ? () => {
          return {
            suffixIcon: () => {
              return createVNode(SearchOutlined);
            },
            click: ()=>{
              console.log('111111111')
            }
          };
        } : null,*/
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
  /*  let busDate = useCompanyOperateStoreWidthOut().getLoginDate
    //设置默认
    setFieldsValue({
      ddate: busDate,
      ccode: (((busDate.substring(0,7)).replace('-',''))+'0001'),
    })*/
  //查询对应数据
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
  }
  :deep(.ant-col-4){
    display: none;
  }
}
</style>
