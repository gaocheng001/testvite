<template>
  <div>
    <div class="app-container">

      <div class="app-container-head">
        <!--        <img :src="getThisIndexImg()" class="container-head-img" draggable="false">-->
        <!--        <div class="container-head-title" style="margin-left: 20px">
                  <b class="noneSpan"><UnorderedListOutlined style="font-size: 26px;" />&nbsp;&nbsp;账户档案表</b>
                </div>-->

        <div class="container-head-title" style="float: left;margin-top: 10px;">
          <b class="noneSpan" style="font-size: 60px;"><ProfileOutlined /></b>
        </div>
        <div class="container-head-title" style="padding-left: 35%;text-align: center;margin-top: 30px;">
          <b class="noneSpan" style="font-size: 36px;">科目设置</b>
        </div>

        <div class="ant-btn-group" style="float: right">
          <button
            type="button"
            class="ant-btn ant-btn-me"
            @click="closeCurrent()"
          ><span>退出</span></button>
        </div>
      </div>

      <div style="clear: none"/>
      <div style="margin-top: -30px;margin-left: 80px;">
        <div style="display: inline-block;float: left;margin-top: -25px;">
          <AccountPicker theme="three" @reloadTable="dynamicAdReload"/>
        </div>
        <!--        <div style="display: inline-block;position:absolute;top:85px;left:110px;font-size: 10px;color:#999999;">共 {{tableDataAll.length}} 条记录</div>-->

        <!--      <div class="app-container-neck">
                <div style="display: inline-block;float: left;margin-left: 1%;font-size: 14px;">
                  <AccountPicker theme="three" @reloadTable="dynamicAdReload"/>
                </div>
                <div style="float: left; margin-left: 10px;line-height: 30px;">共 {{tableDataAll.length}} 条记录</div>-->
        <div style="float: right; margin-left: 10px">
          <a-button class="ant-btn-me" @click="reloadCurrentPage()">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </a-button>
          <a-popover class="ant-btn-default" placement="bottom">
            <template #content>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MAX'"
                    :style="pageParameter.showRulesSize==='MAX'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortDescendingOutlined/>&nbsp;大号字体&ensp;<CheckOutlined v-if="pageParameter.showRulesSize==='MAX'"/></span><br/>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MIN'"
                    :style="pageParameter.showRulesSize==='MIN'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortAscendingOutlined/>&nbsp;小号字体&ensp;<CheckOutlined v-if="pageParameter.showRulesSize==='MIN'"/></span>
            </template>
            <a-button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </a-button>
          </a-popover>
          <!--        <a-popover placement="bottom">
                    <a-button>
                      <PicLeftOutlined :style="{ fontSize: '14px' }" />
                    </a-button>
                  </a-popover>-->

          <!--        <a-button>
                    <EditFilled :style="{ fontSize: '14px' }" />
                  </a-button>-->

          <!--          <a-button @click="activeKey=!activeKey">
                      <PieChartFilled :style="{ fontSize: '14px' }" />
                    </a-button>-->
          <!--        <a-button>
                    <FilterFilled :style="{ fontSize: '14px' }" />
                  </a-button>-->
        </div>
        <div style="float: right; position: relative">
          <!-- 搜索 -->
          <!--        <a-input-search
                    placeholder=""
                    style="width: 200px; border-radius: 4px"
                    @search="onSearch"
                  />-->
        </div>
      </div>
      <div style="clear:both"/>
    </div>
    <div class="app-container">
      <BasicTable
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        :scroll="{ y: windowHeight }"
        @register="registerTable"
        :dataSource="tableData"
        :loading="loadMark"
        style="width:1100px;"
      >
        <template #ccode="{ record }">
