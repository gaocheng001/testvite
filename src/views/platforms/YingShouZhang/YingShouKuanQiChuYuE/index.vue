<template>
  <div>
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>应收款期初余额的页面</textarea>复制内容快速定位页面</div>-->
    <div class="app-container">

      <div class="app-container-head">
        <div class="container-head-title" style="float: left;margin-left: -10px;">
          <b class="noneSpan" style="font-size: 60px;"><TransactionOutlined /></b>
        </div>
        <div class="container-head-title" style="padding-left: 35%;text-align: center;margin-top: 20px;">
          <b class="noneSpan" style="font-size: 26px;">应收款期初余额</b>
          <div style="font-size: 14px;text-align: center;margin-top: 10px;">
            <span style="font-size: 14px;font-weight: bold;color: #666666;">年度：</span>
            <Select v-model:value="pageParameter.year" @change="reloadTable()" placeholder="年度" style="width: 100px;text-align: center;">
              <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
              <SelectOption v-for="item in yearList" :key="item.stockYear" :value="item.stockYear">
                {{ item.stockYear }}
              </SelectOption>
            </Select>
          </div>
        </div>
        <div class="ant-btn-group" style="float: right;margin-right: 10px;">
          <button
            style="float: left"
            type="button"
            class="ant-btn ant-btn-me"
            @click="editflg(edittext)"
          ><span>{{ edittext }}</span></button>
          <span v-if="btnShow">
<!--          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openEdit"
          ><span>新增</span></button>-->
            <a-button class="ant-btn ant-btn-me" @click="openJiezhuan()"><span>结转上年</span></a-button>
          <Popover placement="bottom">
            <a-button class="ant-btn ant-btn-me"><span>新增</span></a-button>
            <template #content>
              <span class="group-btn-span-special2 p_specifics" @click="openEdit('YSD')">应收单</span><br/>
              <span class="group-btn-span-special2 p_specifics" @click="openEdit('SKD')">收款单</span><br/>
<!--              <span class="group-btn-span-special2 p_specifics" >销售发票</span><br/>-->
            </template>
          </Popover>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="editOpen()"
          ><span>修改</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="delList()"
          ><span>删除</span></button>
          <Popover placement="bottom">
            <a-button class="ant-btn ant-btn-me"><span>审核</span></a-button>
            <template #content>
              <span class="group-btn-span-special2 p_specifics" @click="approved()">审核</span><br/>
              <span class="group-btn-span-special2 p_specifics" @click="unApproved()">弃审</span>
            </template>
          </Popover>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="openExcel"
          ><span>导入</span></button>
          </span>
