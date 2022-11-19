<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <ProfileOutlined style="color: #0096c7;font-size: 50px;"/>
        </div>

        <div><AccountPicker style="margin-bottom: 4px;" theme="three" readonly @reloadTable="dynamicAdReload"/></div>

        <div style="padding-left: 10%;">
            <label>业务类型：</label>
            <Select v-model:value="pageParameter.dataType"  style="width: 120px;font-size: 13px;font-weight: bold;" @change="changeType" >
              <SelectOption  value="PYRKD">盘盈入库</SelectOption>
              <SelectOption  value="PKCKD">盘亏出库</SelectOption>
            </Select>
        </div>

      </div>
      <div>
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">盘点出入库单列表</b></div>
        <div><span style="font-size: 14px;font-weight: bold;">期间：{{ pageParameter.strDate.replaceAll('-','.')}} - {{pageParameter.endDate.replaceAll('-','.') }}</span></div>
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
            @click="closeCurrent(),router.push('/one/home/welcome')">
            <span>退出</span></button>
        </div>
        <div>
          <div>
            <Select v-model:value="pageParameter.selectType" style="width: 120px;font-size: 12px;font-weight: bold;" class="special_select">
              <SelectOption style="font-size: 12px;" value="1">单据编码</SelectOption>
              <SelectOption style="font-size: 12px;" value="2">仓库</SelectOption>
              <SelectOption style="font-size: 12px;" value="3">存货名称</SelectOption>
            </Select>
            <!-- 搜索 -->
            <InputSearch
              placeholder=""
              style="width: 200px; border-radius: 4px;margin-right: 4px"
              @search="onSearch"
            />
          </div>
          <div>
            <a-button class="ant-btn-me">
              <SyncOutlined :style="{ fontSize: '14px' }" @click="reload()"/>
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
    </div>
    <div class="app-container">
      <Loading :loading="compState.loading" :absolute="compState.absolute" :tip="compState.tip" />
      <BasicTable
        ref="tableRef"
        :row-selection="{ type: 'checkbox' }"
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
        <template #squantity="{ record }">
          <span>{{ money(record.squantity) }}</span>
        </template>
        <template #squantity1="{ record }">
          <span>{{money(record.squantity1) }}</span>
        </template>
        <template #squantity2="{ record }">
          <span>{{ money(record.squantity2) }}</span>
        </template>
        <template #activityCode="{ record }">
          <span>
            <a  @click="openListsPage(record)" >{{ record.activityCode }}</a>
          </span>
        </template>

        <template #bstyle="{ record }">
          <span> {{ fomartStyle(record.bstyle)}}</span>
        </template>


        <template #action="{ record }">
        <div>
          <RightCircleTwoTone v-if="record.id != null" @click="toMxPage(record)"/>
        </div>
      </template>

      </BasicTable>

      <div class="pagination-text" >
        {{`共 ${paginationNumber} 条记录   &nbsp;&nbsp;每页 200 条`}}
      </div>
    </div>
    <Query @save="saveQuery" @register="registerQueryPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {
  findBillByCondition,
} from '/@/api/record/stock/stock_taking'
import {getCurrentAccountName, getThisIndexImg} from "/@/api/task-api/tast-bus-api";
import {BasicTable, useTable} from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import {onMounted, reactive, ref} from 'vue'
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
  CheckOutlined,CaretDownOutlined,
  SortDescendingOutlined,PicRightOutlined,
  UnorderedListOutlined,ProfileOutlined,
  RightCircleTwoTone,
  SortAscendingOutlined
} from '@ant-design/icons-vue'
import {
  DatePicker as ADatePicker,
  Select,
  Input,
  Popover as APopover,
  Switch as ASwitch,
  Radio as ARadio,
  Upload as AUpload,
  List as AList,
  Row as ARow,
  Menu as AMenu,
  message,
  Tag as ATag,
} from "ant-design-vue"
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import { Loading } from '/@/components/Loading';
import dayjs from "dayjs";
const ARangePicker = ADatePicker.RangePicker
const SelectOption = Select.Option
const InputSearch = Input.Search
const ARadioGroup = ARadio.Group
const AListItem = AList.Item
const AMenuItem = AMenu.Item
const {closeCurrent} = useTabs(router);
const windowWidth = (window.innerWidth)
const windowHeight = (window.innerHeight - (300))
const showPaginationText = ref(false)
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
const paginationNumber = ref(0)
const database = ref(getCurrentAccountName(true));
const CrudApi = {
  list: useRouteApi(findBillByCondition,{schemaName: database}),
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
      width: '15%',
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
      title: '单据编码',
      dataIndex: 'ccode',
      width: '20%',
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
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },
    {
      title: '盘点部门',
      dataIndex: 'dname',
      width: '15%',
      ellipsis: true,
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
    },
    {
      title: '主数量合计',
      dataIndex: 'squantity',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'squantity'}
    },
    {
      title: '计量1合计',
      dataIndex: 'squantity1',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'squantity1'}
    },
    {
      title: '计量2合计',
      dataIndex: 'squantity2',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'squantity2'}
    },
    {
      title: '盘点人',
      dataIndex: 'cmaker',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },
    {
      title: '审核人',
      dataIndex: 'bcheckUser',
      width: '20%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true
    },
    {
      title: '审核日期',
      dataIndex: 'bcheckTime',
      width: '15%',
      customHeaderCell: () => {		// 表头加粗
        return {style: {'font-weight':'bold'}} // return 想要设置的样式
      },
      ellipsis: true,
      slots: {customRender: 'bcheckTime'}
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
  api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 200,
    simple: true,
  },
  actionColumn: {
    width: '10%',
    title: '操作',
    dataIndex: 'action',
    customHeaderCell: () => {		// 表头加粗
      return {style: {'font-weight':'bold'}} // return 想要设置的样式
    },
    slots: {customRender: 'action'}
  }
})
const val = {
  id: '',
  openOne: 0,
  total: 0,
  settModesCode: '',
  settModesName: '',
  database: '',
  obj:{
    startDate: '',
    stopDate: '',
    bstyle: '',
    cdepcode: '',
    pdUserid: '',
    kgUserid: '',
    cwhcode: '',
  }
}
const condClick = (data:any, e:any) => {

}

