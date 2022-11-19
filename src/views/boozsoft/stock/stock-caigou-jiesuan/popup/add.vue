<template>
  <BasicModal width="1300px"
              :height="500"
              v-bind="$attrs"
              :title="''"
              :maskClosable="false"
              :draggable="false"
              @ok="handleOk()"
              @cancel="handleClose()"
              @register="register">
    <template #title>
      <div style="display: flex;margin-left: 10px;margin-top: 5px;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;color: rgb(21, 142, 184)"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;color: rgb(21, 142, 184)">手动结算</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
        <div style="float: left;margin-right: 5px;">
          <span style="color: white;">供应商：</span>
          <Select style="width: 150px;" v-model:value="supNum" :filter-option="filterOption" :show-search="true">
            <SelectOption v-for="item in supList" :key="item.custAbbname" :value="item.id">{{item.custAbbname}}</SelectOption>
            <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
          </Select>
          &emsp;
          <span style="color: white;">到货截止日期：</span>
          <DatePicker v-model:value="dhDate" style="width: 120px;" format="YYYY-MM-DD"/>
          &emsp;
          <span style="color: white;">入库截止日期：</span>
          <DatePicker v-model:value="rkDate" style="width: 120px;" format="YYYY-MM-DD" @change="dateChange"/>
        </div>
        <div style="float: right;margin-right: 5px;">
          <button type="button" class="ant-btn ant-btn-me" @click="findByTable"><span>结算</span></button>
        </div>
      </div>
      <br>
      <div class="content-body">
        <span style="float: left;">{{hasBlank(apSourceFlag)?'':apSourceFlag=='1'?'采购发票':'采购到货单'}}</span>
        <BasicTable
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange,getCheckboxProps:rowSelection.getCheckboxProps}"
          :scroll="{ y: 140 }"
          :loading="tableLoading"
          :dataSource="dhTableData"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
          @row-click="rowClick"
        >
          <template #billStyle="{ record }">
            <span v-if="record.ccode!=''">
              {{ record.billStyle=='CGDHD'?'采购到货单':'期初到货单' }}
            </span>
          </template>
          <template #cnumber="{ record }"> {{ toThousandFilter(record.cnumber)}} </template>
          <template #remainCnumber="{ record }"> {{ toThousandFilter(record.remainCnumber)}} </template>
          <template #useCnumber="{ record }"> {{ toThousandFilter(record.useCnumber)}} </template>
          <template #price="{ record }"> {{ toThousandFilter(record.price)}} </template>
          <template #icost="{ record }"> {{ toThousandFilter(record.icost)}} </template>
        </BasicTable>
        <br>
        <span style="float: left;">入库单
        </span>
        <BasicTable
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys1, onChange: onSelectChange1,getCheckboxProps:rowSelection.getCheckboxProps }"
          :scroll="{ y: 140 }"
          :loading="table2Loading"
          :dataSource="rkTableData"
          class="alone-basic-table"
          size="small"
          @register="registerTable1"
          @row-click="rowClick1"
        >
          <template #billStyle="{ record }">
            <span v-if="record.ccode!=''">
              {{ record.billStyle=='CGRKD'?'采购入库单':'期初暂估入库单' }}
            </span>
          </template>
          <template #cnumber="{ record }"> {{ toThousandFilter(record.cnumber)}} </template>
          <template #remainCnumber="{ record }"> {{ toThousandFilter(record.remainCnumber)}} </template>
          <template #useCnumber="{ record }"> {{ toThousandFilter(record.useCnumber)}} </template>
          <template #price="{ record }"> {{ toThousandFilter(record.price)}} </template>
          <template #icost="{ record }"> {{ toThousandFilter(record.icost)}} </template>
          <template #newBaseQuantity="{ record }">
            <InputNumber style="text-align: right;" :max="record.max" :min="record.min" v-if="record.ccode!=undefined" v-model:value="record.newBaseQuantity" />
          </template>
        </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {reactive, ref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {SearchOutlined,CaretDownOutlined} from '@ant-design/icons-vue';
import { Select,Button, DatePicker, InputNumber, message, Radio,Popover as APopover } from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import dayjs from "dayjs";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";
import {findAllByBillStyleAndDdateAndCvencode} from "/@/api/record/system/stock-wareh";
import {findByStockPeriodIsClose} from "/@/api/record/stock/stock-ruku";
const ARangePicker=DatePicker.RangePicker
const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const emit = defineEmits(['register', 'query']);
const formItems = ref({ openOne: 0 })
const dhDate = ref('')
const rkDate = ref('')
const supNum = ref('')
const supList = ref([])
const tableLoading = ref(false)
const table2Loading = ref(false)
const dynamicTenant:any = ref('')
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const tableSelectedRowKeys1 = ref([])
const tableSelectedRowObjs1 = ref([])
const dhTableData:any = ref([])
const rkTableData:any = ref([])
const apSourceFlag:any = ref('')

const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled: record.billStyle==undefined
  }),
};

