<template>
  <div class="app-container">
    <div class="app-container-top">
      <div class="app-container-top-one">
        <div class="act-one-d-left" style="width: 22%;"></div>
        <div class="act-one-d-title">
          <span class="acto-d-title-span">资产列表</span>
        </div>
        <div class="act-one-d-btn-group">
          <Button class="actod-btn">新增</Button>
          <Button class="actod-btn">修改</Button>
          <Button class="actod-btn">删除</button>
          <Button class="actod-btn">变动</button>
          <Button class="actod-btn">合并拆分</button>
          <Button class="actod-btn">借用归还</button>
          <Button class="actod-btn">调出</button>
          <Button class="actod-btn">处置</button>
          <Button class="actod-btn">导入</button>
          <Button class="actod-btn actod-btn-last"  @click="closeCurrent()">退出</Button>
        </div>
      </div>
      <div class="app-container-top-two">
        <div class="act-two-d-left">
          <AccountPicker v-if="showThis" theme="one" @reloadTable="pageReload2"/>
        </div>
        <div  class="act-two-d-center">
          <span style="font-weight: bold;">资产账套：</span>
          <Select class="acttdrd-search-select" >
            <template #suffixIcon><SearchOutlined/></template>
          </Select>
        </div>
        <div class="act-two-d-right">
          <div class="acttd-right-d-search">
            <Select v-model:value="pageParameter.searchConditon.requirement" class="acttdrd-search-select">
              <template v-for="item in searchConditonList.slice(1)">
                <SelectOption v-if="item.ifShow == true" :value="item.dataIndex">
                  {{ item.title }}
                </SelectOption>
              </template>
            </Select>
            <InputSearch
              class="acttdrd-search-input"
              @search="pageSearch"
              v-model:value="pageParameter.searchConditon.value"
            />
          </div>
          <div class="acttd-right-d-btns">
            <Button class="acttdrd-btn" @click="closeFilterV(),loadMark=true,pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover  placement="bottom">
              <template #content>
                <Popconfirm
                  ok-text="保存"
                  cancel-text="关闭"
                  @confirm="confirm"
                  @cancel="cancel">
                  <template #icon><b>栏目设置</b><br></template>
                  <template #title>
                    <div style="width: 640px">
                      <Table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                               childrenColumnName="children" :pagination="false"
                               style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                        <template #checkBox="{ text, record }">
                          <Checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                        </template>
                        <template #widthInput="{ text, record }">
                          <div class="editable-cell">
                            <div v-if="editableData[record.key]"
                                 class="editable-cell-input-wrapper">
                              <Input type="number" v-model:value="editableData[record.key].width"
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
                              <Input type="text" v-model:value="editableData[record.key].nameNew"
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
                          <RadioGroup default-value="a" size="small" v-model:value="record.align"
                                         :disabled="record.align==''">
                            <RadioButton value="left">
                              左
                            </RadioButton>
                            <RadioButton value="center">
                              中
                            </RadioButton>
                            <RadioButton value="right">
                              右
                            </RadioButton>
                          </RadioGroup>
                        </template>
                      </Table>
                    </div>
                  </template>
                  <Button style="width: 120px;margin-bottom: 2px">栏目设置</Button>
                </Popconfirm>
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
            </Popover>
            <Popover  placement="bottom">
              <template #content>
               <span class="group-btn-span-special2" @click="onChangeSwitch(false)"
                     :style="pageParameter.queryMark=='2'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortDescendingOutlined/>&nbsp;&emsp;汇总&emsp;&ensp;<CheckOutlined
                 v-if="pageParameter.queryMark=='2'"/></span><br/>
                <span class="group-btn-span-special2" @click="onChangeSwitch(true)"
                      :style="pageParameter.queryMark=='1'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortAscendingOutlined/>&nbsp;&emsp;明细&emsp;&ensp;<CheckOutlined
                  v-if="pageParameter.queryMark=='1'"/></span>
              </template>
              <Button class="acttdrd-btn">
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover  placement="bottom">
              <template #content>
                <span class="group-btn-span-special" @click="pingzhengExport('curr')">导出当前</span><br/>
                <span class="group-btn-span-special">条件导出</span>
              </template>
              <Button class="acttdrd-btn">
                <UsbOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Popover  placement="bottom">
              <template #content>
                <span class="group-btn-span-special" @click="openPrintPage">凭证打印</span><br/>
                <span class="group-btn-span-special">打印当前</span>
              </template>
              <Button class="acttdrd-btn">
                <PrinterOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
            <Button class="acttdrd-btn" @click="()=>{if (!visible){visible = true;reloadColumns();}return false}">
              <FilterFilled :style="{ fontSize: '14px' }"/>
            </Button>
            <Button class="acttdrd-btn" @click="()=>{showTree = !showTree;reloadColumns();return false}">
              <FileSearchOutlined :style="{ fontSize: '14px' }"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+60)+'px',marginTop: '5px'}">
      <!--  针对过滤框显示添加的内容高度  -->
      <VoucherTree  v-show="showTree" :treeInterval="treeInterval" :database="manipulateDbName" @select="treeFilter"/>
      <div style="display: inline-block;height: 100%; float: left;margin-left: 5px;" :style="showTree?{width: 'calc(100% - 242px)'}:{width: '99.8%'}">
        <BasicTable
          ref="tableRef"
          :loading="loadMark"
          :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
          :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: totalColumnWidth,y: (windowHeight - 15) }"
          :rowKey="r=>r.vouchUnCode===null?r.uniqueCode:r.vouchUnCode"
          size="small"
          @change="pageChange"
          @register="registerTable"
        >
          <template #ibook="{ record }">
            <a-tag :color="record.ibook === '1' ? 'green' : 'red'">
              {{ record.ibook === '1' ? '已记账' : '未记账' }}
            </a-tag>
          </template>

          <template #csignAndInoId="{record,index }">
        <span class="tableUStyle"
              @click="showPingZheng(record)">{{
            record.csign
          }}-{{ voucherNoAutocomplete(record.inoId, voucherRuleSize) }}</span>&ensp;
            <a-tag v-if="record.ifrag != 0"
                   :color="record.ifrag === '1' ? 'red' : record.ifrag === '2' ? 'pink' : 'red'">
              {{
                record.ifrag === '1' ? '作废' : record.ifrag === '2' ? '暂存' : record.ifrag === '3' ? '错误' : '错误'
              }}
            </a-tag>
          </template>
          <template #mdmoney="{ record }">
        <span class="a-table-money-font-size a-table-font-arial"
              :style="null!=record.md && record.md.startsWith('-')?{color: 'red'}:{}">
         {{ money(record.md) }}
        </span>
          </template>
          <template #mcmoney="{ record }">
        <span class="a-table-money-font-size a-table-font-arial"
              :style="null!=record.mc && record.mc.startsWith('-')?{color: 'red'}:{}">
         {{ money(record.mc) }}
        </span>
          </template>
        </BasicTable>
        <Drawer
          title="区间条件过滤"
          placement="right"
          :closable="true"
          v-if="visible"
          :mask="false"
          width="380px"
          :visible="visible"
          :get-container="false"
          :wrap-style="{ position: 'absolute' }"
          @close="resetFilterConditon"
        >
          <div :style="{height: (windowHeight-15)+'px',overflowY: 'auto'}">
            <div class="nc-drawer-special-div">
              <span>按照日期、凭证号和金额区间过滤{{windowHeight}}</span>
            </div>
            <Collapse v-model:activeKey="collapseValue" :bordered="false">
              <CollapsePanel key="1" header="按日期范围">
                <span style="font-size: 12px;font-weight: bold">录入条件说明</span>
                <Tooltip placement="rightTop" :color="'#f50'">
                  <template #title>
                    <span>请输入期间范围内日期</span>
                  </template>
                  <ExclamationCircleOutlined
                    style="font-size: 14px;color: red;font-weight: bold;margin-left: 1em;"/>
                </Tooltip>
                <div style="display: inline-flex;width:100%;">
                  <div style="width: 48%">
                 <span style="font-size: 12px;clear:both">
                   开始日期：
                </span>
                    <a-date-picker
                      v-model:value="pageParameter.filterConditon.dateMin"
                      format="YYYY-MM-DD"
                      :disabled-date="disabledDate"
                      style="width: 100%;font-size: 12px"
                    />
                  </div>
                  <div style="width: 48%;margin-left: 2%">
                <span style="font-size: 12px;clear:both">
                   结束日期：
                </span>
                    <a-date-picker
                      v-model:value="pageParameter.filterConditon.dateMax"
                      format="YYYY-MM-DD"
                      :disabled-date="disabledDate"
                      style="width: 100%;font-size: 12px;float: right"
                    />
                  </div>
                </div>
              </CollapsePanel>
              <CollapsePanel key="2" header="按凭证号范围">
                <span style="font-size: 12px;font-weight: bold">录入条件说明</span>
                <Tooltip placement="rightTop" :color="'#f50'">
                  <template #title>
                    <span>只能输入正整数</span>
                  </template>
                  <ExclamationCircleOutlined
                    style="font-size: 14px;color: red;font-weight: bold;margin-left: 1em;"/>
                </Tooltip>
                <div style="display: inline-flex;width:100%;">
                  <div style="width: 48%">
                 <span style="font-size: 12px;clear:both">
                   起始凭证号：
                </span>
                    <Input v-model:value="pageParameter.filterConditon.pzNumberMin" placeholder="" type="number"
                             style="width: 100%;font-size: 12px"/>
                  </div>
                  <div style="width: 48%;margin-left: 2%">
                <span style="font-size: 12px;clear:both">
                   结束凭证号：
                </span>
                    <Input v-model:value="pageParameter.filterConditon.pzNumberMax" placeholder="" type="number"
                             style="width: 100%;font-size: 12px;float: right"/>
                  </div>
                </div>
              </CollapsePanel>
              <CollapsePanel key="3" header="按金额范围" :disabled="false">
                <span style="font-size: 12px;font-weight: bold">录入条件说明</span>
                <Tooltip placement="rightTop" :color="'#f50'">
                  <template #title>
                    <span>只能输入金额</span>
                  </template>
                  <ExclamationCircleOutlined
                    style="font-size: 14px;color: red;font-weight: bold;margin-left: 1em;"/>
                </Tooltip>
                <br>
                <div style="display: inline-flex;width:100%;">
                  <div style="width: 48%">
                 <span style="font-size: 12px;clear:both">
                   最小金额：
                </span>
                    <a-input v-model:value="pageParameter.filterConditon.amountMin" placeholder=""
                             style="width: 100%;font-size: 12px"/>
                  </div>
                  <div style="width: 48%;margin-left: 2%">
                <span style="font-size: 12px;clear:both">
                   最大金额：
                </span>
                    <a-input v-model:value="pageParameter.filterConditon.amountMax" placeholder=""
                             style="width: 100%;font-size: 12px;float: right"/>
                  </div>
                </div>
              </CollapsePanel>
            </Collapse>
            <br/>
            <span style="font-size: 14px;font-weight: bold">包含列</span><br/>
            <ul>
              <li>
                <span>凭证日期</span><br>
                <span>当前凭证列表范围内地凭证区间，一般小于当前凭证列表区间</span>
              </li>
              <li>
                <span>凭证号</span><br>
                <span>当前凭证列表的凭证号区间，一般小于当前凭证列表区间</span>
              </li>
              <li>
                <span>凭证金额</span><br>
                <span>根据当前显示样式：“明细”或“汇总” 方式，判断金额大小范围区间</span>
              </li>
            </ul>
            <Button type="primary" style="float: right;margin-top: 10%" @click="filterSearch">
              过滤
            </Button>
          </div>
        </Drawer>
      </div>
      <Import
        @reloadProjects="pageReload(),unCheckTable()"
        @register="registerImportPage"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import router from '/@/router';
