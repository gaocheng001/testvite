<template>
  <div>
    <div class="app-container lcr-theme-div">
      <div>
        <div>
          <AccountBookTwoTone style="color: #0096c7;font-size: 50px;"/>
        </div>
        <div> <AccountPicker theme="three"  @reloadTable="dynamicAdReload"/></div>
      </div>
      <div style="padding-top: 15px;">
        <div>  <b class="noneSpan" style="font-size: 26px;color: #0096c7;">客户存货价格表</b></div>
      </div>
      <div>
        <div>
          <Button type="button"
                  class="ant-btn ant-btn-me"
                  @click="add()">新增
          </Button>
          <Button type="button"
                  class="ant-btn ant-btn-me"
                  @click="delList()">删除
          </Button>
          <Button type="button"
                  class="ant-btn ant-btn-me"
                  @click="importPop()">导入
          </Button>
          <Button type="button"
                  class="ant-btn ant-btn-me"
                  @click="exportexcel()">导出
          </Button>
          <Button type="button"
                  class="ant-btn ant-btn-me"
                  @click="closeCurrent()">退出
          </Button>
        </div>
        <div>
          <a-select v-model:value="selectSearchValue" class="acttdrd-search-select"
                    @change="selectSearch2">
            <a-select-option value="ccode">存货编码</a-select-option>
            <a-select-option value="ccodeName">存货名称</a-select-option>
          </a-select>
          <a-input-search placeholder="" v-model:value="inputsearchtext"
                          class="acttdrd-search-input" @search="selectSearch"/>

          <Button class="acttdrd-btn" @click="findAllInitialBalance(),findByAccStyleAll()">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </Button>
          <a-popover placement="bottom">
            <template #content>
              <a-popconfirm
                ok-text="保存"
                cancel-text="关闭"
                placement="leftTop"
                @confirm="confirm"
                @cancel="cancel">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <div style="width: 640px">
                    <a-table bordered :class="'a-table-font-size-12'" :data-source="dynamicColumnData" :columns="dynamicColumns"
                             childrenColumnName="children" :pagination="false"
                             style="max-height: 500px;overflow-y: auto" class="lanmu-table" >
                      <template #checkBox="{ text, record }">
                        <a-checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                      </template>
                      <template #widthInput="{ text, record }">
                        <div class="editable-cell">
                          <div v-if="editableData[record.key]"
                               class="editable-cell-input-wrapper">
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
                          <div v-if="editableData[record.key]"
                               class="editable-cell-input-wrapper">
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
                <Button style="width: 120px;margin-bottom: 2px">栏目设置</Button>
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
            <Button class="acttdrd-btn">
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </Button>
          </a-popover>
        </div>
      </div>
    </div>

    <div class="bg-white" :style="{height: (windowHeight)+'px',marginLeft:'10px',display: 'inline',width: showCatalog?'280px':'20px',float: 'left',marginTop: '5px',overflow:showCatalog?'auto':'hidden',overflowY:'hidden'}" >
      <div style="width: 100%; height: 32px;background-color: #d9d9d9;padding-top:5px;font-weight: bold;text-align: center;">
        <label style="font-size: 14px;font-weight: bold;">客户名称</label>
        <DeleteTwoTone  style="float: right;padding: 6px;" @click="delCusts"/>
        <PlusCircleTwoTone style="float: right;padding: 6px;" @click="addCust"/>
        <SearchOutlined v-if="!showSearch" style="float: right;padding: 6px;" @click="searchCust"/>
        <AInput v-if="showSearch" v-model:value="searchValue" style="height: 90%;margin-top: 1px;float: right;width: 40%;" @keyup.enter="searchTree"/>
      </div>
      <BasicTree
        v-show="showCatalog"
        defaultExpandAll
        :click-row-to-expand="false"
        :tree-data="treeData"
        :loading="loading2"
        v-model:selectedKeys="selectedKeys2"
        v-model:expandedKeys="expandedKeys"
        @select="handleSelect"/>
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+60)+'px',display: 'inline',width: '75%',float: 'left',marginTop: '5px',marginLeft: '5px'}">
      <BasicTable
        ref="tableRef"
        :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
        :columns="tableColumns"
        :scroll="{ y: pageParameter.queryMark=='1'?(windowHeight-10):(windowHeight-40) }"
        :dataSource="tableData"
        :loading="loading"
        size="small"
        @register="registerTable"
        :showIndexColumn="true"
        @row-click="doEdit"
        :indexColumnProps="{width: 60, fixed: 'left', title: '序号'}"
        :pagination="{
          pageSize: 1000,
          simple: true,
        }"
      >
        <template #stockNum="{ record }">
          <template v-if="record.roweditflg">
            <template v-if="record?.stockNumEdit">
              <Select
                v-model:value="record.stockNum"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                :options="ckListOptions.map(it=>({value: it.id,label: it.ckName}))"
                :show-arrow="false"
                show-search
                style="width: 82%;"
                @keyup.enter="focusNext($event,record,'stockNum')"
              ></Select>
              <SearchOutlined @click="openSelectContent(record,'stockNum')"/>
            </template>
            <template v-else>
              <span class="a-table-font-arial" :style="(record.stockNum < 0 )?{color: 'red'}:{}">{{
                  record.stockNum
                }}
               <SearchOutlined @click="openSelectContent(record,'stockNum')"/></span>

