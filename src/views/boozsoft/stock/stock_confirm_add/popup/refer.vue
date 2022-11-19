<template>
  <BasicModal width="950px"
              :height="600"
              v-bind="$attrs"
              :title="''"
              @ok="handleOk()"
              @cancel="handleClose()"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <SearchOutlined style="font-size: 29px;color: rgb(21, 142, 184)"/>
        <span style="line-height: 29px;font-size: 20px;margin-left: 10px;color: rgb(21, 142, 184)">销售确认单生单参照</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div style="background-color: #158eb8;height: 50px;padding-top: 10px;padding-left:10px;border-radius: 5px;">
        <div style="float: left;margin-right: 5px;">
          <Select style="width: 100px;" v-model:value="pageParameter.searchConditon.requirement">
            <SelectOption value="ccode">单据编码</SelectOption>
            <SelectOption value="ddate">单据日期</SelectOption>
            <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
          </Select>
          <a-input-search placeholder="" v-model:value="pageParameter.searchConditon.value" style="width: 200px; border-radius: 4px" @search="findByTable"/>
          <span style="margin-left: 200px;">
        <label style="color: white;font-weight: bold;">日期区间：</label>
          <DatePicker v-model:value="pageParameter.dates[0]"  style="width: 114px;"  format="YYYY-MM-DD"  valueFormat="YYYY-MM-DD" />      <span>~  </span>
          <DatePicker v-model:value="pageParameter.dates[1]"  style="width: 114px;"  format="YYYY-MM-DD"  valueFormat="YYYY-MM-DD" />
          </span>
        </div>
        <div style="float: right;margin-right: 5px;">
          <button type="button" class="ant-btn ant-btn-me" @click="findByTable"><span>选单</span></button>
        </div>
      </div>
      <br>
      <div class="content-body">
        <span style="float: left;">表头</span>
        <BasicTable
          :row-selection="{ type: 'radio',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange}"
          :scroll="{ y: 150 }"
          :loading="tableLoading"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
          @row-click="rowClick"
        >
          <template #billStyle="{ record }">
            <span v-if="record.ccode!=undefined">
            销售出库单
            </span>
          </template>
          <template #isum="{ record }">
            {{ record.isum>0?parseFloat(record.isum).toFixed(2):'' }}
          </template>
        </BasicTable>
        <br>
        <span style="float: left;">表体
          <span>共：{{ table1Length }} 条数据</span>
        </span>
<!--       :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys1, onChange: onSelectChange1 }"     -->
        <BasicTable

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
import {ref,reactive} from 'vue';
import {BasicModal,  useModalInner} from '/@/components/Modal';
import {SearchOutlined,CaretDownOutlined} from '@ant-design/icons-vue';
import {DatePicker, Radio, Select,Button,message,InputNumber} from 'ant-design-vue';
import {BasicTable, useTable} from '/@/components/Table'
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findAllByStockSalesListCcode, findAllXSCKD} from "/@/api/record/stock/stock-xhd";
import dayjs from 'dayjs';
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {DateTool} from "/@/api/task-api/tools/universal-tools";
import {
  getByStockBalanceTask,
  stockBalanceTaskEditNewTime, stockBalanceTaskSave
} from "/@/api/record/stock/stock_balance";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useMessage} from "/@/hooks/web/useMessage";

const pageParameter = reactive({
  list:'',
  type:'XSCKD',
  dates: [],
  searchConditon: {
    requirement: 'ccode',
    value: '',
  },
})
const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;
const emit = defineEmits(['register', 'throwData']);
const formItems = ref({
  openOne: 0
})
const tableLoading = ref(false)
const iyear = ref('')
const database = ref('')
const accId = ref('')
const sourceDate:any = ref([])
const sourceType = ref('采购订单')
const sourceTypeList = ref([{title:'采购订单',value:'采购订单'},{title:'采购到货单',value:'采购到货单'},{title:'采购发票',value:'采购发票'}])
const sourceCust = ref('')
const sourceCustList:any = ref([])
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const tableSelectedRowKeys1 = ref([])
const tableSelectedRowObjs1 = ref([])
const table1Length = ref(0)


