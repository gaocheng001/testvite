<template>
  <div>
    <div class="app-container">
      <div class="app-container-head">
        <div class="container-head-title" style="float: left;">
          <b class="noneSpan" style="font-size: 60px;margin-left: -16px;"><BarChartOutlined /></b>
        </div>
        <div class="container-head-title" style="padding-left: 40%;text-align: center;margin-top: 20px;">
          <b class="noneSpan" style="font-size: 26px;">数量收发存汇总表</b>
          <div style="font-size: 14px;text-align: center;margin-top: 30px;">
            <span style="font-size: 14px;font-weight: bold;">
              截止日期：{{newdate.replaceAll('-','.')}}
            </span>
          </div>
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
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="margin-top: -30px;margin-left: 50px;text-align: left;">
        <div style="display: inline-block;float: left;margin-left: 1%;margin-top: -20px;">
          <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/>
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
            <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
            <SelectOption style="font-size: 12px;" value="2">供应商简称</SelectOption>
            <SelectOption style="font-size: 12px;" value="3">仓库</SelectOption>
            <SelectOption style="font-size: 12px;" value="4">存货名称</SelectOption>
          </Select>
          <!-- 搜索 -->
          <InputSearch
            placeholder=""
            style="width: 150px; border-radius: 4px"
            @search="onSearch"
          />
        </div>
      </div>
      <div style="clear:both"/>
    </div>
    <div class="app-container">
      <BasicTable
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        :row-selection="{ type: 'checkbox' }"
        @register="registerTable"
        :dataSource="tableData"
        :scroll="{ x: totalColumnWidth,y: windowHeight }"
        :loading="loadMark"
      >
        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
              <TableSummaryCell class="nc-summary" :index="0" :align="'center'" style="border-right: none;">合</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="1" :align="'center'" style="border-right: none;">计</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="2" :colSpan="7" :align="'center'" style="border-right: none;"/>
              <TableSummaryCell class="nc-summary" :index="2" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.qichu}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="2" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.qichu1}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.qichu2}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.rk}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.rk1}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.rk2}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.ck}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.ck1}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.ck2}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.qimo}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.qimo1}}</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;border-right: none;">{{summaryTotals.qimo2}}</TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
      <div class="pagination-text" v-show="showPaginationText">
        {{`共 ${paginationNumber}条记录&emsp;每页 1000 条`}}
      </div>
    </div>
    <Query @throwData="loadPage" @register="registerQueryPage"/>
    <Print @save="loadPrint" @register="registerPrintPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import {BarChartOutlined, CheckOutlined, SettingFilled, SyncOutlined} from '@ant-design/icons-vue'
import {
  Button,
  Input,
  message,
  Popover,
  Radio as ARadio,
  Select,
  Table as ATable,
} from 'ant-design-vue'

import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import Query from './popup/query.vue'
import Print from './popup/print.vue'
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {
  findStockDbLanMuList,
  saveStockLanMuList
} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
import {kcXCLStore666} from "/@/views/boozsoft/stock/stock-number-sfc/generalLedger";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findOption} from "/@/api/record/stock/stock-option";
import {exportExcel} from "/@/api/record/generalLedger/excelExport";
import {findByStockSFCNumberOrMoney} from "/@/api/record/stock/stock-sfc";
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
const cgNumWs:any = ref('');
const dataType:any = ref('');
const strDate:any = ref('');
const stockId:any = ref([]);
const stockClassId:any = ref([]);
const ckName:any = ref('');
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
const glStore666 = kcXCLStore666()
const summaryTotals = ref({})
const {
  createSuccessModal,
  createErrorModal,
  createWarningModal,
  createConfirm
} = useMessage()


const formItems = ref({
  selectType: '1',
  ckId:''
})

const [registerQueryPage, {openModal: openQueryPage}] = useModal()
const [registerPrintPage, {openModal: openPrintPage}] = useModal()

const openPrint = () => {
  openPrintPage(true, {})
}
const loadPrint = (obj) => {
  let data=tableData.value.filter(a=>!hasBlank(a.stockNum))
  let printUser = ''
  if(obj.printUser){
    printUser = '制表人：' + useUserStoreWidthOut().getUserInfo.username
  }

  let printList: any = []
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
  dynamicTenantId.value=data.databaseTrue
  newdate.value=data.strDate
  formItems.value.ckId=data.ckId
  ckList.value=data.ckList
  ckName.value=data.ckName
  stockClassId.value=data.stockClassId
  stockId.value=data.stockId
  strDate.value=data.strDate
  dataType.value=data.dataType
  getStockXCL()
}