<!--              <EditOutlined @click="record.stockNumEdit = true;record.oldstockNum=record.stockNum"/>-->
            </template>
          </template>
          <template v-else>
            <span class="a-table-font-arial" :style="(record.stockNum < 0 )?{color: 'red'}:{}">{{
                record.stockNum
              }}</span>
          </template>
        </template>

        <template #memberprice="{ record }">
          <template v-if="record.memberpriceEdit">
              <a-input-number v-model:value="record.memberprice"  min="0"
                              :formatter="value =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value =>`${value}`.replace(/\$\s?|(,*)/g,'')"
                              :precision="10" style="width: 85%;"
                              @keyup.enter="record.memberpriceEdit = null;dbSave(record)"/>
              <CheckOutlined @click="record.memberpriceEdit = null;dbSave(record)"/>
          </template>
          <template v-else>
            <div class="suspended-div" @click="record.memberpriceEdit = true;">
            <span class="a-table-font-arial" :style="(record.memberprice < 0 )?{color: 'red'}:{}">{{
                 money(record.memberprice)
              }}</span>
            </div>
          </template>
        </template>

        <template #stockMarketUnit="{ record }">
          <span  class="a-table-font-arial">{{ record.uname }}</span>
        </template>
      </BasicTable>

      <div style="position: absolute;top:97%; bottom: 6px; right: 15%;font-size: 13px; color: black;z-index: 99999999;">
        {{`共 ${paginationNumber} 条记录   &nbsp;&nbsp;每页 1000 条`}}
      </div>
      <ImprotExcel @save="reloadProjects" @register="registerImportPage"/>
      <ThisEdit @register="registerEditPage" @save="findAllInitialBalance" :placement="'top'" :database="databaseTrue"></ThisEdit>
      <CodeModalPop @throwData="modalData" @register="registerCodePopPage" />
      <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="stockAdd"/>
      <CustomerModalPop @register="registerCustomerModalPage" @throwData="customerAdd"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  EditOutlined,
  CaretDownOutlined,
  CheckOutlined,
  LinkOutlined,
  ExclamationCircleOutlined,
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
  SortAscendingOutlined,
  SearchOutlined,AccountBookTwoTone,
  PrinterOutlined,PlusCircleTwoTone, DeleteTwoTone,
  UsbOutlined,ShrinkOutlined,ArrowsAltOutlined
} from '@ant-design/icons-vue';
import {BasicTable, useTable} from '/@/components/Table';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import CustomerModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";

import CodeModalPop from '/@/views/boozsoft/global/popup/accode2/modalPop.vue';
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput, InputNumber as AInputNumber,
  Popover as APopover,
  Radio as ARadio,
  Pagination as APagination,
  Popconfirm as APopconfirm,
  Table as ATable,
  Checkbox as ACheckbox,
  Statistic as AStatistic, Modal as AModal,
  Drawer as ADrawer, Collapse, message, Divider, Button, Progress
} from "ant-design-vue"
import { BasicTree } from '/@/components/Tree';
import {useModal} from '/@/components/Modal';
import {
  saveSubjectInitialBalance,
  delInitalBalance,
  emptyAll,
} from '/@/api/subjectInitialBalance/subjectInitialBalance';

