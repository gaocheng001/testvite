<template>
  <div>
    <div class="app-container" style="display:flex;">
      <div style="width: 64px;display: inline-block;float: left;margin-top: 10px;">
        <ReconciliationOutlined style="color: #0096c7;font-size: 60px;"/>
      </div>
      <div style="width: calc( 100% - 74px);display: inline-block;">
        <div class="app-container-head">
          <div class="container-head-title" style="width: 50%;float: left;text-align: left;">
            <AccountPicker  theme="three" :readonly="!btnShow" @reloadTable="dynamicAdReload"/>
            <span style="font-size: 24px;color: #0096c7;font-weight: bold;float: right;margin-top: -27px;">库存期初余额</span>
          </div>
          <div class="ant-btn-group" data-v-a1ccd506="" style="float: right">
            <button
              style="float: left"
              type="button"
              class="ant-btn ant-btn-me"
              @click="editflg(edittext)"
            ><span>{{ edittext }}</span></button>
            <span v-if="btnShow">
            <button type="button" class="ant-btn ant-btn-me" @click="addFirstFun"><span>新增</span></button>
            <button type="button" class="ant-btn ant-btn-me" @click="editFun" :disabled="editAndDelBtnShow"><span>修改</span></button>
            <button type="button" class="ant-btn ant-btn-me" @click="delFun" :disabled="editAndDelBtnShow"><span>删除</span></button>
            <a-popover trigger="hover" placement="bottom">
               <template #content>
                 <button type="button" class="ant-btn ant-btn-me" @click="auditFun"><span>审核</span></button><br>
                  <button type="button" class="ant-btn ant-btn-me" @click="audit('0')"><span>弃审</span></button>
               </template>
              <button type="button" class="ant-btn ant-btn-me"><span>审核</span></button>
            </a-popover>
             <a-popover trigger="hover" placement="bottom">
               <template #content>
                 <button type="button" class="ant-btn ant-btn-me" @click="auditAll('1')"><span>批量审核</span></button><br>
                  <button type="button" class="ant-btn ant-btn-me" @click="auditAll('0')"><span>批量弃审</span></button>
               </template>
              <button type="button" class="ant-btn ant-btn-me"><span>批审</span></button>
            </a-popover>
            <a-popover placement="bottom" trigger="click">
               <template #content>
                 <button type="button" class="ant-btn ant-btn-me" @click="jieZhuanView" style="width: 100px;">结转现存量</button><br>
                 <button type="button" class="ant-btn ant-btn-me" @click="openJiezhuan" style="width: 100px;">结转单据</button><br>
                <button type="button" class="ant-btn ant-btn-me" style="width: 100px;"><span>校验</span></button>
               </template>
              <button type="button" class="ant-btn ant-btn-me"><span>更多</span></button>
            </a-popover>
          </span>
            <button type="button" class="ant-btn ant-btn-me" @click="balanceTaskDel(),closeCurrent(),router.push('/zhongZhang/home/welcome')"><span>退出</span></button>
          </div>
          <div class="container-head-title" style="float:left;width: 50%;margin-left: 12px;color: rgb(102,102,102);font-size: 14px;font-weight: bold">
          <span style="float: left;">
            仓库：
              <a-select
                show-search
                v-model:value="pageParameter.stockCangkuId"
                :filter-option="filterOption"
                style="width: 300px;text-align: center;"
                @change="pageReload"
              >
                <a-select-option value="" key="">全部</a-select-option>
                <a-select-option :value="data.id" :key="data.id" :data="data" v-for="data in cangkuList">{{ data.ckName }}</a-select-option>
                <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
              </a-select>
          </span>
            <span style="float: right;">
            <label>年度：</label>
            <a-select
              v-model:value="pageParameter.iyear"
              style="width: 100px;text-align: center;"
              @change="pageReload"
            >
                <a-select-option v-for=" item in iyearList" :value="item">{{ item }}</a-select-option>
                <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
              </a-select>
          </span>
          </div>
          <div style="float: right; margin-left: 10px">
            <a-select
              v-model:value="pageParameter.searchConditon.requirement"
              style="width: 150px;font-size: 12px;"
            >
              <a-select-option value="stockNum" >存货编码</a-select-option>
              <a-select-option value="stockName" >存货名称</a-select-option>
              <a-select-option value="stockGgxh" >规格型号</a-select-option>
              <a-select-option value="batchNumber" >批次号</a-select-option>
              <a-select-option value="stockBarcode" >条形码</a-select-option>
            </a-select>
            <a-input-search
              placeholder=""
              v-model:value="pageParameter.searchConditon.value"
              @search="reload"
              style="width: 150px; border-radius: 4px"
            />
            <a-button @click="pageReload">
              <SyncOutlined :style="{ fontSize: '14px' }" />
            </a-button>
            <a-button v-if="btnShow" @click="improtExcelFun" title="导入">
              <CloudUploadOutlined :style="{ fontSize: '14px' }"/>
            </a-button>
            <a-button @click="excelFun" title="导出">
              <CloudDownloadOutlined :style="{ fontSize: '14px' }"/>
            </a-button>
            <a-popover placement="bottom" v-model:visible="visible">
              <template #content>
                <DynamicColumn :defaultData="initDynamics()['DATA']" :dynamicData="dynamicColumnModel" :lanmuInfo="lanMuData" @reload="reloadColumns"/>
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
      <PageWrapper dense content-full-height fixed-height content-class="flex">
        <div class="bg-white m-4 mr-0 overflow-hidden" style="margin-top: -0.5px;margin-left: -5px;">
          <div style="width: 100%; height: 24px;background-color: #d9d9d9;padding-left:10px;font-weight: bold;text-align: center;">
            存货分类
          </div>
          <BasicTree
            defaultExpandAll
            :click-row-to-expand="false"
            :tree-data="treeData"
            v-if="treeData.length"
            v-model:selectedKeys="selectedKeys2"
            @select="handleSelect"
            style="text-align: left;"
          />
        </div>
        &nbsp;
        <div style="width: calc(100% - 250px); float: right;">
          <BasicTable @register="registerTable" :class="
            pageParameter.showRulesSize == 'MAX' ? 'a-table-font-size-16' : 'a-table-font-size-12'
          " @selection-change="selectionChange"
            @fetch-success="fetchSuccess"
            @row-click="rowClick"
            :scroll="{ x: totalColumnWidth,y: windowHeight }"
            ref="tableRef"
          >
            <template #bcheck="{ record }">
              <span v-if="record.bcheck!=='11'">
                <a-tag :color="record.bcheck === '1' ? 'green' : 'volcano'">
                  {{ record.bcheck === '1' ? '已审核' : '未审核' }}
                </a-tag>
              </span>
            </template>
            <template #cnumber="{ record }">
              {{ toThousandFilter(record.cnumber) }}
            </template>
            <template #price="{ record }">
              {{ toThousandFilter(record.price) }}
            </template>
            <template #icost="{ record }">
              {{ toThousandFilter(record.icost) }}
            </template>
            <template #baseQuantity="{ record }">
              {{ record.baseQuantity>0?parseFloat(record.baseQuantity).toFixed(2):'' }}
            </template>
            <template #subQuantity1="{ record }">
              {{ record.subQuantity1>0?toThousandFilter(record.subQuantity1):'' }}
            </template>
            <template #subQuantity2="{ record }">
              {{ record.subQuantity2>0?toThousandFilter(record.subQuantity2):'' }}
            </template>
            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                  <TableSummaryCell class="nc-summary" :index="0" :align="'center'" style="border-right: none;">合</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="1" :align="'center'" style="border-right: none;">计</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" style="border-right: none;" v-for="cell in getCurrSummary()"  :index="cell.ind" :align="cell.align"><span class="a-table-font-arial">{{null == summaryTotals[cell.dataIndex]?'':summaryTotals[cell.dataIndex]}}</span></TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>
          </BasicTable>
          <div class="pagination-text" :style="{top: (windowHeight+60)+'px'}" v-show="showPaginationText">
            {{`共 ${paginationNumber}条记录&emsp;每页 200 条`}}
          </div>
        </div>
      </PageWrapper>
    </div>
    <Add @save="pageReload" @closeOk="pageReload" @register="registerSavePage" />
    <Edit @save="pageReload" @closeOk="pageReload" @register="registerEditPage" />
    <Lack @register="registerLackPage" />
    <ImprotExcel @save="pageReload" @closeOk="pageReload" @register="registerImprotExcelPage" />
    <SaveFirstModal @save="saveFirstModalFun" @register="registerSaveFirstModalPage" />
    <StockPeriod  @register="registerModalPopPage"/>
    <JieZhuan @save="jieZhuanFun" @register="registerJieZhuanPopPage"/>
  </div>
