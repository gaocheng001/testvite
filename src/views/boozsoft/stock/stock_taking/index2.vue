<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <ProfileOutlined style="color: #0096c7;font-size: 60px;"/>
        </div>
        <div> <AccountPicker theme="three" readonly @reloadTable="dynamicAdReload"/></div>
      </div>
      <div>
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">盘点单列表</b></div>
        <div><span style="font-size: 14px;font-weight: bold;"><span style="  font-weight: bold;color: #666666;">日期：</span>{{ strDate }} - {{ endDate }}</span></div>
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
            ant-click-animating-without-extra-node="false"
            @click="openAddPage()"
          ><span>新增</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="openEdit()"
          ><span>修改</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="delList()"
          ><span>删除</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="toAudit()"
          ><span>审核</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            ant-click-animating-without-extra-node="false"
            @click="toAuditBack()"
          ><span>弃审</span></button>
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent(),router.push('/zhongZhang/home/welcome')">
            <span>退出</span></button>
        </div>
        <div>
            <a-button class="ant-btn-me">
              <SyncOutlined :style="{ fontSize: '14px' }" @click="reloadCurrentPage()"/>
            </a-button>
            <a-popover class="ant-btn-default" placement="bottom">
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
              <a-button>
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </a-button>
            </a-popover>
        </div>
      </div>
    </div>
    <div class="app-container" style="width:80%;">
      <Edit @save="saveData" @register="registerEditPage"/>
      <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
      <BasicTable
        v-if="activeKey"
        ref="tableRef"
        :dataSource="tableData"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        @row-click="condClick"
        :scroll="{ y: windowHeight }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        @register="registerTable"
      >
        <template #status="{ record }">
          <span>
            <a-tag v-if="record.status === '1'" color="green">开始中</a-tag>
            <a-tag v-if="record.status === '2'" color="blue">已结束</a-tag>
            <a-tag v-if="record.status === '0'" color="orange">未开始</a-tag>
          </span>
        </template>


        <template #ccode="{ record }">
          <span>
            <a  @click="toMxPage(record)" >{{ record.ccode }}</a>
          </span>
        </template>

        <template #bcheck="{ record }">
            <span>
              <a-tag :color="record.id != null? (record.bcheck === '1' ? 'green' : 'volcano'):'white'">
                {{ record.id != null ? (record.bcheck === '1' ? '审核' : '未审核') : '' }}
              </a-tag>
            </span>
        </template>

        <template #activityCode="{ record }">
          <span>
            <a  @click="openListsPage(record)" >{{ record.activityCode }}</a>
          </span>
        </template>

        <template #bstyle="{ record }">
          <span> {{ fomartStyle(record.id,record.bstyle)}}</span>
        </template>

        <template #ddate="{ record }">
          <span> {{ fomartDate(record.ddate) }}</span>
        </template>

        <template #action="{ record }">
        <div>
          <RightCircleTwoTone @click="toMxPage(record)" v-if="record.id != null "/>
        </div>
      </template>
      </BasicTable>

      <div class="pagination-text"  v-show="showPaginationText">
        {{`共 ${paginationNumber} 条记录   &nbsp;&nbsp;每页 200 条`}}
      </div>
      <Query @save="saveQuery" @register="registerQueryPage"/>
    </div>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {
  findSettModesAll,
  findSettModesByFlag,
  deleteSettModes,
  getCkPriceList,
  saveSettModes,
  editSettModes,
  excelVoucherType,
  editFlag,
  audit,
  auditBack,
  auditCheck,getDataInfo
} from '/@/api/record/stock/stock_taking'
import {getCurrentAccountName, getThisIndexImg, hasBlank} from "/@/api/task-api/tast-bus-api";
import {BasicTable, useTable} from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
import Edit from './popup/edit.vue'
import Query from './popup/query.vue'

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
  CheckOutlined,
  SortDescendingOutlined,ProfileOutlined,
  UnorderedListOutlined,
  RightCircleTwoTone,
  SortAscendingOutlined
} from '@ant-design/icons-vue'
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput,
  Popover as APopover,
  Switch as ASwitch,
  Radio as ARadio,
  Upload as AUpload,
  List as AList,
  Row as ARow,
  Menu as AMenu,
  message,
  Tag as ATag
} from "ant-design-vue"
import {columnProps} from "ant-design-vue/es/table/interface";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {findByAccId, findDataBase} from "/@/api/record/system/account";
import {findAllCustomerClass} from "/@/api/record/system/customer_class";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {aoaToSheetXlsx} from "/@/components/Excel";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {tableStyle} from "/@/store/modules/abc-print";
import { Loading } from '/@/components/Loading';
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {findByStockPeriodIsClose} from "/@/api/record/stock/stock-ruku";
import {
  findByIyearAndCaozuoModule,
  getByStockBalanceTask,
  stockBalanceTaskEditNewTime, stockBalanceTaskSave, stockTaskDelById
} from "/@/api/record/stock/stock_balance";
import {getPYRKDAndNoBcheck1} from "/@/api/record/system/stock-wareh";
import moment from "moment";

