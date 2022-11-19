<template>
  <BasicModal
    width="600px"
    v-bind="$attrs"
    :ok-text="'确定'"
    :showOkBtn="showNext"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
    :canFullscreen="false"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">销售管理</span>
      </div>
    </template>
    <div class="nc-open-content" style="height: 100%">
      <SecondaryTitle>请选择{{step=='1'?'存货':'客户'}}</SecondaryTitle>
      <span style="margin-left: 1em;color: black;font-weight: bold;">{{
          step===0 ?'步骤一：添加并完善销货单表头信息':step===1 ?'步骤二：选择并添加需要批量销售的存货':'步骤三：选择并添加需要批量销售的客户'
        }}</span>
      <div class="content-down">
          <BasicTable
            :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onSelect: onSelectChange ,getCheckboxProps: onCheckChange}"
            :scroll="{ y: 340 }"
            class="alone-basic-table"
            size="small"
            @register="registerTable"
          >
            <template #codeList="{ record }">
              {{JsonTool.parseObj(record.codeList).length}}
            </template>
          </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import {nextTick, reactive, ref, unref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {useMessage} from "/@/hooks/web/useMessage";
import {DatePicker, Input, Radio, Select,Button} from 'ant-design-vue';
import {PaperClipOutlined, PlusCircleOutlined,AppstoreOutlined,CaretDownOutlined} from '@ant-design/icons-vue';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";
import {useCompanyOperateStoreWidthOut} from '/@/store/modules/operate-company';
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import { findXclByZero} from "/@/api/record/stock/stock-xhd";
import SecondaryTitle from "/@/views/boozsoft/stock/stock_piliang/popup/SecondaryTitle.vue";
import {useTable} from "/@/components/Table";

import BasicTable from "/@/components/Table/src/BasicTable.vue";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import {findAllCustGroupInfo} from "/@/api/record/system/customer_zu";
import {getStockList} from "/@/api/record/stock/stock-currents";
const {createWarningModal} = useMessage()
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const SelectOption = Select.Option

const emit = defineEmits(['register','save'])
const formItems = ref({
  id: null,
  ccode: '',
  ddate: '',
  cdepcode: '',
  cwhcode: '',
  cinvodes: [],
  cvencodes: [],
  cvencodesJs: [],
  openOne: 0
})
const step = ref(0)
const isEdit = ref(true)
const showNext = ref(false)
const focus1 = ref(null)
const focus2 = ref(null)
const focus3 = ref(null)
const focus4 = ref(null)
const focus5 = ref(null)

const selectModel = ref({})
const dynamicTenant = ref('')
const queryCwhcode = ref('')
const searchConditon = reactive({
  requirement:'stockNum',value:'',radio: 'all'
})
const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  step.value = data.data
  dynamicTenant.value = data.tenant
  queryCwhcode.value = data.cwhcode
  if(null != data?.radio) searchConditon.radio = data.radio
    tableSelectedRowKeys.value=[]
  setModalProps({minHeight: 300});
  // 获取最新订单号 与 业务日期
  nextTick(async ()=>{
      selectModel.value = (await useRouteApi(findStockCaiGouList, {schemaName: dynamicTenant.value.accountMode})('cust,stock'))
    await  reloadTable(step.value)
    showNext.value = true
  })
})

const [registerTable, {getDataSource, setTableData,setColumns}] = useTable({
  bordered: true,
  showIndexColumn: false,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['50'],
    showTotal: t => `总共${t}条数据`
  },
})

