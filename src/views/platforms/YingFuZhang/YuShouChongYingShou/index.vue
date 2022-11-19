<template>
  <div class="app-container">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>预付冲应付的页面</textarea>复制内容快速定位页面</div>-->
    <div class="app-container-top lcr-theme-div">
      <div>
        <div>
          <CopyOutlined style="color: white;font-size: 50px;"/>
        </div>
        <div>
          <AccountPicker theme="three" :readonly="status==3" @reloadTable="dynamicAdReload"/>
        </div>
      </div>
      <div></div>
      <div>
        <div>
          <Button class="actod-btn" @click="openPage()" v-if="status == 3">查看</Button>
          <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3">新增</Button>
          <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
          <Button class="actod-btn" @click="startDel" v-if="status == 3 && formItems.id != null">删除</Button>
          <Popover placement="bottom" v-if="status == 3">
            <template #content>
              <span class="group-btn-span-special">&nbsp;来源单据&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;下游单据&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn">联查</Button>
          </Popover>
          <Popover placement="bottom" v-if="status == 3">
            <template #content>
              <span class="group-btn-span-special">&nbsp;复制&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导入&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导出&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn">更多</Button>
          </Popover>
          <Button v-if="status != 3" class="actod-btn">导入</Button>
          <Button class="actod-btn actod-btn-last" @click="outBefore">退出</Button>
        </div>
        <div :class="status != 3?'status-look':''">
          <!--          <div class="acttd-right-d-search">
                      <InputSearch
                        class="acttdrd-search-input"
                        placeholder="存货编码或名称"
                        style="border-left:1px solid #c9c9c9;"
                        @search="pageSearch"
                        v-model:value="pageParameter.searchConditon.value"
                      />
                    </div>-->
          <div class="acttd-right-d-btns">
            <Button class="acttdrd-btn" @click="pageReload()">
              <SyncOutlined :style="{ fontSize: '14px' }"/>
            </Button>
            <Popover placement="bottom">
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
              <Button class="acttdrd-btn">
                <SettingFilled :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
    <div class="app-container-bottom" :style="{height: (windowHeight+70)+'px'}">
      <div class="acb-head">
        <div class="acbgead-one">
          <div class="acbgead-one-triangle">
            <div></div>
            <div>
              <span style="color: white;">{{
                  status == 0 ? '暂存' : status == 1 ? '新增' : status == 2 ? '编辑' : '查看'
                }}</span>
            </div>
          </div>
          <div class="acbgead-one-changes" :class="status == 1 || status == 2 ?'status-look':''">
            <!--            已审核、已核销、已开票-->
            <VerticalRightOutlined @click="contentSwitch('first')"/>&nbsp;
            <LeftOutlined @click="contentSwitch('prev')"/>&nbsp;
            <RightOutlined @click="contentSwitch('next')"/>&nbsp;
            <VerticalLeftOutlined @click="contentSwitch('tail')"/>
          </div>
          <span style="font-size: 28px;font-weight: bold;border-bottom:3px double #0096c7;" :style="{color: titleValue===0?'#0096c7':'red'}">
            {{ titleContents[titleValue] }}
          </span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <label>单据日期：</label>
          <DatePicker v-model:value="formItems.ddate" @change="generateCode(formItems.ddate)" :disabled-date="disabledDate" :locale="localeCn" placeholder="" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 15%;"/>
          <label>单据编号：</label>
          <Input v-model:value="formItems.ccode" :disabled="true" style="width: 15%;"/>
          <label>预付结算供应商：</label>
          <Select v-model:value="formItems.cvencodeZc" @change="cvencodeChange()" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cvencodeZc')"/>
            </template>
            <SelectOption v-for="item in customerList" :value="item.id" >
              {{ item.custName }}
            </SelectOption>
          </Select>
          <label>应付结算供应商：</label>
          <Select v-model:value="formItems.cvencodeZr" @change="cvencodeChange1()" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cvencodeZr')"/>
            </template>
            <SelectOption v-for="item in customerList" :value="item.id" >
              {{ item.custName }}
            </SelectOption>
          </Select>
          <br/>

          <label>业务部门：</label>
          <Select v-model:value="formItems.cdepcode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cdepcode')"/>
            </template>
            <SelectOption v-for="item in deptList" :value="item.id" >
              {{ item.deptName }}
            </SelectOption>
          </Select>
          <label>业务人：</label>
          <Select v-model:value="formItems.cpersoncode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined  v-if="status == 1 || status == 2" @click="openHeadSelectContent('cpersoncode')"/>
            </template>
            <SelectOption v-for="item in psnList" :value="item.id" >
              {{ item.psnName }}
            </SelectOption>
          </Select>
          <label>冲销金额：</label>
          <Input v-model:value="formItems.cxIsum" style="width: 15%;"/>
        </div>
      </div>
      <div class="acb-centent">
        <!--  针对过滤框显示添加的内容高度 :class="status == 3?'status-look':''"  -->
        <!--       :rowKey="r=>r.assetsCode"-->
        <div>
          <span style="font-size: 18px;font-weight: bold;color: #0096c7;">预付冲销明细</span>
          <div v-if="status == 1 || status == 2" style="float: right;">
            <Button class="ant-btn-sm actod-btn" @click="fentan">分摊</Button>
            <Button class="ant-btn-sm actod-btn" @click="openSelectSkd">选单</Button>
            <Button class="ant-btn-sm actod-btn" @click="tableDel">删单</Button>
          </div>
          <BasicTable
            ref="tableRef"
            :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
            :clickToRowSelect="false"
            :loading="loadMark"
            :row-selection="{ type: 'checkbox',selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
            :scroll="{ x: totalColumnWidth,y:160}"
            @register="registerTable"
            :dataSource="tableData"
          >
            <template #sourcetype="{ record }">{{ formatHxStyle(record.sourcetype) }}</template>
            <template #isum="{ record }">{{ toThousandFilter(record.isum) }}</template>
            <template #whxIsum="{ record }">{{ toThousandFilter(record.whxIsum) }}</template>
            <template #hxMoney="{ record,index }">
              <template v-if="record.editOne">
                <InputNumber v-model:value="record.tempOne" class="hxMoney" @blur="checkMoney(record,index,'hxMoney')" style="width: 85%;" @keyup.enter="focusNext(record,'hxMoney')"/>
                <CheckOutlined @click="record.editOne = null;record.hxMoney=record.tempOne;tableDataChange(record,'hxMoney')"/>
              </template>
              <template v-else>
                <div @click="record.editOne = true;"
                     :class="status == 1 || status == 2?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{toThousandFilter(record.hxMoney)}}</span>
                </div>
              </template>
            </template>

<!--            <template #footer>
              <div class="nc-summary">
                <div style="width:24%;">
                  <span>合计</span>
                </div>
                <div style="width:25%;">
                  <span>金额:</span>
                  <span>&ensp;{{ toThousandFilter(isum) }}</span>
                </div>
                <div style="width:25%;">
                  <span>未结款金额:</span>
                  <span>&ensp;{{ toThousandFilter(whxIsum) }}</span>
                </div>
                <div style="width:25%;">
                  <span>冲销金额:</span>
                  <span>&ensp;{{ toThousandFilter(hxMoney) }}</span>
                </div>
              </div>
            </template>-->
            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                  <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="2" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="3" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="4" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="5" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(isum) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="6" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(whxIsum) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="7" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(hxMoney) }}</TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>
          </BasicTable>
        </div>
        <div style="margin-top: 10px;">
          <span style="font-size: 18px;font-weight: bold;color: #0096c7;">应付冲销明细</span>
          <div v-if="status == 1 || status == 2" style="float: right;">
            <Button class="ant-btn-sm actod-btn" @click="fentan1">分摊</Button>
            <Button class="ant-btn-sm actod-btn" @click="openSelectXhd">选单</Button>
            <Button class="ant-btn-sm actod-btn" @click="tableDel1">删单</Button>
          </div>
          <BasicTable
            ref="tableRef1"
            :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
            :clickToRowSelect="false"
            :loading="loadMark"
            :row-selection="{ type: 'checkbox',selectedRowKeys: state1.selectedRowKeys, onChange: onSelectChange1 }"
            :scroll="{ x: totalColumnWidth1,y: 160}"
            @register="registerTable1"
            :dataSource="tableData1"
          >
            <template #sourcetype="{ record }">{{ formatHxStyle(record.sourcetype) }}</template>
            <template #isum="{ record }">{{ toThousandFilter(record.isum) }}</template>
            <template #whxIsum="{ record }">{{ toThousandFilter(record.whxIsum) }}</template>
            <template #hxMoney="{ record,index }">
              <template v-if="record.editOne">
                <InputNumber v-model:value="record.tempOne" class="hxMoney" @blur="checkMoney(record,index,'hxMoney')" style="width: 85%;" @keyup.enter="focusNext1(record,'hxMoney')"/>
                <CheckOutlined @click="record.editOne = null;record.hxMoney=record.tempOne;tableDataChange1(record,'hxMoney')"/>
              </template>
              <template v-else>
                <div @click="record.editOne = true;"
                     :class="status == 1 || status == 2?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{toThousandFilter(record.hxMoney)}}</span>
                </div>
              </template>
            </template>