</template>
<script setup lang="ts">
import router from "/@/router";
import {BasicTable, useTable} from '/@/components/Table';
import {
  ReconciliationOutlined,
  CaretDownOutlined,
  CheckOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  SettingFilled,
  ShoppingCartOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SyncOutlined
} from '@ant-design/icons-vue';
import {
  Input as AInput,
  Popover as APopover,
  Radio as ARadio,
  Select as ASelect,
  Statistic as AStatistic,
  Table as ATable,
  Tabs as ATabs,
  Tag as ATag,
} from 'ant-design-vue';
import {computed, reactive, ref} from 'vue';
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useTabs} from "/@/hooks/web/useTabs";
import {useMessage} from "/@/hooks/web/useMessage";
import {BasicTree} from '/@/components/Tree';
import {PageWrapper} from '/@/components/Page';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {
  auditStockBalance,
  delStockBalance,
  findAllStockBalance,
  getByStockBalanceTask,
  stockBalanceTaskDelByUserName,
  stockBalanceTaskEditNewTime,
  stockBalanceTaskSave
} from "/@/api/record/stock/stock_balance";
import {useUserStoreWidthOut} from '/@/store/modules/user';
import {GetStockClassTree} from "/@/api/record/stock/stock_class";
import {useModal} from "/@/components/Modal";
import Add from '/@/views/boozsoft/stock/stock_balance/popup/save.vue';
import Edit from '/@/views/boozsoft/stock/stock_balance/popup/edit.vue';
import Lack from '/@/views/boozsoft/stock/stock_balance/popup/lack.vue';
import JieZhuan from '/@/views/boozsoft/stock/stock_balance/popup/jieZhuan.vue';
import ImprotExcel from '/@/views/boozsoft/stock/stock_balance/popup/improtExcel.vue';
import SaveFirstModal from '/@/views/boozsoft/stock/stock_balance/popup/saveFirstModal.vue';
import {findAll as stockCangkuAll} from "/@/api/record/stock/stock-cangku";
import {findPeriodIyearByUniqueCode} from "/@/api/record/system/account";
import {assemblyDynamicColumn, initDynamics} from "/@/views/boozsoft/stock/stock_balance/data";
import StockPeriod from "/@/views/boozsoft/stock/stock-xiaohuo-list/popup/StockPeriod.vue";
import {exportExcel3} from "/@/api/record/generalLedger/excelExport";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {verifyStockXCLList} from "/@/api/record/stock/stock-currents";
import DynamicColumn from "/@/views/boozsoft/stock/stock_sales_add/component/DynamicColumn.vue";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import {onBeforeRouteLeave} from 'vue-router'

