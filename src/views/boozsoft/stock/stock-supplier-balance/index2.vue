<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <BarChartOutlined style="color: #0096c7;font-size: 50px;"/>
        </div>
        <div style="padding-top: 10px;"> <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/></div>
      </div>
      <div>
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">供应商应付余额表</b></div>
        <div><span style="font-size: 14px;font-weight: bold;color: #666666">期间：</span><span style="color:#000;font-weight: bold;">{{ strDate }} - {{ endDate }}</span></div>
      </div>
      <div>
        <div>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openQuery()"
          ><span>查询</span></button>
          <button type="button" class="ant-btn ant-btn-me" @click="excelThisData"><span>导出</span></button>
          <button type="button" class="ant-btn ant-btn-me"><span>发送</span></button>
          <button type="button" class="ant-btn ant-btn-me" @click="openPrint"><span>打印</span></button>
          <button type="button" class="ant-btn ant-btn-me" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')"><span>退出</span></button>
        </div>
        <div>
          <div>
            <Button class="ant-btn-me">
              <SyncOutlined :style="{ fontSize: '14px' }" @click="reloadTable"/>
            </Button>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
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
      <div class="bg-white" style="margin-top: -0.5px;margin-left: 1px;float: left;">
        <div style="width: 100%; height: 32px;background-color: #d9d9d9;padding-top:5px;font-weight: bold;text-align: center;">
          供应商分类
          <div style="float: right;">
            <a style="color: black;font-size: 14px;" ><PlusCircleTwoTone /></a>&emsp;
          </div>
        </div>
        <BasicTree
          :defaultExpandAll="true"
          :tree-data="treeData"
          v-model:selectedKeys="selectedKeys2"
          v-model:expandedKeys="expandedKeys"
          @select="handleSelect"
          style="text-align: left"
        />
      </div>
      <div style="width: calc(100% - 256px); float: right;margin-left: 5px;">
        <!-- 汇总-->
        <BasicTable
          ref="tableRef1"
          :row-selection="{ type: 'checkbox'}"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          @register="registerTable1"
          :dataSource="tableData1"
          :scroll="{ x: totalColumnWidth1,y: windowHeight1 }"
          :loading="loadMark"
        >
          <template #qichu="{ record }">
            {{ record.qichu>0?toThousandFilter(record.qichu):''}}
          </template>
          <template #yingfu="{ record }">
            {{  record.yingfu>0?toThousandFilter(record.yingfu):''}}
          </template>
          <template #fukuan="{ record }">
            {{  record.fukuan>0?toThousandFilter(record.fukuan):''}}
          </template>
          <template #qimo="{ record }">
            {{  record.qimo>0?toThousandFilter(record.qimo):''}}
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
        <div class="pagination-text" :style="{top: (windowHeight+30)+'px'}" v-show="showPaginationText">
          {{`共 ${paginationNumber}条记录&emsp;每页 1000 条`}}
        </div>
      </div>
    </div>
    <Query @save="saveQuery" @register="registerQueryPage"/>
    <Excel @save="saveExcel" @register="registerExcelPage"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {BasicTree} from '/@/components/Tree';
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import {
  BarChartOutlined,
  ProfileOutlined,
  CheckOutlined,
  EditOutlined,
  PicLeftOutlined,
  PrinterOutlined,
  AppstoreOutlined,
  SettingFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined,
  UsbOutlined
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
  Tag,
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
  findAllByCcodeAndBillStyle,
  findByTypeList,
  findAllMainsList,
  findByTypeLists,
  findCangkuAllList,
  findStockAllList
} from "/@/api/record/system/stock-wareh";
import {getPsnList} from "/@/api/record/system/psn";
import {findAllByFlag} from "/@/api/record/supplier_data/supplier";
import {findAll} from "/@/api/caozuoyuan/caozuoyuan";
import Query from './popup/query.vue'
//打印
import Print from './popup/print.vue'
//导入
import Excel from './popup/excel.vue'
//导出
import {
  defaultV,
  sheet_from_array_of_arrays,
  Workbook,
  writeExcel
} from "/@/utils/boozsoft/excel/excel2";
import XLSX from "xlsx-js-style";
/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {
  findStockDbLanMuList,
  saveStockLanMuList
} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
/**********************汇总栏目设置**********************/
import {initDynamics as initDynamics1} from "./data1";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {findAllStockSupBalance} from "/@/api/record/stock/stock-sup-balance";
import {getByStockBalanceTask} from "/@/api/record/stock/findAllStockSupBalance";
import {
  delRuKu,
  findBillByCondition, findBillCode,
  reviewSetCGRKG,
  reviewSetCGRKGMx, verifyXyCsourceByXyCode, xyCsourceSave,findAllMainList
} from "/@/api/record/stock/stock-ruku";
import {
  delCGDHDverifyZTRKSum,
  editByIdZTRK,
  subtractZTRKSum
} from "/@/api/record/stock/stock-currents";
import {exportExcel, exportExcel2, exportExcel3} from "/@/api/record/generalLedger/excelExport";
import {findAllXuShiZhangList} from "/@/api/record/system/accvoucher";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import {GetCustomerClassTree} from "/@/api/record/system/supplier_class";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
const Template=null
const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group
const TableSummary = ATable.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell

const {
  createSuccessModal,
  createErrorModal,
  createWarningModal,
  createConfirm
} = useMessage()

const {closeCurrent} = useTabs(router);

const pageSearch = reactive({
  selectType: 'num',
  selectValue: '',
})
const treeData:any=ref([])
const selectedKeys2:any = ref<string[]>([])
const expandedKeys:any = ref([]);
const squantitySum =ref('')
const isumSum =ref('')
const psnList:any = ref([])
const supplierList:any = ref([])
const cangkuList:any = ref([])
const userList:any = ref([])
const stockList:any = ref([])
const formItems:any = ref({selectType: '1'})
const typeFlag = ref('1')
const popData:any=ref('')
const dataType=ref('')
const CrudApi1 = {
  columns: [
    {
      title: '结算供应商编码',
      key: 'custCode',
      dataIndex: 'custCode',
      width: 100,
      align: 'left',
      ellipsis: true,
    },
    {
      title: '结算供应商名称',
      key: 'custName',
      dataIndex: 'custName',
      width: 300,
      align: 'left',
      ellipsis: true,
    },{
      title: '期初余额',
      dataIndex: 'qichu',
      key: 'qichu',
      width: 200,
      align: 'right',
      ellipsis: true,slots: { customRender: 'qichu' }
    },
    {
      title: '应付',
      key: 'yingfu',
      dataIndex: 'yingfu',
      width: 200,
      align: 'right',
      ellipsis: true,slots: { customRender: 'yingfu' }
    },
    {
      title: '付款',
      key: 'fukuan',
      dataIndex: 'fukuan',
      width: 200,
      align: 'right',
      ellipsis: true,slots: { customRender: 'fukuan' }
    },
    {
      title: '期末余额',
      key: 'qimo',
      dataIndex: 'qimo',
      width: 200,
      align: 'right',
      ellipsis: true,slots: { customRender: 'qimo' }
    }
  ]
}
const val = ref({
  openOne: 0,
  total: 0
})
const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)
const strDate:any = ref('');
const endDate:any = ref('');
const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const tableData1:any = ref([]);
const tableDataAll1:any = ref([]);
const loadMark = ref(false)
const summaryTotals = ref({})

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
const [registerPrintPage, {openModal: openPrintPage}] = useModal()


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
  resetDynamicColumnData()
})
async function saveQuery(data) {
  if(data.strDate.length>6){
    strDate.value=data.strDate.replaceAll('-','.')
    endDate.value=data.endDate.replaceAll('-','.')
  }else{
    strDate.value=data.strDate.substring(0,4)+'.'+data.strDate.substring(4,6)
    endDate.value=data.endDate.substring(0,4)+'.'+data.endDate.substring(4,6)
  }
  popData.value=data
  dynamicTenantId.value=data.databaseTrue
  fetch()
  tablesData1()
}
async function fetch() {
  const deptTree = await useRouteApi(GetCustomerClassTree,{schemaName: dynamicTenantId})('')
  function a(customerTree) {
    customerTree.forEach((item) => {
      if (item.children != null) {
        a(item.children);
      }
      item.title = '[' + item.cusClass + '] ' + item.cusCclassName;
      item.key = item.uniqueCustclass;
    });
  }
  a(deptTree);
  treeData.value = []
  treeData.value.push({title: '全部',key:'0',children: deptTree})
  selectedKeys2.value=['0']
  expandedKeys.value=['0']
}
async function handleSelect(obj: any) {
  if(obj.toString()!==''){
    popData.value.supClass=obj.toString()
  }else{
    popData.value.supClass='0'
    selectedKeys2.value=['0']
    expandedKeys.value=['0']
  }
  reloadTable()
}
async function reloadTable(){
  loadMark.value = true
  tablesData1()
  loadMark.value = false
}