import {usePingZhengFillinStoreWidthOut} from '/@/store/modules/boozsoft/pingzheng-fillin';
import {
  DatePicker as ADatePicker,
  Select,
  Input,
  Popover,
  Radio,
  Popconfirm,
  Table,
  Checkbox,
  message,
  Drawer , Collapse, Tooltip, Tag as ATag,Button
} from "ant-design-vue"

const ARangePicker = ADatePicker.RangePicker
const SelectOption = Select.Option
const InputSearch = Input.Search
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const CollapsePanel = Collapse.Panel
import {
  SortDescendingOutlined,
  SortAscendingOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined,
  FilterFilled,
  CheckOutlined,
  SearchOutlined,
  PrinterOutlined,
  UsbOutlined, EditOutlined,
  ExclamationCircleOutlined,FileSearchOutlined
} from '@ant-design/icons-vue';
import {
  findAllAccvoucher,
  breakNumTidy,
  findDbLanMuList,
  saveLanMuList,
  startVoucherStatusProcedural,
  startVoucherCloseStatusProcedural,
  startVoucherSignProcedural,
  startVoucherBookProcedural,
  startVoucherCashierProcedural,
  operateInvalidPingZheng,
  delSpecifyPingZheng
} from '/@/api/record/system/accvoucher'
import {useAccvoucherStore} from '/@/store/modules/accvoucher'
import {onMounted, reactive, ref, onActivated, computed} from "vue";
import moment, {Moment} from "moment";
import {
  initDynamics,
  assemblyDynamicColumn,
  voucherNoAutocomplete,
  isRealNum,
  money,
  combineParameters,
  intervalWorking
} from "./data";
import Import from "/@/views/boozsoft/global/popup/accvoucher/import.vue";
import {cloneDeep} from "lodash-es";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  askTask,
  compareTime, findAccCloseListByYaer,
  findByFunctionModule, hasBlank,
  offsetToStr, pointMessage, getThisIndexImg
} from "/@/api/task-api/tast-bus-api";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";

