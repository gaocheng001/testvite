<template>
  <BasicModal width="950px"
              :height="600"
              v-bind="$attrs"
              :title="''"
              @ok="handleOk()"
              @cancel="handleClose()"
              @register="register">
    <template #title>
      <div style="display: flex;margin-left: 10px;margin-top: 5px;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;color: rgb(21, 142, 184)"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;color: #e55252">红字采购入库单生单参照</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
        <div style="float: left;margin-right: 5px;">
          <Select style="width: 100px;" v-model:value="pageParameter.searchConditon.requirement">
            <SelectOption value="ccode">单据编码</SelectOption>
            <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
          </Select>
          <a-input-search placeholder="" v-model:value="pageParameter.searchConditon.value" style="width: 200px; border-radius: 4px" @search="findByTable"/>
          <span style="margin-left: 50px;">
            <RadioGroup v-model:value="pageParameter.type" @change="findByTable">
              <Radio value="CGDD" style="color: white;">采购订单</Radio>
              <Radio value="CGDHD" style="color: white;">采购退货单</Radio>
            </RadioGroup>
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
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange}"
          :scroll="{ y: 150 }"
          :loading="tableLoading"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
          @row-click="rowClick"
        >
          <template #billStyle="{ record }">
            <span v-if="record.ccode!=undefined">
              {{ record.billStyle=='CGDHD'?'采购退货单':record.billStyle=='CGDD'?'采购订单':'期初到货单' }}
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
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys1, onChange: onSelectChange1 }"
          :scroll="{ y: 220 }"
          :loading="table2Loading"
          class="alone-basic-table"
          size="small"
          @register="registerTable1"
          @row-click="rowClick1"
        >
          <template #isumRuku="{ record }">
            {{ !hasBlank(record.isumRuku)?parseFloat(record.isumRuku).toFixed(2):'' }}
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
import {Button, DatePicker, InputNumber, message, Radio, Select} from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
/*import ModalPop from '/@/views/boozsoft/system/supplier/popup/modalPop.vue';*/
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findAllCGDHD_And_QCDHD} from "/@/api/record/stock/stock-ruku";
import {findAllByStockWarehListCcode, getUnitRate} from "/@/api/record/system/stock-wareh";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {findByStockNum2} from "/@/api/record/stock/stock";
import {findBySyDataMainSourrceMap} from "/@/api/record/stock/stock-xy-source";


const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled: record.billStyle==undefined
  }),
};
const pageParameter = reactive({
  list:'',
  type:'CGDHD',
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
const sourceType = ref('采购订单')
const sourceCust = ref('')
const sourceCwhcode = ref('')
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const tableSelectedRowKeys1 = ref([])
const tableSelectedRowObjs1 = ref([])
const table1Length = ref(0)

const [registerModalPopPage, { openModal: openMoalPopPage }] = useModal();

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
      dataIndex: 'isumRuku',
      width: '80px',
      align: 'right',ellipsis: true,slots: {customRender: 'isumRuku'}
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
    },{
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
    cwhcode:sourceCwhcode.value,
    type:pageParameter.type=='CGDHD'?['QC','CGDHD']:[pageParameter.type],
    searchConditon:pageParameter.searchConditon
  }
  let data=await useRouteApi(findAllCGDHD_And_QCDHD, {schemaName: database})(map)
  // 退货单
  let ddata:any=data.filter(a=>a.rukuStatus!=='1'&&a.bdocumStyle=='1')
  // 去除：到货来源单据是否入库单
  if(pageParameter.type=='CGDHD'){
    ddata=ddata.filter(a=>a.sourcetype!=='CGRKD')
  }
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
      let unitRate= await useRouteApi(getUnitRate, {schemaName: database})({cgUnitId:list.cgUnitId,ccode:list.ccode})

      // 期初到货单
      if(list.billStyle=='QC'){
        let cnumber:any=parseFloat(list.cnumber)-(list.isumRuku)

        // 算出主数量，通过主数量反算 数量
        list.newBaseQuantity=(parseFloat(cnumber)*parseFloat(unitRate?.conversionRate))/parseFloat(unitRate?.conversionRate)
        list.max=-1
        list.min=list.newBaseQuantity
      }else{
        // 计算出 本次使用
        let baseQuantity:any=hasBlank(list.baseQuantity)?0:parseFloat(list.baseQuantity)
        let isumRuku=hasBlank(list.isumRuku)?0:parseFloat(list.isumRuku)

        list.newBaseQuantity=baseQuantity-isumRuku!=0?(baseQuantity-isumRuku)/parseFloat(unitRate?.conversionRate):null
        list.isumRuku=list.newBaseQuantity

        if(list.newBaseQuantity<0){
          list.max=-1
          list.min=list.newBaseQuantity
        }else{
          list.max=list.newBaseQuantity
          list.min=1
        }
      }
    })

    let temp:any=[]
    for (let i = 0; i < 25-stockWarehList.length; i++) {
      temp.push({})
    }
    setTimeout(()=>{
      setTableData1(stockWarehList.concat(temp))
      table1Length.value=stockWarehList.length
      table2Loading.value=false
    },800)
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
  if(tableSelectedRowObjs1.value.length==0){
    return message.error('请选择表体数据！')
  }
  let list:any=tableSelectedRowObjs1.value.filter(a=>!hasBlank(a.id))
  list.forEach(async (a)=>{
    a.oldBaseQuantity=0-(hasBlank(a.baseQuantity)?0:a.baseQuantity)-(hasBlank(a.isumRuku)?0:a.isumRuku)
    a.baseQuantity=a.newBaseQuantity
    a.sourcedetailId=a.lineCode
    a.sourcetype=a.billStyle
    a.sourcecode=a.ccode
    a.sourcedate=a.ddate

    a.cnumber=a.newBaseQuantity
  })
  emit('throwData', list)
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

async function findByStockWareListAndCcode() {

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