<!--            <template #footer>
              <div class="nc-summary">
                <div style="width:24%;">
                  <span>合计</span>
                </div>
                <div style="width:25%;">
                  <span>金额:</span>
                  <span>&ensp;{{ toThousandFilter(isum1) }}</span>
                </div>
                <div style="width:25%;">
                  <span>未结款金额:</span>
                  <span>&ensp;{{ toThousandFilter(whxIsum1) }}</span>
                </div>
                <div style="width:25%;">
                  <span>冲销金额:</span>
                  <span>&ensp;{{ toThousandFilter(hxMoney1) }}</span>
                </div>
              </div>
            </template>-->
            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                  <TableSummaryCell class="nc-summary" :index="0" :align="'center'">合</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="1" :align="'center'">计</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="2" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="3" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="4" :align="'center'"></TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="5" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(isum1) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="6" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(whxIsum1) }}</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="7" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{ toThousandFilter(hxMoney1) }}</TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>
          </BasicTable>
        </div>
        <SelectXhd
          @save="saveSelectXhd"
          @register="registerSelectXhdPage"
        />
        <SelectSkd
          @save="saveSelectSkd"
          @register="registerSelectSkdPage"
        />
      </div>
    </div>
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Popover,
  Radio,
  Select,
  Switch,
  Table,
  Tabs,
  Tag
} from "ant-design-vue";
import {
  CheckOutlined,
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
  VerticalRightOutlined,
  CaretDownOutlined,CopyOutlined
} from '@ant-design/icons-vue';
import {getCurrentInstance, nextTick, onMounted, reactive, ref} from "vue";
import {useMessage} from "/@/hooks/web/useMessage";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {JsonTool, NumberTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {cloneDeep} from "lodash-es";
import SupperModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue"
import {
  findAll as findAllJiLang,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import moment from "moment";
import {
  deleteArApYsyfById, deleteArApYsyfsByCcode, deleteArApYsyfsById, deleteXyCsouceById,
  findArApWriteOffByCcode, findArApYsyfByCcode,
  findArApYsyfsByCcode,
  findByTypeList, findXyCsourceByCcodeAndXyccode, saveStockXyCsource, saveWriteOff,
  saveWriteOffList,
  saveYsyf,
  saveYsyfsList
} from "/@/api/record/system/arApYsyf";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {findPsnByFlag} from "/@/api/record/system/psn";
import {findDeptByFlag} from "/@/api/record/system/dept";
import {findAll} from "/@/api/record/supplier_data/supplier";
import {findAllProject} from "/@/api/record/system/project";
import {findSettModesByFlag} from "/@/api/record/system/sett-modes";
import {
  add,
  pad,
  sub,
  toThousandFilter
} from "../YingShouKuanQiChuYuE/calculation";
import {getSysBankAccountByStatus} from "/@/api/record/system/sys-bank-account";
import {
  getByStockBalanceTask,
  stockBalanceTaskDelByUserName
} from "/@/api/record/stock/stock_balance";
import {saveTaskApi} from "/@/api/record/system/task";
import {findPeriodByYearList} from "/@/api/record/system/ar-ap-period";
import {
  deleteArXySouceById,
  findArBeginBalanceByCcode, findArXySourceByCcodeAndXyccode,
  findByCvencode,
  saveArXySource,
  saveBeginBalance
} from "/@/api/record/system/arBeginBalance";
import {findByStockAccId} from "/@/api/record/system/stock-account";
import {
  deleteArApChongxiaosByCcode,
  deleteArApChongxiaosById, deleteByCxCcode,
  findArApChongxiaoList,
  findArApChongxiaosByCcode,
  findBukongCcode, findChongxiaosByCcode,
  saveArApChongxiao, saveArApChongxiaosList
} from "/@/api/record/system/ArApChongxiao";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
import {
  findWarehousingByCcode,
  findWarehousingsByCcode,
  saveWarehousingsList,
  saveWarehousing
} from "/@/api/record/system/yfd";

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputSearch = Input.Search
const SelectOption = Select.Option
const TabPane = Tabs.TabPane
const TableSummary = Table.Summary
const TableSummaryRow = TableSummary.Row
const TableSummaryCell = TableSummary.Cell

const {createErrorModal, createConfirm, createWarningModal} = useMessage()
const {closeCurrent} = useTabs(router);
const windowHeight = (window.innerHeight - 300)
const totalColumnWidth = ref(0)
const totalColumnWidth1 = ref(0)
const dynamicTenantId:any = ref('')
const dynamicAccId:any = ref('')
const dynamicYear:any = ref('')
const titleContents = ['预付冲应付', '预付冲应付', '预付冲应付']
const titleValue = ref(0)
const formRowNum = ref(1)

const clickMoney = ref(true)

const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'YF'
})
const changeBtns = ref({
  first: true,
  prev: true,
  next: true,
  tail: true,
})
const formItems: any = ref({})
const jiList:any = ref([])
const manyJiList:any = ref([])
const ckListOptions:any = ref([])
const operatorList:any = ref([])
const cardListOptions:any = ref([])
const assetsCardList:any = ref([])
const arApYsyfList:any = ref([])
const apHexiaoAuto:any = ref()
const apSourceFlag:any = ref()
const apCheckFlag:any = ref()
const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  // dynamicYear.value = obj.stockYear
  dynamicYear.value = useCompanyOperateStoreWidthOut().getLoginDate.split('-')[0]

  const res = await findByStockAccId(obj.accId)
  apHexiaoAuto.value = res.apHexiaoAuto
  apSourceFlag.value = res.apSourceFlag
  apCheckFlag.value = res.apCheckFlag

  useAccountPickerCache().set(obj)

  formItems.value.id = null
  await reloadList()
  await pageReload()
}

//打开预付冲应付列表
function openPage(){
  pageParameter.year = dynamicYear.value
  pageParameter.dynamicTenantId = dynamicTenantId.value
  pageParameter.dynamicAccId = dynamicAccId.value
  pageParameter.ddate1 = dynamicYear.value+'-01-01'
  pageParameter.ddate2 = dynamicYear.value+'-12-31'
  router.push({
    path: '/YingFuZhang/ChongXiao/ChaXun/YuShouChongYingShouLieBiao',
    query: pageParameter
  });
}

const tableData:any = ref([]);
const tableData1:any = ref([]);

const formFuns:any = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})

const route = useRoute();
const routemsg = ref(route.query);
onMounted(async () => {
  /*console.log(routemsg.value)
  console.log(routemsg.value.id)
  console.log(JSON.stringify(routemsg.value).length)*/
  dynamicTenantId.value = routemsg.value.dynamicTenantId
  dynamicAccId.value = routemsg.value.defaultAdName
  dynamicYear.value = routemsg.value.year
  const res = await findByStockAccId(dynamicAccId.accId)
  apHexiaoAuto.value = res.apHexiaoAuto
  apSourceFlag.value = res.apSourceFlag
  apCheckFlag.value = res.apCheckFlag
  //新增
  if (routemsg.value.isEdit == '1') {
    status.value = routemsg.value.isEdit
    formItems.value.id = null
    await startEdit('add')
  } else if (routemsg.value.isEdit == '2' || routemsg.value.isEdit == '3') {
    status.value = routemsg.value.isEdit
    formItems.value.id = routemsg.value.id
    // await contentSwitch('curr')
  }
})