const {closeCurrent} = useTabs(router);
const {createConfirm, createWarningModal} = useMessage();
// 全局常量
const accvoucherStore = useAccvoucherStore()
// 页面变量
const pageParameter = reactive({
  queryMark: '1',
  showRulesSize: 'MIN',
  thisInterval: '2020-01 ~ 2021-12',
  biZhong: '人民币',
  ifUnit: false,
  condition: {},
  searchConditon: {
    requirement: '',
    value: '',
  },
  filterConditon: {
    dateMin: '',
    dateMax: '',
    amountMin: '',
    amountMax: '',
    pzNumberMin: '',
    pzNumberMax: '',
  },
  treeConditon: {
    type: '',
    monthVal: '',
    list: [],
  }
})
const val = ref({
  openOne: 0,
  total: 0
})
const tableMap = ref({})
const accIdList = ref({})

const userStore = useUserStore();
const visible = ref(false);
const IsTrue = ref(true);
const searchConditonList = ref([])
const lanMuData = {
  'accId': '',
  'menuName': '凭证列表',
  'type': '',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
}
// 表格参数
const loadMark = ref(false)
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const showTree = ref(true)
const windowWidth = computed(()=>(document.documentElement.clientWidth - 70 - (showTree.value? 190:0)))
const windowHeight = (window.innerHeight - 290)
const totalColumnWidth = ref(0)
const manipulateDbName = ref('')
const treeInterval = ref([])
const collapseValue = ref(['1'])
const CrudApi = reactive({
  columns: JSON.parse(JSON.stringify(accvoucherStore.getColumns(pageParameter.queryMark))).slice(0, 10)
})
const tableRef = ref(null)
// 组件实例区
const [registerTable, {
  setColumns,
  getColumns,
  getDataSource,
  setTableData,
  setPagination,
  getPaginationRef
}] = useTable({
  columns: CrudApi.columns,
  bordered: true,
  immediate: false,
  canResize: true,
  showIndexColumn: true, //显示序号列
  indexColumnProps: { width: 60,fixed: 'left',title: '序号'},
  pagination: {
    pageSize: 200,
    showSizeChanger: true,
    pageSizeOptions: ['200', '500', '1000'],
    showTotal: t => `总共${t}条数据`,
  }
})
const [registerImportPage, {openModal: openImportPageM}] = useModal()
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const [registerPrintPage, {openModal: openPrintPageM}] = useModal()
const [registerCustomizeReplace, {openModal: openReplacePageM}] = useModal()
const [registerCashierPage, {openModal: openCashierPageM}] = useModal()
const [registerReviewPage, {openModal: openReviewPageM}] = useModal()
const [registerSignPage, {openModal: openSignPageM}] = useModal()
const [registerBookPage, {openModal: openBookPageM}] = useModal()

onMounted(async () => {

})
// 实例函数区
const openImportPage = () => {
  let data = {schemaName: manipulateDbName.value}
  openImportPageM(true, {
    data: data
  })
}
const openQueryPage = () => {
  val.value.openOne = 0
  openQueryPageM(true, {
    data: val
  })
}
const openPrintPage = () => {
  openPrintPageM(true, {
    data: {}
  })
}

