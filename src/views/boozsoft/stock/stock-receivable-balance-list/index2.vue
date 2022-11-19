<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <BarChartOutlined/>
        </div>
        <div>
          <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/>
        </div>
      </div>
      <div>
        <div><b class="noneSpan" style="font-size: 24px;color: #0096c7;">客户应收余额表</b></div>
        <div><span style="font-size: 14px;font-weight: bold;">截止日期：{{qijianText}}</span></div>
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
            @click="exportExcelFun()"
          ><span>导出</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>邮件</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me" @click="openPrint"
          ><span>打印</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
        <div>
          <div class="acttd-right-d-search">
            <Select v-model:value="formItems.selectType" class="acttdrd-search-select">
              <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
              <SelectOption style="font-size: 12px;" value="4">存货名称</SelectOption>
            </Select>
            <InputSearch
              placeholder=""
              class="acttdrd-search-input"
              @search="onSearch"
            />
          </div>
          <div>
            <Button @click="reloadTable()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover class="ant-btn-default" placement="bottom" v-model:visible="visible">
              <template #content>
                <DynamicColumn :defaultData="initDynamics()[pageParameter.queryMark]" :dynamicData="dynamicColumnModel" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
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
    <div class="app-container">
      <LeftTree v-if="showTree"  @select="treeFilter" />
      <div style="display: inline-block;height: 100%; float: left;margin-left: 5px;"
           :style="showTree?{width: 'calc(100% - 305px)'}:{width: '99.8%'}">
        <BasicTable
                ref="tableRef"
                :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
                @register="registerTable"
                :dataSource="tableData"
                :scroll="{ x: totalColumnWidth,y: windowHeight }"
                :loading="loadMark"
        >
            <template #initialBalance="{ record }"><span class="tableUStyle" @click="open(record,'qc')">{{ toThousandFilter(record.initialBalance) }}</span></template>
            <template #amountReceivable="{ record }">{{ toThousandFilter(record.amountReceivable) }}</template>
            <template #amountReceived="{ record }"><span class="tableUStyle"  @click="open(record,'sk')">{{ toThousandFilter(record.amountReceived) }}</span></template>
            <template #closingAmount="{ record }">{{ toThousandFilter(record.closingAmount) }}</template>
            <template #receiptRatio="{ record }">{{record.receiptRatio==0?'': toThousandFilter(record.receiptRatio) }}</template>
          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow style="background-color: #cccccc;">
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合计</TableSummaryCell>
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':summaryModel[cell.dataIndex].toFixed(2)}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
      </div>
    </div>
    <Query @query="saveQuery" @register="registerQueryPage"/>
    <Excel @save="saveExcel" @register="registerExcelPage"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {BasicTable, useTable} from '/@/components/Table'


import {useModal} from '/@/components/Modal'
import {onMounted, provide, reactive, ref} from 'vue'
import {
    CheckOutlined,
    PicLeftOutlined,
    PrinterOutlined,
    SettingFilled,
    SortAscendingOutlined,
    SortDescendingOutlined,
    SyncOutlined,BarChartOutlined,
    UsbOutlined,EditOutlined
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
  Tag, Cascader, Table as ATable
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
import Print from './popup/print.vue'
//导出
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import XLSX from "xlsx-js-style";
/**********************明细栏目设置**********************/
import { getTablePropertys, initDynamics} from "./data";
import {assemblyDynamicColumn} from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {cloneDeep} from "lodash-es";
/**********************汇总栏目设置**********************/
import {
  findCustYsYue,
  findTongJi,
} from "/@/api/record/stock/stock-xhd";
import {findAll as findAllJiLang, findUnitInfoList} from "/@/api/record/system/unit-mea";
import {DateTool, JsonTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import LeftTree from "/@/views/boozsoft/stock/stock-receivable-balance-list/popup/LeftTree.vue";
import {exportExcel4} from "/@/api/record/generalLedger/excelExport";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
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

const {closeCurrent} = useTabs(router);

const formItems = ref({
  selectType: 'cvencodeJsCode'
})

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
//文件导入
const val = ref({
  openOne: 0,
  mark: '1',
  total: 0
})
const qijianText = ref('')
const companyName = ref('')
const showTree = ref(false)
const openQuery = async () => {
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
}

async function saveQuery(e) {
  let data = e.data
  dynamicTenantId.value = data.constant.tenantId
  pageParameter.query = data.variable
  qijianText.value = data.variable.expirationDate
  companyName.value = data.constant.companyName
  reloadList(e.map)
  showTree.value=true
  initTable()
  // await reloadTable()
}
const initTable = ()=>{
  visible.value = true
  setTimeout(()=>{
      lanMuData.value.changeNumber+=1
      visible.value = false
    }
    ,100)
}
const treeFilter = (obj) => {
  pageParameter.query.cvencodeClass = obj == 'all'?'':obj
  reloadTable()
}
const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)
async function reloadTable(){
  loadMark.value = true
  tableDataAll.value = await useRouteApi(findCustYsYue,{schemaName: dynamicTenantId})(ObjTool.dels(pageParameter,['selectList','selectClass']))
  tableData.value =replenishTrs(JsonTool.parseProxy(tableDataAll.value))
  await setPagination({
    total: tableData.value.length
  })
  calculateTotal()
  loadMark.value = false
}
const jiList = ref([])
const manyJiList = ref([])
const psnList:any = ref([])
const supplierList:any = ref([])
const cangkuList:any = ref([])
const userList:any = ref([])
const stockList:any = ref([])
const selectClassList:any = ref([])
const custClasList:any = ref([])

const summaryTotals = ref({})

async function reloadList(map) {
  psnList.value = map['user']
  userList.value = map['operator']
  supplierList.value = map['cust']
  custClasList.value = map['custClass']
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

const pageParameter: any = reactive({
  queryMark: '1',
  showRulesSize: 'MIN',
  query: {},
  sortMark: '1'
})

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
  columns: getTablePropertys(pageParameter.queryMark),
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },
  /*actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: {customRender: 'action'}
  }*/
})

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



