<template>
  <div class="app-container">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>应收冲应收的页面</textarea>复制内容快速定位页面</div>-->
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
      <div style="">
        <div>
          <Button class="actod-btn" @click="openPage()" v-if="status == 3">查看</Button>
          <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3">新增</Button>
          <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
          <Button class="actod-btn" @click="openSelectXhd()" v-if="status == 1 || status == 2">选单</Button>
          <Button class="actod-btn" @click="tableDel" v-if="status == 1 || status == 2">删单</Button>
          <Button class="actod-btn" @click="fentan()" v-if="status == 1 || status == 2">分摊</Button>
          <Button class="actod-btn" @click="startDel" v-if="status == 3 && formItems.id != null">删除</Button>
          <Popover placement="bottom" v-if="formItems.bcheck=='1'">
            <template #content>
              <span class="group-btn-span-special">&nbsp;生成记账凭证</span><br/>
            </template>
            <Button class="actod-btn">生单</Button>
          </Popover>
          <Popover placement="bottom" v-if="status == 3">
            <template #content>
              <span class="group-btn-span-special">&nbsp;下游单据&emsp;&emsp;</span><br/>
            </template>
            <Button class="actod-btn">联查</Button>
          </Popover>
          <Popover placement="bottom" v-if="status == 3">
            <template #content>
              <span class="group-btn-span-special">&nbsp;复制&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导入&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;导出&emsp;&emsp;</span><br/>
              <span class="group-btn-span-special">&nbsp;打印&emsp;&emsp;</span><br/>
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
          <div class="acttd-right-d-btns" v-if="status==3">
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
            <VerticalLeftOutlined @click="contentSwitch('tail')"/>&nbsp;&nbsp;
          </div>
          <span style="font-size: 28px;font-weight: bold;border-bottom:3px double;" :style="{color: titleValue===0?'#0096c7':'red','border-color':titleValue===0?'#0096c7':'red'}">
            {{ titleContents[titleValue] }}
          </span>
        </div>
        <div class="acbgead-two" :style="status == 3?{ pointerEvents: 'none'}:{}">
          <label>单据日期：</label>
          <DatePicker v-model:value="formItems.ddate" @change="generateCode(formItems.ddate)" :disabled-date="disabledDate" :locale="localeCn" placeholder="" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 15%;"/>
          <label>单据编号：</label>
          <Input v-model:value="formItems.ccode" :disabled="true" style="width: 15%;"/>
          <!--          <label>业务类型：</label>
                    <Select v-model:value="formItems.busStyle" style="width: 15%;">
                      <template #suffixIcon><CaretDownOutlined v-if="status == 1 || status == 2"/></template>
                      <SelectOption value="YSK">预收款</SelectOption>
                      <SelectOption value="PTSK">普通收款</SelectOption>
                    </Select>-->
          <label>转出结算客户：</label>
          <Select v-model:value="formItems.cvencodeZc"  @change="cvencodeChange()" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cvencodeZc')"/>
            </template>
            <SelectOption v-for="item in customerList" :value="item.id" >
              {{ item.custName }}
            </SelectOption>
          </Select>
          <label>转入结算客户：</label>
          <Select v-model:value="formItems.cvencodeZr" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cvencodeZr')"/>
            </template>
            <SelectOption v-for="item in customerList" :value="item.id" >
              {{ item.custName }}
            </SelectOption>
          </Select>
          <br/>

          <label>转入部门：</label>
          <Select v-model:value="formItems.cdepcode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cdepcode')"/>
            </template>
            <SelectOption v-for="item in deptList" :value="item.id" >
              {{ item.deptName }}
            </SelectOption>
          </Select>
          <label>转入业务员：</label>
          <Select v-model:value="formItems.cpersoncode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined  v-if="status == 1 || status == 2" @click="openHeadSelectContent('cpersoncode')"/>
            </template>
            <SelectOption v-for="item in psnList" :value="item.id" >
              {{ item.psnName }}
            </SelectOption>
          </Select>
          <label>转入项目：</label>
          <Select v-model:value="formItems.itemCode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined  v-if="status == 1 || status == 2" @click="openHeadSelectContent('itemCode')"/>
            </template>
            <SelectOption v-for="item in projectList" :value="item.id" >
              {{ item.projectCode }} - {{ item.projectName }}
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
          <!--          <span style="font-size: 18px;font-weight: bold;color: #0096c7;">收款明细</span>
                    <div style="float: right;">
                      <Button class="ant-btn-sm actod-btn" @click="tableAdd">增行</Button>
                      <Button class="ant-btn-sm actod-btn" @click="tableDel">删行</Button>
                    </div>-->
          <BasicTable
            ref="tableRef"
            :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
            :loading="loadMark"
            :row-selection="{ type: 'checkbox',selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
            :scroll="{ x: totalColumnWidth,y: 480 }"
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
      </div>
    </div>
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <SelectProject @register="registerSelectProjectPage" @save="modalData"/>
    <SelectXhd
      @save="saveSelectXhd"
      @register="registerSelectXhdPage"
    />
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
import SelectProject from "/@/views/boozsoft/global/popup/project/select-project.vue";
import SelectXhd from './popup/select-xhd.vue'
import {
  findAll as findAllJiLang,
  findUnitInfoList
} from "/@/api/record/system/unit-mea";
import {findCunHuoAllList} from "/@/api/record/stock/stock-caigou";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import moment from "moment";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {findPsnByFlag} from "/@/api/record/system/psn";
import {findDeptByFlag} from "/@/api/record/system/dept";
import {findAll} from "/@/api/record/costomer_data/customer";
import {buildUUID} from "/@/utils/uuid";
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
  deleteSaleousingById, deleteSaleousingsByCcode,
  findBukongCcode as ysdfindBukongCcode,
  findSaleousingByCcode,
  findSaleousingsByCcode, saveSaleousings,
  saveSaleousingsList
} from "/@/api/record/system/ysd";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
import {
  getByStockBalanceTask, stockBalanceTaskDelByUserName,
  stockBalanceTaskEditNewTime,
  stockBalanceTaskSave
} from "/@/api/record/stock/stock_balance";
import {saveTaskApi} from "/@/api/record/system/task";
import {findPeriodByYearList} from "/@/api/record/system/ar-ap-period";
import {findByStockAccId} from "/@/api/record/system/stock-account";
import {findBySkWhxXhd} from "/@/api/record/system/hexiao";
import {
  deleteArXySouceById,
  findArBeginBalanceByCcode, findArXySourceByCcodeAndXyccode,
  findByCvencode,
  saveArXySource,
  saveBeginBalance
} from "/@/api/record/system/arBeginBalance";
import {
  deleteArApChongxiaosByCcode,
  deleteArApChongxiaosById,
  findArApChongxiaoList,
  findArApChongxiaosByCcode,
  findBukongCcode,
  findChongxiaosByCcode,
  saveArApChongxiao, saveArApChongxiaosList
} from "/@/api/record/system/ArApChongxiao";
import {
  deleteXyCsouceById,
  findXyCsourceByCcodeAndXyccode,
  saveSaleousing,
  saveStockXyCsource
} from "/@/api/record/system/arApYsyf";

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
const windowHeight = (window.innerHeight -300)
const totalColumnHeight = (document.documentElement.clientHeight - 440)
const totalColumnWidth = ref(0)
const dynamicTenantId:any = ref('')
const dynamicAccId:any = ref('')
const dynamicYear:any = ref('')
const titleContents = ['应收冲应收', '应收冲应收', '应收冲应收']
const titleValue = ref(0)
const formRowNum = ref(1)

