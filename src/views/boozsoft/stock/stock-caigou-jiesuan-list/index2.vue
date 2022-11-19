<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <ProfileOutlined style="color: #0096c7;font-size: 60px;"/>
        </div>
        <div> <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/></div>
      </div>
      <div>
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">采购核算列表</b></div>
        <div><span style="font-size: 14px;font-weight: bold;color: #666666">日期：</span><span style="color:#000;font-weight: bold;">{{ strDate }} - {{ endDate }}</span></div>
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
            @click="router.push({name: 'CaiGouJiesuan',params: {type:'add',ccode:''}})"
          ><span>新增</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>手动结算</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>自动结算</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="editFun()"
          ><span>修改</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="delFun()"
          ><span>删除</span></button>
          <button type="button" class="ant-btn ant-btn-me" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')"><span>退出</span></button>
        </div>
        <div>
          <div>
            <Select v-model:value="pageSearch.selectType" class="acttdrd-search-select">
              <SelectOption style="font-size: 12px;" value="ccode">单据编号</SelectOption>
              <SelectOption style="font-size: 12px;" value="supName">供应商简称</SelectOption>
            </Select>
            <InputSearch
              v-model:value="pageSearch.selectValue"
              class="acttdrd-search-input"
              style="width: 140px;"
              @search="reloadTable"
            />
            <Button class="ant-btn-me">
              <SyncOutlined :style="{ fontSize: '14px' }" @click="reloadTable"/>
            </Button>
            <Popover class="ant-btn-default" placement="bottom" v-model:visible="visible3">
              <template #content>
                <DynamicColumn :defaultData="initDynamics()['DATA']" :dynamicData="dynamicColumnData" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
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
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
                <span class="group-btn-span-special2 p_specifics" @click="excelThisData" style="width: 130px;text-align: left;padding: 5px 10%;">
                导出当前列表
              </span><br/>
              </template>
              <Button>
                <UsbOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
              <span class="group-btn-span-special2 p_specifics" style="width: 120px;text-align: left;padding: 5px 10%;" @click="openPrint">
                打印当前列表
              </span><br/>
              </template>
              <Button>
                <PrinterOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container">
      <!-- 汇总-->
      <BasicTable
        ref="tableRef1"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange,getCheckboxProps:rowSelection.getCheckboxProps }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable1"
        :dataSource="tableData1"
        :scroll="{ x: totalColumnWidth1,y: windowHeight1 }"
        :loading="loadMark"
        @row-click="rowClick"
      >
        <template #quantityRuku="{ record }">{{toThousandFilter(record.quantityRuku)}}</template>
        <template #quantityDaohuo="{ record }">{{toThousandFilter(record.quantityDaohuo)}}</template>
        <template #priceZg="{ record }">{{toThousandFilter(record.priceZg)}}</template>
        <template #icostZg="{ record }">{{toThousandFilter(record.icostZg)}}</template>
        <template #priceJs="{ record }">{{toThousandFilter(record.priceJs)}}</template>
        <template #icostJs="{ record }">{{toThousandFilter(record.icostJs)}}</template>
        <template #ccode="{ record }">
          <a @click="toRouter(record,'list')">{{record.ccode}}</a>
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
      <div class="pagination-text" :style="{top: (windowHeight1+60)+'px',left:(totalColumnWidth1-600)+'px'}" v-show="showPaginationText">
        {{`共 ${paginationNumber}条记录&emsp;每页 200 条`}}
      </div>
    </div>
    <Query @save="saveQuery" @register="registerQueryPage"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import {
  PrinterOutlined,
  UsbOutlined,
  CheckOutlined,
  ProfileOutlined,
  SettingFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined
} from '@ant-design/icons-vue'
import {Button, Input, message, Popover, Radio as ARadio, Select, Table, Tag,} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {toThousandFilter} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import {
  findAllByCcodeAndBillStyle,
  findAllByStockWarehListCcode,
  findCangkuAllList,
  findStockAllList
} from "/@/api/record/system/stock-wareh";
import {getPsnList} from "/@/api/record/system/psn";
import {findAllByFlag} from "/@/api/record/supplier_data/supplier";
import {findAll} from "/@/api/caozuoyuan/caozuoyuan";
import Query from './popup/query.vue'
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {initDynamics} from "./data1";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {
  delRuKu,
  findAllMainList,
  findStockWareByCcode,
  reviewSetCGRKG,
  reviewSetCGRKGMx
} from "/@/api/record/stock/stock-ruku";
import {exportExcel3} from "/@/api/record/generalLedger/excelExport";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {assemblyDynamicColumn} from "/@/views/boozsoft/stock/stock-caigou-dh/data";
import {deleteByMethodAndRecordNum, stockBalanceTaskSave} from "/@/api/record/stock/stock_balance";
import {findAllStockJiesuanList} from "/@/api/record/stock/stock-jiesuan";
import {findByStockAccId} from "/@/api/record/system/stock-account";