import {
  findAll, savePrice, getAllCustTree, delPrice,delCust,addCusts,improtExcel
} from '/@/api/record/stock/stock_cust_price';
import {onMounted, ref, reactive} from 'vue';
import ImprotExcel from './popup/improtExcel.vue';
import {aoaToSheetXlsx, jsonToSheetXlsx} from '/@/components/Excel';
import {useUserStore, useUserStoreWidthOut} from '/@/store/modules/user';
import {
  countByTaskId,delFunctionModule,
  getCurrentAccountName,
  hasBlank
} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

import {onBeforeRouteLeave} from "vue-router";
import {
  assemblyDynamicColumn,
  combineParameters,
  initDynamics
} from "/@/views/boozsoft/stock/stock_price_cust/data";
import {findDbLanMuList, saveLanMuList} from "/@/api/record/system/accvoucher";
import {cloneDeep} from "lodash-es";
import {useMessage} from "/@/hooks/web/useMessage";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";

const dataSourceTable:any =ref([]);
const columns = [];
const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const CollapsePanel = Collapse.Panel
const AStatisticCountdown = AStatistic.Countdown;

const {closeCurrent} = useTabs(router);
// 期初记账/恢复期初记账  显示
const ibookflg = ref(false);
// 计时数值
const deadline = ref(Date.now() + 1000 * 10);
// 借贷方金额
const md = ref('');
const mc = ref('');
// 借贷方数量
const numflg = ref(false);
const ncnum = ref('');
// 外币金额
const nfrat = ref('');
const nfratflg = ref(false);
const visible = ref(false);
const paginationNumber = ref(0)

const isLj = ref(false)
const showCatalog = ref(true)
// 累计借贷方金额
const mdLj = ref('');
const mcLj = ref('');
// 累计借贷方数量
const numflgLj = ref(false);
const ncnumLj = ref('');
const ncnumLj2 = ref('');
// 累计外币金额
const nfratLj = ref('');
const nfratLj2 = ref('');
const nfratflgLj = ref(false);

// 弹框2状态
const carryDownModal = ref(false);
const modal2Visible = ref(false);
const lock0K = ref(false);
const edittext = ref('开始编辑');
// 弹框1状态
const modal1Visible = ref(false);
// 试算平衡list
const ssphtext = ref('');
const ystext = ref('');
const textObj = {
  proportion: 100,
  left: {text: '', value: '0', proportion: 100},
  right: {text: '', value: '0', proportion: 100}
}
const ssphlist = ref([]);
const ssphlist2 = ref([]);
// 试算平衡表头
const ssphcolumns = ref([]);
// 单元格可编状态
const roweditflg = ref(false);
const loading = ref(false);
const loading3 = ref(false);
// 账套启用期间
const begintime = ref('');
// 账套启用期间
const iyearlist = ref([]);
// 选中年度
const iyearselected = ref('');
// 显示末级科目
const lastCode = ref(false);
const tableDataAll = ref([]);
const tableData = ref([]);
// 任务管理信息
const taskinfo = ref('');
// 期初弹框回调信息
const datainfo = ref('');
// 期初弹框回调信息
const types = ref('');
// 数据库模式名称
const database = ref(getCurrentAccountName(false));
const databaseTrue = ref(getCurrentAccountName(true));
const databaselist = ref([]);
const userinfo = ref({
  databaseNum: database.value,
  username: useUserStoreWidthOut().getUserInfo.username,
  realName: useUserStoreWidthOut().getUserInfo.realName,
  name: useUserStoreWidthOut().getUserInfo.name,
  phone: useUserStoreWidthOut().getUserInfo.phone,
});
const userStore = useUserStore();
const codelist=ref([])
// 字体
const pageParameter = reactive({
  cclass: '0',
  ccode:'',
  bend:'',
  databasenum: databaseTrue.value,
  queryMark: '1',
  showRulesSize: 'MIN',
  filterConditon: {
    amountMinMc: '',
    amountMaxMc: '',
    amountMinMd: '',
    amountMaxMd: ''
  },
  uniqueAccStandard: '',
  templateId: '',
  activeKey: '',
  reloadMark: false,
  companyCode: '',
  companyName: '',
  ifUnit: false,
})
// 数量/外币 栏目是否显示
const menterage = ref(true)
const currencyType = ref(true)
const tableColumns = ref([
  {
    title: "存货编码",
    dataIndex: "stockNum",
    slots: {customRender: "stockNum"}
  },
  {
    title: "存货名称",
    dataIndex: "stockName",
    align: "left"
  },
  {
    title: "规格型号",
    dataIndex: "stockGgxh",
    align: "left"
  },
  {
    title: "主计量",
    dataIndex: "uname",
    slots: {customRender: "uname"},
  },
  {
    title: "客户价格",
    dataIndex: "memberprice",
    slots: {customRender: "memberprice"},
  },
])

