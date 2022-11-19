<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <ProfileOutlined />
        </div>
        <div> <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/></div>
      </div>
      <div>
        <div>  <b class="noneSpan" style="font-size: 24px;color: #0096c7;">批量销货单列表</b></div>
        <div><span style="font-size: 14px;font-weight: bold;">期间：{{qijianText}}</span></div>
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
              @click="router.push({path: '/xs-order',query: {type:'add',ccode:''}})"
            ><span>新增</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="editFun()"
            ><span>修改</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="startDel"
            ><span>删除</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
            ><span>变更</span></button>
          <Popover placement="bottom">
            <template #content>
              <span class="group-btn-span-special" @click="startReview(true)">&nbsp;审核&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special"  @click="startReview(false)">&nbsp;弃审&emsp;&emsp;</span><br/>
            </template>
            <Button class="ant-btn ant-btn-me" >审核</Button>
          </Popover>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="openExcel()"
            ><span>导入</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="closeCurrent()"
            ><span>退出</span></button>
        </div>
        <div>

          <div class="acttd-right-d-search">
            <Select v-model:value="formItems.selectType"
                    class="acttdrd-search-select">
              <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
              <SelectOption style="font-size: 12px;" value="2">供应商简称</SelectOption>
              <SelectOption style="font-size: 12px;" value="3">仓库</SelectOption>
              <SelectOption style="font-size: 12px;" value="4">存货名称</SelectOption>
            </Select>
            <InputSearch
              class="acttdrd-search-input"
              @search="onSearch"
            />
          </div>

          <div>
            <Button class="ant-btn-me" @click="reloadTable()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover class="ant-btn-default" placement="bottom" v-model:visible="visible">
              <template #content>
                <DynamicColumn :defaultData="(initDynamics()['DATA'])" :dynamicData="(dynamicColumnModel)" :lanmuInfo="(lanMuData)" @reload="(reloadColumns())"/>
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
              <span class="group-btn-span-special2" @click="showChange('0')" :style="typeFlag=='0'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 130px;">
                按明细显示&emsp;<CheckOutlined v-if="typeFlag=='0'"/>
              </span><br/>
                <span @click="showChange('1')" class="group-btn-span-special2"  :style="typeFlag=='1'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 130px;">
                按汇总显示&emsp;<CheckOutlined v-if="typeFlag=='1'"/>
              </span>
              </template>
              <Button>
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
              <span class="group-btn-span-special2" @click="pageParameter.documentType='';reloadTable()" :style="pageParameter.documentType==''?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 130px;">
                全&emsp;部&emsp;&emsp;&emsp;<CheckOutlined v-if="pageParameter.documentType==''"/>
              </span><br/>
                <span class="group-btn-span-special2" @click="pageParameter.documentType='0';reloadTable()" :style="pageParameter.documentType=='0'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 130px;">
                批量销货单&emsp;&emsp;&emsp;<CheckOutlined v-if="pageParameter.documentType=='0'"/>
              </span><br/>
<!--                <span class="group-btn-span-special2" @click="pageParameter.documentType='1';reloadTable()" :style="pageParameter.documentType=='1'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 130px;">
                销售退货单&emsp;<CheckOutlined v-if="pageParameter.documentType=='1'"/>
              </span>-->
              </template>
              <Button>
                <InboxOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
                <span class="group-btn-span-special2 p_specifics" @click="typeFlag=='0'?excelData():excelDataList()" style="width: 130px;text-align: left;padding: 5px 10%;">
                导出当前列表
              </span><br/>