const pageReload = async () => {
  await contentSwitch(formItems.value.id == null?'tail':'curr')
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
  accId: dynamicAccId.value,
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
const settModesList:any = ref([])
const bankAccountList:any = ref([])
async function reloadList() {
  psnList.value = await useRouteApi(findPsnByFlag,{schemaName: dynamicTenantId})({})
  deptList.value = await useRouteApi(findDeptByFlag,{schemaName: dynamicTenantId})({})
  const res = await useRouteApi(findAll,{schemaName: dynamicTenantId})(parameter)
  customerList.value = res.items
  projectList.value = await useRouteApi(findAllProject,{schemaName:dynamicTenantId})({})
  const res1 = await useRouteApi(findSettModesByFlag,{schemaName: dynamicTenantId})({})
  settModesList.value = res1.items
  bankAccountList.value = await useRouteApi(getSysBankAccountByStatus,{schemaName: dynamicTenantId})({})

  jiList.value = await useRouteApi(findAllJiLang, {schemaName: dynamicTenantId})({unitName: ''})
  manyJiList.value = await useRouteApi(findUnitInfoList, {schemaName: dynamicTenantId})({})
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
}

const saleousingList:any = ref([])
const qcysdList:any = ref([])
async function cvencodeChange(){
  await balanceTaskDel()
  tableData.value = []
  if (tableData.value.length < 20) {
    let num = 20 - tableData.value.length
    for (let i = 0; i < num; i++) {
      tableData.value.push({})
    }
  }
  countTable()
  setTableData(tableData.value)
}

async function cvencodeChange1(){
  await balanceTaskDel()
  tableData1.value = []
  if (tableData1.value.length < 20) {
    let num = 20 - tableData1.value.length
    for (let i = 0; i < num; i++) {
      tableData1.value.push({})
    }
  }
  countTable()
  setTableData1(tableData1.value)
}

const num = ref(0)
async function contentSwitch(action) {
  loadMark.value = true
  const res = await useRouteApi(findArApChongxiaoList,{schemaName: dynamicTenantId})({billStyle:'YF',iyear:dynamicYear.value})
  arApYsyfList.value = res.filter(item => item.bdocumStyle!='1')
  if(arApYsyfList.value.length>0){
    if (action=='first'){
      num.value = 0
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[0])
    } else if (action=='prev'){
      num.value = num.value==0?0:num.value-1
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    } else if (action=='next'){
      num.value = num.value==arApYsyfList.value.length-1?arApYsyfList.value.length-1:num.value+1
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    } else if (action=='tail') {
      num.value = arApYsyfList.value.length-1
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    } else {
      for (let i = 0; i < arApYsyfList.value.length; i++) {
        const item = arApYsyfList.value[i]
        if (routemsg.value.id == item.id){
          num.value = i
        }
      }
      formItems.value = JsonTool.parseProxy(arApYsyfList.value[num.value])
    }
    const res = await useRouteApi(findChongxiaosByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:'YF'})
    tableData.value = res.filter(item => item.busStyle=='FKD' || item.busStyle=='QCFKD').map(item => {
      item.whxIsum = sub(item.isum, item.ydhxIsum)
      item.hxMoney = item.hxIsum
      item.ljhxIsum = item.ydhxIsum
      return item
    })
    if (tableData.value.length<20) {
      let num = 20 - tableData.value.length
      for (let i = 0; i < num; i++) {
        tableData.value.push({})
      }
    }
    setTableData(tableData.value)
    tableData1.value = res.filter(item => item.busStyle!='FKD' && item.busStyle!='QCFKD').map(item => {
      item.whxIsum = sub(item.isum, item.ydhxIsum)
      item.hxMoney = item.hxIsum
      item.ljhxIsum = item.ydhxIsum
      return item
    })
    if (tableData1.value.length<20) {
      let num = 20 - tableData1.value.length
      for (let i = 0; i < num; i++) {
        tableData1.value.push({})
      }
    }
    setTableData1(tableData1.value)
    countTable()
  } else {
    await startEdit('add')
    message.success('暂无数据！')
  }
  loadMark.value = false
}

// 0 暂存 1 新建 2编辑 3查看
const status:any = ref(3)

const CrudApi = {
  columns: [
    {
      title: '单据类型',
      dataIndex: 'sourcetype',
      ellipsis: true,
      slots: {customRender: 'sourcetype'},
      width: 100,
    },
    {
      title: '单据日期',
      dataIndex: 'sourcedate',
      ellipsis: true,
      width: 120,
    },
    {
      title: '单据编号',
      dataIndex: 'sourcecode',
      ellipsis: true,
      width: 150,
    },
    {
      title: '金额',
      dataIndex: 'isum',
      ellipsis: true,
      slots: {customRender: 'isum'},
      align: 'right',
      width: 150,
    },
    {
      title: '未结款金额',
      dataIndex: 'whxIsum',
      ellipsis: true,
      slots: {customRender: 'whxIsum'},
      align: 'right',
      width: 150,
    },
    {
      title: '冲销金额',
      dataIndex: 'hxMoney',
      ellipsis: true,
      slots: {customRender: 'hxMoney'},
      align: 'right',
      width: 150,
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

const CrudApi1 = {
  columns: [
    {
      title: '单据类型',
      dataIndex: 'sourcetype',
      ellipsis: true,
      slots: {customRender: 'sourcetype'},
      width: 100,
    },
    {
      title: '单据日期',
      dataIndex: 'sourcedate',
      ellipsis: true,
      width: 120,
    },
    {
      title: '单据编号',
      dataIndex: 'sourcecode',
      ellipsis: true,
      width: 150,
    },
    {
      title: '金额',
      dataIndex: 'isum',
      ellipsis: true,
      slots: {customRender: 'isum'},
      align: 'right',
      width: 150,
    },
    {
      title: '未结款金额',
      dataIndex: 'whxIsum',
      ellipsis: true,
      slots: {customRender: 'whxIsum'},
      align: 'right',
      width: 150,
    },
    {
      title: '冲销金额',
      dataIndex: 'hxMoney',
      ellipsis: true,
      slots: {customRender: 'hxMoney'},
      align: 'right',
      width: 150,
    }
  ]
}
// 这是示例组件
const [registerTable1, {
  reload:reload1,
  getDataSource:getDataSource1,
  setTableData:setTableData1,
  setPagination:setPagination1,
  getPaginationRef:getPaginationRef1,
  getColumns:getColumns1,
  setColumns:setColumns1
}] = useTable({
  columns: CrudApi1.columns,
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

function formatCunitid(cunitid) {
  let str = cunitid
  settModesList.value.forEach(item=>{
    if(cunitid==item.settModesCode){
      str = item.settModesName
    }
  })
  return str
}

function formatCunitidF1(cunitidF1) {
  let str = ''
  bankAccountList.value.forEach(item=>{
    if (cunitidF1==item.ccode){
      str = item.cname
    }
  })
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

function formatHxStyle(hxStyle){
  let str = hxStyle
  if (hxStyle=='CGDHD'){
    str = '采购到货单'
  } else if (hxStyle=='YFD'){
    str = '应付单'
  } else if (hxStyle=='CGFP'){
    str = '采购发票'
  } else if (hxStyle=='QCCGDHD'){
    str = '期初采购到货单'
  } else if (hxStyle=='QCYFD'){
    str = '期初应付单'
  } else if (hxStyle=='QCCGFP'){
    str = '期初采购发票'
  } else if (hxStyle=='FKD'){
    str = '付款单'
  } else if (hxStyle=='QCFKD'){
    str = '期初付款单'
  }
  return str
}

function checkMoney(record,index,str){
  let num1 = record.whxIsum
  let num2 = 0
  let num3 = 0
  if(record.tempOne!=null && record.tempOne!='') {
    num2 = record.tempOne
  }
  if(record.tempTwo!=null && record.tempTwo!='') {
    num3 = record.tempTwo
  }
  let sum = add(num2,num3)
  if (num1-sum<0){
    if (str=='hxMoney'){
      record.tempOne = ''
      record.hxMoney = ''
    }
    if (str=='idiscount'){
      record.tempTwo = ''
      record.idiscount = ''
    }
  }
  tableData1.value[index] = record
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

//选中内容
const state1 = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const checkRow1: any = ref([])
const onSelectChange1 = (selectedRowKeys,row) => {
  // console.log('selectedRowKeys changed: ', row);
  state1.selectedRowKeys = selectedRowKeys;
  checkRow1.value = row
};

const tableDel = async () => {
  if (checkRow.value.length > 0) {
    let list = getDataSource()
    for (let i = 0; i < checkRow.value.length; i++) {
      let item = checkRow.value[i]
      let danju = formatHxStyle(item.sourcetype)
      let model = 'ap'
      await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
        iyear: dynamicYear.value,
        userName: useUserStoreWidthOut().getUserInfo.id,
        functionModule: danju,
        method: '审核',
        recordNum:item.ccode
      })
      let selectIndex = list.findIndex(it => it.key === item.key)
      list.splice(selectIndex, 1)
    }
    tableData.value = list
    setTableData(list)
    checkRow.value = []
    countTable()
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}

const tableDel1 = async () => {
  if (checkRow1.value.length > 0) {
    let list = getDataSource1()
    for (let i = 0; i < checkRow1.value.length; i++) {
      let item = checkRow1.value[i]
      let danju = formatHxStyle(item.sourcetype)
      let model = item.billStyle == 'YFD' ? 'ap' : 'stock'
      await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
        iyear: dynamicYear.value,
        userName: useUserStoreWidthOut().getUserInfo.id,
        functionModule: danju,
        method: '审核',
        recordNum:item.ccode
      })
      let selectIndex = list.findIndex(it => it.key === item.key)
      list.splice(selectIndex, 1)
    }
    tableData1.value = list
    setTableData1(list)
    checkRow1.value = []
    countTable()
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}

const flag = ref(false)
//根据日期判断是否结账
async function jiezhang() {
  if(formItems.value.ddate==null || formItems.value.ddate==''){
    formItems.value.ddate = useCompanyOperateStoreWidthOut().getLoginDate
  }
  let yy = formItems.value.ddate.substring(0, 4)
  let mm = formItems.value.ddate.substring(5, 7)
  const res = await findPeriodByYearList(yy)
  for (let i = 0; i < res.length; i++) {
    let item = res[0]
    if (item.stockMonth == mm) {
      if (item.iar == '1') {
        flag.value = true
      }
    }
  }
  flag.value = false
}

const startEdit = async (type) => {
  let maxR = 20
  if (type === 'add') {
    await jiezhang()
    if(flag.value){
      return createWarningModal({ content: '应付款已进行月末结账,不能进行操作！' });
    }
    let ymjz= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应付款月末结账',method:'月末结账'})
    if(ymjz.length){
      return createWarningModal({ content: ymjz[0]?.username+'正在进行应付款月末结账,不能同时进行操作！' });
    }
    let zdhx= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应付自动核销',method:'核销'})
    if(zdhx.length){
      return createWarningModal({ content: zdhx[0]?.username+'正在进行应付自动核销,不能同时进行操作！' });
    }
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'预付冲应付',method:'添加'})
    if(taskData.length==0){
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'预付冲应付',method:'添加',caozuoModule:'ap'})
    } else {
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'预付冲应付',method:'添加',caozuoModule:'ap'})
    }
    status.value = 1
    formItems.value.id=null
    let date:any = useCompanyOperateStoreWidthOut().getLoginDate
    dynamicYear.value = date.split('-')[0]
    // 获取最新
    let code = await generateCode(date)
    formItems.value = {
      ddate: date,
      ccode: code,
      busStyle: 'YF',
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code,
      busStyle: 'YF',
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    countTable()
    tableData.value = list
    setTableData(list)
    tableData1.value = list
    setTableData1(list)
  } else {
    status.value = 2
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    countTable()
    tableData.value = list
    setTableData(list)
    tableData1.value = list
    setTableData1(list)
  }

}

