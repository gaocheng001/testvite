<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <BarChartOutlined style="color: #0096c7;font-size: 60px;"/>
        </div>
        <div><AccountPicker style="background-color: #f5f5f5;" theme="three" readonly @reloadTable="dynamicAdReload"/>
          <div>
            <div style="margin-left: 10px;">
              <b><span style="color: #666666;padding-left:5px;">存 货：</span>{{pageParameter.chname}}</b>
              <br>
              <div style="padding-top: 3px;">
                <b><span style="color: #666666;padding-left:5px;"> 规则型号：</span>{{pageParameter.stockGgxh}}</b>
                <b><span style="color: #666666;padding-left:5px;"> 主计量：</span>{{pageParameter.stockUnitName}}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div><b class="noneSpan" style="font-size: 24px;color: #0096c7;">库存台账</b></div>
        <div><span style="font-size: 14px;font-weight: bold;"><span style="  font-weight: bold;color: #666666;">日期：</span>{{ pageParameter.dateStart }} - {{ pageParameter.dateEnd }}</span></div>
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
            @click="excelData()"
          ><span>导出</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>邮件</span></button>
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

          <div style="margin-top: 8px;margin-right: 20px;">

            <b><span style="color: #666666;"> 仓库：</span>{{pageParameter.ckname}}</b>
          </div>
          <div>
            <Select v-model:value="formItems.selectType" style="width: 150px;font-size: 12px;text-align: left;border-radius: 4px" class="special_select">
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

          <Button class="ant-btn-me">
            <SyncOutlined :style="{ fontSize: '14px' }" @click="reloadTable()"/>
          </Button>
          <Popover class="ant-btn-default" placement="bottom">
            <template #content>
              <a-popconfirm
                ok-text="确定"
                cancel-text="放弃"
                placement="leftTop"
                @confirm="confirm"
                @cancel="cancel">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <a-table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                           childrenColumnName="children" :pagination="false"
                           style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                    <template #checkBox="{ text, record }">
                      <a-checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                    </template>
                    <template #widthInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <a-input type="number" v-model:value="editableData[record.key].width"
                                   @pressEnter="save(record.key,record.min,record.max)"
                                   style="width: 80px"/>
                          <check-outlined class="editable-cell-icon-check"
                                          @click="save(record.key,record.min,record.max)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <edit-outlined class="editable-cell-icon" @click="edit(record.key)"/>
                          <span style="float: right;">{{ record.min + '~' + record.max }}</span>
                        </div>
                      </div>
                    </template>
                    <template #nameInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <a-input type="text" v-model:value="editableData[record.key].nameNew"
                                   @pressEnter="saveName(record.key)" style="width: 100px"/>
                          <check-outlined class="editable-cell-icon-check"
                                          @click="saveName(record.key)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <edit-outlined class="editable-cell-icon" @click="edit(record.key)"/>
                        </div>
                      </div>
                    </template>
                    <template #alignRadio="{ text, record }">
                      <a-radio-group default-value="a" size="small" v-model:value="record.align"
                                     :disabled="record.align==''">
                        <a-radio-button value="left">
                          左
                        </a-radio-button>
                        <a-radio-button value="center">
                          中
                        </a-radio-button>
                        <a-radio-button value="right">
                          右
                        </a-radio-button>
                      </a-radio-group>
                    </template>
                  </a-table>
                </template>
                <a-button style="width: 120px;margin-bottom: 2px">栏目设置</a-button>
              </a-popconfirm>
              <br/>
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
              <span class="group-btn-span-special2" @click="onChangeSwitch('J')" :style="pageParameter.queryMark=='J'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 135px;">
                <SortDescendingOutlined/>&nbsp;数量式&emsp;&emsp;&nbsp;<CheckOutlined v-if="pageParameter.queryMark=='J'"/>
              </span><br/>
              <span class="group-btn-span-special2" @click="onChangeSwitch('SJ')" :style="pageParameter.queryMark=='SJ'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 135px;">
                <SortAscendingOutlined/>&nbsp;数量金额式&nbsp;<CheckOutlined v-if="pageParameter.queryMark=='SJ'"/>
              </span><br/>
            </template>
            <Button>
              <PicLeftOutlined :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
        </div>
      </div>
    </div>
    <div class="app-container">
      <BasicTable
        ref="tableRef"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable"
        :dataSource="tableData"
        :scroll="{ x: totalColumnWidth,y: windowHeight }"
        :loading="loadMark"
        size="small"
      >
        <template #bcheck="{ record }">
          <span>
            <Tag v-if="record.bcheck != '5' && record.bcheck != '6'" :color="record.bcheck === '1' ? 'green' : 'volcano'">
              {{ ('HZHCD' == record.billStyle || 'LZHCD' == record.billStyle)? '' : (record.bcheck === '1' ? '已审核' : '未审核') }}
            </Tag>
          </span>
        </template>
        <template #billStyle="{ record }">
          <span>
            {{billStyleFilter(record.billStyle)}}
          </span>
        </template>

        <template #ccode="{ record }">
          <a><span>{{record.ccode}}</span></a>
        </template>

        <template #bq="{ record }">
          <span>{{toThousandFilter(record.bq)}}</span>
        </template>
        <template #price="{ record }"><span>{{toThousandFilter(record.price)}}</span></template>
        <template #icost="{ record }"><span>{{toThousandFilter(record.icost)}}</span></template>
        <template #bq1="{ record }"><span>{{toThousandFilter(record.bq1)}}</span></template>
        <template #price1="{ record }"><span>{{toThousandFilter(record.price1)}}</span></template>
        <template #icost1="{ record }"><span>{{toThousandFilter(record.icost1)}}</span></template>
        <template #bq2="{ record }"><span>{{toThousandFilter(record.bq2)}}</span></template>
        <template #price2="{ record }"><span>{{toThousandFilter(record.price2)}}</span></template>
        <template #icost2="{ record }"><span>{{toThousandFilter(record.icost2)}}</span></template>

        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;">
              <TableSummaryCell class="nc-summary" :index="0" :align="'center'" style="border-right: none;"></TableSummaryCell>
              <TableSummaryCell class="nc-summary" style="border-right: none;" v-for="cell in getCurrSummary()" :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':summaryModel[cell.dataIndex]}}</span></TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>

      <div class="pagination-text" v-show="showPaginationText">
        {{`共 ${paginationNumber} 条记录   &nbsp;&nbsp;每页 1000 条`}}
      </div>
    </div>
    <Query @save="saveQuery" @register="registerQueryPage"/>
    <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import { BasicTable, useTable } from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import Icon from '/@/components/Icon/index'