<!--          {{record.ccode}}-->
          <template v-if="record.editOne">
            <a-select v-model:value="record.ccode" style="width: 85%;"
                      class="ccode"
                      @change="handleChange"
                      show-search
                      :filter-option="false"
                      @search="handleSearch"
                      @keyup.enter="tableDataChange(record)">
              <template #suffixIcon><SearchOutlined/></template>
              <a-select-option v-for="kemu in kemuCodeList" :key="kemu.ccode" :value="kemu.ccode">
                {{ kemu.ccode }}--{{ kemu.ccodeName }}
              </a-select-option>
            </a-select>
            <CheckOutlined @click="record.editOne = null;tableDataChange(record)"/>
          </template>
          <template v-else>
            <div @click="record.editOne = true;" class="suspended-div">
              {{record.ccode}}
            </div>
          </template>
        </template>
        <template #ccodeName="{ record }">
          {{record.ccodeName}}
        </template>
        <template #action="{ record }">
          <a style="cursor: pointer" @click="openAddCcode(record)"><FormOutlined /> 设置</a>
        </template>

      </BasicTable>

      <AddCcode @save="saveAddCcode" @register="registerAddCcodePage"/>
    </div>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import { BasicTable, useTable } from '/@/components/Table'
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import { useModal } from '/@/components/Modal'
import {nextTick, onMounted, reactive, ref} from 'vue'
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
  SortDescendingOutlined,
  SortAscendingOutlined,
  EllipsisOutlined,
  UnorderedListOutlined,
  ReadOutlined,
  SafetyOutlined,
  RestOutlined,ProfileOutlined,SearchOutlined
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
  Dropdown as ADropdown,
  Card as ACard,
  Col as ACol,
  Divider as ADivider,
  message,
  Tag as ATag
} from "ant-design-vue"
import {getCurrentAccountName, getThisIndexImg, hasBlank} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {deleteByUniqueId, findStockCcodeAll, saveStockCcode, saveStockCcodes} from "/@/api/record/system/stock-ccode";
import {company_findCodeByYear} from "/@/api/codekemu/codekemu";
import {findByStockAccountAccId} from "/@/api/record/system/stock-account";
import {findYearByUniqueCode} from "/@/api/record/system/arBeginBalance";
import AddCcode from "./popup/add-ccode.vue";
const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const AListItem = AList.Item
const AMenuItem = AMenu.Item

const {closeCurrent} = useTabs(router);

const {
  createConfirm,
  createWarningModal
} = useMessage()

const flag = ref('1')

const windowHeight = (window.innerHeight - (300))

const CrudApi = {
  columns: [
    {
      title: '类别',
      dataIndex: 'stName',
      align: 'left',
      width: 200,
      ellipsis: true
    },
    {
      title: '科目编码',
      dataIndex: 'ccode',
      align: 'left',
      width: 200,
      ellipsis: true,
      slots: {customRender: 'ccode'}
    },
    {
      title: '科目名称',
      dataIndex: 'ccodeName',
      align: 'left',
      width: 300,
      ellipsis: true,
      slots: {customRender: 'ccodeName'}
    },
    {
      title: '扩展设置',
      dataIndex: 'action',
      width: 100,
      ellipsis: true,
      slots: {customRender: 'action'}
    },
  ],
  editData: {
    id: null,
    ccode: '',
    cname: '',
    accStyle: '',
    accBank: '',
    accNumber: '',
    status: '',
    memo: '',
  }
}

const dynamicTenantId = ref(getCurrentAccountName(true))
// 这是示例组件
const [registerTable, { reload,getDataSource,setTableData,setColumns,getColumns,getPaginationRef,setPagination,deleteSelectRowByKey }] = useTable({
  // api: useRouteApi(CrudApi.list,{schemaName: dynamicTenantId}),
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  indexColumnProps:{ fixed:true },
  pagination: false,
  /*actionColumn: {
    width: 100,
    title: '扩展设置',
    dataIndex: 'action',
    slots: {customRender: 'action'}
  }*/
})
const val = {
  id: null,
  ccode: '',
  cname: '',
  accStyle: '',
  accBank: '',
  accNumber: '',
  status: '1',
  memo: '',
}

const activeKey = ref(true)

const cardList:any = ref([])
const tableData:any = ref([])
const tableDataAll:any = ref([])
const list = [{
  stName: '存货科目',
  ccode: '',
  ccodeName: '',
},{
  stName: '存货对方科目',
  ccode: '',
  ccodeName: '',
},{
  stName: '采购科目',
  ccode: '',
  ccodeName: '',
},{
  stName: '采购费用科目',
  ccode: '',
  ccodeName: '',
},{
  stName: '暂估应付款科目',
  ccode: '',
  ccodeName: '',
},{
  stName: '销售科目',
  ccode: '',
  ccodeName: '',
},{
  stName: '委外费用科目',
  ccode: '',
  ccodeName: '',
}]
async function reloadCurrentPage() {
  tableDataAll.value = await useRouteApi(findStockCcodeAll,{schemaName: dynamicTenantId})({})
  if (tableDataAll.value.length==0){
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      await useRouteApi(saveStockCcode,{schemaName: dynamicTenantId})(item)
    }
    tableDataAll.value = await useRouteApi(findStockCcodeAll,{schemaName: dynamicTenantId})({})
  }
  tableData.value = tableDataAll.value
  setTableData(tableData.value)
}

