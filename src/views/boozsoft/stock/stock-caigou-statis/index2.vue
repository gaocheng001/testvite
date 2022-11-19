<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <BarChartOutlined style="color: #0096c7;font-size: 60px;"/>
        </div>
        <div  style="padding-top: 10px">
          <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/>
        </div>
      </div>
      <div>
        <div><b class="noneSpan" style="font-size: 24px;color: #0096c7;">{{ pageParameter.queryMark=='1'?'存货':'供应商' }}采购统计表</b></div>
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
            @click="exportExcelFun()"
          ><span>导出</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openPrint"
          ><span>打印</span></button>
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
                <DynamicColumn :defaultData="defaultData" :dynamicData="dynamicColumnModel" :lanmuInfo="lanMuData" @reload="reloadColumns" v-if="pageParameter.queryMark=='1'"/>
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
        <BasicTable
            ref="tableRef"
            :row-selection="{ type: 'checkbox'}"
            @row-click="rowClick"
            :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
            @register="registerTable"
            :dataSource="tableData"
            :scroll="{ x: totalColumnWidth,y: windowHeight }"
            :loading="loadMark"
        >
          <template #bcheck="{ record }">
            <span v-if="record.bcheck != null">
              <Tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
                {{ record.bcheck === '1' ? '已审核' : '未审核' }}
              </Tag>
            </span>
          </template>
          <template #cnumber="{ record }"><span v-if="!isNaN(record.cnumber)">{{ parseFloat(record.cnumber).toFixed(2) }}</span></template>
          <template #baseQuantity="{ record }"><a v-if="!isNaN(record.cnumber)" class="tableUStyle" @click="openNewPage(record)">{{ parseFloat(record.baseQuantity).toFixed(2) }}</a></template>
          <template #isumRuku="{ record }">{{ toThousandFilter(record.isumRuku) }}</template>
          <template #isumTuihuo="{ record }">{{ toThousandFilter(record.isumTuihuo) }}</template>
          <template #isumFapiao="{ record }">{{ toThousandFilter(record.isumFapiao) }}</template>
          <template #isumJieKuan="{ record }">{{ toThousandFilter(record.isumJieKuan) }}</template>
          <template #noJieKuan="{ record }">{{ toThousandFilter(record.noJieKuan) }}</template>
          <template #icost="{ record }">{{ toThousandFilter(record.icost) }}</template>
          <template #itaxprice="{ record }">{{ toThousandFilter(record.itaxprice) }}</template>
          <template #isum="{ record }">{{ toThousandFilter(record.isum) }}</template>
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
      <div :class="'pagination-text'" :style="{top: (windowHeight+60)+'px',left:(totalColumnWidth-600)+'px'}" v-show="showPaginationText">
        {{`共 ${paginationNumber}条记录&emsp;每页 1000 条`}}
      </div>
    </div>
    <Query @query="saveQuery" @register="registerQueryPage"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
    <Excel @save="saveExcel" @register="registerExcelPage"/>
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
import Print from './popup/print.vue'
//导入
import Excel from './popup/excel.vue'
//导出
/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, getTablePropertys, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {
  findStockDbLanMuList,
  saveStockLanMuList
} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
/**********************汇总栏目设置**********************/
import {findAll as findAllJiLang, findUnitInfoList} from "/@/api/record/system/unit-mea";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import {
  findAllStockWarehTongji_CGDHD,
  findAllStockWarehTongjiSUP_CGDHD
} from "/@/api/record/system/stock-wareh";
import {exportExcel4} from "/@/api/record/generalLedger/excelExport";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";

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
const [registerPrintPage, {openModal: openPrintPage}] = useModal()