// 汇总
const paginationNumber = ref(0)
const showPaginationText = ref(false)
async function tablesData1(){
  showPaginationText.value=false
  loadMark.value=true
  tableDataAll1.value = await useRouteApi(findAllStockSupBalance,{schemaName: dynamicTenantId})(popData.value)
  tableData1.value = tableDataAll1.value

  calculateTotal(tableDataAll1.value)
  let len1 = tableData1.value.length
  if(len1<50){
    for (let i =  len1; i < 50; i++) {
      tableData1.value.push({})
    }
  }
  loadMark.value=false
}
const getCurrSummary  = () => {
  return (getColumns1().filter(it=>it.title != '序号').map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = async (data) => {
  let list = JsonTool.parseProxy(data)
  paginationNumber.value=list.length
  showPaginationText.value=true

  if (list.length == 0){
    summaryTotals.value = {}
    return false;
  }

  let qichu = 0
  let fukuan = 0
  let qimo = 0
  let yingfu = 0
  for (let i = 0; i < list.length; i++) {
    const o = list[i];
    yingfu += parseFloat(o.yingfu || '0')
    fukuan += parseFloat(o.fukuan || '0')
    qimo += parseFloat(o.qimo || '0')
    qichu += parseFloat(o.qichu || '0')
  }
  summaryTotals.value={
    yingfu: toThousandFilter(yingfu),
    fukuan: toThousandFilter(fukuan),
    qimo: toThousandFilter(qimo),
    qichu: toThousandFilter(qichu),
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

async function reloadList() {
  psnList.value = await useRouteApi(getPsnList,{schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAllByFlag,{schemaName: dynamicTenantId})('1')
  supplierList.value = res.items
  cangkuList.value = await useRouteApi(findCangkuAllList,{schemaName: dynamicTenantId})({})
  const res1 = await findAll({})
  userList.value = res1.items
  stockList.value = await useRouteApi(findStockAllList, {schemaName: dynamicTenantId})({})
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

// 这是示例组件
const [registerTable1, {
  reload: reload1,
  getDataSource: getDataSource1,
  setTableData: setTableData1,
  setPagination: setPagination1,
  getPaginationRef: getPaginationRef1,
  getColumns: getColumns1,
  setColumns: setColumns1
}] = useTable({
  // api: CrudApi.list,
  columns: CrudApi1.columns,
  bordered: true,
  showIndexColumn: true,
  indexColumnProps:{ fixed:true },
  pagination: {
    pageSize: 1000,
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

async function onSearch() {
  if(pageSearch.selectValue!==''){
      if(pageSearch.selectType=='num'){
        tableData.value=tableDataAll.value.filter(a=>a.cordercode==pageSearch.selectValue)
      }else if(pageSearch.selectType=='stock'){
        let temp=stockList.value.filter(a=>a.stockName==pageSearch.selectValue)
        if(temp.length>0){
          tableData.value=tableDataAll.value.filter(a=>a.cinvode==temp[0].stockNum)
        }
      }
    }else{
      reloadTable()
    }
  await setPagination1({
    total: tableData.value.length
  })
}

const defaultPage = ref(false)

const [registerExcelPage, {openModal: openExcelPage}] = useModal()
//文件导入
const openExcel = async () => {
  openExcelPage(true, {})
}

async function saveExcel(data) {}

const excelData = () => {
  // console.log("导出成功！")
  let list: any = []
  const arrData = tableData.value
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = item.bcheck=='1'?'已审核':'未审核'
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] = formatCvencode(item.cvencode)
    item1[4] = item.cpersoncode==null?'':formatCpersoncode(item.cpersoncode)
    item1[5] = item.cwhcodeNameJoin
    item1[6] = formatCinvode(item.cinvode)
    item1[7] = formatGgxh(item.cinvode)
    item1[8] = toThousandFilter(item.baseQuantity)
    item1[9] = toThousandFilter(item.icost)
    item1[10] = toThousandFilter(item.isum)
    item1[11] = item.cmemo
    item1[12] = formatUser(item.cmaker)
    item1[13] = item.bcheckUser==null?'':formatUser(item.bcheckUser)
    list.push(item1)
  })
  const sheet:any = [
    {
      title: '采购到货单列表',
      multiHeader: [
        ['状态', '单据日期', '单据编码', '供应商简称', '业务员名称', '仓库名称', '存货名称', '规格型号', '数量','无税金额','价税合计','备注','经手人','审核人']
      ],
      table: list,
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13],
      merges: [],
      sheetName: '采购入库单列表',
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
      colWidth: [8, 8, 10, 15, 12, 15, 15, 15, 15, 15, 15, 15, 15, 15]
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
      const cell = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
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
    const ws:any = sheet_from_array_of_arrays(data,'');
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
          // debugger
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
            || i.substring(0, 1) == 'L' || i.substring(0, 1) == 'M'
            || i.substring(0, 1) == 'N') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'I' || i.substring(0, 1) == 'J' || i.substring(0, 1) == 'K') {
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
  writeExcel(wb, bookType, '采购到货单列表_'+pageParameter.companyName)
}
const excelData2 = async () => {
  let data2:any=tableData1.value
  let columns = CrudApi1.columns
  const multiHeader:any = [[],[]]
  const keys:any = []
  const merges:any = []
  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  let flg:any = 0;
  columns.forEach((v,index)=>{
    multiHeader[0].push(v.title)
    multiHeader[1].push('')
    keys.push(v.key)
    //合并上下单元格
    merges.push('`' + cell[flg] + '1:' + cell[flg] +'2`');
    flg = flg + 1
  })

  //样式靠右列
  let rightrow:any=['K','L','M']
  //样式靠左列
  let leftrow:any=['D','E','F','G','H','I','J']


  let list:any=[]
  data2.filter(a=>a.bcheck!=='11').forEach((a)=>{
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
      title: [],
      tHeader: [],
      multiHeader: multiHeader,
      table: list,
      keys: keys,
      merges: merges,
      sheetName: 'sheet1',
      cellStyle: [],
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  exportExcel2(sheet, 'xlsx','采购到货单列表_'+pageParameter.companyName)
}

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (300))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = {
  'accId': '',
  'menuName': '采购到货单',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  userId: useUserStoreWidthOut().getUserInfo.id,
  isType: '0'
}

const confirm = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      lanMuData.accId = pageParameter.defaultAdName
      lanMuData.objects = JSON.stringify(filterModifyData(dynamicColumnData.value, dynamicColumnDataCopy))
      if (lanMuData.objects == '[]') {
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
      } else {
        saveStockLanMuList(lanMuData).then(res => {
          message.success("数据库同步成功！")
        })
        // 重新赋值
        dynamicColumnDataCopy = JSON.parse(JSON.stringify(dynamicColumnData.value))
      }
    }
  });
  // 重新获取数据
  reloadColumns1()
}
const cancel = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData.value = []
  dynamicColumnData.value = dynamicColumnDataCopy
}
const edit = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1]) - 1
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData[key] = cloneDeep(dynamicColumnData.value.filter(item => key === item.key)[0]);
  }
}
const save = (key: string, min: number, max: number) => {
  editableData[key].width = editableData[key].width > max ? max : editableData[key].width < min ? min : editableData[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1]) - 1
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}
const saveName = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1]) - 1
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}