// 全局常量
const summaryTotals = ref({})
const databaseName = ref('');
const treeData:any = ref([]);
const selectedKeys2:any = ref<string[]>([])
const {createConfirm, createWarningModal, createMessage} = useMessage();
const ASelectOption = ASelect.Option;
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const AInputSearch = AInput.Search;
const AStatisticCountdown = AStatistic.Countdown;
const ATabPane = ATabs.TabPane;
const TableSummary = ATable.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell

const windowHeight =(window.innerHeight - (330))
const database = ref(getCurrentAccountName(true));
const accId = ref('');
const dynamicTenant:any = ref('');
const iyear = ref('');
const iyearList = ref([]);
const edittext = ref('编辑');
const editAndDelBtnShow = ref(false);
const btnShow = ref(false);
const tableData = ref([])
const cangkuList:any = ref([])
// 1独立仓库、2级别仓库
const cangkuFlag = ref('1')
const stockCangkuIdModal = ref('')
const CrudApi = {
  columns: [
    {
      title: '状态',
      dataIndex: 'bcheck',
      slots: { customRender: 'bcheck' },
      ellipsis: true,
      align: 'center',
    },
    {
      title: '仓储位置',
      dataIndex: 'cwhcodeJoin',
      ellipsis: true,
      align: 'left',
    },
    {
      title: '条形码',
      dataIndex: 'stockBarcode',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '存货编码',
      dataIndex: 'stockNum',
      ellipsis: true,
      align: 'left',
    },
    {
      title: '存货名称',
      dataIndex: 'stockName',
      ellipsis: true,
      align: 'left',
    },
    {
      title: '规格型号',
      dataIndex: 'stockGgxh',
      ellipsis: true,
      align: 'left',
    },
    {
      title: '主计量',
      dataIndex: 'stockUnitName',
      ellipsis: true,
      align: 'center',
    },{
      title: '计量1',
      dataIndex: 'stockUnitName1',
      ellipsis: true,
      align: 'center',
    },{
      title: '计量2',
      dataIndex: 'stockUnitName2',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '主数量',
      dataIndex: 'baseQuantity',
      slots: { customRender: 'baseQuantity' },
      ellipsis: true,
      align: 'right',
    },{
      title: '数量1',
      dataIndex: 'subQuantity1',
      slots: { customRender: 'subQuantity1' },
      ellipsis: true,
      align: 'right',
    },{
      title: '数量2',
      dataIndex: 'subQuantity2',
      slots: { customRender: 'subQuantity2' },
      ellipsis: true,
      align: 'right',
    },
    {
      title: '单价',
      dataIndex: 'price',
      slots: { customRender: 'price' },
      ellipsis: true,
      align: 'right',
    },
    {
      title: '无税金额',
      dataIndex: 'icost',
      slots: { customRender: 'icost' },
      ellipsis: true,
      align: 'right',
    },
    {
      title: '批号',
      dataIndex: 'batchNumber',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '生效日期',
      dataIndex: 'dpdate',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '失效日期',
      dataIndex: 'dvdate',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '入库单号',
      dataIndex: 'stockRukuNumber',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '入库日期',
      dataIndex: 'stockRukuDate',
      ellipsis: true,
      align: 'center',
    },{
      title: '录入人',
      dataIndex: 'username',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '审核人',
      dataIndex: 'bcheckUserName',
      ellipsis: true,
      align: 'center',
    }
  ]
}
const pageParameter:any = reactive({
  showRulesSize:'MIN',
  stockClass:'',
  stockCangkuId:'',
  iyear:'',
  searchConditon: {
    requirement: 'stockNum',
    value: '',
  },
})
const val = {
  openOne: 0
}
const visible = ref(false);
const modelLoading = ref(true);
const modelText = ref('');
const modelText1 = ref('');
const modelText2 = ref('');

