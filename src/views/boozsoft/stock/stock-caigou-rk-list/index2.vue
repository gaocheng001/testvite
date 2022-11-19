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
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">采购入库单列表</b></div>
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
            @click="router.push({name: 'CaigouRk',params: {type:'add',ccode:''}})"
          ><span>新增</span></button>
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
          <Popover placement="bottom">
            <template #content>
              <Button @click="startReview(true)">审核</Button><br/>
              <Button @click="startReview(false)">弃审</Button>
            </template>
            <Button class="ant-btn ant-btn-me">审核</Button>
          </Popover>
          <button type="button" class="ant-btn ant-btn-me" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')"><span>退出</span></button>
        </div>
        <div>
          <div>
            <Select v-model:value="pageSearch.selectType" class="acttdrd-search-select" style="font-size: 12px;width: 150px;text-align: left;">
              <SelectOption style="font-size: 12px;" value="ccode">单据编号</SelectOption>
              <SelectOption style="font-size: 12px;" value="supName">供应商简称</SelectOption>
            </Select>
            <InputSearch
              v-model:value="pageSearch.selectValue"
              class="acttdrd-search-input"
              style="width: 150px;"
              @search="reloadTable"
            />
            <Button class="ant-btn-me">
              <SyncOutlined :style="{ fontSize: '14px' }" @click="reloadTable"/>
            </Button>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
                <span class="group-btn-span-special2" @click="dataType='0';reloadPage()" :style="dataType=='0'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 200px;cursor: pointer;">
                  按汇总显示&emsp;<CheckOutlined v-if="dataType=='0'"/>
                </span><br/>
                <span class="group-btn-span-special2" @click="dataType='1';reloadPageMX()" :style="dataType=='1'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 200px;cursor: pointer;">
                  按明细显示&emsp;<CheckOutlined v-if="dataType=='1'"/>
                </span>
              </template>
              <Button>
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover class="ant-btn-default" placement="bottom" v-model:visible="visible3">
              <template #content>
                <DynamicColumn :defaultData="(dataType=='0'?initDynamics()['DATA']:initDynamics()['MX'])" :dynamicData="dataType=='0'?dynamicColumnData:dynamicColumnDataMX" :lanmuInfo="dataType=='0'?lanMuData:lanMuDataMX" @reload="dataType=='0'?reloadColumns():reloadColumnsMX()"/>
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
        v-show="dataType=='0'"
      >
        <template #ccode="{ record }">
          <a @click="toRouter(record,'list')">{{record.ccode}}</a>
        </template>
        <template #bcheck="{ record }">
          <span v-if="record.bcheck!=='11'">
            <Tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
              {{ record.bcheck === '1' ? '已审核' : '未审核' }}
            </Tag>
          </span>
        </template>
        <template #icost="{ record }">
          <span :style="record.icost<0?{color:'red'}:{}">
            {{toThousandFilter(record.icost)}}
          </span>
        </template>
        <template #squantity="{ record }">
           <span :style="record.squantity<0?{color:'red'}:{}">
            {{toThousandFilter(record.squantity)}}
          </span>
        </template>
        <template #isum="{ record }">
         <span :style="record.isum<0?{color:'red'}:{}">
            {{toThousandFilter(record.isum)}}
          </span>
        </template>
        <template #invoiceStyle="{ record }">
          {{ hasBlank(record.invoiceStyle)?'':invoiceStyleList.filter(a=>a.value==record.invoiceStyle)[0].label }}
        </template>
        <template #methodPay="{ record }">
          {{ hasBlank(record.methodPay)?'':methodPayList.filter(a=>a.value==record.methodPay)[0].label }}
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
      <!-- 明细-->
      <BasicTable
        ref="tableRef"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange,getCheckboxProps:rowSelection.getCheckboxProps }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable"
        :dataSource="tableData"
        :scroll="{ x: totalColumnWidth,y: windowHeight }"
        :loading="loadMark"
        @row-click="rowClick"
        v-show="dataType=='1'"
      >
        <template #ccode="{ record }">
          <a @click="toRouter(record,'list')">{{record.ccode}}</a>
        </template>
        <template #bcheck="{ record }">
          <span v-if="record.bcheck!=='11'">
            <Tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
              {{ record.bcheck === '1' ? '已审核' : '未审核' }}
            </Tag>
          </span>
        </template>

        <template #cnumber="{ record }">
          <span v-if="record.bcheck!=='11'" :style="record.cnumber<0?{color:'red'}:{}">
              {{ toThousandFloat(record.cnumber) }}
          </span>
        </template>
        <template #itaxrate="{ record }">
          <span v-if="record.bcheck!=='11'" :style="record.itaxrate<0?{color:'red'}:{}">
            {{ toThousandFloat(record.itaxrate) }}
          </span>
        </template>
        <template #baseQuantity="{ record }">
          <span v-if="record.bcheck!=='11'" :style="record.baseQuantity<0?{color:'red'}:{}">
             {{ toThousandFloat(record.baseQuantity) }}
          </span>
        </template>
        <template #itaxprice="{ record }">
          <span v-if="record.bcheck!=='11'" :style="record.itaxprice<0?{color:'red'}:{}">
            {{toThousandFilter(record.itaxprice)}}
          </span>
        </template>
        <template #price="{ record }">
          {{toThousandFilter(record.price)}}
        </template>
        <template #icost="{ record }">
          <span :style="record.icost<0?{color:'red'}:{}">
            {{toThousandFilter(record.icost)}}
          </span>
        </template>
        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;">
              <TableSummaryCell class="nc-summary" :index="0" :align="'center'" style="border-right: none;">合</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="1" :align="'center'" style="border-right: none;">计</TableSummaryCell>
              <TableSummaryCell class="nc-summary" style="border-right: none;" v-for="cell in getCurrSummary()" :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryTotals[cell.dataIndex]?'':summaryTotals[cell.dataIndex]}}</span></TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>

      <div class="pagination-text" :style="{top: (windowHeight1+60)+'px',left:(totalColumnWidth1-600)+'px'}" v-show="showPaginationText">
        {{`共 ${paginationNumber} 条记录&emsp;每页 200 条`}}
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
  PicLeftOutlined,
  ProfileOutlined,
  CheckOutlined,
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
  findAllStockWarehTongjiMX_CGDHD,
  findByStockWarehLinecode,
  findByStockWaresCcodeAndLineCode,
  findCangkuAllList,
  findStockAllList,
  getPYRKDAndNoBcheck1,
  stockWarehListSave
} from "/@/api/record/system/stock-wareh";
import {getPsnList} from "/@/api/record/system/psn";
import {findAllByFlag} from "/@/api/record/supplier_data/supplier";
import {findAll} from "/@/api/caozuoyuan/caozuoyuan";
import Query from './popup/query.vue'
// import Print from './popup/print.vue'
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {initDynamics} from "./data1";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {
  delRuKu, delStockWareZip, delXyCsourceByxyCcode,
  findAllMainList,
  findStockWareByCcode,
  reviewSetCGRKG,
  reviewSetCGRKGMx, verifyDataState, verifySyCsourceByXyCode, xyCsourceSave
} from "/@/api/record/stock/stock-ruku";
import {exportExcel3} from "/@/api/record/generalLedger/excelExport";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {assemblyDynamicColumn} from "/@/views/boozsoft/stock/stock-caigou-rk-list/data1";
import {
  deleteByMethodAndRecordNum,
  getByStockBalanceTask,
  stockBalanceTaskSave
} from "/@/api/record/stock/stock_balance";
import {verifyStockXCLList} from "/@/api/record/stock/stock-currents";
import {
  getNewStockJiesuanNum,
  saveJiesuanPojo,
  saveJiesuansPojo
} from "/@/api/record/stock/stock-jiesuan";
import {findUnitAssociationList} from "/@/api/record/system/unit-mea";
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
      head: [['', '', '', '', '采购入库单列表', '', '', '', '', '', '', ''],
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
const duoJlMxList=ref([])
const databaseCo=ref('')
async function saveQuery(data) {
  let dataBaseInfo=await findByStockAccId(data.databaseTrue.substring(0,data.databaseTrue.length-5))
  databaseCo.value=dataBaseInfo?.coCode

  dynamicTenantId.value=data.databaseTrue
  saveLogData('查询',JSON.stringify(data.log))
  if(data.strDate.length>6){
    strDate.value=data.strTimeView.replaceAll('-','.')
    endDate.value=data.endTimeView.replaceAll('-','.')
  }else{
    strDate.value=data.strTimeView.substring(0,4)+'.'+data.strTimeView.substring(4,6)
    endDate.value=data.endTimeView.substring(0,4)+'.'+data.endTimeView.substring(4,6)
  }

  popData.value=data
  duoJlMxList.value = await useRouteApi(findUnitAssociationList, {schemaName: dynamicTenantId})({})
  tablesData1()
}
async function saveLogData(optAction,log) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'采购入库单列表',
    optAction:optAction,
    accId:defaultAdName.value,
    optContent:'操作内容【采购入库单列表】,'+log,
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
  if(dataType.value=='0'){
    tablesData1()
  }else{
    reloadPageMX()
  }
}
// 汇总
async function tablesData1(){
  loadMark.value = true
  popData.value.pageSearch=pageSearch
  let list = await useRouteApi(findAllMainList,{schemaName: dynamicTenantId})(popData.value)
  for (let i = 0; i < list.length; i++) {
    list[i].cwhcodeNameJoin=await getCKName(list[i].cwhcode)
  }
  tableData1.value = list
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
  return dataType.value=='0'?
    (getColumns1().filter(it=>it.title != '序号'&& it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
    :
    (getColumnsMX().filter(it=>it.title != '序号'&& it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = () => {
  let list = JsonTool.parseProxy((tableData1.value).filter(it=>!hasBlank(it.ccode)))
  if (list.length == 0){
    summaryTotals.value = {}
    return false;
  }
  let squantity = 0
  let icost = 0
  let cnumber = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    squantity += parseFloat(e.squantity || '0')
    icost += parseFloat(e.icost || '0')
    cnumber += parseFloat(e.cnumber || '0')
  }
  summaryTotals.value={
    squantity: toThousandFilter(squantity),
    icost: toThousandFilter(icost),
    cnumber: toThousandFilter(cnumber)
  }
}

function reloadPage() {
  loadMark.value = true
  tablesData1()
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
      title: '状态',
      dataIndex: 'bcheck',
      width: 80,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'bcheck' }
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: 100,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '单据编号',
      dataIndex: 'ccode',
      width: 100,
      align: 'left',
      ellipsis: true,slots: { customRender: 'ccode' }
    },
    {
      title: '供应商编码',
      dataIndex: 'custCode',
      width: 150,
      align: 'left',
      ellipsis: true,
    },{
      title: '供应商简称',
      dataIndex: 'custName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '结算供应商编码',
      dataIndex: 'jscustCode',
      width: 150,
      align: 'left',
      ellipsis: true,
    },{
      title: '结算供应商简称',
      dataIndex: 'jscustName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '业务员',
      dataIndex: 'personName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '业务部门',
      dataIndex: 'deptName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '库管员',
      dataIndex: 'cwhcodeUserName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '仓库',
      dataIndex: 'cwhcodeNameJoin',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '数量合计',
      dataIndex: 'squantity',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'squantity'}
    },
    {
      title: '金额合计',
      dataIndex: 'icost',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'icost'}
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '经手人',
      dataIndex: 'cmakerName',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '审核人',
      dataIndex: 'buname',
      width: 150,
      align: 'left',
      ellipsis: true,
    },
  ],
  columnsMx:[
    {
      title: '状态',
      dataIndex: 'bcheck',
      align: 'left',
      ellipsis: true,slots: { customRender: 'bcheck' },
    },
    {
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
    },
    {
      title: '供应商简称',
      dataIndex: 'cvencodeName',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '结算供应商编码',
      dataIndex: 'cvencodeJs',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '结算供应商简称',
      dataIndex: 'cvencodeJsname',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '仓库',
      dataIndex: 'cwhcodeNameJoin',
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
    },
    {
      title: '规格型号',
      dataIndex: 'stockGgxh',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '计量单位',
      dataIndex: 'unitName',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'cnumber',
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cnumber' },
    },
    {
      title: '主计量',
      dataIndex: 'stockUnitName',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '主数量',
      dataIndex: 'baseQuantity',
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'baseQuantity' },
    },
    {
      title: '批次',
      dataIndex: 'batchId',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '税率%',
      dataIndex: 'itaxrate',
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'itaxrate' },
    },
    {
      title: '税额',
      dataIndex: 'itaxprice',
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'itaxprice' },
    },
    {
      title: '无税单价',
      dataIndex: 'price',
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'price' },
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'icost' },
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      align: 'left',
      ellipsis: true,
    }
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
    deleteSelectRowByKeyMX(a.key)
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
  const columns:any = dataType.value=='0'?getColumns1().filter(a=>a.ifShow==true):getColumnsMX().filter(a=>a.ifShow==true)
  columns.forEach((a,index)=>{
    let temp=dataType.value=='0'?tableData1.value[index]:tableData.value[index]
    if(!hasBlank(temp.id) || temp.bcheck!=='11'){
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
    if(v.title.indexOf('数量')!=-1||v.title.indexOf('合计')!=-1||v.title.indexOf('金额')!=-1){
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
    a.cwhcodeUserName=a.cwhcodeUserName==null?'':a.cwhcodeUserName
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
  exportExcel3(sheet, 'xlsx','采购入库单列表_'+pageParameter.companyName)
}

/*start栏目设置*/
const visible1 = ref(false);
const windowWidth1 = (window.innerWidth)
const windowHeight1 = (window.innerHeight - (320))
const totalColumnWidth1 = ref(0)
const dynamicColumns1 = initDynamics().DEFAULT
const dynamicColumnData = ref({value:[]})
const editableData1 = reactive({});
const tableRef1: any = ref(null)
const visible3:any = ref(false)
const lanMuData = ref({
  accId: 'postgres',
  menuName: '采购入库单列表',
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
}
function initTableWidth(thisCs) {
  let total = 60+60
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
  // 执行操作前判断单据是否存在
  let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'rowEdit',list:[data].map(t=>{t.ccodeBcheck=t.ccode+'>>>'+t.bcheck;return t;}).map(t=>t.ccodeBcheck)})
  if(hasBlank(msg)){
    return message.error("单据列表已发生变化,请刷新当前列表！")
  }
  await closeToFullPaths('/kc-cgDepot')
  setTimeout(()=>{
    router.push({path: 'kc-cgDepot',query: {type:'info',ccode:data.ccode,co: databaseCo.value}});
  },1000)
}
async function editFun() {
  let data=dataType.value=='0'?getSelectRows1():getSelectRowsMX()
  if(data.length!==1){
    message.error("只能选择一条数据修改！")
    return false
  }
  // 判断任务锁定表
  for (let i = 0; i < data.length; i++) {
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:strDate.value.split('.')[0],name:'采购入库单',method:'修改,审核,删除',recordNum:data[i].ccode})
    if(!hasBlank(taskData)){
      for (let i = 0; i < taskData.length; i++) {
        // 任务不是当前操作员的
        if(taskData[i]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
          return message.error(taskData[i]?.username+'正在'+taskData[i]?.method+'采购入库单,不能同时进行操作！')
        }
      }
    }
  }
  // 执行操作前判断单据是否存在
  let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'audit',list:data.map(t=>{t.ccodeBcheck=t.ccode+'>>>'+t.bcheck;return t;}).map(t=>t.ccodeBcheck)})
  if(hasBlank(msg)){
    return message.error("单据列表已发生变化,请刷新当前列表！")
  }
  await closeToFullPaths('/kc-cgDepot')
  setTimeout(()=>{
    router.push({path: 'kc-cgDepot',query: {type:'edit',ccode:data[0].ccode,co: databaseCo.value}});
  },1000)
}

