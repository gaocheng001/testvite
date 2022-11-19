<template>
  <div>
    <div class="app-container">

      <div class="app-container-head">
        <div class="container-head-title" style="float: left;">
          <b class="noneSpan" style="font-size: 60px;margin-left: -16px;"><BarChartOutlined /></b>
        </div>
        <div class="container-head-title" style="padding-left: 35%;text-align: center;margin-top: 20px;">
          <b class="noneSpan" style="font-size: 26px;">存货有效期预警表</b><br><br><br><br>
          <span style="font-size: 14px;color: #666666"><b>正常：</b>有效日期大于今天15天&emsp;<b>临近：</b>有效日期大于今天0-15天&emsp;<b>失效：</b>有效日期小于今天</span>
        </div>
        <div class="ant-btn-group" style="float: right;margin-right: 5px;">
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openQuery()"
          ><span>查询</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="excelData()"
          ><span>导出</span></button>
<!--          <button-->
<!--            type="button"-->
<!--            class="ant-btn ant-btn-me"-->
<!--          ><span>打印</span></button>-->
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="margin-top: -30px;margin-left: 50px;">
        <div style="display: inline-block;float: left;margin-left: 1%;margin-top: -20px;text-align: left;">
          <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/><br>
<!--          <label style="margin-left: 15px;">仓库：</label>-->
<!--          {{ ckList.filter(a=>a.cangkuId==formItems.ckId).length>0?ckList.filter(a=>a.cangkuId==formItems.ckId)[0].cangkuName:'' }}-->
        </div>

        <div style="float: right;margin-right: 5px;">
          <Button class="ant-btn-me" @click="getStockXCL">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Popover class="ant-btn-default" placement="bottom" v-model:visible="visible">
            <template #content>
              <DynamicColumn :defaultData="initDynamics()['J']" :dynamicData="dynamicColumnModel" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MAX'"
                    :style="pageParameter.showRulesSize==='MAX'?{backgroundColor: '#0096c7',color: 'white'}:''">
                大号字体&ensp;<CheckOutlined
                v-if="pageParameter.showRulesSize==='MAX'"/></span><br/>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MIN'"
                    :style="pageParameter.showRulesSize==='MIN'?{backgroundColor: '#0096c7',color: 'white'}:''">
                小号字体&ensp;<CheckOutlined
                v-if="pageParameter.showRulesSize==='MIN'"/></span>
            </template>
            <Button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
        </div>
        <div style="float: right; position: relative">
          <Select v-model:value="formItems.selectType" style="width: 150px;font-size: 12px;" class="special_select">
            <SelectOption style="font-size: 12px;" value="stockNum">存货编码</SelectOption>
            <SelectOption style="font-size: 12px;" value="stockName">存货名称</SelectOption>
            <SelectOption style="font-size: 12px;" value="stateVal">状态</SelectOption>
          </Select>
          <!-- 搜索 -->
          <InputSearch
            v-model:value="formItems.selectVal"
            placeholder=""
            style="width: 150px; border-radius: 4px"
            @search="getStockXCL"
          />
        </div>
      </div>
      <div style="clear:both"/>
    </div>
    <div class="app-container">
      <BasicTable
        ref="tableRef"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        :row-selection="{ type: 'checkbox' }"
        @register="registerTable"
        :dataSource="tableData"
        :scroll="{ x: totalColumnWidth,y: windowHeight }"
        :loading="loadMark"
      >
        <template #state="{ record }">
          <span v-if="!hasBlank(record.state)">
            <a-tag :color="record.state=='临近'?'orange':record.state=='正常'?'green':'red'">{{record.state}}</a-tag>
          </span>
        </template>
        <template #baseQuantity="{ record }"> {{ toThousandFilter(record.baseQuantity) }} </template>
        <template #subQuantity1="{ record }"> {{ toThousandFilter(record.subQuantity1) }} </template>
        <template #subQuantity2="{ record }"> {{ toThousandFilter(record.subQuantity2) }} </template>

        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
              <TableSummaryCell class="nc-summary" :index="0" :align="'center'" style="border-right: none;">合</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="1" :align="'center'" style="border-right: none;">计</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="2" :colSpan="10" :align="'center'"/>
              <TableSummaryCell :index="2" :align="'right'"
                                style="background-color: #cccccc;font-weight: bold;border-right: none;">
                {{ summaryTotals.baseQuantity }}
              </TableSummaryCell>
              <TableSummaryCell :index="2" :align="'right'"
                                style="background-color: #cccccc;font-weight: bold;border-right: none;">
                {{ summaryTotals.subQuantity1 }}
              </TableSummaryCell>
              <TableSummaryCell :index="3" :align="'right'"
                                style="background-color: #cccccc;font-weight: bold;border-right: none;">
                {{ summaryTotals.subQuantity2 }}
              </TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
      <div class="pagination-text" v-show="showPaginationText">
        {{`共 ${paginationNumber}条记录&emsp;每页 1000 条`}}
      </div>
    </div>
    <Query @throwData="loadPage" @register="registerQueryPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import {
  BarChartOutlined,
  CheckOutlined,
  EditOutlined,
  SettingFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined
} from '@ant-design/icons-vue'
import {
  Popconfirm as APopconfirm,
  Radio as ARadio,
  Table as ATable,
  Checkbox as ACheckbox,
  Button,
  Input,
  message,
  Popover,
  Select,
  Tag as ATag,
} from 'ant-design-vue'