const clickMoney = ref(true)

const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'SS'
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
const arHexiaoAuto:any = ref()
const arSourceFlag:any = ref()
const arCheckFlag:any = ref()
const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  // dynamicYear.value = obj.stockYear
  dynamicYear.value = useCompanyOperateStoreWidthOut().getLoginDate.split('-')[0]
  const res = await findByStockAccId(obj.accId)
  arHexiaoAuto.value = res.arHexiaoAuto
  arSourceFlag.value = res.arSourceFlag
  arCheckFlag.value = res.arCheckFlag

  useAccountPickerCache().set(obj)

  formItems.value.id = null
  await reloadList()
  await pageReload()
}

//打开应收冲应收列表
function openPage(){
  pageParameter.year = dynamicYear.value
  pageParameter.dynamicTenantId = dynamicTenantId.value
  pageParameter.dynamicAccId = dynamicAccId.value
  pageParameter.ddate1 = dynamicYear.value+'-01-01'
  pageParameter.ddate2 = dynamicYear.value+'-12-31'
  router.push({
    path: '/YingShouZhang/ChongXiao/ChaXun/YingShouChongYingShouLieBiao',
    query: pageParameter
  });
}

const tableData:any = ref([]);

const dynamicFormModel:any = ref([])
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
  arHexiaoAuto.value = res.arHexiaoAuto
  arSourceFlag.value = res.arSourceFlag
  arCheckFlag.value = res.arCheckFlag
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
  //  ckListOptions.value = (await useRouteApi(cangKuAll, {schemaName: dynamicTenantId})({ckIsDuli: '1'}))?.items
  assetsCardList.value = (await useRouteApi(findCunHuoAllList, {schemaName: dynamicTenantId})({date: useCompanyOperateStoreWidthOut().getLoginDate}))
}