const [registerTable, { deleteSelectRowByKey,setTableData,getSelectRows,getDataSource}] = useTable({
  columns: [
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
    },/*{
      title: '累计入库数量',
      dataIndex: 'isumXiaohuo',
      width: '120px',
      align: 'right',ellipsis: true,slots: {customRender: 'isumXiaohuo'}
    },{
      title: '本次使用',
      dataIndex: 'newBaseQuantity',
      width: '100px',
      align: 'right',slots: {customRender: 'newBaseQuantity'}
    },*/{
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
const filterOption = (input: string, option: any) => {
  return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  sourceCust.value=data.cvencode
  accId.value=data.dynamicAccId
  database.value=data.dynamicTenantId
  iyear.value=data.iyear
  // 初始化 日期
  let busDate = useCompanyOperateStoreWidthOut().getLoginDate;
  let longV = (24 * 60 * 60 * 1000) * -30
  let s = DateTool().offsetToStr(new Date(busDate),longV).substring(0,10)
  pageParameter.dates = [s,busDate]
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
    type:pageParameter.type=='CGDHD'?['QC','CGDHD']:[pageParameter.type],
    searchConditon:pageParameter.searchConditon,
    dates: pageParameter.dates
  }
  let data=await useRouteApi(findAllXSCKD, {schemaName: database})(map)
/*  for (let i = 0; i < 50-data.length; i++) {
    data.push({})
  }*/

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
  for (let i = 0; i < 25; i++) {
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
    stockWarehList.forEach(async (list)=>{
      let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: database})(  {id:list.cwhcode})
      list.cwhcodeNameJoin=cangkuJoinName[0]?.cangkuRecordJoinName

      // 计算出 本次使用
      let baseQuantity=hasBlank(list.baseQuantity)?0:parseFloat(list.baseQuantity)
      let isumXiaohuo=hasBlank(list.isumXiaohuo)?0:parseFloat(list.isumXiaohuo)

      let keyong=baseQuantity-isumXiaohuo!=0?baseQuantity-isumXiaohuo:baseQuantity
      list.keyong=keyong
      list.newBaseQuantity=baseQuantity-isumXiaohuo!=0?baseQuantity-isumXiaohuo:null
    })
    let temp:any=[]
    /*for (let i = 0; i < 25-stockWarehList.length; i++) {
      temp.push({})
    }*/
    setTimeout(()=>{
      setTableData1(stockWarehList.concat(temp))
      table1Length.value=stockWarehList.length
    },200)
  }else{
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
  let datas = getDataSource1().filter(a=>!hasBlank(a.id))
  if(datas.length==0){
   return message.error('请选择表体数据！')
  }
  if (await tempCheck(datas[0].ccode,datas[0].ddate))return false;
  let list:any=datas
  list.forEach(a=>{
    a.oldBaseQuantity=a.baseQuantity
    a.baseQuantity=a.newBaseQuantity
    a.sourcedetailId=a.lineCode
    a.sourcetype=a.billStyle
    a.sourcecode=a.ccode
    a.sourcedate=a.ddate
  })
  emit('throwData', {list:list,taskId: taskId.value})
  closeModal()
  return true;
}
const {closeCurrent} = useTabs(router);
async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1)
    await closeCurrent()
  closeModal()
}
const {createWarningModal} = useMessage()
const taskId = ref('')
async function tempCheck(code,ddate){
  let year= (ddate.substring(0,4))
  let taskData=await useRouteApi(getByStockBalanceTask, { schemaName:database })({iyear:year,name:'销售出库单',method:'审核',recordNum:code})
  if(!hasBlank(taskData)){
    // 任务不是当前操作员的
    if(taskData[0].caozuoUnique!==useUserStoreWidthOut().getUserInfo.username){
      createWarningModal({title: '温馨提示',content: '操作员'+taskData[0].caozuoUniqu+'正在对当前账套进行销售确认处理，单号['+code+']正在参与,不能进行单据新增业务操作，请销后再试！'})
      return  true;
    }else{
      await useRouteApi(stockBalanceTaskEditNewTime, { schemaName:database})(taskData[0].id)
      taskId.value = taskData[0].id
      return  false;
    }
  }else {
    await useRouteApi(stockBalanceTaskSave, { schemaName: database })({iyear:year,userName:useUserStoreWidthOut().getUserInfo.username,functionModule:'销售出库单',method:'审核',recordNum:code,caozuoModule:'stock'})
      .then((a)=>{
        taskId.value = a.id
      })
    return  false;
  }
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