import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import Query from './popup/query.vue'
//导出
/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {
  findStockDbLanMuList,
  saveStockLanMuList
} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
import {kcWarningStore} from "/@/views/boozsoft/stock/stock-warning-list/generalLedger";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findByStockXCL} from "/@/api/record/stock/stock-kc-xcl";
import {multiUnitOfMea, singleUnitOfMea} from "/@/api/record/stock/stock";
import {findAllSysUnitOfMeaList} from "/@/api/record/system/unit-mea";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {findOption} from "/@/api/record/stock/stock-option";
import {exportExcel} from "/@/api/record/generalLedger/excelExport";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";

const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group
const TableSummary = ATable.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)
const {closeCurrent} = useTabs(router);
const newdate:any = ref(new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,10).replace("T"," "));
const batchId:any = ref('');
const cgNumWs:any = ref('');
const dpdate:any = ref('');
const dvdate:any = ref('');
const state:any = ref('');
const stockId:any = ref([]);
const stockClassId:any = ref([]);
const ckList:any = ref([]);
const tableData:any = ref([]);
const loadMark = ref(true)
const parameter = reactive({
  showRulesSize: 'MIN',
  companyCode: '',
  companyName: '',
  ifUnit: false,
  total: 0,
  thisAdInfo: {},
  thisLeftKey: '',
  flag:'1',
  database: dynamicTenantId.value,
  accId: defaultAdName.value,
  username: useUserStoreWidthOut().getUserInfo.username,
  uniqueCustclass:'',
  searchConditon: {
    requirement: 'custName',
    value: '',
  },
})
const glStore = kcWarningStore()
const summaryTotals = ref({})
const {
  createSuccessModal,
  createErrorModal,
  createWarningModal,
  createConfirm
} = useMessage()


const formItems = ref({
  selectType: 'stockNum',
  selectVal: '',
  ckId:''
})

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
const val = ref({
  openOne: 0,
  total: 0
})
const openQuery = async () => {
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
}

async function loadPage(data) {
  formItems.value.ckId=data.ckId
  stockId.value=data.stockNum
  state.value=data.state
  dynamicTenantId.value=data.databaseTrue
  getStockXCL()

  let logmsg:any=[]
  if(!hasBlank(data.ckId)){
    logmsg.push('仓库：【'+data.ckList.filter(a => a.cangkuId == data.ckId)[0]?.cangkuName+'】')
  }
  if(data.stockCclassName.length>0){
    logmsg.push('存货分类：【'+data.stockCclassName+'】')
  }
  if(data.stockNum.length>0){
    logmsg.push('存货编码：【'+data.stockNum+'】,存货名称：【'+data.stockName+'】')
  }
  saveLogData('查询',logmsg)
}
async function saveLogData(optAction,logmsg) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'存货现存量查询',
    optAction:optAction,
    optContent:'操作内容【期初到货单】'+logmsg,
  }
  await saveLog(logmap)
}

