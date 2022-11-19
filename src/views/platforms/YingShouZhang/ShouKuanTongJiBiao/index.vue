<template>
  <div class="app-container">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>收款统计表的页面</textarea>复制内容快速定位页面</div>-->
    <div class="app-container-top">

      <div class="app-container-head">
        <div class="container-head-title" style="float: left;">
          <b class="noneSpan" style="font-size: 60px;"><BarChartOutlined /></b>
        </div>
        <div class="container-head-title" style="padding-left: 35%;text-align: center;margin-top: 20px;">
          <b class="noneSpan" style="font-size: 26px;">收款统计表</b>
          <div style="font-size: 14px;text-align: center;margin-top: 30px;">
            <span style="font-size: 14px;font-weight: bold;">
              期间：{{ qijian }}
            </span>
          </div>
        </div>
        <div class="ant-btn-group" style="float: right">
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
            @click="printData()"
          ><span>打印</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="margin-top: -30px;margin-left: 80px;">
        <div style="display: inline-block;float: left;margin-left: 1%;margin-top: -20px;">
          <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/>
        </div>

        <div style="float: right; margin-left: 10px">
          <Button class="ant-btn-me">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Popover class="ant-btn-default" placement="bottom">
            <template #content>
              <a-popconfirm
                placement="leftTop"
                ok-text="确定"
                cancel-text="放弃"
                @confirm="confirm"
                @cancel="cancel">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <div style="width: 650px;max-height: 500px;overflow-y: auto;">
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
                  </div>
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
          <Popover placement="bottom">
            <template #content>
                <span class="group-btn-span-special2" @click="bcheck = '';reloadTable()"
                      :style="bcheck===''?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;全部&emsp;&emsp;&emsp;<CheckOutlined v-if="bcheck===''"/></span><br/>
              <span class="group-btn-span-special2" @click="bcheck = '1';reloadTable()"
                    :style="bcheck==='1'?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;已审核&emsp;&emsp;<CheckOutlined v-if="bcheck==='1'"/></span>
              <br/>
              <span class="group-btn-span-special2" @click="bcheck = '0';reloadTable()"
                    :style="bcheck==='0'?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;未审核&emsp;&emsp;<CheckOutlined v-if="bcheck==='0'"/></span>
            </template>
            <Button class="acttdrd-btn">
              <PicLeftOutlined :style="{ fontSize: '14px' }"/>
            </Button>
          </Popover>
        </div>
        <div style="float: right; position: relative">
          <Select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;" class="special_select">
            <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
            <SelectOption style="font-size: 12px;" value="2">供应商简称</SelectOption>
            <SelectOption style="font-size: 12px;" value="3">仓库</SelectOption>
            <SelectOption style="font-size: 12px;" value="4">存货名称</SelectOption>
          </Select>
          <!-- 搜索 -->
          <InputSearch
            placeholder=""
            style="width: 200px; border-radius: 4px"
            @search="onSearch"
          />
        </div>
      </div>

      <div style="clear:both"/>

    </div>
    <div class="app-container-bottom">
      <BasicTable
        ref="tableRef"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable"
        :dataSource="tableData"
        :scroll="{ x: totalColumnWidth,y: windowHeight }"
        :loading="loadMark"
        v-show="typeFlag=='0'"
      >
        <template #cvencode="{ record }">{{formatCvencode(record.cvencode)}}</template>
        <template #cvenName="{ record }">{{formatCvenName(record.cvencode)}}</template>
        <template #isum="{ record }">
          <a v-if="record.isum!=null && record.isum!='' && record.isum!=0" @click="openSkmx(record)">
            {{toThousandFilter(record.isum)}}
          </a>
        </template>
        <template #qichu="{ record }">
          <a v-if="record.qichu!=null && record.qichu!='' && record.qichu!=0" @click="openSkmx(record)">
            {{toThousandFilter(record.qichu)}}
          </a>
        </template>
        <template #hxIdiscount="{ record }">
          <a v-if="record.hxIdiscount!=null && record.hxIdiscount!='' && record.hxIdiscount!=0" @click="openSkmx(record)">
            {{toThousandFilter(record.hxIdiscount)}}
          </a>
        </template>