import {
  startVoucherReviewProcedural,
} from '/@/api/record/system/accvoucher';

// import {checkMeetSpecifyConditions} from "/@/views/boozsoft/global/popup/accvoucher-review/bus";
// import {checkMeetSpecifyConditions as checkMeetSpecifyConditionsSign} from "/@/views/boozsoft/global/popup/accvoucher-super-sign/bus";
// import {checkMeetSpecifyConditions as checkMeetSpecifyConditionsBook} from "/@/views/boozsoft/global/popup/accvoucher-book/bus";
// import {checkMeetSpecifyConditions as checkMeetSpecifyConditionsCashier} from "/@/views/boozsoft/global/popup/accvoucher-cashier/bus";
const checkMeetSpecifyConditions=null
const checkMeetSpecifyConditionsSign=null
const checkMeetSpecifyConditionsBook=null
const checkMeetSpecifyConditionsCashier=null
import {
  assemblyPingZhengApproveCanshu,
  getGlobalFinanceSettingInfo
} from "/@/api/record/system/financial-settings";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";

const financialParameters = ref({
  icashier: false, // 出纳必须出纳签字
  imanager: false, // 必须主管签字
})

const openReviewPage = async (flag) => {
  // 必选
  if (tableSelectedRowKeys.value.length === 0) {
    message.warning('至少选择一张凭证！')
    return false;
  }
  // 判断选择的是否记账
  if (tableSelectedRowObjs.value.filter(item => item.ibook == '1'  || !hasBlank(item.cbook)).length > 0) {
    createWarningModal({title: '温馨提示', content: '选择的凭证中存在已记账的凭证！'});
    return false;
  }
  // 开始校验
  let data = {
    scopeCondition: flag ? 1 : 0,
    operatorUserName: userStore.getUserInfo.realName,
    batchCondition: {},
    financialParameters: financialParameters.value,
    selectedRowKeys: [],
    thisInterval: pageParameter.thisInterval
  }
  data.selectedRowKeys = [...new Set(tableSelectedRowObjs.value.map(item => item.uniqueCode))]
  if (await checkMeetSpecifyConditions(data, analyzeTheYearAndAllMonths(tableSelectedRowObjs.value), flag, manipulateDbName.value)) {
    let res = null
    loadMark.value = true
    res = await useRouteApi(startVoucherReviewProcedural, {schemaName: manipulateDbName.value})(data)
    loadMark.value = false
    if (null != res && Object.keys(res).length == 5) {
      openReviewPageM(true, {
        data: {
          'mark': flag,
          'voucherRuleSize': voucherRuleSize,
          'result': res
        }
      })
      if (res.successNumber > 0)
        pageReload()
    }
    tableSelectedRowKeys.value = []
    tableSelectedRowObjs.value = []
  }
}

const openCashierPage = async (flag) => {
  // 必选
  if (tableSelectedRowKeys.value.length === 0) {
    message.warning('至少选择一张凭证！')
    return false;
  }
  // 判断选择的是否记账
  if (tableSelectedRowObjs.value.filter(item => item.ibook == '1' || !hasBlank(item.cbook)).length > 0) {
    createWarningModal({title: '温馨提示', content: '选择的凭证中存在已记账的凭证！'});
    return false;
  }
  // 开始校验
  let data = {
    scopeCondition: flag ? 1 : 0,
    operatorUserName: userStore.getUserInfo.realName,
    batchCondition: {},
    financialParameters: financialParameters.value,
    selectedRowKeys: [], thisInterval: pageParameter.thisInterval
  }
  data.selectedRowKeys = [...new Set(tableSelectedRowObjs.value.map(item => item.uniqueCode))]
  if (await checkMeetSpecifyConditionsCashier(data, analyzeTheYearAndAllMonths(tableSelectedRowObjs.value), flag, manipulateDbName.value)) {
    let res = null
    loadMark.value = true
    res = await useRouteApi(startVoucherCashierProcedural, {schemaName: manipulateDbName.value})(data)
    loadMark.value = false
    if (null != res && Object.keys(res).length == 5) {
      openCashierPageM(true, {
        data: {
          'mark': flag,
          'voucherRuleSize': voucherRuleSize,
          'result': res
        }
      })
      if (res.successNumber > 0)
        pageReload()
    }
    tableSelectedRowKeys.value = []
    tableSelectedRowObjs.value = []
  }

}


const openSignPage = async (flag) => {
  if (tableSelectedRowKeys.value.length === 0) {
    message.warning('至少选择一张凭证！')
    return false;
  }
  // 判断选择的是否记账
  if (tableSelectedRowObjs.value.filter(item => item.ibook == '1' || !hasBlank(item.cbook)).length > 0) {
    createWarningModal({title: '温馨提示', content: '选择的凭证中存在已记账的凭证！'});
    return false;
  }
  // 开始校验
  let data = {
    scopeCondition: flag ? 1 : 0,
    operatorUserName: userStore.getUserInfo.realName,
    batchCondition: {},
    financialParameters: financialParameters.value,
    selectedRowKeys: [], thisInterval: pageParameter.thisInterval
  }
  data.selectedRowKeys = [...new Set(tableSelectedRowObjs.value.map(item => item.uniqueCode))]
  if (await checkMeetSpecifyConditionsSign(data, analyzeTheYearAndAllMonths(tableSelectedRowObjs.value), flag, manipulateDbName.value)) {
    let res = null
    loadMark.value = true
    res = await useRouteApi(startVoucherSignProcedural, {schemaName: manipulateDbName.value})(data)
    loadMark.value = false
    if (null != res && Object.keys(res).length == 5) {
      openSignPageM(true, {
        data: {
          'mark': flag,
          'voucherRuleSize': voucherRuleSize,
          'result': res
        }
      })
      if (res.successNumber > 0) pageReload()
    }
    tableSelectedRowKeys.value = []
    tableSelectedRowObjs.value = []
  }
}