const [registerLackPage, {openModal: openLackPage}] = useModal()
const newDate=ref(new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "))
const startReview = async (b) => {
  let data=dataType.value=='0'?getSelectRows1():getSelectRowsMX()
  if(data.length==0){
    return message.error("至少选择一条数据审核！")
  }
  // 执行操作前判断单据是否存在
  let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'audit',list:data.map(t=>{t.ccodeBcheck=t.ccode+'>>>'+t.bcheck;return t;}).map(t=>t.ccodeBcheck)})
  if(hasBlank(msg)){
    return message.error("单据列表已发生变化,请刷新当前列表！")
  }

  // 有无 整理现存量 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'整理现存量',method:'整理现存量'})
  if(!hasBlank(xclTaskData)){
    return message.error('系统正在进行现存量整理操作，不能进行单据处理，请销后再试！')
  }
  // 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'月末结账',method:'月末结账'})
  if(!hasBlank(jzMethod)){
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  // 盘点处理
  let pd= await useRouteApi(getPYRKDAndNoBcheck1, { schemaName: dynamicTenantId })(pageParameter.year)
  if(pd>0){
    return message.error('正在进行盘点处理，不能进行单据新增操作，请销后再试！')
  }
  let list=data.filter(a=>b?a.bcheck!='1':a.bcheck=='1')
  if(b){
    for (let i = 0; i < list.length; i++) {
      tempTaskSave(b?'审核':'弃审',list[i].ccode)
      let res=await useRouteApi(findStockWareByCcode, { schemaName: dynamicTenantId })(list[i].ccode)
      // 审核、弃审
      let bcheck=b?'1':'0'
      let bcheckTime=b?new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "):''
      let bcheckUser=b?useUserStoreWidthOut().getUserInfo?.id:''
      res.bcheck=bcheck
      res.bcheckTime=bcheckTime
      res.bcheckUser=bcheckUser
      await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)

      // 明细
      let mx=await useRouteApi(findAllByCcodeAndBillStyle, {schemaName: dynamicTenantId})({ccode:list[i].ccode,type:'CGRKD'})
      mx.forEach(tx=>{
        tx.bcheck=bcheck
        tx.bcheckTime=bcheckTime
        tx.bcheckUser=bcheckUser
      })
      await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(mx)
      // 审核：是参照生成单据 并且 来源单据是到货单 并且是 到货单立账
      if(res.sourcetype=='CGDHD'&&pageParameter.thisAdInfo.target.apSourceFlag=='1'){
        // 结算单据新编码
        let jsNewNum=await useRouteApi(getNewStockJiesuanNum, {schemaName: dynamicTenantId})({})
        jsNewNum='JS-'+new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,7).replace("T"," ").replace("-","")+'-'+jsNewNum
        let jiesuansList:any=[]

        for (let i = 0; i < mx.length; i++) {
          let tx=mx[i]
          // 获取来源单据 无税单价、无税金额
          let sourceData=await useRouteApi(findByStockWaresCcodeAndLineCode, {schemaName: dynamicTenantId})({ccode:tx.sourcecode,lineCode:tx.sourcedetailId})
          let jiesuans:any={}
          jiesuans.iyear=tx.iyear
          jiesuans.lineCode=tx.lineCode
          jiesuans.ddate=tx.ddate
          jiesuans.ccode=jsNewNum
          jiesuans.ccodeRuku=tx.ccode
          jiesuans.ccodeDaohuo=tx.sourcecode
          jiesuans.cinvode=tx.cinvode
          jiesuans.cgUnitId=tx.cgUnitId
          jiesuans.quantityRuku=tx.baseQuantity
          jiesuans.priceJs=sourceData.price
          let icostJs:any=parseFloat(tx.baseQuantity)*parseFloat(sourceData.price)
          jiesuans.icostJs=parseFloat(icostJs).toFixed(2)
          jiesuans.priceZg=tx.price
          jiesuans.icostZg=tx.icost
          jiesuans.ccodeLy=tx.sourcetype
          jiesuans.quantityDaohuo=sourceData.baseQuantity
          jiesuansList.push(jiesuans)
        }
        let baccDate=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," ")
        mx.map(tx=>{tx.baccFlag='1';tx.baccUser=useUserStoreWidthOut().getUserInfo.id;tx.baccDate=baccDate;return tx})
        let jieSuanData:any={}
        jieSuanData.ccode=jsNewNum
        jieSuanData.cmaker=useUserStoreWidthOut().getUserInfo.id
        jieSuanData.bdocumStyle=dataType.value
        jieSuanData.iyear=formItems.value.iyear
        jieSuanData.cvencode=formItems.value.cvencode
        jieSuanData.cvencodeJs=formItems.value.cvencodeJs
        jieSuanData.cdepcode=formItems.value.cdepcode
        jieSuanData.cpersoncode=formItems.value.cpersoncode
        jieSuanData.ccodeRuku=formItems.value.ccode
        jieSuanData.ddate=new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,10).replace("T"," ")
        // 增加 结算单主表
        await useRouteApi(saveJiesuanPojo, {schemaName: dynamicTenantId})(jieSuanData)
        await useRouteApi(saveJiesuansPojo, {schemaName: dynamicTenantId})(jiesuansList)
        // 添加下游表
        let xy={iyear:list[i].iyear,billStyle:'CGRKD',ccode:list[i].ccode,ccodeDate:list[i].ddate,xyBillStyle:'CGJSD',xyccode:jsNewNum,xyccodeDate:list[i].ddate}
        await useRouteApi(xyCsourceSave, {schemaName: dynamicTenantId})(xy)
      }
      await useRouteApi(deleteByMethodAndRecordNum, {schemaName: dynamicTenantId})({method:'删除',ccode:list[i].ccode})
    }
  }
  else{
    for (let i = 0; i < list.length; i++) {
      let findByRukuData=await useRouteApi(verifySyCsourceByXyCode, {schemaName: dynamicTenantId})({year:list[i].iyear,ccode:list[i].ccode,billStyle:'CGRKD'})
      if(findByRukuData.length>0 ){
        message.error('已经生成下游单据,不能弃审！')
        return false;
      }

      // 明细
      let mx=await useRouteApi(findAllByCcodeAndBillStyle, {schemaName: dynamicTenantId})({ccode:list[i].ccode,type:'CGRKD'})
      let verifylist:any=[]
      for (let j = 0; j < mx.length; j++) {
        let temp2:any={}
        temp2.iyear=mx[j].iyear
        temp2.stockNum=mx[j].cinvode
        temp2.stockName=mx[j].cinvodeName
        temp2.stockGgxh=mx[j].bcheck1
        temp2.cwhcode=mx[j].cwhcode
        temp2.batchId=mx[j].batchId
        temp2.dpdate=mx[j].dpdate
        temp2.dvdate=mx[j].dvdate
        temp2.baseQuantity=mx[j].baseQuantity
        temp2.lackBaseQuantity=''
        temp2.unitName=duoJlMxList.value.filter(uni=>uni.id==mx[j].cgUnitId)[0]?.unitName
        verifylist.push(temp2)
      }
      // 现存量不足 弹出框提示
      let currData=await useRouteApi(verifyStockXCLList, { schemaName: dynamicTenantId })({queryType:'xcl',list:JSON.stringify(verifylist),rkBcheck:pageParameter.thisAdInfo.target?.kcCgrkCheck,ckBcheck:pageParameter.thisAdInfo.target?.kcXsckCheck,bdocumStyle:dataType.value,iyear:pageParameter.year})
      // 如果是负数强制转换成正数比较
      currData=currData.filter(t=>parseFloat(t.lackBaseQuantity)!=0).map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
      if(currData.length>0){
        return  openLackPage(true,{data:currData,queryType:'xcl',dynamicTenantId:dynamicTenantId.value})
      }

      tempTaskSave(b?'审核':'弃审',list[i].ccode)
      let res=await useRouteApi(findStockWareByCcode, { schemaName: dynamicTenantId })(list[i].ccode)
      // 审核、弃审
      let bcheck=b?'1':'0'
      let bcheckTime=b?new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "):''
      let bcheckUser=b?useUserStoreWidthOut().getUserInfo?.id:''
      res.bcheck=bcheck
      res.bcheckTime=bcheckTime
      res.bcheckUser=bcheckUser
      await useRouteApi(reviewSetCGRKG, {schemaName: dynamicTenantId})(res)
      mx.forEach(tx=>{
        tx.bcheck=bcheck
        tx.bcheckTime=bcheckTime
        tx.bcheckUser=bcheckUser
      })
      await useRouteApi(reviewSetCGRKGMx, {schemaName: dynamicTenantId})(mx)
      await useRouteApi(deleteByMethodAndRecordNum, {schemaName: dynamicTenantId})({method:'删除',ccode:list[i].ccode})
    }
  }
  loadMark.value=true
  message.success(b?'审核':'弃审'+'成功！')
  loadMark.value=false
  await tablesData1()
  await clearSelectedRowKeys1()
}
async function delFun() {
  let checklist=dataType.value=='0'?getSelectRows1():getSelectRowsMX()
  if(checklist.length==0){
    return message.error("至少选择一条数据删除！")
  }
  let list=checklist.filter(a=>a.bcheck=='1')
  if(list.length>0){
    return message.error('提示：已经审核，不能删除，请弃审单据后重试！！')
  }

  // 执行操作前判断单据是否存在
  let msg=await useRouteApi(verifyDataState, { schemaName: dynamicTenantId })({dataType:'cg',operation:'del',list:list.map(t=>{t.ccodeBcheck=t.ccode+'>>>'+t.bcheck;return t;}).map(t=>t.ccodeBcheck)})
  if(hasBlank(msg)){
    return message.error("单据列表已发生变化,请刷新当前列表！")
  }

  // 有无 整理现存量 任务
  let xclTaskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'整理现存量',method:'整理现存量'})
  if(!hasBlank(xclTaskData)){
    return message.error('系统正在进行现存量整理操作，不能进行单据处理，请销后再试！')
  }
  // 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'月末结账',method:'月末结账'})
  if(!hasBlank(jzMethod)){
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  // 盘点处理
  let pd= await useRouteApi(getPYRKDAndNoBcheck1, { schemaName: dynamicTenantId })(pageParameter.year)
  if(pd>0){
    return message.error('正在进行盘点处理，不能进行单据新增操作，请销后再试！')
  }

  let verifylist:any=[]
  // 任务
  for (let i = 0; i < checklist.length; i++) {
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'采购入库单',method:'修改,审核,删除',recordNum:checklist[i].ccode})
    if(!hasBlank(taskData)){
      // 任务不是当前操作员的
      if(taskData[0]?.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
        return createWarningModal({ content: '【'+checklist[i].ccode+'】'+taskData[0]?.username+'正在'+taskData[0]?.method+'采购到货单,不能同时进行操作！' });
      }
    }

    // 入库单明细
    let mx=await useRouteApi(findAllByStockWarehListCcode, {schemaName: dynamicTenantId})([checklist[i].ccode])
    for (let j = 0; j < mx.length; j++) {
      // 判断可用量所需条件
      let tx=mx[j]
      let temp2:any={}
      temp2.iyear=tx.iyear
      temp2.stockNum=tx.stockNum
      temp2.stockName=tx.stockName
      temp2.stockGgxh=tx.stockBarcode
      temp2.cwhcode=tx.stockCangkuId
      temp2.batchId=tx.batchNumber
      temp2.dpdate=tx.dpdate
      temp2.dvdate=tx.dvdate
      temp2.baseQuantity=tx.baseQuantity
      temp2.lackBaseQuantity=''
      temp2.unitName=duoJlMxList.value.filter(uni=>uni.id==mx[j].cgUnitId)[0]?.unitName
      verifylist.push(temp2)
    }
  }
  // 入库单保存就是现存量  1是（查现存量） 0否（查可用量）
  let currData=await useRouteApi(verifyStockXCLList, { schemaName: dynamicTenantId })({queryType:pageParameter.thisAdInfo.target?.kcCgrkCheck=='1'?'xcl':'keyong',list:JSON.stringify(verifylist),rkBcheck:pageParameter.thisAdInfo.target?.kcCgrkCheck,ckBcheck:pageParameter.thisAdInfo.target?.kcXsckCheck,bdocumStyle:dataType.value,iyear:pageParameter.year})
  // 如果是负数强制转换成正数比较
  currData=currData.filter(t=>parseFloat(t.lackBaseQuantity)!=0).map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
  if(currData.length>0){
    return  openLackPage(true,{data:currData,queryType:pageParameter.thisAdInfo.target?.kcCgrkCheck=='1'?'xcl':'keyong',dynamicTenantId:dynamicTenantId.value})
  }

  createConfirm({
    iconType: 'warning',
    title: '采购入库单删除',
    content: '您确定要进行采购入库单删除吗!',
    onOk: async () => {
      loadMark.value=true
      for (let i = 0; i < checklist.length; i++) {
        tempTaskSave('删除',checklist[i].ccode)
        // 上游单据 && 是否生成
        if(!hasBlank(checklist[i].sourcetype)){
          // 删除下游单据
          await useRouteApi(delXyCsourceByxyCcode, {schemaName: dynamicTenantId})(checklist[i].ccode)
          // 入库单明细
          let mx=await useRouteApi(findAllByStockWarehListCcode, {schemaName: dynamicTenantId})({ccode:checklist[i].ccode,type:'CGRKD'})
          for (let j = 0; j < mx.length; j++) {
            // 上游单据明细
            let sourceData=await useRouteApi(findByStockWarehLinecode, {schemaName: dynamicTenantId})(mx[j].sourcedetailId)
            // 期初到货单 不修改累计入库数量
            if(sourceData.billStyle!=='QC'){
              sourceData.isumRuku=parseFloat(sourceData.isumRuku)-(parseFloat(list[i].baseQuantity))
              console.log('修改来源单据累计入库数量='+sourceData.isumRuku)
              await useRouteApi(stockWarehListSave, {schemaName: dynamicTenantId})([sourceData])
            }
          }
        }
        await useRouteApi(delStockWareZip, {schemaName: dynamicTenantId})({ccode: checklist[i].ccode})
        await useRouteApi(deleteByMethodAndRecordNum, {schemaName: dynamicTenantId})({method:'删除',ccode:checklist[i].ccode})
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
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:pageParameter.year,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'采购入库单',method:method,recordNum:ccode,caozuoModule:'stock'})
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

// ==========================   明细模式  =========================
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (320) )
const totalColumnWidth = ref(0)
const tableData = ref([])
const tableDataAll:any = ref([])
const tableRef: any = ref(null)
const dynamicColumnDataMX:any = ref({value:[]})

const lanMuDataMX = ref({
  accId: dynamicTenantId.value,
  menuName: '采购入库单明细列表',
  type: '明细',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})
const [registerTable, {
  reload:rereloadMX,
  getSelectRows:getSelectRowsMX,
  deleteSelectRowByKey:deleteSelectRowByKeyMX,
  getDataSource:getDataSourceMX,
  setTableData:setTableDataMX,
  getColumns:getColumnsMX,
  setColumns:setColumnsMX
}] = useTable({
  columns: CrudApi1.columnsMx,
  bordered: true,
  showIndexColumn: true,
  indexColumnProps:{ fixed:true },
  pagination: {
    pageSize: 1000,
    simple:true
  },
})

const reloadPageMX = async () => {
  loadMark.value = true
  let list=await useRouteApi(findAllStockWarehTongjiMX_CGDHD,{schemaName: dynamicTenantId})(popData.value)
  for (let i = 0; i < list.length; i++) {
    list[i].cwhcodeNameJoin=await getCKName(list[i].cwhcode)
  }
  paginationNumber.value=list.length
  showPaginationText.value=true
  calculateTotalMX(list)
  tableData.value =replenishTrs(list)
  loadMark.value = false
  reloadColumnsMX()
}
const reloadColumnsMX = () => {
  let newA = CrudApi1.columnsMx
  newA = assemblyDynamicColumn(dynamicColumnDataMX.value.value,newA)
  setColumnsMX(newA)
  initTableMXWidth(newA)
}
const calculateTotalMX = (data) => {
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
const replenishTrs = (list) =>{
  let l = list.length
  if(l<50){
    for (let i =  l; i < 50; i++) {
      list.push({bcheck:'11'})
    }
  }
  return list
}
function initTableMXWidth(thisCs) {
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
function toThousandFloat(num: any) {
  if (parseFloat(num)==0) {
    return ''
  }
  return (+num || 0).toFixed(2)
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
    width: 20%;text-align:center;margin-top: 7px;
    >div:nth-of-type(2){margin-top: 0px;}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;
    margin-right: 8px;
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
// 去除空白行
:deep(.ant-table-measure-row){
  td{
    padding: 0 !important;
  }
}
</style>