<!--        <template #footer>
          <div class="nc-summary">
            <div>
              <span>合计</span>
            </div>
            <div>
              <span>已收金额:</span>
              <span>&ensp;{{ toThousandFilter(isum) }}</span>
            </div>
          </div>
        </template>-->
<!--        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
              <TableSummaryCell :index="0" :colSpan="3" :align="'center'" style="background-color: #cccccc;font-weight: bold;">合&emsp;&emsp;计</TableSummaryCell>
              <TableSummaryCell :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(qichu) }}</TableSummaryCell>
              <TableSummaryCell :index="4" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(isum) }}</TableSummaryCell>
              <TableSummaryCell :index="5" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(hxIdiscount)}}</TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>-->
        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
              <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合计</TableSummaryCell>
              <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()" :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':toThousandFilter(summaryModel[cell.dataIndex])}}</span></TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
      <div class="pagination-text" v-show="showPaginationText">
        共 {{paginationNumber}} 条记录&nbsp;&nbsp; 每页 1000 条
      </div>
    </div>
    <Query @save="saveQuery" @register="registerQueryPage"/>
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
  FilterFilled,
  SortDescendingOutlined,
  CheckOutlined,
  SortAscendingOutlined,
  UsbOutlined,
  PrinterOutlined,
  EditOutlined,
  BarChartOutlined
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
  Popconfirm as APopconfirm,
} from 'ant-design-vue'
import {useMessage} from "/@/hooks/web/useMessage";
import {getCurrentAccountName, getThisIndexImg} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
 add,
 div, mul,
 sub,
 toThousandFilter
} from "../YingShouKuanQiChuYuE/calculation";
import Query from './popup/query.vue'
import {findAll as findCustAll} from "/@/api/record/costomer_data/customer";

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
const openQuery = async () => {
  val.value.openOne = 0
  openQueryPage(true, {
    data: val
  })
}

const ddate1 = ref('')
const ddate2 = ref('')
const cvencode = ref('')
const qijian = ref('')
async function saveQuery(data) {
  dynamicTenantId.value = data.dynamicTenantId
  defaultAdName.value = data.defaultAdName
  pageParameter.year = data.year
  ddate1.value = data.ddate1
  ddate2.value = data.ddate2
  cvencode.value = data.cvencode
  bcheck.value = data.bcheck
  if (ddate1.value==null || ddate1.value==''){
    ddate1.value = pageParameter.year+'-01-01'
  }
  if (ddate2.value==null || ddate2.value==''){
    ddate2.value = pageParameter.year+'-12-31'
  }
  qijian.value = data.ddate1.replace(/-/g, '.') + " - " + data.ddate2.replace(/-/g, '.')
  await reloadList()
  await reloadTable()
}

const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const showPaginationText = ref(false)
const paginationNumber = ref(0)

const summaryModel: any = ref({})