const [registerTable, { deleteSelectRowByKey,setTableData,getSelectRows,getDataSource}] = useTable({
  columns: [
    {
      title: '单据编号',
      dataIndex: 'ccode',
      width: '80px',
      align: 'left',ellipsis: true,
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: '80px',
      align: 'left',ellipsis: true,
    },
    {
      title: '存货',
      dataIndex: 'stockName',
      width: '110px',
      align: 'left',ellipsis: true,
    },
    {
      title: '规格型号',
      dataIndex: 'stockGgxh',
      width: '80px',ellipsis: true,
    },
    {
      title: '计量单位',
      dataIndex: 'unitName',
      width: '80px',
    },
    {
      title: '数量',
      dataIndex: 'cnumber',
      width: '80px',align: 'right',slots: {customRender: 'cnumber'}
    },
    {
      title: '未结算数量',
      dataIndex: 'remainCnumber',
      width: '90px',align: 'right',slots: {customRender: 'remainCnumber'}
    },
    {
      title: '结算数量',
      dataIndex: 'useCnumber',
      width: '80px',align: 'right',slots: {customRender: 'useCnumber'}
    },{
      title: '无税单价',
      dataIndex: 'price',
      width: '80px',align: 'right',slots: {customRender: 'price'}
    },{
      title: '无税金额',
      dataIndex: 'icost',
      width: '80px',align: 'right',slots: {customRender: 'icost'}
    }
  ],
  bordered: true,
  showIndexColumn: true,
  pagination: false,
  indexColumnProps:{ fixed:true },
})
const [registerTable1, { deleteSelectRowByKey:deleteSelectRowByKey1,setTableData:setTableData1,getSelectRows:getSelectRows1,getDataSource:getDataSource1}] = useTable({
  columns: [
    {
      title: '单据编号',
      dataIndex: 'ccode',
      width: '80px',
      align: 'left',ellipsis: true,
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: '80px',
      align: 'left',ellipsis: true,
    },
    {
      title: '存货',
      dataIndex: 'cinvode',
      width: '110px',
      align: 'left',ellipsis: true,
    },
    {
      title: '规格型号',
      dataIndex: 'ggxh',
      width: '80px',ellipsis: true,
    },
    {
      title: '计量单位',
      dataIndex: 'unitName',
      width: '80px',
    },
    {
      title: '数量',
      dataIndex: 'cnumber',
      width: '80px',align: 'right',slots: {customRender: 'cnumber'}
    },
    {
      title: '未结算数量',
      dataIndex: 'remainCnumber',
      width: '90px',align: 'right',slots: {customRender: 'remainCnumber'}
    },
    {
      title: '结算数量',
      dataIndex: 'useCnumber',
      width: '80px',align: 'right',slots: {customRender: 'useCnumber'}
    },{
      title: '无税单价',
      dataIndex: 'price',
      width: '80px',align: 'right',slots: {customRender: 'price'}
    },{
      title: '无税金额',
      dataIndex: 'icost',
      width: '80px',align: 'right',slots: {customRender: 'icost'}
    }
  ],
  bordered: true,
  showIndexColumn: true,
  pagination: false,
  indexColumnProps:{ fixed:true },
})