const openBookPage = async (flag) => {

  if (tableSelectedRowKeys.value.length === 0) {
    message.warning('至少选择一张凭证！')
    return false;
  }
  // 开始校验
  let data = {
    scopeCondition: flag ? 1 : 0,
    operatorUserName: userStore.getUserInfo.realName,
    batchCondition: {},
    financialParameters: financialParameters.value,
    selectedRowKeys: [], thisInterval: pageParameter.thisInterval
  }
  data.selectedRowKeys = [...new Set(tableSelectedRowObjs.value.map(item => item.uniqueCode))]
  if (await checkMeetSpecifyConditionsBook(data, analyzeTheYearAndAllMonths(tableSelectedRowObjs.value), flag, manipulateDbName.value)) {
    let res = null
    loadMark.value = true
    res = await useRouteApi(startVoucherBookProcedural, {schemaName: manipulateDbName.value})(data)
    loadMark.value = false
    if (null != res && Object.keys(res).length == 5) {
      openBookPageM(true, {
        data: {
          'mark': flag,
          'voucherRuleSize': voucherRuleSize,
          'result': res
        }
      })
      if (res.successNumber > 0)
        pageReload()
    }
    tableSelectedRowKeys.value = []
    tableSelectedRowObjs.value = []
  }
}


const unCheckTable = () => {
  if (tableSelectedRowKeys.value.length > 0) {
    tableSelectedRowKeys.value = []
    tableSelectedRowObjs.value = []
  }
}
const onSelectChange = (selectedRowKeys, obj) => {
  if (pageParameter.queryMark == '1' && selectedRowKeys.length > 0) {
    if (selectedRowKeys.length > tableSelectedRowKeys.value.length) { // 选中
      let b = [...new Set(obj.map(item => item.uniqueCode))]
      tableSelectedRowObjs.value = getDataSource().filter(item => b.indexOf(item.uniqueCode) != -1)
    } else { // 取消勾选 先 找到被取消的
      let b = [...new Set(tableSelectedRowObjs.value.filter(item => selectedRowKeys.indexOf(item.vouchUnCode) == -1).map(item => item.uniqueCode))]
      tableSelectedRowObjs.value = tableSelectedRowObjs.value.filter(item => b.indexOf(item.uniqueCode) == -1)
    }
    tableSelectedRowKeys.value = tableSelectedRowObjs.value.map(item => item.vouchUnCode)
  } else {
    tableSelectedRowObjs.value = obj;
    tableSelectedRowKeys.value = selectedRowKeys;
  }
};
const currentTableDatasource = ref([])
const pageReload = async (currentPageNum) => {
  let data = JSON.parse(JSON.stringify(pageParameter))
  // 两种处理方式
  if (true /*|| pageParameter.condition.constant.queryType == '1'*/) {
    data.page = null == currentPageNum ? getPaginationRef().current : currentPageNum
    data.size = getPaginationRef().pageSize
    let res = await useRouteApi(findAllAccvoucher, {schemaName: manipulateDbName.value})(data)
    setTableData([])
    if (res != null && res.items.length > 0) {
      loadMark.value = true
      // 关闭
      val.value.total = 1
      // 清空可能残留的数据
      currentTableDatasource.value = res.items
      setTableData(res.items)
      // 底部分页信息
      setPagination({total: res.total})
    } else {
      val.value.total = -1
    }
    loadMark.value = false
  } else {
    data.page = null == currentPageNum ? 1 : currentPageNum
    data.size = 20
    let accIds = pageParameter.condition.constant.accIds
    let tables = {}
    let len = 0
    for (let accId of accIds) {
      tables[accId] = await useRouteApi(findAllAccvoucher, {schemaName: accId + '-' + manipulateDbName.value.split('-')[2]})(data)
      if (tables[accId].total > 0) len++
    }
    if (len > 0) {
      tableMap.value = tables
      accIdList.value = pageParameter.condition.constant.accIds
      val.value.total = 1
    } else {
      val.value.total = -1
    }
    loadMark.value = false
  }
  // showThis.value = true
}
const showThis = ref(true)
const pageReload2 = async (obj) => {
  return false;
  let data = JSON.parse(JSON.stringify(pageParameter))
  data.page = getPaginationRef().current
  data.size = getPaginationRef().pageSize
  loadMark.value = true
  let res = await useRouteApi(findAllAccvoucher, {schemaName: obj.accId + '-' + obj.year})(data)
  if (res != null && res.items.length > 0) {
    manipulateDbName.value = obj.accId + '-' + obj.year
    voucherRuleSize = obj.accvouchDec || '4'
    setTableData([]) // 清空可能残留的数据
    setTableData(res.items)
    // 底部分页信息
    setPagination({total: res.total})
  } else {
    createWarningModal({title: '温馨提示', content: '暂无任何数据！'});
  }
  loadMark.value = false
}