const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const AListItem = AList.Item
const AMenuItem = AMenu.Item
const {closeCurrent} = useTabs(router);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (300))
const showPaginationText = ref(false)
const paginationNumber = ref(0)
const {
  createConfirm,
  createWarningModal
} = useMessage()
const compState = reactive({
  absolute: false,
  loading: false,
  tip: '加载中...',
});
function openCompFullLoading() {
  openLoading(false);
}
function openLoading(absolute: boolean) {
  compState.absolute = absolute;
  compState.loading = true;
}
const database = ref(getCurrentAccountName(true));
const accId = ref(getCurrentAccountName(false));
const CrudApi = {
  /*list: useRouteApi(findSettModesAll,{schemaName: database}),*/
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      defaultHidden: true,
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'bcheck',
      width: '10%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'bcheck'}
    },
    {
      title: '单据日期',
      dataIndex: 'ddate',
      width: '15%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'ddate'}
    },

    {
      title: '单据编号',
      dataIndex: 'ccode',
      width: '25%',
      align: 'left',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'ccode'}
    },
    {
      title: '盘点仓库',
      dataIndex: 'cname',
      width: '25%',
      align: 'left',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      width: '15%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'startDate'}
    },
    {
      title: '结束日期',
      dataIndex: 'stopDate',
      width: '15%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },
    {
      title: '盘点范围',
      dataIndex: 'bstyle',
      width: '15%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'bstyle'}
    },
    {
      title: '盘点部门',
      dataIndex: 'dname',
      width: '25%',
      align: 'left',
      ellipsis: true,
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
    },
   {
      title: '盘点人',
      dataIndex: 'puname',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },
    {
      title: '库管员',
      dataIndex: 'kuname',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },
    {
      title: '审核人',
      dataIndex: 'buname',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },


  ],
  editData: {
    id: '',
    settModesCode: '',
    settModesName: ''
  }
}

// 这是示例组件
const [registerTable, { reload,getDataSource,setTableData,setColumns,getColumns,getPaginationRef,setPagination }] = useTable({
  /*api: CrudApi.list,*/
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 200,
    simple: true,
  },
})
const [registerEditPage, { openModal: openEditPage }] = useModal()
const val = {
  id: '',
  settModesCode: '',
  settModesName: '',
  database: '',
  iyear: '',
  obj:{
    startDate: '',
    stopDate: '',
    bstyle: '',
    cdepcode: '',
    pdUserid: '',
    kgUserid: '',
    cwhcode: '',
    iyear: '',
  }
}

onMounted(async() => {
  val2.value.openOne = 1
  openQueryPage(true, {
    data: val2,
  })
})

const condClick = (data:any, e:any) => {

}