function filterModifyData(lanMuList: any, copyList) {
  let a = lanMuList.filter(item => {
    try {
      copyList.forEach(item2 => {
        if (item.key === item2.key && item.name == item2.name) {
          if (item.nameNew != item2.nameNew || item.width != item2.width || item.check != item2.check || item.align != item2.align)
            throw new Error('ok')
        }
      })
      return false
    } catch (e: any) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  return a;
}

function combineParameters(staticList: any, dbList: any) {
  staticList.forEach(item => {
    dbList.forEach(item2 => {
      if (item.key === item2.key && item.name === item2.name) {
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
      }
    })
  })
  return staticList
}


function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = pageParameter.defaultAdName
  findStockDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0) {
      let statiList = initDynamics()['DATA']
      dbList = combineParameters(statiList, dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    } else {
      let statiList = initDynamics()['DATA']
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }
  })
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
    if (visible.value) f = 260
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 70 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 70) + 'px')
  }
}

/*明细栏目设置end*/
/*start栏目设置*/
const visible1 = ref(false);
const windowWidth1 = (window.innerWidth)
const windowHeight1 = (window.innerHeight - (330) )
const totalColumnWidth1 = ref(0)
const dynamicColumns1 = initDynamics1().DEFAULT
const dynamicColumnData1: any = ref([])
let dynamicColumnDataCopy1 = []
const editableData1 = reactive({});
const tableRef1: any = ref(null)
const lanMuData1 = {
  'accId': '',
  'menuName': '采购到货单列表',
  'type': '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  userId: useUserStoreWidthOut().getUserInfo.id,
  isType: '1'
}