<!--          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="excelData()"
          ><span>导出</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
          ><span>打印</span></button>-->
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="saveLogData('退出');balanceTaskDel();closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="margin-top: -35px;margin-left: 50px;">
        <div style="display: inline-block;float: left;margin-left: 1%;margin-top: -20px;">
          <AccountPicker theme="three" :readonly="!btnShow" @reloadTable="dynamicAdReload"/>
        </div>

        <div style="float: right; margin-left: 10px;margin-right: 10px;">
          <Button class="ant-btn-me" @click="reloadTable">
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
          <Button @click="excelData()">
            <UsbOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <Button class="ant-btn-me">
            <PrinterOutlined :style="{ fontSize: '14px' }"/>
          </Button>
        </div>
        <div style="float: right; position: relative;">
          <Select v-model:value="formItems.selectType" style="width: 150px;font-size: 12px;border: 1px solid #c9c9c9;" class="special_select">
            <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
            <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
            <SelectOption style="font-size: 12px;" value="2">供应商简称</SelectOption>
            <SelectOption style="font-size: 12px;" value="3">仓库</SelectOption>
            <SelectOption style="font-size: 12px;" value="4">存货名称</SelectOption>
          </Select>
          <!-- 搜索 -->
          <InputSearch
            placeholder=""
            style="width: 150px; border-radius: 4px;font-size: 12px;"
            @search="onSearch"
          />
        </div>
        <div style="clear:both"/>
      </div>

    </div>
    <div class="app-container">
      <div class="temp">
      <BasicTable
        ref="tableRef"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys,getCheckboxProps:rowSelection.getCheckboxProps, onChange: onSelectChange }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable"
        :dataSource="tableData"
        :scroll="{ x: totalColumnWidth,y: windowHeight }"
        :loading="loadMark"
        @selection-change="selectionChange"
        @row-click="rowClick"
      >
        <template #bcheck="{ record }">
          <span v-if="record.bcheck!='' && record.bcheck!=null">
            <Tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
              {{ record.bcheck === '1' ? '已审核' : '未审核' }}
            </Tag>
          </span>
        </template>
        <template #arStyle="{ record }">{{formatArStyle(record.arStyle)}}</template>
        <template #cvencodeXs="{ record }">{{formatCvencode(record.cvencodeXs)}}</template>
        <template #cvencodeJs="{ record }">{{formatCvencode(record.cvencodeJs)}}</template>
        <template #cmakerId="{ record }">{{formatCpersoncode(record.cmakerId)}}</template>
        <template #cdepcode="{ record }">{{formatCdepcode(record.cdepcode)}}</template>
        <template #citemId="{ record }">{{formatCitemId(record.citemId)}}</template>
        <template #ysIsumBenbi="{ record }">
          <a @click="openShow(record)">{{toThousandFilter(record.ysIsumBenbi=='0'?'':record.ysIsumBenbi)}}</a>
        </template>
        <template #arIsumBenbi="{ record }">
          <a @click="openShow(record)">{{toThousandFilter(record.arIsumBenbi=='0'?'':record.arIsumBenbi)}}</a>
        </template>
        <template #isumBenbi="{ record }">
          <a @click="openShow(record)">{{toThousandFilter(record.isumBenbi=='0'?'':record.isumBenbi)}}</a>
        </template>
        <template #hxStyle="{ record }">
          <span v-if="record.hxStyle=='SKD'">收款单</span>
          <span v-if="record.hxStyle=='FKD'">付款单</span>
        </template>

<!--        <template #footer>
          <div class="nc-summary">
            <div>
              <span>合计</span>
            </div>
            <div>
              <span>收款金额:</span>
              <span>&ensp;{{ toThousandFilter(ysIsumBenbi) }}</span>
            </div>
            <div>
              <span>应收金额:</span>
              <span>&ensp;{{ toThousandFilter(arIsumBenbi) }}</span>
            </div>
            <div>
              <span>期初余额:</span>
              <span>&ensp;{{ toThousandFilter(isumBenbi) }}</span>
            </div>
          </div>
        </template>-->
<!--        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
              <TableSummaryCell :index="0" :colSpan="12" :align="'center'" style="background-color: #cccccc;font-weight: bold;">合&emsp;&emsp;计</TableSummaryCell>
              <TableSummaryCell :index="12" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(ysIsumBenbi)}}</TableSummaryCell>
              <TableSummaryCell :index="13" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(arIsumBenbi)}}</TableSummaryCell>
              <TableSummaryCell :index="14" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(isumBenbi)}}</TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>-->
        <template #summary>
          <TableSummary fixed>
            <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
              <TableSummaryCell class="nc-summary" :index="0" :align="'center'" style="background-color: #cccccc;font-weight: bold;">合</TableSummaryCell>
              <TableSummaryCell class="nc-summary" :index="1" :align="'center'" style="background-color: #cccccc;font-weight: bold;">计</TableSummaryCell>
              <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()" :index="cell.ind" :align="cell.align" style="background-color: #cccccc;font-weight: bold;"><span class="a-table-font-arial">{{null == summaryModel[cell.dataIndex]?'':toThousandFilter(summaryModel[cell.dataIndex])}}</span></TableSummaryCell>
            </TableSummaryRow>
          </TableSummary>
        </template>
      </BasicTable>
      <div class="pagination-text" v-show="showPaginationText">
        共 {{paginationNumber}} 条记录&nbsp;&nbsp; 每页 200 条
      </div>
      </div>
    </div>
    <Edit @save="saveDate" @register="registerEditPage"/>
    <Excel @save="saveExcel" @register="registerExcelPage"/>
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
  BarChartOutlined,
  ProfileOutlined,CalendarOutlined,ShoppingCartOutlined,
  TransactionOutlined,
  CaretDownOutlined
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
import {
 add,
 pad,
 sub,
 toThousandFilter
} from "./calculation";
import Edit from './popup/edit.vue'
import {findAll as findCustAll} from "/@/api/record/costomer_data/customer";