const openAddPage = async() => {
  //新增校验
  let date1:any = useCompanyOperateStoreWidthOut().getLoginDate
  //  1 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date1.split('-')[0],month:date1.split('-')[1]})
  console.log('入库单操作：1--->日期是否已结账-->'+temp)
  if(temp>0){
    return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
  }
  //  2 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:iyear.value,name:'月末结账',method:'月末结账'})
  console.log('入库单操作：2--->结账操作-->'+jzMethod)
  if(!hasBlank(jzMethod)){
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  //  3 库子是否锁定-测试
  let taskList = await useRouteApi(findByIyearAndCaozuoModule, { schemaName: dynamicTenantId })({iyear:iyear.value,caozuoModule:'stock'})
  let d =  taskList.find(v=>v.functionModule.includes('库'))
  if(!hasBlank(d)){
    return message.error('提示：当前存在库字单据正在进行操作，不能进行单据盘点操作，请销后再试！')
  }

  val.database = database.value
  val.iyear = iyear.value
  openEditPage(true, {
    data: val
  })
}
const openEdit = async() => {
  if (checkRow.value.length == 1) {
    //已审核不能修改
    if(checkRow.value[0].bcheck ==='1'){
      message.error("已审核单据不能修改！")
      return
    }

    //新增校验
    let date1:any = useCompanyOperateStoreWidthOut().getLoginDate
    //  1 日期是否已结账
    let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date1.split('-')[0],month:date1.split('-')[1]})
    console.log('入库单操作：1--->日期是否已结账-->'+temp)
    if(temp>0){
      return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
    }
    //  2 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:iyear.value,name:'月末结账',method:'月末结账'})
    console.log('入库单操作：2--->结账操作-->'+jzMethod)
    if(!hasBlank(jzMethod)){
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }
    //  3 库子是否锁定-测试
    let taskList = await useRouteApi(findByIyearAndCaozuoModule, { schemaName: dynamicTenantId })({iyear:iyear.value,caozuoModule:'stock'})
    let d =  taskList.find(v=>v.functionModule.includes('库'))
    if(!hasBlank(d)){
      return message.error('提示：当前存在库字单据正在进行操作，不能进行单据盘点操作，请销后再试！')
    }

    checkRow.value[0].isEdit = true
    val.database = database.value
    val.obj =checkRow.value[0]
    openEditPage(true, {
      data: val,
      obj: checkRow.value[0]
    })
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '编辑',
      content: '请选择一条进行编辑！'
    })
  }
}
const del = async(data:any) => {
  await useRouteApi(deleteSettModes,{schemaName: database})(data)
  await reloadCurrentPage()
  message.success('删除成功！')
  checkRow.value = []
  state.selectedRowKeys = []
}
const activeKey = ref(true)

const cardList:any = ref({})
const tableData:any = ref([]);
async function reloadCurrentPage() {
  let v =  await useRouteApi(findSettModesAll,{schemaName: database})(pageParameter)
  paginationNumber.value = v.length
  if(v.length < 50){
    let s = 50-v.length
    for (let i = 0; i < s; i++) {
      v.push({})
    }
  }
  tableData.value =  v
  setPagination({
    total: tableData.value.length
  })
  showPaginationText.value = true
}


async function saveData(data: any) {
  data.cmaker = useUserStoreWidthOut().getUserInfo.id
  data.iyear = iyear.value
  data.rkBcheck = dynamicTenant.value.target?.kcCgrkCheck
  data.ckBcheck = dynamicTenant.value.target?.kcXsckCheck
  compState.loading = true
  let a
  if(data.isEdit==false){
    a = await useRouteApi(saveSettModes,{schemaName: database})(data)
  }else{
    a = await useRouteApi(editSettModes,{schemaName: database})(data)
  }
  await reloadCurrentPage()
  /************** 记录操作日志 ****************/
  saveLogData(data.isEdit==false?'新增':'新增',a)
  /************** 记录操作日志 ****************/
  /************** 锁定任务 ****************/
  if(data.isEdit==false){
    //tempTaskSave('新增',a)
  }
  /************** 锁定任务 ****************/
  compState.loading = false
  checkRow.value = []
  state.selectedRowKeys = []
}

async function editFlagData(data: any) {
  await useRouteApi(editFlag,{schemaName: database})(data)
  checkRow.value = []
  state.selectedRowKeys = []
}

//选中内容
type Key = columnProps['id'];

const state = reactive<{
  selectedRowKeys: Key[];
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
const editOpen = () => {
  if (checkRow.value.length == 1) {
    checkRow.value[0].isEdit = true
    openEditPage(true, {
      data: checkRow.value[0]
    })
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '编辑',
      content: '请选择一条进行编辑！'
    })
  }
}