//选单
const [registerSelectXhdPage, { openModal: openSelectXhdPage }] = useModal()
const openSelectXhd = () => {
  if(formItems.value.cvencodeZc!=null && formItems.value.cvencodeZc!='') {
    openSelectXhdPage(true, {
      dynamicTenantId: dynamicTenantId.value,
      year: dynamicYear.value,
      cvencode: formItems.value.cvencodeZc,
      list: getDataSource(),
      arHexiaoAuto: arHexiaoAuto.value,
      arSourceFlag: arSourceFlag.value,
      arCheckFlag: arCheckFlag.value,
    })
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先选择转出结算客户！'
    })
  }
}
async function saveSelectXhd(data){
  // console.log(data)
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    let danju = formatHxStyle(item.sourcetype)
    let model = item.sourcetype=='YSD'?'ar':'stock'
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
  countTable()
  setTableData(tableData.value)
}

const arBeginBalanceList:any = ref([])
const saleousingList:any = ref([])
async function cvencodeChange(){
  await balanceTaskDel()
  tableData.value = []
  /*const qcList = await useRouteApi(findByCvencode,{schemaName: dynamicTenantId})({cvencode:formItems.value.cvencodeZc,iyear:dynamicYear.value})
  if (arSourceFlag.value!='1') {
    arBeginBalanceList.value = qcList.filter(item => item.busStyle == 'YSD' && item.ysIsumBenbi!='0')
  } else {
    arBeginBalanceList.value = qcList.filter(item => item.arStyle == 'YSD' && item.ysIsumBenbi!='0')
  }
  tableData.value.push(...saleousingList.value.map(item => {
    item.sourcecode = item.ccode
    item.sourcedate = item.ddate
    item.sourcetype = 'QC'+item.billStyle
    item.isum = item.ysIsumBenbi
    item.type = 'YUE'
    if (item.hxIsum != null && item.hxIsum != '') {
      item.whxIsum = sub(item.isum, item.hxIsum)
    } else {
      item.whxIsum = item.isum
    }
    item.hxMoney = item.whxIsum
    item.tempOne = item.whxIsum
    return item
  }))
  const saleList = await useRouteApi(findBySkWhxXhd, {schemaName: dynamicTenantId})({
    year: dynamicYear.value,
    cvencode: formItems.value.cvencodeZc
  })
  if (arSourceFlag.value=='1') {
    saleousingList.value = saleList.filter(item => item.busStyle !='XHD' && item.bworkable=='1' && item.isum!='0')
  } else {
    if(arCheckFlag=='1'){
      saleousingList.value = saleList.filter(item => item.busStyle !='XSFP' && item.bworkable=='1' && item.isum!='0')
    } else {
      saleousingList.value = saleList.filter(item => item.busStyle !='XSFP' && item.isum!='0')
    }
  }
  tableData.value.push(...saleousingList.value.map(item => {
    item.sourcecode = item.ccode
    item.sourcedate = item.ddate
    item.sourcetype = item.billStyle
    item.type = 'XHD'
    if (item.hxIsum != null && item.hxIsum != '') {
      item.whxIsum = sub(item.isum, item.hxIsum)
    } else {
      item.whxIsum = item.isum
    }
    item.hxMoney = ''
    item.tempOne = ''
    return item
  }))*/
  if (tableData.value.length < 20) {
    let num = 20 - tableData.value.length
    for (let i = 0; i < num; i++) {
      tableData.value.push({})
    }
  }
  countTable()
  setTableData(tableData.value)
}

async function balanceTaskDel() {
  for (let i = 0; i < tableData.value.length; i++) {
    let item = tableData.value[i]
    if(item.sourcetype!=null && item.sourcetype!='') {
      let danju = formatHxStyle(item.sourcetype)
      let model = item.sourcetype == 'YSD' ? 'ar' : 'stock'
      await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
        iyear: dynamicYear.value,
        userName: useUserStoreWidthOut().getUserInfo.id,
        functionModule: danju,
        method: '审核',
        recordNum: item.ccode
      })
    }
  }
}