const InputSearch = Input.Search
const SelectOption = Select.Option
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group
const TableSummary = Table.Summary
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

const btnShow = ref(false);
const edittext = ref('编辑');

const [registerEditPage, {openModal: openEditPage}] = useModal()
const val = ref({
  id: null,
  iyear: '',
  lineCode: '',
  ccode: '',
  arStyle: 'YSD',
  busStyle: 'YSD',
  billStyle: 'ar',
  ddate: '',
  cvencodeXs: '',
  cvencodeJs: '',
  citemClass: '',
  citemId: '',
  cdepcode: '',
  cmakerId: '',
  currency: '',
  ysIsumYuanbi: '',
  ysIsumBenbi: '',
  arIsumYuanbi: '',
  arIsumBenbi: '',
  isumYuanbi: '',
  isumBenbi: '',
  bcheck: '0',
  bcheckTime: '',
  bcheckUser: '',
  cmemo: '',
})
const openEdit = async (str) => {
  val.value.busStyle = str
  if(str=='YSD'){
    val.value.arStyle = 'YSD'
  } else {
    val.value.arStyle = 'PTSK'
  }
  val.value.iyear = pageParameter.year
  openEditPage(true, {
    data: val,
    dynamicTenantId: dynamicTenantId.value,
    defaultAdName: defaultAdName.value,
    customerList: customerList.value,
    deptList: deptList.value,
    psnList: psnList.value,
    projectList: projectList.value,
    isState:'0'
  })
}

const openShow = async (record) => {
  val.value.iyear = pageParameter.year
  openEditPage(true, {
    data: record,
    dynamicTenantId: dynamicTenantId.value,
    defaultAdName: defaultAdName.value,
    customerList: customerList.value,
    deptList: deptList.value,
    psnList: psnList.value,
    projectList: projectList.value,
    isState:'2'
  })
}

async function saveDate(data) {
  await useRouteApi(saveBeginBalance,{schemaName: dynamicTenantId})(data)
  await reloadTable()
}

const typeFlag = ref('0')

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)

const summaryModel: any = ref({})

const tableData:any = ref([]);
const tableDataAll:any = ref([]);

const showPaginationText = ref(false)
const paginationNumber = ref(0)

const loadMark = ref(false)
const ysIsumBenbi:any = ref('0')
const arIsumBenbi:any = ref('0')
const isumBenbi:any = ref('0')
async function reloadTable(){
  loadMark.value = true
  showPaginationText.value = false
  let len = 0
  checkRow.value = []
  state.selectedRowKeys = []
  const res = await useRouteApi(findByBillStyleAndIyearOrderByCcode,{schemaName: dynamicTenantId})({billStyle:'ar', iyear:pageParameter.year})
  tableDataAll.value = res.filter(item => item.bdocumStyle!='1')
  tableData.value = tableDataAll.value
  ysIsumBenbi.value = '0'
  arIsumBenbi.value = '0'
  isumBenbi.value = '0'
  tableData.value.forEach(item=>{
    ysIsumBenbi.value = add(ysIsumBenbi.value,item.ysIsumBenbi)
    arIsumBenbi.value = add(arIsumBenbi.value,item.arIsumBenbi)
    isumBenbi.value = add(isumBenbi.value,item.isumBenbi)
  })
  let num = 50-(tableDataAll.value.length%50)
  for (let i=0;i<num;i++){
    tableData.value.push({})
  }
  await setPagination({
    total: tableData.value.length
  })
  calculateTotal()
  len = tableData.value.filter(item=>item.id!=null && item.id!='').length
  paginationNumber.value = len
  showPaginationText.value = true
  loadMark.value = false
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

const psnList:any = ref([])
const deptList:any = ref([])
const customerList:any = ref([])
const projectList:any = ref([])
async function reloadList() {
  psnList.value = await useRouteApi(getPsnList,{schemaName: dynamicTenantId})({})
  deptList.value = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})
  const res2 = await useRouteApi(findCustAll,{schemaName: dynamicTenantId})(parameter)
  customerList.value = res2.items
  projectList.value = await useRouteApi(findAllProject,{schemaName:dynamicTenantId})({})
}