<!--                <span class="group-btn-span-special2 p_specifics" @click="excelDataList()" style="width: 130px;text-align: left;padding: 5px 10%;">
                导出汇总列表
              </span>-->
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
<!--                <span class="group-btn-span-special2 p_specifics" style="width: 120px;text-align: left;padding: 5px 10%;">
                单据打印
              </span>-->
              </template>
              <Button class="ant-btn-me">
                <PrinterOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>

    <div class="app-container">
        <BasicTable
                ref="tableRef"
                :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
                :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
                @register="registerTable"
                :dataSource="tableData"
                :scroll="{ x: totalColumnWidth,y: windowHeight }"
                :loading="loadMark"
                v-show="typeFlag=='0'"
        >
            <template #bcheck="{ record }">
            <span v-if="record.bcheck != null">
            <Tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
              {{ record.bcheck === '1' ? '已审核' : '未审核' }}
            </Tag>
          </span>
            </template>
          <template #ccode="{ record }">
            <a @click="toRouter(record,'list')">{{record.ccode}}</a>
          </template>
            <template #icost="{ record }">{{ toThousandFilter(record.icost) }}</template>
            <template #baseQuantity="{ record }">{{ toThousandFilter(record.baseQuantity) }}</template>
            <template #isum="{ record }">{{ toThousandFilter(record.isum) }}</template>
            <template #cvencode="{ record }">{{ formatCvencode(record.cvencode) }}</template>
            <template #cvencodeJs="{ record }">{{ formatCvencode(record.cvencodeJs) }}</template>
            <template #cpersoncode="{ record }">{{ formatCpersoncode(record.cpersoncode) }}</template>
            <template #cwhcode="{ record }">{{ formatCwhcode(record.cwhcode) }}</template>
            <template #cmaker="{ record }">{{ formatUser(record.cmaker) }}</template>
            <template #bcheckUser="{ record }">{{ formatUser(record.bcheckUser) }}</template>
            <template #cinvode="{ record }">{{ formatCinvode(record.cinvode) }}</template>
            <template #ggxh="{ record }">{{ formatGgxh(record.cinvode) }}</template>
            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow>
                  <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary('one')"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':summaryModel[cell.dataIndex].toFixed(2)}}</span></TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>
        </BasicTable>
        <div class="pagination-text" v-show="showPaginationText">
          {{`共 ${paginationNumber} 条记录 每页 200 条`}}
        </div>
    </div>
    <Query @query="saveQuery" @register="registerQueryPage"/>
    <Excel @save="saveExcel" @register="registerExcelPage"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
<!--    <StockPeriodOpen  @register="registerModalPopPage"/> -->
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
    SyncOutlined,
    UsbOutlined,EditOutlined,ProfileOutlined,InboxOutlined
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
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {toThousandFilter} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import Query from './popup/query.vue'
//导入
import Excel from './popup/excel.vue'
//导出
import Print from './popup/print.vue'
import {defaultV, sheet_from_array_of_arrays, Workbook, writeExcel} from "/@/utils/boozsoft/excel/excel2";
import XLSX from "xlsx-js-style";
/**********************明细栏目设置**********************/
import { initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findStockDbLanMuList, saveStockLanMuList} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
/**********************汇总栏目设置**********************/
import {
  batchReview, delBatch,
  findOutByTypeList,
  reviewRuKu,
  unAuditBefore
} from "/@/api/record/stock/stock-xhd";
import {DateTool, JsonTool} from "/@/api/task-api/tools/universal-tools";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {assemblyDynamicColumn} from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
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

const formItems = ref({
  selectType: '1'
})

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
//文件导入
const val = ref({
  openOne: 0,
  total: 0
})
const qijianText = ref('')
const openQuery = async () => {
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
}
const companyName = ref('')
const strDate = ref('')
async function saveQuery(e) {
  let data = e.data
  companyName.value = data.constant.name
  dynamicTenantId.value = data.constant.tenantId
  pageParameter.queryMark = data.constant.queryType
  pageParameter.query = data.variable
  if (!hasBlank(data.variable.periodStart)){
    qijianText.value = formatText(data.variable.periodStart)+ ' - '+formatText(data.variable.periodEnd)
    strDate.value = data.variable.periodStart.substring(0,4)
  }else{
    qijianText.value = data.variable.dateStart.replaceAll(/-/g,'.')+ ' - '+data.variable.dateEnd.replaceAll(/-/g,'.')
    strDate.value = data.variable.dateStart.substring(0,4)
  }
  reloadList(e.map)
  initTable()
}
const initTable = ()=>{
  visible.value = true
  setTimeout(()=>{
      lanMuData.value.changeNumber+=1
      visible.value = false
    }
    ,100)
}
const formatText = (text) => {
  return text.substring(0,4) +'.'+text.substring(4,6)
}
const replenishTrs = (list) =>{
 let l = list.length
  for (let i = 0; i < (25-l); i++) {
    list.push({})
  }
  return list
}
const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const tableData1:any = ref([]);
const tableDataAll1:any = ref([]);
const loadMark = ref(false)
const showPaginationText = ref(false)
const paginationNumber = ref(0)
const summaryTotal = reactive({baseQuantity:0.00,isum: 0.0})
const showChange = (v) => {
  let old = typeFlag.value
  if (v != old){
    pageParameter.queryMark =(v == '0')?'1':'2'
    reloadTable()
  }
}
async function reloadTable(){
  loadMark.value = true
  showPaginationText.value = false
  let num = 0;
  let sum = 0
    let len = 0
    tableDataAll.value = await useRouteApi(findOutByTypeList,{schemaName: dynamicTenantId})(pageParameter)
    len = tableDataAll.value.length
    tableData.value = replenishTrs(JsonTool.parseProxy(tableDataAll.value))
    await setPagination({
      total: tableData.value.length,
      showTotal: t => `总共${t}条数据`,
    })
    for (let it of tableDataAll.value) {
      num += parseFloat(it.baseQuantity)/*.toFixed(10)*/
      sum += parseFloat(it.isum)/*.toFixed(4)*/
    }
    typeFlag.value = '0'

  summaryTotal.baseQuantity = num
  summaryTotal.isum = sum
  calculateTotal('one')
  loadMark.value = false
  paginationNumber.value = len
  showPaginationText.value = true
}