// 是否非企业机构标识 1是
const icorp = ref('')
// 公司码
const cocode = ref('')
// 账套详细信息
const databaseinfo = ref('')
// 1是 否独立账套
const independent = ref(false)
const cwflag = ref(false);
const ysflag = ref(false);
const modal3Visible = ref(false);
const selectDataBaseValue = ref('');
const selectSearchValue = ref('ccode');
const bwb = ref('');
const qujian = ref('');
// 所有账套集合
const databaseAll = ref([])
const inputsearchtext = ref('')
const templateSelected = ref('')
const standardSelected = ref('')
// 余额录入弹框
const openInfo = ref({
  ccode: '',
  ccodeName: '',
  fx: '',
  currency: ''
})

const loading2 = ref(true);
const treeData:any = ref([]);
const selectedKeys2:any = ref([]);
const expandedKeys:any = ref([]);
const styleList:any = ref([]);

// 这是示例组件
const [registerImportPage, {openModal: openImprotPage}] = useModal();
const [registerImportPageFz, {openModal: openImprotPageFz}] = useModal();

const [registerEditPage, {openModal: openEditPage}] = useModal();
const [registerCodePopPage, {openModal: openCodePopPage}] = useModal();

const tableRef = ref(null)
const windowWidth = (document.documentElement.clientWidth - 70)
const windowHeight = (window.innerHeight - 300)
const totalColumnWidth = ref(0)
const [registerTable, {
  reload,
  setColumns,
  getDataSource,
  setTableData,
  getSelectRows
}] = useTable();

// 过滤漏斗
function filterSearch() {
  pageParameter.filterConditon.amountMinMd = pageParameter.filterConditon.amountMinMd === '' ? '0' : pageParameter.filterConditon.amountMinMd
  pageParameter.filterConditon.amountMaxMd = pageParameter.filterConditon.amountMaxMd === '' ? '0' : pageParameter.filterConditon.amountMaxMd
  pageParameter.filterConditon.amountMinMc = pageParameter.filterConditon.amountMinMc === '' ? '0' : pageParameter.filterConditon.amountMinMc
  pageParameter.filterConditon.amountMaxMc = pageParameter.filterConditon.amountMaxMc === '' ? '0' : pageParameter.filterConditon.amountMaxMc

  let all = tableDataAll.value
  tableData.value = all.filter((a) =>
    parseFloat(a.md) >= parseFloat(pageParameter.filterConditon.amountMinMd) && parseFloat(a.md) <= parseFloat(pageParameter.filterConditon.amountMaxMd)
    && parseFloat(a.mc) >= parseFloat(pageParameter.filterConditon.amountMinMc) && parseFloat(a.mc) <= parseFloat(pageParameter.filterConditon.amountMaxMc)
  );
}

function selectSearch2() {
  if (inputsearchtext.value !== '') {
    findAllInitialBalance()
  }
}

// 检索条件
async function selectSearch() {
  let all = tableDataAll.value
  if (selectSearchValue.value === 'ccode') {
    tableData.value = all.filter((a) => !hasBlank(a.stockNum) && a.stockNum.indexOf(inputsearchtext.value) !== -1);
  }
  if (selectSearchValue.value === 'ccodeName') {
    tableData.value = all.filter((a) => !hasBlank(a.stockName) && a.stockName.indexOf(inputsearchtext.value) !== -1);
  }
  paginationNumber.value = tableData.value.length;
  if(tableData.value.length < 50){
    for (let i = tableData.value.length ; i < 50 ; i++) {
      tableData.value.push({})
    }
  }
  setTableData(tableData.value)
  if (inputsearchtext.value === '') {
    findAllInitialBalance()
  }
}