const CrudApi = {
  columns: [
    {
      title: '状态',
      dataIndex: 'bcheck',
      width: 100,
      align: 'left',
      ellipsis: true,
      fixed:true,
      slots: { customRender: 'bcheck' }
    },
    {
      title: '应收类型',
      dataIndex: 'arStyle',
      width: 100,
      align: 'left',
      ellipsis: true,
      fixed:true,
      slots: { customRender: 'arStyle'}
    },
    {
      title: '客户名称',
      dataIndex: 'cvencodeXs',
      width: 150,
      align: 'left',
      ellipsis: true,
      fixed:true,
      slots: { customRender: 'cvencodeXs'}
    },
    {
      title: '结算客户名称',
      dataIndex: 'cvencodeJs',
      width: 150,
      align: 'left',
      ellipsis: true,
      fixed:true,
      slots: { customRender: 'cvencodeJs'}
    },
    {
      title: '业务部门',
      dataIndex: 'cdepcode',
      width: 150,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cdepcode'}
    },
    {
      title: '业务员',
      dataIndex: 'cmakerId',
      width: 100,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'cmakerId'}
    },
    {
      title: '项目',
      dataIndex: 'citemId',
      width: 200,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'citemId'}
    },
    {
      title: '币种',
      dataIndex: 'currency',
      width: 100,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'currency'}
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: 100,
      align: 'left',
      ellipsis: true,
      slots: { customRender: 'ddate'}
    },
    {
      title: '摘要',
      dataIndex: 'cmemo',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'cmemo'}
    },
    {
      title: '收款金额',
      dataIndex: 'ysIsumBenbi',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'ysIsumBenbi'}
    },
    {
      title: '应收金额',
      dataIndex: 'arIsumBenbi',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'arIsumBenbi'}
    },
    {
      title: '期初余额',
      dataIndex: 'isumBenbi',
      width: 150,
      align: 'right',
      ellipsis: true,
      slots: { customRender: 'isumBenbi'}
    },
  ]
}

function formatArStyle(arStyle){
  let str = arStyle
  //XSFP销售发票、YSD应收单、XHD销货单、PTSK普通收款、YSK预收款
  //YSD应收单、SKD收款单
  if (arStyle=='YSD'){
    str = '应收单'
  } else if (arStyle=='SKD'){
    str = '收款单'
  } else if (arStyle=='XSFP'){
    str = '销售发票'
  } else if (arStyle=='XHD'){
    str = '销货单'
  } else if (arStyle=='PTSK'){
    str = '普通收款'
  } else if (arStyle=='YSK'){
    str = '预收款'
  }
  return str
}