const { closeCurrent } =useTabs();
const [registerSavePage, { openModal: openSavePage }] = useModal();
const [registerEditPage, { openModal: openEditPage }] = useModal();
const [registerLackPage, { openModal: openLackPage }] = useModal();
const [registerImprotExcelPage, { openModal: openImprotExcelPage }] = useModal();
const [registerJieZhuanPopPage, { openModal: openJieZhuanPage }] = useModal();
const [registerSaveFirstModalPage, { openModal: openImprotSaveFirstModalPage }] = useModal();

const rowSelection = {
  getCheckboxProps: (record) => ({
    disabled:  record.id==undefined
  }),
};

// 这是示例组件
const [registerTable, { reload,getSelectRows,getDataSource,setTableData,setColumns,clearSelectedRowKeys,getColumns,deleteSelectRowByKey }] = useTable({
  api:useRouteApi(findAllStockBalance, { schemaName: database }),
  columns: CrudApi.columns,
  bordered: true,
  indexColumnProps:{ fixed:true },
  rowSelection: { type: 'checkbox' ,getCheckboxProps:rowSelection.getCheckboxProps},
  pagination:{ pageSize: 200, simple:true},
  searchInfo: pageParameter
});

const getCurrSummary  = () => {
  return (getColumns().filter(it=>it.title != '序号' && it.ifShow).map((it,ind)=>{it['ind']=ind+2;return it;}))
}
const calculateTotal = (data) => {
  let list = JsonTool.parseProxy(data.filter(it=>!hasBlank(it.stockNum)))
  if (list.length == 0){
    summaryTotals.value = {}
    return false;
  }
  let baseQuantity = 0
  let subQuantity1 = 0
  let subQuantity2 = 0
  let icost = 0
  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    baseQuantity+=parseFloat(e['baseQuantity'] || 0)
    subQuantity1+=parseFloat(e['subQuantity1'] || 0)
    subQuantity2+=parseFloat(e['subQuantity2'] || 0)
    icost+=parseFloat(e['icost'] || 0)
  }
  summaryTotals.value={
    baseQuantity: parseFloat(baseQuantity).toFixed(2),
    subQuantity1: subQuantity1==0?'':parseFloat(subQuantity1).toFixed(2),
    subQuantity2: subQuantity2==0?'':parseFloat(subQuantity2).toFixed(2),
    icost: toThousandFilter(icost),
  }
}