async function delList() {
  if (checkRow.value.length > 0) {
    createConfirm({
      iconType: 'error',
      title: '警告',
      content: '删除后数据将不能恢复，你确认要删除吗?',
      onOk: async () => {
        compState.loading = true
        for (let i = 0; i < checkRow.value.length; i++) {
          const item = checkRow.value[i]
          //验证数据完整性
          let da = checkData(checkRow.value[i].ccode)
          if(da.id){
            message.error("单据异常不能删除！")
            return
          }
          //已审核不能修改
          if(da.bcheck ==='1'){
            message.error("已审核单据不能删除！")
            return
          }
          //已审核不能修改
          if(checkRow.value[i].bcheck ==='1'){
            message.error("已审核单据不能删除！")
            compState.loading = false
            return
          }else{
            await useRouteApi(deleteSettModes,{schemaName: database})(item)
          }
          /************** 记录操作日志 ****************/
          saveLogData('删除',item.ccode)
          /************** 记录操作日志 ****************/
        }
        checkRow.value = []
        state.selectedRowKeys = []
        message.success('删除成功！')
        await reloadCurrentPage()
        compState.loading = false
      },
      onCancel: () => {
        return false
      }
    })
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '删除',
      content: '请选择需要删除的内容！'
    })
  }
}
async function checkData(ccode) {
  let d = await useRouteApi(getDataInfo, {schemaName: dynamicTenantId})(ccode)
  return d
}
function onSearch() {
}

const pageParameter: any = reactive({
  showRulesSize: 'MIN'
})

const accNameAll =  ref(null)
const totalData = ref('0')
const iyear = ref('2022')
const coCode = ref('')
const companyName = ref('')
const dynamicAdReload = async (obj) => {


}
function formatFlag(flag:any) {
  let str = '启用'
  switch (flag) {
    case '1':
      str = '启用'
      break
    case '0':
      str = '停用'
      break
  }
  return str
}
function fomartStyle(id:any, flag:any) {
  let str = ''
  if(id){
    str = '仓库'
    switch (flag) {
      case '1':
        str = '存货分类'
        break
      case '2':
        str = '存货档案'
        break
      case '2':
        str = '存货+批号'
        break
    }
  }
  return str
}
function fomartDate(val:any) {
  if(val){
    return val.split(" ")[0]
  }
  return ""
}