async function generateCode(date) {
  let code=''
  //日期(年月)
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
  if(date!=null && date!='') {
    yy = date.substring(0, 4)
    mm = date.substring(5, 7)
  }
  dynamicYear.value = yy
  // let yy = formItems.value.ddate.substring(0,4)
  // let mm = formItems.value.ddate.substring(5,7)
  let str = 'YS-' + yy + mm + '-'
  const ysyf = await useRouteApi(findBukongCcode,{schemaName: dynamicTenantId})({
    num:4,
    sum:14,
    qzNum:10,
    qianzhui:str,
    billStyle: pageParameter.type
  })
  if (ysyf.ccode != null && ysyf.ccode != ''){
    code = str + pad(ysyf.ccode, 4)
  } else {
    code = str + '0001'
  }
  formItems.value.ccode = code
  return code
}

const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '暂无任何单据！'
    })
  } else {
    //判断存货和应付模块是否结账
    await jiezhang()
    if(flag.value){
      return createWarningModal({ content: '应付款已进行月末结账,不能进行操作！' });
    }
    //判断当前操作账套是否有人正在做结账
    let ymjz= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应付款月末结账',method:'月末结账'})
    if(ymjz.length){
      return createWarningModal({ content: ymjz[0]?.username+'正在进行应付款月末结账,不能同时进行操作！' });
    }
    let zdhx= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应付自动核销',method:'核销'})
    if(zdhx.length){
      return createWarningModal({ content: zdhx[0]?.username+'正在进行应付自动核销,不能同时进行操作！' });
    }
    createConfirm({
      iconType: 'warning',
      title: '预付冲应付删除',
      content: '您确定要进行预付冲应付删除吗!',
      onOk: async () => {
        //判断预付冲应付
        let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'预付冲应付',method:'删除',recordNum:formItems.value.ccode})
        if(taskData.length==0){
          await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'预付冲应付',method:'删除',recordNum:formItems.value.ccode,caozuoModule:'ap'})
        } else {
          // 任务不是当前操作员的
          if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
            return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+'预付冲应付,不能同时进行操作！' });
          }else{
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'预付冲应付',method:'删除',recordNum:formItems.value.ccode,caozuoModule:'ap'})
          }
        }
        const list = await useRouteApi(findArApChongxiaosByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.busStyle})
        const skdList = list.filter(item => item.busStyle=='FKD' || item.busStyle=='QCFKD')
        const ysdList = list.filter(item => item.busStyle!='FKD' && item.busStyle!='QCFKD')
        //修改应付单核销金额和核销状态
        for (let j = 0; j < skdList.length; j++) {
          let item1 = skdList[j]
          if(item1.sourcetype.substring(0,2)=='QC'){
            //期初应付单
            const xhdyue = await useRouteApi(findArBeginBalanceByCcode, {schemaName: dynamicTenantId})(item1.sourcecode)
            xhdyue.hxIsum = sub(xhdyue.hxIsum, add(item1.hxIsum == null ? '' : item1.hxIsum, item1.idiscount == null ? '' : item1.idiscount))
            xhdyue.hxFlag = '0'
            await useRouteApi(saveBeginBalance, {schemaName: dynamicTenantId})(xhdyue)
            //删除下游单据
            const xySource = await useRouteApi(findArXySourceByCcodeAndXyccode, {schemaName: dynamicTenantId})({
              ccode: xhdyue.ccode,
              xyccode: formItems.value.ccode
            })
            if (xySource.length > 0) {
              await useRouteApi(deleteArXySouceById, {schemaName: dynamicTenantId})(xySource[0].id)
            }
          }else {
            const res = await useRouteApi(findArApYsyfByCcode, {schemaName: dynamicTenantId})(item1.sourcecode)
            if (res.length > 0) {
              let ysyf = res[0]
              ysyf.hxIsum = sub(ysyf.hxIsum == null ? '' : ysyf.hxIsum, item1.hxIsum == null ? '' : item1.hxIsum)
              ysyf.busStyle = 'PTFK'
              if (sub(ysyf.isum, ysyf.hxIsum) == 0) {
                ysyf.writeOffStatus = '1'
              } else {
                ysyf.writeOffStatus = '0'
              }
              if (ysyf.hzhcNum > 0) {
                ysyf.hzhcNum = sub(ysyf.hzhcNum, 1)
              }
              await useRouteApi(saveYsyf, {schemaName: dynamicTenantId})(ysyf)
              //删除下游单据
              const xySource = await useRouteApi(findArXySourceByCcodeAndXyccode, {schemaName: dynamicTenantId})({
                ccode: ysyf.ccode,
                xyccode: formItems.value.ccode
              })
              if (xySource.length > 0) {
                await useRouteApi(deleteArXySouceById, {schemaName: dynamicTenantId})(xySource[0].id)
              }
            }
          }
        }
        //修改付款单核销金额和核销状态
        for (let i = 0; i < ysdList.length; i++) {
          let item = ysdList[i]
          if(item.sourcetype.substring(0,2)=='QC'){
            //期初应付单
            const xhdyue = await useRouteApi(findArBeginBalanceByCcode, {schemaName: dynamicTenantId})(item.ccode)
            xhdyue.hxIsum = sub(xhdyue.hxIsum, add(item.hxIsum == null ? '' : item.hxIsum, item.idiscount == null ? '' : item.idiscount))
            xhdyue.hxFlag = '0'
            await useRouteApi(saveBeginBalance, {schemaName: dynamicTenantId})(xhdyue)
            //删除下游单据
            const xySource = await useRouteApi(findArXySourceByCcodeAndXyccode, {schemaName: dynamicTenantId})({
              ccode: xhdyue.ccode,
              xyccode: formItems.value.ccode
            })
            if (xySource.length > 0) {
              await useRouteApi(deleteArXySouceById, {schemaName: dynamicTenantId})(xySource[0].id)
            }
          }else{
            //普通应付单
            const saleousing = await useRouteApi(findWarehousingByCcode, {schemaName: dynamicTenantId})({ccode:item.sourcecode,billStyle:item.billStyle})
            saleousing.hxIsum = sub(saleousing.hxIsum, add(item.hxMoney == null ? '' : item.hxMoney, item.idiscount == null ? '' : item.idiscount))
            saleousing.hxFlag = '0'
            await useRouteApi(saveWarehousing, {schemaName: dynamicTenantId})(saleousing)
            //修改销货单子表
            const sales = await useRouteApi(findWarehousingsByCcode,{schemaName: dynamicTenantId})({ccode:saleousing.ccode,billStyle:saleousing.billStyle})
            let salesList:any = []
            let money = item.hxIsum
            for (let j = 0; j < sales.length; j++) {
              const aa = sales[sales.length - 1 - j]
              if (!hasBlank(money) && money != 0) {
                if (money > 0) {
                  if (aa.hxIsum < money) {
                    aa.hxIsum = '0'
                    aa.hxFlag = '0'
                    money = sub(money, aa.hxIsum == null ? '0' : aa.hxIsum)
                  } else {
                    aa.hxIsum = sub(aa.hxIsum == null ? '0' : aa.hxIsum, money)
                    aa.hxFlag = '0'
                    money = 0
                  }
                } else {
                  if (aa.hxIsum > money) {
                    aa.hxIsum = '0'
                    aa.hxFlag = '0'
                    money = sub(money, aa.hxIsum == null ? '0' : aa.hxIsum)
                  } else {
                    aa.hxIsum = sub(aa.hxIsum == null ? '0' : aa.hxIsum, money)
                    aa.hxFlag = '0'
                    money = 0
                  }
                }
                salesList.push(aa)
              }
            }
            await useRouteApi(saveWarehousingsList,{schemaName: dynamicTenantId})(salesList)
            //删除下游单据
            const xyCsource = await useRouteApi(findXyCsourceByCcodeAndXyccode, {schemaName: dynamicTenantId})({
              ccode: sales.ccode,
              xyccode: formItems.value.ccode
            })
            if (xyCsource.length > 0) {
              await useRouteApi(deleteXyCsouceById, {schemaName: dynamicTenantId})(xyCsource[0].id)
            }
          }
        }
        //删除核销单据
        await useRouteApi(deleteByCxCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.busStyle})
        //删除冲销表
        await useRouteApi(deleteArApChongxiaosById,{schemaName: dynamicTenantId})(formItems.value.id)
        await useRouteApi(deleteArApChongxiaosByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.busStyle})
        //删除任务锁定
        await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'预付冲应付',method:'删除',recordNum:formItems.value.ccode})
        message.success('删除成功！')
        await contentSwitch('tail')
      }
    });
  }
}