function rowClick(a) {
  if(hasBlank(a.ccode)){
    deleteSelectRowByKey(a.key)
  }
}
const replenishTrs = (list) =>{
  let l = list.length
  if(l<50){
    for (let i =  l; i < 50; i++) {
      list.push({})
    }
  }
  return list
}
const getCurrSummary  = () => {
  let data=pageParameter.queryMark=='1'?(getColumns().filter(it=>it.title != '序号'&& it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;})):(getColumns().filter(it=>it.title != '序号').map((it,ind)=>{it['ind']=ind+2;return it;}))
  return data
}
const calculateTotal = (data) => {
  let list = JsonTool.parseProxy((data))
  if (list.length == 0){
    summaryTotals.value = {}
    return false;
  }
  summaryTotals.value={}
  let cnumber = 0
  let baseQuantity = 0
  let icost = 0
  let itaxprice = 0
  let isum = 0
  let isumRuku = 0
  let isumTuihuo = 0
  let isumFapiao = 0
  let isumJieKuan = 0
  let noJieKuan = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    cnumber += parseFloat(e.cnumber || '0')
    baseQuantity += parseFloat(e.baseQuantity || '0')
    icost += parseFloat(e.icost || '0')
    itaxprice += parseFloat(e.itaxprice || '0')
    isum += parseFloat(e.isum || '0')
    isumRuku += parseFloat(e.isumRuku || '0')
    isumTuihuo += parseFloat(e.isumTuihuo || '0')
    isumFapiao += parseFloat(e.isumFapiao || '0')
    isumJieKuan += parseFloat(e.isumJieKuan || '0')
    noJieKuan += parseFloat(e.noJieKuan || '0')
  }
  summaryTotals.value={
    cnumber: toThousandFilter(cnumber),
    baseQuantity: toThousandFilter(baseQuantity),
    icost: toThousandFilter(icost),
    itaxprice: toThousandFilter(itaxprice),
    isum: toThousandFilter(isum),
    isumRuku: toThousandFilter(isumRuku),
    isumTuihuo: toThousandFilter(isumTuihuo),
    isumFapiao: toThousandFilter(isumFapiao),
    isumJieKuan: toThousandFilter(isumJieKuan),
    noJieKuan: toThousandFilter(noJieKuan),
  }
}