const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group
const TableSummary = Table.Summary
const TableSummaryRow = Table.Summary.Row
const TableSummaryCell = Table.Summary.Cell
const invoiceStyleList=ref([
  {label:'专用发票',title:'专用发票',value:'zyfp'},
  {label:'普通发票',title:'普通发票',value:'ptfp'},
  {label:'农副产品发票',title:'农副产品发票',value:'nfcpfp'},
  {label:'收据',title:'收据',value:'sj'},
])
const methodPayList=ref([
  {label:'其他',title:'其他',value:'QT'},
  {label:'全款现结',title:'全款现结',value:'QKXJ'},
  {label:'订金',title:'订金',value:'DJ'},
  {label:'限期收款',title:'限期收款',value:'XQSK'},
  {label:'月结',title:'月结',value:'YJ'},
])

const {
  createSuccessModal,
  createErrorModal,
  createWarningModal,
  createConfirm
} = useMessage()

const {closeCurrent,closeToFullPaths} = useTabs(router);
const summaryTotals = ref({})
const pageSearch = reactive({
  selectType: 'ccode',
  selectValue: '',
})

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
const [registerPrintPage, {openModal: openPrintPage}] = useModal()
const openPrint = () => {
  openPrintPage(true, {
    data: {
      dynamicTenantId: dynamicTenantId.value,
      defaultAdName: useCompanyOperateStoreWidthOut().getSchemaName,
      year: strDate.value.substring(0,4),
    }
  })
}

const loadPrint = (obj) => {
  loadMark.value = true
  const data = tableData1.value.filter(a=>a.bcheck!='11')
  let printList: any = []

  let printUser = ''
  let bcheck = ''
  let buname=hasBlank(formItems.value.buname)?'':formItems.value.buname
  if(obj.printUser){
    printUser = '制表人：' + useUserStoreWidthOut().getUserInfo.username
  }
  if(obj.bcheck){
    bcheck = '审核人：' + buname
  }

  let squantity=0
  let isum=0
  data.forEach((item,index) => {
    let item1 = {}
    item1[0] = index+1
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] = item.custCode
    item1[4] = setString(item.custName,10)
    item1[5] = item.psnName
    item1[6] = item.deptName
    item1[7] = setString(item.cwhcodeNameJoin,15)
    item1[8] = toThousandFilter(item.squantity)
    item1[9] = toThousandFilter(item.isum)
    item1[10] = item.cmakerName
    item1[11] = item.buname
    squantity+=parseFloat(item.squantity)
    isum+=parseFloat(item.isum)
    printList.push(item1)
  })
  for (let i=0; i<printList.length%27; i++){
    let item1 = {}
    item1[0] = ''
    item1[1] = ''
    item1[2] = ''
    item1[3] = ''
    item1[4] = ''
    item1[5] = ''
    item1[6] = ''
    item1[7] = ''
    item1[8] = ''
    item1[9] = ''
    item1[10] = ''
    item1[11] = ''
    item1[12] = ''
    item1[13] = ''
    item1[14] = ''
    item1[15] = ''
    if(printList.length%27==26){
      item1[1] = '合计'
      item1[8] = toThousandFilter(squantity)
      item1[9] = toThousandFilter(isum)
    }
    printList.push(item1)
  }

  let num = Math.ceil(printList.length/27)
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    doc.autoTable({
      head: [['', '', '', '', '采购核算列表', '', '', '', '', '', '', ''],
        ['核算单位：' + pageParameter.companyName, '', '','', '期间：'+ strDate.value+' - '+endDate.value ,'', '', '', '', '','', '单位：元'],
        ['序号', '单据日期', '单据编号', '供应商编码', '供应商名称', '业务员', '业务部门', '仓库', '数量合计', '价税合计', '经手人', '审核人']],
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
        data.doc.setFont('fuhuiR', 'bold')
        doc.autoTableText(
          printUser,
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          bcheck,
          data.cursor.x/2-25,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          '第'+data.doc.getCurrentPageInfo().pageNumber+'页/共'+num+'页',
          data.cursor.x - 50,
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
          if (data.column.index == 4) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'right'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 4) {
            data.cell.colSpan = 3
            data.cell.styles.cellPadding = {left: 20}
            data.cell.styles.halign = 'center'
          }else {
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
        }
      },
      columnStyles: {
        0: {maxHeight: 10,cellWidth: 30, halign: 'center'},
        1: {cellWidth: 50, halign: 'left'},
        2: {cellWidth: 60, halign: 'left'},
        3: {cellWidth: 50, halign: 'left'},
        4: {cellWidth: 50, halign: 'left'},
        5: {cellWidth: 40, halign: 'left'},
        6: {cellWidth: 40, halign: 'right'},
        7: {cellWidth: 60, halign: 'left'},
        8: {cellWidth: 50, halign: 'right'},
        9: {cellWidth: 50, halign: 'right'},
        10: {cellWidth: 40, halign: 'left'},
        11: {cellWidth: 40, halign: 'left'},
      }
    })
  })
}
//js切割字符串
function setString(str, len) {
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

//文件导入
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
onMounted(async() => {
  val.value.openOne = 1
  openQueryPage(true, {
    data: val,
  })
})
const popData:any=ref('')
const dataType=ref('0')
const databaseCo=ref('')
async function saveQuery(data) {
  let dataBaseInfo=await findByStockAccId(data.databaseTrue.substring(0,data.databaseTrue.length-5))
  databaseCo.value=dataBaseInfo?.coCode

  dynamicTenantId.value=data.databaseTrue
  saveLogData('查询',JSON.stringify(data.log))
  if(data.strDate.length>6){
    strDate.value=data.strDate.replaceAll('-','.')
    endDate.value=data.endDate.replaceAll('-','.')
  }else{
    strDate.value=data.strDate.substring(0,4)+'.'+data.strDate.substring(4,6)
    endDate.value=data.endDate.substring(0,4)+'.'+data.endDate.substring(4,6)
  }

  popData.value=data
  tablesData1()
}
async function saveLogData(optAction,log) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'采购核算列表',
    optAction:optAction,
    accId:defaultAdName.value,
    optContent:'操作内容【采购核算列表】,'+log,
  }
  await saveLog(logmap)
}