const num = ref(0)
async function contentSwitch(action) {
  loadMark.value = true
  const res = await useRouteApi(findArApChongxiaoList,{schemaName: dynamicTenantId})({billStyle:'SS',iyear:dynamicYear.value})
  if (titleValue.value==0){
    arApYsyfList.value = res.filter(item => item.bdocumStyle!='1')
  } else {
    arApYsyfList.value = res.filter(item => item.bdocumStyle=='1')
  }
  // arApYsyfList.value = res
  delIds.value = []
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
    const res = await useRouteApi(findChongxiaosByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:'SS'})
    tableData.value = res.map(item => {
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
  if (hxStyle=='XHD'){
    str = '销货单'
  } else if (hxStyle=='YSD'){
    str = '应收单'
  } else if (hxStyle=='XSFP'){
    str = '销售发票'
  } else if (hxStyle=='QCXHD'){
    str = '期初销货单'
  } else if (hxStyle=='QCYSD'){
    str = '期初应收单'
  } else if (hxStyle=='QCXSFP'){
    str = '期初销售发票'
  }
  return str
}

function checkMoney(record,index,str){
  let num1 = record.whxIsum
  let num2 = 0
  if(record.tempOne!=null && record.tempOne!='') {
    num2 = record.tempOne
  }
  if (num1-num2<0){
    if (str=='hxMoney'){
      record.tempOne = ''
      record.hxMoney = ''
    }
  }
  tableData.value[index] = record
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

const tableAdd = () => {
  tableData.value.push({})
  setTableData(tableData.value)
  checkRow.value = []
}

const delIds:any = ref([])

const tableDel = async () => {
  if (checkRow.value.length > 0) {
    let list = getDataSource()
    for (let i = 0; i < checkRow.value.length; i++) {
      let item = checkRow.value[i]
      let danju = formatHxStyle(item.sourcetype)
      let model = item.sourcetype == 'YSD' ? 'ar' : 'stock'
      await useRouteApi(stockBalanceTaskDelByUserName, {schemaName: dynamicTenantId})({
        iyear: dynamicYear.value,
        userName: useUserStoreWidthOut().getUserInfo.id,
        functionModule: danju,
        method: '审核',
        recordNum:item.ccode
      })
      let selectIndex = list.findIndex(it => it.key === item.key)
      list.splice(selectIndex, 1)
      if(item.id!=null && item.id!='') {
        delIds.value.push(item.id)
      }
    }
    tableData.value = list
    setTableData(list)
    checkRow.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}

//根据日期判断是否结账
const flag = ref(false)
const stockFlag = ref(false)
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
      if (item.stockFlag == '1'){
        stockFlag.value = true
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
      return createWarningModal({ content: '应收款已进行月末结账,不能进行操作！' });
    }
    let ymjz= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收款月末结账',method:'月末结账'})
    if(ymjz.length){
      return createWarningModal({ content: ymjz[0]?.username+'正在进行应收款月末结账,不能同时进行操作！' });
    }
    let zdhx= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收自动核销',method:'核销'})
    if(zdhx.length){
      return createWarningModal({ content: zdhx[0]?.username+'正在进行应收自动核销,不能同时进行操作！' });
    }
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收冲应收',method:'添加'})
    if(taskData.length==0){
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'添加',caozuoModule:'ar'})
    } else {
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'添加',caozuoModule:'ar'})
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
      busStyle: 'SS',
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code,
      busStyle: 'SS',
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    countTable()
    tableData.value = list
    setTableData(list)
  } else {
    status.value = 2
    let list = getDataSource()
    let dLen = list.length
    for (let i = 0; i < (maxR - dLen); i++) {
      list.push({})
    }
    countTable()
    tableData.value = list
    setTableData(list)
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
  let str = 'SS-' + yy + mm + '-'
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

async function ysdGenerateCode(date) {
  let code=''
  //日期(年月)
  let yy = new Date().getFullYear()
  let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
  if(date!=null && date!='') {
    yy = date.substring(0, 4)
    mm = date.substring(5, 7)
  }
  dynamicYear.value = yy
  let str = 'YSD-' + yy + mm + '-'
  const ysyf = await useRouteApi(ysdfindBukongCcode,{schemaName: dynamicTenantId})({
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
    return false
  } else {
    //判断存货和应收模块是否结账
    await jiezhang()
    if(flag.value){
      return createWarningModal({ content: '应收款已进行月末结账,不能进行操作！' });
    }
    //判断当前操作账套是否有人正在做结账
    let ymjz= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收款月末结账',method:'月末结账'})
    if(ymjz.length){
      return createWarningModal({ content: ymjz[0]?.username+'正在进行应收款月末结账,不能同时进行操作！' });
    }
    let zdhx= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收自动核销',method:'核销'})
    if(zdhx.length){
      return createWarningModal({ content: zdhx[0]?.username+'正在进行应收自动核销,不能同时进行操作！' });
    }
    //判断新生成的应收单是否做过核销
    let ysd = await useRouteApi(findSaleousingByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.targetCode,billStyle:'YSD'})
    if(ysd.hxIsum!=null && ysd.hxIsum!='' && ysd.hxIsum!='0'){
      createErrorModal({
        iconType: 'warning',
        title: '温馨提示',
        content: '生成的应收单已做过核销，不能删除！'
      })
      return false
    }
    //判断应收单没有其他下游单据（除应收冲应收）
    createConfirm({
      iconType: 'warning',
      title: '应收冲应收单删除',
      content: '您确定要进行应收冲应收删除吗!',
      onOk: async () => {
        //判断应收冲应收
        let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收冲应收',method:'删除',recordNum:formItems.value.ccode})
        if(taskData.length==0){
          await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'删除',recordNum:formItems.value.ccode,caozuoModule:'ar'})
        } else {
          // 任务不是当前操作员的
          if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
            return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+'应收冲应收,不能同时进行操作！' });
          }else{
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'删除',recordNum:formItems.value.ccode,caozuoModule:'ar'})
          }
        }
        //判断应收单
        let ysdData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收单',method:'修改,删除,审核,弃审,复核,弃复',recordNum:ysd.ccode})
        if(ysdData.length==0){
          await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'删除',recordNum:ysd.ccode,caozuoModule:'ar'})
        } else {
          // 任务不是当前操作员的
          if(String(ysdData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
            return createWarningModal({ content: ysdData[0]?.username+'正在'+ysdData[0]?.method+'应收单,不能同时进行操作！' });
          }else{
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:ysdData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'删除',recordNum:ysd.ccode,caozuoModule:'ar'})
          }
        }
        //删除新生成的应收单
        await useRouteApi(deleteSaleousingById,{schemaName: dynamicTenantId})(ysd.id)
        await useRouteApi(deleteSaleousingsByCcode,{schemaName: dynamicTenantId})({ccode:ysd.ccode,billStyle:ysd.billStyle})
        //删除下游单据
        const xyCsource = await useRouteApi(findXyCsourceByCcodeAndXyccode, {schemaName: dynamicTenantId})({
          ccode: ysd.ccode,
          xyccode: formItems.value.ccode
        })
        if (xyCsource.length > 0) {
          await useRouteApi(deleteXyCsouceById, {schemaName: dynamicTenantId})(xyCsource[0].id)
        }
        //修改对应应收单核销金额
        const list = await useRouteApi(findArApChongxiaosByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.busStyle})
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          // if(item.sourcetype.substring(0,2)=='QC'){
          if(item.sourcetype=='QCYSD'){
            //期初应收单
            const xhdyue = await useRouteApi(findArBeginBalanceByCcode, {schemaName: dynamicTenantId})(item.targetCode)
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
            //普通应收单
            const saleousing = await useRouteApi(findSaleousingByCcode, {schemaName: dynamicTenantId})({ccode:item.targetCode,billStyle:item.billStyle})
            saleousing.hxIsum = sub(saleousing.hxIsum, add(item.hxIsum == null ? '' : item.hxIsum, item.idiscount == null ? '' : item.idiscount))
            saleousing.hxFlag = '0'
            await useRouteApi(saveSaleousing, {schemaName: dynamicTenantId})(saleousing)
            //修改销货单子表
            const sales = await useRouteApi(findSaleousingsByCcode,{schemaName: dynamicTenantId})({ccode:saleousing.ccode,billStyle:saleousing.billStyle})
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
            await useRouteApi(saveSaleousingsList,{schemaName: dynamicTenantId})(salesList)
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
        //删除冲销表
        await useRouteApi(deleteArApChongxiaosById,{schemaName: dynamicTenantId})(formItems.value.id)
        await useRouteApi(deleteArApChongxiaosByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.busStyle})
        //删除任务锁定
        await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'删除',recordNum:formItems.value.ccode})
        await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'删除',recordNum:ysd.ccode})
        message.success('删除成功！')
        await contentSwitch('tail')
      }
    });
  }
}