const delBtn = async () => {
  if (tableSelectedRowKeys.value.length === 0) {
    message.warning('至少选择一张凭证！')
    return false;
  }
  // 判断选择的是否记账
  if (tableSelectedRowObjs.value.filter(item => item.ifrag != '2'  && item.ifrag != '3').length > 0) {
    createWarningModal({title: '温馨提示', content: '选择的凭证中存在非暂存或非错误凭证,请刷新页面后重试！'});
    return false;
  }
  // 开始校验
  let data = {
    selectedRowKeys: [...new Set(tableSelectedRowObjs.value.map(item => item.uniqueCode))]
  }
  createConfirm({
    iconType: 'warning',
    title: '系统只允许删除暂存凭证和错误凭证',
    content: '凭证删除后不可恢复，确定删除吗？',
    onOk: async () => {
      // 调整数据库 列参数
      let a = await delSpecifyPingZheng(data)
      if (a > 0){
        createWarningModal({title: '温馨提示', content: '删除凭证成功！'});
        pageReload()
      }else {
        createWarningModal({title: '温馨提示', content: '删除凭证失败！'});
      }
    },
    onCancel: async () => {
      tableSelectedRowObjs.value = []
      tableSelectedRowKeys.value = []
    }
  });
}
const breakNumTidyBtn = async () => {
  // 只有期间查询才有效
  let o = pageParameter.condition.variable
  if (hasBlank(o.periodStart) || hasBlank(o.periodEnd)){
    createWarningModal({title: '温馨提示', content: '请先查询区间后再进行凭证断号整理操作！'});
  }else {
    // 检查数据是否存在
    let data = {
      periodStart: o.periodStart,
      periodEnd: o.periodEnd,
      type: 'query'
    }
    let a = await operateInvalidPingZheng(data)
    if (a > 0){
      createConfirm({
        iconType: 'warning',
        title: '提示',
        content: '当前查询区间存在作废凭证,是否进行先清理作废凭证后再进行凭证断号整理!',
        onOk: async () => {
          // 调整数据库 列参数
          data.type = 'delete'
          let a = await operateInvalidPingZheng(data)
          if (a > 0){
            await arrange(data);
          }else {
            createWarningModal({title: '温馨提示', content: '清理作废凭证失败！'});
          }
        },
        onCancel: async () => {
         await arrange(data);
        }
      });
    }else {
      await arrange(data);
    }
  }
}

const arrange = async (data) => {
  createConfirm({
    iconType: 'warning',
    title: '提示',
    content: '您确定要进行凭证断号整理吗？',
    onOk: async () => {
      // 调整数据库 列参数
      await breakNumTidy(data)
      pageReload()
    },
    onCancel: async () => {
      pageReload()
    }
  });
}

const onChangeSwitch = async (v) => { // 动态列
  pageParameter.queryMark = v ? '1' : '2'
  pageParameter.searchConditon.requirement = 'inoId'
  pageParameter.searchConditon.value = ''
  loadMark.value = true
  resetDynamicColumnData()
}

const pageSearch = async () => {
  /* if (''==pageParameter.searchConditon.value.trim())return false*/
  // 搜索前校验格式
  if ('' == pageParameter.searchConditon.requirement.trim()) {
    message.warn('请选择检索条件')
    return false
  }
  // 校验完成后搜索
  loadMark.value = true
  closeFilterV()
  pageReload()
}

const filterSearch = async () => {
  /* if (''==pageParameter.searchConditon.value.trim())return false*/
  // 搜索前校验格式
  let min = pageParameter.filterConditon.amountMin.trim()
  let max = pageParameter.filterConditon.amountMax.trim()
  let pzMin = pageParameter.filterConditon.pzNumberMin.trim()
  let pzMax = pageParameter.filterConditon.pzNumberMax.trim()
  if ('' == min && max != '' || '' == max && min != '') {
    message.warn('请完善金额区间过滤条件！')
    return false
  }
  if (min != '' && max != '' && (!isRealNum(min) || !isRealNum(max) || parseFloat(min) == 0 || parseFloat(max) == 0)) {
    message.warn('请输入数值类型值并且值不能为0！')
    closeFilterV()
    return false
  } else if (parseFloat(min) > parseFloat(max)) {
    message.warn('金额区间最小值不能大于最大值！')
    closeFilterV()
    return false
  }
  if ('' == pzMin && pzMax != '' || '' == pzMax && pzMin != '') {
    message.warn('请完善凭证区间过滤条件！')
    return false
  }
  if (parseFloat(pzMin) < 0 || parseFloat(pzMax) < 0) {
    message.warn('凭证区间区间值只能为正整数！')
    closeFilterV()
    return false
  }
  if (parseFloat(pzMin) > parseFloat(pzMax)) {
    message.warn('凭证区间最小值不能大于最大值！')
    closeFilterV()
    return false
  }
  // 校验完成后搜索
  pageReload()
}

const closeFilterV = () => {
  pageParameter.filterConditon.amountMin = ''
  pageParameter.filterConditon.amountMax = ''
  visible.value = false
  reloadColumns()
}

const resetFilterConditon = () => {
  pageParameter.filterConditon.amountMin = ''
  pageParameter.filterConditon.amountMax = ''
  pageParameter.filterConditon.pzNumberMin = ''
  pageParameter.filterConditon.pzNumberMax = ''
  pageParameter.filterConditon.dateMin = ''
  pageParameter.filterConditon.dateMax = ''
  visible.value = false
  reloadColumns()
}

const analyzeTheYearAndAllMonths = (list: any) => {
  let months = []
  if (list.length === 0) return {year: '', months: months}
  list.forEach(item => {
    let thisMonth = item.dbillDate.split('-')[1]
    if (months.indexOf(thisMonth) == -1) {
      months.push(thisMonth)
    }
  })
  return {
    year: list[0].dbillDate.split('-')[0],
    months: months
  }
}
/*start栏目设置*/
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});

