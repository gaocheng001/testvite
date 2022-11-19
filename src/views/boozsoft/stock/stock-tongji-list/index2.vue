<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <BarChartOutlined />
        </div>
        <div>
          <div><AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/></div>
<!--        <div>     <span style="color: black;margin-left: 1em;">{{getHomeOrSelectName(false)}}：</span>
            <Select v-if="pageParameter.queryMark != 4" style="width: 250px" v-model:value="pageParameter.selectClass" @change="selectChange">
              <SelectOption value="">全部</SelectOption>
              <SelectOption v-for="it in selectClassList" :value="it.value">{{it.label}}</SelectOption>
            </Select>
            <Cascader
              v-else
              :options="selectClassList"
              v-model:value="pageParameter.selectList"
              placeholder="省/市/区"
              style="width: 250px;border: none;text-align: center"
              @change="selectChange"
            />
            </div>
            -->

        </div>
      </div>
      <div>
        <div><b class="noneSpan" style="font-size: 24px;color: #0096c7;">{{getHomeOrSelectName(true)}}销售统计表</b></div>
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
            @click="startExport()"
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
          <div class="acttd-right-d-search">
            <Select v-model:value="formItems.selectType" class="acttdrd-search-select">
              <SelectOption style="font-size: 12px;" value="cinvode">存货编码</SelectOption>
              <SelectOption style="font-size: 12px;" value="cinvodeBarcode">条形码</SelectOption>
              <SelectOption style="font-size: 12px;" value="cinvodeName">存货名称</SelectOption>
              <SelectOption style="font-size: 12px;" value="speciType">规格型号</SelectOption>
              <SelectOption style="font-size: 12px;" value="xsUnitId">计量单位</SelectOption>
              <SelectOption style="font-size: 12px;" value="quantity">数量</SelectOption>
              <SelectOption style="font-size: 12px;" value="isum">价税合计</SelectOption>
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
<!--            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
                <span class="group-btn-span-special2" @click="typeFlag='0'" :style="typeFlag=='0'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 130px;">
                  按明细显示&emsp;<CheckOutlined v-if="typeFlag=='0'"/>
                </span><br/>
                <span class="group-btn-span-special2" @click="typeFlag='1'" :style="typeFlag=='1'?{backgroundColor: '#0096c7',color: 'white'}:''" style="width: 130px;">
                  按汇总显示&emsp;<CheckOutlined v-if="typeFlag=='1'"/>
                </span>
              </template>
              <Button>
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>-->
<!--            <Popover class="ant-btn-default" placement="bottom">
            <template #content>
                            <span class="group-btn-span-special2 p_specifics" @click="excelDataCode()" style="width: 130px;text-align: left;padding: 5px 10%;">
                              导出含编码明细
                            </span><br/>
              <span class="group-btn-span-special2 p_specifics" @click="excelData()" style="width: 130px;text-align: left;padding: 5px 10%;">
                              导出普通明细
                            </span><br/>
              <span class="group-btn-span-special2 p_specifics" @click="excelDataList()" style="width: 130px;text-align: left;padding: 5px 10%;">
                              导出汇总列表
                            </span>
            </template>
            <Button>
              <UsbOutlined :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
            <Popover class="ant-btn-default" placement="bottom">
              <template #content>
                            <span class="group-btn-span-special2 p_specifics" style="width: 120px;text-align: left;padding: 5px 10%;">
                              打印当前列表
                            </span><br/>
                <span class="group-btn-span-special2 p_specifics" style="width: 120px;text-align: left;padding: 5px 10%;">
                              单据打印
                            </span>
              </template>
              <Button class="ant-btn-me">
                <PrinterOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>-->
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
            <template #icost="{ record }">{{ toThousandFilter(record.icost) }}</template>
            <template #hxIsum="{ record }">{{ toThousandFilter(record.hxIsum) }}</template>
            <template #quantity="{ record }"><span class="tableUStyle" @click="openNewPage(record,'mx')">{{ toThousandFilter(record.quantity) }}</span></template>
            <template #isumChuku="{ record }"><span class="tableUStyle" @click="openNewPage(record,'ck')">{{ toThousandFilter(record.isumChuku) }}</span></template>
            <template #isumTuiHuo="{ record }"><span class="tableUStyle" @click="openNewPage(record,'th')">{{ toThousandFilter(record.isumTuiHuo) }}</span></template>
            <template #isumFapiao="{ record }"><span class="tableUStyle" @click="openNewPage(record,'fp')">{{ toThousandFilter(record.isumFapiao) }}</span></template>
            <template #isum="{ record }">{{ toThousandFilter(record.isum) }}</template>
            <template #cvencodeCode="{ record }">{{ formatCvencode(record.cvencode,'custCode') }}</template>
            <template #cvencode="{ record }">{{ formatCvencode(record.cvencode,'custName') }}</template>
            <template #cvencodeJs="{ record }">{{ formatCvencode(record.cvencodeJs,'custName') }}</template>
            <template #cpersoncode="{ record }">{{ formatCpersoncode(record.bcheckUser) }}</template>
            <template #cwhcode="{ record }">{{ formatCwhcode(record.cwhcode) }}</template>
            <template #cmaker="{ record }">{{ formatUser(record.cmaker) }}</template>
            <template #xsUnitId="{ record }">{{ formatCunitid(record.cinvode,record.xsUnitId) }}</template>
            <template #cinvodeBarcode="{ record }">{{ formatCinvode(record.cinvode,'cinvodeBarcode') }}</template>
            <template #cinvodeName="{ record }">{{ formatCinvode(record.cinvode,'stockName') }}</template>
            <template #speciType="{ record }">{{ formatGgxh(record.cinvode) }}</template>
          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow>
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合计</TableSummaryCell>
                 <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':summaryModel[cell.dataIndex].toFixed(2)}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
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
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {assemblyDynamicColumn} from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
/**********************汇总栏目设置**********************/
import {
 findTongJi,
} from "/@/api/record/stock/stock-xhd";
import {findAll as findAllJiLang, findUnitInfoList} from "/@/api/record/system/unit-mea";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
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
  selectType: 'cinvode'
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
  pageParameter.queryMark = data.constant.queryType
  pageParameter.query = data.variable
  if (!hasBlank(data.variable.periodStart)){
    qijianText.value = formatText(data.variable.periodStart)+ ' - '+formatText(data.variable.periodEnd)
  }else{
    qijianText.value = data.variable.dateStart.replaceAll(/-/g,'.')+ ' - '+data.variable.dateEnd.replaceAll(/-/g,'.')
  }
  await reloadList(e.map)
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

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const loadMark = ref(false)
async function reloadTable(){
  loadMark.value = true
  tableDataAll.value = await useRouteApi(findTongJi,{schemaName: dynamicTenantId})(pageParameter)
  tableData.value = replenishTrs(JsonTool.parseProxy(tableDataAll.value))
  await setPagination({
    total: tableDataAll.value.length
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
    if(item.value==cvencode){
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
  if (null == str) return  '';
  userList.value.forEach(item=>{
    if(item.id == user){
      str = item.realName
    }
  })
  return str
}

function formatCinvode(cinvode,k){
  let str = cinvode
  if (null == str) return  '';
    stockList.value.forEach(item=>{
    if (item.stockNum == cinvode){
      str = item[k]
    }
  })
  return str
}

function formatCunitid(cinvode,k){
  let str = k
  if (null == str) return  '';
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
  selectList: []
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
  indexColumnProps:{fixed: true},
  pagination: {
    pageSize: 100,
    showSizeChanger: true,
    pageSizeOptions: ['100', '500', '1000'],
    showTotal: t => `总共${t}条数据`
  }
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
onMounted(async() => {
  val.value.openOne = 1
  let path = router.currentRoute?.value?.fullPath
  if (null != path){
    if (path == '/xs-gjList')val.value.mark = '2'
    if (path == '/xs-xsCountUser')val.value.mark = '3'
    if (path == '/xs-xsCountArea')val.value.mark = '4'
  }
  openQueryPage(true, {
    data: val.value
  })
  reloadJiCiList()
})

const startExport = () => {
  
}

const excelDataCode = () => {
  // console.log("导出成功！")
  let list: any = []
  const arrData = tableData.value
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = item.bcheck=='1'?'已审核':'未审核'
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] = item.cvencode==null?'':supplierList.value.filter(aa=>aa.id==item.cvencode).map(aa=>aa.custCode)
    item1[4] = formatCvencode(item.cvencode)
    item1[5] = item.cpersoncode==null?'':psnList.value.filter(aa=>aa.id==item.cpersoncode).map(aa=>aa.psnCode)
    item1[6] = item.cpersoncode==null?'':formatCpersoncode(item.cpersoncode)
    item1[7] = item.cwhcode==null?'':cangkuList.value.filter(aa=>aa.id==item.cwhcode).map(aa=>aa.ckNum)
    item1[8] = formatCwhcode(item.cwhcode)
    item1[9] = item.cinvode
    item1[10] = formatCinvode(item.cinvode)
    item1[11] = formatGgxh(item.cinvode)
    item1[12] = toThousandFilter(item.baseQuantity)
    item1[13] = toThousandFilter(item.icost)
    item1[14] = toThousandFilter(item.isum)
    item1[15] = item.cmemo
    item1[16] = formatUser(item.cmaker)
    item1[17] = item.bcheckUser==null?'':formatUser(item.bcheckUser)
    list.push(item1)
  })
  const sheet:any = [
    {
      title: '采购入库单列表',
      multiHeader: [
        ['状态', '单据日期', '单据编码', '供应商编码', '供应商简称', '业务员编码', '业务员名称', '仓库编码', '仓库名称', '存货编码', '存货名称', '规格型号', '数量','无税金额','价税合计','备注','经手人','审核人']
      ],
      table: list,
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15,16,17],
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
      colWidth: [8, 8, 10, 15, 12, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]
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
  writeExcel(wb, bookType, '销货（退货）单列表_'+pageParameter.companyName)
}

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
    item1[5] = formatCwhcode(item.cwhcode)
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
      title: '采购入库单列表',
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
  writeExcel(wb, bookType, '销货（退货）单列表_'+pageParameter.companyName)
}

const excelDataList = () => {
  // console.log("导出成功！")
  let list: any = []
  const arrData = tableData1.value
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = item.bcheck=='1'?'已审核':'未审核'
    item1[1] = item.ddate
    item1[2] = item.ccode
    item1[3] = formatCvencode(item.cvencode)
    item1[4] = item.cpersoncode==null?'':formatCpersoncode(item.cpersoncode)
    item1[5] = item.cwhcode==null?'':formatCwhcode(item.cwhcode)
    item1[6] = toThousandFilter(item.baseQuantity)
    item1[7] = toThousandFilter(item.icost)
    item1[8] = toThousandFilter(item.isum)
    item1[9] = item.cmemo==null?'':item.cmemo
    item1[10] = formatUser(item.cmaker)
    item1[11] = item.bcheckUser==null?'':formatUser(item.bcheckUser)
    list.push(item1)
  })
  const sheet:any = [
    {
      title: '采购入库单列表',
      multiHeader: [
        ['状态', '单据日期', '单据编码', '供应商简称', '业务员名称', '仓库名称', '数量','无税金额','价税合计','备注','经手人','审核人']
      ],
      table: list,
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,11],
      merges: [],
      sheetName: '采购入库单列表',
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
    // 处理标题格式
    // if (title || title === '') {
    //   // 取表头、多级表头中的最大值
    //   const tHeaderLength = tHeader && tHeader.length || 0
    //   const multiHeaderLength = multiHeader && Math.max(...multiHeader.map(m => m.length)) || 0
    //   const titleLength:any = Math.max(tHeaderLength, multiHeaderLength, keys.length)
    //   // 第一个元素为title，剩余以空字符串填充
    //   title = [title].concat(Array(titleLength - 1).fill(''))
    //   // 处理标题的合并\
    //   const cell = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    //   let mergeSecond = 'A1'
    //   if (titleLength > 26) {
    //     const one = parseInt(titleLength) / 26
    //     const two = titleLength % 26
    //     mergeSecond = cell[one - 1] + cell[two - 1] + '1'
    //   } else {
    //     mergeSecond = cell[titleLength - 1] + '1'
    //   }
    //   const titleMerge = `A1:${mergeSecond}`
    //   if (!merges) {
    //     merges = [titleMerge]
    //   } else {
    //     if (merges.indexOf(titleMerge) === -1) {
    //       merges.push(titleMerge)
    //     }
    //   }
    // }
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
  writeExcel(wb, bookType, '销货（退货）单列表_'+pageParameter.companyName)
}