const exportExcelNow = async () => {
  const data = JSON.parse(JSON.stringify(getDataSource()))
  // debugger
  const arrHeader = ['资产组编码', '资产组名称', '状态'];
  const columnList = ['bsCode','bsName','flag']
  data.forEach(v=>{
    v.flag = formatFlag(v.flag )
  })
  const arrData = data.map((item) => columnList.map(column=>item[column]));
  // 保证data顺序与header一致
  aoaToSheetXlsx({
    data: arrData,
    header: arrHeader,
    filename: '资产组.xlsx',
  });
}
//导入Excel
const dynamicTenantId = ref(getCurrentAccountName(true))
const [registerExcelPage, { openModal: openExcelPage }] = useModal()
const openExcel = () => {
  openExcelPage(true, {
    data: {
      dynamicTenantId: dynamicTenantId.value
    }
  })
}
async function saveExcel(data:any) {
  await useRouteApi(excelVoucherType, {schemaName: dynamicTenantId})(data)
  reloadCurrentPage()
}
const [registerPrintPage, {openModal: openPrintPage}] = useModal()
const openPrint = () => {
  openPrintPage(true, {
    data: {
      dynamicTenantId: dynamicTenantId.value,
      defaultAdName: useCompanyOperateStoreWidthOut().getSchemaName,
      year: '2022',
    }
  })
}
const userName = useUserStoreWidthOut().getUserInfo.username
const loadPrint = (obj) => {
  openCompFullLoading()
  const data = JSON.parse(JSON.stringify(getDataSource()))
  let printList: any = []
  let printUser = ''
  if(obj.printUser){
    printUser = '制单人：'+ userName
  }

  let title = '资产组'
  //格式化数据
  data.forEach((item,index) => {
    let item1 = {}
    item1[0] = item.bsCode
    item1[1] = item.bsName
    item1[2] = formatFlag(item.flag)
    printList.push(item1)
  })
  for (let i=0; i<printList.length%40; i++){
    let item1 = {}
    item1[0] = ''
    item1[1] = ''
    item1[2] = ''
    printList.push(item1)
  }
  let num = Math.ceil(printList.length/40)
  useNewPrint({data: ['p', 'px', 'a4', true]}, (doc) => {
    doc.autoTable({
      head: [['', title, ''],
        ['核算单位:'+accNameAll.value, ''],
        ['资产组编码', '资产组名称', '状态']],
      body: printList,
      // startY: 60,
      styles: tableStyle(),
      margin: {
        left: 60,
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
          '核算单位：' ,
          tabMarginLeft,
          data.cursor.y + 3,
          0
        );*/
        doc.autoTableText(
          printUser,
          data.cursor.x/2-25,
          data.cursor.y + 3,
          0
        );
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
        //data.cell.styles.fontStyle = 'bold'

        if (data.section == 'head' && data.row.index == 0) {
          data.cell.styles.fontSize = 20
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          if (data.column.index == 1) {
            data.cell.colSpan = 1
            data.cell.styles.halign = 'center'
          }
        }
        if (data.section == 'head' && data.row.index == 1) {
          data.cell.styles.fontSize = 10
          data.cell.styles.fontStyle = 'bold'
          data.cell.styles.lineColor = [255, 255, 255]
          data.cell.colSpan = 3
          data.cell.styles.halign = 'left'
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
        0: {maxHeight: 10,cellWidth: 70, halign: 'left'},
        1: {cellWidth: 200, halign: 'left'},
        2: {cellWidth: 70, halign: 'center'},
      }
    })
    compState.loading = false
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
//减
function sub(a, b) {
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
  return e = Math.pow(10, Math.max(c, d)), (a * e - b * e) / e;
}


const toMxPage = (data) => {
  console.log(data)
  router.push({
    path: '/kc-inventory-mx',
    query: {
      id: data.id,
      ccode: data.ccode,
      cname: data.cname,
      bstyle: data.bstyle,
      activityDate: data.startDate.replaceAll('-','.') + ' - ' +data.stopDate.replaceAll('-','.'),
      accId: dynamicTenantId.value,
      coCode:coCode.value,
      companyName:companyName.value,
      bcheck: data.bcheck,
      dpdate: data.startDate,
      dvdate: data.stopDate,
      kcCgrkCheck: dynamicTenant.value?.target?.kcCgrkCheck,
      kcXsckCheck: dynamicTenant.value?.target?.kcXsckCheck,
      iyear: iyear.value,
      ddate: data.ddate,
      dname: data.dname,
      puname: data.puname,
      kuname: data.kuname,
    },
  });
}

const toAudit = async () => {
  if (checkRow.value.length == 1) {
    //验证数据完整性
    let da = await checkData(checkRow.value[0].ccode)
    if(!da){
      message.error("数据异常请刷新页面后操作！")
      return
    }
    if(da.bcheck === '1'){
      message.error("已审核请勿重复审核，请刷新页面后操作！")
      return
    }
    compState.loading = true
    //新增校验
    let date1:any = useCompanyOperateStoreWidthOut().getLoginDate
    //  1 日期是否已结账
    let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date1.split('-')[0],month:date1.split('-')[1]})
    console.log('入库单操作：1--->日期是否已结账-->'+temp)
    if(temp>0){
      compState.loading = false
      return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
    }
    //  2 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:iyear.value,name:'月末结账',method:'月末结账'})
    console.log('入库单操作：2--->结账操作-->'+jzMethod)
    if(!hasBlank(jzMethod)){
      compState.loading = false
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }
    //  3 库子是否锁定-测试
    let taskList = await useRouteApi(findByIyearAndCaozuoModule, { schemaName: dynamicTenantId })({iyear:iyear.value,caozuoModule:'stock'})
    let d =  taskList.find(v=>v.functionModule.includes('库'))
    if(!hasBlank(d)){
      compState.loading = false
      return message.error('提示：当前存在库字单据正在进行操作，不能进行单据盘点操作，请销后再试！')
    }

    await useRouteApi(audit,{schemaName: database})({
      ccode:checkRow.value[0].ccode,
      user:userName
    })
    saveLogData('审核',checkRow.value[0].ccode)
    message.success("操作成功")
    reloadCurrentPage()
    compState.loading = false
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '编辑',
      content: '请选择一条进行编辑！'
    })
  }
}

const dynamicTenant:any = ref('')

