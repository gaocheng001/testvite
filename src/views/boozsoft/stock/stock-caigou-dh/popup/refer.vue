<template>
  <BasicModal width="950px"
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
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;color: rgb(21, 142, 184)">采购{{ pageParameter.type=='CGRKD'?'入库单':'订单'}}生单参照</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
        <div style="float: left;margin-right: 5px;">
          <Select style="width: 150px;" v-model:value="pageParameter.searchConditon.requirement">
            <SelectOption value="ccode">单据编码</SelectOption>
            <SelectOption value="dname">业务部门</SelectOption>
            <SelectOption value="buname">业务员</SelectOption>
            <SelectOption value="cmakerName">制单人</SelectOption>
            <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
          </Select>
          <a-input-search placeholder="" v-model:value="pageParameter.searchConditon.value" style="width: 200px; border-radius: 4px" @search="findByTable"/>
          <span style="margin-left: 200px;color: white;">
            截止日期：
            {{pageParameter.ddate }}
          </span>
        </div>

        <div style="float: right;margin-right: 5px;">
          <button type="button" class="ant-btn ant-btn-me" @click="findByTable"><span>刷新</span></button>
        </div>
      </div>
      <br>
      <div class="content-body">
        <span style="float: left;">表头</span>
        <BasicTable
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange,getCheckboxProps:rowSelection.getCheckboxProps}"
          :scroll="{ y: 150 }"
          :loading="tableLoading"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
          @row-click="rowClick"
        >
          <template #billStyle="{ record }">
            <span v-if="record.ccode!=undefined">
              {{ record.billStyle=='CGDD'?'采购订单':record.billStyle=='CGRKD'?'采购入库单':record.billStyle=='QCZGRKD'?'期初暂估入库单':'' }}
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
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys1, onChange: onSelectChange1,getCheckboxProps:rowSelection.getCheckboxProps }"
          :scroll="{ y: 140 }"
          :loading="table2Loading"
          class="alone-basic-table"
          size="small"
          @register="registerTable1"
          @row-click="rowClick1"
        >
          <template #isumDaohuo="{ record }">
            {{ !hasBlank(record.isumDaohuo)?parseFloat(record.isumDaohuo).toFixed(2):'' }}
          </template>
          <template #newBaseQuantity="{ record }">
            <InputNumber style="text-align: right;" :max="record.max" :min="record.min" v-if="record.ccode!=undefined" v-model:value="record.newBaseQuantity" />
          </template>
        </BasicTable>
      </div>
    </div>

    <ModalPop @throwData="modalData" @register="registerModalPopPage" />
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {reactive, ref} from 'vue';
import {BasicModal, useModal, useModalInner} from '/@/components/Modal';
import {SearchOutlined} from '@ant-design/icons-vue';
import {Button, DatePicker, InputNumber, message, Radio, Select } from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
// import ModalPop from '/@/views/boozsoft/system/supplier/popup/modalPop.vue';
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findAllCGRKD_And_QCZGRKHD} from "/@/api/record/stock/stock-ruku";
import {findAllByStockWarehListCcode, getUnitRate} from "/@/api/record/system/stock-wareh";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {findByStockNum2} from "/@/api/record/stock/stock";
import dayjs from "dayjs";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findByXyDataMainSourrceMap, findByXySyCcode} from "/@/api/record/stock/stock-xy-source";
import {object} from "vue-types";
import {getByStockBalanceTask, stockBalanceTaskSave} from "/@/api/record/stock/stock_balance";
const ARangePicker=DatePicker.RangePicker
const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled: record.billStyle==undefined
  }),
};
const pageParameter:any = reactive({
  list:'',
  type:'CGDHD',
  ddate: '',
  searchConditon: {
    requirement: 'ccode',
    value: '',
  },
})
const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const emit = defineEmits(['register', 'query']);
const formItems = ref({
  openOne: 0
})
const tableLoading = ref(false)
const table2Loading = ref(false)
const iyear = ref('')
const database = ref('')
const accId = ref('')
const sourceDate:any = ref([])
const sourceType = ref('采购订单')
const sourceTypeList = ref([{title:'采购订单',value:'采购订单'},{title:'采购到货单',value:'采购到货单'},{title:'采购发票',value:'采购发票'}])
const sourceCust = ref('')
const sourceCwhcode = ref('')
const sourceCustList:any = ref([])
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const tableSelectedRowKeys1 = ref([])
const tableSelectedRowObjs1 = ref([])
const table1Length = ref(0)
const referType:any = ref('')
const titleValue:any = ref(0)