let num = 0
const dynamicAdReload = async (obj) => {
  if(obj==undefined || obj==null || obj==''){
    return createWarningModal({ content: '账套没有授权,不能查询!' });
  }
  dynamicTenant.value=obj
  accId.value=obj.accId
  iyear.value=obj.year
  database.value=obj.accountMode
  cangkuList.value=[]
  pageParameter.stockCangkuId=''
  getPeriodIyear(obj.target.id)
  findAllStockCangku()
  if (num == 0) initTable()
  num+=1
}
async function getPeriodIyear(id) {
  iyearList.value=await findPeriodIyearByUniqueCode(id)

  let iyear=useCompanyOperateStoreWidthOut().getLoginDate.split('-')[0]
  let temp=iyearList.value.filter(a=>a==iyear)
  let newIyear=temp.length>0?temp[0]:iyearList.value[iyearList.value.length-1]
  pageParameter.iyear=newIyear
}
function pageReload() {
  clearSelectedRowKeys()
  findAllStockCangku()
}
async function editflg(text) {
  if(iyear.value=='' || iyear.value==undefined){
    return createWarningModal({ content: '请先选择年度!' });
  }
  if(text=='编辑'){
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: database })({iyear:iyear.value,name:'库存期初余额',method:'编辑'})
    if(taskData.length==0){
      balanceTaskSave()
    }else{
      // 任务不是当前操作员的
      if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
        return createWarningModal({ content: taskData[0]?.username+'正在编辑库存期初余额,不能同时进行操作！' });
      }else{
        await useRouteApi(stockBalanceTaskEditNewTime, { schemaName: database })(taskData[0]?.id)
      }
    }
    /************** 记录操作日志 ****************/
    saveLogData('编辑')
    /************** 记录操作日志 ****************/
  }else{
    balanceTaskDel()
  }
  btnShow.value=text=='编辑'?true:false
  edittext.value=text=='编辑'?'返回':'编辑'
}
async function balanceTaskDel() {
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: database })({iyear:iyear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'库存期初余额',method:'编辑'})
}
async function balanceTaskSave() {
  await useRouteApi(stockBalanceTaskSave, { schemaName: database })({iyear:iyear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'库存期初余额',method:'编辑'})
}
async function fetch() {
  const deptTree = await useRouteApi(GetStockClassTree,{schemaName: database})('')
  function a(customerTree) {
    customerTree.forEach((item) => {
      if (item.children != null) {
        a(item.children);
      }
      item.title = '[' + item.stockClass + '] ' + item.stockCclassName;
      item.key = item.uniqueStockclass;
    });
  }
  a(deptTree);
  treeData.value = []
  treeData.value.push({title: '全部',key:'0',children: deptTree})
  selectedKeys2.value=['0']
}
function handleSelect(obj) {
  if(obj.toString()!==''){
    selectedKeys2.value=obj
  }else if(obj.toString()==0){
    selectedKeys2.value=['0']
  }
  pageParameter.stockClass=obj.toString()==0?'':obj.toString()
  reload()
}

async function addFirstFun() {
  if(hasBlank(pageParameter.stockCangkuId)){
    openImprotSaveFirstModalPage(true,{
      cangkuList:cangkuList.value
    })
  }else{
    addFun()
  }
}
async function addFun() {
  openSavePage(true,{
    dynamicTenant:dynamicTenant.value,
    database:database.value,
    iyear:iyear.value,
    cangkuFlag:cangkuFlag.value,
    stockCangkuId:!hasBlank(pageParameter.stockCangkuId)?pageParameter.stockCangkuId:stockCangkuIdModal.value,
  })
}
function editFun() {
  if(getSelectRows().length!==1){
    return createWarningModal({ content: '请选择一条数据进行修改！' });
  }
  openEditPage(true,{
    dynamicTenant:dynamicTenant.value,
    database:database.value,
    iyear:iyear.value,
    cangkuFlag:cangkuFlag.value,
    tableData:getSelectRows()[0],
  })
}
async function delFun() {
  if(getSelectRows().length==0){
    return createWarningModal({ content: '至少选择一条数据进行删除！' });
  }
  saveLogData('删除')
  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: '删除后数据不能恢复，你确认要删除吗？',
    onOk: async () => {
      await useRouteApi(delStockBalance,{schemaName: database})({id:getSelectRows().map(a=>a.id)})
      pageReload()
    }
  })
}