async function modalok() {
  modal3Visible.value = false
}

async function emptyAllbtn(data) {
  if (data.accvouid !== null) {
    await useRouteApi(emptyAll, {schemaName: databaseTrue.value})(data.accvouid)
    findAllInitialBalance();
  }
}


// 倒计时到时间触发
function onFinish() {
}

const companyName = ref('');
// 导出excel
function exportexcel() {
  var list = [];
  for (let i = 0; i < tableDataAll.value.length; i++) {
    // 所有末级科目
    if(tableDataAll.value[i].stockNum != null){
      list.push({
        stockNum: tableDataAll.value[i].stockNum,
        stockName: tableDataAll.value[i].stockName,
        stockGgxh: tableDataAll.value[i].stockGgxh,
        uname: tableDataAll.value[i].uname,
        memberprice: money(tableDataAll.value[i].memberprice),
      });
    }
  }

  jsonToSheetXlsx({
    data: list,
    header: {
      stockNum: '存货编码',
      stockName: '存货名称',
      stockGgxh: '规格型号',
      uname: '主计量',
      memberprice: '客户价',
    },
    filename: '客户价格表_'+ companyName.value +'.xlsx',

  });
}

// 导入弹框
const importPop = (type) => {
  //选中客户
  if(pageParameter.cclass == '0'){
    message.error("请点击选择客户后导入！")
    return
  }
  openImprotPage(true, {
    dynamicTenantId: databaseTrue.value,
  });
};

async function reloadProjects(data) {
  console.log(data)
  data.forEach(v=>{
    v.custId = pageParameter.cclass
  })
  await useRouteApi(improtExcel, {schemaName: databaseTrue.value})(data)
    .then(v=>{
      message.success("导入成功！")
      findAllInitialBalance();
    })
}

/**
 * 简单数组去重
 * @param array
 */
function uniq(array) {
  var temp = []; //一个新的临时数组
  for (var i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) == -1) {
      temp.push(array[i]);
    }
  }
  return temp;
}

const del = async (delArr: any, iyear: any) => {
  await useRouteApi(delInitalBalance, {schemaName: databaseTrue.value})({str: delArr, iyear: iyear})
  findAllInitialBalance();
};

// 提交弹框
const submitPop = async () => {

};

const setModal1Visible = async (data: any) => {


};

function findLastDate(date) {
  date = new Date(date);
  date = 0 + (date).getTime() - 1000 * 60 * 60 * 24;
  date = new Date(date);
  date = date.getFullYear() + "-" + (date.getMonth() > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? (date.getDate()) : "0" + (date.getDate()));
  return date;
}

// 是否末级科目查询
const lastCodechecked = async (val) => {
  lastCode.value = val.target.checked;
  findAllInitialBalance();
};

const yearChange = async (val) => {
};

const saveData = async (data: any) => {
  await useRouteApi(saveSubjectInitialBalance, {schemaName: databaseTrue.value})({
    params: data,
    accId: database.value,
    userName: userinfo.value.username,
    databasenum: databaseTrue.value,
    saveType: pageParameter.queryMark
  })
  findAllInitialBalance();
};

// 获取list
const findAllInitialBalance = async () => {

  tableData.value = []
  tableDataAll.value = []
  loading.value = true;
  const a = await useRouteApi(findAll, {schemaName: databaseTrue.value})({
    custId: pageParameter.cclass,
  })
  tableDataAll.value = a;
  paginationNumber.value = a.length;
  if(a.length < 50){
    for (let i = a.length ; i < 50 ; i++) {
      a.push({})
    }
  }
  tableData.value = a;
  let tableColumns = a.tableColumns;
  if (tableColumns === 'all') {
    menterage.value = false
    currencyType.value = false
  }
  if (tableColumns === 'menterage') {
    menterage.value = false
  }
  if (tableColumns === 'currencyType') {
    currencyType.value = false
  }
  loading.value = false;
};