const activeKey = ref(true)

const cardList:any = ref({})

function onSearch() {
}

const pageParameter: any = reactive({
  showRulesSize: 'MIN',
  selectType: '1',
  ccode: '',
  strDate:'',
  endDate:'',
  iyear: '2022',
  type: 'PYRKD',
})

const totalData = ref('0')


onMounted(async() => {
  openQuery()
})
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
function fomartStyle(flag:any) {
  let str = '全仓库'
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
  return str
}

const userName = useUserStoreWidthOut().getUserInfo.username
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
  router.push({
    path: '/kc-inventory-mx',
    query: {
      id: data.id,
      ccode: data.ccode,
      cname: data.cname,
      bstyle: data.bstyle,
      activityDate: '2022-07-01' + '~' +'2022-07-22',
      accId: database.value,
      coCode:coCode.value,
      companyName:companyName.value,
      bcheck: data.bcheck,
      dpdate: data.startDate,
      dvdate: data.stopDate,
      iyear: pageParameter.iyear,
      dname: data.dname,
      puname: data.puname,
      kuname: data.kuname,
    },
  });
}
// 金额格式化
function money(val: any) {
  if (val == null) {
    val = '';
    return val;
  }
  if (isNaN(val)) {
    val = '';
    return val;
  }
  if (val == '0.00') {
    val = '';
    return val;
  }
  if (val == null) val = '';
  val = val.toString().replace(/\$|\,\-/g, '');
  if (isNaN(val)) {
    val = '0';
  }
  let fs = val.indexOf('-') != -1
  const sign = val === (val = Math.abs(val));
  val = Math.floor(val * 100 + 0.50000000001);
  let cents = val % 100;
  val = Math.floor(val / 100).toString();
  if (cents < 10) {
    cents = '0' + cents;
  }
  for (let i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val =
      val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3));
  }
  return (sign ? '' : '') + (fs ? '-' : '') + val + '.' + cents;
}

const [registerQueryPage, {openModal: openQueryPage}] = useModal()

const openQuery = async () => {
  val.openOne = 0
  openQueryPage(true, {
    data: val
  })
}
const coCode = ref('')
const companyName = ref('')
async function saveQuery(data) {
  console.log(data)
  pageParameter.iyear = data.iyear
  pageParameter.strDate    = data.strDate
  pageParameter.endDate    = data.endDate
  pageParameter.dataType   = data.dataType
  pageParameter.databaseTrue = data.databaseTrue
  pageParameter.cdepcode = data.cdepcodee
  pageParameter.cmaker   = data.cmaker
  pageParameter.cangku   = data.cangku
  pageParameter.ccode    = data.ccode
  database.value = data.databaseTrue
  coCode.value= data.coCode
  companyName.value= data.companyName
  pageReload()
}
const pageReload =  () =>{
  reload({
    searchInfo: pageParameter
  })
  let len = getDataSource.length
  paginationNumber.value = len
}
const changeType =  (data) =>{
  pageReload()
}

</script>
<style src="./global-menu-index.less" lang="less" scoped></style>
<style scoped lang="less">
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}

.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 16px !important;
  padding: 5px 8px !important;
  border-color: #aaaaaa !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
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

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}

.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 99%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;    top: 15px;
      position: inherit
    }
    >div:nth-of-type(2){
      width: calc( 100% - 64px);display: inline-block;
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(2){margin-top: 14px;}
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
  }
}
:deep(.nc-summary) {
  font-size: 14px;
  font-weight: bold;
  width: 100%;

  > div {
    display: inline-block;
    background-color: #d8d8d8;
    padding: 5px;
  }
  > div:nth-of-type(1) {
    width: 59.5%;
    text-align: center;
  }

  > div:nth-of-type(2) {
    width: 20%;
    margin: 0 1px;
    text-align: left;
  }
  > div:nth-of-type(3) {
    width: 20%;
    margin: 0 1px;
    text-align: left;
  }
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 0px 10px;
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
:deep(.ant-table-tbody) {
  tr.ant-table-measure-row{
    visibility: collapse !important;
  }
}

</style>

