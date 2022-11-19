<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <BarChartOutlined />
        </div>
        <div>
          <div><AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/></div>
          <div>
<!--           <span style="color: black;margin-left: 1em;">{{getHomeOrSelectName(false)}}：</span>
            <Select v-if="pageParameter.queryMark != 4" style="width: 250px" v-model:value="pageParameter.selectClass" @change="selectChange">
              <SelectOption value="">全部</SelectOption>
              <SelectOption v-for="it in selectClassList" :value="it.value">{{it.label}}</SelectOption>
            </Select>-->
            <!--    <Cascader
                 v-else
                 :options="selectClassList"
                 v-model:value="pageParameter.selectList"
                 placeholder="省/市/区"
                 style="width: 250px;border: none;text-align: center"
                 @change="selectChange"
               />-->
          </div>
        </div>
      </div>
      <div>
        <div><b class="noneSpan" style="font-size: 24px;color: #0096c7;">销售明细表</b></div>
        <div><span style="font-size: 14px;font-weight: bold;">日期：{{qijianText}}</span></div>
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
          ><span>邮件</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="excelDataCode()"
          ><span>导出</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
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
    <div class="app-container">
        <BasicTable
                ref="tableRef"
                :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
                @register="registerTable"
                :dataSource="tableData"
                :scroll="{ x: totalColumnWidth+20,y: windowHeight }"
                :loading="loadMark"
        >
            <template #bcheck="{ record }">
              <span v-if="record.bcheck != null">
                <Tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
                  {{ record.bcheck === '1' ? '已审核' : '未审核' }}
                </Tag>
              </span>
            </template>
          <template #ccode="{ record }">
            <a @click="toRouter(record,'list')" >{{record.ccode}}</a>
          </template>
            <template #icost="{ record }">{{ toThousandFilter(record.icost) }}</template>
            <template #baseQuantity="{ record }">{{ toThousandFilter(record.baseQuantity) }}</template>
            <template #quantity="{ record }">{{ toThousandFilter(record.quantity) }}</template>
            <template #isumChuku="{ record }">{{ toThousandFilter(record.isumChuku) }}</template>
            <template #isumJijian="{ record }">{{ toThousandFilter(record.isumJijian) }}</template>
            <template #isumFapiao="{ record }">{{ toThousandFilter(record.isumFapiao) }}</template>
            <template #isum="{ record }">{{ toThousandFilter(record.isum) }}</template>
            <template #cvencodeCode="{ record }">{{ formatCvencode(record.cvencode,'custCode') }}</template>
            <template #cvencodeJsCode="{ record }">{{ formatCvencode(record.cvencodeJs,'custCode') }}</template>
            <template #cvencode="{ record }">{{ formatCvencode(record.cvencode,'custName') }}</template>
            <template #cvencodeJs="{ record }">{{ formatCvencode(record.cvencodeJs,'custName') }}</template>
            <template #cpersoncode="{ record }">{{ formatCpersoncode(record.cfree3) }}</template>
            <template #bworkableUser="{ record }">{{ formatUser(record.cfree4) }}</template>
            <template #bcheckUser="{ record }">{{ formatUser(record.bcheckUser) }}</template>
            <template #cdepcode="{ record }">{{ formatCdepcode(record.cfree2) }}</template>
            <template #cwhcode="{ record }">{{ formatCwhcode(record.cwhcode) }}</template>
            <template #cmaker="{ record }">{{ formatUser(record.cmaker) }}</template>
            <template #cunitid="{ record }">{{ formatCunitid(record.cinvode) }}</template>
            <template #xsUnitId="{ record }">{{ formatCunitid(record.cinvode,record.xsUnitId) }}</template>
            <template #cunitidF1="{ record }">{{ formatCunitid(record.cinvode,record.cunitidF1) }}</template>
            <template #cunitidF2="{ record }">{{ formatCunitid(record.cinvode,record.cunitidF2) }}</template>
            <template #cinvodeBarcode="{ record }">{{ formatCinvode(record.cinvode,'cinvodeBarcode') }}</template>
            <template #cinvodeName="{ record }">{{ formatCinvode(record.cinvode,'stockName') }}</template>
            <template #speciType="{ record }">{{ formatGgxh(record.cinvode) }}</template>
            <template #subQuantity1="{ record }">{{  toThousandFilter(record.subQuantity1)}}</template>
            <template #subQuantity2="{ record }">{{  toThousandFilter(record.subQuantity2)}}</template>
            <template #itaxprice="{ record }">{{  toThousandFilter(record.itaxprice)}}</template>
            <template #taxprice="{ record }">{{  toThousandFilter(record.taxprice)}}</template>
            <template #price="{ record }">{{  toThousandFilter(record.price)}}</template>
            <template #itaxrate="{ record }">{{  toThousandFilter(record.itaxrate)}}</template>
            <template #isGive="{ record }">{{ record.isGive==null?'':(record.isGive=='1'?'是':'否')}}</template>

          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow style="background-color: #cccccc;">
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合计</TableSummaryCell>
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':summaryModel[cell.dataIndex]}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
        <div class="pagination-text" v-show="showPaginationText"   :style="{left:(windowWidth>totalColumnWidth?(totalColumnWidth-220):windowWidth-300)+'px'}">
          {{`共 ${paginationNumber} 条记录 每页 200 条`}}
        </div>
    </div>
    <Query @query="saveQuery" @register="registerQueryPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
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
//导出
import {defaultV, sheet_from_array_of_arrays, Workbook, writeExcel} from "/@/utils/boozsoft/excel/excel2";
import XLSX from "xlsx-js-style";
/**********************明细栏目设置**********************/
import { getTablePropertys, initDynamics} from "./data";
import {assemblyDynamicColumn} from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {useUserStoreWidthOut} from "/@/store/modules/user";
/**********************汇总栏目设置**********************/
import {
  findMingXi, operateBeforeCheck,
} from "/@/api/record/stock/stock-xhd";
import {findAll as findAllJiLang, findUnitInfoList} from "/@/api/record/system/unit-mea";
import {JsonTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {useRoute} from "vue-router";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";
import {
  getByStockBalanceBatchTask,
  stockBalanceTaskEditNewTime
} from "/@/api/record/stock/stock_balance";
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


const formItems = ref({
  selectType: '1'
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
  openQueryPage(true, {
    data: val
  })
}

async function saveQuery(e) {
  let data = e.data
  dynamicTenantId.value = data.constant.tenantId
  dynamicTenantName.value = data.constant.atName
  pageParameter.queryMark = data.constant.queryType
  pageParameter.query = data.variable
  if (!hasBlank(data.variable.periodStart)){
    qijianText.value = formatText(data.variable.periodStart)+ ' - '+formatText(data.variable.periodEnd)
  }else{
    qijianText.value = data.variable.dateStart.replaceAll(/-/g,'.')+ ' - '+data.variable.dateEnd.replaceAll(/-/g,'.')
  }
  reloadList(e.map)
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
const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))
const dynamicTenantName = ref('')

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)
const showPaginationText = ref(false)
const paginationNumber = ref(0)
async function reloadTable(){
  loadMark.value = true
  showPaginationText.value = false
  tableDataAll.value = await useRouteApi(findMingXi,{schemaName: dynamicTenantId})(ObjTool.dels(pageParameter,['selectList']))
  tableData.value =replenishTrs(JsonTool.parseProxy(tableDataAll.value))
  await setPagination({
    total: tableDataAll.value.length
  })
  paginationNumber.value = tableDataAll.value.length
  calculateTotal()
  loadMark.value = false
  showPaginationText.value = true
}
const jiList = ref([])
const manyJiList = ref([])
const psnList:any = ref([])
const deptList:any = ref([])
const supplierList:any = ref([])
const cangkuList:any = ref([])
const userList:any = ref([])
const stockList:any = ref([])
const selectClassList:any = ref([])