function formatCvencode(cvencode){
  let str = cvencode
  customerList.value.forEach(item=>{
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

function formatCdepcode(cdepcode){
  let str = cdepcode
  deptList.value.forEach(item=>{
    if(item.id == cdepcode){
      str = item.deptName
    }
  })
  return str
}

function formatCitemId(citemId){
  let str = citemId
  projectList.value.forEach(item=>{
    if(item.uniqueCode==citemId){
      str = item.projectName
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
  setColumns,
  deleteSelectRowByKey
}] = useTable({
  // api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  indexColumnProps:{ fixed:true },
  /*pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },*/
  pagination: {
    pageSize: 200,
    // showSizeChanger: false,
    simple:true,
    showTotal: t => `共${t}条记录    每页200条`
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
const onSelectChange = (selectedRowKeys,row) => {
  // console.log('selectedRowKeys changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row.filter(item=>item.id!=null)
};

const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled:  record.id==undefined
  }),
};
// 行勾选事件
const editAndDelBtnShow = ref(false);
function selectionChange(a) {
  editAndDelBtnShow.value=a.rows.filter(aa=>aa.bcheck=='1').length>0?true:false
}

function rowClick(a) {
  if(hasBlank(a.id)){
    deleteSelectRowByKey(a.key)
  }
}

async function editflg(text) {
  if(pageParameter.year=='' || pageParameter.year==undefined){
    return createWarningModal({ content: '请先选择年度!' });
  }
  if(text=='编辑'){
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:pageParameter.year,name:'应收款期初余额',method:'编辑'})
    if(taskData.length==0){
      await balanceTaskSave()
    }else{
      // 任务不是当前操作员的
      if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
        return createWarningModal({ content: taskData[0]?.username+'正在编辑应收款期初余额,不能同时进行操作！' });
      }else{
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData[0]?.id)
      }
    }
    /************** 记录操作日志 ****************/
    await saveLogData('编辑')
    /************** 记录操作日志 ****************/
  }else{
    await balanceTaskDel()
    /************** 记录操作日志 ****************/
    await saveLogData('返回')
    /************** 记录操作日志 ****************/
  }
  btnShow.value=text=='编辑'?true:false
  edittext.value=text=='编辑'?'返回':'编辑'
}

async function balanceTaskDel() {
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:pageParameter.year,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收款期初余额',method:'编辑'})
}
async function balanceTaskSave() {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:pageParameter.year,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收款期初余额',method:'编辑',caozuoModule:'ar'})
}
async function saveLogData(optAction) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optRange:'1',
    optModule:'ar',
    optFunction:'应收款期初余额',
    accId:defaultAdName.value,
    optAction:optAction,
    optContent:'操作内容【应收款期初余额】',
  }
  await saveLog(logmap)
}

//打开上年结转菜单
function openJiezhuan() {
  router.push({
    path: '/YingShouKuanQiChuYuEJieZhuan',
    query: pageParameter
  });
}

const editOpen = () => {
  if (checkRow.value.length == 1) {
    if(checkRow.value[0].bcheck=='1'){
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '已审核记录不能进行修改！'
      })
      return false
    } else {
      openEditPage(true, {
        data: checkRow.value[0],
        dynamicTenantId: dynamicTenantId.value,
        defaultAdName: defaultAdName.value,
        customerList: customerList.value,
        deptList: deptList.value,
        psnList: psnList.value,
        isState: '1'
      })
    }
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '警告',
      content: '请选择一条进行编辑！'
    })
  }
}

async function delList() {
  if (checkRow.value.length > 0) {
    let num = 0
    for (let i = 0; i < checkRow.value.length; i++) {
      const item = checkRow.value[i]
      if (item.bcheck == '1') {
        num++
        createErrorModal({
          iconType: 'warning',
          title: '警告',
          content: '已审核记录不能进行删除！'
        })
        return false
      }
    }
    if (num == 0) {
      createConfirm({
        iconType: 'error',
        title: '警告',
        content: '删除后数据将不能恢复，你确认要删除吗?',
        onOk: async () => {
          for (let i = 0; i < checkRow.value.length; i++) {
            const item = checkRow.value[i]
            await useRouteApi(deleteBeginBalanceById, {schemaName: dynamicTenantId})(item.id)
          }
          checkRow.value = []
          state.selectedRowKeys = []
          message.success('删除成功！')
          await reloadTable()
        },
        onCancel: () => {
          return false
        }
      })
    }
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '警告',
      content: '请至少选择一条进行删除！'
    })
  }
}

//审核
async function approved(){
  if (checkRow.value.length > 0) {
    let num = 0
    for (let i = 0; i < checkRow.value.length; i++) {
      const item = checkRow.value[i]
      if (item.bcheck == '1') {
        num++
        createErrorModal({
          iconType: 'warning',
          title: '警告',
          content: '记录已审核，操作无效！'
        })
        return false
      }
    }
    if (num == 0) {
      let dateTime = new_Date()
      for (let i = 0; i < checkRow.value.length; i++) {
        const item = checkRow.value[i]
        item.bcheck = '1'
        item.bcheckDate = dateTime
        item.bcheckUser = useUserStore().getUserInfo['name']
        await useRouteApi(saveBeginBalance, {schemaName: dynamicTenantId})(item)
      }
    }
    state.selectedRowKeys = []
    checkRow.value = []
    await reloadTable()
    return true
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '警告',
      content: '请选择需要审核的内容！'
    })
    return false
  }
}