function onSearch(v) {
  let list = JsonTool.parseProxy( tableDataAll.value.filter(item => item[formItems.value.selectType].indexOf(v) != -1))
  setTableData()
  tableData.value = replenishTrs(list)
  setPagination({total: list.length})
}

const defaultPage = ref(false)
onMounted(async() => {
  val.value.openOne = 1
  let path = router.currentRoute?.value?.fullPath
  if (null != path){
    if (path == '/xs-phbStock')val.value.mark = '1'
    if (path == '/xs-phbCust')val.value.mark = '2'
    if (path == '/xs-xsCountUser')val.value.mark = '3'
    if (path == '/xs-xsCountArea')val.value.mark = '4'
  }
  openQueryPage(true, {
    data: val.value
  })
  // reloadJiCiList()
})

const [registerExcelPage, {openModal: openExcelPage}] = useModal()
//文件导入
const openExcel = async () => {
  openExcelPage(true, {})
}

async function saveExcel(data) {}

const exportExcelFun = () =>{
  const columns:any = getColumns()
  columns.shift()
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
    }
  ]
  const multiHeader:any = [[]]
  const keys:any = []
  //样式靠右列
  let rightrow:any=[]
  //样式靠左列
  let leftrow:any=[]
  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  columns.forEach((v,index)=>{
    if(v.title.indexOf('金额')!=-1||v.title.indexOf('余额')!=-1 || v.title.indexOf('收款')!=-1 ){
      rightrow.push(cell[index])
    }else{
      leftrow.push(cell[index])
    }
    multiHeader[0].push(v.title)
    keys.push(v.key)
  })
  let list: any = []
  const arrData = getDataSource().filter(it=>!hasBlank(it.cvencodeJs))
  arrData.forEach(item=>{
    let item1 = {}
    item1['cvencodeJsCode'] = item.cvencodeJsCode
    item1['cvencodeJs'] = item.cvencodeJs
    item1['initialBalance'] = toThousandFilter(item.initialBalance)
    item1['amountReceivable'] = toThousandFilter(item.amountReceivable)
    item1['amountReceived'] = toThousandFilter(item.amountReceived)
    item1['closingAmount'] = toThousandFilter(item.closingAmount)
    item1['receiptRatio'] = toThousandFilter(item.receiptRatio)
    list.push(item1)
  })

  let name='客户应收余额表'

  const sheet =[
    {
      title:name,
      tHeader: [ "公司名称："+companyName.value+'   截止日期：'+qijianText.value],
      multiHeader: multiHeader,
      table: list,
      keys: keys,
      sheetName: 'sheet1',
      cellStyle: cellStyle,
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  exportExcel4(sheet, 'xlsx',name+'_'+companyName.value+'_'+qijianText.value)
}

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (335) )
const totalColumnWidth = ref(0)
const dynamicColumnModel = ref({value:[]})
const tableRef: any = ref(null)
const lanMuData = ref({
  'accId': '',
  'menuName': '客户应收余额表',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  userId: useUserStoreWidthOut().getUserInfo.id,
  isType: '0',  changeNumber:0
})

