<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div >
        <div>
          <BarChartOutlined style="color: #0096c7;font-size: 60px;"/>
        </div>
        <div style="margin-top:10px;">
          <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload" style="display: table;"/>
        </div>
      </div>
      <div>
        <div><b class="noneSpan" style="font-size: 24px;color: #0096c7;">采购明细表</b></div>
        <div><span style="font-size: 14px;font-weight: bold;color: #666666">日期：</span><span style="color:#000;font-weight: bold;">{{ qijianText }}</span></div>
      </div>
      <div>
        <div>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openQuery()"
          ><span>查询</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="exportExcel()"
          ><span>导出</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
        <div>
          <div>
            <Select v-model:value="popData.searchInput" style="width: 150px;font-size: 12px;text-align-last: left;font-weight: bold;" v-if="pageParameter.queryMark == '1'" class="special_select">
              <SelectOption style="font-size: 12px;" value="stockNum">存货编码</SelectOption>
              <SelectOption style="font-size: 12px;" value="stockName">存货名称</SelectOption>
            </Select>

            <Select v-model:value="popData.searchInput" v-else style="width: 150px;font-size: 12px;text-align-last: left;font-weight: bold;" class="special_select">
              <SelectOption style="font-size: 12px;" value="custCode">供应商编码</SelectOption>
              <SelectOption style="font-size: 12px;" value="custName">供应商名称</SelectOption>
            </Select>
            <InputSearch
              v-model:value="popData.searchVal"
              placeholder=""
              style="width: 150px; border-radius: 4px;margin-right: 4px;"
              @search="findByAll"
            />
          </div>
          <div>
            <Button @click="findByAll">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover class="ant-btn-default" placement="bottom" v-model:visible="visible">
              <template #content>
                <DynamicColumn :defaultData="initDynamics()['1']" :dynamicData="dynamicColumnModel" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
                <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MAX'"
                      :style="pageParameter.showRulesSize==='MAX'?{backgroundColor: '#0096c7',color: 'white'}:''">
                  <SortDescendingOutlined/>&nbsp;大号字体&ensp;<CheckOutlined
                  v-if="pageParameter.showRulesSize==='MAX'"/></span><br/>
                <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MIN'"
                      :style="pageParameter.showRulesSize==='MIN'?{backgroundColor: '#0096c7',color: 'white'}:''">
                  <SortAscendingOutlined/>&nbsp;小号字体&ensp;<CheckOutlined
                  v-if="pageParameter.showRulesSize==='MIN'"/></span>
              </template>
              <Button>
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom app-container" >
        <BasicTable
                ref="tableRef"
                :row-selection="{ type: 'checkbox'}"
                :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
                @register="registerTable"
                :dataSource="tableData"
                :scroll="{ x: totalColumnWidth,y: windowHeight }"
                :loading="loadMark"
        >
          <template #bcheck="{ record }">
            <span v-if="record.bcheck!=='11'">
              <Tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
                {{ record.bcheck === '1' ? '已审核' : '未审核' }}
              </Tag>
            </span>
          </template>
          <template #ccode="{ record }">
            <a class="tableUStyle" @click="toRouter(record)">{{record.ccode}}</a>
          </template>
          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow style="background-color: #cccccc;">
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'" style="border-right: none;">合</TableSummaryCell>
                <TableSummaryCell class="nc-summary" :index="1" :align="'center'" style="border-right: none;">计</TableSummaryCell>
                <TableSummaryCell class="nc-summary" style="border-right: none;" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryTotals[cell.dataIndex]?'':summaryTotals[cell.dataIndex]}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
      <div class="pagination-text" :style="{top: (windowHeight+65)+'px',left:(totalColumnWidth-600)+'px'}" v-show="showPaginationText">
        {{`共 ${paginationNumber}条记录&emsp;每页 1000 条`}}
      </div>
    </div>
    <Query @query="saveQuery" @register="registerQueryPage"/>
    <Excel @register="registerExcelPage"/>
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
  Button,
  Checkbox as ACheckbox,
  Input,
  message,
  Popconfirm as APopconfirm,
  Popover,
  Radio as ARadio,
  Select,
  Table as ATable,
  Tag
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {toThousandFilter} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import Query from './popup/query.vue'
//导入
import Excel from './popup/excel.vue'
//导出
/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findAll as findAllJiLang, findUnitInfoList} from "/@/api/record/system/unit-mea";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import {
  findAllStockWarehTongjiMX_CGDHD,
} from "/@/api/record/system/stock-wareh";
import {useRoute} from "vue-router";
import {exportExcel4} from "/@/api/record/generalLedger/excelExport";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {findByStockAccId} from "/@/api/record/system/stock-account";