const summaryTotals = ref({})

async function reloadList(map) {
 /* psnList.value = await useRouteApi(getPsnList,{schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAllByFlag,{schemaName: dynamicTenantId})('1')
  supplierList.value = res.items
  cangkuList.value = await useRouteApi(findCangkuAllList,{schemaName: dynamicTenantId})({})
  const res1 = await findAll({})
  userList.value = res1.items
  stockList.value = await useRouteApi(findStockAllList, {schemaName: dynamicTenantId})({})*/
  psnList.value = map['user']
  deptList.value = map['dept']
  userList.value = map['operator']
  supplierList.value = map['cust']
  cangkuList.value = map['warehouse']
  stockList.value = map['stock']

  if (pageParameter.queryMark == '1'){
    selectClassList.value = map['stock']
    pageParameter.selectClass = pageParameter.query.cinvode
  }else if (pageParameter.queryMark == '2'){
    pageParameter.selectClass = hasBlank(pageParameter.query.cvencode)?pageParameter.query.cvencodeJs:pageParameter.query.cvencode
    selectClassList.value = map['cust']
  }else if (pageParameter.queryMark == '3'){
    pageParameter.selectClass = pageParameter.query.cpersoncode
    selectClassList.value = map['user']
  }else {
    pageParameter.selectList = pageParameter.query.region.split(',')
    selectClassList.value = map['zone']
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
function formatCdepcode(cpersoncode){
  let str = ''
  if (null != cpersoncode){
    deptList.value.forEach(item=>{
      if(item.value == cpersoncode){
        str = item.deptName
      }
    })
  }
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
          if (null == k && list.length > 0){
            str = list[0].unitName
          }else{
            str  = list.filter(it=>it.id == k)[0]?.unitName
          }
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
  type:'XHD',
  showRulesSize: 'MIN',
  query: {},
  selectClass: '',
  selectList: [],
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
  indexColumnProps: {fixed: true},
  pagination: {
    pageSize: 200,
    simple: true
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



function onSearch() {
}

const defaultPage = ref(false)
const route = useRoute();
onMounted(async() => {
  if (Object.keys(route.query).length !== 0) {
    pageParameter.queryMark = route.query.mark
    pageParameter.query = route.query
    if (!hasBlank(route.query.periodStart)){
      qijianText.value = formatText( route.query.periodStart)+ ' - '+formatText( route.query.periodEnd)
    }else{
      qijianText.value =  route.query.dateStart+ ' - '+ route.query.dateEnd
    }
    pageParameter.selectClass = hasBlank(route.query.cinvode)?route.query.cvencode:route.query.cinvode
    let q = ['user', 'cust', 'dept', 'operator', 'warehouse', 'stock', 'whClass','custClass','zone']
    reloadJiCiList()
    reloadList((await useRouteApi(findStockCaiGouList, {schemaName: dynamicTenantId})([...new Set(q)].join(','))))
    initTable()
  } else {
    val.value.openOne = 1
    openQueryPage(true, {
      data: val.value
    })
  }
})


const excelDataCode = () => {
  let list: any = []
  const arrData = JsonTool.parseProxy(tableData.value).filter(it=>it.ccode != null)
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = item.bcheck=='1'?'已审核':'未审核'
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] =   formatCvencode(item.cvencode,'custCode') || ''
    item1[4] = formatCvencode(item.cvencode,'custName') || ''
    item1[5] =  formatCvencode(item.cvencodeJs,'custCode') || ''
    item1[6] =formatCvencode(item.cvencodeJs,'custName') || ''
    item1[7] = item.cdepcode==null?'':formatCdepcode(item.cdepcode)
    item1[8] = item.cpersoncode==null?'':formatCpersoncode(item.cpersoncode)
    item1[9] = formatCwhcode(item.cwhcode)
    item1[10] = formatCinvode(item.cinvode,'cinvodeBarcode') || ''
    item1[11] = item.cinvode
    item1[12] = formatCinvode(item.cinvode,'stockName')
    item1[13] = formatGgxh(item.cinvode)
    item1[14] = formatCunitid(item.cinvode,item.xsUnitId)
    item1[15] = toThousandFilter(item.quantity)
    item1[16] = formatCunitid(item.cinvode,item.cunitid)
    item1[17] = toThousandFilter(item.baseQuantity)
    item1[18] = item.batchId
    item1[19] = toThousandFilter(item.itaxrate)
    item1[20] = toThousandFilter(item.price)
    item1[21] = toThousandFilter(item.icost)
    item1[22] = toThousandFilter(item.itaxprice)
    item1[23] = toThousandFilter(item.taxprice)
    item1[24] = toThousandFilter(item.isum)
    item1[25] =item.isGive === '1'?'是':'否'
    item1[26] =item.dpdate
    item1[27] =item.dvdate
    item1[28] = item.cmemo || ''
    item1[29] = formatUser(item.cmaker)|| ''
    item1[30] = item.bcheckUser==null?'':formatUser(item.bcheckUser)
    list.push(item1)
  })
  const sheet:any = [
    {
      title: '销售明细表',
      multiHeader: [
        ['状态', '单据日期', '单据编码', '销售客户编码', '销售客户名称','结算客户编码', '结算客户名称','业务部门', '业务员',  '仓库名称', '条形码','存货编码', '存货名称', '规格型号', '计量单位','数量','主计量','主数量','批号','税率','无税单价','无税金额','税额','含税单价','价税合计','赠品','生效日期','失效日期','备注','经手人','审核人']
      ],
      table: list,
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34],
      merges: [],
      sheetName: '销售明细表',
      cellStyle: [
        {
          cell: 'A1',
          font: {
            name: '宋体',
            sz: 14,
            color: {rgb: "000000"},
            bold: true,
          },
          border: {color: {rgb: "ffffff"}}
        },
      ],
      colWidth: [8, 8, 10, 15, 12, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]
    }
  ]
  // 处理数据前
  if (!sheet || sheet.length <= 0) {
    this.onError('Table data cannot be empty')
    return
  }
  const wb:any = Workbook()
  sheet.forEach((item, index) => {
    let {
      // 标题
      title,
      // 表头
      tHeader,
      // 多级表头
      multiHeader,
      // 表格数据
      table,
      // 表格底部数据
      foot,
      // 合并项
      merges,
      // 数据键值
      keys,
      // 列宽
      colWidth,
      // 表名
      sheetName,
      // 全局样式
      globalStyle,
      // 单元格样式
      cellStyle
    } = item
    sheetName = sheetName || defaultV.sheetName
    // 默认全局样式覆盖
    const dgStyle = defaultV.globalStyle
    if (globalStyle) {
      Object.keys(dgStyle).forEach(key => {
        globalStyle[key] = {...dgStyle[key], ...globalStyle[key]}
      })
    } else {
      globalStyle = dgStyle
    }
    // 处理标题格式
    if (title || title === '') {
      // 取表头、多级表头中的最大值
      const tHeaderLength = tHeader && tHeader.length || 0
      const multiHeaderLength = multiHeader && Math.max(...multiHeader.map(m => m.length)) || 0
      const titleLength:any = Math.max(tHeaderLength, multiHeaderLength, keys.length)
      // 第一个元素为title，剩余以空字符串填充
      title = [title].concat(Array(titleLength - 1).fill(''))
      // 处理标题的合并\
      const cell = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','AA','AB','AC','AD','AE']
      let mergeSecond = 'A1'
      if (titleLength > 26) {
        const one = parseInt(titleLength) / 26
        const two = titleLength % 26
        mergeSecond = cell[one - 1] + cell[two - 1] + '1'
      } else {
        mergeSecond = cell[titleLength - 1] + '1'
      }
      const titleMerge = `A1:${mergeSecond}`
      if (!merges) {
        merges = [titleMerge]
      } else {
        if (merges.indexOf(titleMerge) === -1) {
          merges.push(titleMerge)
        }
      }
    }
    //表头对应字段
    let data = table.map(v => keys.map(j => v[j]))
    // 多级表头
    if (multiHeader) {
      // 倒序循环
      for (let i = multiHeader.length - 1; i >= 0; i--) {
        data.unshift(multiHeader[i]);
      }
    }
    tHeader && data.unshift(tHeader);
    title && data.unshift(title);
    //表格底部对应字段
    /*if (foot || foot === '') {
      foot && data.push(foot);
      const str = ('A' + data.length) + (':I' + data.length)
      merges.push(str)
    }*/
    const ws = sheet_from_array_of_arrays(data,'');
    if (merges && merges.length > 0) {
      if (!ws['!merges']) ws['!merges'] = [];
      merges.forEach(merge => {
        ws['!merges'].push(XLSX.utils.decode_range(merge))
      })
    }
    // 如果没有列宽则自适应
    if (!colWidth) {
      // 基准比例，以12为标准
      const benchmarkRate = globalStyle.font.sz && globalStyle.font.sz / 12 || 1
      // 空字符长度
      const nullstr = 10 * benchmarkRate + 2
      // 单个中文字符长度
      const chinese = 2 * benchmarkRate
      // 单个非中文字符长度
      const nChinese = benchmarkRate
      //设置worksheet每列的最大宽度,并+2调整一点列宽
      const sheetColWidth = data.map(row => row.map(val => {
        //先判断是否为null/undefined
        if (!val) {
          return {
            'wch': nullstr
          };
        } else {
          const strArr = val.toString().split('')
          const pattern = new RegExp("[\u4E00-\u9FA5]+")
          let re = strArr.map(str => {
            // 是否为中文
            if (pattern.test(str)) {
              return chinese
            } else {
              return nChinese
            }
          })
          re = re.reduce((total, r) => total + r, 0)
          return {
            'wch': re + 2
          };
        }
      }))
      /*以第一行为初始值*/
      let result = sheetColWidth[0];
      for (let i = 1; i < sheetColWidth.length; i++) {
        for (let j = 0; j < sheetColWidth[i].length; j++) {
          if (result[j]['wch'] < sheetColWidth[i][j]['wch']) {
            result[j]['wch'] = sheetColWidth[i][j]['wch'];
          }
        }
      }
      ws['!cols'] = result;
    } else {
      ws['!cols'] = colWidth.map(i => {
        return {wch: i}
      })
    }

    // 添加工作表
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;
    let dataInfo = wb.Sheets[wb.SheetNames[index]];

    //全局样式
    (function () {
      Object.keys(dataInfo).forEach(i => {
        if (i == '!ref' || i == '!merges' || i == '!cols') {
        } else {
          dataInfo[i.toString()].s = globalStyle;
          const {border, font, alignment, fill} = globalStyle;
          if (i.substring(1) == '1') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
            }
          } else if (i.substring(1) == '2') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: {
                name: '宋体',
                sz: 10,
                color: {rgb: "000000"},
                bold: true,
              },
              alignment: alignment || globalStyle.alignment,
              fill: {fgColor: {rgb: "cccccc"}}
            }
          } else if (i.substring(0, 1) == 'A') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'C' || i.substring(0, 1) == 'D'
            || i.substring(0, 1) == 'E' || i.substring(0, 1) == 'F'
            || i.substring(0, 1) == 'G' || i.substring(0, 1) == 'H'
            || i.substring(0, 1) == 'I' || i.substring(0, 1) == 'K'
            || i.substring(0, 1) == 'L' || i.substring(0, 1) == 'P'
            || i.substring(0, 1) == 'Q' || i.substring(0, 1) == 'R') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'M' || i.substring(0, 1) == 'N' || i.substring(0, 1 ) == 'O') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          }
          /*if (foot.length > 0) {
            if (i.substring(1) == data.length) {
              dataInfo[i.toString()].s = {
                border: {},
                font: {
                  name: '宋体',
                  sz: 10,
                  color: {rgb: "000000"},
                  bold: true,
                },
                fill: fill || globalStyle.fill,
                alignment: {
                  horizontal: "left",
                }
              }
            }
          }*/
        }
      });
    })();


    // 单个样式
    (function () {
      if (!cellStyle || cellStyle.length <= 0) {
        return
      }
      cellStyle.forEach(s => {
        const {border, font, alignment, fill} = s;
        dataInfo[s.cell].s = {
          border: border === {} ? border : border || globalStyle.border,
          font: font || globalStyle.font,
          alignment: alignment || globalStyle.alignment,
          fill: fill || globalStyle.fill
        }
      });
    })();
  })

  const bookType = 'xlsx'
  // 类型默认为xlsx
  writeExcel(wb, bookType, '销售明细表_'+dynamicTenantName.value)
}

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (320) )
const totalColumnWidth = ref(0)
const dynamicColumnModel = ref({value:[]})
const tableRef: any = ref(null)
const lanMuData = ref({
  'accId': '',
  'menuName': '销售明细表',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  userId: useUserStoreWidthOut().getUserInfo.id,
  isType: '0',  changeNumber:0
})

