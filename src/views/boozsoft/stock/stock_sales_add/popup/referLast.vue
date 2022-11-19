<template>
  <BasicModal width="950px"
              :height="600"
              v-bind="$attrs"
              :title="''"
              @ok="handleOk()"
              @cancel="handleClose()"
              @register="register">
    <template #title>
      <div style="display: flex;margin: 8px" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;color: rgb(21, 142, 184)"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;color: rgb(21, 142, 184)">参照 -  {{busTypeList[pageParameter.type]||''}}</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
        <div style="float: left;margin-right: 5px;">
          <Select style="width: 100px;" v-model:value="pageParameter.searchConditon.requirement">
            <SelectOption value="ccode">单据编码</SelectOption>
            <SelectOption value="cmemo">备注</SelectOption>
            <SelectOption value="dname">业务部门</SelectOption>
            <SelectOption value="buname">业务员</SelectOption>
            <SelectOption value="cmakerName">制单人</SelectOption>
            <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
          </Select>
          <a-input-search placeholder="" v-model:value="pageParameter.searchConditon.value" style="width: 200px; border-radius: 4px" @search="pageSearch"/>
        </div>
        <div style="float: right;margin-right: 5px;">
          <label style="color: white;font-weight: bold;">截至日期：{{pageParameter.dates[1]}}</label>&emsp;
<!--          <DatePicker v-model:value="pageParameter.dates[0]" :disabled-date="disabledDate" style="width: 114px;"  format="YYYY-MM-DD"  valueFormat="YYYY-MM-DD" />      <span>~  </span>
          <DatePicker v-model:value="pageParameter.dates[1]" :disabled-date="disabledDate" style="width: 114px;"  format="YYYY-MM-DD"  valueFormat="YYYY-MM-DD" />&emsp;
        -->
          <Button @click="findByTable">刷新</Button>
        </div>
      </div>
      <div class="content-body">
        <span style="float: left;">表头</span>
        <BasicTable
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange,getCheckboxProps:(record)=>({disabled:record.ccode == null})}"
          :scroll="{ y: 150 }"
          :loading="tableLoading"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
          @row-click="rowClick"
        >
          <template #billStyle="{ record }">
            <span>
            {{ busTypeList[record.billStyle]||''}}
            </span>
          </template>
          <template #isum="{ record }">
            {{ record.isum>0?parseFloat(record.isum).toFixed(2):'' }}
          </template>
        </BasicTable>
        <br>
        <span style="float: left;">表体
          &emsp;
          <span>共：{{ table1Length }} 条数据</span>
        </span>
        <BasicTable
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys1, onChange: onSelectChange1,getCheckboxProps:(record)=>({disabled:record.ccode == null})}"
          :scroll="{ y: 220 }"
          :loading="tableLoading"
          class="alone-basic-table"
          size="small"
          @register="registerTable1"
          @row-click="rowClick1"
        >
          <template #isumXiaohuo="{ record }">
            {{ record.isumXiaohuo>0?parseFloat(record.isumXiaohuo).toFixed(2):'' }}
          </template>
          <template #newBaseQuantity="{ record }">
            <InputNumber style="text-align: right;" :max="record.keyong" v-if="record.ccode!=undefined" v-model:value="record.newBaseQuantity" />
          </template>
          <template #baseQuantity="{ record }">
            {{ record.baseQuantity>0?parseFloat(record.baseQuantity).toFixed(2):'' }}
          </template>
          <template #cwhcodeNameJoin="{ record }">
            {{ record.cwhcodeNameJoin }}
          </template>
          <template #isum="{ record }">
            {{ record.isum>0?toThousandFilter(parseFloat(record.isum).toFixed(2)):'' }}
          </template>
        </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {ref, reactive, nextTick} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {SearchOutlined,CaretDownOutlined} from '@ant-design/icons-vue';
import {DatePicker, Select,Button,message,InputNumber} from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findAllByStockSalesListCcode, findAllSalesRefer} from "/@/api/record/stock/stock-xhd";

import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {DateTool} from "/@/api/task-api/tools/universal-tools";

const emit = defineEmits(['register', 'throwData']);
const SelectOption = Select.Option;

const pageParameter = reactive({
  list:'',
  type:'XSCKD',
  dates: [],
  searchConditon: {
    requirement: 'ccode',
    value: '',
  },
})
const busTypeList = {'XSCKD':'销售出库单','XSDD':'销售订单'}