const TableSummary = ATable.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell
const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group

const {
    createSuccessModal,
    createErrorModal,
    createWarningModal,
    createConfirm
} = useMessage()

const {closeCurrent,closeToFullPaths} = useTabs(router);

const formItems = ref({
  selectType: '1'
})
const pageParameter: any = reactive({
  queryMark: '1',
  type:'CGDHD',
  showRulesSize: 'MIN',
  query: {},
  selectClass: '',
  selectList: []
})

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
//文件导入
const val = ref({
  openOne: 0,
  mark: '1',
  total: 0
})
const qijianText = ref('')
const openQuery = async () => {
  val.value.openOne = 0
  val.value.mark = pageParameter.queryMark
  openQueryPage(true, {
    data: val
  })
}



const route = useRoute();
const routeData:any = route.query;
onMounted(async() => {
  if((JSON.stringify(routeData) == "{}")){
    val.value.openOne = 1
    openQueryPage(true, {
      data: val.value
    })
    initTable()
    reloadJiCiList()
  }
  // 统计跳转明细
  else{
    visible.value = true
    setTimeout(()=>{
        lanMuData.value.changeNumber+=1
        visible.value = false
      }
      ,100)
   await saveQuery({data:JSON.parse(routeData.data),map:JSON.parse(routeData.map)})
  }
})

const dynamicColumnModel = ref({value:[]})
const popData:any=ref('')
const companyName=ref('')
const databaseCo=ref('')
async function saveQuery(e) {
  let data = e.data
  dynamicTenantId.value = data.constant.tenantId

  let dataBaseInfo=await findByStockAccId(dynamicTenantId.value.substring(0,dynamicTenantId.value.length-5))
  databaseCo.value=dataBaseInfo?.coCode

  popData.value=data.variable
  // data.variable.queryType=='1'?initDynamics()['1']:initDynamics()['2']

  popData.value.searchInput=data.constant.queryType=='1'?'stockNum':'custCode'
  companyName.value = data.constant.companyName
  pageParameter.queryMark = data.constant.queryType
  pageParameter.query = data.variable
  qijianText.value=data.variable.strTimeView+' - '+data.variable.endTimeView
  findByAll()
  reloadList(e.map)
  pageParameter.selectClass=hasBlank(data.variable.cinvodeClass)?'':data.variable.cinvodeClass
  await reloadColumns()
}
async function toRouter(data) {
  await closeToFullPaths('/cg-arrive')
  setTimeout(()=>{
    router.push({path: 'cg-arrive',query: {type:'info',ccode:data.ccode,co: databaseCo.value}});
  },1000)
}
const exportExcel = () =>{
  const arrData:any = []
  const columns:any = getColumns().filter(a=>a.ifShow==true)
  columns.forEach((a,index)=>{
    let temp=tableData.value[index]
    if (JSON.stringify(temp)!='{}') {
      arrData.push(temp)
    }
  })
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
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: false
      },
    },
  ]
  const multiHeader:any = [[]]
  const keys:any = []
  //样式靠右列
  let rightrow:any=[]
  //样式靠左列
  let leftrow:any=[]

  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  columns.forEach((v,index)=>{
    if(v.title.indexOf('数量')!=-1||v.title.indexOf('价税合计')!=-1||v.title.indexOf('无税金额')!=-1||v.title.indexOf('税额')!=-1||v.title.indexOf('单价')!=-1||v.title.indexOf('税率')!=-1){
      rightrow.push(cell[index])
    }else{
      leftrow.push(cell[index])
    }
    multiHeader[0].push(v.title)
    keys.push(v.key)
  })

  let list:any=[]
  arrData.filter(a=>a.bcheck!=='11').forEach((a,index)=>{
    a.bcheck=a.bcheck=='1'?'已审核':'未审核'
    a.cinvode=a.cinvode==null?'':a.cinvode
    a.stockName=a.stockName==null?'':a.stockName
    a.cvencodeJs=a.cvencodeJs==null?'':a.cvencodeJs
    a.cvencodeJsname=a.cvencodeJsname==null?'':a.cvencodeJsname
    a.unit1Name=a.unit1Name==null?'':a.unit1Name
    a.unit2Name=a.unit2Name==null?'':a.unit2Name
    a.cmemo=a.cmemo==null?'':a.cmemo
    list.push(a)
  })

  const sheet =[
    {
      title:'采购明细表',
      tHeader: [ "公司名称："+companyName.value+'   期间：'+qijianText.value],
      multiHeader: multiHeader,
      table: list,
      keys: keys,
      sheetName: 'sheet1',
      cellStyle: cellStyle,
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  exportExcel4(sheet, 'xlsx','采购明细表_'+companyName.value)
}

const paginationNumber = ref(0)
const showPaginationText = ref(false)
async function findByAll() {
  loadMark.value = true
  tableDataAll.value=await useRouteApi(findAllStockWarehTongjiMX_CGDHD,{schemaName: dynamicTenantId})(popData.value)
  paginationNumber.value=tableDataAll.value.length
  showPaginationText.value=true
  calculateTotal(tableDataAll.value)
  // 金额格式化
  for (let i = 0; i < tableDataAll.value.length; i++) {
    let temp=tableDataAll.value[i]
    temp.baseQuantity=toThousandFilter(temp.baseQuantity)
    temp.subQuantity1=toThousandFilter(temp.subQuantity1)
    temp.subQuantity2=toThousandFilter(temp.subQuantity2)
    temp.icost=toThousandFilter(temp.icost)
    temp.itaxprice=toThousandFilter(temp.itaxprice)
    temp.isum=toThousandFilter(temp.isum)
    temp.cnumber=toThousandFilter(temp.cnumber)
    temp.taxprice=toThousandFilter(temp.taxprice)
    temp.price=toThousandFilter(temp.price)
    temp.itaxrate=parseFloat(temp.itaxrate).toFixed(2)

    let cangku=await getCKName(temp.cwhcode)
    temp.cwhcodeName=cangku
  }

  tableData.value =replenishTrs(tableDataAll.value)
  await setPagination({
    total: tableData.value.length
  })
  loadMark.value = false
}

async function getCKName(id) {
  let str=''
  let cangkuJoinName=await useRouteApi(findCangkuJoinName,{schemaName: dynamicTenantId})(  {id:id})
  if(cangkuJoinName.length>0){
    str=cangkuJoinName[0].cangkuRecordJoinName
  }
  return str
}

const typeFlag = ref('0')
const dynamicTenantId = ref(getCurrentAccountName(true))
const accId = ref('')

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)
const jiList = ref([])
const manyJiList:any = ref([])
const psnList:any = ref([])
const supplierList:any = ref([])
const cangkuList:any = ref([])
const userList:any = ref([])
const stockList:any = ref([])
const selectClassList:any = ref([])