import {
  CaretDownFilled,
  FormOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined,
  EditFilled,
  PieChartFilled,
  SortDescendingOutlined,
  CheckOutlined,
  SortAscendingOutlined,
  UsbOutlined,
  ProfileOutlined,
  EditOutlined,
  BarChartOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'
import {
  Select,
  Input,
  Popover,
  Button,
  Tag,
  message,
  Checkbox as ACheckbox,
  Radio as ARadio,
  Table as ATable,
  Popconfirm as APopconfirm, Table,
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, getThisIndexImg, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {pad} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
import {
  findCangkuAllList,
  findStockAllList
} from "/@/api/record/system/stock-wareh";
import {
  findList,
} from "/@/api/record/stock/stock-account";

import {getPsnList} from "/@/api/record/system/psn";
import {findOption} from "/@/api/record/stock/stock-option";
import {findAllByFlag} from "/@/api/record/supplier_data/supplier";
import {findAll} from "/@/api/caozuoyuan/caozuoyuan";
import Query from './popup/query.vue'
import {chtzStore} from "/@/api/record/stock/generalLedger-kctz";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";

const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group
const TableSummary = Table.Summary
const TableSummaryRow = Table.Summary.Row
const TableSummaryCell = Table.Summary.Cell
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
const openQuery = async () => {
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
}

async function saveQuery(data) {
  //查询 数据
  pageParameter.dateStart = data.dateStart.replaceAll('-','.')
  pageParameter.dateEnd = transformTimestamp(data.dateEnd).replaceAll('-','.')
  pageParameter.ck = data.cwhcode
  pageParameter.ch = data.stockNum
  pageParameter.flg = data.flg
  pageParameter.chname = data.chname
  pageParameter.ckname = data.ckname
  pageParameter.stockGgxh = data.stockGgxh
  pageParameter.stockUnitName = data.stockUnitName
  databaseCode.value=data.accId
  useRouteApi(findOption,{schemaName: databaseCode})({type: '3',code: databaseCode.value}).then(res=>{
    filterlength.value = res.basisMap.kcNumWs
  }).catch(error => {
    console.log('error', error)
  })
  reloadTable()
}
function transformTimestamp(timestamp){
  let a = new Date(timestamp).getTime();
  const date = new Date(a);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
  const dateString = Y + M + D;
  return dateString;
}
const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)
const databaseCode = ref()

const showPaginationText = ref(false)
const paginationNumber = ref(0)
const cinvode = ref('')
const psnList:any = ref([])
const supplierList:any = ref([])
const cangkuList:any = ref([])
const userList:any = ref([])
const stockList:any = ref([])
async function reloadList() {
  psnList.value = await useRouteApi(getPsnList, {schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAllByFlag, {schemaName: dynamicTenantId})('1')
  supplierList.value = res.items
  cangkuList.value = await useRouteApi(findCangkuAllList, {schemaName: dynamicTenantId})({})
  const res1 = await findAll({})
  userList.value = res1.items
  stockList.value = await useRouteApi(findStockAllList, {schemaName: dynamicTenantId})({})
}

//搜索项目
const stockList1 = ref([])
function handleSearch(value) {
  stockList1.value = stockList.value.filter(item => {
    if (value!=null && value!='') {
      return item.stockNum.indexOf(value) != -1 || item.stockName.indexOf(value) != -1
    }
    return item
  })
}

function handleChange(value) {
  cinvode.value = value;
  stockList1.value = stockList.value.filter(item => {
    if (value!=null && value!='') {
      return item.stockNum.indexOf(value) != -1 || item.stockName.indexOf(value) != -1
    }
    return item
  })
}

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)
const sumBq = ref('0.00')
const sumIm = ref('0.00')
const sumBq1 = ref('0.00')
const sumIm1 = ref('0.00')
const sumBq2 = ref('0.00')
const sumIm2 = ref('0.00')
async function reloadTable(){
  loadMark.value = true
  resetDynamicColumnData()
  showPaginationText.value = false
  tableData.value = []
  let a =  await useRouteApi(findList,{schemaName: databaseCode})(pageParameter)
  calculateTotal(a.list)
  getCurrSummary()
  sumBq.value = a.sumBq
  sumIm.value = a.sumIm
  sumBq1.value =a.sumBq1
  sumIm1.value =a.sumIm1
  sumBq2.value =a.sumBq2
  sumIm2.value =a.sumIm2
  paginationNumber.value = a.size
  if(a.size < 50){
    let s = 50-a.size
    for (let i = 0; i < s; i++) {
      a.list.push({
        bcheck:'5',
        bq:'',
        bq1:'',
        bq2:'',
      })
    }
  }
  tableDataAll.value = a.list
  tableData.value = tableDataAll.value
  await setPagination({
    total: tableData.value.length
  })
  loadMark.value = false
  //handleSummary(tableDataAll.value)
  showPaginationText.value = true
}

const pageParameter: any = reactive({
  cardUnique: '',
  isEdit: '0',
  dynamicTenantId: '',
  defaultAdName: '',
  year: '',
  thisAdInfo: {},
  total: 0,
  showRulesSize: 'MIN',
  queryMark: 'SJ',
  coCode: '',
  dateStart:'',
  dateEnd:'',
  ch:'',
  chname:'',
})

// 全局常量
const glStore = chtzStore()

const styleName = ref<String>("金额式")
const showStyle = ref([
  {
    'name': '金额式',
    'value': 'J'
  }, {
    'name': '数量金额式',
    'value': 'SJ'
  }
])

const onChangeSwitch = async (v) => { // 动态列
  styleName.value = showStyle.value.filter(o => o.value === v)[0].name
  pageParameter.queryMark = v
  resetDynamicColumnData()
  reloadTable()
  // pageParameter.searchConditon.requirement = 'ccode'
  // pageParameter.searchConditon.value = ''
}

const CrudApi = {
  list: findAll,
  columns: JSON.parse(JSON.stringify(glStore.getColumns(pageParameter.queryMark)))
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
    simple: true,
  },
 /* showSummary: true,
  summaryFunc: handleSummary,*/
})
function handleSummary(tableData: Recordable[]) {
  const totalBq = tableData.reduce((prev, next) => {
    if(!hasBlank(next.bq)){
      prev = add(prev,next.bq);
    }else{
      prev = add(prev,0);
    }
    return prev;
  }, 0);
  const totalIcost = tableData.reduce((prev, next) => {
    if(!hasBlank(next.icost)){
      prev = add(prev,next.icost);
    }else{
      prev = add(prev,0);
    }
    return prev;
  }, 0);
  const totalBq1 = tableData.reduce((prev, next) => {
    if(!hasBlank(next.bq1)){
      prev = add(prev,next.bq1);
    }else{
      prev = add(prev,0);
    }
    return prev;
  }, 0);
  const totalIcost1 = tableData.reduce((prev, next) => {
    if(!hasBlank(next.icost1)){
      prev = add(prev,next.icost1);
    }else{
      prev = add(prev,0);
    }
    return prev;
  }, 0);
  console.log(totalIcost1)
  let a = tableData.filter(v=> '5' != v.bcheck)
  summaryModel.value={
    bq: toThousandFilter(parseFloat(totalBq).toFixed(2)),
    icost: toThousandFilter(parseFloat(totalIcost).toFixed(2)),
    bq1: toThousandFilter(parseFloat(totalBq1).toFixed(2)),
    icost1: toThousandFilter(parseFloat(totalIcost1).toFixed(2)),
    bq2: a.length >0 ?toThousandFilter(parseFloat(a[a.length-1].bq2).toFixed(2)):'0.00',
    icost2: a.length >0 ?toThousandFilter(parseFloat(a[a.length-1].icost2).toFixed(2)):'0.00',
  }
/*  return [
    {
      _index: '合计',
      bq: toThousandFilter(parseFloat(totalBq).toFixed(2)),
      icost: toThousandFilter(parseFloat(totalIcost).toFixed(2)),
      bq1: toThousandFilter(parseFloat(totalBq1).toFixed(2)),
      icost1: toThousandFilter(parseFloat(totalIcost1).toFixed(2)),
      bq2: a.length >0 ?toThousandFilter(parseFloat(a[a.length-1].bq2).toFixed(2)):'0.00',
      icost2: a.length >0 ?toThousandFilter(parseFloat(a[a.length-1].icost2).toFixed(2)):'0.00',
    },
  ];*/
}
const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const openSelectContent = () => {
  openStockInfoModalPage(true, {
    database: dynamicTenantId.value,
  })
}