const loadMark = ref(false)

//行赋值
function saveRow(row,index){
  tableData1.value[index] = row
  countTable()
}

//保存
async function saveData() {
  if (hasBlank(formItems.value.cvencodeZc)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '预付结算供应商不能为空！'
    })
    return false
  }
  if (hasBlank(formItems.value.cvencodeZr)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '应付结算供应商不能为空！'
    })
    return false
  }
  if (formItems.value.cxIsum!=null && formItems.value.cxIsum!='' && formItems.value.cxIsum!='0'){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '冲销金额必须大于0！'
    })
    return false
  }
  if (sub(formItems.value.cxIsum,isum.value)==0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '冲销金额不能与预付冲销金额必须相同！'
    })
    return false
  }
  if (sub(formItems.value.cxIsum,isum1.value)==0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '冲销金额不能与应付冲销金额必须相同！'
    })
    return false
  }
  await jiezhang()
  if(flag.value){
    return createWarningModal({ content: '应付款已进行月末结账,不能进行操作！' });
  }
  //保存冲销主表
  let chongxiao:any = {}
  chongxiao.iyear = dynamicYear.value
  chongxiao.ccode = formItems.value.ccode
  chongxiao.cmaker = useUserStoreWidthOut().getUserInfo.id
  chongxiao.ddate = formItems.value.ddate
  chongxiao.billStyle = 'ap'
  chongxiao.busStyle = 'YF'
  chongxiao.cvencodeZc = formItems.value.cvencodeZc
  chongxiao.cvencodeZr = formItems.value.cvencodeZr
  chongxiao.cdepcode = formItems.value.cdepcode
  chongxiao.cpersoncode = formItems.value.cpersoncode
  chongxiao.currency = formItems.value.currency
  chongxiao.writeOffStatus = formItems.value.writeOffStatus
  chongxiao.cmemo = formItems.value.cmemo
  chongxiao.idiscount = formItems.value.idiscount
  chongxiao.isum = isum.value
  chongxiao.hxIsum = hxMoney.value
  chongxiao.hxIdiscount = formItems.value.hxIdiscount
  chongxiao.cxIsum = formItems.value.cxIsum
  chongxiao.citemcode = formItems.value.citemcode
  chongxiao.citemClass = formItems.value.citemClass
  await useRouteApi(saveArApChongxiao,{schemaName: dynamicTenantId})(chongxiao)
  //保存冲销子表
  let list:any = []
  for (let i = 0; i < getDataSource().length; i++) {
    const item = getDataSource()[i]
    let chongxiaos:any = {}
    if(item.hxMoney!=null && item.hxMoney!='' && item.hxMoney!=0) {
      chongxiaos.iyear = dynamicYear.value
      chongxiaos.ccode = formItems.value.ccode
      chongxiaos.ddate = formItems.value.ddate
      chongxiaos.cdepcode = item.cdepcode
      chongxiaos.cpersoncode = item.cpersoncode
      chongxiaos.lineCode = item.lineCode
      chongxiaos.lineId = i + 1
      chongxiaos.bdocumStyle = item.bdocumStyle
      chongxiaos.billStyle = 'ap'
      chongxiaos.busStyle = 'YF'
      chongxiaos.cvencode = item.cvencode
      chongxiaos.citemcode = item.citemcode
      chongxiaos.cunitid = item.cunitid
      chongxiaos.cunitidF1 = item.cunitidF1
      chongxiaos.citemClass = item.citemClass
      chongxiaos.itaxCode = item.itaxCode
      chongxiaos.itaxrate = item.itaxrate
      chongxiaos.idiscount = item.idiscount
      chongxiaos.isumYb = item.isumYb
      chongxiaos.isum = item.isum
      chongxiaos.hxIsum = item.hxMoney
      chongxiaos.writeOffStatus = item.writeOffStatus
      chongxiaos.cmemo = item.cmemo
      chongxiaos.sourcetype = item.sourcetype
      chongxiaos.sourcecode = item.sourcecode
      chongxiaos.sourcedetailId = item.sourcedetailId
      chongxiaos.sourcedate = item.sourcedate
      list.push(chongxiaos)
      //保存下游单据
      let stockXyCsource: any = {}
      stockXyCsource.iyear = pageParameter.year
      stockXyCsource.xyBillStyle = 'YF'
      if (item.type=='YUE') {
        stockXyCsource.billStyle = 'YUE'
      } else {
        stockXyCsource.billStyle = item.sourcetype
      }
      stockXyCsource.ccode = item.sourcecode
      stockXyCsource.ccodeDate = item.sourcedate
      stockXyCsource.xyccode = formItems.value.ccode
      stockXyCsource.xyccodeDate = formItems.value.ddate
      await useRouteApi(saveArXySource, {schemaName: dynamicTenantId})(stockXyCsource)
    }
  }
  for (let i = 0; i < getDataSource1().length; i++) {
    const item = getDataSource1()[i]
    let chongxiaos:any = {}
    if(item.hxMoney!=null && item.hxMoney!='' && item.hxMoney!=0) {
      chongxiaos.iyear = dynamicYear.value
      chongxiaos.ccode = formItems.value.ccode
      chongxiaos.ddate = formItems.value.ddate
      chongxiaos.cdepcode = item.cdepcode
      chongxiaos.cpersoncode = item.cpersoncode
      chongxiaos.lineCode = item.lineCode
      chongxiaos.lineId = i + 1
      chongxiaos.bdocumStyle = item.bdocumStyle
      chongxiaos.billStyle = 'ap'
      chongxiaos.busStyle = 'YF'
      chongxiaos.cvencode = item.cvencode
      chongxiaos.citemcode = item.citemcode
      chongxiaos.cunitid = item.cunitid
      chongxiaos.cunitidF1 = item.cunitidF1
      chongxiaos.citemClass = item.citemClass
      chongxiaos.itaxCode = item.itaxCode
      chongxiaos.itaxrate = item.itaxrate
      chongxiaos.idiscount = item.idiscount
      chongxiaos.isumYb = item.isumYb
      chongxiaos.isum = item.isum
      chongxiaos.hxIsum = item.hxMoney
      chongxiaos.writeOffStatus = item.writeOffStatus
      chongxiaos.cmemo = item.cmemo
      chongxiaos.sourcetype = item.sourcetype
      chongxiaos.sourcecode = item.sourcecode
      chongxiaos.sourcedetailId = item.sourcedetailId
      chongxiaos.sourcedate = item.sourcedate
      list.push(chongxiaos)
      //保存下游单据
      let stockXyCsource: any = {}
      stockXyCsource.iyear = pageParameter.year
      stockXyCsource.xyBillStyle = 'YF'
      if (item.type=='YUE') {
        stockXyCsource.billStyle = 'YUE'
      } else {
        stockXyCsource.billStyle = item.sourcetype
      }
      stockXyCsource.ccode = item.sourcecode
      stockXyCsource.ccodeDate = item.sourcedate
      stockXyCsource.xyccode = formItems.value.ccode
      stockXyCsource.xyccodeDate = formItems.value.ddate
      if (item.type=='YUE') {
        await useRouteApi(saveArXySource, {schemaName: dynamicTenantId})(stockXyCsource)
      } else {
        await useRouteApi(saveStockXyCsource, {schemaName: dynamicTenantId})(stockXyCsource)
      }
    }
  }
  await useRouteApi(saveArApChongxiaosList,{schemaName: dynamicTenantId})(list)
  //修改应付单核销金额
  const list1:any = getDataSource1().filter(item=>(item.hxMoney!=null && item.hxMoney!=''))
  const list2:any = getDataSource1().filter(item=>(item.hxMoney!=null && item.hxMoney!=''))
  for (let j = 0; j < list2.length; j++) {
    const xhd = list2[j]
    //保存销货单
    console.log(xhd.type)
    if (xhd.type=='CGDHD') {
      const item1 = await useRouteApi(findWarehousingByCcode,{schemaName: dynamicTenantId})({ccode:xhd.sourcecode,billStyle:item.sourcetype})
      let saleousing = item1
      if (xhd.hxMoney != null && xhd.hxMoney != '') {
        if (xhd.idiscount != null && xhd.idiscount != '') {
          saleousing.hxIsum = add(saleousing.hxIsum == null ? '0' : saleousing.hxIsum, add(xhd.hxMoney == null ? '0' : xhd.hxMoney, xhd.idiscount))
        } else {
          saleousing.hxIsum = add(saleousing.hxIsum == null ? '0' : saleousing.hxIsum, xhd.hxMoney == null ? '0' : xhd.hxMoney)
        }
        if (saleousing.hxIsum - saleousing.isum == 0) {
          saleousing.hxFlag = '1'
        }
      }
      await useRouteApi(saveSaleousing, {schemaName: dynamicTenantId})(saleousing)
      //修改销货单子表
      const sales = await useRouteApi(findWarehousingsByCcode,{schemaName: dynamicTenantId})({ccode:saleousing.ccode,billStyle:saleousing.billStyle})
      let money = xhd.hxMoney
      let salesList: any = []
      for (let j = 0; j < sales.length; j++) {
        let aa = sales[j]
        if (!hasBlank(money) && money != 0) {
          if (money > 0) {
            if (sub(aa.isum, aa.hxIsum) < money) {
              aa.hxIsum = aa.isum
              money = sub(money, sub(aa.isum, aa.hxIsum == null ? '0' : aa.hxIsum))
              aa.hxFlag = '1'
            } else {
              aa.hxIsum = add(aa.hxIsum == null ? '0' : aa.hxIsum, money)
              money = 0
            }
          } else {
            if (sub(aa.isum, aa.hxIsum) > money) {
              aa.hxIsum = aa.isum
              aa.hxFlag = '1'
              money = sub(money, sub(aa.isum, aa.hxIsum == null ? '0' : aa.hxIsum))
            } else {
              aa.hxIsum = add(aa.hxIsum == null ? '0' : aa.hxIsum, money)
              money = 0
            }
          }
          if (sub(aa.isum, aa.hxIsum) == 0) {
            aa.hxFlag = '1'
          } else {
            aa.hxFlag = '0'
          }
          aa.hzhcNum = add(aa.hzhcNum == null ? '0' : aa.hzhcNum, 1)
          salesList.push(aa)
        }
      }
      await useRouteApi(saveWarehousingsList,{schemaName: dynamicTenantId})(salesList)
    } else {
      if (xhd.idiscount != null && xhd.idiscount != '') {
        xhd.hxIsum = add(xhd.hxIsum == null ? '0' : xhd.hxIsum, add(xhd.hxMoney == null ? '0' : xhd.hxMoney, xhd.idiscount))
      } else {
        xhd.hxIsum = add(xhd.hxIsum == null ? '0' : xhd.hxIsum, xhd.hxMoney == null ? '0' : xhd.hxMoney)
      }
      if (sub(xhd.isum, xhd.hxIsum) == 0) {
        xhd.hxFlag = '1'
      } else {
        xhd.hxFlag = '0'
      }
      await useRouteApi(saveBeginBalance,{schemaName: dynamicTenantId})(xhd)
    }
  }
  //修改付款单核销金额
  //保存核销表
  for (let i = 0; i < getDataSource().length; i++) {
    const ysyf = getDataSource()[i]
    let hxMoney = ysyf.hxMoney
    ysyf.hxIsum = add(ysyf.hxIsum==null?'0':ysyf.hxIsum, ysyf.hxMoney==null?'0':ysyf.hxMoney)
    if (ysyf.type=='FKD') {
      ysyf.busStyle = 'PTFK'
      if (sub(ysyf.isum, ysyf.hxIsum) == 0) {
        ysyf.writeOffStatus = '1'
      } else {
        ysyf.writeOffStatus = '0'
      }
      await useRouteApi(saveYsyf, {schemaName: dynamicTenantId})(ysyf)
    } else {
      if (sub(ysyf.isum, ysyf.hxIsum) == 0) {
        ysyf.hxFlag = '1'
      } else {
        ysyf.hxFlag = '0'
      }
      await useRouteApi(saveBeginBalance,{schemaName: dynamicTenantId})(ysyf)
    }
    for (let j = 0; j < list1.length; j++) {
      const xhd = list1[j]
      if (hxMoney!=0) {
        let hxMoney1 = xhd.hxMoney
        if (sub(hxMoney, xhd.hxMoney) < 0) {
          hxMoney1 = hxMoney
        }
        let writeOff: any = {}
        writeOff.iyear = pageParameter.year
        writeOff.ccode = ysyf.ccode
        writeOff.ddate = ysyf.ddate
        writeOff.billStyle = 'FKD'
        writeOff.hxStyle = xhd.hxStyle
        if (ysyf.cvencode!=null && ysyf.cvencode!='') {
          writeOff.cvencode = ysyf.cvencode
        } else {
          writeOff.cvencode = ysyf.cvencodeJs
        }
        writeOff.hxCcode = xhd.hxCcode
        writeOff.hxIsum = xhd.isum
        writeOff.hxMoney = hxMoney1
        writeOff.citemcode = xhd.citemcode
        writeOff.citemClass = xhd.citemClass
        writeOff.currency = ysyf.currency
        writeOff.exRate = ysyf.exRate
        writeOff.hxUser = useUserStoreWidthOut().getUserInfo.id
        if (ysyf.type=='YUE'){
          writeOff.skdQichu = '1'
        }
        if (xhd.type=='YUE'){
          writeOff.ysdQichu = '1'
        }
        writeOff.cxStyle = 'YF'
        writeOff.cxCcode = formItems.value.ccode
        writeOff.cxDate = formItems.value.ddate
        await useRouteApi(saveWriteOff,{schemaName: dynamicTenantId})(writeOff)

        if (sub(xhd.hxMoney, hxMoney1) == 0) {
          list1.splice(j, 1)
        } else {
          list1[j].hxMoney = sub(xhd.hxMoney, hxMoney1)
        }
        hxMoney = sub(hxMoney,hxMoney1)
      }
    }
  }
  //删除任务锁定
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'预付冲应付',method:'添加'})
  await balanceTaskDel()
  message.success('保存成功！')
  await pageReload()
  status.value = 3
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