const summaryTotals = ref({})

async function reloadList(map) {
  psnList.value = map['user']
  userList.value = map['operator']
  supplierList.value = map['cust']
  cangkuList.value = map['warehouse']
  stockList.value = map['stock']

  if (pageParameter.queryMark == '1'){
    selectClassList.value = map['whClass']
    pageParameter.selectClass = pageParameter.query.cinvode
  }else if (pageParameter.queryMark == '2'){
    pageParameter.selectClass = hasBlank(pageParameter.query.cvencode)?pageParameter.query.cvencodeJs:pageParameter.query.cvencode
    selectClassList.value = map['supplier']
  }
}

async function reloadJiCiList(){
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
}

function formatCvencode(cvencode,k){
  let str = cvencode
  supplierList.value.forEach(item=>{
    if(item.id==cvencode){
      str = item[k] || item['custName']
    }
  })
  return str
}

function formatCpersoncode(cpersoncode){
  let str = cpersoncode
  psnList.value.forEach(item=>{
    if(item.id == cpersoncode){
      str = item.psnName
    }
  })
  return str
}

function formatCwhcode(cwhcode){
  let str = cwhcode
  cangkuList.value.forEach(item=>{
    if(item.id == cwhcode){
      str = item.ckName
    }
  })
  return str
}

function formatUser(user){
  let str = user
  userList.value.forEach(item=>{
    if(item.id == user){
      str = item.realName
    }
  })
  return str
}

function formatCinvode(cinvode,k){
  let str = cinvode
    stockList.value.forEach(item=>{
    if (item.stockNum == cinvode){
      str = item[k]
    }
  })
  return str
}