// 金额格式化
function money(val: any) {
  if (val == null) {
    return  '  ';
  }
  val = val.toString().replace(/\$|\,\-/g, '');
  if (isNaN(val)) {
    return  '  ';
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

const getAdObjInfoByCoCode = (value, type, accList) => {
  let list = accList.filter(item => item[type] == value)
  return list.length > 0 ? list[0] : null
}

const dynamicAdReload = async (obj) => {
  loading.value = true;
  if (taskinfo.value !== ''){
    database.value = obj.accId;
    databaseTrue.value = obj.accountMode;
    iyearselected.value = obj.year;
    companyName.value =  obj.companyName
  }else {
    database.value = obj.accId;
    databaseTrue.value = obj.accountMode;
    iyearselected.value = obj.year;
    companyName.value =  obj.companyName
  }
  tableData.value = []
  findByAccStyleAll()
  await findAllInitialBalance();
  loading.value = true
  resetDynamicColumnData()
  loading.value = false
}

// 获取科目类型
async function findByAccStyleAll() {
  loading2.value = true
  fetch()
}

async function fetch() {
  const deptTree = await useRouteApi(getAllCustTree,{schemaName: databaseTrue})()
  console.log(deptTree)
  if(deptTree!=null){
    function a(customerTree) {
      customerTree.forEach((item) => {
        if (item.children != null) {
          a(item.children);
        }
        item.title=  item.custCode +'-'+item.custAbbname
        item.key=item.id+'>>'
      });
    }
    a(deptTree);
    treeData.value = []
    selectedKeys2.value=['0']
    expandedKeys.value=['0']
    treeData.value.push({title: '全部',key:'0',children: deptTree})
  }
  loading2.value = false;
}
//js切割字符串
function setString(str, len) {
  var strlen = 0;
  var s = '';
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      strlen += 2;
    } else {
      strlen += 1.2;
    }
    s += str.charAt(i);
    if (strlen >= len) {
      return s + '...';
    }
  }
  return s;
}

function handleSelect(obj) {
  console.log(obj)
  if(obj.toString()!==''){
    if(!isNaN(obj.toString().split('>>')[0])){
      pageParameter.cclass=obj.toString().split('>>')[0]
      findAllInitialBalance()
    }else{
      pageParameter.cclass=obj.toString().split('>>')[0]
      findAllInitialBalance()
    }
  }else{
    selectedKeys2.value=['0']
    pageParameter.cclass='0'
    pageParameter.ccode=''
    findAllInitialBalance()
  }
}
/*start栏目设置*/
const onChangeSwitch = async (v) => { // 动态列
  pageParameter.queryMark = v
  resetDynamicColumnData()
}
const {createConfirm, createWarningModal} = useMessage();
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const lanMuData = {
  'accId': '',
  'menuName': '存货价格表',
  'type': '',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
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
        saveLanMuList(lanMuData).then(res => {
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
    } catch (e) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  return a;
}

const cancel = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData.value = []
  dynamicColumnData.value = dynamicColumnDataCopy
}


function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = getCurrentAccountName(false)
  lanMuData.type = pageParameter.queryMark == '1' ? '标准' : '累计'
  findDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    let statiList = pageParameter.queryMark == '1' ? initDynamics()['DATA' + pageParameter.queryMark] : currentShowColumns('lanmu')
    if (dbList.length > 0) {
      dbList = combineParameters(statiList, dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    } else {
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns()
    // pageReload()
  })
}


const edit = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1] - 1)
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData[key] = cloneDeep(dynamicColumnData.value.filter(item => key === item.key)[0]);
  }
}

const save = (key: string, min: number, max: number) => {
  editableData[key].width = editableData[key].width > max ? max : editableData[key].width < min ? min : editableData[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}

const saveName = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}

const reloadColumns = () => {
  let newA = JSON.parse(JSON.stringify(pageParameter.queryMark == '1' ? tableColumns.value : currentShowColumns('')))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
}

function initTableWidth(thisCs) {
  let total = 60 + 60 // 选择列与序号列
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  if (total > windowWidth) {
    let f = 0
    if (visible.value) f = 380
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 62 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 380) < total) total -= (total - (windowWidth - 380))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 62) + 'px')
  }
}
/*栏目设置end*/