//金额格式化
function toThousandFilter(num:any) {
  if (num=='' || num==null){
    return ''
  }
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

// 批量审核
async function auditAll(type) {
  let list=getDataSource().filter(a=>!hasBlank(a.id)&&(type=='1'?a.bcheck=='0':a.bcheck=='1'));
  if(list.length==0){
    return createWarningModal({ content: '没有要批审的数据！' });
  }
  let text=type=='1'?"审核":"弃审"

  let verifylist:any=[]
  for (let i = 0; i < list.length; i++) {
    let tx=list[i]
    let temp2:any={}
    temp2.iyear=tx.iyear
    temp2.stockNum=tx.stockNum
    temp2.stockName=tx.stockName
    temp2.stockGgxh=tx.stockBarcode
    temp2.cwhcode=tx.stockCangkuId
    temp2.batchId=tx.batchNumber
    temp2.dpdate=tx.dpdate
    temp2.dvdate=tx.dvdate
    temp2.baseQuantity=tx.baseQuantity
    temp2.lackBaseQuantity=''
    temp2.unitName=tx.stockUnitName
    verifylist.push(temp2)
  }

  //  弃审
  if(type=='0'){
    // 现存量 不足 弹出框提示
    let currData=await useRouteApi(verifyStockXCLList, { schemaName: database })({queryType:'xcl',list:JSON.stringify(verifylist),rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck,bdocumStyle:'0',iyear:iyear.value})
    // 如果是负数强制转换成正数比较
    currData=currData.filter(t=>parseFloat(t.lackBaseQuantity)!=0).map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
    if(currData.length>0){
      return  openLackPage(true,{data:currData,queryType:'xcl',dynamicTenantId:database.value})
    }
    // 可用量
    let currData2=await useRouteApi(verifyStockXCLList, { schemaName: database })({queryType:'keyong',list:JSON.stringify(verifylist),rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck,bdocumStyle:'0',iyear:iyear.value})
    // 如果是负数强制转换成正数比较;可用量不能等于0
    currData2=currData2.map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
    if(currData2.length>0){
      return  openLackPage(true,{data:currData2,queryType:'keyong',dynamicTenantId:database.value})
    }
  }

  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: '将对当前仓库范围的所有期初记录进行批量'+text+'，你确定继续'+text+'吗？',
    onOk: async () => {
      let map={
        bcheck:type,
        bcheckUser:useUserStoreWidthOut().getUserInfo.id,
        bcheckTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
        id:list.map(a=>a.id),
      }
      await useRouteApi(auditStockBalance, {schemaName: database})(map)
      pageReload()
    },
    onCancel: async () => {
      pageReload()
      return false
    }
  })
}

// 审核
let submitNumber=0
async function audit(type) {
  if(getSelectRows().length==0){
    return createWarningModal({ content: '至少选择一条数据！' });
  }

  let verifylist:any=[]
  getSelectRows().forEach(async (tx)=>{
    let temp2:any={}
    temp2.iyear=tx.iyear
    temp2.stockNum=tx.stockNum
    temp2.stockName=tx.stockName
    temp2.stockGgxh=tx.stockBarcode
    temp2.cwhcode=tx.stockCangkuId
    temp2.batchId=tx.batchNumber
    temp2.dpdate=tx.dpdate
    temp2.dvdate=tx.dvdate
    temp2.baseQuantity=tx.baseQuantity
    temp2.lackBaseQuantity=''
    temp2.unitName=tx.stockUnitName
    verifylist.push(temp2)
  })

  if(type=='0'){
    // 现存量 不足 弹出框提示
    let currData=await useRouteApi(verifyStockXCLList, { schemaName: database })({queryType:'xcl',list:JSON.stringify(verifylist),rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck,bdocumStyle:'0',iyear:iyear.value})
    // 如果是负数强制转换成正数比较
    currData=currData.filter(t=>parseFloat(t.lackBaseQuantity)!=0).map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
    if(currData.length>0){
      return  openLackPage(true,{data:currData,queryType:'xcl',dynamicTenantId:database.value})
    }
    // 可用量
    let currData2=await useRouteApi(verifyStockXCLList, { schemaName: database })({queryType:'keyong',list:JSON.stringify(verifylist),rkBcheck:dynamicTenant.value.target?.kcCgrkCheck,ckBcheck:dynamicTenant.value.target?.kcXsckCheck,bdocumStyle:'0',iyear:iyear.value})
    // 如果是负数强制转换成正数比较;可用量不能等于0
    currData2=currData2.map(c=>{c.lackBaseQuantity=Math.abs(parseFloat(c.lackBaseQuantity));return c;})
    if(currData2.length>0){
      return  openLackPage(true,{data:currData2,queryType:'keyong',dynamicTenantId:database.value})
    }
  }

  let list=getSelectRows()
  // 审核
  if(type=='1'){
    list=list.filter(a=>a.bcheck!=='1')
  }else{
    list=list.filter(a=>a.bcheck=='1')
  }

  let map={
    bcheck:type,
    bcheckUser:useUserStoreWidthOut().getUserInfo.id,
    bcheckTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    id:list.map(a=>a.id),
  }
  await useRouteApi(auditStockBalance, {schemaName: database})(map)
  pageReload()
}
// 行勾选事件
function selectionChange(a) {
  editAndDelBtnShow.value=a.rows.filter(aa=>aa.bcheck=='1').length>0?true:false
}