const [registerModalPopPage, { openModal: openMoalPopPage }] = useModal();

const [registerTable, { deleteSelectRowByKey,setTableData,getSelectRows,getDataSource}] = useTable({
  columns: [
    {
      title: '单据类型',
      dataIndex: 'billStyle',
      width: '150px',
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
      title: '计量单位',
      dataIndex: 'unitName',
      width: '80px',
      align: 'center',
    },{
      title: '可用数量',
      dataIndex: 'isumDaohuo',
      width: '80px',
      align: 'right',ellipsis: true,slots: {customRender: 'isumDaohuo'}
    },{
      title: '参照数量',
      dataIndex: 'newBaseQuantity',
      width: '100px',
      align: 'right',slots: {customRender: 'newBaseQuantity'}
    },{
      title: '批号',
      dataIndex: 'batchId',
      width: '100px',
      align: 'left',ellipsis: true,
    }, {
      title: '仓储位置',
      dataIndex: 'cwhcodeNameJoin',
      width: '100px',
      align: 'left',ellipsis: true
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
const filterOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  sourceCust.value=data.cvencode
  sourceCwhcode.value=data.cwhcode
  accId.value=data.dynamicAccId
  database.value=data.dynamicTenantId
  iyear.value=data.iyear
  referType.value=data.referType
  titleValue.value=data.titleValue
  pageParameter.type=data.referType
  pageParameter.ddate=formatTimer(data.ddate)

  findByTable()
  let temp:any=[]
  for (let i = 0; i < 25; i++) {
    temp.push({})
  }
  setTableData1(temp)
});

async function findByTable(){
  tableLoading.value=true
  findByTable1()

  let map={
    iyear:iyear.value,
    cvencode:sourceCust.value,
    cwhcode:pageParameter.type=='CGDD'?'':sourceCwhcode.value,
    type:pageParameter.type,
    searchConditon:pageParameter.searchConditon,
    startDate:formatTimer(pageParameter.ddate).split('-')[0]+'-01-31',
    endDate:formatTimer(pageParameter.ddate),
    titleValue:titleValue.value
  }

  let data=await useRouteApi(findAllCGRKD_And_QCZGRKHD, {schemaName: database})(map)
  // swsIsumDaohuo 是 数量 减 累计到货单数量 不等于0。来源不是到货单
  data=data.filter(a=>a.swsIsumDaohuo!=0&&a.sourcetype!='CGDHD')
  let data2:any=[]
  for (let i = 0; i < data.length; i++) {
    if(pageParameter.type=='CGDD'){
      // 判断订单下游表是否有入库单
      let existCGDHD=await useRouteApi(findByXySyCcode, {schemaName: database})({xytype:'CGRKD',sytype:'CGDD',syccode:data[i].ccode})
      console.log('到货单操作：5--->判断订单'+data[i].ccode+'下游表是否有入库单-->'+existCGDHD.length)
      if(existCGDHD.length==0){
        data2.push(data[i])
      }
    }else{
      data2.push(data[i])
    }
  }
  let ddata:any=data2
  for (let i = 0; i < 50-ddata.length; i++) {
    ddata.push({})
  }

  setTimeout(()=>{
    setTableData(ddata)
    tableLoading.value=false
    table2Loading.value=false
  },300)
}
async function findByTable1(){
  tableSelectedRowKeys.value=[]
  tableSelectedRowObjs.value=[]
  tableSelectedRowKeys1.value=[]
  tableSelectedRowObjs1.value=[]
  setTableData1([])
  let temp:any=[]
  for (let i = 0; i < 25; i++) {
    temp.push({})
  }
  setTableData1(temp)
}


const onSelectChange = async (k, o) => {
  let methodName=pageParameter.type=='CGDD'?'采购订单':'采购入库单'
  for (let i = 0; i < o.length; i++) {
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: database })({iyear:iyear.value,name:methodName,method:'弃审',recordNum:o[i].ccode})
    if(taskData.length>0){
      return message.error('来源单据正在被操作员'+taskData[0]?.username+'进行弃审操作，任务冲突，请销后再试！')
    }
  }
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
  table2Loading.value=true
  let tempObj:any=tableSelectedRowObjs.value.filter(a=>!hasBlank(a.ccode))
  if(tempObj.length>0){
    let stockWarehList=await useRouteApi(findAllByStockWarehListCcode, {schemaName: database})(tempObj.map(a=>a.ccode))
    stockWarehList.forEach(async (list)=>{
      let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: database})(  {id:list.cwhcode})
      list.cwhcodeNameJoin=cangkuJoinName[0]?.cangkuRecordJoinName

     let stock= await useRouteApi(findByStockNum2, {schemaName: database})(list.cinvode)
      if(!hasBlank(stock.stockUnitId)&& list.cgUnitId==stock.stockUnitId){
        list.stockGgxh=stock.stockGgxh
        list.bcheck1=stock.stockBarcode
      }else if(!hasBlank(stock.stockUnitId1)&& list.cgUnitId==stock.stockUnitId1){
        list.stockGgxh=stock.stockUnitGgxh1
        list.bcheck1=stock.stockUnitBarcode1
      }else if(!hasBlank(stock.stockUnitId2)&& list.cgUnitId==stock.stockUnitId2){
        list.stockGgxh=stock.stockUnitGgxh2
        list.bcheck1=stock.stockUnitBarcode2
      }

      // 计算出 本次使用
      let baseQuantity:any=hasBlank(list.baseQuantity)?0:parseFloat(list.baseQuantity)
      let isumDaohuo=hasBlank(list.isumDaohuo)?0:parseFloat(list.isumDaohuo)

      let unitRate= await useRouteApi(getUnitRate, {schemaName: database})({cgUnitId:list.cgUnitId,ccode:list.ccode})
      list.newBaseQuantity=baseQuantity-isumDaohuo!=0?(baseQuantity-isumDaohuo)/parseFloat(unitRate?.conversionRate):null
      list.isumDaohuo=list.newBaseQuantity
      list.max=list.newBaseQuantity
      list.min=1
    })
    let temp:any=[]
    for (let i = 0; i < 25-stockWarehList.length; i++) {
      temp.push({})
    }
    setTimeout(()=>{
      let newStockWarehList:any=stockWarehList.filter(sw=>!hasBlank(sw.newBaseQuantity))
      setTableData1(newStockWarehList.concat(temp))
      table1Length.value=newStockWarehList.length
      table2Loading.value=false
    },1000)
  }else{
    table2Loading.value=false
    setTableData1([])
    let temp:any=[]
    for (let i = 0; i < 25; i++) {
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
  let methodName=pageParameter.type=='CGDD'?'采购订单':'采购入库单'
  let table1:any=tableSelectedRowObjs.value
  for (let i = 0; i < table1.length; i++) {
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: database })({iyear:iyear.value,name:methodName,method:'弃审,变更',recordNum:table1[i].ccode})
    if(!hasBlank(taskData)){
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return message.error({ content: '参照表头单据正在被操作员'+taskData[i]?.username+'进行'+taskData[i]?.method+'操作，任务冲突，请销后再试！' });
        }
      }
    }
  }
  if(tableSelectedRowObjs1.value.length==0){
    return message.error('请选择表体数据！')
  }
  // 参照单据添加任务表
  let taskList:any=[]
  for (let i = 0; i < table1.length; i++) {
   let task= await useRouteApi(stockBalanceTaskSave, { schemaName: database })({iyear:iyear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:methodName,method:'审核',recordNum:table1[i].ccode,caozuoModule:'stock'})
    taskList.push(task)
    console.log('入库单蓝字操作：6--->参照单据添加任务表-->'+JSON.stringify(task))
  }

  let list:any=tableSelectedRowObjs1.value.filter(a=>!hasBlank(a.id))
  list.forEach(async (a)=>{
    a.isGive=a.isGive=='1' ? '1' : '0'
    a.isBatch=a.isBatch=='1' ? '1' : '0'
    a.baseQuantity=a.newBaseQuantity
    a.sourcedetailId=a.lineCode
    a.sourcetype=a.billStyle
    a.sourcecode=a.ccode
    a.sourcedate=a.ddate
    a.baseQuantity=hasBlank(a.tempSix)?a.baseQuantity:a.tempSix
    a.cnumber=a.newBaseQuantity
    a.canzhaoCnumber=a.cnumber
  })

  emit('throwData', {list:list,taskList:taskList})
  closeModal()
  return true;
}
const {closeCurrent} = useTabs(router);
async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1)
    await closeCurrent()
  closeModal()
}

function custModalShow() {
  openMoalPopPage(true, {
    database: database.value,
    accId: accId.value,
  });
}
function modalData(data) {
  let arr=data[data.length-1]
  sourceCust.value=arr.id
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