// 查询现存量
const paginationNumber = ref(0)
const showPaginationText = ref(false)
async function getStockXCL() {
  showPaginationText.value=false
  loadMark.value=true
  let map={ckId:formItems.value.ckId,stockClassId:stockClassId.value,stockId:stockId.value,strDate:strDate.value,dataType:dataType.value}
  await useRouteApi(findByStockSFCNumberOrMoney, {schemaName: dynamicTenantId})(map)
  .then(async (temp)=>{
    temp=temp.filter(a=>!hasBlank(a.qichu)||!hasBlank(a.rk)||!hasBlank(a.ck))
    paginationNumber.value=temp.length
    showPaginationText.value=true

    temp.forEach(async (a)=>{
      a.stockCangkuName=ckName.value

      a.qimo=(parseFloat(a.qichu)+parseFloat(a.rk))-parseFloat(a.ck)
      a.qimo1=parseFloat(a.rate1)==0?null:parseFloat(a.qimo/a.rate1)
      a.qimo2=parseFloat(a.rate2)==0?null:parseFloat(a.qimo/a.rate2)

      a.qichu1=parseFloat(a.rate1)==0?null:parseFloat(a.qichu/a.rate1)
      a.qichu2=parseFloat(a.rate2)==0?null:parseFloat(a.qichu/a.rate2)
      a.rk1=parseFloat(a.rate1)==0?null:parseFloat(a.rk/a.rate1)
      a.rk2=parseFloat(a.rate2)==0?null:parseFloat(a.rk/a.rate2)
      a.ck1=parseFloat(a.rate1)==0?null:parseFloat(a.ck/a.rate1)
      a.ck2=parseFloat(a.rate2)==0?null:parseFloat(a.ck/a.rate2)
    })
    assembleTotal(temp)
    temp.map(a=>{
      a.qimo=toThousandFilter(a.qimo);
      a.qimo1=toThousandFilter(a.qimo1);
      a.qimo2=toThousandFilter(a.qimo2);
      a.qichu=toThousandFilter(a.qichu);
      a.qichu1=toThousandFilter(a.qichu1);
      a.qichu2=toThousandFilter(a.qichu2);
      a.rk=toThousandFilter(a.rk);
      a.rk1=toThousandFilter(a.rk1);
      a.rk2=toThousandFilter(a.rk2);
      a.ck=toThousandFilter(a.ck);
      a.ck1=toThousandFilter(a.ck1);
      a.ck2=toThousandFilter(a.ck2);
      return a;
    })
    let len = temp.length
    if(len<50){
      for (let i =  len; i < 50; i++) {
        temp.push({})
      }
    }
    setTimeout(()=>{
      tableData.value=temp
      loadMark.value=false
    },500)
  })
}
const assembleTotal = (list) => {
  let qichu = 0
  let qichu1 = 0
  let qichu2 = 0
  let rk = 0
  let rk1 = 0
  let rk2 = 0
  let ck = 0
  let ck1 = 0
  let ck2 = 0
  let qimo = 0
  let qimo1 = 0
  let qimo2 = 0

  for (let o of list) {
    qichu += parseFloat(o.qichu || '0')
    qichu1 +=parseFloat(o.qichu1 || '0')
    qichu2 += parseFloat(o.qichu2 || '0')
    rk += parseFloat(o.rk || '0')
    rk1 += parseFloat(o.rk1 || '0')
    rk2 += parseFloat(o.rk2 || '0')
    ck += parseFloat(o.ck || '0')
    ck1 += parseFloat(o.ck1 || '0')
    ck2 += parseFloat(o.ck2 || '0')
    qimo += parseFloat(o.qimo || '0')
    qimo1 += parseFloat(o.qimo1 || '0')
    qimo2 += parseFloat(o.qimo2 || '0')
  }
  summaryTotals.value=
    {
      qichu: toThousandFilter(qichu),
      qichu1: toThousandFilter(qichu1),
      qichu2: toThousandFilter(qichu2),
      rk: toThousandFilter(rk),
      rk1: toThousandFilter(rk1),
      rk2: toThousandFilter(rk2),
      ck: toThousandFilter(ck),
      ck1: toThousandFilter(ck1),
      ck2: toThousandFilter(ck2),
      qimo: toThousandFilter(qimo),
      qimo1: toThousandFilter(qimo1),
      qimo2: toThousandFilter(qimo2),
    }
}

