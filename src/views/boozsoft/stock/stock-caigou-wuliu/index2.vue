<template>
  <div class="app-container">
    <div class="app-container-top lcr-theme-div" style="background-color: rgb(41 150 199)">
      <div>
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>  <AccountPicker theme="three" :readonly="status>1" :dataFun="accountPickerFuns" @reloadTable="dynamicAdReload"/></div>
      </div>
      <div></div>
      <div>
        <div>
          <Button class="actod-btn" >查询</Button>
          <!-- 审核后的 -->
          <span v-if="stockWareData.bcheck=='1'">
            <Button class="actod-btn" @click="startEdit('add')">新增</Button>
            <Button class="actod-btn actod-btn-last" @click="stockWareData.bcheck=='1'?startReview(false):startReview(true)">{{ stockWareData.bcheck=='1'?'弃审':'审核' }}</Button>
            <Popover placement="bottom">
              <template #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="sySourcePop">来源单据</Button><br/>
              </template>
              <Button class="actod-btn">联查</Button>
            </Popover>
          </span>
          <!-- 未审核 -->
          <span v-else>
            <span v-if="status < 3">
            <Button class="actod-btn" @click="referData">参照</Button>
            <Button class="actod-btn" @click="saveData">保存</Button>
            <Button class="actod-btn" @click="giveUp">放弃</Button>
          </span>
            <span v-else>
              <Button class="actod-btn" @click="startEdit('add')">新增</Button>
              <Button class="actod-btn" @click="startEdit('edit')">修改</Button>
              <Button class="actod-btn" @click="startDel">删除</Button>
              <Button class="actod-btn actod-btn-last" @click="stockWareData.bcheck=='1'?startReview(false):startReview(true)">{{ stockWareData.bcheck=='1'?'弃审':'审核' }}</Button>
              <Popover placement="bottom">
                <template #content>
                  <Button style="width: 120px;margin-bottom: 2px" @click="sySourcePop">来源单据</Button><br/>
                </template>
                <Button class="actod-btn">联查</Button>
              </Popover>
            </span>
          </span>
          <Button class="actod-btn actod-btn-last" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')">退出</Button>
        </div>
        <div>
          <div class="acttd-right-d-btns">
            <div class="acttd-right-d-search">
              <ReceiptSearch v-if="status==3" :default-data="searchData" :dynamic-tenant-id="dynamicTenantId" @toggle="toReceipt"/>
            </div>
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom" v-model:visible="visible">
              <template #content>
                <Button style="width: 120px;margin-bottom: 2px" @click="openSetting">表头栏目设置</Button>
                <br/>
                <DynamicColumn :defaultData="initDynamics()['DATA']" :dynamicData="dynamicColumnData" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
                <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MAX'"
                      :style="pageParameter.showRulesSize==='MAX'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortDescendingOutlined/>&nbsp;大号字体&ensp;<CheckOutlined
                  v-if="pageParameter.showRulesSize==='MAX'"/></span><br/>
                <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MIN'"
                      :style="pageParameter.showRulesSize==='MIN'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortAscendingOutlined/>&nbsp;小号字体&ensp;<CheckOutlined
                  v-if="pageParameter.showRulesSize==='MIN'"/></span>
              </template>
              <Button class="acttdrd-btn">
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom">
      <div class="acb-head">
        <div class="acbgead-one">
          <div class="acbgead-one-triangle">
            <div></div>
            <div>
              <span
                style="color: white;">{{
                  status == 0 ? '暂存' : status == 1 ? '新增' : status == 2 ? '编辑' : '查看'
                }}</span>
            </div>
          </div>
          <div class="acbgead-one-changes" :class="status == 1 || status == 2 ?'status-look':''">
            <VerticalRightOutlined @click="contentSwitch('first','首页')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev','')" title="上页"/>&nbsp;
            <RightOutlined @click="contentSwitch('next','')" title="下页"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail','')" title="尾页"/>
            <span v-if="status=='3'">
              <Tag v-if="stockWareData.bcheck=='1'" :color="'volcano' ">
                已审核
              </Tag>
            </span>
          </div>
          <span style="font-size: 22px;font-weight: bold;margin-right: 300px;" :style="{color: '#0096c7'}">{{ titleContents[0] }}</span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <DynamicForm :datasource="dynamicFormModel" :formDataFun="formFuns" :accId="dynamicTenantId" @open="openHeadSelectContent" :canzhao="canzhao"/>
        </div>
      </div>
      <div class="acb-centent">
        <BasicTable
          ref="tableRef"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :clickToRowSelect="false"
          :loading="loadMark"
          :row-selection="{ type: 'checkbox'}"
          :scroll="{ x: totalColumnWidth,y: windowHeight-(145)}"
          size="small"
          @register="registerTable"
        >
          <template #bcheck1="{ record }">
            <div :class="'status-look'"
                 @click="record.tempThree=record.bcheck1,record.editThree = true;">
              <span class="a-table-font-arial">{{ record?.bcheck1 }}</span>
            </div>
          </template>
          <template #cinvode="{ record }">
            <div :class="'status-look'"
                 @click="record.tempTwo=record.cinvode,record.editTwo = true;">
              <span class="a-table-font-arial">{{ record?.cinvode }}</span>
            </div>
          </template>
          <template #cinvodeName="{ record }">
            <div :class="'status-look'"
                 @click="record.tempEleven=record.cinvodeName,record.editEleven = true;">
              <span class="a-table-font-arial">{{ record?.cinvodeName }}</span>
            </div>
          </template>
          <template #cgUnitId="{ record }" >
            <template v-if="record.editCgUnitId">
              <Select
                v-model:value="record.tempCgUnitId"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                style="width: 82%;"
                class="cgUnitId"
                @change="cgUnitIdChange(record)"
              >
                <SelectOption v-for="tem in record.unitList" :value="tem.value">
                  {{ tem.title }}
                </SelectOption>
              </Select>
              <CheckOutlined @click="record.editCgUnitId = null;record.cgUnitId=record.tempCgUnitId;"/>
            </template>
            <template v-else>
              <div @click="record.tempCgUnitId=record.cgUnitId,record.editCgUnitId = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                <span>{{ hasBlank(record.unitList)?null:record.unitList.filter(it => it.value == record.cgUnitId)[0]?.title}}</span>
              </div>
            </template>
          </template>
          <template #cnumber="{ record }">
            <div :class="'status-look'"
                 @click="record.tempCnumber=record.cnumber,record.editCnumber = true;">
                    <span class="a-table-font-arial">{{
                        (record.cnumber == null ? '' : parseFloat(record.cnumber).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}</span>
            </div>
          </template>
          <template #cunitid="{ record }">
            <div>
              <span>{{cunitFormat(record.unitList,record.cunitid)}}</span>
            </div>
          </template>
          <template #baseQuantity="{ record }">
            <span class="a-table-font-arial">{{
                (record.baseQuantity == null || record.baseQuantity == 0 ? '' : parseFloat(record.baseQuantity).toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }}
             </span>
          </template>
          <template #batchId="{ record }">
            <div :class="'status-look'" @click="record.tempTwelve=record.batchId,record.editTwelve = true;">
              <span class="a-table-font-arial">{{ record.batchId }}</span>
            </div>
          </template>
          <template #dpdate="{ record }">
            <div :class="'status-look'" @click="record.tempDpdate=record.dpdate,record.editDpdate = true;">
              <span class="a-table-font-arial">{{ record.dpdate }}</span>
            </div>
          </template>
          <template #dvdate="{ record }">
            <div :class="'status-look'" @click="record.tempFifteen=record.dvdate,record.editFifteen = true;">
              <span class="a-table-font-arial">{{ record.dvdate }}</span>
            </div>
          </template>
          <template #cmemo="{ record }">
            <template v-if="record?.editThirteen">
              <Input v-model:value="record.tempThirteen"
                     style="width: 82%;" class="cmemo"/>
              <CheckOutlined @click="record.editThirteen = null;record.cmemo=record.tempThirteen;"/>
            </template>
            <template v-else>
              <div :class="status == 1 || status == 2?'suspended-div':'status-look'"
                   @click="record.tempThirteen=record.cmemo,record.editThirteen = true;">
                <span class="a-table-font-arial">{{ record.cmemo }}</span>
              </div>
            </template>
          </template>
          <template #summary>
            <TableSummary fixed>
              <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                <TableSummaryCell class="nc-summary" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summary[cell.dataIndex]?'':summary[cell.dataIndex].toFixed(2)}}</span></TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
        </BasicTable>
      </div>
    </div>

    <Query @query="columnReload" @register="registerQueryPage"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <Refer @throwData="referThrowData" @register="registerReferPage"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import moment, {Moment} from "moment";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  message,
  Modal as AModal,
  Popconfirm,
  Popover,
  Radio,
  Select,
  Switch,
  Table,
  Tabs,
  Tag,
} from "ant-design-vue";
import Query from "./popup/query.vue";
import Refer from './popup/refer.vue';
import SySource from './popup/sySource.vue';
import DynamicForm from './component/DynamicForm.vue';
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {
  CheckOutlined,
  CopyOutlined,
  EditOutlined,
  LeftOutlined,
  PicLeftOutlined,
  RightOutlined,
  SearchOutlined,
  SettingFilled,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined
} from '@ant-design/icons-vue';
import {getCurrentInstance, reactive,nextTick, ref} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {JsonTool, NumberTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {findFaAssetInfoByCode} from "/@/api/fa/fa-assets-minus";

import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
import {assemblyDynamicColumn, initDynamics} from "./data";
import {findDbLanMuList, saveLanMuList,} from '/@/api/record/system/accvoucher';
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {cloneDeep} from "lodash-es";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {
  GenerateDynamicColumn
} from "/@/views/boozsoft/stock/stock-caigou-wuliu/component/DynamicForm";
import SupperModalPop from "/@/views/boozsoft/global/popup/supplier/modalPop.vue";
import CustomerModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import StockCangKuModalPop
  from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {
  findAll as findAllJiLang,
  findUnitAssociationList,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {
  findBillCode, findByStockPeriodIsClose,
  findByStockWareRecentlySupMoney,
  findStockPeriodYmFlag, xyCsourceSave,
} from "/@/api/record/stock/stock-ruku";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {findCangkuJoinName} from "/@/api/record/stock/stock-cangku-level-record";
import {company_executeSQL} from "/@/api/codekemu/codekemu";
import {
  getByStockBalanceTask,
  stockBalanceTaskDelByUserName,
  stockBalanceTaskEditNewTime,
  stockBalanceTaskSave, stockTaskDelById,
  updateStockCurrentRevision
} from "/@/api/record/stock/stock_balance";
import {findStockCurr,} from "/@/api/record/stock/stock-currents";
import {findByStockWarehLinecode} from "/@/api/record/system/stock-wareh";
import {stockSupPriceFindBySupIdAndStockNum} from "/@/api/record/stock/stock_sup_price";
import {findbyStockSaleousingsCodeAndBillStyle} from "/@/api/record/stock/stock-xhd";
import {
  editStockSaleousingDelivery, findNewWuLiuCode,
  findWuLiuByCondition,
  findWuliuCode,
  stockWuLiuSave,
  wuliuDel
} from "/@/api/record/stock/stock-wuliu";
import {
  delByWuliuSongHuoCode,
  findAllByWuliuSongHuoCode,
  wuliuSongHuoSave
} from "/@/api/record/stock/stock-wuliu-songhuo";
import {editStockSaleousingsIsSumWuliu} from "/@/api/record/stock/stock-wulius";
import {wuliuCsourceDel, wuliuCsourceSave} from "/@/api/record/stock/stock-wuliuCsource";
import {
  findByStockNum2,
  findByStockSupplierPrice,
  singleUnitOfMea
} from "/@/api/record/stock/stock";
import dayjs from "dayjs";
import ReceiptSearch from "/@/views/boozsoft/stock/stock_sales_add/component/ReceiptSearch.vue";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const TableSummary = Table.Summary
const TableSummaryRow = Table.Summary.Row
const TableSummaryCell = Table.Summary.Cell
const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent} = useTabs(router);
const windowHeight = (window.innerHeight - 330)
const taskInfo:any = ref('')
const dynamicTenantId = ref('')
const stockAccountObj:any = ref('')
const dynamicAccId = ref('')
const dynamicYear = ref('')
const stockWareData:any = ref('')
const titleContents = ['销售送货物流单']
const dynamicColumnData = ref({value:[]})
const lanMuData = ref({
  accId: dynamicTenantId.value,
  menuName: '销售送货物流单',
  type: '列表',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,
  changeNumber:0
})
const windowWidth = (window.innerWidth - (70))
const sourceCust:any = ref('')  // 弹框选中的客户
const isEdit = ref(false);
const visible = ref(false);
const totalColumnWidth = ref(0)
const tableRef:any = ref(null)
const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'CGWLD'
})
const dynamicFormModel:any = ref([])
const formFuns:any = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const formRowNum = ref(1)
const status = ref(3)   // 0 暂存 1 新建 2编辑 3查看
const jiList:any = ref([])
const duoJlMxList:any = ref([])
const manyJiList:any = ref([])
const ckListOptions:any = ref([])
const userList = ref([])
const custList = ref([])
const operatorList = ref([])
const assetsCardList:any = ref([])
const thisEditType = ref('')
const loadMark = ref(false)
const cardListOptions:any = ref([])
const referTaskList:any = ref([])
const tempType =  ref('')
const thisEditObj:any = ref(null)
const formItems: any = ref({})
const dynamicTenant:any = ref(null)
const summary = ref({})
const canzhao = ref(false)
const referTableSelectedRowObjs = ref([])        // 参照选中回调
const routeDataParams:any = route.query;