function rowClick(a) {
  if(hasBlank(a.id)){
    deleteSelectRowByKey(a.key)
  }
}

const paginationNumber = ref(0)
const showPaginationText = ref(false)
async function fetchSuccess(data) {
  showPaginationText.value=false
  calculateTotal(data.items)
  let len = data.total
  paginationNumber.value=len
  showPaginationText.value=true
  for (let i = 0; i < (50 - len); i++) {
    data.items.push({bcheck:'11'})
  }
}
async function findAllStockCangku() {
 let temp= await useRouteApi(stockCangkuAll, { schemaName: database })({searchConditon:{requirement:'ckNum',value:''}})
  if(temp.items.length==0){
    return createWarningModal({ content: '无仓库信息,不能查询！' });
  }
  cangkuList.value=temp.items
  fetch()
  reload()
}
const filterOption = (input: string, option: any) => {
  return option.data.ckName.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
function improtExcelFun() {
  saveLogData('导入')
  openImprotExcelPage(true,{
    database:database.value,
    userId:useUserStoreWidthOut().getUserInfo.id,
    iyear:iyear.value,
  })
}

async function excelFun() {
  let map={
    showRulesSize:'MIN',
    stockClass:'',
    stockCangkuId:pageParameter.stockCangkuId,
    iyear:iyear.value,
    searchConditon: {
      requirement: 'stockNum',
      value: '',
    }
  }
  let data= await useRouteApi(findAllStockBalance, { schemaName: database })(map)
  const columns = [
    {title:'仓库名称',key:'cwhcodeJoin'},
    {title:'存货编码',key:'stockNum'},
    {title:'存货名称',key:'stockName'},
    {title:'规格型号',key:'stockGgxh'},
    {title:'计量单位',key:'cgUnitId'},
    {title:'数量',key:'cnumber'},
    {title:'金额',key:'icost'},
    {title:'批号',key:'batchNumber'},
    {title:'生产日期',key:'dpdate'},
    {title:'失效日期',key:'dvdate'},
    {title:'入库单号',key:'stockRukuNumber'},
    {title:'入库日期',key:'stockRukuDate'}]
  const multiHeader:any = [[]]
  const keys:any = []
  //样式靠右列
  let rightrow:any=[]
  //样式靠左列
  let leftrow:any=[]

  const cell = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  columns.forEach((v,index)=>{
    if(v.title.indexOf('数量')!=-1||v.title.indexOf('单价')!=-1||v.title.indexOf('金额')!=-1){
      rightrow.push(cell[index])
    }else{
      leftrow.push(cell[index])
    }
    multiHeader[0].push(v.title)
    keys.push(v.key)
  })
  let list:any=[]
  data.items.forEach(v=>{
    let dd:any={}
    dd.cwhcodeJoin=v.cwhcodeJoin,
    dd.stockNum=v.stockNum,
    dd.stockName=v.stockName,
    dd.stockGgxh=v.stockGgxh,
    dd.cgUnitId=v.cgUnitId,
    dd.cnumber=parseFloat(v.cnumber).toFixed(2),
    dd.icost=parseFloat(v.icost).toFixed(2),
    dd.batchNumber=v.batchNumber,
    dd.dpdate=v.dpdate,
    dd.dvdate=v.dvdate,
    dd.stockRukuNumber=v.stockRukuNumber,
    dd.stockRukuDate=v.stockRukuDate,
    list.push(dd)
  })
  const sheet =[
    {
      multiHeader: multiHeader,
      table: list,
      keys: keys,
      sheetName: 'sheet1',
      cellStyle: [],
      rightrow:rightrow,
      leftrow:leftrow,
    },
  ]
  exportExcel3(sheet, 'xlsx','库存期初余额_'+dynamicTenant.value.companyName)
}
function auditFun(){
  saveLogData('审核')
  submitNumber=0;
  audit('1')
}

/************************************* 栏目设置 **********************************/
const dynamicColumnData:any = ref([])
const dynamicColumnModel = ref({value:[]})
let dynamicColumnDataCopy = []
const dynamicColumns = initDynamics().DEFAULT
const editableData = reactive({});
const lanMuData = ref({
  'accId': '',
  'menuName': '库存期初余额',
  'type': '',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username,  changeNumber:0
})
const initTable = ()=>{
  visible.value = true
  setTimeout(()=>{
      lanMuData.value.changeNumber+=1
      visible.value = false
    }
    ,100)
}
const reloadColumns = ()=>{
  let a:any = []
  a = getColumns()
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA= assemblyDynamicColumn(dynamicColumnModel.value.value,newA)
  setColumns(newA)
  initTableWidth(newA)
  reload()
}
const showTree = ref(false)
const tableRef:any = ref(null)
const windowWidth = computed(() => (document.documentElement.clientWidth - 70 - (showTree.value ? 190 : 0)))
const totalColumnWidth = ref(0)
function initTableWidth(thisCs) {
  let total = 60 + 60 // 选择列与序号列
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  if (total > windowWidth.value) {
    let f = 0
    totalColumnWidth.value = Number(windowWidth.value) - f
    // tableRef.value.$el.style.setProperty('width', (windowWidth.value + 52 - f) + 'px')
  } else {
    totalColumnWidth.value = total
    // tableRef.value.$el.style.setProperty('width', (total + 52) + 'px')
  }
}
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const openPeriod = () => {
  openMoalPopPage(true, {});
}
/************************************* End **********************************/
async function saveLogData(optAction) {
  let cangkuName:any=cangkuList.value.filter(a=>a.id==pageParameter.stockCangkuId)[0]?.ckName
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optRange:'1',
    optModule:'stock',
    optFunction:'库存期初余额',
    accId:accId.value,
    optAction:optAction,
    optContent:'操作内容【库存期初余额】,仓库【'+cangkuName+'】',
  }
  await saveLog(logmap)
}