async function giveUp() {
  //删除任务锁定
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'预付冲应付',method:'添加'})
  await balanceTaskDel()
  if (status.value == 1) {
    // await contentSwitch('first')
    await contentSwitch('tail')
  } else if (status.value == 2) {
    await contentSwitch('curr')
  }
  checkRow.value = []
  status.value = 3
}

async function balanceTaskDel() {
  for (let i = 0; i < tableData.value.length; i++) {
    let item = tableData.value[i]
    let danju = formatHxStyle(item.sourcetype)
    let model = 'ap'
    await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
      iyear: dynamicYear.value,
      userName: useUserStoreWidthOut().getUserInfo.id,
      functionModule: danju,
      method: '审核',
      recordNum:item.ccode
    })
  }
  for (let i = 0; i < tableData1.value.length; i++) {
    let item = tableData1.value[i]
    let danju = formatHxStyle(item.sourcetype)
    let model = item.sourcetype == 'YFD' ? 'ap' : 'stock'
    await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
      iyear: dynamicYear.value,
      userName: useUserStoreWidthOut().getUserInfo.id,
      functionModule: danju,
      method: '审核',
      recordNum:item.ccode
    })
  }
}

const disabledDate = (current) => {
  // 获取区间最小区间
  if (!hasBlank(formItems.value.handleDate)) {
    let variable = formItems.value.handleDate.substring(0, 7)
    let min = moment(variable + '-01', 'YYYY-MM-DD')
    let max = moment(variable, 'YYYY-MM-DD').endOf('month')
    return current < min || current > max
  }
};