const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerReferPage, {openModal: openReferPage}] = useModal()


const CrudApi = {
  columns: [
    {
      title: '条形码',
      dataIndex: 'bcheck1',
      ellipsis: true,slots: {customRender: 'bcheck1'},
    },
    {
      title: '存货编码',
      dataIndex: 'cinvode',
      ellipsis: true,
      slots: {customRender: 'cinvode'},
    },
    {
      title: '存货名称',
      dataIndex: 'cinvodeName',
      ellipsis: true,
      slots: {customRender: 'cinvodeName'},
    },
    {
      title: '规格型号',
      dataIndex: 'cinvodeType',
      ellipsis: true,
      slots: {customRender: 'cinvodeType'},
    },{
      title: '计量单位',
      dataIndex: 'cgUnitId',
      ellipsis: true,
      slots: {customRender: 'cgUnitId'},
    },{
      title: '数量',
      dataIndex: 'cnumber',
      ellipsis: true,
      slots: {customRender: 'cnumber'},
    },
    {
      title: '主计量',
      dataIndex: 'cunitid',
      ellipsis: true,
      align: 'left',
      slots: {customRender: 'cunitid'},
    },{
      title: '主数量',
      dataIndex: 'baseQuantity',
      slots: {customRender: 'baseQuantity'},
      ellipsis: true,
    },
    {
      title: '批号',
      dataIndex: 'batchId',
      ellipsis: true,
      slots: {customRender: 'batchId'},
    },
    {
      title: '生产日期',
      dataIndex: 'dpdate',
      slots: {customRender: 'dpdate'},
      ellipsis: true,
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      slots: {customRender: 'dvdate'},
      ellipsis: true,
    },{
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      slots: {customRender: 'cmemo'},
    }
  ]
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
    pageSize: 50,
    hideOnSinglePage: true,
    showSizeChanger: true,
    pageSizeOptions: ['30', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },

})
const dynamicAdReload = async (obj) => {
  dynamicTenant.value = obj
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  dynamicYear.value = obj.stockYear
  searchData.value.year = obj.stockYear
  lanMuData.value.accId= obj.accountMode
  stockWareData.value=''
  visible.value = true
  await columnReload()
  await reloadList()
  lanMuData.value.changeNumber+=1
}
// 获取单据信息
async function findWuliuCodeData(ccode) {
  stockWareData.value=await useRouteApi(findWuliuCode, {schemaName: dynamicTenantId})(ccode)
}
async function contentSwitch(action,ccode) {
  loadMark.value = true
  let res = await useRouteApi(findWuLiuByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    ccode: ccode,
    curr: formFuns.value.getFormValue()?.ccode || ''
  })
  if (null != res) {
    await findWuliuCodeData(res.ccode)

    // 送货人
    let songhuo=await useRouteApi(findAllByWuliuSongHuoCode, {schemaName: dynamicTenantId})(res.ccode)
    res.deliveryName=hasBlank(songhuo.map(a=>a.wuliuUser))?undefined:songhuo.map(a=>a.wuliuUser)

    formItems.value = JsonTool.parseProxy(res)
    res.entryList = null
    formFuns.value.setFormValue(res)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      // 查找级别档案名称
      for (let i = 0; i < list.length; i++) {
        list[i].unitList=[]
        let stock=await useRouteApi(findByStockNum2, {schemaName: dynamicTenantId})(list[i].cinvode)
        // 查询计量明细
        let res:any =  manyJiList.value.filter(it=>it.id == stock?.stockMeasurementUnit)[0]
        if (res != null){
          let list2 = JsonTool.parseObj(res.detail) || []
          list2=list2.filter(jl=>!hasBlank(jl.unitName))
          list[i].unitList.push({conversionRate:list2[0]?.conversionRate,title:list2[0]?.unitName,value:list2[0]?.id,ggxh:stock?.stockGgxh,txm:stock?.stockBarcode})
          if(list2.length==2){
            list[i].unitList.push({conversionRate:list2[1]?.conversionRate,title:list2[1]?.unitName,value:list2[1]?.id,ggxh:stock?.stockUnitGgxh1,txm:stock?.stockUnitBarcode1})
          }
          if(list2.length==3){
            list[i].unitList.push({conversionRate:list2[1]?.conversionRate,title:list2[1]?.unitName,value:list2[1]?.id,ggxh:stock?.stockUnitGgxh1,txm:stock?.stockUnitBarcode1})
            list[i].unitList.push({conversionRate:list2[2]?.conversionRate,title:list2[2]?.unitName,value:list2[2]?.id,ggxh:stock?.stockUnitGgxh2,txm:stock?.stockUnitBarcode2})
          }
          let data=list[i].unitList.filter(a=>a.value==list[i].cgUnitId)[0]
          list[i].bcheck1=data?.txm
          list[i].cinvodeType=data?.ggxh
        }
        else{
          list[i].unitList=jiList.value.filter(a=>a.id==list[i].cgUnitId).map(it=>{it.conversionRate=it.conversionRate;it.title=it.unitName;it.value=it.id;it.ggxh=stock?.stockGgxh;it.txm=stock?.stockBarcode;return it;})
        }
      }
      let len = list.length
      for (let i = len; i < (50 ); i++) {
        list.push({})
      }
      setTableData(list)
    }
    formItems.value.entryList = null
  } else {
    let list:any=[]
    for (let i = 0; i < 50; i++) {
      list.push({})
    }
    setTableData(list)
    formFuns.value.setFormValue({})
    formItems.value={}
    message.success('暂无数据！')
  }
  loadMark.value = false
  visible.value = false
}
const startEdit = async (type) => {
  let maxR = 50
  if (type === 'add') {
    stockWareData.value=''
    canzhao.value=false
    status.value = 1
    let date = useCompanyOperateStoreWidthOut().getLoginDate
    // 获取最新
    let code = await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
    tempTaskSave('新增')
    formItems.value = {
      ddate: date,
      ccode: code,
      rate: hasBlank(dynamicTenant.value.target.cgRate)?0:dynamicTenant.value.target.cgRate,
      invoiceStyle: '1',
      cvencode:sourceCust.value
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code,
      rate: hasBlank(dynamicTenant.value.target.cgRate)?0:dynamicTenant.value.target.cgRate,
      invoiceStyle: '1',
      cvencode:sourceCust.value
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    setTableData(list)
  }
  else {
    // 任务
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({record:stockWareData.value.ccode,iyear:dynamicYear.value,name:'销售送货物流单',method:'修改'})
    if(taskData==''){
      tempTaskSave('修改')
    }else{
      // 任务不是当前操作员的
      if(taskData.caozuoUnique!==useUserStoreWidthOut().getUserInfo.id){
        return createWarningModal({ content: taskData.username+'正在修改销售送货物流单,不能同时进行操作！' });
      }else{
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: dynamicTenantId })(taskData.id)
      }
    }
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    setTableData(list)
  }
}