function saveFirstModalFun(data) {
  pageParameter.stockCangkuId=data
  addFun()
}

// 监听路由离开
onBeforeRouteLeave(goRouter)

function goRouter() {
  balanceTaskDel()
  edittext.value='编辑'
  btnShow.value=false
}

//打开上年结转菜单
function openJiezhuan() {
  let map:any={
    dynamicTenantId:database.value,
    dynamicTenant:dynamicTenant.value,
    iyear:iyear.value
  }
  router.push({
    path: '/StockBalanceJZ',
    query:map
  });
}

const jieZhuanView= () => {
  openJieZhuanPage(true, {
    iyear:iyear.value,
    iyearList:iyearList.value,
    rukuState:false
  });
}

// 结转回调
const jieZhuanFun = (data) => {
  console.log(data)
}
</script>
<style src="./global-menu-index.less" lang="less" scoped></style>
<style scoped lang="less">
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

:deep(.vben-basic-table) .ant-pagination {
  background-color: #cccccc;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 0px;
}

:deep(.ant-input),:deep(.ant-select),:deep(.ant-btn){
  border: 1px solid #c9c9c9;
}
:deep(.ant-select){
  border: none;
}
.ant-table-wrapper .ant-table-content .ant-table-tbody tr:nth-of-type(1) > td {
  padding: -1px;
}
.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}
.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 5px 10px;
}
// 去除空白行
:deep(.ant-table-measure-row){
  td{
    padding: 0 !important;
  }
}
.bg-white{
  width: 250px ;
  height: calc(100% - 240px);
  border: 1px #cccccc solid;
  background:white ;
  margin-top: -0.5%;
}
</style>