const tableLoading = ref(false)
const iyear = ref('')
const startYm = ref('')
const database = ref('')
const sourceCust = ref('')
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const tableSelectedRowKeys1 = ref([])
const tableSelectedRowObjs1 = ref([])
const table1Length = ref(0)

const [registerTable, { deleteSelectRowByKey,setTableData,getSelectRows,getDataSource}] = useTable({
  columns: [
    {
      title: '单据类型',
      dataIndex: 'billStyle',
      width: '100px',
      align: 'left',slots: {customRender: 'billStyle'}
    },
    {
      title: '单据编码',
      dataIndex: 'ccode',
      width: '140px',
      align: 'left'
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: '100px',
    }, {
      title: '备注',
      dataIndex: 'cmemo',
      width: '120px',ellipsis: true,
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      width: '80px',align: 'right',slots: {customRender: 'isum'}
    },
    {
      title: '业务部门',
      dataIndex: 'dname',
      width: '80px',
    },
    {
      title: '业务员',
      dataIndex: 'buname',
      width: '80px',
    },
    {
      title: '制单人',
      dataIndex: 'cmakerName',
      width: '80px',
    }
  ],
  bordered: true,
  showIndexColumn: true,
  pagination: false,
})
const [registerTable1, { deleteSelectRowByKey:deleteSelectRowByKey1,setTableData:setTableData1,getSelectRows:getSelectRows1,getDataSource:getDataSource1}] = useTable({
  columns: [
    {
      title: '存储位置',
      dataIndex: 'cwhcodeNameJoin',
      width: '100px',
      align: 'left',ellipsis: true,slots: {customRender: 'cwhcodeNameJoin'}
    },
    {
      title: '条形码',
      dataIndex: 'bcheck1',
      width: '100px',
      align: 'left',
    }, {
      title: '存货编码',
      dataIndex: 'cinvode',
      width: '100px',
      align: 'left',
    },
    {
      title: '存货名称',
      dataIndex: 'stockName',
      width: '100px',
      align: 'left',ellipsis: true,
    },
    {
      title: '规格型号',
      dataIndex: 'stockGgxh',
      width: '100px',
      align: 'left',
    },{
      title: '主计量',
      dataIndex: 'unitName',
      width: '100px',
      align: 'center',
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      width: '100px',
      align: 'right',slots: {customRender: 'baseQuantity'}
    },{
      title: '价税合计',
      dataIndex: 'isum',
      width: '100px',
      align: 'right',ellipsis: true,slots: {customRender: 'isum'}
    },{
      title: '累计销货数量',
      dataIndex: 'isumXiaohuo',
      width: '120px',
      align: 'right',ellipsis: true,slots: {customRender: 'isumXiaohuo'}
    },{
      title: '本次使用',
      dataIndex: 'newBaseQuantity',
      width: '100px',
      align: 'right',slots: {customRender: 'newBaseQuantity'}
    },{
      title: '批号',
      dataIndex: 'batchId',
      width: '100px',
      align: 'left',ellipsis: true,
    },
  ],
  bordered: true,
  showIndexColumn: true,
  pagination: false,
})

function rowClick(a) {
  if(a.id==undefined){
    deleteSelectRowByKey(a.key)
  }
}
function rowClick1(a) {
  if(a.id==undefined){
    deleteSelectRowByKey1(a.key)
  }
}
//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  sourceCust.value=data.cvencode
  database.value=data.dynamicTenant.accountMode
  pageParameter.type = data.type
  startYm.value = data.dynamicTenant?.target?.startDate
  nextTick(async ()=>{
    let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
    let ym = data.dynamicTenant?.target?.startDate
    iyear.value=busDate.substring(0,4)
    if (null != ym && ym.indexOf( iyear.value)!=-1)startYm.value = ym+'-01'
    pageParameter.dates = [  ym+'-01',busDate]
    findByTable()
    let temp:any=[]
    for (let i = 0; i < 10; i++) {
      temp.push({})
    }
    setTableData1(temp)
  })
});