//取消审核
async function unApproved(){
  if (checkRow.value.length > 0) {
    let num = 0
    for (let i = 0; i < checkRow.value.length; i++) {
      const item = checkRow.value[i]
      if (item.bcheck != '1') {
        num++
        createErrorModal({
          iconType: 'warning',
          title: '警告',
          content: '记录未审核，操作无效！'
        })
        return false
      } else if (item.hxIsum!=null && item.hxIsum!='' && item.hxIsum==0) {
        createErrorModal({
          iconType: 'warning',
          title: '警告',
          content: '此记录已核销，不能进行取消审核！'
        })
        return false
      }
    }
    if (num == 0) {
      for (let i = 0; i < checkRow.value.length; i++) {
        const item = checkRow.value[i]
        item.bcheck = '0'
        item.bcheckDate = ''
        item.bcheckUser = ''
        await useRouteApi(saveBeginBalance, {schemaName: dynamicTenantId})(item)
      }
    }
    state.selectedRowKeys = []
    checkRow.value = []
    await reloadTable()
    return true
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '警告',
      content: '请选择需要取消审核的内容！'
    })
    return false
  }
}

//获取当年月日
function new_Date() {
  let dateTime
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
  let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
  let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
  let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
  let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
  dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
  // console.log(dateTime)
  return dateTime
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
  arHexiaoAuto: '',
  arSourceFlag: '',
  arCheckFlag: '',
})

function onSearch() {
}

const defaultPage = ref(false)
onMounted(async() => {
  resetDynamicColumnData()
})

//导入
import Excel from './popup/excel.vue'
const [registerExcelPage, { openModal: openExcelPage }] = useModal()
const openExcel = async () => {
  await saveLogData('导入')
  openExcelPage(true, {
    dynamicTenantId: dynamicTenantId.value,
    customerList: customerList.value,
    deptList: deptList.value,
    psnList: psnList.value,
    year: pageParameter.year
  })
}

async function saveExcel(data) {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    item.ccode = await generateCode(item.arStyle)
    await useRouteApi(saveBeginBalance,{schemaName: dynamicTenantId})(item)
  }
  await reloadTable()
}

async function generateCode(arStyle) {
  let code=''
  let qz = ''
  if (arStyle=='YSD'){
    qz = 'YS-'
  } else if (arStyle=='XHD'){
    qz = 'SA-'
  } else if (arStyle=='XSFP'){
    qz = 'SB-'
  } else if (arStyle=='PTSK'){
    qz = 'SK-'
  } else if (arStyle=='YSK'){
    qz = 'SK-'
  }
  //日期(年月)
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
  let str = qz + yy + mm + '-'
  const ysyf = await useRouteApi(findBukongCcode,{schemaName: dynamicTenantId})({
    num:4,
    sum:14,
    qzNum:10,
    qianzhui:str
  })
  if (ysyf.ccode != null && ysyf.ccode != ''){
    code = str + pad(ysyf.ccode, 4)
  } else {
    code = str + '0001'
  }
  return code
}