async function handleOk() {
  showNext.value = false;
  if (step.value == 1){
    if (tableSelectedRowKeys.value.length == 0){
      createWarningModal({title: '温馨提醒', content: "请先选中存货！"});
      showNext.value = true
      return false;
    }
  }else {
    if (tableSelectedRowKeys.value.length == 0){
      createWarningModal({title: '温馨提醒', content: "请先选中客户！"});
      showNext.value = true
      return false;
    }
  }
  let list = []
  if (searchConditon.radio == 'all'){
    list = getDataSource().filter(it=>tableSelectedRowKeys.value.indexOf(it.key)!=-1)
  }else {
    let code = JsonTool.parseObj(getDataSource().filter(it=>tableSelectedRowKeys.value.indexOf(it.key)!=-1)[0]?.codeList)
    let custList = selectModel.value['cust']
    list = custList.filter(it=>code.indexOf(it.uniqueCode) !=-1).map(it=>{
      if (!hasBlank(it.uniqueCodeCcus)){
        let e = custList.filter(it=>it.id == it.uniqueCodeCcus)[0]
        it.custCode2 =e.custCode
        it.custName2 =e.custName
      }else {
        it.custCode2 = it.custCode
        it.custName2 = it.custName
      }
      return it;
    })
  }
  emit('save', {list: list})
  closeModal()
}
async function handleClose(e) {
  closeModal()
  return true;
}
const resetColumn = (v) => {
  return (v == 1?[
    {
      title: '存货编码',
      dataIndex: 'stockNum',
      width: '100px',
      align: 'left',
    },
    {
      title: '存货名称',
      dataIndex: 'stockName',
      width: '150px',
      align: 'left',
    },
    {
      title: '规格型号',
      dataIndex: 'stockGgxh',
      width: '100px',
      align: 'left',
    },
    {
      title: '批号',
      dataIndex: 'batchId',
      width: '80px',
      align: 'center'
    } ,
    {
      title: '可用量',
      dataIndex: 'keyong',
      width: '80px',
      align: 'center'
    },{
      title: '失效日期',
      dataIndex: 'dvdate',
      width: '80px',
      align: 'center'
    }
  ]:(searchConditon.radio == 'all'?[
    {
    title: '客户编码',
    dataIndex: 'custCode',
    width: '100px',
    align: 'left',
  },
    {
      title: '客户名称',
      dataIndex: 'custName',
      width: '150px',
      align: 'left',
    },{
      title: '结算客户编码',
      dataIndex: 'custCode2',
      width: '100px',
      align: 'left',
    },
    {
      title: '结算客户名称',
      dataIndex: 'custName2',
      width: '150px',
      align: 'left',
    }]:[{
    title: '客户组编码',
    dataIndex: 'ccode',
    width: '100px',
    align: 'left',
  },
    {
      title: '客户组名称',
      dataIndex: 'custGroupName',
      width: '200px',
      align: 'left',
    },{
      title: '所属客户数量',
      dataIndex: 'codeList',
      width: '100px',
      align: 'center', slots: { customRender: 'codeList' }
    }]))
}
const stockXcList = ref([])
const custGtoupList = ref([])
const tableList = ref([])
const tableSelectedRowKeys = ref([])
const onSelectChange = (record, selected, obj, nativeEvent) => {
  tableSelectedRowKeys.value = obj.map(v => v.key)
}
const onCheckChange = (record) => {
  return {disabled: (step.value==1? record.stockNum==null:record.custCode==null &&record.ccode==null)}
}
const reloadTable = async (v)=>{
  // 重新加载数据
  if (stockXcList.value.length == 0){
    let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
    // stockXcList.value = (await useRouteApi(findXclByZero, {schemaName: dynamicTenant.value.accountMode})({year: busDate.substring(0,4)})) || []
    let checks=[];if (dynamicTenant.value?.target?.kcCgrkCheck == '1')checks.push('cg');if (dynamicTenant.value?.target?.kcXsckCheck == '1')checks.push('xs');
    stockXcList.value =[]
    stockXcList.value =  await useRouteApi(getStockList, {schemaName: dynamicTenant.value.accountMode})({
      year: busDate.split('-')[0],mode:'all',checks: JsonTool.json(checks),
      parameters: JsonTool.json([queryCwhcode.value])
    })
  }
  let list = []
  if (v == 1){
    let stockList =  selectModel.value['stock']
    list = JsonTool.parseProxy(stockXcList.value).map(it=>{
      let st = stockList.filter(a=>a.stockNum ==  it.stockId)[0]
      it.stockNum = it.stockId
      it.batchId = it.batchNumber
      it.keyong = it.baseQuantity
      it.stockName = st.stockName
      it.stockGgxh = st.stockGgxh
      return it
    })
    tableList.value = list
  }else {
    if (custGtoupList.value.length == 0){
      custGtoupList.value = (await useRouteApi(findAllCustGroupInfo, {schemaName: dynamicTenant.value.accountMode})({})) || []
    }
    if (searchConditon.radio == 'all'){
      let custList =  selectModel.value['cust']
      list = custList.map(it=>{
        if (!hasBlank(it.uniqueCodeCcus)){
          let e = custList.filter(it=>it.id == it.uniqueCodeCcus)[0]
          it.custCode2 =e?.custCode
          it.custName2 =e?.custName
        }else {
          it.custCode2 = it?.custCode
          it.custName2 = it?.custName
        }
        return it;
      })
    }else {
      list = JsonTool.parseProxy(custGtoupList.value)
    }
    tableList.value = list
  }
  // 重新加载列
  setColumns(resetColumn(v))
  setTableData(list)
}