function formatCunitid(cinvode,k){
  let str = cinvode
  stockList.value.forEach(item=> {
    if (item.stockNum == cinvode) {
      if (item['stockMeasurementType'] == '单计量') {
        jiList.value.forEach(
          function (psn: any) {
            if (psn.id == item['stockMeasurementUnit'])
              str = psn.unitName
          }
        )
      } else {
        let res = manyJiList.value.filter(it1 => it1.id == item['stockMeasurementUnit'])[0]
        if (res != null) {
          let list = JsonTool.parseObj(res.detail) || []
          if (list.length > 0)
            str = list[0].unitName + `[${list[0].conversionRate}]`
        }
      }
    }
  })
  return str
}
function formatGgxh(cinvode){
  let str = ''
  stockList.value.forEach(item=>{
    if (item.stockNum == cinvode){
      str = item.stockGgxh
    }
  })
  return str
}

const CrudApi = {
  columns: [
  {
    title: '状态',
    dataIndex: 'bcheck',
    align: 'left',
    ellipsis: true,slots: { customRender: 'bcheck' },
  },
    {
      title: '仓库',
      dataIndex: 'cwhcodeName',
      align: 'left',
      ellipsis: true,
    },{
    title: '单据日期',
    dataIndex: 'ddate',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '单据编号',
    dataIndex: 'ccode',
    align: 'left',
    ellipsis: true,slots: { customRender: 'ccode' },
  },
    {
      title: '供应商编码',
      dataIndex: 'cvencode',
      align: 'left',
      ellipsis: true,
    },{
      title: '供应商简称',
      dataIndex: 'cvencodeName',
      align: 'left',
      ellipsis: true,
    },{
      title: '结算供应商编码',
      dataIndex: 'cvencodeJs',
      align: 'left',
      ellipsis: true,
    },{
      title: '结算供应商简称',
      dataIndex: 'cvencodeJsname',
      align: 'left',
      ellipsis: true,
    },
  {
    title: '存货编码',
    dataIndex: 'stockNum',
    align: 'left',
    ellipsis: true,
  },
    {
      title: '条形码',
      dataIndex: 'stockBarcode',
      align: 'left',
      ellipsis: true,
    },
  {
    title: '存货名称',
    dataIndex: 'stockName',
    align: 'left',
    ellipsis: true,
  },{
    title: '规格型号',
    dataIndex: 'stockGgxh',
    align: 'left',
    ellipsis: true,
  },{
      title: '批次',
      dataIndex: 'batchId',
      align: 'left',
      ellipsis: true,
    },{
      title: '生产日期',
      dataIndex: 'dpdate',
      align: 'left',
      ellipsis: true,
    },{
      title: '失效日期',
      dataIndex: 'dvdate',
      align: 'left',
      ellipsis: true,
    },{
    title: '计量单位',
    dataIndex: 'unitName',
    align: 'left',
    ellipsis: true,
  },{
    title: '数量',
    dataIndex: 'cnumber',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '主计量',
    dataIndex: 'stockUnitName',
    align: 'left',
    ellipsis: true,
  }, {
    title: '主数量',
    dataIndex: 'baseQuantity',
    align: 'right',
    ellipsis: true,
  },
    {
      title: '税率%',
      dataIndex: 'itaxrate',
      align: 'right',
      ellipsis: true,
    },
    {
      title: '无税单价',
      dataIndex: 'price',
      align: 'right',
      ellipsis: true,
    },
  {
    title: '无税金额',
    dataIndex: 'icost',
    align: 'right',
    ellipsis: true,
  },
  {
    title: '税额',
    dataIndex: 'itaxprice',
    align: 'right',
    ellipsis: true,
  },
    {
      title: '含税单价',
      dataIndex: 'taxprice',
      align: 'right',
      ellipsis: true,
    },
  {
    title: '价税合计',
    dataIndex: 'isum',
    align: 'right',
    ellipsis: true,
  },
  {
    title: '赠品',
    dataIndex: 'isGive',
    align: 'right',
    ellipsis: true,
  },
    {
      title: '备注',
      dataIndex: 'cmemo',
      align: 'left',
      ellipsis: true,
    }
]
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
  indexColumnProps:{ fixed:true },
  pagination: {
    pageSize: 1000,
    simple:true
  },
})