const toAuditBack = async () => {
  //判断范围
  if (checkRow.value.length == 1) {
    //验证数据完整性
    let da = await checkData(checkRow.value[0].ccode)
    if(!da){
      message.error("数据异常请刷新页面后操作！")
      return
    }
    if(da.bcheck != '1'){
      message.error("未审核不能弃审，请刷新页面后操作！")
      return
    }
    compState.loading = true
    //新增校验
    let date1:any = useCompanyOperateStoreWidthOut().getLoginDate
    //  1 日期是否已结账
    let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date1.split('-')[0],month:date1.split('-')[1]})
    console.log('入库单操作：1--->日期是否已结账-->'+temp)
    if(temp>0){
      compState.loading = false
      return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
    }
    //  2 结账操作
    let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:iyear.value,name:'月末结账',method:'月末结账'})
    console.log('入库单操作：2--->结账操作-->'+jzMethod)
    if(!hasBlank(jzMethod)){
      compState.loading = false
      return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
    }
    //  3 库子是否锁定-测试
    let taskList = await useRouteApi(findByIyearAndCaozuoModule, { schemaName: dynamicTenantId })({iyear:iyear.value,caozuoModule:'stock'})
    let d =  taskList.find(v=>v.functionModule.includes('库'))
    if(!hasBlank(d)){
      compState.loading = false
      return message.error('提示：当前存在库字单据正在进行操作，不能进行单据盘点操作，请销后再试！')
    }

    //弃核前校验
    let a = await useRouteApi(auditCheck,{schemaName: database})({
      ccode:checkRow.value[0].ccode,
      rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,
      ckBcheck:dynamicTenant.value.target?.kcXsckCheck,
      type:'qs'
    })
    console.log(a)
    if(!a){
      compState.loading = false
      return message.error('现存量不足不能弃审！！！')
    }
    await useRouteApi(auditBack,{schemaName: database})(checkRow.value[0].ccode)
    saveLogData('弃审',checkRow.value[0].ccode)
    message.success("操作成功")
    reloadCurrentPage()
    compState.loading = false
  } else {
    createWarningModal({
      iconType: 'warning',
      title: '编辑',
      content: '请选择一条进行编辑！'
    })
  }
}
const [registerQueryPage, {openModal: openQueryPage}] = useModal()
const val2 = ref({
  openOne: 0,
  total: 0
})
const openQuery = async () => {
  val2.value.openOne = 0
  openQueryPage(true, {
    data: val2
  })
}

const strDate:any = ref('');
const endDate:any = ref('');
const popData=ref('')
const dataType=ref('')
async function saveQuery(data) {
  if(data.strDate.length>6){
    strDate.value=data.strDate.replaceAll('-','.')
    endDate.value=data.endDate.replaceAll('-','.')
  }
  dynamicTenant.value = data.obj
  pageParameter.strDate = strDate.value
  pageParameter.endDate = endDate.value
  database.value  = data.database
  dynamicTenantId.value  = data.database
  coCode.value =data.coCode
  companyName.value =data.companyName
  iyear.value=data.iyear
  compState.loading = true
  reloadCurrentPage()
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'盘点单',
    uniqueCode:'',
    optAction:'查询',
    accId:dynamicTenantId.value,
    optContent:'操作内容【盘点单】,账套代码【'+data.coCode+'】,账套名称【'+data.companyName+'】 下条件为：' +
      '日期【'+ pageParameter.strDate +'-'+ pageParameter.endDate +'】'+
      /*'单据编码【'+ pageParameter.strDate  +'】'+
      '审核状态【'+ pageParameter.strDate +'】'+
      '存货仓库【'+ pageParameter.strDate +'】'+
      '单据编码【'+ pageParameter.strDate  +'】'+*/
      '的盘点列表',
  }
  await saveLog(logmap)
  compState.loading = false

}

async function saveLogData(optAction,ccode) {
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'盘点单',
    uniqueCode:ccode,
    optAction:optAction,
    accId:dynamicTenantId.value,
    optContent:'操作内容【盘点单】,单据编号【'+ccode+'】',
  }
  await saveLog(logmap)
}

// 任务
const taskInfo:any = ref('')
async function tempTaskDel(id) {
  await useRouteApi(stockTaskDelById, { schemaName: dynamicTenantId })(id)
}
async function tempTaskSave(method,ccode) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })(
    {
      iyear:iyear.value,
      userName:useUserStoreWidthOut().getUserInfo.id,
      functionModule:'盘点单',
      method:method,
      recordNum:ccode,
      caozuoModule:'stock'
    })
    .then((a)=>{
      taskInfo.value=a
      console.log('任务='+JSON.stringify(a))
    })
}
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
      top: 27px;
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