// 查询现存量
const paginationNumber = ref(0)
const showPaginationText = ref(false)
async function getStockXCL() {
  loadMark.value=true
  let map = {searchMap:formItems.value,queryType:'pcxcl',iyear:pageParameter.year,rkBcheck:'1',ckBcheck:'1',ckId: formItems.value.ckId,stockId: stockId.value,state:state.value}
  let temp= await useRouteApi(findByStockXCL, {schemaName: dynamicTenantId})(map)
  temp.filter(tx=>!hasBlank(tx.dvdate)).forEach(async (a)=>{
    // 默认为空，如勾选仓库显示具体仓库名称
    if(formItems.value.ckId!==''){
      let cangkuJoinName = await useRouteApi(findCangkuJoinName, {schemaName: dynamicTenantId})({id: a.cwhcode})
      a.cwhcodeName = cangkuJoinName[0].cangkuRecordJoinName
    }

    a.baseQuantity=a.xcl
    a.subQuantity1=parseFloat(a.rate1)==0?null:parseFloat(a.xcl/a.rate1).toFixed(2)
    a.subQuantity2=parseFloat(a.rate2)==0?null:parseFloat(a.xcl/a.rate2).toFixed(2)
  })
  let len = temp.length
  paginationNumber.value=len
  showPaginationText.value=true
  if(len<50){
    for (let i =  len; i < 50; i++) {
      temp.push({})
    }
  }
  setTimeout(()=>{
    assembleTotal(temp)
    tableData.value=temp
    loadMark.value=false
  },500)
}

const assembleTotal = (list) => {
  let baseQuantity = 0
  let subQuantity1 = 0
  let subQuantity2 = 0
  let temp=list.filter(a=>!hasBlank(a))
  for (let o of temp) {
    baseQuantity += parseFloat(o.baseQuantity || '0')
    subQuantity1 += parseFloat(o.subQuantity1 || '0')
    subQuantity2 += parseFloat(o.subQuantity2 || '0')
  }
  summaryTotals.value =
    {
      baseQuantity: toThousandFilter(baseQuantity),
      subQuantity1: toThousandFilter(subQuantity1),
      subQuantity2: toThousandFilter(subQuantity2),
    }
}

const CrudApi = {
  columns: JSON.parse(JSON.stringify(glStore.getColumns('J')))
}

// 这是示例组件
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef,
  getColumns,
  setColumns
}] = useTable({
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 1000,
    simple:true
  },
})


const checkRow: any = ref([])

const pageParameter: any = reactive({
  cardUnique: '',
  isEdit: '0',
  dynamicTenantId: '',
  defaultAdName: '',
  year: '',
  thisAdInfo: {},
  total: 0,
  showRulesSize: 'MIN'
})

function onSearch() {
}

const defaultPage = ref(false)
onMounted(async() => {
  val.value.openOne = 1
  openQueryPage(true, {
    data: val,
  })
  initTable()
})

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (340))
const totalColumnWidth = ref(0)
const tableRef: any = ref(null)
const dynamicColumnModel = ref({value:[]})
const lanMuData = ref({
  accId: dynamicTenantId,
  menuName: '存货有效期预警表',
  type: '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})

const reloadColumns = () => {
  let newA = CrudApi.columns
  newA = assemblyDynamicColumn(dynamicColumnModel.value.value,newA)
  setColumns(newA)
  initTableWidth(newA)
}
function initTableWidth(thisCs) {
  let total = 60 + 60 + 2400 // 选择列与序号列+固定列宽度
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  if (total > windowWidth) {
    let f = 0
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 52 - f) + 'px')
  } else {
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 52) + 'px')
  }
}
const initTable = ()=>{
  visible.value = true
  setTimeout(()=>{
      lanMuData.value.changeNumber+=1
      visible.value = false
    }
    ,100)
}
/*明细栏目设置end*/

const dynamicAdReload = async (obj) => {
  // 业务参数
  let ywcs= await useRouteApi(findOption,{schemaName: obj.accountMode})({type: '2',code: obj.coCode})
  cgNumWs.value=ywcs.basisMap.cgNumWs

  // const dataBase:any = await findDataBase(obj.accId,obj.year)
  dynamicTenantId.value = obj.accountMode
  defaultAdName.value = obj.accId
  // 底部分页信息
  pageParameter.thisAdInfo = {}
  pageParameter.thisAdInfo = obj
  pageParameter.dynamicTenantId = obj.accountMode
  pageParameter.defaultAdName = obj.accId
  pageParameter.companyName = obj.companyName
  pageParameter.year = obj.year
}

/**
 * 格式化金额
 * @param num
 */