const psnList:any = ref([])
const supplierList:any = ref([])
const cangkuList:any = ref([])
const userList:any = ref([])
const stockList:any = ref([])
async function reloadList(map) {
 /* psnList.value = await useRouteApi(getPsnList,{schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAllByFlag,{schemaName: dynamicTenantId})('1')
  supplierList.value = res.items
  cangkuList.value = await useRouteApi(findCangkuAllList,{schemaName: dynamicTenantId})({})
  const res1 = await findAll({})
  userList.value = res1.items
  stockList.value = await useRouteApi(findStockAllList, {schemaName: dynamicTenantId})({})*/
  psnList.value = map['user']
  userList.value = map['operator']
  supplierList.value = map['cust']
  cangkuList.value = map['warehouse']
  stockList.value = map['stock']
}

const CrudApi = {
  // list: useRouteApi(findCardMasterAll, {schemaName: dynamicTenantId}),
  columns: [
    {
      title: '状态',
      dataIndex: 'bcheck',
      width: 80,
      align: 'center',
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
      title: '单据编码',
      dataIndex: 'ccode',
      width: 100,
      align: 'left',
      ellipsis: true,slots: { customRender: 'ccode'}
    },
    {
      title: '销售客户简称',
      dataIndex: 'cvencode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencode'}
    }, {
      title: '结算客户简称',
      dataIndex: 'cvencodeJs',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencodeJs'}
    },
    {
      title: '业务员',
      dataIndex: 'cpersoncode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cpersoncode'}
    },
    {
      title: '仓库',
      dataIndex: 'cwhcode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cwhcode'}
    },
    {
      title: '存货名称',
      dataIndex: 'cinvode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cinvode'}
    },
    {
      title: '规格型号',
      dataIndex: 'ggxh',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'ggxh'}
    },
    {
      title: '数量',
      dataIndex: 'baseQuantity',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'baseQuantity'}
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'icost'}
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'isum'}
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cmemo'}
    },
    {
      title: '经手人',
      dataIndex: 'cmaker',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cmaker'}
    },
    {
      title: '审核人',
      dataIndex: 'bcheckUser',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'bcheckUser'}
    },
  ]
}