const reloadColumns = () => {
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
  let num1 = 0
  let num2 = 0
  let ws = 0
  let se = 0
  let js = 0

  for (let o of list) {
    num += parseFloat(o.baseQuantity || '0')
    num1 += parseFloat(o.subQuantity1 || '0')
    num2 += parseFloat(o.subQuantity2 || '0')
    ws += parseFloat(o.icost || '0')
    se += parseFloat(o.itaxprice || '0')
    js += parseFloat(o.isum || '0')
  }
  summaryTotals.value={baseQuantity: num.toFixed(2),icost: ws.toFixed(2),itaxprice: se.toFixed(2),isum: js.toFixed(2),subQuantity1:num1.toFixed(2),subQuantity2:num2.toFixed(2) }
}
const dynamicAdReload = async (obj) => {
    // const dataBase:any = await findDataBase(obj.accId,obj.year)
    return false
    // 底部分页信息
    await reloadList()
    // await reloadTable()
}
const selectChange = (v) => {
  if (pageParameter.queryMark == '1'){
    pageParameter.query.cinvode = v
  }else if (pageParameter.queryMark == '2'){
    pageParameter.query.cvencode = v
  }else if (pageParameter.queryMark == '3'){
    pageParameter.query.cpersoncode = v
  }else if (pageParameter.queryMark == '4'){
    pageParameter.query.region = v.join()
  }
  reloadTable()
}

