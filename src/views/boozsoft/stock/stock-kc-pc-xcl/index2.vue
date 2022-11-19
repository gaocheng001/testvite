<template>
  <div>
    <div class="app-container">

      <div class="app-container-head">
        <div class="container-head-title" style="float: left;">
          <b class="noneSpan" style="font-size: 60px;margin-left: -16px;"><BarChartOutlined /></b>
        </div>
        <div class="container-head-title" style="padding-left: 40%;text-align: center;margin-top: 30px;">
          <b class="noneSpan" style="font-size: 26px;">存货批次现存量</b>
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

        <div style="float: right;margin-right: 5px">
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
        <div style="float: right; position: relative;">
          <Select v-model:value="formItems.selectType" style="width: 150px;font-size: 12px;" class="special_select">
            <SelectOption style="font-size: 12px;" value="stockNum">存货编码</SelectOption>
            <SelectOption style="font-size: 12px;" value="stockName">存货名称</SelectOption>
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
        <template #baseQuantity="{ record }"> {{ toThousandFilter(record.baseQuantity) }} </template>
        <template #subQuantity1="{ record }"> {{ toThousandFilter(record.subQuantity1) }} </template>
        <template #subQuantity2="{ record }"> {{ toThousandFilter(record.subQuantity2) }} </template>
        <template #keyong="{ record }"> {{ toThousandFilter(record.keyong) }} </template>
        <template #keyong1="{ record }"> {{ toThousandFilter(record.keyong1) }} </template>
        <template #keyong2="{ record }"> {{ toThousandFilter(record.keyong2) }} </template>
        <template #ztrkQuantityCgdh="{ record }"> {{ toThousandFilter(record.ztrkQuantityCgdh) }} </template>
        <template #cgdh1="{ record }"> {{ toThousandFilter(record.cgdh1) }} </template>
        <template #cgdh2="{ record }"> {{ toThousandFilter(record.cgdh2) }} </template>
        <template #ztrkQuantityCgrk="{ record }"> {{ toThousandFilter(record.ztrkQuantityCgrk) }} </template>
        <template #cgrk1="{ record }"> {{ toThousandFilter(record.cgrk1) }} </template>
        <template #cgrk2="{ record }"> {{ toThousandFilter(record.cgrk2) }} </template>
        <template #ztckQuantityXhd="{ record }"> {{ toThousandFilter(record.ztckQuantityXhd) }} </template>
        <template #xhd1="{ record }"> {{ toThousandFilter(record.xhd1) }} </template>
        <template #xhd2="{ record }"> {{ toThousandFilter(record.xhd2) }} </template>
        <template #ztrkQuantityQtck="{ record }"> {{ toThousandFilter(record.ztrkQuantityQtck) }} </template>
        <template #qtck1="{ record }"> {{ toThousandFilter(record.qtck1) }} </template>
        <template #qtck2="{ record }"> {{ toThousandFilter(record.qtck2) }} </template>

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
import {kcPcXCLStore} from "/@/views/boozsoft/stock/stock-kc-pc-xcl/generalLedger";
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
const glStore = kcPcXCLStore()
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
  ckList.value=data.ckList
  stockClassId.value=data.stockClassId
  stockId.value=data.stockNum
  batchId.value=data.batchId
  dpdate.value=data.dpdate
  dvdate.value=data.dvdate
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
  if(!hasBlank(data.batchId)){
    logmsg.push('批次：【'+data.batchId+'】')
  }
  if(!hasBlank(data.dpdate)){
    logmsg.push('生效日期：【'+data.dpdate+'】')
  }
  if(!hasBlank(data.dvdate)){
    logmsg.push('失效日期：【'+data.dvdate+'】')
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
  let map = {searchMap:formItems.value,queryType:'pcxcl',iyear:pageParameter.year,rkBcheck:pageParameter.thisAdInfo.target?.kcCgrkCheck,ckBcheck:pageParameter.thisAdInfo.target?.kcXsckCheck,
    ckId: formItems.value.ckId,stockId: stockId.value,batchId:batchId.value,dpdate:dpdate.value,dvdate:dvdate.value}
  let temp= await useRouteApi(findByStockXCL, {schemaName: dynamicTenantId})(map)
  temp.forEach(async (a)=>{
    // 默认为空，如勾选仓库显示具体仓库名称
    if(formItems.value.ckId!==''){
      let cangkuJoinName = await useRouteApi(findCangkuJoinName, {schemaName: dynamicTenantId})({id: a.cwhcode})
      a.cwhcodeName = cangkuJoinName[0].cangkuRecordJoinName
    }

    a.baseQuantity=a.xcl
    a.ztrkQuantityCgdh=a.midWayDh
    a.ztrkQuantityCgrk=a.midWayRk
    a.ztckQuantityXhd=a.midWayXh
    a.ztrkQuantityQtck=a.midWayCk

    a.subQuantity1=parseFloat(a.rate1)==0?null:parseFloat(String(a.xcl/a.rate1))
    a.subQuantity2=parseFloat(a.rate2)==0?null:parseFloat(String(a.xcl/a.rate2))
    a.cgdh1=parseFloat(a.rate1)==0?0:parseFloat(String(a.midWayDh/a.rate1))
    a.cgdh2=parseFloat(a.rate2)==0?0:parseFloat(String(a.midWayDh/a.rate2))
    a.cgrk1=parseFloat(a.rate1)==0?0:parseFloat(String(a.midWayRk/a.rate1))
    a.cgrk2=parseFloat(a.rate2)==0?0:parseFloat(String(a.midWayRk/a.rate2))
    a.xhd1=parseFloat(a.rate1)==0?0:parseFloat(String(a.midWayXh/a.rate1))
    a.xhd2=parseFloat(a.rate2)==0?0:parseFloat(String(a.midWayXh/a.rate2))
    a.qtck1=parseFloat(a.rate1)==0?0:parseFloat(String(a.midWayCk/a.rate1))
    a.qtck2=parseFloat(a.rate2)==0?0:parseFloat(String(a.midWayCk/a.rate2))
    a.keyong1=parseFloat(a.rate1)==0?0:parseFloat(String(a.keyong/a.rate1))
    a.keyong2=parseFloat(a.rate2)==0?0:parseFloat(String(a.keyong/a.rate2))
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

const getCurrSummary  = () => {
  let arr:any = []
  getColumns().filter(it=> it.title != '序号' && it.ifShow)
    .map((it)=>{
      //存在children 循环添加
      if(it.children){
        it.children.forEach(v=> arr.push(v))
      }else{
        arr.push(it)
      }
    })
  return arr
}

const assembleTotal = (list) => {
  let baseQuantity = 0
  let subQuantity1 = 0
  let subQuantity2 = 0
  let keyong = 0
  let keyong1 = 0
  let keyong2 = 0

  let ztrkQuantityCgdh = 0
  let cgdh1 = 0
  let cgdh2 = 0
  let ztrkQuantityCgrk = 0
  let cgrk1 = 0
  let cgrk2 = 0
  let ztckQuantityXhd = 0
  let xhd1 = 0
  let xhd2 = 0
  let ztrkQuantityQtck = 0
  let qtck1 = 0
  let qtck2 = 0

  let temp=list.filter(a=>!hasBlank(a))
  for (let o of temp) {
    baseQuantity += parseFloat(o.baseQuantity || '0')
    subQuantity1 += parseFloat(o.subQuantity1 || '0')
    subQuantity2 += parseFloat(o.subQuantity2 || '0')
    keyong += parseFloat(o.keyong || '0')
    keyong1 += parseFloat(o.keyong1 || '0')
    keyong2 += parseFloat(o.keyong2 || '0')
    ztrkQuantityCgdh += parseFloat(o.ztrkQuantityCgdh || '0')
    cgdh1 += parseFloat(o.cgdh1 || '0')
    cgdh2 += parseFloat(o.cgdh2 || '0')
    ztrkQuantityCgrk += parseFloat(o.ztrkQuantityCgrk || '0')
    cgrk1 += parseFloat(o.cgrk1 || '0')
    cgrk2 += parseFloat(o.cgrk2 || '0')

    ztckQuantityXhd += parseFloat(o.ztckQuantityXhd || '0')
    xhd1 += parseFloat(o.xhd1 || '0')
    xhd2 += parseFloat(o.xhd2 || '0')

    ztrkQuantityQtck += parseFloat(o.ztrkQuantityQtck || '0')
    qtck1 += parseFloat(o.qtck1 || '0')
    qtck2 += parseFloat(o.qtck2 || '0')
  }
  summaryTotals.value =
    {
      baseQuantity: toThousandFilter(baseQuantity),
      subQuantity1: toThousandFilter(subQuantity1),
      subQuantity2: toThousandFilter(subQuantity2),
      keyong: toThousandFilter(keyong),
      keyong1: toThousandFilter(keyong1),
      keyong2: toThousandFilter(keyong2),
      ztrkQuantityCgdh: toThousandFilter(ztrkQuantityCgdh),
      cgdh1: toThousandFilter(cgdh1),
      cgdh2: toThousandFilter(cgdh2),
      ztrkQuantityCgrk: toThousandFilter(ztrkQuantityCgrk),
      cgrk1: toThousandFilter(cgrk1),
      cgrk2: toThousandFilter(cgrk2),
      ztckQuantityXhd: toThousandFilter(ztckQuantityXhd),
      xhd1: toThousandFilter(xhd1),
      xhd2: toThousandFilter(xhd2),
      ztrkQuantityQtck: toThousandFilter(ztrkQuantityQtck),
      qtck1: toThousandFilter(qtck1),
      qtck2: toThousandFilter(qtck2),
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
  menuName: '批次存货现存量表',
  type: '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})

const ccc=ref(
  [
    {
      title: '仓储位置',
      dataIndex: 'cwhcodeName',
      key: 'cwhcodeName',
      align: 'left',ellipsis: true,
      width: 100,fixed: 'left'
    },
    {
      title: '存货编码',
      dataIndex: 'stockNum',
      key: 'stockNum',
      align: 'left',ellipsis: true,
      width: 100,fixed: 'left'
    },
    {
      title: '存货名称',
      dataIndex: 'stockName',
      key: 'stockName',
      align: 'left',ellipsis: true,
      width: 100,fixed: 'left'
    },
    {
      title: '规格型号',
      dataIndex: 'stockGgxh',
      key: 'stockGgxh',
      align: 'left',ellipsis: true,
      width: 100,fixed: 'left'
    },
    {
      title: '主计量',
      dataIndex: 'stockUnitName',
      key: 'stockUnitName',
      align: 'center',
      width: 60,fixed: 'left'
    },
    {
      title: '计量1',
      dataIndex: 'stockUnitName1',
      key: 'stockUnitName1',
      align: 'center',
      width: 60,fixed: 'left'
    },
    {
      title: '计量2',
      dataIndex: 'stockUnitName2',
      key: 'stockUnitName2',
      align: 'center',
      width: 60,fixed: 'left'
    },
    {
      title: '批次',
      dataIndex: 'batchId',
      key: 'batchId',
      align: 'left',ellipsis: true,
      width: 100,fixed: 'left'
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      key: 'dpdate',
      align: 'left',
      width: 100,
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      key: 'dvdate',
      align: 'left',
      width: 100,
    },
    {
      title: '现存量',
      dataIndex: 'baseQuantity',
      width: 400,
      children: [
        {
          title: '主数量',
          dataIndex: 'baseQuantity',
          key: '7-1',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'baseQuantity' }
        },
        {
          title: '数量1',
          dataIndex: 'subQuantity1',
          key: '7-2',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'subQuantity1' }
        },
        {
          title: '数量2',
          dataIndex: 'subQuantity2',
          key: '7-3',
          align: 'right',width: 140,ellipsis: true,slots: { customRender: 'subQuantity2' }
        }
      ],
    },
    {
      title: '可用量',
      dataIndex: 'keyong',
      width: 400,
      children: [
        {
          title: '主数量',
          dataIndex: 'keyong',
          key: '8-1',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'keyong' }
        },
        {
          title: '数量1',
          dataIndex: 'keyong1',
          key: '8-2',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'keyong1' }
        },
        {
          title: '数量2',
          dataIndex: 'keyong2',
          key: '8-3',
          align: 'right',width: 140,ellipsis: true,slots: { customRender: 'keyong2' }
        }
      ],
    },
    {
      title: '在途采购到货',
      dataIndex: 'ztrkQuantityCgdh',width: 400,
      children: [
        {
          title: '主数量',
          dataIndex: 'ztrkQuantityCgdh',
          key: '9-1',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'ztrkQuantityCgdh' }
        },
        {
          title: '数量1',
          dataIndex: 'cgdh1',
          key: '9-2',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'cgdh1' }
        },
        {
          title: '数量2',
          dataIndex: 'cgdh2',
          key: '9-3',
          align: 'right',width: 140,ellipsis: true,slots: { customRender: 'cgdh2' }
        }
      ],
    },
    {
      title: '在途采购(其他)入库',
      dataIndex: 'ztrkQuantityCgrk',width: 400,
      children: [
        {
          title: '主数量',
          dataIndex: 'ztrkQuantityCgrk',
          key: '10-1',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'ztrkQuantityCgrk' }
        },
        {
          title: '数量1',
          dataIndex: 'cgrk1',
          key: '10-2',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'cgrk1' }
        },
        {
          title: '数量2',
          dataIndex: 'cgrk2',
          key: '10-3',
          align: 'right',width: 140,ellipsis: true,slots: { customRender: 'cgrk2' }
        }
      ],
    },
    {
      title: '在途销售发货',
      dataIndex: 'ztckQuantityXhd',width: 400,
      children: [
        {
          title: '主数量',
          dataIndex: 'ztckQuantityXhd',
          key: '11-1',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'ztckQuantityXhd' }
        },
        {
          title: '数量1',
          dataIndex: 'xhd1',
          key: '11-2',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'xhd1' }
        },
        {
          title: '数量2',
          dataIndex: 'xhd2',
          key: '11-3',
          align: 'right',width: 140,ellipsis: true,slots: { customRender: 'xhd2' }
        }
      ],
    },
    {
      title: '在途销售(其他)出库',
      dataIndex: 'ztrkQuantityQtck',width: 400,
      children: [
        {
          title: '主数量',
          dataIndex: 'ztrkQuantityQtck',
          key: '12-1',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'ztrkQuantityQtck' }
        },
        {
          title: '数量1',
          dataIndex: 'qtck1',
          key: '12-2',
          align: 'right',width: 130,ellipsis: true,slots: { customRender: 'qtck1' }
        },
        {
          title: '数量2',
          dataIndex: 'qtck2',
          key: '12-3',
          align: 'right',width: 140,ellipsis: true,slots: { customRender: 'qtck2' }
        }
      ],
    }
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
    v.stockGgxh = v.stockGgxh == null ? '' : v.stockGgxh
    v.baseQuantity = v.baseQuantity == null ? '' : toThousandFilter(v.baseQuantity)
    v.subQuantity1 = v.subQuantity1 == null ? '' : toThousandFilter(v.subQuantity1)
    v.subQuantity2 = v.subQuantity2 == null ? '' : toThousandFilter(v.subQuantity2)
    v.keyong = v.keyong == null ? '' : toThousandFilter(v.keyong)
    v.keyong1 = v.keyong1 == null ? '' : toThousandFilter(v.keyong1)
    v.keyong2 = v.keyong2 == null ? '' : toThousandFilter(v.keyong2)
    v.ztrkQuantityCgdh = v.ztrkQuantityCgdh == null ? '' : toThousandFilter(v.ztrkQuantityCgdh)
    v.cgdh1 = v.cgdh1 == null ? '' : toThousandFilter(v.cgdh1)
    v.cgdh2 = v.cgdh2 == null ? '' : toThousandFilter(v.cgdh2)
    v.ztrkQuantityCgrk = v.ztrkQuantityCgrk == null ? '' : toThousandFilter(v.ztrkQuantityCgrk)
    v.cgrk1 = v.cgrk1 == null ? '' : toThousandFilter(v.cgrk1)
    v.cgrk2 = v.cgrk2 == null ? '' : toThousandFilter(v.cgrk2)
    v.ztrkQuantityQtrk = v.ztrkQuantityQtrk == null ? '' : toThousandFilter(v.ztrkQuantityQtrk)
    v.qtrk1 = v.qtrk1 == null ? '' : toThousandFilter(v.qtrk1)
    v.qtrk2 = v.qtrk2 == null ? '' : toThousandFilter(v.qtrk2)
    v.ztrkQuantityCcprk = v.ztrkQuantityCcprk == null ? '' : toThousandFilter(v.ztrkQuantityCcprk)
    v.ccprk1 = v.ccprk1 == null ? '' : toThousandFilter(v.ccprk1)
    v.ccprk2 = v.ccprk2 == null ? '' : toThousandFilter(v.ccprk2)
    v.ztrkQuantityInt = v.ztrkQuantityInt == null ? '' : toThousandFilter(v.ztrkQuantityInt)
    v.int1 = v.int1 == null ? '' : toThousandFilter(v.int1)
    v.int2 = v.int2 == null ? '' : toThousandFilter(v.int2)
    v.ztckQuantityXhd = v.ztckQuantityXhd == null ? '' : toThousandFilter(v.ztckQuantityXhd)
    v.xhd1 = v.xhd1 == null ? '' : toThousandFilter(v.xhd1)
    v.xhd2 = v.xhd2 == null ? '' : toThousandFilter(v.xhd2)
    v.ztrkQuantityXsck = v.ztrkQuantityXsck == null ? '' : toThousandFilter(v.ztrkQuantityXsck)
    v.xsck1 = v.xsck1 == null ? '' : toThousandFilter(v.xsck1)
    v.xsck2 = v.xsck2 == null ? '' : toThousandFilter(v.xsck2)
    v.ztrkQuantityClly = v.ztrkQuantityClly == null ? '' : toThousandFilter(v.ztrkQuantityClly)
    v.clly1 = v.clly1 == null ? '' : toThousandFilter(v.clly1)
    v.clly2 = v.clly2 == null ? '' : toThousandFilter(v.clly2)
    v.ztrkQuantityQtck = v.ztrkQuantityQtck == null ? '' : toThousandFilter(v.ztrkQuantityQtck)
    v.qtck1 = v.qtck1 == null ? '' : toThousandFilter(v.qtck1)
    v.qtck2 = v.qtck2 == null ? '' : toThousandFilter(v.qtck2)
    v.ztrkQuantityOut = v.ztrkQuantityOut == null ? '' : toThousandFilter(v.ztrkQuantityOut)
    v.out1 = v.out1 == null ? '' : toThousandFilter(v.out1)
    v.out2 = v.out2 == null ? '' : toThousandFilter(v.out2)

  })
  let cangku=hasBlank(formItems.value.ckId)?'':ckList.value.filter(a=>a.cangkuId==formItems.value.ckId)[0]?.cangkuName
  const sheet =[
    {
      title: '存货批次现存量查询',
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
  exportExcel(sheet, 'xlsx','存货批次现存量查询_'+pageParameter.companyName)
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