const confirm1 = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      lanMuData1.accId = pageParameter.defaultAdName
      lanMuData1.objects = JSON.stringify(filterModifyData(dynamicColumnData1.value, dynamicColumnDataCopy1))
      if (lanMuData1.objects == '[]') {
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
      } else {
        saveStockLanMuList(lanMuData1).then(res => {
          message.success("数据库同步成功！")
        })
        // 重新赋值
        dynamicColumnDataCopy1 = JSON.parse(JSON.stringify(dynamicColumnData1.value))
      }
    }
  });
  // 重新获取数据
  reloadColumns1()
}
const cancel1 = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData1.value = []
  dynamicColumnData1.value = dynamicColumnDataCopy1
}
const edit1 = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData1[key] = cloneDeep(dynamicColumnData1.value[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1]) - 1
      editableData1[key] = cloneDeep(dynamicColumnData1.value[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData1[key] = cloneDeep(dynamicColumnData1.value.filter(item => key === item.key)[0]);
  }
}
const save1 = (key: string, min: number, max: number) => {
  editableData1[key].width = editableData1[key].width > max ? max : editableData1[key].width < min ? min : editableData1[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData1.value[one].children.filter(item => key === item.key)[0], editableData1[key]);
      Object.assign(dynamicColumnData1.value[one].children.filter(item => key === item.key)[0], editableData1[key]);
    } else {
      let two = parseInt(arr[1]) - 1
      Object.assign(dynamicColumnData1.value[one].children[two].children.filter(item => key === item.key)[0], editableData1[key]);
    }
  } else {
    Object.assign(dynamicColumnData1.value.filter(item => key === item.key)[0], editableData1[key]);
  }
  delete editableData[key];
}
const saveName1 = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr: any = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData1.value[one].children.filter(item => key === item.key)[0], editableData1[key]);
      Object.assign(dynamicColumnData1.value[one].children.filter(item => key === item.key)[0], editableData1[key]);
    } else {
      let two = parseInt(arr[1]) - 1
      Object.assign(dynamicColumnData1.value[one].children[two].children.filter(item => key === item.key)[0], editableData1[key]);
    }
  } else {
    Object.assign(dynamicColumnData1.value.filter(item => key === item.key)[0], editableData1[key]);
  }
  delete editableData1[key];
}