/*栏目设置end*/
const formEtcData = ref({
  makerMan: '',
  auditMan: '',
})
const thisEditObj:any = ref(null)
const thisEditType:any = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()

const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cvencodeZc':
      openMoalPopPage(true, {
        database: dynamicTenantId.value,
        accId: dynamicAccId.value,
      });
      break;
    case 'cvencodeZr':
      openMoalPopPage(true, {
        database: dynamicTenantId.value,
        accId: dynamicAccId.value,
      });
      break;
    case 'cdepcode':
      openSelectDeptPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;
    case 'cpersoncode':
      openSelectPsnPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;

  }
}
const modalData = (o) => {
  console.log(thisEditObj.value)
  console.log(thisEditType.value)
  if (thisEditType.value=='cvencodeZc'){
    formItems.value.cvencodeZc = o[0].id
    cvencodeChange()
  }
  if (thisEditType.value=='cvencodeZr'){
    formItems.value.cvencodeZr = o[0].id
    cvencodeChange1()
  }
  if (thisEditType.value=='cdepcode'){
    formItems.value.cdepcode = o.id
  }
  if (thisEditType.value=='cpersoncode'){
    formItems.value.cpersoncode = o.id
  }
}

const isum:any = ref('0')
const whxIsum:any = ref('0')
const hxMoney:any = ref('0')
const isum1:any = ref('0')
const whxIsum1:any = ref('0')
const hxMoney1:any = ref('0')
//计算付款明细和核销明细
function countTable(){
  isum.value = 0
  whxIsum.value = 0
  hxMoney.value = 0
  getDataSource().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum.value = add(isum.value,item.isum)
      whxIsum.value = add(whxIsum.value,item.whxIsum)
      hxMoney.value = add(hxMoney.value,item.hxMoney)
    }
  })
  isum1.value = 0
  whxIsum1.value = 0
  hxMoney1.value = 0
  getDataSource1().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum1.value = add(isum1.value,item.isum)
      whxIsum1.value = add(whxIsum1.value,item.whxIsum)
      hxMoney1.value = add(hxMoney1.value,item.hxMoney)
    }
  })
}
//分摊核销
function fentan(){
  if(checkRow.value.length>0) {
    tableData.value.forEach(item=>{
      item.hxMoney = ''
      item.tempOne = ''
      return item
    })
    let cxIsum = formItems.value.cxIsum
    for (let i = 0; i < checkRow.value.length; i++) {
      let item = checkRow.value[i]
      if (item.isum!=null && item.isum != '' && item.isum != 0) {
        if (cxIsum > item.whxIsum) {
          item.hxMoney = item.whxIsum
          cxIsum = cxIsum - item.whxIsum
        } else {
          item.hxMoney = cxIsum
          cxIsum = 0
        }
        item.tempOne = item.hxMoney
      }
    }
    tableData.value.map(item=>{
      for (let i = 0; i < checkRow.value.length; i++) {
        let item1 = checkRow.value[i]
        if (item.sourcecode==item1.sourcecode){
          item.hxMoney = item1.hxMoney
          item.tempOne = item.hxMoney
        }
      }
      return item
    })
    setTableData(tableData.value)
    countTable()
    state.selectedRowKeys = []
    checkRow.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择需要分摊的数据！'
    })
  }
}

function fentan1(){
  if(checkRow1.value.length>0) {
    tableData1.value.forEach(item=>{
      item.hxMoney = ''
      item.tempOne = ''
      return item
    })
    let cxIsum = formItems.value.cxIsum
    for (let i = 0; i < checkRow1.value.length; i++) {
      let item = checkRow1.value[i]
      if (item.isum!=null && item.isum != '' && item.isum != 0) {
        if (cxIsum > item.whxIsum) {
          item.hxMoney = item.whxIsum
          cxIsum = cxIsum - item.whxIsum
        } else {
          item.hxMoney = cxIsum
          cxIsum = 0
        }
        item.tempOne = item.hxMoney
      }
    }
    tableData1.value.map(item=>{
      for (let i = 0; i < checkRow1.value.length; i++) {
        let item1 = checkRow1.value[i]
        if (item.sourcecode==item1.sourcecode){
          item.hxMoney = item1.hxMoney
          item.tempOne = item.hxMoney
        }
      }
      return item
    })
    setTableData1(tableData1.value)
    countTable()
    state1.selectedRowKeys = []
    checkRow1.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择需要分摊的数据！'
    })
  }
}

const tableDataChange =  (r,c) => {
  switch (c) {
    case 'hxMoney':
      if(titleValue.value != 0 && c=='hxMoney' ){
        r.tempOne=parseFloat(r.tempOne) > 0?0 - (Math.abs(parseFloat(r.tempOne))):r.tempOne
        r.isum=r.tempOne
      } else {
        r.tempOne=parseFloat(r.tempOne) < 0?(Math.abs(parseFloat(r.tempOne))):r.tempOne
        r.isum=r.tempOne
      }
      break
  }
  countTable()
}

const outBefore = async () => {
  //删除任务锁定
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'预付冲应付',method:'添加'})
  await balanceTaskDel()
  if (status.value != 3){
    createConfirm({
      iconType: 'warning',
      title: '编辑中',
      content: '当前正在处于编辑,退出编辑将丢失,您确定要继续进行吗？',
      onOk: async () => {
        // 调整数据库 列参数
        await closeCurrent()
      },
      onCancel: async () => {

      }
    });
  } else {
    await closeCurrent()
  }

}