const loadMark = ref(false)

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

//数据保存
async function saveData() {
  if (hasBlank(formItems.value.cvencodeZc)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '转出结算客户不能为空！'
    })
    return false
  }
  if (hasBlank(formItems.value.cvencodeZr)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '转入结算客户不能为空！'
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
  await jiezhang()
  if(flag.value){
    return createWarningModal({ content: '应收款已进行月末结账,不能进行操作！' });
  }
  //保存冲销主表
  let chongxiao:any = {}
  chongxiao.iyear = dynamicYear.value
  chongxiao.ccode = formItems.value.ccode
  chongxiao.cmaker = useUserStoreWidthOut().getUserInfo.id
  chongxiao.ddate = formItems.value.ddate
  chongxiao.billStyle = 'ar'
  chongxiao.busStyle = 'SS'
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
  chongxiao.targetCode = ysdGenerateCode(formItems.value.ddate)
  await useRouteApi(saveArApChongxiao,{schemaName: dynamicTenantId})(chongxiao)
  //保存冲销子表
  let list:any = []
  for (let i = 0; i < getDataSource().length; i++) {
    const item = getDataSource()[i]
    if (item.hxMoney!=null && item.hxMoney!='' && item.hxMoney!=0) {
      let chongxiaos:any = {}
      chongxiaos.iyear = dynamicYear.value
      chongxiaos.ccode = formItems.value.ccode
      chongxiaos.ddate = formItems.value.ddate
      chongxiaos.cdepcode = item.cdepcode
      chongxiaos.cpersoncode = item.cpersoncode
      chongxiaos.lineCode = item.lineCode
      chongxiaos.lineId = i+1
      chongxiaos.bdocumStyle = item.bdocumStyle
      chongxiaos.billStyle = 'ar'
      chongxiaos.busStyle = 'SS'
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
    }
  }
  await useRouteApi(saveArApChongxiaosList,{schemaName: dynamicTenantId})(list)
  //生成新的应收单
  let ysd:any = {}
  let dateTime = new_Date()
  ysd.iyear = dynamicYear.value
  ysd.ccode = formItems.value.targetCode
  ysd.ccodePl = formItems.value.ccodePl
  ysd.cmaker = useUserStoreWidthOut().getUserInfo.id
  ysd.ddate = formItems.value.ddate
  ysd.bstyle = formItems.value.bstyle
  ysd.cvencode = formItems.value.cvencodeZr
  ysd.cvencodeJs = formItems.value.cvencodeZr
  ysd.wlzzType = formItems.value.wlzzType
  ysd.cvencodeWl = formItems.value.cvencodeWl
  ysd.cwhcode = formItems.value.cwhcode
  ysd.cwhcodeUser = formItems.value.cwhcodeUser
  ysd.cdepcode = formItems.value.cdepcode
  ysd.bcheck = '1'
  ysd.bcheckTime = dateTime
  ysd.bcheckUser = useUserStore().getUserInfo['name']
  ysd.bworkable = '1'
  ysd.bworkableTime = dateTime
  ysd.bworkableUser = useUserStore().getUserInfo['name']
  ysd.cmemo = '应收冲应收'
  ysd.cpersoncode = formItems.value.cpersoncode
  ysd.bcloser = '0'
  ysd.bcloserTime = formItems.value.bcloserTime
  ysd.bcloserUser = formItems.value.bcloserUser
  ysd.squantity = formItems.value.squantity
  ysd.squantity1 = formItems.value.squantity1
  ysd.squantity2 = formItems.value.squantity2
  ysd.icost = formItems.value.icost
  ysd.isum = formItems.value.cxIsum
  ysd.billStyle = 'YSD'
  ysd.bdocumStyle = formItems.value.cxIsum>0?'0':'1'
  ysd.taxAmount = formItems.value.taxAmount
  ysd.hxFlag = '0'
  ysd.hxIsum = formItems.value.hxIsum
  ysd.deliveryDate = formItems.value.deliveryDate
  ysd.deliveryUser = formItems.value.deliveryUser
  ysd.deliveryId = formItems.value.deliveryId
  ysd.deliveryExplain = formItems.value.deliveryExplain
  ysd.pickingDate = formItems.value.pickingDate
  ysd.pickingId = formItems.value.pickingId
  ysd.unitType = formItems.value.unitType
  ysd.unitValue = formItems.value.unitValue
  await useRouteApi(saveSaleousing, {schemaName: dynamicTenantId})(ysd)
  let ysds:any = {}
  ysds.iyear = dynamicYear.value
  ysds.lineCode = buildUUID()
  ysds.lineId = 1
  ysds.billStyle = 'YSD'
  ysds.bstyle = ysd.bstyle
  ysds.ddate = ysd.ddate
  ysds.ccode = ysd.ccode
  ysds.cvencode = ysd.cvencode
  ysds.cvencodeJs = ysd.cvencodeJs
  ysds.cwhcode = ysd.cwhcode
  ysds.cinvode = ysd.cinvode
  ysds.cangkuDuli = ysd.cangkuDuli
  ysds.batchId = ysd.batchId
  ysds.cmaker = useUserStoreWidthOut().getUserInfo.id
  ysds.cunitid =ysd.cunitid
  ysds.cunitidF1 = ysd.cunitidF1
  ysds.cunitidF2 = ysd.cunitidF2
  ysds.unitId = ysd.unitId
  ysds.baseQuantity = ysd.baseQuantity
  ysds.subQuantity1 = ysd.subQuantity1
  ysds.subQuantity2 = ysd.subQuantity2
  ysds.citemClass = ysd.citemClass
  ysds.citemcode = ysd.citemcode
  ysds.cwhcode1 = ysd.cwhcode1
  ysds.cwhcode2 = ysd.cwhcode2
  ysds.cwhcode3 = ysd.cwhcode3
  ysds.cwhcode4 = ysd.cwhcode4
  ysds.cwhcode5 = ysd.cwhcode5
  ysds.cwhcode6 = ysd.cwhcode6
  ysds.itaxrate = ysd.itaxrate
  ysds.price = ysd.price
  ysds.taxprice = ysd.taxprice
  ysds.itaxprice = ysd.itaxprice
  ysds.icost = ysd.icost
  ysds.isum = ysd.cxIsum
  ysds.isumJiesuan = ysd.isumJiesuan
  ysds.isumFapiao = ysd.isumFapiao
  ysds.isumXiaohuo = ysd.isumXiaohuo
  ysds.isumJijian = ysd.isumJijian
  ysds.isumWuliu = ysd.isumWuliu
  ysds.isumChuku = ysd.isumChuku
  ysds.cdepcode = ysd.cdepcode
  ysds.baccFlag = ysd.baccFlag
  ysds.baccUser = ysd.baccUser
  ysds.baccDate = ysd.baccDate
  ysds.baccId = ysd.baccId
  ysds.cmemo = '应收冲应收'
  ysds.isGive = ysd.isGive
  ysds.cgspstate = ysd.cgspstate
  ysds.sgspdate = ysd.sgspdate
  ysds.sgspperson = ysd.sgspperson
  ysds.dpdate = ysd.dpdate
  ysds.dvdate = ysd.dvdate
  ysds.cordercode = ysd.cordercode
  ysds.csource = ysd.csource
  ysds.bcheck = '1'
  ysds.bcheckTime = dateTime
  ysds.bcheckUser = useUserStore().getUserInfo['name']
  ysds.bcloser = '0'
  ysds.bcloserTime = ysd.bcloserTime
  ysds.bcloserUser = ysd.bcloserUser
  ysds.changer = ysd.changer
  ysds.changedate = ysd.changedate
  ysds.totalsourceid = ysd.totalsourceid
  ysds.sourcetype = ysd.sourcetype
  ysds.sourcecode = ysd.sourcecode
  ysds.sourcedetailId = ysd.sourcedetailId
  ysds.sourcedate = ysd.sourcedate
  ysds.hxFlag = '0'
  ysds.hxIsum = ysd.hxIsum
  ysds.quantityPd = ysd.quantityPd
  ysds.subPandian1 = ysd.subPandian1
  ysds.subPandian2 = ysd.subPandian2
  ysds.quantityUk = ysd.quantityUk
  ysds.quantityUk1 = ysd.quantityUk1
  ysds.quantityUk2 = ysd.quantityUk2
  await useRouteApi(saveSaleousings, {schemaName: dynamicTenantId})(ysds)
  //保存新的应收单的下游单据
  let stockXyCsource1: any = {}
  stockXyCsource1.iyear = pageParameter.year
  stockXyCsource1.xyBillStyle = 'SS'
  stockXyCsource1.billStyle = 'YSD'
  stockXyCsource1.ccode = ysd.ccode
  stockXyCsource1.ccodeDate = ysd.ddate
  stockXyCsource1.xyccode = formItems.value.ccode
  stockXyCsource1.xyccodeDate = formItems.value.ddate
  await useRouteApi(saveStockXyCsource, {schemaName: dynamicTenantId})(stockXyCsource1)
  //修改应收单的核销金额
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    if(!hasBlank(item.hxMoney) && item.hxMoney!=0) {
      //期初余额
      if (item.type == 'YUE') {
        let item1 = arBeginBalanceList.value.filter(a=>a.ccode==item.hxCcode)
        if (item.idiscount!=null && item.idiscount!='') {
          item1.hxIsum = add(item1.hxIsum==null?'0':item1.hxIsum, add(item.hxMoney==null?'0':item.hxMoney, item.idiscount))
        } else {
          item1.hxIsum = add(item1.hxIsum==null?'0':item1.hxIsum, item.hxMoney==null?'0':item.hxMoney)
        }
        if (sub(item1.hxIsum,item1.isum)==0){
          item1.hxFlag = '1'
        }
        await useRouteApi(saveBeginBalance,{schemaName: dynamicTenantId})(item1)
      } else {
        //普通应收单
        const item1 = await useRouteApi(findSaleousingByCcode, {schemaName: dynamicTenantId})({ccode:item.sourcecode,billStyle:item.billStyle})
        let saleousing = item1
        if (item.idiscount != null && item.idiscount != '') {
          saleousing.hxIsum = add(saleousing.hxIsum == null ? '0' : saleousing.hxIsum, add(item.hxMoney == null ? '0' : item.hxMoney, item.idiscount))
        } else {
          saleousing.hxIsum = add(saleousing.hxIsum == null ? '0' : saleousing.hxIsum, item.hxMoney == null ? '0' : item.hxMoney)
        }
        if (saleousing.hxIsum - saleousing.isum == 0) {
          saleousing.hxFlag = '1'
        }
        await useRouteApi(saveSaleousing, {schemaName: dynamicTenantId})(saleousing)
        //修改应收单或销货单子表
        const sales = await useRouteApi(findSaleousingsByCcode, {schemaName: dynamicTenantId})({
          ccode: saleousing.ccode,
          billStyle: saleousing.billStyle
        })
        let money = saleousing.hxIsum
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
        await useRouteApi(saveSaleousingsList, {schemaName: dynamicTenantId})(salesList)
      }
    }
    //保存下游单据
    let stockXyCsource: any = {}
    stockXyCsource.iyear = pageParameter.year
    stockXyCsource.xyBillStyle = 'SS'
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
  //删除任务锁定
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'添加'})
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
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'添加'})
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
const thisEditObj:any = ref(null)
const thisEditType:any = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerSelectProjectPage, {openModal: openSelectProjectPage}] = useModal()