const confirm = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      lanMuData.accId = manipulateDbName.value.substring(0,manipulateDbName.value.length-5)
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
  lanMuData.accId = manipulateDbName.value.substring(0,manipulateDbName.value.length-5)
  lanMuData.type = pageParameter.queryMark == '1' ? '明细' : '汇总'
  findDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    let statiList = excludeBeforeCoulumn('lanmu')
    dbList = dbList.length > 0? combineParameters(statiList, dbList):statiList
    dynamicColumnData.value = dbList
    dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    // 表格列
    reloadColumns()
    pageReload()
  })
}

function excludeBeforeCoulumn(type:string) {
  let staticList = []
  if (type == 'lanmu'){
    staticList = (initDynamics()['DATA' + pageParameter.queryMark])
  }else {
    staticList = JSON.parse(JSON.stringify(accvoucherStore.getColumns(pageParameter.queryMark)))
  }
  let excludes = [];
  if(!financialParameters.value.icashier)excludes.push('出纳人')
  if(!financialParameters.value.imanager)excludes.push('财务主管')
  return staticList.filter(item => excludes.indexOf(type == 'lanmu'?item['name']:item['title']) == -1)
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

const reloadColumns =  () => {
  let newA = excludeBeforeCoulumn('list')
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  setColumns(newA)
  initTableWidth(newA)
  searchConditonList.value = newA
}

function initTableWidth(thisCs) {
  let total = 60 + 60 // 选择列与序号列
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  if (total > windowWidth.value) {
    let f = 0
    if (visible.value) f = 380
    totalColumnWidth.value = Number(windowWidth.value) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth.value + 52 - f) + 'px')
  } else {
    if (visible.value && (windowWidth.value - 380) < total) total -= (total - (windowWidth.value - 380))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 52) + 'px')
  }
}

/*栏目设置end*/
/*start 作废 or 标错*/

const startChangeStatus = async (flag, number) => {
  let msg = ''
  if (number === 1 && tableSelectedRowKeys.value.length === 0) {
    createWarningModal({title: '开始操作前检测', content: "请选择需要" + (flag ? '' : '取消') + "作废的凭证！"})
  } else if (number === 1 && !flag && tableSelectedRowObjs.value.filter(item => item.ifrag == 1).length === 0) {
    createWarningModal({title: '开始操作前检测', content: '选择已被作废的凭证才能进行取消作废操作！'})
    tableSelectedRowObjs.value = []
    tableSelectedRowKeys.value = []
  } else if (number === 3 && tableSelectedRowKeys.value.length === 0) {
    createWarningModal({
      title: '开始操作前检测',
      content: "请选择需要" + (flag ? '' : '取消') + "标错的凭证！",
      closable: true
    })
  } else if (number === 3 && !flag && tableSelectedRowObjs.value.filter(item => item.ifrag == 3).length === 0) {
    createWarningModal({title: '开始操作前检测', content: '选择已被标错的凭证才能进行取消标错操作！'})
    tableSelectedRowObjs.value = []
    tableSelectedRowKeys.value = []
  } else {
    let yearMonthsObj = analyzeTheYearAndAllMonths(tableSelectedRowObjs.value)
    // 判断当前年月 选择的月份是否已结账
    // 获取指定年度 的所有结账数据
    let closeList = await findAccCloseListByYaer({iyear: yearMonthsObj.year})
    let closeMonth = []
    closeList.forEach(item => {
      if (yearMonthsObj.months.indexOf(item.imonth) != -1 && item.gl == '1') {
        closeMonth.push(item.imonth)
      }
    })
    if (closeMonth.length > 0) {
      createWarningModal({
        title: '开始操作前检测',
        content: '凭证' + closeMonth.toString() + '月份已经结账，不能进行' + flag ? '' : '取消' + number == 1 ? '作废' : '标错' + '凭证操作！'
      })
      return false
    }
    let res = await findByFunctionModule({iyear: yearMonthsObj.year})
    let checkMenu = ['月末结账']
    for (let i = 0; i < res.length; i++) {
      let item = res[i]
      if (checkMenu.indexOf(item.functionModule) != -1 && item.state == '1') {
        // 校验时间
        if (item.functionModule == '月末结账' && item.time != '' && !compareTime(offsetToStr(item.time))
          && yearMonthsObj.months.indexOf(item.imonth) != -1) { // 月末处理单独
          msg = '提示：任务冲突！操作员【' +
          item.caozuoUnique +
          '】正在进行' + item.imonth + '月份' + item.functionModule + '处理!不能进行凭证' + flag ? '' : '取消' + number == 1 ? '作废' : '标错' + '凭证操作，请销后再试，或联系财务主管清理该结账任务后再进行相关操作!'
          break;
        }
      } else if (item.functionModule == '月末结账' && item.time != '' && compareTime(offsetToStr(item.time))) {
        msg = '提示：发现操作员【' +
          item.caozuoUnique +
          '】正在进行' + item.imonth + '月份' + item.functionModule + '操作已经超过30分钟!可能发生任务异常导致任务超时，是否强制清除结账任务？'
        if (await askTask({msg: msg, taskId: item.id, year: yearMonthsObj.year})) {
          msg = ''
          continue
        } else {
          return false
        }
      }
    }
    if (msg != '') {
      createWarningModal({title: '开始操作前检测', content: msg})
      return false
    }
    let data1 = {
      operatorUserName: '',
      selectedRowKeys: [],
      setValue: number
    }
    data1.operatorUserName = userStore.getUserInfo.realName
    data1.selectedRowKeys = [...new Set(tableSelectedRowObjs.value.map(item => item.uniqueCode))]
    if (flag) {
      msg = await useRouteApi(startVoucherStatusProcedural, {schemaName: manipulateDbName.value})(data1)
    } else {
      msg = await useRouteApi(startVoucherCloseStatusProcedural, {schemaName: manipulateDbName.value})(data1)
    }
    await pointMessage({title: '处理结果', content: msg, delay: true})
    setTimeout(() => {
      unCheckTable()
      pageReload()
    }, 1000)
  }
}