function toThousandFilter(num: any) {
  if (hasBlank(num)||parseFloat(num)==0||isNaN(num)||parseFloat(num)==Infinity) {
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

function excelData() {
  let data=tableData.value.filter(a=>!hasBlank(a.stockNum))
  if(data.length==0)return message.error('没有数据,无法导出!!')
  //根据columns 格式化导出excel数据
  const multiHeader:any = [[],[]]
  const keys:any = []
  const merges:any = []
  const cellStyle = [
    {
      cell: 'A1',
      font: {
        sz: 16,
        color: { rgb: "000000" },
        bold: true,
      },
      fill: {
        fgColor: { rgb: "ffffff" },
      }
    }
  ]
  const cell = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ',]
  let flg = 0;
  const columns=CrudApi.columns
  //样式靠右列
  let rightrow:any=[]
  //样式靠左列
  let leftrow:any=[]
  columns.forEach((v,index)=>{
    //多级表头
    if(v.children){
      rightrow=cell.filter(a=>!leftrow.some(b=>b==a))
      multiHeader[0].push(v.title)
      for (let i = 0; i < v.children.length; i++) {
        if(i < v.children.length-1){
          multiHeader[0].push('')
        }
        multiHeader[1].push(v.children[i].title)
        keys.push(v.children[i].dataIndex)
      }
      //根据子节点数量合并单元格 5 56  6 78 7 9 10
      if(flg === 0){
        flg = index
      }
      merges.push('`' + cell[flg] + '3:' + cell[flg + v.children.length-1] +'3`');
      flg = flg + v.children.length
    }else{
      leftrow.push(cell[index])
      multiHeader[0].push(v.title)
      multiHeader[1].push('')
      keys.push(v.key)
      //合并上下单元格
      merges.push('`' + cell[flg] + '3:' + cell[flg] +'4`');
      flg = flg + 1
    }
  })
  merges.push('`A2:' + cell[keys.length-1] +'2`');
  data.forEach(v => {
    v.fujl1 = v.fujl1 == null ? '' : v.fujl1
    v.fujl2 = v.fujl2 == null ? '' : v.fujl2
    v.cwhcodeName = v.cwhcodeName == null ? '' : v.cwhcodeName
    v.stockGgxh = v.stockGgxh == null ? '' : v.stockGgxh
    v.baseQuantity = v.baseQuantity == null ? '' : toThousandFilter(v.baseQuantity)
    v.subQuantity1 = v.subQuantity1 == null ? '' : toThousandFilter(v.subQuantity1)
    v.subQuantity2 = v.subQuantity2 == null ? '' : toThousandFilter(v.subQuantity2)
  })
  let cangku=hasBlank(formItems.value.ckId)?'':ckList.value.filter(a=>a.cangkuId==formItems.value.ckId)[0]?.cangkuName
  const sheet =[
    {
      title: '存货有效期预警表查询',
      tHeader: ['仓库：'+cangku +'       当前日期：'+newdate.value.replaceAll('-','.')],
      multiHeader: multiHeader,
      table: data,
      keys: keys,
      merges: merges,
      sheetName: 'sheet1',
      cellStyle: cellStyle,
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  exportExcel(sheet, 'xlsx','存货有效期预警表查询_'+pageParameter.companyName)
}
</script>
<style src="./global-menu-index.less" lang="less" scoped="scoped"></style>
<style scoped lang="less">
@import "./global-menu-index.less";

:deep(.nc-summary){
  font-weight: bold;
  background-color: #cccccc!important;;
  border-right-color: #cccccc!important;
}
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}
.ant-btn-me {
  color: #0096c7;
}
.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  height: 25px;
  color: black;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  height: 25px;
  color: black;
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 5px 10px;
  background: #b4c8e3 !important;
  margin-top: -6px;
  position: relative;
  .pagination-text{
    position: absolute;
    bottom: 6px;
    right: 20%;
    font-size: 13px;
    color: black;
    z-index: 99999999;
  }
}

:deep(.ant-table-thead) th{
  text-align: center !important;
  font-weight: bold;
  //background-color: #f2f2f2 !important;
  background-color: #cccccc !important;
  border-color: #aaaaaa !important;
}

:deep(.vben-basic-table) .ant-table-wrapper {
  padding: 0px;
}

:deep(.vben-basic-table) .ant-table {
  width: 100%;
  margin: 0;
  overflow-x: hidden;
  height: calc(100% - 160px);
  min-height: 500px;
}

:deep(.vben-basic-table) .ant-pagination {
  background-color: #cccccc;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin: 0!important;
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}

:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}

.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 99%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;vertical-align: super;}
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;
      >div:nth-of-type(2){margin-top: 14px;}
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(2){margin-top: 14px;}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;
    >div:nth-of-type(2){
      display: inline-flex;justify-content: space-between;margin-top: 15px;
    }
  }
}
.tableUStyle {
  color: #0798c8;
  cursor: pointer;
  text-decoration: none;
}

.tableUStyle:hover {
  color: #b4c8e3;
}
// 去除空白行
:deep(.ant-table-measure-row){
  td{
    padding: 0 !important;
  }
}
</style>