const reloadColumns = () => {
  let a: any = []
  a = getColumns()
  let newA = JSON.parse(JSON.stringify(getTablePropertys(pageParameter.queryMark)))
  newA = assemblyDynamicColumn(dynamicColumnModel.value.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  reloadTable()
}


function initTableWidth(thisCs) {
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  /*  // 去除操作咧宽
    total -= 100*/
  if (total > windowWidth) {
    let f = 0
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 70 - f) + 'px')
  } else {
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 70) + 'px')
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
  assembleTotal(list)
  let l = list.length
  for (let i = 0; i < (30-l); i++) {
    list.push({})
  }
  return list
}
const assembleTotal = (list) => {
  let num = 0
  let num2 = 0
  let num3 = 0
  let num4 = 0
  let num5 = 0
  for (let o of list) {
    num+=parseFloat(o['initialBalance'] || 0)
    num2+=parseFloat(o['amountReceived'] || 0)
    num3+=parseFloat(o['amountReceivable'] || 0)
    num4+=parseFloat(o['closingAmount'] || 0)
  }
  num5 = (num3 / (num+num2))
  summaryTotals.value={initialBalance: num.toFixed(2),amountReceived: num2.toFixed(2),amountReceivable: num3.toFixed(2),closingAmount: num4.toFixed(2),receiptRatio: num5>0?num5.toFixed(2):0}
}
const dynamicAdReload = async (obj) => {
    // const dataBase:any = await findDataBase(obj.accId,obj.year)
    return false
    // 底部分页信息
    await reloadList()
    // await reloadTable()
}
const open = (e,t) => {
}






/*打印专区*/
const [registerPrintPage, {openModal: openPrintPage}] = useModal()
const openPrint = () => {
  openPrintPage(true, {
    data: {
      dynamicTenantId: dynamicTenantId.value,
      defaultAdName: useCompanyOperateStoreWidthOut().getSchemaName,
      year: '',
    }
  })
}