const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cvencodeZr':
      openMoalPopPage(true, {
        database: dynamicTenantId.value,
        accId: dynamicAccId.value,
      });
      break;
    case 'cvencodeZc':
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
    case 'itemCode':
      openSelectProjectPage(true, {
        dynamicTenantId: dynamicTenantId.value
      })
      break;

  }
}
const modalData = (o) => {
  console.log(thisEditObj.value)
  console.log(thisEditType.value)
  if (thisEditType.value=='cvencodeZr'){
    formItems.value.cvencodeZr = o[0].id
  }
  if (thisEditType.value=='cvencodeZc'){
    formItems.value.cvencodeZc = o[0].id
  }
  if (thisEditType.value=='cdepcode'){
    formItems.value.cdepcode = o.id
  }
  if (thisEditType.value=='cpersoncode'){
    formItems.value.cpersoncode = o.id
  }
  if (thisEditType.value=='itemCode'){
    formItems.value.itemCode = o.id
  }
}

const isum:any = ref('0')
const whxIsum:any = ref('0')
const hxMoney:any = ref('0')
//计算收款明细和核销明细
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
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收冲应收',method:'添加'})
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
const {proxy} = getCurrentInstance()
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
  let cols:any = getColumns().filter(it=>it.title!='序号')
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
    let doms:any = nextC == 'hxMoney' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
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
        margin: 0;
        padding: 5px;
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