const getCurrSummary  = () => {
  let data=pageParameter.queryMark=='1'?(getColumns().filter(it=>it.title != '序号'&& it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;})):(getColumns().filter(it=>it.title != '序号').map((it,ind)=>{it['ind']=ind+2;return it;}))
  return data
}
const calculateTotal = (data) => {
  let list = JsonTool.parseProxy(data)
  if (list.length == 0){
    summaryTotals.value = {}
    return false;
  }

  let cnumber = 0
  let baseQuantity = 0
  let icost = 0
  let itaxprice = 0
  let isum = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    cnumber += parseFloat(e.cnumber || '0')
    baseQuantity += parseFloat(e.baseQuantity || '0')
    icost += parseFloat(e.icost || '0')
    itaxprice += parseFloat(e.itaxprice || '0')
    isum += parseFloat(e.isum || '0')
  }
  summaryTotals.value={
    cnumber: toThousandFilter(cnumber),
    baseQuantity: toThousandFilter(baseQuantity),
    icost: toThousandFilter(icost),
    itaxprice: toThousandFilter(itaxprice),
    isum: toThousandFilter(isum),
  }
}

function add(a, b) {
  let c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (a * e + b * e) / e;
}
//选中内容
const state = reactive<{
    selectedRowKeys: [];
    loading: boolean;
}>({
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
});
const checkRow: any = ref([])
const onSelectChange = (selectedRowKeys, row) => {
    // console.log('selectedRowKeys changed: ', row);
    state.selectedRowKeys = selectedRowKeys;
    checkRow.value = row
};

const [registerExcelPage, {openModal: openExcelPage}] = useModal()
//文件导入
const openExcel = async () => {
  openExcelPage(true, {})
}

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (320) )
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = ref({
  'accId': dynamicTenantId,
  'menuName': '采购明细表',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})

const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnModel.value.value,newA)
  setColumns(newA)
  initTableWidth(newA)
}
const initTable = ()=>{
  visible.value = true
  setTimeout(()=>{
      lanMuData.value.changeNumber+=1
      visible.value = false
    }
    ,100)
}
function initTableWidth(thisCs) {
  let total = 60 + 60 // 选择列与序号列
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

const pageReload = () => {
  setTableData([]) // 清空可能残留的数据
  reload({
    searchInfo: pageParameter
  })
}
/*明细栏目设置end*/
const formatText = (text) => {
  return text.substring(0,4) +'.'+text.substring(4,7)
}
const replenishTrs = (list) =>{
  let l = list.length
  if(l<50){
    for (let i =  l; i < 50; i++) {
      list.push({bcheck:'11'})
    }
  }
  return list
}
const dynamicAdReload = async (obj) => {
  accId.value=obj.accId
    // const dataBase:any = await findDataBase(obj.accId,obj.year)
    return false
}
const selectChange = (v) => {
popData.value.cinvodeClass=v
  findByAll()
}
function getHomeOrSelectName(b) {
  let n = ''
  switch (pageParameter.queryMark) {
    case '1':
      n = '存货分类'
      break;
    case '2':
      n = '供应商'
      break;
  }
return n
}
</script>
<style scoped lang="less">
@import './global-menu-index.less';

.tableUStyle{
  cursor: pointer;
  color: #0a84ff;
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
  border-left: 0px solid #c9c9c9 !important;
}
:deep(.nc-summary){
  font-weight: bold;
  background-color: #cccccc!important;;
  border-right-color: #cccccc!important;
}
:deep(.ant-table-measure-row){
  td{
    padding: 0 !important;
  }
}
.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 14px !important;
  padding: 5px 8px !important;
  border-color: #cccccc !important;
  font-weight: bold;
}
.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #cccccc !important;
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
  position: relative;
  top:-10px;
  .pagination-text{
    position: absolute;
    bottom: 6px;
    font-size: 13px;
    color: black;
    z-index: 99999999;
  }
}
:deep(.ant-table-thead) th{
  text-align: center !important;
  font-weight: bold;
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
  margin-top: 0!important;
  width: 100%;
  border-top: 1px solid #aaaaaa;
}
.ant-btn-me {
  color: #0096c7;
}
:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}
.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 99%;height: 100px;text-align: left;
  >div:nth-of-type(1){
    width: 40%;display: inline-flex;margin-top: 20px;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;vertical-align: super;}
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;
      >div:nth-of-type(2){margin-top: 14px;}
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;margin-top: 7px;
      >div:nth-of-type(2){}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;margin-right: 7px;
      >div:nth-of-type(2){
        display: inline-flex;justify-content: space-between;margin-top: 15px;
      }
  }
}
</style>