</script>
<style lang="less" scoped>
@import '/@/assets/styles/redTitle-open.less';
@import '/@/assets/styles/alone-basic-table.less';
:deep(.ant-calendar-picker-input.ant-input),
:deep(.ant-select-single:not(.ant-select-customize-input)
  .ant-select-selector
  .ant-select-selection-search-input), :deep(.ant-picker), :deep(.ant-input-number), :deep(.ant-input-password) {
  border: none;
  width: 100%;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  text-align: center;
}

:deep(.ant-form-item-control button) {
  display: none;
}

:deep(.ant-input-number-input) {
  width: 100%;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
}

:deep(.ant-input-number) {
  width: 90%;
  border: none;
}

:deep(.nc-open-content input ) {
  width: 100% !important;
}

:deep(.ant-calendar-picker-input) {
  text-align: center;
}

:deep(.ant-select-single:not(.ant-select-customize-input)
  .ant-select-selector
  .ant-select-selection-search-input) {
  border: none !important;
}

.nc-open-content-look {
  pointer-events: none;
  cursor: default;
}

.nc-open-content {
  padding: 0;
  color: #666666;

  > .content-down {
    text-align: center;
  }

  input {
    width: 32%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  :deep(.ant-upload-picture-card-wrapper) {
    width: 88px;

    .ant-upload-select-picture-card {
      width: 280px;
      height: 80px;
      margin-right: 0;
      margin-bottom: 0;

      .ant-upload {
        //padding: 0;
      }
    }
  }

  :deep(.ant-cascader-input) {
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

  label:not(.ant-radio-button-wrapper) {
    text-align: left;
    width: 100px;
    display: inline-block;
   color: #666666;
  }

  .red_span {
    color: red;
    font-weight: bold;
    display: inline-block;
    width: 20px;
    text-align: right;
  }

  .red_span2 {
    color: #0096c7;
    cursor: pointer;
    font-weight: bold;
    display: inline-block;
    width: 20px;
    text-align: right;
  }
  .special-border-div {
    position: relative;
    border: 1px #acabab solid;
    margin: 2.5% 1%;

    > span {
      position: absolute;
      top: -12px;
      left: 50px;
      font-size: 14px;
      background: white;
      padding: 0 15px;
    }

    > div {
      margin: 15px;
      color: black;
      >div{
        display: inline-block;width: 100%;
      }
    }
  }
}

:deep(.ant-select-disabled) {
  .ant-select-selector {
    background-color: white !important;
    color: black !important;
  }
}
</style>