const formItems:any = ref({ selectType: '1' })

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const strDate:any = ref('');
const endDate:any = ref('');
const tableData1:any = ref([]);
const tableDataAll1:any = ref([]);
const loadMark = ref(false)
const paginationNumber = ref(0)
const showPaginationText = ref(false)
async function reloadTable(){
  loadMark.value = true
  tablesData1()
}
// 汇总
async function tablesData1(){
  loadMark.value = true
  popData.value.pageSearch=pageSearch
  tableDataAll1.value = await useRouteApi(findAllStockJiesuanList,{schemaName: dynamicTenantId})(popData.value)
  tableData1.value = tableDataAll1.value
  let len1 = tableData1.value.length
  paginationNumber.value=len1
  showPaginationText.value=true
  if(len1<50){
    for (let i =  len1; i < 50; i++) {
      tableData1.value.push({bcheck:'11'})
    }
  }
  calculateTotal()
  loadMark.value = false
}
const getCurrSummary  = () => {
  return (getColumns1().filter(it=>it.title != '序号'&& it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = () => {
  let list = JsonTool.parseProxy((tableData1.value).filter(it=>!hasBlank(it.ccode)))
  if (list.length == 0){
    summaryTotals.value = {}
    return false;
  }
  let quantityRuku = 0
  let quantityDaohuo = 0
  let priceZg = 0
  let icostZg = 0
  let priceJs = 0
  let icostJs = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    quantityRuku += parseFloat(e.quantityRuku || '0')
    quantityDaohuo += parseFloat(e.quantityDaohuo || '0')
    priceZg += parseFloat(e.priceZg || '0')
    icostZg += parseFloat(e.icostZg || '0')
    priceJs += parseFloat(e.priceJs || '0')
    icostJs += parseFloat(e.icostJs || '0')
  }
  summaryTotals.value={
    quantityRuku: toThousandFilter(quantityRuku),
    quantityDaohuo: toThousandFilter(quantityDaohuo),
    priceZg: toThousandFilter(priceZg),
    icostZg: toThousandFilter(icostZg),
    priceJs: toThousandFilter(priceJs),
    icostJs: toThousandFilter(icostJs),
  }
}

function reloadPage() {
  loadMark.value = true
  tablesData1()
  loadMark.value = false
}

const psnList:any = ref([])
const supplierList:any = ref([])
const cangkuList:any = ref([])
const userList:any = ref([])
const stockList:any = ref([])
async function reloadList() {
  psnList.value = await useRouteApi(getPsnList,{schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAllByFlag,{schemaName: dynamicTenantId})('1')
  supplierList.value = res.items
  cangkuList.value = await useRouteApi(findCangkuAllList,{schemaName: dynamicTenantId})({})
  const res1 = await findAll({})
  userList.value = res1.items
  stockList.value = await useRouteApi(findStockAllList, {schemaName: dynamicTenantId})({})
}

const CrudApi1 = {
  columns: [
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '单据编号',
      dataIndex: 'ccode',
      width: 150,
      align: 'left',
      ellipsis: true,slots: { customRender: 'ccode'}
    },
    {
      title: '供应商编码',
      key: 'custCode',
      dataIndex: 'custCode',
      width: 150,
      align: 'left',
      ellipsis: true,
    },{
      title: '供应商简称',
      dataIndex: 'custName',
      key: 'custName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '入库结算数量',
      dataIndex: 'quantityRuku',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'quantityRuku'}
    },{
      title: '到货结算数量',
      dataIndex: 'quantityDaohuo',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'quantityDaohuo'}
    },{
      title: '结算单价',
      dataIndex: 'priceJs',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'priceJs'}
    },{
      title: '结算金额',
      dataIndex: 'icostJs',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'icostJs'}
    },{
      title: '暂估单价',
      dataIndex: 'priceZg',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'priceZg'}
    },{
      title: '暂估金额',
      dataIndex: 'icostZg',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'icostZg'}
    },
    {
      title: '备注',
      key: 'cmemo',
      dataIndex: 'cmemo',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
  ]
}