/*作废 or 标错 end*/
// 已授权账套列表
const accAuthList = ref([])
// 账套授权信息
const userAuthMap = ref([])
let voucherRuleSize = '4';
const loadPage = async (data) => {
  manipulateDbName.value = data.constant.tenantId
  voucherRuleSize = data.constant.thisAdInfo.accvouchDec || '4'
  let settings =  await getGlobalFinanceSettingInfo( manipulateDbName.value.substring(0, manipulateDbName.value.length-5))
  financialParameters.value =  assemblyPingZhengApproveCanshu(settings)
  // 获取当前账套财务信息
  accAuthList.value = data.accAuthList
  userAuthMap.value = data.userAuthMap
  data.accAuthList = []
  data.userAuthMap = []
  data.constant.thisAdInfo = {}
  pageParameter.condition = data
  pageParameter.queryMark = data.constant.showType
  if (data.variable.periodStart == '' && data.variable.periodEnd == '') {
    pageParameter.thisInterval = data.variable.dateStart + ' ~ ' + data.variable.dateEnd
    treeInterval.value = [data.variable.dateStart,data.variable.dateEnd]
  } else {
    pageParameter.thisInterval = data.variable.periodStart + ' ~ ' + data.variable.periodEnd
    treeInterval.value = [data.variable.periodStart,data.variable.periodEnd]
    pageParameter.treeConditon.type='month'
  }
  loadMark.value = true
  if (data.openOne == 1) { // 第一次初始化 + 条件查询
    resetDynamicColumnData()
  } else { // 查询条件查询
    closeFilterV()
    pageParameter.searchConditon.value = ''
    pageReload()
  }
}
/**
 *  根据指定条件  账套列表
 * */
const pingzhengEditor = usePingZhengFillinStoreWidthOut()
/*账套弹框*/
const [registerInfo, {openModal: openInfoPageM}] = useModal()
const openSelection = () => {
  openInfoPageM(true, {
    data: {accAuthList: accAuthList.value}
  })
}
/* 对接 查看凭证*/
const showPingZheng = (obj: any) => {
  if (null != obj) {
    let b = obj.uniqueCode
    let thisTableSelectedRowObjs = getDataSource().filter(item => item.uniqueCode == b)
    pingzhengEditor.openPingZhengShowEditer(thisTableSelectedRowObjs)
  }
}

const pageChange = (a) => {
  // 分页改变
  loadMark.value = true
  pageReload(a.current)
}
/*动态加载*/
/*const pageC=ref(1)
onMounted(() => {
  const selector = document.querySelector('.a-table-font-size-16  .ant-table-body')
  selector.addEventListener('scroll', (e) => {
    function isLast(){
      return e.srcElement.scrollTop+e.srcElement.offsetHeight==e.srcElement.scrollHeight
    }
    if(isLast()){
      setTableData(currentTableDatasource.value.slice(0, ++pageC.value*30))
      console.log('触发底部')
    }
  })
})*/
/*抽屉*/

const disabledDate = (current) => {
  // 获取区间最小区间
  let variable = pageParameter.condition.variable
  let min
  let max
  if (!hasBlank(variable.periodStart)) {
    min = moment(variable.periodStart + '-01', 'YYYY-MM-DD')
    max = moment(variable.periodEnd, 'YYYY-MM-DD').endOf('month')
  } else {
    min = moment(variable.dateStart, 'YYYY-MM-DD')
    max = moment(variable.dateEnd, 'YYYY-MM-DD')
  }
  return current < min || current > max
};

const openReplace = () => {
  if (tableSelectedRowKeys.value.length === 0) {
    createWarningModal({title: '温馨提示', content: '请至少选择一张凭证！'});
  } else if (tableSelectedRowObjs.value.filter(item => !hasBlank(item.ccashier)).length > 0 || tableSelectedRowObjs.value.filter(item => !hasBlank(item.ccheck)).length > 0
    || tableSelectedRowObjs.value.filter(item => !hasBlank(item.cdirector)).length > 0) {
    createWarningModal({title: '温馨提示', content: '凭证已经经过出纳签字、审核、主管签字,不能进行内容替换！'});
  } else if (tableSelectedRowObjs.value.filter(item => item.ibook == '1' || !hasBlank(item.cbook)).length > 0) {// 判断选择的是否记账
    createWarningModal({title: '温馨提示', content: '选择的凭证中存在已记账的凭证，已记账凭证不能进行替换！'});
  } else if (false) {// 判断选择的是否记账
    createWarningModal({title: '温馨提示', content: '已经进行过往来核销和银行对账核销的凭证，不能进行内容替换！'});
  } else {
    openReplacePageM(true, {
      data: {
        selectedRowKeys: [...new Set(tableSelectedRowObjs.value.map(item => item.uniqueCode))],
        selectedCodes: [...new Set(tableSelectedRowObjs.value.map(item => item.ccode))],
        dynamicTenant: manipulateDbName.value
      }
    })
  }
}
import VoucherTree from "./Component/VoucherTree.vue";
/*****************左侧树变化******************/
const treeFilter = (obj) => {
  pageParameter.treeConditon.list =  obj.treeCondition
  pageParameter.treeConditon.monthVal =  obj.monthVal
  pageParameter.treeConditon.type =  obj.type
  loadMark.value = true
  pageReload()
}
/*****************左侧树变化******************/
</script>
<style src="../../../../assets/styles/global-menu-index1.less" lang="less" scoped></style>