function filterModifyData1(lanMuList: any, copyList) {
  let a = lanMuList.filter(item => {
    try {
      copyList.forEach(item2 => {
        if (item.key === item2.key && item.name == item2.name) {
          if (item.nameNew != item2.nameNew || item.width != item2.width || item.check != item2.check || item.align != item2.align)
            throw new Error('ok')
        }
      })
      return false
    } catch (e: any) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  return a;
}

function combineParameters1(staticList: any, dbList: any) {
  staticList.forEach(item => {
    dbList.forEach(item2 => {
      if (item.key === item2.key && item.name === item2.name) {
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
      }
    })
  })
  return staticList
}

const reloadColumns1 = () => {
  let a: any = []
  a = getColumns1()
  let last = a.pop()
  let newA = JSON.parse(JSON.stringify(CrudApi1.columns))
  newA = assemblyDynamicColumn(dynamicColumnData1.value, newA)
  setColumns1(newA)
  initTableWidth1(newA)
  //searchConditonList.value = newA
}

function resetDynamicColumnData1() {
  // 先从数据查询是否已经设置
  lanMuData1.accId = pageParameter.defaultAdName
  findStockDbLanMuList(lanMuData1).then(res => {
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0) {
      let statiList = initDynamics1()['DATA']
      dbList = combineParameters1(statiList, dbList)
      dynamicColumnData1.value = dbList
      dynamicColumnDataCopy1 = JSON.parse(JSON.stringify(dbList))
    } else {
      let statiList = initDynamics1()['DATA']
      dynamicColumnData1.value = statiList
      dynamicColumnDataCopy1 = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns1()
  })
}

function initTableWidth1(thisCs) {
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  /*  // 去除操作咧宽
    total -= 100*/
  if (total > windowWidth1) {
    let f = 0
    if (visible.value) f = 260
    totalColumnWidth1.value = Number(windowWidth1) - f
    // tableRef1.value.$el.style.setProperty('width', (windowWidth + 70 - f) + 'px')
  } else {
    if (visible1.value && (windowWidth1 - 260) < total) total -= (total - (windowWidth1 - 260))
    totalColumnWidth1.value = total
    // tableRef1.value.$el.style.setProperty('width', (total + 70) + 'px')
  }
}

const pageReload1 = () => {
  setTableData1([]) // 清空可能残留的数据
  reload1({
    searchInfo: pageParameter
  })
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
  await reloadList()
  resetDynamicColumnData()
  resetDynamicColumnData1()
}

function toRouter(data,type) {
  if(type=='list'){
    if(parseFloat(data.squantity)<0){
      router.push({path: '/cg-return',query: {type:'info',ccode:data.ccode}});
    }else{
      router.push({path: '/cg-arrive',query: {type:'info',ccode:data.ccode}});
    }
  }else if(type=='supplier'){
    console.log(data)
  }
}

function sumArr(arr) {
  return arr.reduce(function(prev, curr, idx, arr){
    return parseFloat(prev) + parseFloat(curr);
  });
}

const excelThisData = () =>{
  const arrData:any = []
  const columns:any = getColumns1().slice(1)
  columns.forEach((a,index)=>{
    let temp=tableData1.value[index]
    if(!hasBlank(temp.custCode)){
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
    if(v.title.indexOf('余额')!=-1||v.title.indexOf('应付')!=-1||v.title.indexOf('付款')!=-1){
      rightrow.push(cell[index])
    }else{
      leftrow.push(cell[index])
    }
    multiHeader[0].push(v.title)
    keys.push(v.key)
  })
  let list:any=[]
  arrData.filter(a=>a.bcheck!=='11').forEach((a,index)=>{
    a.qichu=parseFloat(a.qichu)==0?'':toThousandFilter(a.qichu)
    a.yingfu=parseFloat(a.yingfu)==0?'':toThousandFilter(a.yingfu)
    a.fukuan=parseFloat(a.fukuan)==0?'':toThousandFilter(a.fukuan)
    a.qimo=parseFloat(a.qimo)==0?'':toThousandFilter(a.qimo)
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
  exportExcel3(sheet, 'xlsx','供应商应付余额表_'+pageParameter.companyName)
}
const openPrint = () => {
  openPrintPage(true, {})
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

  let qichu=0
  let yingfu=0
  let fukuan=0
  let qimo=0
  data.forEach((item,index) => {
    let item1 = {}
    item1[0] = index+1
    item1[1] = item.custCode
    item1[2] = setString(item.custName,25)
    item1[3] =parseFloat(item.qichu)==0?'': toThousandFilter(item.qichu)
    item1[4] =parseFloat(item.yingfu)==0?'':toThousandFilter(item.yingfu)
    item1[5] =parseFloat(item.fukuan)==0?'':toThousandFilter(item.fukuan)
    item1[6] =parseFloat(item.qimo)==0?'':toThousandFilter(item.qimo)

    qichu+=parseFloat(item.qichu)
    yingfu+=parseFloat(item.yingfu)
    fukuan+=parseFloat(item.fukuan)
    qimo+=parseFloat(item.qimo)
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
    if(printList.length%27==26){
      item1[1] = '合计'
      item1[3] = toThousandFilter(qichu)
      item1[4] = toThousandFilter(yingfu)
      item1[5] = toThousandFilter(fukuan)
      item1[6] = toThousandFilter(qimo)
    }
    printList.push(item1)
  }

  let num = Math.ceil(printList.length/27)
  useNewPrint({data: ['l', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    doc.autoTable({
      head: [['', '', '', '供应商应付余额表', '', '', ''],
        ['核算单位：' + pageParameter.companyName, '', '', '期间：'+ strDate.value+' - '+endDate.value ,'','', '单位：元'],
        ['序号', '结算供应商编码', '结算供应商名称', '期初余额', '应付', '付款','期末余额']],
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
          if (data.column.index == 3) {
            data.cell.colSpan = 2
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
            data.cell.colSpan = 2
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
        0: {maxHeight: 10,cellWidth: 25, halign: 'center'},
        1: {cellWidth: 80, halign: 'left'},
        2: {cellWidth: 100, halign: 'left'},
        3: {cellWidth: 80, halign: 'right'},
        4: {cellWidth: 80, halign: 'right'},
        5: {cellWidth: 80, halign: 'right'},
        6: {cellWidth: 80, halign: 'right'},
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

function toThousandFilter(num: any) {
  if (num == '' || num == null || parseFloat(num)==0) {
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}
</script>
<style src="./global-menu-index.less" lang="less" scoped></style>
<style scoped lang="less">
@import "./global-menu-index.less";

@import './global-menu-index.less';
.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  height: 25px;
  color: black;
}
.bg-white{
  width: 250px;
  min-height: 1800px;
  border: 1px #cccccc solid;
  background:white ;
  margin-top: -0.5%;
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
    right: 20%;
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
  display: inline-flex;justify-content: space-between;width: 99%;height: 110px;text-align: left;
  >div:nth-of-type(1){
    width: 40%;display: inline-flex;margin-top: 20px;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;vertical-align: super;}
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;
      >div:nth-of-type(2){margin-top: 7px;}
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(2){margin-top: 14px;}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;margin-right: 8px;
    >div:nth-of-type(2){
      display: inline-flex;justify-content: space-between;margin-top: 15px;
    }
  }
}
</style>