const CrudApi1 = {
  // list: useRouteApi(findCardMasterAll, {schemaName: dynamicTenantId}),
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
      title: '单据编码',
      dataIndex: 'ccode',
      width: 100,
      align: 'left',
      ellipsis: true,slots: { customRender: 'ccode'}
    },
    {
      title: '销售客户简称',
      dataIndex: 'cvencode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencode'}
    }, {
      title: '结算客户简称',
      dataIndex: 'cvencodeJs',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencodeJs'}
    },
    {
      title: '业务员',
      dataIndex: 'cpersoncode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cpersoncode'}
    },
    {
      title: '仓库',
      dataIndex: 'cwhcode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cwhcode'}
    },
    {
      title: '数量',
      dataIndex: 'squantity',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'squantity'}
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'icost'}
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'isum'}
    },
    {
      title: '备注',
      dataIndex: 'cmemo',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cmemo'}
    },
    {
      title: '经手人',
      dataIndex: 'cmaker',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cmaker'}
    },
    {
      title: '审核人',
      dataIndex: 'bcheckUser',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'bcheckUser'}
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
const [registerTable, {
  reload,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef:testgetPaginationRef,
  getColumns,
  setColumns
}] = useTable({
  // api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  indexColumnProps:{ fixed:true },
  pagination: {
    pageSize: 200,
    simple: true,
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


const pageParameter: any = reactive({
    documentType: '',
    queryMark: '',
    type:'PLXHD',
    showRulesSize: 'MIN',
    query: {}
})

function onSearch() {
}

const defaultPage = ref(false)
onMounted(async() => {
  val.value.openOne = 1
  openQueryPage(true, {
    data: val.value
  })
/*  resetDynamicColumnData()
  resetDynamicColumnData1()*/
})

const [registerExcelPage, {openModal: openExcelPage}] = useModal()
//文件导入
const openExcel = async () => {
  openExcelPage(true, {})
}

async function saveExcel(data) {}

const excelData = () => {
  let list: any = []
  const arrData = tableDataAll.value
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = item.bcheck=='1'?'已审核':'未审核'
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] = formatCvencode(item.cvencode)
    item1[4] = formatCvencode(item.cvencodeJs)
    item1[5] = item.cpersoncode==null?'':formatCpersoncode(item.cpersoncode)
    item1[6] = formatCwhcode(item.cwhcode)
    item1[7] = formatCinvode(item.cinvode)
    item1[8] = formatGgxh(item.cinvode)
    item1[9] = toThousandFilter(item.baseQuantity)
    item1[10] = toThousandFilter(item.icost)
    item1[11] = toThousandFilter(item.isum)
    item1[12] = item.cmemo || ''
    item1[13] = formatUser(item.cmaker) || ''
    item1[14] = (item.bcheckUser==null?'':formatUser(item.bcheckUser) )|| ''
    list.push(item1)
  })
  const sheet:any = [
    {
      title: '批量销货单明细列表',
      multiHeader: [
        ['状态', '单据日期', '单据编码', '销售客户简称', '结算客户简称', '业务员', '仓库', '存货名称', '规格型号', '数量','无税金额','价税合计','备注','经手人','审核人']
      ],
      table: list,
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13],
      merges: [],
      sheetName: '批量销货单列表',
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
/*    if (title || title === '') {
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
    }*/
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
  writeExcel(wb, bookType, '批量销货单列表_'+companyName.value+'_'+qijianText.value)
}

const excelDataList = () => {
  let list: any = []
  const arrData = tableDataAll1.value
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = item.bcheck=='1'?'已审核':'未审核'
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] = formatCvencode(item.cvencode)
    item1[4] = formatCvencode(item.cvencodeJs)
    item1[5] = item.cpersoncode==null?'':formatCpersoncode(item.cpersoncode)
    item1[6] = item.cwhcode==null?'':formatCwhcode(item.cwhcode)
    item1[7] = toThousandFilter(item.baseQuantity)
    item1[8] = toThousandFilter(item.icost)
    item1[9] = toThousandFilter(item.isum)
    item1[10] = item.cmemo==null?'':item.cmemo
    item1[11] = formatUser(item.cmaker)||''
    item1[12] = (item.bcheckUser==null?'':formatUser(item.bcheckUser)) ||''
    list.push(item1)
  })
  const sheet:any = [
    {
      title: '批量销货单汇总列表',
      multiHeader: [
        ['状态', '单据日期', '单据编码', '销售客户简称','结算客户简称', '业务员', '仓库', '数量','无税金额','价税合计','备注','经手人','审核人']
      ],
      table: list,
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11],
      merges: [],
      sheetName: '批量销货单列表',
      cellStyle: [
        /*{
          cell: 'A1',
          font: {
            name: '宋体',
            sz: 14,
            color: {rgb: "000000"},
            bold: true,
          },
          border: {color: {rgb: "ffffff"}}
        },*/
      ],
      colWidth: [8, 8, 10, 15, 12, 15, 15, 15, 15, 15, 15]
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
    let data = table.map(v => keys.map(j => v[j]))
    // 多级表头
    if (multiHeader) {
      // 倒序循环
      for (let i = multiHeader.length - 1; i >= 0; i--) {
        data.unshift(multiHeader[i]);
      }
    }
    tHeader && data.unshift(tHeader);
    // title && data.unshift(title);
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
          /*if (i.substring(1) == '1') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
            }
          } else */
          if (i.substring(1) == '1') {
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
            || i.substring(0, 1) == 'J' || i.substring(0, 1) == 'K'
            || i.substring(0, 1) == 'L') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'G' || i.substring(0, 1) == 'H' || i.substring(0, 1) == 'I') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "right",
              }
            }
          }
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
  writeExcel(wb, bookType, '批量销货单列表_'+companyName.value+'_'+qijianText.value)
}

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (330))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)