/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext =  (r, c) => {
  if(titleValue.value != 0 && c=='hxMoney' ){
    r.tempOne=parseFloat(r.tempOne) > 0?0 - (Math.abs(parseFloat(r.tempOne))):r.tempOne
    r.isum=r.tempOne
  } else {
    r.tempOne=parseFloat(r.tempOne) < 0?(Math.abs(parseFloat(r.tempOne))):r.tempOne
    r.isum=r.tempOne
  }
  // 得到当前临时标记
  let t = getNextMark(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  // debugger
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource();
  let filters = ['hxMoney']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns().filter((it:any)=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData.value = list
    setTableData(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      tableData.value = list
      setTableData(list)
    }
  }
  nextTick(() => {
    // let doms:any = nextC == 'cmemo' || nextC == 'isum' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    let doms:any = document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model:any = {hxMoney:'One'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

const tableDataChange1 =  (r,c) => {
  switch (c) {
    case 'hxMoney':
      if(titleValue.value != 0 && c=='hxMoney' ){
        r.tempOne=parseFloat(r.tempOne) > 0?0 - (Math.abs(parseFloat(r.tempOne))):r.tempOne
        r.isum=r.tempOne
      } else {
        r.tempOne=parseFloat(r.tempOne) < 0?(Math.abs(parseFloat(r.tempOne))):r.tempOne
        r.isum=r.tempOne
      }
      break
  }
  countTable()
}

const focusNext1 =  (r, c) => {
  if(titleValue.value != 0 && c=='hxMoney' ){
    r.tempOne=parseFloat(r.tempOne) > 0?0 - (Math.abs(parseFloat(r.tempOne))):r.tempOne
    r.isum=r.tempOne
  } else {
    r.tempOne=parseFloat(r.tempOne) < 0?(Math.abs(parseFloat(r.tempOne))):r.tempOne
    r.isum=r.tempOne
  }
  // 得到当前临时标记
  let t = getNextMark1(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`temp${t}`];
  // 列表值发生变动 监听调整
  // debugger
  tableDataChange1(r,c)
  // 查找下一个
  let list = getDataSource1();
  let filters = ['hxMoney']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns1().filter((it:any)=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData1.value = list
    setTableData1(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark1(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`temp${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark1(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`temp${nextMark}`];
      tableData1.value = list
      setTableData1(list)
    }
  }
  nextTick(() => {
    // let doms:any = nextC == 'cmemo' || nextC == 'isum' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    let doms:any = document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark1 = (c,b) => {
  let model:any = {hxMoney:'One'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

import SelectSkd from './popup/select-skd.vue'
const [registerSelectSkdPage, { openModal: openSelectSkdPage }] = useModal()
const openSelectSkd = () => {
  if(formItems.value.cvencodeZc!=null && formItems.value.cvencodeZc!='') {
    openSelectSkdPage(true, {
      dynamicTenantId: dynamicTenantId.value,
      year: dynamicYear.value,
      cvencode: formItems.value.cvencodeZc,
      list: getDataSource(),
      apHexiaoAuto: apHexiaoAuto.value,
      apSourceFlag: apSourceFlag.value,
      apCheckFlag: apCheckFlag.value,
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先选择预付结算供应商！'
    })
  }
}
async function saveSelectSkd(data){
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    let danju = formatHxStyle(item.sourcetype)
    let model = 'ap'
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:danju,method:'修改,删除,审核,弃审,复核,弃复',recordNum:data.ccode})
    if(taskData.length==0){
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:data.ccode,caozuoModule:model})
    } else {
      // 任务不是当前操作员的
      if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
        return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+danju+',不能同时进行操作！' });
      }else{
        await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:data.ccode,caozuoModule:model})
      }
    }
  }
  tableData.value = getDataSource().filter(item => item.sourcecode!=null && item.sourcecode!='')
  tableData.value.push(...data)
  if (tableData.value.length < 20) {
    let num = 20 - tableData.value.length
    for (let i = 0; i < num; i++) {
      tableData.value.push({})
    }
  }
  setTableData(tableData.value)
  countTable()
}

import SelectXhd from './popup/select-xhd.vue'

const [registerSelectXhdPage, { openModal: openSelectXhdPage }] = useModal()
const openSelectXhd = () => {
  if(formItems.value.cvencodeZr!=null && formItems.value.cvencodeZr!='') {
    openSelectXhdPage(true, {
      dynamicTenantId: dynamicTenantId.value,
      year: dynamicYear.value,
      cvencode: formItems.value.cvencodeZr,
      list: getDataSource1(),
      apHexiaoAuto: apHexiaoAuto.value,
      apSourceFlag: apSourceFlag.value,
      apCheckFlag: apCheckFlag.value,
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先选择应付结算供应商！'
    })
  }
}
async function saveSelectXhd(data){
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    let danju = formatHxStyle(item.sourcetype)
    let model = item.sourcetype=='YFD'?'ap':'stock'
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:danju,method:'修改,删除,审核,弃审,复核,弃复',recordNum:data.ccode})
    if(taskData.length==0){
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:data.ccode,caozuoModule:model})
    } else {
      // 任务不是当前操作员的
      if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
        return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+danju+',不能同时进行操作！' });
      }else{
        await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:danju,method:'审核',recordNum:data.ccode,caozuoModule:model})
      }
    }
  }
  tableData1.value = getDataSource1().filter(item => item.sourcecode!=null && item.sourcecode!='')
  tableData1.value.push(...data)
  if (tableData1.value.length < 20) {
    let num = 20 - tableData1.value.length
    for (let i = 0; i < num; i++) {
      tableData1.value.push({})
    }
  }
  setTableData1(tableData1.value)
  countTable()
}
</script>
<style lang="less" scoped="scoped">
@Global-Border-Color: #c9c9c9; // 全局下划线颜色
@Global-Label-Color: #666666; // 全局#c9c9c9颜色
@Global-Comm-BcOrText-Color: #0096c7; // 全局#c9c9c9颜色

:deep(.vben-basic-table) {
  .ant-table-wrapper {
    .ant-table-measure-row{
      td{
        padding: 0!important;
      }
    }
  }
}

.app-container {
  padding: 10px;
  background-color: #b4c8e3;
  margin: 0;

  .app-container-top {
    background-color: @Global-Comm-BcOrText-Color !important;
    border-radius: 5px 5px 0 0;
    padding: 10px;
    /*    background-image: url(/@/assets/images/homes/bg-pattern2.png);
        background-repeat: no-repeat;
        background-position: center;*/
  }

  .app-container-bottom {
    background-color: white;

    .actod-btn {
      color: @Global-Comm-BcOrText-Color;
      font-size: 14px;
      border-color: @Global-Border-Color;
      //border-right: none;
    }

    .actod-btn-last {
      border-right: 1px solid @Global-Border-Color;
    }

    .actod-btn:hover {
      background-color: @Global-Comm-BcOrText-Color;
      color: white;
    }

    :deep(.ant-calendar-picker-input.ant-input), :deep(.ant-input),:deep(.ant-select) {
      border: none;
      border-bottom: solid 1px rgb(191, 191, 191) !important;
      width: 100%;
      font-size: 14px;
      font-weight: bold;
    }
    :deep(.ant-input-number){
      border: none;
      border-bottom: solid 1px rgb(191, 191, 191) !important;
      width: 100%;
      min-width: 0;

      .ant-input-number-handler-wrap{
        display:none;
      }
      input{
        font-size: 14px;
        font-weight: bold;
        font-family: Arial !important;
      }
    }
    :deep(.right) input{
      text-align:right;
    }

    :deep(.ant-picker){
      border: none;
      border-bottom: solid 1px rgb(191, 191, 191) !important;
      input {
        font-size: 14px;
        font-weight: bold;
      }
    }

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
        margin: 0 5rem 10px;

        label {
          text-align: left;
          width: 10%;
          display: inline-block;
          padding-top: 5px;
          padding-bottom: 5px;
          padding-left: 2em;
          color: #535353;
          font-size: 13px;
          font-weight: bold;
        }

        :deep(.ant-select-selector), :deep(.ant-picker), .ant-input {
          border: none;
          background-color: white;
          color: black;

          .ant-picker-input {
            > input {
              color: black;
            }
          }
        }

      }
    }

    .acb-centent {
      margin: 0 4%;

      :deep(.nc-summary) {
        font-size: 14px;
        font-weight: bold;
        width: 100%;
        background-color: #cccccc;
        border:none !important;

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
          width: 19%;
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
        > div:nth-of-type(5) {
          width: 20%;
          text-align: right;
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
@import './global-menu-index.less';
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