const kemuList = ref([])
const kemuCodeList = ref([])
async function reloadKemu(){
  const res = await useRouteApi(company_findCodeByYear, {schemaName: dynamicTenantId})({iyear:year.value})
  kemuList.value = res.filter(item=>item.bend=='1')
  kemuCodeList.value = kemuList.value
}

//搜索科目
function handleSearch(value) {
  kemuCodeList.value = kemuList.value.filter(item => {
    return item.ccode.slice(0, value.length) == value || item.ccodeName.indexOf(value) != -1
  })
  // debugger
  // console.log(sourceList.value)
}

function handleChange(value) {
  console.log(value);
  kemuCodeList.value = kemuList.value.filter(item => {
    return item.ccode.slice(0, value.length) == value
  })
}

//保存科目
const tableDataChange =  async (data) => {
  if (data.ccode!=null && data.ccode!=''){
    const kemu = kemuList.value.filter(item =>item.ccode==data.ccode)
    if (kemu.length>0) {
      data.ccodeName = kemu[0].ccodeName
    }
  } else {
    data.ccodeName = ''
  }
  await useRouteApi(saveStockCcode, {schemaName: dynamicTenantId})(data)
  await reloadCurrentPage()
}

//扩展设置
const [registerAddCcodePage, {openModal: openAddCcodePage}] = useModal()
const openAddCcode = (data) => {
  openAddCcodePage(true, {
    data: data,
    dynamicTenantId: dynamicTenantId.value,
    kemuList: kemuList.value
  })
}

async function saveAddCcode(data) {
  await useRouteApi(deleteByUniqueId,{schemaName: dynamicTenantId})(data.uniqueId)
  for (let i = 0; i < data.table.length; i++) {
    let item = data.table[i]
    item.uniqueId = data.uniqueId
    await useRouteApi(saveStockCcodes, {schemaName: dynamicTenantId})(item)
  }
  // message('设置成功！')
}

onMounted(async() => {
  // await reloadCurrentPage()
})

function onSearch() {
}

const pageParameter: any = reactive({
  showRulesSize: 'MIN',
  companyCode: '100',
  companyName: '北京希格科技',
  ifUnit: false,
})

const loadMark = ref(false)
const year = ref()
const dynamicAdReload = async (obj) => {
  // const dataBase:any = await findDataBase(obj.accId,obj.year)
  dynamicTenantId.value = obj.accountMode
  pageParameter.companyName = obj.baseName
  const account = await findByStockAccountAccId(obj.accId)
  const res = await findYearByUniqueCode(account.id)
  if (res.length!=0){
    year.value = res[res.length-1].stockYear
  }
  await reloadKemu()
  res.forEach(item=>{
    if (item.stockYear>year.value){
      year.value = item.stockYear
    }
  })
  loadMark.value = true
  await reloadCurrentPage()
  pageParameter.thisAdInfo = {}
  pageParameter.thisAdInfo = obj
  loadMark.value = false
}
</script>
<style src="./global-menu-index.less" lang="less" scoped></style>
<style lang="less" scoped>
:deep(.vben-basic-table) {
  .ant-table-wrapper {
    .ant-table-measure-row{
      td{
        padding: 0!important;
      }
    }
  }
}

.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 14px !important;
  padding: 5px 8px !important;
  border-color: #aaaaaa !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 13px !important;
  padding: 5px 8px !important;
  border-color: #aaaaaa !important;
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
}

:deep(.vben-basic-table) .ant-pagination {
  background-color: #cccccc;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin: 0;
}

:deep(.suspended-div) {
  width: 100%;
  height: 22px;

  .anticon-form {
    float: right;
    line-height: 22px;
    display: none;
  }
}
:deep(.suspended-div:hover) {
  cursor: text;
  background-color: #e4e7e7;
  .anticon-form {
    display: block;
  }
}

:deep(.vben-basic-table){
  min-height: 500px;
  height: calc(100% - 160px);
  //margin-bottom: 20px;
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}

</style>