const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const bcheck:any = ref('')
const loadMark = ref(false)
const isum:any = ref(0)
const qichu:any = ref(0)
const hxIdiscount:any = ref(0)
async function reloadTable(){
  loadMark.value = true
  showPaginationText.value = false
  let len = 0
  tableData.value = []
  tableDataAll.value = []
  if (ddate1.value==null || ddate1.value==''){
    ddate1.value = pageParameter.year+'-01-01'
  }
  if (ddate2.value==null || ddate2.value==''){
    ddate2.value = pageParameter.year+'-12-31'
  }
  const res = await useRouteApi(findSkdtjbList,{schemaName: dynamicTenantId})({bcheck:bcheck.value,ddate1:ddate1.value,ddate2:ddate2.value})
  const res1 = await useRouteApi(findSkdYueList,{schemaName: dynamicTenantId})({iyear:pageParameter.year,bcheck:bcheck.value})
  let list:any = []
  customerList.value.forEach(item=>{
    res1.forEach(item1=>{
      if(item.id==item1.cvencodeJs){
        item.cvencode = item1.cvencodeJs
        item.cvenName = item1.cvencodeJs
        item.qichu = item1.isumBenbi
      }
    })
    list.push(item)
  })
  list.forEach(item=>{
    res.forEach(item1=>{
      if (item.id==item1.cvencode) {
        if (item.cvencode==null || item.cvencode=='') {
          item.cvencode = item1.cvencode
          item.cvenName = item1.cvencode
        }
        item.isum = item1.isum
        item.hxIdiscount = item1.hxIdiscount
      }
    })
    return list
  })
  tableDataAll.value = list.filter(item=>(item.isum!=null && item.isum!='' && item.isum!=0) || (item.qichu!=null && item.qichu!='' && item.qichu!=0))
  tableData.value = tableDataAll.value
  let num = 50-(tableDataAll.value.length%50)
  for (let i=0;i<num;i++){
    tableData.value.push({})
  }
  await setPagination({
    total: tableData.value.length
  })
  countTable()
  calculateTotal()
  len = tableData.value.filter(item => item.cvencode != null && item.cvencode != '').length
  paginationNumber.value = len
  showPaginationText.value = true
  loadMark.value = false
}

function countTable(){
  qichu.value = 0
  isum.value = 0
  hxIdiscount.value = 0
  tableData.value.map(item=>{
    qichu.value = add(qichu.value,item.qichu==null?'0':item.qichu)
    isum.value = add(isum.value,item.isum==null?'0':item.isum)
    hxIdiscount.value = add(hxIdiscount.value,item.hxIdiscount==null?'0':item.hxIdiscount)
    return item
  })
}

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

const customerList:any = ref([])
async function reloadList() {
  const res2 = await useRouteApi(findCustAll,{schemaName: dynamicTenantId})(parameter)
  customerList.value = res2.items
}

const CrudApi = {
  columns: [
    {
      title: '结算客户编码',
      dataIndex: 'cvencode',
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvencode'}
    },
    {
      title: '结算客户名称',
      dataIndex: 'cvenName',
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cvenName'}
    },
    {
      title: '期初余额',
      dataIndex: 'qichu',
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'qichu'}
    },
    {
      title: '收款金额',
      dataIndex: 'isum',
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'isum'}
    },
    {
      title: '折扣金额',
      dataIndex: 'hxIdiscount',
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'hxIdiscount'}
    },
  ]
}

function formatCvencode(cvencode){
  let str = cvencode
  customerList.value.forEach(item=>{
    if(item.id==cvencode){
      str = item.custCode
    }
  })
  return str
}