function formatCvencode(cvencode){
  let str = cvencode
  supplierList.value.forEach(item=>{
    if(item.id==cvencode){
      str = item.custName
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

function formatUser(user){
  let str = user
  userList.value.forEach(item=>{
    if(item.id == user){
      str = item.realName
    }
  })
  return str
}

function formatCinvode(cinvode){
  let str = cinvode
  stockList.value.forEach(item=>{
    if (item.stockNum == cinvode){
      str = item.stockName
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
const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled: hasBlank(record.ccode)
  }),
};
function rowClick(a) {
  if(hasBlank(a.ccode)){
    deleteSelectRowByKey1(a.key)
  }
}
// 这是示例组件
const [registerTable1, {
  reload: reload1,
  getDataSource: getDataSource1,
  setTableData: setTableData1,
  setPagination: setPagination1,
  getPaginationRef: getPaginationRef1,
  getColumns: getColumns1,
  getSelectRows:getSelectRows1,
  setColumns: setColumns1,
  deleteSelectRowByKey:deleteSelectRowByKey1,
  clearSelectedRowKeys:clearSelectedRowKeys1,
}] = useTable({
  columns: CrudApi1.columns,
  bordered: true,
  showIndexColumn: true,
  indexColumnProps:{ fixed:true },
  pagination: {
    pageSize: 200,
    simple:true
  },
})

//选中内容
const state:any = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const checkRow: any = ref([])
const onSelectChange = (selectedRowKeys,row) => {
  // console.log('selectedRowKeys changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
};

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
const excelThisData = () =>{
  const arrData:any = []
  const columns:any = getColumns1().filter(a=>a.ifShow==true)
  columns.forEach((a,index)=>{
    let temp=tableData1.value[index]
    if(!hasBlank(temp.id)){
      arrData.push(temp)
    }
  })
  if(arrData.length==0)return message.error('没有数据,无法导出!!')

  const multiHeader:any = [[]]
  const keys:any = []
  //样式靠右列
  let rightrow:any=[]
  //样式靠左列
  let leftrow:any=[]

  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  columns.forEach((v,index)=>{
    if(v.title.indexOf('数量')!=-1||v.title.indexOf('价税合计')!=-1||v.title.indexOf('无税金额')!=-1){
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
    a.jscustCode=a.jscustCode==null?'':a.jscustCode
    a.jscustName=a.jscustName==null?'':a.jscustName
    a.personName=a.personName==null?'':a.personName
    a.deptName=a.deptName==null?'':a.deptName
    a.cmemo=a.cmemo==null?'':a.cmemo
    a.cmakerName=a.cmakerName==null?'':a.cmakerName
    a.buname=a.buname==null?'':a.buname
    a.squantity=toThousandFilter(a.squantity)
    a.icost=toThousandFilter(a.icost)
    a.isum=toThousandFilter(a.isum)
    list.push(a)
  })
  const sheet =[
    {
      multiHeader: multiHeader,
      table: list,
      keys: keys,
      sheetName: 'sheet1',
      cellStyle: [],
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  exportExcel3(sheet, 'xlsx','采购核算列表_'+pageParameter.companyName)
}

/*start栏目设置*/
const visible1 = ref(false);
const windowWidth1 = (window.innerWidth - (70))
const windowHeight1 = (window.innerHeight - (320))
const totalColumnWidth1 = ref(0)
const dynamicColumns1 = initDynamics().DEFAULT
const dynamicColumnData = ref({value:[]})
const editableData1 = reactive({});
const tableRef1: any = ref(null)
const visible3:any = ref(false)
const lanMuData = ref({
  accId: 'postgres',
  menuName: '采购核算列表',
  type: '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})

const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi1.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value.value, newA)
  setColumns1(newA)
  initTableWidth(newA)
  if(!hasBlank(popData.value)){
    reloadTable()
  }
}
function initTableWidth(thisCs) {
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  /*  // 去除操作咧宽
    total -= 100*/
  if (total > windowWidth1) {
    let f = 0
    if (visible1.value) f = 260
    totalColumnWidth1.value = Number(windowWidth1) - f
    tableRef1.value.$el.style.setProperty('width', (windowWidth1 + 40 - f) + 'px')
  } else {
    if (visible1.value && (windowWidth1 - 260) < total) total -= (total - (windowWidth1 - 260))
    totalColumnWidth1.value = total
    tableRef1.value.$el.style.setProperty('width', (total + 40) + 'px')
  }
}
/*汇总栏目设置end*/


const dynamicAdReload = async (obj) => {
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

  visible3.value = true
  setTimeout(()=>
      visible3.value = false
    ,100)
  await reloadList()
  lanMuData.value.changeNumber+=1
}

async function toRouter(data,type) {
  await closeToFullPaths('/cg-jiesuan')
  setTimeout(()=>{
    router.push({path: 'cg-jiesuan',query: {ccode:data.xyccode,co: databaseCo.value}});
  },1000)
}
function editFun() {
  if(state.selectedRowKeys.length!==1){
    message.error("只能选择一条数据修改！")
    return false
  }
  let data=getDataSource1().filter(g=>state.selectedRowKeys.indexOf(g.key)!=-1)
  router.push({name: 'CaiGouFaPiao',params: {type:'edit',ccode:data[0].ccode}});
}

const [registerLackPage, {openModal: openLackPage}] = useModal()
const newDate=ref(new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "))
async function delFun() {
  if(getSelectRows1().length==0){
    return message.error("至少选择一条数据删除！")
  }
  createConfirm({
    iconType: 'warning',
    title: '采购核算删除',
    content: '您确定要进行采购核算删除吗!',
    onOk: async () => {
      loadMark.value=true
      for (let i = 0; i < getSelectRows1().length; i++) {
        tempTaskSave('删除',getSelectRows1()[i].ccode)
        await useRouteApi(delRuKu, {schemaName: dynamicTenantId})({id: getSelectRows1()[i].id})
      }
      message.success('删除成功！')
      loadMark.value=false
      reloadTable()
      clearSelectedRowKeys1()
    },
    onCancel: async () => {
      loadMark.value=false
      reloadTable()
      clearSelectedRowKeys1()
    }
  })
}
async function tempTaskSave(method,ccode) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:pageParameter.year,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'采购核算',method:method,recordNum:ccode,caozuoModule:'stock'})
    .then((a)=>{
      console.log('任务='+JSON.stringify(a))
    })
}
function sumArr(arr) {
  if(arr.length==0)return
  return arr.reduce(function(prev, curr, idx, arr){
    return parseFloat(prev) + parseFloat(curr);
  });
}
// 随机数
function randomString(length) {
  var str = '0123456789abcdefghijklmnopqrstuvwxyz';
  var result = '';
  for (var i = length; i > 0; --i)
    result += str[Math.floor(Math.random() * str.length)];
  return result;
}
</script>
<style src="./global-menu-index.less" lang="less" scoped></style>
<style scoped lang="less">
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}
:deep(.nc-summary){
  font-weight: bold;
  background-color: #cccccc!important;;
  border-right-color: #cccccc!important;
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
  margin: 0px 10px;
  background: #b4c8e3 !important;
  margin-top: 1px;
  position: relative;
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

.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 99%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;    top: 12px;
      position: inherit
    }
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(2){margin-top: 14px;}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;margin-right: 8px;
    >div:nth-of-type(1){
      .ant-btn-me {
        color: #0096c7;
      }
    }
    >div:nth-of-type(2){
      display: inline-flex;justify-content: space-between;margin-top: 15px;
    }
  }
}
</style>