const dbSave = async (o) => {
  //修改
  o.operatorName = userinfo.value.name
  o.custId = pageParameter.cclass
  await useRouteApi(savePrice,{schemaName: databaseTrue})(o).then(v=>{
    //findAllInitialBalance()
    message.success("操作成功！")
  })
}
const dbSave2 = async (o) => {
  console.log(o)
}
const changeTableList = (upCcode, dataSourceList) => {
  let up = dataSourceList.filter(it => it.ccode == upCcode)[0]           // 当前上级科目
  let childs = dataSourceList.filter(it => it.superiorCcode == upCcode)  // 当前科目下所有子科目
  let mdSum = 0;
  let mcSum = 0;
  let ldSum = 0;
  let lcSum = 0;
  childs.forEach((it) => {
    mdSum += parseFloat(hasBlank(it.md) ? '0' : it.md)
    mcSum += parseFloat(hasBlank(it.mc) ? '0' : it.mc)
    ldSum += parseFloat(hasBlank(it.ljMd) ? '0' : it.ljMd)
    lcSum += parseFloat(hasBlank(it.ljMc) ? '0' : it.ljMc)
  })
  if (mdSum > mcSum) {
    (up.md = mdSum - mcSum)
    up.mc = 0
  } else {
    up.mc = mcSum - mdSum
    up.md = 0
  }
  if (pageParameter.queryMark == '2') {
    up.ljMd = ldSum
    up.ljMc = lcSum
    let v = up?.bprogerty == '1' ? parseFloat(up?.md) + parseFloat(up?.ljMc) - parseFloat(up?.mc) - parseFloat(up?.ljMd) : parseFloat(up?.mc) + parseFloat(up?.ljMd) - parseFloat(up?.md) - parseFloat(up?.ljMc)
    if (v > 0) {
      if (up?.bprogerty == '1') {
        up.yearMd = v
        up.yearMc = 0
      } else {
        up.yearMc = v
        up.yearMd = 0
      }
    } else {
      if (up?.bprogerty == '1') {
        up.yearMc = Math.abs(v)
        up.yearMd = 0
      } else {
        up.yearMd = Math.abs(v)
        up.yearMc = 0
      }
      up.bprogerty == '1' ? up.bprogerty = '0' : up.bprogerty = '1'
    }
  }
  let index = dataSourceList.findIndex(it => it.ccode == upCcode)
  dataSourceList.splice(index, 1, up)
  if (up.superiorCcode == '0') { // 不存在上级科目
    return dataSourceList
  } else { // 还存在上级
    return changeTableList(up.superiorCcode, dataSourceList)
  }
}
/*************** 中途启用 ****************/
const currentShowColumns = (type) => {
  let flag = false
  if (!menterage.value || !currencyType.value) flag = true
  if (type == 'lanmu') {
    return flag ? initDynamics()['DATA' + pageParameter.queryMark + '2'] : initDynamics()['DATA' + pageParameter.queryMark]
  } else {
    return flag ? tableColumns22.value : tableColumns2.value;
  }
}
function createConfirmPop(text) {
  createConfirm({
    iconType: 'warning',
    title: '警告',
    content: text,
    onOk: async() => {},
  })
}