function formatCvenName(cvencode){
  let str = cvencode
  customerList.value.forEach(item=>{
    if(item.id==cvencode){
      str = item.custName
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
  getPaginationRef,
  getColumns,
  setColumns
}] = useTable({
  // api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  indexColumnProps:{ fixed:true },
  pagination: {
    pageSize: 1000,
    // showSizeChanger: false,
    simple:true,
    showTotal: t => `共${t}条记录    每页200条`
  },
  /*pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },*/
  /*actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: {customRender: 'action'}
  }*/
})

//打开收款明细
function openSkmx(data){
  // console.log(data)
  router.push({
    path: '/YingShouZhang/ZhangBiao/ZhangBiaoMingXi/ShouKuanMingXiZhang',
    query: {
      dynamicTenantId:dynamicTenantId.value,
      defaultAdName:defaultAdName.value,
      year:pageParameter.year,
      ddate1:ddate1.value,
      ddate2:ddate2.value,
      cvencode:data.cvencode,
      bcheck:bcheck.value
    }
  })
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
  resetDynamicColumnData()
  openQueryPage(true, {
    data: {
      openOne: 1
    }
  })
})

//打印
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
function printData(){
  // console.log("打印成功！")
  loadMark.value = true
  let printList: any = []
  const arrData = tableDataAll.value.filter(item=>item.cvencode!=null && item.cvencode!='')
  arrData.forEach(item=>{
    let item1 = {}
    item1[0] = formatCvencode(item.cvencode)
    item1[1] = formatCvenName(item.cvenName)
    item1[2] = item.isum==null?'':item.isum==0?'':toThousandFilter(item.isum)
    printList.push(item1)
  })
  let a = 41-printList.length%41
  for (let i=0; i<a; i++){
    if (i==a-1) {
      let item1 = {}
      item1[0] = '合计'
      item1[1] = ''
      item1[2] = isum.value==null?'':isum.value==0?'':toThousandFilter(isum.value)
      printList.push(item1)
    } else {
      let item1 = {}
      item1[0] = ''
      item1[1] = ''
      item1[2] = ''
      printList.push(item1)
    }
  }
  let num = Math.ceil(printList.length/41)
  useNewPrint({data: ['p', 'px', 'a4', true]}, (doc) => {
    loadMark.value = false
    doc.autoTable({
      head: [['收款统计表','', ''],
        ['单位：'+pageParameter.companyName, '期间：'+qijian.value,''],
        ['结算客户编码', '结算客户名称','已收金额']
      ],
      body: printList,
      // startY: 60,
      styles: tableStyle(),
      margin: {
        left: 30,
        top: 20,
      },
      addPageContent: (data) => {
        //data.table.finalY 表格最大可容纳y轴坐标，超出时将根据设置决定是否另取一页.在页面需要分页时出现
        let tabHeigth = data.table.height,
          tabMarginTop = data.settings.margin.top,
          tabSize = data.table.finalY - tabMarginTop,//表格最大Y轴-表格顶部距离得到每页表格的最大值
          tabMarginLeft = data.settings.margin.left;
        if (data.table.finalY)//是否分页 有分页时才有该属性finalY
          if (data.pageNumber != Math.ceil(tabHeigth / tabSize)) return;//如果需要每一页都显示页尾则注释该行代码
        //data.cursor.y ,data.cursor.x:表格最后一个单元坐标
        data.doc.setFontSize(9)
        // data.doc.setFont('fuhuiR', 'bold')
        /*doc.autoTableText(
          '核算单位：'+pageParameter.companyName,
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );*/
        doc.autoTableText(
          '第'+data.doc.getCurrentPageInfo().pageNumber+'页/共'+num+'页',
          // '第'+data.doc.getCurrentPageInfo().pageNumber+'页',
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
        // data.cell.styles.bold = false

        if (data.section == 'head' && data.row.index == 0) {

          data.cell.styles.fontSize = 20
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            data.cell.colSpan = 9
            data.cell.styles.halign = 'center'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 0) {
            // data.cell.colSpan = 2
            data.cell.styles.halign = 'left'
          } else if (data.column.index == 1) {
            data.cell.styles.halign = 'center'
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
            data.cell.styles.fillColor = [240, 240, 240]
          }
        }
      },
      columnStyles: {
        0: {maxHeight: 10, cellWidth: 110, halign: 'left'},
        1: {cellWidth: 160, halign: 'left'},
        2: {cellWidth: 110, halign: 'right'},
      }
    })
  })
}

//导出
import {
  defaultV,
  sheet_from_array_of_arrays,
  Workbook,
  writeExcel
} from "/@/utils/boozsoft/excel/excel2";
import XLSX from "xlsx-js-style";
const excelData = () => {
  // console.log("导出成功！")
  const arrData = tableDataAll.value.filter(item=>item.cvencode!=null && item.cvencode!='')
  arrData.forEach(item=>{
    item.cvencode = formatCvencode(item.cvencode)
    item.cvenName = formatCvenName(item.cvenName)
    item.isum = item.isum==null?'':toThousandFilter(item.isum)
  })
  const sheet:any = [
    {
      title: '收款统计表',
      multiHeader: [
        ['单位：'+pageParameter.companyName, '','期间：'+qijian.value],
        ['结算客户编码', '结算客户名称','已收金额']
      ],
      table: arrData,
      keys: ['cvencode', 'cvenName', 'isum'],
      merges: ['A2:B2'],
      sheetName: '收款统计表',
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
      colWidth: [20, 50, 22]
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
          } else if (i.substring(1) == '3') {
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
          } else if (i.substring(0, 1) == 'A' || i.substring(0, 1) == 'B'
            || i.substring(0, 1) == 'E' || i.substring(0, 1) == 'H'
            || i.substring(0, 1) == 'I' || i.substring(0, 1) == 'J') {
            dataInfo[i.toString()].s = {
              border: border === {} ? border : border || globalStyle.border,
              font: font || globalStyle.font,
              fill: fill || globalStyle.fill,
              alignment: {
                horizontal: "left",
              }
            }
          } else if (i.substring(0, 1) == 'C') {
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
  writeExcel(wb, bookType, '收款统计表_'+pageParameter.companyName)
}

/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findStockDbLanMuList, saveStockLanMuList} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
import {findYsdtjbList} from "/@/api/record/system/ysd";
import {findSkdtjbList} from "/@/api/record/system/arApYsyf";
import {findSkdYueList} from "/@/api/record/system/arBeginBalance";
/*start栏目设置*/
const visible = ref(false);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (320))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = {
  'accId': '',
  'menuName': '收款统计表',
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
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
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
/*明细栏目设置end*/

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
  await reloadTable()
}

/*** 合计 ***/
const getCurrSummary  = () => {
  return (getColumns().filter((it:any)=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+1;return it;}))
}
const calculateTotal = () => {
  let list = getDataSource()
  if (list.length == 0){
    summaryModel.value = {}
    return false;
  }
  let num1 = 0
  let num2 = 0
  let num3 = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    num1+=parseFloat(e['qichu'] || 0)
    num2+=parseFloat(e['isum'] || 0)
    num3+=parseFloat(e['hxIdiscount'] || 0)
  }
  summaryModel.value={
    qichu: num1,
    isum: num2,
    hxIdiscount: num3,
  }
}
/*** 合计 ***/