const dynamicColumnModel = ref({value: []});

const lanMuData = ref({
  'accId': '',
  'menuName': '批量销货单列表',
  'type': '明细列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  userId: useUserStoreWidthOut().getUserInfo.id,
  isType: '0',  changeNumber:0
})

const confirm = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      lanMuData.value.accId = getCurrentAccountName(false)
      lanMuData.value.objects = JSON.stringify(filterModifyData(dynamicColumnData.value, dynamicColumnDataCopy))
      if (lanMuData.value.objects == '[]') {
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
  reloadColumns()
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

const reloadColumns = () => {
  let a: any = []
  a = getColumns()
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnModel.value.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  //searchConditonList.value = newA
  reloadTable()
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.value.accId = getCurrentAccountName(false)
  findStockDbLanMuList(lanMuData.value).then(res => {
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
    // 表格列
    reloadColumns()
    //pageReload()
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
const dynamicAdReload = async (obj) => {
    // const dataBase:any = await findDataBase(obj.accId,obj.year)
    return false
    // 底部分页信息
    await reloadList()
    // await reloadTable()
}
const startReview = async (b) => {
    let a = useUserStoreWidthOut().getUserInfo.id
    if (!hasBlank(a)) {
        if (checkRow.value.length == 0) {
            createWarningModal({title: '温馨提示', content: `请选中要进行${b ? '审核' : '弃审'}的单据！`})
        } else if ((b && checkRow.value.filter(it => it.bcheck == '1').length > 0) || (!b && checkRow.value.filter(it => it.bcheck != '1').length > 0)) {
            createWarningModal({title: '温馨提示', content: `选中的${b ? '审核' : '弃审'}的单据中存在已${b ? '审核' : '弃审'}单据，请先排除！`})
        } else {
          let codes = [...new Set(checkRow.value.map(it => it.ccode))]
          if (!b){ // 弃审前 检查
            let che = await useRouteApi(unAuditBefore, {schemaName: dynamicTenantId})({
              codes: codes,id: dynamicTenant.value.target.id
            })
            if (null == che  || che.type != '0'){
              switch (che.type) {
                case '1':
                  createWarningModal({title: '温馨提示',content: '系统年月【'+che.codes+'】已结账，不能，不能进行取消审核操作，请取消月末结账后继续！'})
                  break;
                case '2':
                  createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已生成下游X【'+codeToName(che.codeType)+'】单据，不能进行取消审核操作，请删除下游单据后继续！'})
                  break;
                case '3':
                  createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过应收核销，不能进行取消审核操作，请删除核销单据后继续！'})
                  break;
                case '4':
                  createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过红字回冲，不能进行取消审核操作，请删除红字回冲单据后继续！'})
                  break;
                case '5':
                  createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过参照出库，不能进行取消审核操作，请删除参照生成的出库单据后继续！'})
                  break;
                case '6':
                  createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过参照退货，不能进行取消审核操作，请删除参照生成的退货单据后继续！'})
                  break;
                case '7':
                  createWarningModal({title: '温馨提示',content: '单据【'+che.codes+'】已进行过参照开发票，不能进行取消审核操作，请删除参照生成的发票单据后继续！'})
                  break;
              }
              return false;
            }
          }
           let isAuto = pageParameter.query.xsShXkd == '1'
            /*let res = await useRouteApi(batchReview, {schemaName: dynamicTenantId})({
                codes: codes,
                userId: a,
                type: b,
              auto: isAuto
            })*/
            message.success(`${b ? '审核' : '弃审'}成功！`)
            reloadTable()
            /* if (b && res != null){
                 message.success(`正在准备跳转查看销售出库单。。。`)
                 // 获取下游单号 打开出库单查看
                 let query = {}
                 query['ccode'] = res.xyccode
                 query['bdate'] = res.xyccodeDate
                 // 去批量销货单页面
                 setTimeout(()=>{
                     router.push({
                         path:'/kc-xsDepot',
                         query: query,
                     });
                 },2000)
             }*/
        }
    } else {
        if (hasBlank(a)) message.error('获取用户信息异常！')
    }
}
function codeToName(arr) {
  let names = {'XSCKD':'销售出库单'}
  return arr.map(s=>names[s]).filter(s=>s != null && s != '').join(',')
}
const startDel = async () => {
  if(checkRow.value.length == 0){
    createWarningModal({title: '温馨提示', content: `请选择要进行删除的单据！`})
  } else if ((checkRow.value.filter(it => it.bcheck == '1').length > 0)) {
    createWarningModal({title: '温馨提示', content: `选中的单据中存在已审核单据，请先排除！`})
  } else {
     await useRouteApi(delBatch, {schemaName: dynamicTenantId})({code: [...new Set(checkRow.value.map(it => it.ccode))],type: 'XHD'})
     message.success('删除成功！')
     reloadTable()
  }
}
function editFun() {
  if(checkRow.value.length !== 1){
    message.error("只能选择一条数据修改！")
    return false
  }
  let data=checkRow.value[0].ccode
  router.push({path: '/xs-order',query: {type:'edit',ccode:data}});
}
function toRouter(data,type) {
  if(type=='list'){
    if(parseFloat(data.baseQuantity)<0){
      router.push({path: '/xs-return',query: {type:'info',ccode:data.ccode}});
    }else{
      router.push({path: '/xs-order',query: {type:'info',ccode:data.ccode}});
    }
  }
}
/*打印专区*/
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
//js切割字符串
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
  const data = pageParameter.queryMark == '1'?tableDataAll.value:tableDataAll1.value
  let printList: any = []
  let printUser = ''
  if(obj.isMark){
    printUser = '制表人：' + useUserStoreWidthOut().getUserInfo.username
  }
  let printDate = ''
  if(obj.isDate){
    printDate = '制表日期：' + DateTool().nowDate()
  }
  let squantity=0
  let isum=0
  data.forEach((item,index) => {
    let item1 = {}
    item1[0] = index+1
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] = setString(formatCvencode(item.cvencode),14)
    item1[4] = setString(formatCvencode(item.cvencodeJs),14)
    item1[5] = item.psnName
    item1[6] = item.deptName
    item1[7] = setString(item.cwhcode==null?'':formatCwhcode(item.cwhcode),14)
    item1[8] = toThousandFilter(item.baseQuantity)
    item1[9] = toThousandFilter(item.isum)
    item1[10] = item.cmakerName
    item1[11] = item.buname
    squantity+=parseFloat(item.baseQuantity)
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
      head: [['批量销货单列表', '', '', '', '', '', '', '', '', '', '', ''],
        ['核算单位：' + companyName.value, '', '','', '期间：'+ qijianText.value ,'', '', '', '', '','', '单位：元'],
        ['序号', '单据日期', '单据编码', '销售客户简称', '结算客户简称', '业务员', '业务部门', '仓库', '数量合计', '价税合计', '经手人', '审核人']],
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
          printDate,
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );
        doc.autoTableText(
          printUser,
          data.cursor.x/2-20,
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
            data.cell.colSpan = 12
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
          } else if (data.column.index == 4) {
            data.cell.colSpan = 3
            data.cell.styles.cellPadding = {left: 32,top: 3}
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
        1: {cellWidth: 45, halign: 'center'},
        2: {cellWidth: 60, halign: 'left'},
        3: {cellWidth: 60, halign: 'left'},
        4: {cellWidth: 60, halign: 'left'},
        5: {cellWidth: 40, halign: 'left'},
        6: {cellWidth: 40, halign: 'left'},
        7: {cellWidth: 60, halign: 'left'},
        8: {cellWidth: 45, halign: 'center'},
        9: {cellWidth: 45, halign: 'right'},
        10: {cellWidth: 40, halign: 'left'},
        11: {cellWidth: 40, halign: 'left'},
      }
    })
  })
}
/*打印专区*/


/*** 合计 ***/
const summaryModel = ref({})
const getCurrSummary  = (t) => {
  return ((t=='one'?getColumns():getColumns1()).filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = (t) => {
  let list = JsonTool.parseProxy((t=='one'?getDataSource():getDataSource1()).filter(it=>it.cvencode!=null && it.quantity!=null))
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
    quantity: num,
    baseQuantity: numz,
    subQuantity1: num1,
    subQuantity2: num2,
    icost: wsum,isum: sum,itaxprice:se
  }
}
/*** 合计 ***/

</script>
<style scoped lang="less">
@import '/@/assets/styles/global-menu-index.less';
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
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
  font-size: 12px !important;
  padding: 2px 8px !important;
  border-color: #cccccc !important;
  font-weight: bold;
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
  padding: 10px;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 0 10px 5px;
  background: #b4c8e3 !important;
  position: relative;
  .pagination-text{
    position: absolute;
    bottom: 6px;
    right: 10%;
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
  margin-top: 0!important;
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
</style>