const filterOption = (input: string, option: any) => {
  return option.data.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const modalRowKey=ref('')
function openSelectCode(data) {
  modalRowKey.value=data.key
  openCodePopPage(true, {
    database: databaseTrue.value,
    accId: database.value,
    iyear: iyearselected.value,
  });
}

function modalData(data) {
  dataSourceTable.value.filter(a=>a.key===modalRowKey.value).map(t=>t.thisCcode=data.ccode+'-'+data.ccodeName)
}

//点击行显示编辑
const doEdit = (record, index) => {
  record.roweditflg = true
}

const formatUnit = (record) => {
  let str
  if(record.stockMeasurementType === '单计量'){
    str = record.uname
  }else{
    str = record.unames
  }
  return str
}
//存货编码选择
const ckListOptions = ref([])
const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const openSelectContent = (record, type) => {
  record.stockNumEdit = true
  record.oldstockNum=record.stockNum
  //弹出存货编码选择
  openStockInfoModalPage(true, {
    database: databaseTrue.value,
  })
}
const stockAdd = (o) => {
  console.log(o)
  //过滤填充的空数据
  let arr = tableData.value.filter(v=> v.stockNum!=null)
  o.forEach(item=>{
    //去重
    let index = arr.findIndex(obj=> obj.stockNum === item.stockNum)
    if(index < 0){
      arr.push({
        stockNum: item.stockNum,
        stockName: item.stockName,
        stockGgxh: item.stockGgxh,
        stockMarketUnit: item.stockCustomsUnit,
        uname: item.stockUnitName,
        memberprice: '0',
      });
    }
  })
  paginationNumber.value = arr.length;
  if(arr.length < 50){
    for (let i = arr.length ; i < 50 ; i++) {
      arr.push({})
    }
  }
  tableData.value = []
  tableData.value = arr
  setTableData(tableData.value)
}
const add = (record, type) => {
  //弹出存货编码选择
  openStockInfoModalPage(true, {
    database: databaseTrue.value,
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
const onSelectChange = (selectedRowKeys, row) => {
  // console.log('selectedRowKeys changed: ', row);
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
};
const delList = () => {
  if (checkRow.value.length > 0) {
    createConfirm({
      iconType: 'error',
      title: '警告',
      content: '删除后数据将不能恢复，你确认要删除吗?',
      onOk: async () => {
        //过滤list后删除
        console.log(checkRow.value)
        for (let i = 0; i < checkRow.value.length; i++) {
          const item = checkRow.value[i]
          if(checkRow.value[i].id){
            await useRouteApi(delPrice, {schemaName: databaseTrue})(checkRow.value[i].id)
          }
        }
        checkRow.value = []
        state.selectedRowKeys = []
        message.success('删除成功！')
        findAllInitialBalance()
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
const delCusts = async() => {
  console.log(pageParameter.cclass)
  if(pageParameter.cclass != '0'){
    await useRouteApi(delCust, {schemaName: databaseTrue})(pageParameter.cclass).then(o=>{
      message.success('删除成功！')
      fetch();
    })
  }
};

const [registerCustomerModalPage, {openModal: openCustomerModalPage}] = useModal();

const addCust = () => {
  openCustomerModalPage(true, {
    database: databaseTrue.value,
  })
};

const customerAdd = async(o) => {
  console.log(o)
  console.log(treeData.value)
  let arr = []
  o.forEach(item=>{
    let index = treeData.value[0].children.findIndex(obj=> obj.custId === item.id)
    if(index < 0){
      arr.push({
        custId: item.id,
        createDate: nowDate(),
        createName: userinfo.value.name
    })
    }
  })
  if(arr.length > 0){
    await useRouteApi(addCusts, {schemaName: databaseTrue})(arr).then(r=>{
      message.success("操作成功")
      fetch();
    })
  }
};
//获取当前年月日
const nowDate = ()=>{
  const nowDate = new Date();
  const date = {
    year: nowDate.getFullYear(),
    month: nowDate.getMonth() + 1,
    date: nowDate.getDate(),
  }
  const newmonth = date.month>10?date.month:'0'+date.month
  const day = date.date>10?date.date:'0'+date.date
  return date.year + '-' + newmonth +'-'+day
}
const showSearch: any = ref(false)
const searchValue: any = ref()
const searchCust = () => {
  showSearch.value = true
};
const searchTree = () => {
  if(searchValue.value.length > 0){
    treeData.value[0].children = treeData.value[0].children.filter(item=> item.title.includes(searchValue.value))
  }else{
    fetch()
  }
};

</script>
<style scoped lang="less">
@import "../../../../assets/styles/global-menu-index.less";
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
  min-height: 500px;
}

:deep(.vben-basic-table) .ant-pagination {
  background-color: #cccccc;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
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
    >div:nth-of-type(1){width: 64px;display: inline-block;text-align: center;    top: 12px;
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

:deep(.vben-basic-table) {
  .ant-table-wrapper {
    .ant-table-tbody {
      tr.ant-table-measure-row{
        visibility: collapse!important;
      }
    }
  }
}
</style>