async function dateChange(data) {
  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenant.value.accountMode})({iyear:formatTimer(data).split('-')[0],month:formatTimer(data).split('-')[1]})
  if(temp>0){
    rkDate.value=null
    return message.error('单据日期已结账！')
  }
}

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
  if (num=='' || num==null || parseFloat(num)==0){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}
const filterOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  dynamicTenant.value=data.dynamicTenant
  apSourceFlag.value=data.dynamicTenant.target.apSourceFlag
  let ddata:any=[]
  for (let i = 0; i < 50; i++) { ddata.push({ccode:''}) }
  setTableData(ddata)
  let temp:any=[]
  for (let i = 0; i < 50; i++) { temp.push({ccode:''}) }
  setTableData1(temp)

  // 供应商
  findAllJieSuanSup(data.dynamicTenant.accountMode)
});

// 查询
const findByTable = async () => {
  if(hasBlank(supNum.value)){
    return message.error('请选择供应商！')
  }
  if(hasBlank(dhDate.value)){
    return message.error('请选择到货单截止日期！')
  }
  if(hasBlank(rkDate.value)){
    return message.error('请选择入库单截止日期！')
  }

  tableLoading.value=true
  table2Loading.value=true
  // 到货单
  let dhData:any=await useRouteApi(findAllByBillStyleAndDdateAndCvencode, {schemaName: dynamicTenant.value.accountMode})({billStyle:'CGDHD,QC',cvencode:supNum.value,ddate:formatTimer(dhDate.value)})
  dhTableData.value=dhData
  dhTableData.value.forEach(tx=>{
    tx.price=toThousandFilter(tx.price)
    tx.icost=toThousandFilter(tx.icost)
  })
  for (let i = dhTableData.value.length; i < 50; i++) { dhTableData.value.push({ccode:''}) }
  tableLoading.value=false

  // 入库单
  let rkData:any=await useRouteApi(findAllByBillStyleAndDdateAndCvencode, {schemaName: dynamicTenant.value.accountMode})({billStyle:'CGRKD,QT',cvencode:supNum.value,ddate:formatTimer(dhDate.value)})
  rkTableData.value=rkData
  rkTableData.value.forEach(tx=>{
    tx.price=toThousandFilter(tx.price)
    tx.icost=toThousandFilter(tx.icost)
  })
  for (let i = rkTableData.value.length; i < 50; i++) { rkTableData.value.push({ccode:''}) }
  table2Loading.value=false
}


const findAllJieSuanSup = async (accountMode) => {
  let temp = await useRouteApi(findStockCaiGouList, {schemaName: accountMode})('supplier')
  supList.value=temp.supplier
}

const onSelectChange = async (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}
const onSelectChange1 = async (k, o) => {
  tableSelectedRowKeys1.value = k
  tableSelectedRowObjs1.value = o
}

async function handleOk() {
  emit('throwData', {})
  closeModal()
  return true;
}
const {closeCurrent} = useTabs(router);
async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1)
    await closeCurrent()
  closeModal()
}

function transformTimestamp(timestamp){
  let a = new Date(timestamp).getTime();
  const date = new Date(a);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
  // const s = date.getSeconds(); // 秒
  const dateString = Y + M + D;
  return dateString;
}

function delRow() {
  if(tableSelectedRowObjs.value.length==0){
    message.error('请选择需要删除的数据！')
    return false
  }
  let list = getDataSource()
  let selectIndex = list.findIndex(it => tableSelectedRowKeys.value.indexOf(it.key)>0)
  list.splice(selectIndex, 1)
  let selectIndex2 = tableSelectedRowKeys.value.findIndex(it => tableSelectedRowKeys.value.indexOf(it)>0)
  tableSelectedRowKeys.value.splice(selectIndex2, 1)
  setTableData(list)
}

// 时间格式化
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
</script>
<style lang="less" scoped="scoped">
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
