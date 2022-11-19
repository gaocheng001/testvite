<template>
  <div class="dynamic-form">
    <BasicForm @register="register" ref="formElRef">
      <template #YeWuDate="{ model, field }">
        <DatePicker placeholder="" :locale="localeCn"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"

                    v-model:value="model[field]"/>
      </template>
      <template #cangku="{ model, field }">
        <Select :options="ckListOptions.map(it=>({value: it.id,label: it.ckName}))"></Select>
      </template>
      <template #YeWuYan="{ model, field }">
        <Select :options="optionsGroup.user"></Select>
      </template>
      <template #YeWuBuMen="{ model, field }">
        <Select :options="optionsGroup.dept"></Select>
      </template>
      <template #JieYongDanWei>
        <Select v-if="true" :option="optionsGroup.supplier"></Select>
        <Select v-else-if="false" :option="optionsGroup.cust"></Select>
        <Select v-else :option="optionsGroup.user"></Select>
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
                @keyup.enter.native="focusNext(field)" option-label-prop="label"
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

    </BasicForm>
  </div>
</template>
<script setup="props, { content } ,refs" lang="ts">
import {getCurrentInstance, inject, onMounted, provide, ref, watch} from 'vue';
import {BasicForm, useForm} from "/@/components/Form";
import {findStockCaiGouList,} from "/@/api/record/stock/stock-caigou";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {SearchOutlined} from '@ant-design/icons-vue';
import {Select, DatePicker} from "ant-design-vue";
import moment from "moment";
const dynamicTenantId=inject('dynamicTenantId')

const emit = defineEmits(['update:getFormValue','register', 'open']);
const props = defineProps(['datasource', 'formDataFun', 'accId', 'readOnly'])
const {proxy} = getCurrentInstance()
const ckListOptions=inject('ckListOptions')
const defaultSchemas = [

  {
    field: 'DanJuBianMa',
    component: 'Input',
    label: '单据编码：',
    componentProps: {placeholder:' '},
    required: true,
    colProps: {
      span: 7,
    }
  },
  {
    field: 'YeWuDate',
    component: 'Input',
    label: '单据日期：',
    required: true,
    slot: 'YeWuDate',
    colProps: {
      span: 5,
    }
  },
  {
    field: 'JieYongType',
    label: '借用类型：',
    component: 'Select',
    componentProps: {
      placeholder:' ',
      options: [
        {key: 1, value: 1, label: '供应商'},
        {key: 2, value: 2, label: '客户'},
        {key: 3, value: 3, label: '员工'},
      ],
    },
    required: true,
    colProps: {
      span: 5,
    }
  },
  {
    field: 'JieYongDanWei',
    component: 'Input',
    label: '借用单位：',
    required: true,
    slot: 'JieYongDanWei',
    colProps: {
      span: 5,
    }
  },
  {
    field: 'cangku',
    component: 'Input',

    label: '仓库：',
    slot: 'cangku',
    required: true,
    colProps: {
      span: 5,
    }
  },
  {
    field: 'YeWuYan',
    component: 'Input',
    label: '业务员：',
    slot: 'YeWuYan',
    required: true,
    colProps: {
      span: 5,
    }
  },
  {
    field: 'YeWuBuMen',
    component: 'Input',
    label: '业务部门：',
    required: true,
    slot: 'YeWuBuMen',
    colProps: {
      span: 5,
    }
  },
  {
    field: 'remarks',
    component: 'Input',
    label: '备注：',
    componentProps: {
      placeholder:' '
    },
    colProps: {
      span: 7,
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
    componentProps: (it['component'] == 'DatePicker' ? {locale: localeCn} : it['component'] == 'Select' ? {
      options: it['list'],
    } : {ref: (it['field'] + 'Ref')}),
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
  labelWidth: 72,
  /*  actionColOptions: {
      span: 24,
    },*/
  showResetButton: false,
  showSubmitButton: false,
  schemas: defaultSchemas,
  autoFocusFirstItem: false,
});

onMounted(()=>{
  setTimeout(()=>{
    setFieldsValue({
      'DanJuBianMa':' JY-202204-0001',
      YeWuDate:moment().format(),
      JieYongType:1
    })
  },2000)
})
const filterOption = (input: string, option: any) => {
  return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
emit('update:getFormValue',getFieldsValue)
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
const optionsGroup=ref({})
const hello=ref([{key:1,label:2,value:3}])
onMounted(async () => {
  setTimeout(async ()=>{
    const findStockCaiGouListRouteApi =  useRouteApi(findStockCaiGouList, {schemaName: dynamicTenantId.value})
    const RecordArr=await findStockCaiGouListRouteApi('supplier,dept,user,cust')

    optionsGroup.value={
      supplier:RecordArr.supplier.map(it=>({key:it.uniqueCode,value:it.uniqueCode,label:it.custName,target:it})),
      dept:RecordArr.dept.map(it=>({key:it.uniqueCode,value:it.uniqueCode,label:it.deptName,target:it})),
      user:RecordArr.user.map(it=>({key:it.uniqueCode,value:it.uniqueCode,label:it.psnName,target:it})),
      cust:RecordArr.cust.map(it=>({key:it.uniqueCode,value:it.uniqueCode,label:it.label,target:it}))

    }
    hello.value=RecordArr.dept.map(it=>({key:it.uniqueCode,value:it.uniqueCode,label:it.deptName,target:it}))

  },2000)
})

</script>
<style lang="less" scoped="scoped">
.dynamic-form {
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

  :deep(.ant-col) {
    margin-left: 1em;

    .ant-form-item-label {
      text-align: left;

      .ant-form-item-no-colon {
        font-weight: bold;
        color: #666666;
      }
    }
  }

  :deep(.ant-col-4) {
    display: none;
  }
}
</style>