async function findByTable(){
  if (hasBlank(pageParameter.dates[0]) || hasBlank(pageParameter.dates[1])){
    message.warn('请完善日期后在进行选单！')
    return false
  }

  tableLoading.value=true
  findByTable1()
  let map={
    dates:pageParameter.dates,
    cvencode:sourceCust.value,
    type:pageParameter.type=='XHD'?['QCXHD','XHD']:[pageParameter.type]
  }
  let data=await useRouteApi(findAllSalesRefer, {schemaName: database})(map)
  for (let i = 0; i < 50-data.length; i++) {
    data.push({})
  }

  setTimeout(()=>{
    setTableData(data)
    tableLoading.value=false
  },300)
}
async function findByTable1(){
  tableSelectedRowKeys.value=[]
  tableSelectedRowObjs.value=[]
  tableSelectedRowKeys1.value=[]
  tableSelectedRowObjs1.value=[]
  setTableData1([])
  let temp:any=[]
  for (let i = 0; i < 10; i++) {
    temp.push({})
  }
  setTableData1(temp)
}


const onSelectChange = async (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o

  let tempObj:any=tableSelectedRowObjs.value.filter(a=>!hasBlank(a.ccode))
  if(tempObj.length>0){
    let stockWarehList=await useRouteApi(findAllByStockSalesListCcode, {schemaName: database})(tempObj.map(a=>a.ccode))
    stockWarehList.forEach( (list)=>{
      // 计算出 本次使用
      let baseQuantity=hasBlank(list.baseQuantity)?0:parseFloat(list.baseQuantity)
      let isumXiaohuo=hasBlank(list.isumXiaohuo)?0:parseFloat(list.isumXiaohuo)
      let keyong=baseQuantity-isumXiaohuo
      list.keyong=keyong
      list.newBaseQuantity=keyong
    })
    stockWarehList = stockWarehList.filter(it=>it.keyong > 0)
    stockWarehList.forEach(async (list)=>{
      let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: database})(  {id:list.cwhcode})
      list.cwhcodeNameJoin=cangkuJoinName[0]?.cangkuRecordJoinName})
    let temp:any=[]
    for (let i = 0; i < 10-stockWarehList.length; i++) {
      temp.push({})
    }
    setTimeout(()=>{
      setTableData1(stockWarehList.concat(temp))
      table1Length.value=stockWarehList.length
    },200)
    if (stockWarehList.length == 0)
    message.info('该单据已完成全部销货！')
  }else{
    setTableData1([])
    let temp:any=[]
    for (let i = 0; i < 10; i++) {
      temp.push({})
    }
    setTableData1(temp)
    table1Length.value=getDataSource1().filter(a=>!hasBlank(a.ccode)).length
  }
}
const onSelectChange1 = async (k, o) => {
  tableSelectedRowKeys1.value = k
  tableSelectedRowObjs1.value = o
}
async function handleOk() {
  if(tableSelectedRowObjs1.value.length==0){
    return message.error('请选择表体数据！')
  }
  let list:any=tableSelectedRowObjs1.value.filter(a=>!hasBlank(a.id))
  list.forEach(a=>{
    a.id=null
    a.oldBaseQuantity=a.baseQuantity
    a.baseQuantity=a.newBaseQuantity
    a.sourcedetailId=a.lineCode
    a.sourcetype=a.billStyle
    a.sourcecode=a.ccode
    a.sourcedate=a.ddate
  })
  emit('throwData', list)
  closeModal()
  return true;
}
const {closeCurrent} = useTabs(router);
async function handleClose() {
  closeModal()
}

import moment from 'moment';
const disabledDate = (current) => {
    return current < moment(startYm.value+'-01', 'YYYY-MM-DD')
}
const searchList = ref([])
const pageSearch = async (v) => {
  if (searchList.value.length == 0) searchList.value = getDataSource().filter(it => it.key != null && it.ccode != null);
  let newList = hasBlank(v) ? searchList.value : searchList.value.filter(it => it[pageParameter.searchConditon.requirement]?.indexOf(v) != -1)
  let len = newList.length
  for (let i = 0; i < (25 - len); i++) {
    newList.push({})
  }
  setTableData(newList)
}
</script>
<style lang="less" scoped="scoped">
@import '/@/assets/styles/part-open.less';
@import '/@/assets/styles/alone-basic-table.less';

.nc-query-open-content {
  padding: 1%;
  height: 100%;

  .content-head {
    text-align: left;
    margin-bottom: 1em;
  }
}
</style>