function setString(str, len) {
  if (str == null) return  ''
  var strlen = 0;
  var s = "";
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      strlen += 2;
    } else {
      strlen += 1.2;
    }
    s += str.charAt(i);
    if (strlen >= len) {
      return s+"...";
    }
  }
  return s;
}
const loadPrint = (obj) => {

  const data = getDataSource().filter(it=>it.cvencodeJs!=null)
  let printList: any = []
  let printUser = ''
  if(obj.isMark){
    printUser = '制表人：' + useUserStoreWidthOut().getUserInfo.username
  }
  let printDate = ''
  if(obj.isDate) printDate = '制表日期：' +DateTool().nowDate()
  data.forEach((item,index) => {
    let item1 = {}
    item1[0] = index+1
    item1[1] = item.cvencodeJsCode
    item1[2] = item.cvencodeJs
    item1[3] = toThousandFilter(item.initialBalance)
    item1[4] = toThousandFilter(item.amountReceivable)
    item1[5] = toThousandFilter(item.amountReceived)
    item1[6] = toThousandFilter(item.closingAmount)
    item1[7] = toThousandFilter(item.receiptRatio)
    printList.push(item1)
  })
  for (let i=0; i<printList.length%25; i++){
    let item1 = {}
    item1[0] = ''
    item1[1] = ''
    item1[2] = ''
    item1[3] = ''
    item1[4] = ''
    item1[5] = ''
    item1[6] = ''
    item1[7] = ''
    if(printList.length%25==24){
      item1[0] = '合计'
      item1[3] = toThousandFilter(summaryTotals.value.initialBalance)
      item1[4] = toThousandFilter(summaryTotals.value.amountReceivable)
      item1[5] = toThousandFilter(summaryTotals.value.amountReceived)
      item1[6] = toThousandFilter(summaryTotals.value.closingAmount)
      item1[7] = toThousandFilter(summaryTotals.value.receiptRatio)
    }
    printList.push(item1)
  }

  let num = Math.ceil(printList.length/25)
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    doc.autoTable({
      head: [['客户应收余额表', '', '', '', '', '', '', ''],
        ['公司名称：'+companyName.value, '', '','截止日期：'+qijianText.value,'', '',  '', ''],
        ['序号', '结算客户编码', '结算客户名称','期初余额', '应收金额', '已收金额', '期末金额', '收款比例']],
      body: printList,
      styles: tableStyle(),
      margin: {
        left: 40,
        top: 20,
      },
      addPageContent: (data) => {
        let tabHeigth = data.table.height,
          tabMarginTop = data.settings.margin.top,
          tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
          tabMarginLeft = data.settings.margin.left;
        if (data.table.finalY)//是否分页 有分页时才有该属性finalY
          if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;//如果需要每一页都显示页尾则注释该行代码
        data.doc.setFontSize(9)
        // data.doc.setFont('fuhuiR', 'bold')
        doc.autoTableText(
          printUser,
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          printDate,
          data.cursor.x/2+10,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          '第'+data.doc.getCurrentPageInfo().pageNumber+'页/共'+num+'页',
          data.cursor.x - 40,
          data.cursor.y + 3,
          0
        );
      },
      didParseCell(data) {
        data.cell.styles.cellPadding = {top: 3, left: 2, right: 2, bottom: 2}
        data.cell.styles.fillColor = [255, 255, 255]
        data.cell.styles.fontSize = 9
        data.cell.styles.lineColor = [150, 150, 150]

        if (data.section == 'head' && data.row.index == 0) {
          data.cell.styles.fontSize = 20
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 15
            data.cell.styles.halign = 'center'
          }
        }
        if (data.section == 'head' && (data.row.index == 1)) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 2
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 3) {
            data.cell.colSpan = 2
            // data.cell.styles.cellPadding = {left: 10,top: 3}
            data.cell.styles.halign = 'left'
          } else  {
            data.cell.styles.halign = 'right'
          }
        }
        if (data.section == 'head' && data.row.index == 2) {
          data.cell.styles.fontSize = 10
          data.cell.styles.cellPadding = {top: 4, left: 2, right: 2, bottom: 3}
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.fillColor = [230, 230, 230]
          data.cell.styles.halign = 'center'
        }
        if (data.section == 'body'){
          if (data.row.index%2==1) {
            data.cell.styles.fillColor = [240,240,240]
          }
          if (data.row.index == 24){
            if (data.column.index == 0) {
              data.cell.colSpan = 3
            }
          }
        }
      },
      columnStyles: {
        0: {cellWidth: 40, halign: 'center'},
        1: {cellWidth: 80, halign: 'left'},
        2: {cellWidth: 120, halign: 'left'},
        3: {cellWidth: 65, halign: 'right'},
        4: {cellWidth: 65, halign: 'right'},
        5: {cellWidth: 65, halign: 'right'},
        6: {cellWidth: 65, halign: 'right'},
        7: {cellWidth: 65, halign: 'center'},
      }
    })
  })
}
/*打印专区*/
/*** 合计 ***/
const summaryModel = ref({})
const getCurrSummary  = () => {
  return ((getColumns()).filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+1;return it;}))
}
const calculateTotal = () => {
  let list = JsonTool.parseProxy((getDataSource()).filter(it=>it.cvencodeJs!=null))
  if (list.length == 0){
    summaryModel.value = {}
    return false;
  }
  let num = 0
  let num1 = 0
  let num2 = 0
  let num3 = 0
  let num4 = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    num+=parseFloat(e['amountReceivable'] || 0)
    num1+=parseFloat(e['amountReceived'] || 0)
    num2+=parseFloat(e['closingAmount'] || 0)
    num3+=parseFloat(e['initialBalance'] || 0)
    num4+=parseFloat(e['receiptRatio'] || 0)
  }
  summaryModel.value={
    amountReceivable:  num ,
    amountReceived:  num1,
    closingAmount:  num2,
    initialBalance:  num3,
    receiptRatio: num4
  }
}
/*** 合计 ***/
provide('custClassList',custClasList)
</script>
<style scoped lang="less">
@import '/@/assets/styles/global-menu-index.less';
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
  font-size: 16px !important;
  padding: 5px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 550;
  height: 36px;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 600;
  height: 27px;
}
:deep(.ant-table-measure-row){
  td{
    padding: 0 !important;
  }
}
.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 0px 10px;
  background: #b4c8e3 !important;
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
  width: 100%;
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}
:deep(.ant-select-selector){
  border: 1px solid #c4c4c4!important;
}
.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 99%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    >div:nth-of-type(1){
      width: 64px;display: inline-block;text-align: center;    top: 10px;
      position: inherit;
      :deep(.anticon){
        color: #0096c7;
        font-size: 60px;
      }
    }
    >div:nth-of-type(2){
      width: calc(100% - 64px);
      position: inherit;
      display: inline-block;
      top: -8px;
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(1){margin-top: 8px;}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;
    >div:nth-of-type(1){
      .ant-btn-me {
        color: #0096c7;
      }
    }
    >div:nth-of-type(2){
      display: inline-flex;justify-content: space-between;margin-top: 15px;
    }
    .acttd-right-d-search {
      .acttdrd-search-select {
        width: 150px;
        text-align: left;
        :deep(.ant-select-selector) {
          border-color: @Global-Border-Color;
          border-radius: 2px 0 0 2px;
        }
      }

      .acttdrd-search-input {
        width: 150px;
        :deep(.ant-input){
          border-color: @Global-Border-Color;
          border-left: none;
        }
        :deep(.ant-input-search-button){
          border-color: #c9c9c9;
          border-left: none;
          //color: #0096c7;
        }
      }
    }
  }
}
.tableUStyle {
  color: #0096c9;
  text-decoration: none;
  cursor: pointer;
}

.tableUStyle:hover {
  color: black;
}
:deep(.nc-summary){
  font-weight: bold;
  background-color: #cccccc!important;;
  border-right-color: #cccccc!important;
}
</style>