const CrudApi = {
  columns: JSON.parse(JSON.stringify(glStore666.getColumns()))
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

//选中内容
const state = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
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
  menuName: '数量汇总表',
  type: '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})

const ccc=ref(
  [
    {
      title: '仓储位置',
      dataIndex: 'stockCangkuName',
      key: 'stockCangkuName',
      align: 'left',ellipsis: true,fixed: 'left'
    },
    {
      title: '存货编码',
      dataIndex: 'stockNum',
      key: 'stockNum',
      align: 'left',ellipsis: true,fixed: 'left'
    },
    {
      title: '存货名称',
      dataIndex: 'stockName',
      key: 'stockName',
      align: 'left',ellipsis: true,fixed: 'left'
    },
    {
      title: '规格型号',
      dataIndex: 'stockGgxh',
      key: 'stockGgxh',
      align: 'left',ellipsis: true,fixed: 'left'
    },
    {
      title: '主计量',
      dataIndex: 'unitName',
      key: 'unitName',
      align: 'center',ellipsis: true,fixed: 'left'
    },
    {
      title: '计量1',
      dataIndex: 'unitName1',
      key: 'unitName1',
      align: 'left',ellipsis: true,fixed: 'left'
    },
    {
      title: '计量2',
      dataIndex: 'unitName2',
      key: 'unitName2',
      align: 'left',ellipsis: true,fixed: 'left'
    },
    {
      title: '期初结存',
      dataIndex: 'qichu',
      width: 400,
      children: [
        {
          title: '主数量',
          dataIndex: 'qichu',
          key: '6-1',width: 130,
          align: 'right',
        },
        {
          title: '数量1',
          dataIndex: 'qichu1',
          key: '6-2',
          align: 'right',width: 130,
        },
        {
          title: '数量2',
          dataIndex: 'qichu2',
          key: '6-3',
          align: 'right',width: 140,
        }
      ],
    },
    {
      title: '本期入库',
      dataIndex: 'rk',width: 400,
      children: [
        {
          title: '主数量',
          dataIndex: 'rk',
          key: '7-1',
          align: 'right',width: 130,
        },
        {
          title: '数量1',
          dataIndex: 'rk1',
          key: '7-2',
          align: 'right',width: 130,
        },
        {
          title: '数量2',
          dataIndex: 'rk2',
          key: '7-3',
          align: 'right',width: 140,
        }
      ],
    },
    {
      title: '本期出库',
      dataIndex: 'ck',width: 400,
      children: [
        {
          title: '主数量',
          dataIndex: 'ck',
          key: '8-1',
          align: 'right',width: 130,
        },
        {
          title: '数量1',
          dataIndex: 'ck1',
          key: '8-2',
          align: 'right',width: 130,
        },
        {
          title: '数量2',
          dataIndex: 'ck2',
          key: '8-3',
          align: 'right',width: 140,
        }
      ],
    },
    {
      title: '期末结存',
      dataIndex: 'qimo',width: 400,
      children: [
        {
          title: '主数量',
          dataIndex: 'qimo',
          key: '9-1',
          align: 'right',width: 130,
        },
        {
          title: '数量1',
          dataIndex: 'qimo1',
          key: '9-2',
          align: 'right',width: 130,
        },
        {
          title: '数量2',
          dataIndex: 'qimo2',
          key: '9-3',
          align: 'right',width: 140,
        }
      ],
    },
  ]
)
const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(ccc.value))
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
    // tableRef.value.$el.style.setProperty('width', (windowWidth + 52 - f) + 'px')
  } else {
    totalColumnWidth.value = total
    // tableRef.value.$el.style.setProperty('width', (total + 52) + 'px')
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
  if (num == '' || num == null || parseFloat(num)==0) {
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
  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
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
  data.forEach(v=>{
    v.fujl1=v.fujl1==null?'':v.fujl1
    v.fujl2=v.fujl2==null?'':v.fujl2
    v.stockGgxh=v.stockGgxh==null?'':v.stockGgxh
    v.qichu=hasBlank(v.qichu)||parseFloat(v.qichu)==0?null:toThousandFilter(v.qichu)
    v.qichu1=hasBlank(v.qichu1)||parseFloat(v.qichu1)==0?null:toThousandFilter(v.qichu1)
    v.qichu2=hasBlank(v.qichu2)||parseFloat(v.qichu2)==0?null:toThousandFilter(v.qichu2)
    v.rk=hasBlank(v.rk)||parseFloat(v.rk)==0?null:toThousandFilter(v.rk)
    v.rk1=hasBlank(v.rk1)||parseFloat(v.rk1)==0?null:toThousandFilter(v.rk1)
    v.rk2=hasBlank(v.rk2)||parseFloat(v.rk2)==0?null:toThousandFilter(v.rk2)
    v.ck=hasBlank(v.ck)||parseFloat(v.ck)==0?null:toThousandFilter(v.ck)
    v.ck1=hasBlank(v.ck1)||parseFloat(v.ck1)==0?null:toThousandFilter(v.ck1)
    v.ck2=hasBlank(v.ck2)||parseFloat(v.ck2)==0?null:toThousandFilter(v.ck2)
    v.qimo=hasBlank(v.qimo)||parseFloat(v.qimo)==0?null:toThousandFilter(v.qimo)
    v.qimo1=hasBlank(v.qimo1)||parseFloat(v.qimo1)==0?null:toThousandFilter(v.qimo1)
    v.qimo2=hasBlank(v.qimo2)||parseFloat(v.qimo2)==0?null:toThousandFilter(v.qimo2)
  })
  let cangku=hasBlank(formItems.value.ckId)?'':ckList.value.filter(a=>a.cangkuId==formItems.value.ckId)[0]?.cangkuName
  const sheet =[
    {
      title: '数量收发存汇总表',
      tHeader: ['仓库：'+cangku +'       截止日期：'+newdate.value.replaceAll('-','.')],
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
  exportExcel(sheet, 'xlsx','数量收发存汇总表_'+pageParameter.companyName)
}
</script>
<style scoped lang="less">
@import "./global-menu-index.less";
:deep(.nc-summary){
  font-weight: bold;
  background-color: #cccccc!important;;
  border-right: none;
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