</script>
<style src="./global-menu-index.less" lang="less" scoped="scoped"></style>
<style scoped lang="less">
:deep(.vben-basic-table) {
  .ant-table-wrapper {
    .ant-table-measure-row{
      td{
        padding: 0!important;
      }
    }
  }
}

:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}

.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 550;
  color: #000000 !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  font-weight: 550;
  color: #000000 !important;
}

.app-container {
  background-color: #f2f2f2;
  padding: 0px;
  margin: 10px 10px 0;
  position: relative;
  :deep(.pagination-text){
    position: absolute;
    bottom: 6px;
    right: 50%;
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
  margin: 0;
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}

:deep(.nc-summary) {
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  background-color: #cccccc;
  border:none !important;
  border-bottom: 1px solid #000000 !important;

  > div {
    display: inline-block;
    background-color: #d8d8d8;
    padding: 5px;
  }
  > div:nth-of-type(2),> div:nth-of-type(3),> div:nth-of-type(4),> div:nth-of-type(5){
    >span:nth-of-type(1){
      margin-left: 10%;
      float: left;
    }
  }
  > div:nth-of-type(1) {
    width: 23%;
    text-align: center;
  }

  > div:nth-of-type(2) {
    width: 19%;
    margin: 0 1px;
    text-align: right;
  }
  > div:nth-of-type(3) {
    width: 19%;
    text-align: right;
    margin: 0 1px;
  }
  > div:nth-of-type(4) {
    width: 19%;
    margin: 0 1px;
    text-align: right;
  }
  > div:nth-of-type(5) {
    width: 19%;
    margin: 0 1px;
    text-align: right;
  }
}
</style>