async function giveUp() {
  if (status.value == 1) {
    await contentSwitch('first','')
  } else if (status.value == 2) {
    await contentSwitch('curr','')
  }
  if(!hasBlank(taskInfo.value)){
    tempTaskDel(taskInfo.value?.id)
  }
  // 删除参照任务锁定表
  if(referTaskList.value.length>0){
    for (let i = 0; i < referTaskList.value.length; i++) {
      tempTaskDel(referTaskList.value[i].id)
    }
  }
  calculateTotal()
  status.value = 3
  canzhao.value = false
}
const accountPickerFuns = ref({
  resetCoCode: (v) => {}
})
const pageReload = async () => {
  if(routeDataParams.ccode!==undefined){
    if (!hasBlank(routeDataParams.co) && dynamicTenant.value?.coCode !=routeDataParams.co){
      accountPickerFuns.value.resetCoCode(routeDataParams.co)
      return false
    }
    await contentSwitch('tail',routeDataParams.ccode)
  }else{
    await contentSwitch(formItems.value.id == null?'tail':'curr','')
  }
}
async function reloadList() {
  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  duoJlMxList.value = await useRouteApi(findUnitAssociationList, {schemaName: dynamicTenantId})({})
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
  nextTick(()=>{
    ckListOptions.value = formFuns.value.getSelectMap()['warehouse']
    operatorList.value = formFuns.value.getSelectMap()['operator']
    custList.value = formFuns.value.getSelectMap()['supplier']
    userList.value = formFuns.value.getSelectMap()['user']
  })
}
const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    // case 'cvencode':
    //   openMoalPopPage(true, {
    //     database: dynamicTenantId.value,
    //     accId: dynamicAccId.value,
    //   });
    //   break;
    // case 'cvencode2':
    //   openMoalPopPage(true, {
    //     database: dynamicTenantId.value,
    //     accId: dynamicAccId.value,
    //   });
    //   break;
    // case 'cdepcode':
    //   openSelectDeptPage(true, {
    //     dynamicTenantId: dynamicTenantId.value
    //   })
    //   break;
    // case 'cwhcode':
    //   openStockCangKuModalPage(true, {
    //     database: dynamicTenantId.value,
    //   })
    //   break;
    // case 'cpersoncode':
    //   openSelectPsnPage(true, {
    //     dynamicTenantId: dynamicTenantId.value
    //   })
    //   break;
    case 'deliveryName':
      openSelectPsnPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;
  }
}
const modalData = (o) => {
  let e:any = formFuns.value.getFormValue()
  e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
  if(thisEditType.value == 'cvencode'){
    let cvencodeJslist=dynamicFormModel.value.filter(a=>a.field=='cvencodeJs')[0].list.filter(a=>a.uniqueCode==o[0]?.uniqueCodeCcus)
    e['cvencodeJs']=hasBlank(o[0]?.uniqueCodeCcus)?e['cvencode']:cvencodeJslist[0]?.id
  }
  formFuns.value.setFormValue(e)
}
const columnReload = async () => {
  dynamicFormModel.value = await GenerateDynamicColumn(dynamicTenantId.value) || []
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}
const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  pageReload()
}
function initTableWidth(thisCs) {
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  if (total > windowWidth) {
    let f = 0
    if (visible.value) f = 260
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 40 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 40) + 'px')
  }
}
const handleSearch = async (val: string, type: string) => {
  if (!hasBlank(val)) {
    await fetch(val, type, getDataSource(), (d: any[]) => (cardListOptions.value = d));
  }
};
let timeout: any;
let currentValue = '';
async function fetch(value: string, type: string, filterList: any, callback: any) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;
  async function fake() {
    let res = assetsCardList.value.filter(it=>it[type == 'one'?'stockNum':type == 'two'?'stockName':'stockBarcode']?.indexOf(value) !=-1)
    let data:any = []
    res = res.filter(it => filterList.indexOf(it.stockNum) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'stockNum' :type == 'two'? 'stockName':'stockBarcode'],
        label: type !== 'three'?(r['stockNum'] + ' ' + r['stockName']):(r['stockBarcode']),
      });
    });
    callback(data);
  }
  timeout = setTimeout(fake, 300);
}
const openSetting = () => {
  openQueryPageM(true, {schemaName: dynamicTenantId.value})
}
const cunitFormat = (list,id) => {
  if (null == list || hasBlank(id)) return id;
  let it = list.filter(it=>it.value == id)[0]
  return  null == it?id:it.title
}
//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}
const resetRow = (record) => {
  record['key'] = record.lineCode
  let o:any = assetsCardList.value.filter(it => it.stockNum == record.cinvode )[0]
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  // 计量类型
  record.cunitType = o?.stockMeasurementType ==  '单计量'?'1':'0'
  if (record.cunitType == '0'){ //
    let res =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
    if (res != null) {
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      record.unitList = list.map(it=>{it.value=it.id;it.title=it.unitName;it.ggxh='';it.txm ='';return it;})
      if (list.length > 0) {
        record.unitList[0].ggxh = o?.stockGgxh
        record.unitList[0].barcode = o?.stockBarcode
        if (list.length > 1) {
          record.unitList[1].ggxh = o?.stockUnitGgxh1
          record.unitList[1].barcode = o?.stockUnitBarcode1
          if (list.length > 2){
            record.unitList[2].ggxh = o?.stockUnitGgxh2
            record.unitList[2].barcode = o?.stockUnitBarcode2
          }
        }
      }
    }
  }else {
    let res:any = jiList.value.filter(it => it.id == o?.stockMeasurementUnit)[0]
    if (null !=  res && res.length >0){
      record.unitInfo = res[0]
      record.unitList = res.map(it=>{it.value=it.id;it.title=it.unitName;it.ggxh=o?.stockGgxh;it.txm =o?.stockBarcode;return it;})
    }
  }
  record.isBatch = o?.stockPropertyBatch == '1'
  return record;
}
async function tempTaskDel(id) {
  await useRouteApi(stockTaskDelById, { schemaName: dynamicTenantId })(id)
}
async function tempTaskSave(method) {
  await useRouteApi(stockBalanceTaskSave, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'销售送货物流单',method:method,recordNum:formItems.value.ccode,caozuoModule:'stock'})
    .then((a)=>{
      taskInfo.value=a
      console.log('任务='+JSON.stringify(a))
    })
}
async function generateCode(date) {
  return await useRouteApi(findNewWuLiuCode, {schemaName: dynamicTenantId})({
    type: "CGWLD",
    date: date,
    prefix: "",key: '3-12'
  })
}
const getCurrSummary  = () => {
  return (getColumns().filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = () => {
  let list = JsonTool.parseProxy(getDataSource().filter(it=>!hasBlank(it.cinvode)))
  if (list.length == 0){
    summary.value = {}
    return false;
  }
  let cnumber = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    cnumber+=parseFloat(e['cnumber'] || 0)
  }
  summary.value={
    cnumber: cnumber==0?null:cnumber,
  }
}
// 参照
function referData() {
  if(hasBlank(formFuns.value.getFormValue().cvencode)){
    return message.error('请选择客户!')
  }
  openReferPage(true, {
    dynamicTenantId:dynamicTenantId.value,
    dynamicAccId:dynamicAccId.value,
    cvencode:formFuns.value.getFormValue().cvencode,
    iyear:formFuns.value.getFormValue().ddate.split('-')[0]
  })
}
// 参照回调
function referThrowData(data) {
  referTableSelectedRowObjs.value=[]
  canzhao.value=true
  // 重新生成的表单
  let resetList=data.resetList
  // 参照勾选的数据
  referTableSelectedRowObjs.value=data.tableSelectedRowObjs

  tempType.value='one'
  for (let i = 0; i < resetList.length; i++) {
    let b=resetList[i]
    findByUnitList(b)
  }
  for (let i = resetList.length; i < 50; i++) {
    data.resetList.push({})
  }
  setTableData(data.resetList)
}
const findByUnitList = async (record) => {
  let o:any = assetsCardList.value.filter(it => tempType.value=='one'?(it.stockNum == record.cinvode) :tempType.value=='three'? (it.stockBarcode == record.bcheck1) : (it.stockName == record.cinvodeName))[0]
  record.unitList=[]
  record.cinvodeInfo = o
  record.cinvodeName = o?.stockName
  record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  // 计量类型
  record.cunitType = o?.stockMeasurementType == '单计量'?'1':'0'
  record.cunitid = o?.stockUnitId // 主计量
  record.isBatch = o?.stockPropertyBatch == '1' // 批号必须输入
  record.isIndate = o?.stockIndateManage == '1' // 有效期必须输入
  if (o?.stockMeasurementType == '多计量' && !hasBlank(o?.stockMeasurementUnit)){
    let res:any =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
    if (res != null){
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      list=list.filter(jl=>!hasBlank(jl.unitName))
      if (list.length > 0){
        if(!hasBlank(o?.stockUnitName)){
          let conversionRate= list.filter(j=>j.unitName==o?.stockUnitName)[0]?.conversionRate
          record.unitList=[{title:o?.stockUnitName,value:o?.stockUnitId,ggxh:o?.stockGgxh,txm:o?.stockBarcode,conversionRate:conversionRate}]
        }
        else{
          // 可能是之前的存货档案,也可能是导入进来的
          let res:any =  manyJiList.value.filter(it=>it.id == o?.stockMeasurementUnit)[0]
          if (res != null){
            let list = JsonTool.parseObj(res.detail) || []
            list=list.filter(jl=>!hasBlank(jl.unitName))
            for (let i = 0; i < list.length; i++) {
              if(i==0){
                record.unitList.push({title:list[i].unitName,value:list[i].id,ggxh:o?.stockGgxh,txm:o?.stockBarcode})
              }else{
                record.unitList.push({title:list[i].unitName,value:list[i].id,ggxh:'',txm:''})
              }
            }
            record.cgUnitId=record.unitList[0].value
            record.tempCgUnitId=record.cgUnitId
          }
        }
        if (list.length ==2) {
          record.cunitidF1 = list[1].id
          record.rate1 = list[1].conversionRate
          if (!hasBlank(o?.stockUnitName1)) {
            record.unitList.push({
              title: o?.stockUnitName1,
              value: o?.stockUnitId1,
              ggxh: o?.stockUnitGgxh1,
              txm: o?.stockUnitBarcode1,
              conversionRate:list[1].conversionRate
            })
          }
        } else if (list.length ==3){
          record.cunitidF1 = list[1].id
          record.cunitidF2 = list[2].id
          record.rate1 = list[1]?.conversionRate
          record.rate2 = list[2]?.conversionRate
          if(!hasBlank(o?.stockUnitName2)){
            record.unitList.push({
              title: o?.stockUnitName1,
              value: o?.stockUnitId1,
              ggxh: o?.stockUnitGgxh1,
              txm: o?.stockUnitBarcode1,
              conversionRate:list[1].conversionRate
            })
            record.unitList.push({title:o?.stockUnitName2,value:o?.stockUnitId2,ggxh:o?.stockUnitGgxh2,txm:o?.stockUnitBarcode2,conversionRate:list[2].conversionRate})
          }
        }
      }
    }
  }
  else{
    let djl= await useRouteApi(singleUnitOfMea, {schemaName: dynamicTenantId})('')
    if(djl.length>0){
      let djlData=djl.filter(a=>a.id==o?.stockMeasurementUnit)[0]
      record.unitList.push({title:djlData?.unitName,value:djlData?.id,ggxh:o?.stockGgxh,txm:o?.stockBarcode})
      record.tempCgUnitId=djlData?.id
      record.cgUnitId=record.tempCgUnitId
    }
  }
  if(record.unitList.length>0&&!canzhao.value){
    // 存货档案中采购单位
    if(hasBlank(record.cinvodeInfo.stockPurchaseUnit)){
      record.cgUnitId=record.unitList[0].value
    } else{
      let data=record.unitList.filter(a=>a.value==record.cinvodeInfo.stockPurchaseUnit)[0]
      record.cinvodeType = data?.ggxh // 规格型号
      record.bcheck1 = data?.txm // 条形码
      record.cgUnitId=record.cinvodeInfo.stockPurchaseUnit
    }
    record.tempCgUnitId=record.cgUnitId
  }
}
async function cgUnitIdChange(record) {
  record.cinvodeType= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].ggxh
  record.bcheck1= record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].txm
  record.cgUnitId=record.unitList.filter(a=>a.value==record.tempCgUnitId)[0].value
  findByResetCnumber(record)
}
// 重新计算数量
const findByResetCnumber = (record) => {
  let conversionRate=JsonTool.parseObj(record.unitInfo.detail).filter(tx=>tx.id==record.cgUnitId)[0].conversionRate
  record.baseQuantity=parseFloat(record.cnumber)*conversionRate
}
// 保存
async function saveData() {
// 结账操作
  let jzMethod= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'月末结账',method:'结账'})
  if(!hasBlank(jzMethod)){
    status.value = 3
    return message.error('提示：操作员'+jzMethod.caozuoName+'正在对当前账套进行月末结账处理，不能进行单据新增操作，请销后再试！')
  }
  let date = useCompanyOperateStoreWidthOut().getLoginDate
  // 日期是否已结账
  let temp=await useRouteApi(findByStockPeriodIsClose, {schemaName: dynamicTenantId})({iyear:date.split('-')[0],month:date.split('-')[1]})
  if(temp>0){
    status.value = 3
    return message.error('当前业务日期期间已经结账，不能进行单据新增操作，请取消结账后后重试！！')
  }

  let id = formItems.value.id
  formItems.value = formFuns.value.getFormValue()
  formItems.value.id = id
  if(status.value==1){
    formItems.value.ccode =  await generateCode(useCompanyOperateStoreWidthOut().getLoginDate)
  }
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.billStyle = pageParameter.type // 制单人
  formItems.value.bdocumStyle = "0"
  formItems.value.stockSaleousingCode = referTableSelectedRowObjs.value.map(tx=>tx.ccode).join(',')

  if(formItems.value.deliveryName==undefined){
    return message.error('送货人不能为空！！')
  }

  // 修改统一出库单主表-物流单、日期、备注
  let map={deliveryDate:formItems.value.ddate,deliveryId:formItems.value.ccode,deliveryExplain:hasBlank(formItems.value.cmemo)?"":formItems.value.cmemo,ccode:referTableSelectedRowObjs.value.map(tx=>tx.ccode).join(',')}
  await useRouteApi(editStockSaleousingDelivery, {schemaName: dynamicTenantId})(map)

  let list = getDataSource().filter(it =>!hasBlank(it.cinvode))
  formItems.value.entryList = JsonTool.json(list)
  if (formItems.value?.id == null){
    formItems.value.ccode = await generateCode(formItems.value.ddate)
  }
  await useRouteApi(stockWuLiuSave, {schemaName: dynamicTenantId})(formItems.value)
  // 送货人
  await useRouteApi(wuliuSongHuoSave, {schemaName: dynamicTenantId})({ccode:formItems.value.ccode,iyear:dynamicYear.value,person:hasBlank(formItems.value.deliveryName)?"":formItems.value.deliveryName.join(',')})

  // 添加出库单物流单信息
  let map2={
    deliveryDate:formItems.value.ddate,
    deliveryId:formItems.value.ccode,
    deliveryExplain:hasBlank(formItems.value.cmemo)?"":formItems.value.cmemo,
    ccode:formItems.value.stockSaleousingCode
  }
  await useRouteApi(editStockSaleousingDelivery, {schemaName: dynamicTenantId})(map2)
  tempTaskDel(taskInfo.value?.id)
  message.success('保存成功！')
  await pageReload()
  status.value = 3
}
const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '暂无任何单据！'
    })
  } else {
    tempTaskSave('删除')
    createConfirm({
      iconType: 'warning',
      title: '销售送货物流单删除',
      content: '您确定要进行销售送货物流单删除吗!',
      onOk: async () => {
        await useRouteApi(wuliuDel, {schemaName: dynamicTenantId})({id: formItems.value.id})
        delXyData()
        // 送货人
        await useRouteApi(delByWuliuSongHuoCode, {schemaName: dynamicTenantId})(formItems.value.ccode)

        // 清空出库单物流信息
        let map2={
          deliveryDate:'',
          deliveryId:'',
          deliveryExplain:'',
          ccode:formItems.value.stockSaleousingCode
        }
        await useRouteApi(editStockSaleousingDelivery, {schemaName: dynamicTenantId})(map2)
        tempTaskDel(taskInfo.value?.id)
        message.success('删除成功！')
        await contentSwitch('tail','')
      },onCancel: () => {
        tempTaskDel(taskInfo.value?.id)
        return false
      }
    });
  }
}
// 添加下游表
async function setXyData() {
  for (let i = 0; i < formItems.value.stockSaleousingCode.split(',').length; i++) {
      let map={ccode:formItems.value.ccode,billStyle:'CGWLD',xyBillStyle:'XSCKD',xyCcode:formItems.value.stockSaleousingCode.split(',')[i],xyCcodeDate:'',iyear:dynamicYear.value}
      await useRouteApi(wuliuCsourceSave, {schemaName: dynamicTenantId})(map)
  }
}
// 删除下游表
async function delXyData() {
  await useRouteApi(wuliuCsourceDel, {schemaName: dynamicTenantId})({ccode:formItems.value.ccode})
}
const startReview = async (b) => {
  if(formItems.value.bcheck=='1'&&b){
    message.error('此单据已审核！')
    return false
  }
  loadMark.value=true
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id))  {
    tempTaskSave('新增')

    // 审核、弃审
    let bcheck=b?'1':'0'
    let bcheckTime=b?new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "):''
    let sql="update stock_wuliu set bcheck='"+bcheck+"',bcheck_time='"+bcheckTime+"' where ccode='"+formItems.value.ccode+"'  "
    await useRouteApi(company_executeSQL, {schemaName: dynamicTenantId})(sql)

    if(b){
      setXyData()
    }else{
      delXyData()
    }

    tempTaskDel(taskInfo.value?.id)
    message.success(`${b?'审核':'弃审'}成功！`)
    pageParameter.type='CGWLD'
    loadMark.value=false
    await pageReload()
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}