const modalData = (o) => {
  cinvode.value = o[0].stockNum
  handleChange(o[0].stockNum)
}
//加
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
const onSelectChange = (selectedRowKeys,row) => {
  // console.log('selectedRowKeys changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
};

function onSearch() {

}

const defaultPage = ref(false)

import {
  defaultV,
  sheet_from_array_of_arrays,
  Workbook,
  writeExcel
} from "/@/utils/boozsoft/excel/excel2";
import XLSX from "xlsx-js-style";
const excelData = () => {
  // console.log("导出成功！")
  let list: any = []
  const arrData = tableData.value
  arrData.map(item=>{
    item.baseQuantity = toThousandFilter(item.baseQuantity)
    item.price = toThousandFilter(item.price)
    item.isum = toThousandFilter(item.isum)
    item.baseQuantity1 = toThousandFilter(item.baseQuantity1)
    item.price1 = toThousandFilter(item.price1)
    item.isum1 = toThousandFilter(item.isum1)
    item.baseQuantity2 = toThousandFilter(item.baseQuantity2)
    item.price2 = toThousandFilter(item.price2)
    item.isum2 = toThousandFilter(item.isum2)
  })
  console.log(list)
  const sheet:any = [
    {
      title: '库存台账',
      multiHeader: [
        ['仓库：0001 - 默认仓库', '', '', '', '', '', '', '期间：2022.01.01 - 2022.12.31', '', '', '', '', '', '', '', '', '存货：001 - 默认存货', '', ''],
        ['单据日期', '单据类型', '单据编号', '存储位置', '业务类型', '往来单位', '项目', '批号', '生产日期', '生效日期', '收入', '', '', '发出', '','','结存','',''],
        ['', '', '', '', '', '', '', '', '', '', '主数量', '单价', '金额', '主数量', '单价', '金额', '主数量', '单价', '金额']
      ],
      table: arrData,
      keys: ['ddate', 'billStyle', 'ccode', 'address', 'bstyle', 'cvencode', 'citemCode', 'batchId', 'dpdate', 'dvdate', 'baseQuantity', 'price', 'isum', 'baseQuantity1', 'price1', 'isum1', 'baseQuantity2', 'price2', 'isum2'],
      merges: ['A2:D2','H2:L2','Q2:S2','A3:A4','B3:B4','C3:C4','D3:D4','E3:E4','F3:F4','G3:G4','H3:H4','I3:I4','J3:J4','K3:M3','N3:P3','Q3:S3'],
      sheetName: '库存台账',
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
      colWidth: [10, 10, 10, 15, 12, 15, 15, 12, 10, 10, 12, 12, 12, 12, 12, 12, 12, 12, 12]
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
          // debugger
          dataInfo[i.toString()].s = globalStyle;
          const {border, font, alignment, fill} = globalStyle;
          if (i.substring(1) == '1' || i.substring(1) == '2') {
            dataInfo[i.toString()].s = {
              border: {},
              font: font || globalStyle.font,
              alignment: alignment || globalStyle.alignment,
              fill: fill || globalStyle.fill
            }
            if (i == 'A2') {
              dataInfo[i.toString()].s = {
                border: {},
                font: font || globalStyle.font,
                alignment: {
                  horizontal: "left",
                },
                fill: fill || globalStyle.fill
              }
            }
            if (i == 'Q2') {
              dataInfo[i.toString()].s = {
                border: {},
                font: font || globalStyle.font,
                alignment: {
                  horizontal: "right",
                },
                fill: fill || globalStyle.fill
              }
            }
          } else if (i.substring(1) == '3' || i.substring(1) == '4') {
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
            || i.substring(0, 1) == 'I' || i.substring(0, 1) == 'J') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'K' || i.substring(0, 1) == 'L' || i.substring(0, 1 ) == 'M'
            || i.substring(0, 1) == 'N' || i.substring(0, 1) == 'O' || i.substring(0, 1 ) == 'P'
            || i.substring(0, 1) == 'Q' || i.substring(0, 1) == 'R' || i.substring(0, 1 ) == 'S') {
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
  writeExcel(wb, bookType, '库存台账_'+pageParameter.coCode+'_'+pageParameter.companyName)
}

/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findStockDbLanMuList, saveStockLanMuList} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (340) )
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = {
  'accId': '',
  'menuName': '库存台账',
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
      lanMuData.accId = getCurrentAccountName(false)
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
  let last = a.pop()
  let newA = JSON.parse(JSON.stringify(glStore.getColumns(pageParameter.queryMark)))
  // let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  //searchConditonList.value = newA
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = getCurrentAccountName(false)
  findStockDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0) {
      // let statiList = initDynamics()['DATA']
      let statiList = initDynamics()[pageParameter.queryMark]
      dbList = combineParameters(statiList, dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    } else {
      // let statiList = initDynamics()['DATA']
      let statiList = initDynamics()[pageParameter.queryMark]
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns()
    //reloadTable()
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

const pageReload = () => {
  setTableData([]) // 清空可能残留的数据
  reload({
    searchInfo: pageParameter
  })
}
const dynamicAdReload = async (obj) => {

}

onMounted( ()=>{
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
  loadMark.value = true
})

const billStyleFilter = (a) => {
  let str = ''
  if(a == 'CGRKD'){
    str = '采购入库单'
  }else if(a == 'DBRKD'){
    str = '调拨入库单'
  }else if(a == 'XTZHRKD'){
    str = '形态转换单'
  }else if(a == 'QTRKD'){
    str = '其他入库单'
  }else if(a == 'PYRKD'){
    str = '盘盈入库单'
  }else if(a == 'CLLYRKD'){
    str = '材料领用入库单'
  } else if(a == 'XSCKD'){
    str = '销售出库单'
  }else if(a == 'QTCKD'){
    str = '其他出库单'
  }else if(a == 'DBCKD'){
    str = '调拨出库单'
  }else if(a == 'XTZHCKD'){
    str = '形态转换出库单'
  }else if(a == 'CLLYCKD'){
    str = '材料领用出库单'
  }else if(a == '期初结存'){
      str="期初结存"
  }else if(a == 'RKTZD'){
    str="入库调整单"
  }else if(a == 'CKTZD'){
    str="出库调整单"
  }else if(a == 'HZHCD'){
    str="红字回冲单"
  }else if(a == 'LZHCD'){
    str="蓝字回冲单"
  }

  return str
}


const filterlength = ref(2)

function toThousandFilter(num: any) {
  if (num == '0.0') {
    return ''
  }
  if (num == '0.00') {
    return ''
  }
  if (num == '' || num == null) {
    return ''
  }
  return (+num || 0).toFixed(filterlength.value).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}
/*** 合计 ***/
const summaryTotals = ref({})

const summaryModel = ref({})
const getCurrSummary  = () => {
  let arr = []
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

const calculateTotal = (data) => {
  let list = JsonTool.parseProxy(data)
  if (list.length == 0){
    summaryModel.value = {}
    return false;
  }
  let bq = 0
  let icost = 0
  let bq1 = 0
  let icost1 = 0
  let bq2 = 0
  let icost2 = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    bq+=parseFloat(e['bq'] || 0)
    icost+=parseFloat(e['icost'] || 0)
    bq1+=parseFloat(e['bq1'] || 0)
    icost1+=parseFloat(e['icost1'] || 0)
  }
  bq2 = list[list.length-1].bq2
  icost2 = list[list.length-1].icost2
  summaryModel.value={
    ddate:'合计',
    bq: toThousandFilter(bq),
    icost: toThousandFilter(icost),
    bq1: toThousandFilter(bq1),
    icost1: toThousandFilter(icost1),
    bq2: toThousandFilter(bq2),
    icost2: toThousandFilter(icost2),
  }
}
/*** 合计 ***/
</script>
<style scoped lang="less">
@import "./global-menu-index.less";
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
  border-color: #aaaaaa !important;
  height: 30px;
  font-weight: unset;
  color: black;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 12px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  height: 27px;
  font-weight: unset;
  color: black;
}


.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 3px;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 0px 10px;
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
  width: 100%!important;
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}

.lcr-theme-div{
  border-radius: 5px 5px 0 0;
  display: inline-flex;justify-content: space-between;width: 99%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    >div:nth-of-type(1){width: 64px;display: inline-block;
      position: absolute;
      top: 12px;
      left: 3px;
    }
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;
      position: absolute;
      top: 0px;
      left: 75px;
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;padding-top:8px;
    >div:nth-of-type(2){margin-top: 1px;}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;padding-right: 3px;
    >div:nth-of-type(2){
      display: inline-flex;justify-content: space-between;margin-top: 15px;

    }
    .acttd-right-d-search {
      .acttdrd-search-select {
        width: 120px;

        :deep(.ant-select-selector) {
          border-radius: 2px 0 0 2px;
          height: 30px;
        }
      }

      .acttdrd-search-input {
        width: 180px;
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
  color: #0798c8;
  cursor: pointer;
  text-decoration: none;
}

.tableUStyle:hover {
  color: #b4c8e3;
}
:deep(.ant-table-measure-row){
  td{
    padding: 0 !important;
  }
}
:deep(.nc-summary){
  font-weight: bold;
  background-color: #cccccc!important;;
  border-right-color: #cccccc!important;
}
</style>