function getHomeOrSelectName(b) {
  let n = ''
  switch (pageParameter.queryMark) {
    case '1':
      n = '存货'
      break;
    case '2':
      n = '客户'
      break;
    case '3':
      n = b?'业务员-客户':'业务员'
      break;
    case '4':
      n = b?'地区-客户':'地区'
      break;
  }
return n
}
/*** 合计 ***/
const summaryModel = ref({})
const getCurrSummary  = () => {
  return ((getColumns()).filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+1;return it;}))
}
const calculateTotal = () => {
  let list = JsonTool.parseProxy((getDataSource()).filter(it=>it.cvencode!=null && it.quantity!=null))
  if (list.length == 0){
    summaryModel.value = {}
    return false;
  }
  let num = 0
  let numz = 0
  let num1 = 0
  let num2 = 0
  let wsum = 0
  let sum = 0
  let se = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    num+=parseFloat(e['quantity'] || 0)
    numz+=parseFloat(e['baseQuantity'] || 0)
    num1+=parseFloat(e['subQuantity1'] || 0)
    num2+=parseFloat(e['subQuantity2'] || 0)
    wsum+=parseFloat(e['icost'] || 0)
    sum+=parseFloat(e['isum'] || 0)
    se+=parseFloat(e['itaxprice'] || 0)
  }
  summaryModel.value={
    quantity: num.toFixed(2),
    baseQuantity: numz.toFixed(2),
    subQuantity1: num1.toFixed(2),
    subQuantity2: num2.toFixed(2),
    icost: toThousandFilter(wsum),isum: toThousandFilter(sum),itaxprice:toThousandFilter(se)
  }
}
/*** 合计 ***/