const showSearch=ref(false)
const searchData = ref({
  year: '',
  type: pageParameter.type,
  qValue: '',
  style: '0',
  model: 'WL',
})
const toReceipt = async (v) => {
  nextTick(async ()=>contentSwitch('tail',v))
}

import { onBeforeRouteLeave } from 'vue-router'
// 监听路由离开
onBeforeRouteLeave(giveUp)
</script>
<style lang="less" scoped="scoped">
@Global-Border-Color: #c9c9c9; // 全局下划线颜色
@Global-Label-Color: #666666; // 全局#c9c9c9颜色
@Global-Comm-BcOrText-Color: #0096c7; // 全局#c9c9c9颜色
.app-container {
  padding: 10px;
  background-color: #b4c8e3;
  margin: 0;

  .app-container-top {
    background-color: #f1f1f1;
    border-radius: 5px 5px 0 0;
    padding: 10px;

    > div {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
    }

    .app-container-top-one {
      line-height: 40px;

      .act-one-d-img {
        width: 42px;
      }

      .act-one-d-left {

      }

      .act-one-d-title {
        .acto-d-title-span {
          color: @Global-Comm-BcOrText-Color;
          font-weight: bold;
          font-size: 24px;
        }
      }

      .act-one-d-btn-group {
        text-align: right;

        .actod-btn {
          color: @Global-Comm-BcOrText-Color;
          font-size: 14px;
          border-color: @Global-Border-Color;
          border-right: none;
        }

        .actod-btn-last {
          border-right: 1px solid @Global-Border-Color;
        }

        .actod-btn:hover {
          background-color: @Global-Comm-BcOrText-Color;
          color: white;
        }
      }
    }

    .app-container-top-two {
      font-size: 14px;
      line-height: 32px;

      .act-two-d-left {

      }

      .act-two-d-center {
        .acttdrd-search-select {
          width: 120px;

          :deep(.ant-select-selector) {
            border-color: @Global-Border-Color;
            border-radius: 2px 0 0 2px;
          }
        }
      }

      .act-two-d-right {
        display: inline-flex;
        justify-content: space-between;

        .acttd-right-d-search {
          .acttdrd-search-select {
            width: 120px;

            :deep(.ant-select-selector) {
              border-color: @Global-Border-Color;
              border-radius: 2px 0 0 2px;
            }
          }

          .acttdrd-search-input {
            width: 180px;
            border-radius: 0 2px 2px 0;
            border-color: @Global-Border-Color;
            border-left: none;
          }
        }

        .acttd-right-d-btns {
          margin-left: 10px;

          .acttdrd-btn {
            border-color: @Global-Border-Color;
            margin-left: 2px;
          }
        }
      }
    }
  }

  .app-container-bottom {
    background-color: white;

    .acb-head {
      .acbgead-one {
        text-align: center;
        height: 60px;
        line-height: 60px;

        .acbgead-one-triangle {
          > div:nth-of-type(1) {
            width: 0px;
            height: 0px;
            border-top: 60px solid #5141d7;
            border-right: 70px solid transparent;
            position: absolute;
          }

          > div:nth-of-type(2) {
            width: max-content;
            color: #fff;
            transform: rotate(-45deg) translateY(-2px) translateX(10px);
            position: absolute;
          }
        }

        .acbgead-one-changes {
          > span {
            cursor: pointer;
          }

          > span:hover {
            color: black;
          }
        }

        > div:nth-of-type(2) {
          display: inline-block;
          float: left;
          margin-left: 4%;
          font-weight: bold;
          font-size: 24px;
          color: #666666;
        }
      }

      .acbgead-two {
        margin: 0 5rem;
      }
    }

    .acb-centent {
      margin: 0 4%;

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
          width: 39%;
          text-align: center;
        }

        > div:nth-of-type(2) {
          width: 10%;
          margin: 0 1px;
          text-align: left;
        }
        > div:nth-of-type(3) {
          width: 10%;
          text-align: left;
          margin: 0 1px;
        }
        > div:nth-of-type(4) {
          width: 10%;
          margin: 0 1px;
          text-align: left;
        }
        > div:nth-of-type(5) {
          width: 17%;
          margin: 0 1px;
          text-align: left;
        }
        > div:nth-of-type(6) {
          width: 13%;
          margin: 0 1px;
          text-align: left;
        }
      }
    }


  }

  .status-look {
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
.lanmu-table{
  :deep(.ant-table-content){
    .ant-table-thead{
      tr{
        th{
          padding: 5px 8px !important;
          text-align: center !important;
        }
      }
    }
    .ant-table-tbody{
      tr{
        td{
          padding:0 5px !important;
          font-size: 12px !important;
          .ant-radio-button-wrapper{
            font-size: 12px;
          }
        }
      }

    }
  }
}
.suspended-div {
  width: 100%;
  height: 22px;

  .anticon-form {
    float: right;
    line-height: 22px;
    display: none;
  }
}
.suspended-div:hover {
  cursor: text;
  background-color: #e4e7e7;
  .anticon-form {
    display: block;
  }
}
</style>
<style lang="less" scoped>
@import '/@/assets/styles/global-menu-index1.less';
.lcr-theme-div{
  display: inline-flex;justify-content: space-between;width: 100%;height: 100px;
  >div:nth-of-type(1){
    width: 40%;
    position: relative;
    display: block;
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;    top: 12px;
      position: inherit
    }
    >div:nth-of-type(2){

      width: calc( 100% - 64px);display: inline-block;
      :deep(.account-picker){
        .ap-title,.thisNameSpan{
          color: white !important;
        }
      }
    }
  }
  >div:nth-of-type(2){
    width: 20%;text-align:center;
    >div:nth-of-type(2){margin-top: 14px;}
  }
  >div:nth-of-type(3){
    width: 40%;text-align: right;
    display: block;
    >div:nth-of-type(1){
      .actod-btn {
        color: @Global-Comm-BcOrText-Color;
        font-size: 14px;
        margin: 0 1px 0 0;
      }

      .actod-btn-last {
        border-right: 1px solid @Global-Border-Color;
      }

      .actod-btn:hover {
        background-color: @Global-Comm-BcOrText-Color;
        color: white;
        font-weight: bold;
        border: 1px solid white;
      }
    }
    >div:nth-of-type(2){
      display: inline-flex;justify-content: space-between;margin-top: 15px;
      .acttd-right-d-search {
        .acttdrd-search-select {
          width: 120px;

          :deep(.ant-select-selector) {
            border-color: @Global-Border-Color;
            border-radius: 2px 0 0 2px;
          }
        }

        .acttdrd-search-input {
          width: 180px;
          border-radius: 0 2px 2px 0;
          border-color: @Global-Border-Color;
          border-left: none;
        }
      }

      .acttd-right-d-btns {
        margin-left: 10px;

        .acttdrd-btn {
          color: @Global-Comm-BcOrText-Color;
          margin-left: 2px;
        }
        .acttdrd-btn:hover{
          border-color: #ffffff;
          color: #ffffff;
          background-color: @Global-Comm-BcOrText-Color;
        }
      }
    }
  }
}
</style>