//导出
import {
  defaultV,
  sheet_from_array_of_arrays,
  Workbook,
  writeExcel
} from "/@/utils/boozsoft/excel/excel2";
import XLSX from "xlsx-js-style";
const excelData = async () => {
  // console.log("导出成功！")
  await saveLogData('导出')
  const arrData = tableData.value
  arrData.forEach(item=>{
    item.arStyle = formatArStyle(item.arStyle)
    item.cvencodeJs = formatCvencode(item.cvencodeJs)
    item.cvencode = formatCvencode(item.cvencode)
    item.hxIsum = item.hxIsum==null?'0.00':toThousandFilter(item.hxIsum)
    item.isum = item.isum==null?'0.00':toThousandFilter(sub(item.isum,item.hxIsum))
    item.hxMoney = item.hxMoney==null?'':toThousandFilter(item.hxMoney)
    item.hxStyle = item.hxStyle==null?'':'收款单'
    item.hxDate = item.hxDate==null?'':item.hxDate
    item.hxCode = item.hxCode==null?'':item.hxCode
    item.idiscount = item.idiscount==null?'':toThousandFilter(item.idiscount)
  })
  const sheet:any = [
    {
      title: '应收款期初余额',
      multiHeader: [
        ['单据类型', '单据日期','单据编码', '结算客户名称', '客户名称', '核销金额', '余额', '核销单据类型', '核销单据日期', '核销单据编号','核销金额','折扣金额'],
        ['应收类型','单据编码','客户名称','结算客户名称','业务部门','业务员','币种','单据日期','金额','摘要']
      ],
      table: arrData,
      keys: ['billStyle', 'ddate', 'ccode', 'cvencodeJs', 'cvencode', 'hxIsum', 'isum', 'hxStyle', 'hxDate', 'hxCode','hxMoney','idiscount'],
      merges: ['A2:D2','F2:H2'],
      sheetName: '应收款期初余额',
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
      colWidth: [10, 10, 10, 15, 15, 15, 15, 15, 15, 15, 15, 15]
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
          } else if (i.substring(0, 1) == 'F' || i.substring(0, 1) == 'G' || i.substring(0, 1) == 'K' || i.substring(0, 1) == 'L') {
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
  writeExcel(wb, bookType, pageParameter.year+'年_应收款期初余额_'+pageParameter.companyName)
}

/**********************明细栏目设置**********************/
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {findStockDbLanMuList, saveStockLanMuList} from "/@/api/record/system/stock-column-view-settings";
import {cloneDeep} from "lodash-es";
import {getPsnList} from "/@/api/record/system/psn";
import {findDeptByFlag} from "/@/api/record/system/dept";
import {
  deleteBeginBalanceById,
  findAll, findBukongCcode, findByBillStyleAndIyearOrderByCcode, findYearByUniqueCode,
  saveBeginBalance
} from "/@/api/record/system/arBeginBalance";
import {findByStockAccId, findByStockAccountAccId} from "/@/api/record/system/stock-account";
import {findAllProject} from "/@/api/record/system/project";
import {
  getByStockBalanceTask, stockBalanceTaskDelByUserName,
  stockBalanceTaskEditNewTime, stockBalanceTaskSave
} from "/@/api/record/stock/stock_balance";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
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
  'menuName': '应收款期初余额',
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

const yearList:any = ref({})
async function reloadYear() {
  const account = await findByStockAccountAccId(defaultAdName.value)
  const res = await findYearByUniqueCode(account.id)
  yearList.value = res
  // console.log(yearList.value)
  if (res.length>0 && (pageParameter.year=='' || pageParameter.year==undefined)) {
    pageParameter.year = res[0].stockYear
  }
}

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

  const res = await findByStockAccId(obj.accId)
  pageParameter.arHexiaoAuto = res.arHexiaoAuto
  pageParameter.arSourceFlag = res.arSourceFlag
  pageParameter.arCheckFlag = res.arCheckFlag

  useAccountPickerCache().set(obj)

  await reloadList()
  await reloadTable()
  await reloadYear()
}

/*** 合计 ***/
const getCurrSummary  = () => {
  return (getColumns().filter((it:any)=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
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
    num1+=parseFloat(e['ysIsumBenbi'] || 0)
    num2+=parseFloat(e['arIsumBenbi'] || 0)
    num3+=parseFloat(e['isumBenbi'] || 0)
  }
  summaryModel.value={
    ysIsumBenbi: num1,
    arIsumBenbi: num2,
    isumBenbi: num3
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
  //font-weight: 550;
  color: #000000 !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
  //font-weight: 550;
  color: #000000 !important;
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
  /*position: relative;
  :deep(.pagination-text){
    position: absolute;
    bottom: 6px;
    right: 30%;
    font-size: 13px;
    color: black;
    z-index: 99999999;
  }*/
}

.temp{
  position: relative;
  .pagination-text {
    position: absolute;
    bottom: 6px;
    right: 30%;
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
    width: 39%;
    text-align: center;
  }

  > div:nth-of-type(2) {
    width: 20%;
    margin: 0 1px;
    text-align: right;
  }
  > div:nth-of-type(3) {
    width: 20%;
    text-align: right;
    margin: 0 1px;
  }
  > div:nth-of-type(4) {
    width: 20%;
    margin: 0 1px;
    text-align: right;
  }
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}
:deep(.ant-select){
  border: none;
}
</style>