const {closeCurrent,closeToFullPaths} = useTabs(router);
async function toRouter(data,type) {
  if (type=='list' && await operateBefore(checkRow.value))return false
  if(type=='list'){
    if(parseFloat(data.baseQuantity)<0){
      await closeToFullPaths('/xs-return')
      setTimeout(()=>{
        router.push({path: 'xs-return',query: {type:type,ccode:data.ccode,co: dynamicTenant.value.coCode}});
      },1000)
    }else{
      await closeToFullPaths('/xs-arrive')
      setTimeout(()=>{
        router.push({path: 'xs-arrive',query: {type:type,ccode:data.ccode,co: dynamicTenant.value.coCode}});
      },1000)
    }
  }
}
const operateBefore = async (rows) => {
  // 检查操作单据是否正常
  let  code = await useRouteApi(operateBeforeCheck, {schemaName: dynamicTenantId})({parm: JsonTool.json([...new Set(rows.map(it => it.ccode+'=='+(it.bcheck=='1'?'1':'0')))])})
  if (code != 0){
    createWarningModal({title: '温馨提示', content: `列表单据已发生变化，请刷新当前列表！`})
    return true
  }
  return false
}
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
  font-size: 14px !important;
  padding: 5px 8px !important;
  border-color: #cccccc !important;
  height: 36px;
  color: black;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #cccccc !important;
  color: black;
  height: 27px;
}
:deep(.nc-summary){
  font-weight: bold;
  background-color: #cccccc!important;
  border-right-color: #cccccc!important;
}
:deep(.ant-table-header){
  //overflow: auto scroll !important;
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px ;
  margin: 10px 10px 0px;
  border-radius: 5px 5px 0 0;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 0px 10px;
  background: #b4c8e3 !important;
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
  width: 100%;
  border-top: 1px solid #aaaaaa;
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
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
:deep(.ant-table-measure-row){
  td{
    padding: 0 !important;
  }
}
</style>