/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (315) )
const totalColumnWidth = ref(0)

const dynamicColumnModel = ref({value:[]})
const tableRef: any = ref(null)
const lanMuData = ref({
  'accId': '',
  'menuName': '销售统计表',
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

/*明细栏目设置end*/
const formatText = (text) => {
  return text.substring(0,4) +'.'+text.substring(4,7)
}
const replenishTrs = (list) =>{
  assembleTotal(list)
  let l = list.length
  for (let i = 0; i < (25-l); i++) {
    list.push({})
  }
  return list
}
const assembleTotal = (list) => {
  let num = 0
  let ws = 0
  let se = 0
  let js = 0
  let ljck = 0
  let ljtk = 0
  let ljkp = 0
  let ljjk = 0
  for (let o of list) {
    num += parseFloat(o.baseQuantity || '0')
    ws += parseFloat(o.icost || '0')
    se += parseFloat(o.itaxprice || '0')
    js += parseFloat(o.isum || '0')
    ljck += parseFloat(o.isumChuku || '0')
    ljtk += parseFloat(o.isumTuiHuo || '0')
    ljkp += parseFloat(o.isumFapiao || '0')
    ljjk += parseFloat(o.hxIsum || '0')
  }
  summaryTotals.value={baseQuantity: num.toFixed(2),icost: ws.toFixed(2),itaxprice: se.toFixed(2),isum: js.toFixed(2),isumChuku: ljck.toFixed(2),isumTuiHuo: ljtk.toFixed(2),isumFapiao:ljkp.toFixed(2),hxIsum: ljjk.toFixed(2)}
}
const dynamicAdReload = async (obj) => {
    // const dataBase:any = await findDataBase(obj.accId,obj.year)
    return false
    // 底部分页信息
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
function openNewPage(e,type) {
  message.success('两秒后跳转列表！')
  setTimeout(()=>{
    let path = ''
    let query = {}
    if (type == 'mx'){
      path =pageParameter.queryMark=='1'?'/xs-mxgList':'/xs-mxList',
        query = {
          mark: pageParameter.queryMark=='1'?'1':'2',
          periodStart: pageParameter.query.periodStart,periodEnd: pageParameter.query.periodEnd,dateStart: pageParameter.query.dateStart,dateEnd: pageParameter.query.dateEnd,cinvode:pageParameter.queryMark=='1'?stockList.value.filter(it=>it.stockNum == e.cinvode)[0]['id']:'',cvencode:pageParameter.queryMark!='1'?(hasBlank(e.cvencode)?e.cvencodeJs:e.cvencode):''
        }
    }else if(type == 'ck'){
      path = '/kc-xsDepot-list'
    }else if(type == 'th'){
      path = '/xs-dhList'
    }else if(type == 'fp'){
      path = '/xs-fplist'

    }
    router.push({path: path, query: query});
  },2000)
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
  let wsum = 0
  let sum = 0
  let ljck = 0
  let ljth = 0
  let ljkp = 0
  let se = 0
  let jk = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    num+=parseFloat(e['quantity'] || 0)
    numz+=parseFloat(e['baseQuantity'] || 0)
    wsum+=parseFloat(e['icost'] || 0)
    sum+=parseFloat(e['isum'] || 0)
    se+=parseFloat(e['itaxprice'] || 0)
    jk+=parseFloat(e['hxIsum'] || 0)
    ljck+=parseFloat(e['isumChuku'] || 0)
    ljth+=parseFloat(e['isumTuiHuo'] || 0)
    ljkp+=parseFloat(e['isumFapiao'] || 0)
  }
  summaryModel.value={
    quantity: num, baseQuantity: numz, icost: wsum,isum: sum,itaxprice:se,hxIsum:jk,isumChuku:ljck,isumTuiHuo:ljth,isumFapiao:ljkp
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
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  height: 27px;
  font-weight: unset;
  color: black;
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px;
  margin: 10px 10px 0px;
  border-radius: 5px 5px 0 0;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 0 10px;
  background: #b4c8e3 !important;
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