const openPrint = () => {
  openPrintPage(true, {})
}
const newDate=ref(new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "))
const loadPrint = (obj) => {
  loadMark.value = true
  let printUser = ''
  let thisDate = ''
  if(obj.printUser){
    printUser = '制表人：' + useUserStoreWidthOut().getUserInfo.username
  }
  if(obj.thisDate){
    thisDate = '打印时间：' + newDate.value
  }
  if(pageParameter.queryMark=='1'){
    printStock(obj,printUser,thisDate)
  }else{
    printSupplier(obj,printUser,thisDate)
  }
}

const printStock = (obj,printUser,thisDate) => {
  const data = tableData.value.filter(a=>!hasBlank(a.cinvode))
  let printList: any = []

  let cnumber=0
  let baseQuantity=0
  let icost=0
  let itaxprice=0
  let isum=0

  data.forEach((item,index) => {
    let item1 = {}
    item1[0] = index+1
    item1[1] = setString(item.cinvode,20)
    item1[2] = setString(item.stockName,45)
    item1[3] = item.unitName
    item1[4] = parseFloat(item.cnumber).toFixed(2)
    item1[5] = item.mainUnitName
    item1[6] = parseFloat(item.baseQuantity).toFixed(2)
    item1[7] = toThousandFilter(item.icost)
    item1[8] = toThousandFilter(item.itaxprice)
    item1[9] = toThousandFilter(item.isum)

    cnumber+=parseFloat(item.cnumber)
    baseQuantity+=parseFloat(item.baseQuantity)
    icost+=parseFloat(item.icost)
    itaxprice+=parseFloat(item.itaxprice)
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
    if(printList.length%27==26){
      item1[1] = '合计'
      item1[4] = toThousandFilter(cnumber)
      item1[6] = toThousandFilter(baseQuantity)
      item1[7] = toThousandFilter(icost)
      item1[8] = toThousandFilter(itaxprice)
      item1[9] = toThousandFilter(isum)
    }
    printList.push(item1)
  }
  let num = Math.ceil(printList.length/27)
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    let tableName=pageParameter.queryMark=='1'?'存货':'供应商'
    tableName=tableName+'采购统计表'
    doc.autoTable({
      head: [['', '', '', tableName, '', '', '', '', '', ''],
        ['核算单位：' + companyName.value, '', '', '期间：'+ qijianText.value , '', '','', '','', '单位：元'],
        ['序号', '存货编码', '存货名称', '计量单位', '数量', '主计量','主数量', '无税金额','税额', '价税合计']],
      body: printList,
      styles: tableStyle(),
      margin: {
        left: 30,
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
          thisDate,
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
          if (data.column.index == 3) {
            data.cell.colSpan = 4
            data.cell.styles.halign = 'center'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 3) {
            data.cell.colSpan = 4
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
        0: {maxHeight: 10,cellWidth: 20, halign: 'center'},
        1: {cellWidth: 70, halign: 'left'},
        2: {cellWidth: 150, halign: 'left'},
        3: {cellWidth: 40, halign: 'center'},
        4: {cellWidth: 40, halign: 'right'},
        5: {cellWidth: 40, halign: 'center'},
        6: {cellWidth: 50, halign: 'right'},
        7: {cellWidth: 60, halign: 'right'},
        8: {cellWidth: 60, halign: 'right'},
        9: {cellWidth: 60, halign: 'right'},
      }
    })
  })
}
const printSupplier = (obj,printUser,thisDate) => {
  const data = tableData.value.filter(a=>!hasBlank(a.custCode))
  let printList: any = []

  let icost=0
  let itaxprice=0
  let isum=0
  let isumJieKuan=0
  let noJieKuan=0
  data.forEach((item,index) => {
    let item1 = {}
    item1[0] = index+1
    item1[1] = item.custCode
    item1[2] = setString(item.custName,30)
    item1[3] = item.jscustCode
    item1[4] = setString(item.jscustName,30)
    item1[5] = toThousandFilter(item.icost)
    item1[6] = toThousandFilter(item.itaxprice)
    item1[7] = toThousandFilter(item.isum)
    item1[8] = toThousandFilter(item.isumJieKuan)
    item1[9] = toThousandFilter(item.noJieKuan)

    icost+=parseFloat(item.icost)
    itaxprice+=parseFloat(item.itaxprice)
    isum+=parseFloat(item.isum)
    isumJieKuan+=parseFloat(item.isumJieKuan)
    noJieKuan+=parseFloat(item.noJieKuan)
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
    if(printList.length%27==26){
      item1[1] = '合计'
      item1[5] = toThousandFilter(icost)
      item1[6] = toThousandFilter(itaxprice)
      item1[7] = toThousandFilter(isum)
      item1[8] = toThousandFilter(isumJieKuan)
      item1[9] = toThousandFilter(noJieKuan)
    }
    printList.push(item1)
  }
  let num = Math.ceil(printList.length/27)
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    let tableName=pageParameter.queryMark=='1'?'存货':'供应商'
    tableName=tableName+'采购统计表'
    doc.autoTable({
      head: [['', '', '', tableName, '', '', '', '', '', ''],
        ['核算单位：' + companyName.value, '', '','期间：'+ qijianText.value ,'', '','',  '', '', '单位：元'],
        ['序号', '供应商编码', '供应商名称', '结算供应商编码', '结算供应商名称', '无税金额', '税额', '价税合计', '累计结款金额', '未结款金额']],
      body: printList,
      styles: tableStyle(),
      margin: {
        left: 30,
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
          thisDate,
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
          if (data.column.index == 3) {
            data.cell.colSpan = 4
            data.cell.styles.halign = 'center'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 3
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 3) {
            data.cell.colSpan = 4
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
        0: {maxHeight: 10,cellWidth: 20, halign: 'center'},
        1: {cellWidth: 50, halign: 'left'},
        2: {cellWidth: 100, halign: 'left'},
        3: {cellWidth: 60, halign: 'left'},
        4: {cellWidth: 100, halign: 'left'},
        5: {cellWidth: 60, halign: 'right'},
        6: {cellWidth: 50, halign: 'right'},
        7: {cellWidth: 50, halign: 'right'},
        8: {cellWidth: 50, halign: 'right'},
        9: {cellWidth: 50, halign: 'right'},
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

const popData:any=ref('')
const popDataAll:any=ref('')
const companyName=ref('')
async function saveQuery(e) {
  popDataAll.value=e
  let data = e.data
  dynamicTenantId.value = data.constant.tenantId
  popData.value=data.variable
  defaultData.value=data.variable.queryType=='1'?initDynamics()['1']:initDynamics()['2']

  popData.value.searchInput=data.constant.queryType=='1'?'stockNum':'custCode'
  companyName.value = data.constant.companyName
  pageParameter.queryMark = data.constant.queryType
  pageParameter.query = data.variable
  qijianText.value=data.variable.strTimeView+' - '+data.variable.endTimeView

  findByAll()
  reloadList(e.map)
  pageParameter.selectClass=hasBlank(data.variable.cinvodeClass)?'':data.variable.cinvodeClass
  reloadColumns()
}

const paginationNumber = ref(0)
const showPaginationText = ref(false)
async function findByAll() {
  loadMark.value = true
  loadMark.value = true
  if(pageParameter.queryMark=='1'){
    tableDataAll.value=await useRouteApi(findAllStockWarehTongji_CGDHD,{schemaName: dynamicTenantId})(popData.value)
  }else{
    tableDataAll.value=await useRouteApi(findAllStockWarehTongjiSUP_CGDHD,{schemaName: dynamicTenantId})(popData.value)
  }
  paginationNumber.value=tableDataAll.value.length
  showPaginationText.value=true
  // 金额格式化
  calculateTotal(tableDataAll.value)
  tableData.value =replenishTrs(tableDataAll.value)
  loadMark.value = false
}

const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))
const accId = ref('')

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)
const jiList = ref([])
const manyJiList = ref([])
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

// 这是示例组件
const [registerTable, {
  deleteSelectRowByKey,
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
  indexColumnProps:{ fixed:true },
  pagination: {
    pageSize: 1000,
    simple:true
  },
})

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

const defaultPage = ref(false)
onMounted(async() => {
  val.value.openOne = 1
  openQueryPage(true, {
    data: val.value
  })
  initTable()
  reloadJiCiList()
})

const [registerExcelPage, {openModal: openExcelPage}] = useModal()
//文件导入
const openExcel = async () => {
  openExcelPage(true, {})
}

const exportExcelFun = () =>{
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
    if(v.title.indexOf('数量')!=-1||v.title.indexOf('价税合计')!=-1||v.title.indexOf('无税金额')!=-1||v.title.indexOf('税额')!=-1){
      rightrow.push(cell[index])
    }else{
      leftrow.push(cell[index])
    }
    multiHeader[0].push(v.title)
    keys.push(v.key)
  })
  let list:any=[]
  arrData.filter(a=>a.bcheck!=='11').forEach((a,index)=>{
    a.cinvode=a.cinvode==null?'':a.cinvode
    a.stockName=a.stockName==null?'':a.stockName
    a.custCode=a.custCode==null?'':a.custCode
    a.custName=a.custName==null?'':a.custName
    a.jscustCode=a.jscustCode==null?'':a.jscustCode
    a.jscustName=a.jscustName==null?'':a.jscustName
    list.push(a)
  })

  let name=pageParameter.queryMark=='1'?'存货':'供应商'
  name=name+'采购统计表'
  const sheet =[
    {
      title:name,
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
  exportExcel4(sheet, 'xlsx',name+'_'+companyName.value)
}

async function saveExcel(data) {}

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (320) )
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
const defaultData: any = ref(initDynamics()['1'])
const dynamicColumnModel = ref({value:[]})
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = ref({
  'accId': dynamicTenantId,
  'menuName': '采购统计表',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,  changeNumber:0
})

const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(getTablePropertys(pageParameter.queryMark)))
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
const dynamicAdReload = async (obj) => {
  accId.value=obj.accId
}
const selectChange = (v) => {
  if(pageParameter.queryMark == '1'){
    popData.value.cinvodeClass=v
  }else{
    popData.value.cvencode=v
  }
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


function openNewPage(e) {
  popDataAll.value.data.variable.cinvode2=e.cinvode
  message.success('两秒后将进入明细列表！')
  setTimeout(()=>{
    router.push({
      path:'/cg-mxList',
      query: {data: JSON.stringify(popDataAll.value.data),map:JSON.stringify(popDataAll.value.map)}
    });
  },2000)
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
    width: 20%;text-align:center;
    margin-top: 7px;
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
