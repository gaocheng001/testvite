<template>
  <div class="app-container">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>应收单的页面</textarea>复制内容快速定位页面</div>-->
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
      <div style="margin-right: 10px;">
        <div>
          <Button class="actod-btn" @click="openPage()" v-if="status == 3">查看</Button>
          <Button class="actod-btn" @click="startEdit('add')" v-if="status == 3">新增</Button>
          <Button class="actod-btn" @click="saveData" v-if="status == 1 || status == 2">保存</Button>
          <Button class="actod-btn" @click="giveUp" v-if="status == 1 || status == 2">放弃</Button>
          <Button class="actod-btn" @click="startEdit('edit')" v-if="status == 3 && formItems.bcheck!='1'">修改</Button>
          <Button class="actod-btn" @click="tableAdd" v-if="status == 1 || status == 2">插行</Button>
          <Button class="actod-btn" @click="tableDel" v-if="status == 1 || status == 2">删行</Button>
          <Button class="actod-btn" @click="startDel" v-if="status == 3 && formItems.id != null && formItems.bcheck!='1'">删除</Button>
          <Popover placement="bottom" v-if="formItems.bcheck=='1'">
            <template #content>
              <span class="group-btn-span-special">&nbsp;生成记账凭证</span><br/>
            </template>
            <Button class="actod-btn">生单</Button>
          </Popover>
          <Button class="actod-btn" @click="startReview(true)" v-if="status == 3 && formItems.bcheck!='1' ">复核</button>
          <Button class="actod-btn" @click="startReview(false)" v-if="status == 3 && formItems.bcheck=='1' ">弃复</button>
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
          <!--          <PrintTest></PrintTest>-->
          <!--          <Hello></Hello>-->
          <!--          <Button v-if="status == 3" class="actod-btn" @click="exportExcel()">导出</Button>
                    <Button v-if="status == 3" class="actod-btn" @click="printData()">打印</Button>-->
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
<!--            <Popover placement="bottom">
              <template #content>
                <span class="group-btn-span-special2" @click="titleValue = 0;contentSwitch('tail','')" :style="titleValue===0?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;蓝字应收单&ensp;<CheckOutlined v-if="titleValue===0"/></span>
                <br/>
                <span class="group-btn-span-special2" @click="titleValue = 1;contentSwitch('tail','')" :style="titleValue===1?{backgroundColor: '#0096c7',color: 'white'}:''">
                &nbsp;红字应收单&ensp;<CheckOutlined v-if="titleValue===1"/></span>
              </template>
              <Button class="acttdrd-btn">
                <PicLeftOutlined :style="{ fontSize: '14px' }"/>
              </Button>
            </Popover>-->
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
            <span v-if="formItems.bcheck=='1'">
              <Tag color="volcano">已复核</Tag>
            </span>
            <span v-if="formItems.writeOffStatus=='1'">
              <Tag color="volcano">已核销</Tag>
            </span>
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
          <label>客户：</label>
          <Select v-model:value="formItems.cvencode" @change="changeCvencode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cvencode')"/>
            </template>
            <SelectOption v-for="item in customerList" :value="item.id" >
              {{ item.custName }}
            </SelectOption>
          </Select>
          <label>结算客户：</label>
          <Select v-model:value="formItems.cvencodeJs" :disabled="true" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined v-if="status == 1 || status == 2" @click="openHeadSelectContent('cvencodeJs')"/>
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
          <label>业务员：</label>
          <Select v-model:value="formItems.cpersoncode" style="width: 15%;">
            <template #suffixIcon>
              <SearchOutlined  v-if="status == 1 || status == 2" @click="openHeadSelectContent('cpersoncode')"/>
            </template>
            <SelectOption v-for="item in psnList" :value="item.id" >
              {{ item.psnName }}
            </SelectOption>
          </Select>
          <label>项目：</label>
          <Select v-model:value="formItems.itemCode" style="width: 15%;">
<!--            <template #suffixIcon><CaretDownOutlined v-if="status == 1 || status == 2"/></template>-->
            <template #suffixIcon>
              <SearchOutlined  v-if="status == 1 || status == 2" @click="openHeadSelectContent('itemCode')"/>
            </template>
            <SelectOption v-for="item in projectList" :value="item.id" >
              {{ item.projectCode }} - {{ item.projectName }}
            </SelectOption>
          </Select>
          <label>备注：</label>
          <Input v-model:value="formItems.cmemo" style="width: 15%;"/>
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
            :clickToRowSelect="false"
            :loading="loadMark"
            :row-selection="{ type: 'checkbox',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
            :scroll="{ x: totalColumnWidth,y: 480 }"
            style="width: 600px;"
            @register="registerTable"
            :dataSource="tableData"
          >
            <template #cmemo="{ record }">
              <template v-if="record.editOne">
                <Input v-model:value="record.tempOne" class="cmemo" style="width: 85%;" placeholder="" @keyup.enter="focusNext(record,'cmemo')"/>
                <CheckOutlined @click="record.editOne = null;record.cmemo=record.tempOne;tableDataChange(record,'cmemo')"/>
              </template>
              <template v-else>
                <div @click="record.editOne = true;" :class="status == 1 || status == 2?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{record.cmemo}}</span>
                </div>
              </template>
            </template>
            <template #isum="{ record }">
              <template v-if="record.editTwo">
                <InputNumber v-model:value="record.tempTwo" class="isum" style="width: 85%;" @keyup.enter="focusNext(record,'isum')"/>
                <CheckOutlined @click="record.editTwo = null;record.isum=record.tempTwo;tableDataChange(record,'isum')"/>
              </template>
              <template v-else>
                <div @click="record.editTwo = true;"
                     :class="status == 1 || status == 2?'suspended-div':'status-look'">
                  <span class="a-table-font-arial">{{toThousandFilter(record.isum)}}</span>
                </div>
              </template>
            </template>

<!--            <template #footer>
              <div class="nc-summary">
                <div style="width:49%;">
                  <span>合计</span>
                </div>
                <div style="width:50%;">
                  <span>收款金额:</span>
                  <span>&ensp;{{ toThousandFilter(isum) }}</span>
                </div>
              </div>
            </template>-->
            <template #summary>
              <TableSummary fixed>
                <TableSummaryRow style="background-color: #cccccc;font-weight: bold;">
                  <TableSummaryCell class="nc-summary" :index="0" :colSpan="3" :align="'center'" style="background-color: #cccccc;font-weight: bold;">合&emsp;&emsp;计</TableSummaryCell>
                  <TableSummaryCell class="nc-summary" :index="3" :align="'right'" style="background-color: #cccccc;font-weight: bold;">{{toThousandFilter(isum)}}</TableSummaryCell>
                </TableSummaryRow>
              </TableSummary>
            </template>
          </BasicTable>
        </div>
        <Query
          @query="loadPage"
          @register="registerQueryPage"
        />
      </div>
    </div>
    <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
    <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
    <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>
    <SelectProject @register="registerSelectProjectPage" @save="modalData"/>
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
import Query from "./popup/query.vue";
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
import {delChuZhi, findFaAssetInfoByCode, reviewChuZhi} from "/@/api/fa/fa-assets-minus";

import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {useRoute} from "vue-router";
import {getCurrentAccountName, hasBlank} from "/@/api/task-api/tast-bus-api";
import {cloneDeep} from "lodash-es";
import SupperModalPop from "/@/views/boozsoft/global/popup/customer_info/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue"
import SelectProject from "/@/views/boozsoft/global/popup/project/select-project.vue";
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
  findBukongCcode,
  deleteSaleousingsById,
  saveSaleousing,
  saveSaleousingsList,
  deleteSaleousingById,
  deleteSaleousingsByCcode,
  findSaleousingsByCcode,
  findSaleousingList,
  findSaleousingByCcode
} from "/@/api/record/system/ysd";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
import {
  getByStockBalanceTask, stockBalanceTaskDelByUserName,
  stockBalanceTaskEditNewTime,
  stockBalanceTaskSave
} from "/@/api/record/stock/stock_balance";
import {saveTaskApi} from "/@/api/record/system/task";
import {findPeriodByYearList} from "/@/api/record/system/ar-ap-period";
import {
  findWhxskd,
  saveStockXyCsource,
  saveWriteOff,
  saveYsyf
} from "/@/api/record/system/arApYsyf";
import {findByCvencode, saveBeginBalance} from "/@/api/record/system/arBeginBalance";
import {findByStockAccId} from "/@/api/record/system/stock-account";

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
const [registerQueryPage, {openModal: openQueryPageM}] = useModal()
const windowHeight = (window.innerHeight -300)
const totalColumnHeight = (document.documentElement.clientHeight - 440)
const totalColumnWidth = ref(0)
const dynamicTenantId:any = ref('')
const dynamicAccId:any = ref('')
const dynamicYear:any = ref('')
const titleContents = ['应收单', '红字应收单', '应收单']
const titleValue = ref(1)
const formRowNum = ref(1)

const clickMoney = ref(true)

const pageParameter:any = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: '',
    value: '',
  },
  type: 'YSD'
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
const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  dynamicAccId.value = obj.accId
  // dynamicYear.value = obj.stockYear
  dynamicYear.value = useCompanyOperateStoreWidthOut().getLoginDate.split('-')[0]
  const res = await findByStockAccId(obj.accId)
  arHexiaoAuto.value = res.arHexiaoAuto
  // console.log(arHexiaoAuto.value)

  useAccountPickerCache().set(obj)

  formItems.value.id = null
  await columnReload()
  await reloadList()
  await pageReload()
}

//打开应收单列表
function openPage(){
  pageParameter.year = dynamicYear.value
  pageParameter.dynamicTenantId = dynamicTenantId.value
  pageParameter.dynamicAccId = dynamicAccId.value
  pageParameter.ddate1 = dynamicYear.value+'-01-01'
  pageParameter.ddate2 = dynamicYear.value+'-12-31'
  router.push({
    path: '/YingShouZhang/YingShou/ChaXun/YingShouDanLieBiao',
    query: pageParameter
  });
}

const tableData:any = ref([]);
const tableData1:any = ref([]);

const dynamicFormModel:any = ref([])
const formFuns:any = ref({
  getFormValue: () => {
  }, setFormValue: () => {
  }, getSelectMap: () => {
  }
})
const columnReload = async () => {
  formRowNum.value = Math.ceil((dynamicFormModel.value.filter(it=>it.isShow).length/4))-1
}
const route = useRoute();
const routemsg = ref(route.query);
onMounted(async () => {
  /*console.log(routemsg.value)
  console.log(routemsg.value.id)
  console.log(JSON.stringify(routemsg.value).length)*/
  dynamicTenantId.value = routemsg.value.dynamicTenantId
  dynamicAccId.value = routemsg.value.defaultAdName
  dynamicYear.value = routemsg.value.year
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

/*async function contentSwitch(action) {
  loadMark.value = true
  let res = await useRouteApi(findBillByCondition, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    iyear: dynamicYear.value || '2022',
    action: action,
    curr: formFuns.value.getFormValue()?.ccode || ''
  })
  if (null != res) {
    formItems.value = JsonTool.parseProxy(res)
    res.entryList = null
    formFuns.value.setFormValue(res)
    titleValue.value = parseInt(res.bdocumStyle || 0)
    if (!hasBlank(formItems.value.entryList)) {
      let list = JsonTool.parseObj(formItems.value.entryList).map(it => resetRow(it))
      let len = list.length
      for (let i = 0; i < (25 - len); i++) {
        list.push({})
      }
      tableData.value = list
      setTableData(list)
    }
    formItems.value.entryList = null
  } else {
    message.success('暂无数据！')
  }
  loadMark.value = false
}*/
const num = ref(0)
async function contentSwitch(action) {
  loadMark.value = true
  const res = await useRouteApi(findSaleousingList,{schemaName: dynamicTenantId})({billStyle:'YSD',iyear:dynamicYear.value})
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
    const res = await useRouteApi(findSaleousingsByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:'YSD'})
    tableData.value = res
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
      title: '备注',
      dataIndex: 'cmemo',
      ellipsis: true,
      slots: {customRender: 'cmemo'},
      width: 200,
    },
    {
      title: '价税合计',
      dataIndex: 'isum',
      ellipsis: true,
      slots: {customRender: 'isum'},
      align: 'right',
      width: 200,
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
  //XHD销货单、PLXHD批量销货单、XSCKD销售出库单、QTCKD其他出库单、DBCKD调拨出库单、XTZHCKD形态转换出库单、JYJCD借用借出单
  if (hxStyle=='XHD'){
    str = '销货单'
  } else if (hxStyle=='PLXHD'){
    str = '批量销货单'
  } else if (hxStyle=='XSCKD'){
    str = '销售出库单'
  } else if (hxStyle=='QTCKD'){
    str = '其他出库单'
  } else if (hxStyle=='DBCKD'){
    str = '调拨出库单'
  } else if (hxStyle=='XTZHCKD'){
    str = '形态转换出库单'
  } else if (hxStyle=='JYJCD'){
    str = '借用借出单'
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

const tableSelectedRowKeys:any = ref([])
const tableSelectedRowObjs:any = ref([])
const onSelectChange = (k, o) => {
  tableSelectedRowKeys.value = k
  tableSelectedRowObjs.value = o
}

const tableSelectedRowKeys1:any = ref([])
const tableSelectedRowObjs1:any = ref([])
const onSelectChange1 = (k, o) => {
  tableSelectedRowKeys1.value = k
  tableSelectedRowObjs1.value = o
}

const openQpage = async () => {
  if (true) {
    openQueryPageM(true, {schemaName: dynamicTenantId.value})
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先给该公司创建固定资产账！'
    })
  }
}

const tableAdd = () => {
  tableData.value.push({})
  setTableData(tableData.value)
  tableSelectedRowKeys.value = []
  /*if (tableSelectedRowKeys.value.length == 1) {
    let list = getDataSource()
    let selectIndex = list.findIndex(it => it.key === tableSelectedRowKeys.value[0])
    list.splice(selectIndex, 0, {cwhcode: formFuns.value.getFormValue().cwhcode})
    tableData.value = list
    setTableData(list)
    tableSelectedRowKeys.value = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择插入行次！'
    })
  }*/
}

const delIds:any = ref([])

const tableDel = () => {
  if (tableSelectedRowKeys.value.length > 0) {
    let list = getDataSource()
    for (let i = 0; i < tableSelectedRowObjs.value.length; i++) {
      let item = tableSelectedRowObjs.value[i]
      let selectIndex = list.findIndex(it => it.key === item.key)
      list.splice(selectIndex, 1)
      if(item.id!=null && item.id!='') {
        delIds.value.push(item.id)
      }
    }
    tableData.value = list
    setTableData(list)
    tableSelectedRowKeys.value = []
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
  await jiezhang()
  if(flag.value){
    return createWarningModal({ content: '应收款已进行月末结账,不能进行操作！' });
  }
  let ymjz= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收款月末结账',method:'月末结账'})
  if(ymjz.length){
    return createWarningModal({ content: ymjz[0]?.username+'正在进行应收款月末结账,不能同时进行操作！' });
  }
  if (type === 'add') {
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收单',method:'添加'})
    if(taskData.length==0){
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'添加',caozuoModule:'ar'})
    } else {
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'添加',caozuoModule:'ar'})
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
      busStyle: 'YSK',
    }
    formFuns.value.setFormValue({
      ddate: date,
      ccode: code,
      busStyle: 'YSK',
    })
    let list:any = []
    for (let i = 0; i < maxR; i++) {
      list.push({})
    }
    countTable()
    tableData.value = list
    setTableData(list)
    tableData1.value = []
    // setTableData1(list)
  } else {
    const res = await useRouteApi(findSaleousingByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.billStyle})
    if (res.length==0){
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '单据已发生变化，请刷新当前单据！'
      })
      return false
    }
    if (res[0].bcheck == formItems.value.bcheck) {
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '单据已发生变化，请刷新当前单据！'
      })
      return false
    }
    let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收单',method:'修改,删除,复核,弃审',recordNum:formItems.value.ccode})
    if(taskData.length==0){
      await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'修改',recordNum:formItems.value.ccode,caozuoModule:'ar'})
    } else {
      // 任务不是当前操作员的
      if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
        return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+'应收单,不能同时进行操作！' });
      }else{
        await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'修改',recordNum:formItems.value.ccode,caozuoModule:'ar'})
      }
    }
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
  /*return await useRouteApi(findBillCode, {schemaName: dynamicTenantId})({
    type: pageParameter.type,
    date: date
  })*/
}

const startDel = async () => {
  if (null == formItems.value || hasBlank(formItems.value.id)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '暂无任何单据！'
    })
  } else {
    const res = await useRouteApi(findSaleousingByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.billStyle})
    if (res.length==0){
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '单据已发生变化，请刷新当前单据！'
      })
      return false
    }
    if (res[0].bcheck == formItems.value.bcheck) {
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '单据已发生变化，请刷新当前单据！'
      })
      return false
    }
    if (formItems.value.bcheck=='1') {
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '记录已有核销记录，操作无效！'
      })
    } else {
      createConfirm({
        iconType: 'warning',
        title: '收款单删除',
        content: '您确定要进行收款单删除吗!',
        onOk: async () => {
          let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收单',method:'修改,删除,弃复,弃审',recordNum:formItems.value.ccode})
          if(taskData.length==0){
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'删除',recordNum:formItems.value.ccode,caozuoModule:'ar'})
          } else {
            // 任务不是当前操作员的
            if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
              return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+'应收单,不能同时进行操作！' });
            }else{
              await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'删除',recordNum:formItems.value.ccode,caozuoModule:'ar'})
            }
          }
          await useRouteApi(deleteSaleousingById,{schemaName: dynamicTenantId})(formItems.value.id)
          await useRouteApi(deleteSaleousingsByCcode,{schemaName: dynamicTenantId})(formItems.value.ccode)
          //删除任务锁定
          await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'删除',recordNum:formItems.value.ccode})
          message.success('删除成功！')
          // formItems.value.czId = ''
          await contentSwitch('tail')
        }
      });
    }
  }
}

const startReview = async (b) => {
  let a = useUserStoreWidthOut().getUserInfo.id
  if (!hasBlank(a) && !hasBlank(formItems.value.id)) {
    const res = await useRouteApi(findSaleousingByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:formItems.value.billStyle})
    if (res.length==0){
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '单据已发生变化，请刷新当前单据！'
      })
      return false
    }
    if (res[0].bcheck == formItems.value.bcheck) {
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '单据已发生变化，请刷新当前单据！'
      })
      return false
    }
    if (res[0].hxIsum == formItems.value.hxIsum) {
      createErrorModal({
        iconType: 'warning',
        title: '警告',
        content: '列表单据已发生变化，请刷新当前列表！'
      })
      return false
    }
    if (b==true){
      // console.log('复核')
      let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收单',method:'修改,删除,复核,弃复',recordNum:formItems.value.ccode})
      if(taskData.length==0){
        await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'复核',recordNum:formItems.value.ccode,caozuoModule:'ar'})
      } else {
        // 任务不是当前操作员的
        if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
          return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+'应收单,不能同时进行操作！' });
        }else{
          await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'复核',recordNum:formItems.value.ccode,caozuoModule:'ar'})
        }
      }
      let dateTime = new_Date()
      formItems.value.bcheck = '1'
      formItems.value.bcheckTime = dateTime
      formItems.value.bcheckUser = useUserStore().getUserInfo['name']
      formItems.value.bworkable = '1'
      formItems.value.bworkableTime = dateTime
      formItems.value.bworkableUser = useUserStore().getUserInfo['name']
      const saleousingsList = await useRouteApi(findSaleousingsByCcode, {schemaName: dynamicTenantId})({
        ccode: formItems.value.ccode,
        billStyle: 'YSD'
      })
      saleousingsList.map(saleousings => {
        saleousings.bcheck = '1'
        saleousings.bcheckTime = dateTime
        saleousings.bcheckUser = useUserStore().getUserInfo['name']
        return saleousings
      })
      //应收审核自动核销
      if (arHexiaoAuto.value=='1'){
        let money = isum.value
        //查询期初收款单
        let qcList = await useRouteApi(findByCvencode,{schemaName: dynamicTenantId})({cvencode:formItems.value.cvencode,iyear:pageParameter.year})
        let qcskdList = qcList.filter(item=>item.busStyle=='SKD')
        for (let i = 0; i < qcskdList.length; i++) {
          let qcskd = qcskdList[i]
          let whxIsum = sub(qcskd.ysIsumBenbi, qcskd.hxIsum == null ? 0 : qcskd.hxIsum)
          let hxMoney:any = 0
          if (money != 0) {
            if (qcskd.ysIsumBenbi > 0) {
              if (money >= whxIsum) {
                qcskd.hxIsum = qcskd.ysIsumBenbi
                qcskd.hxFlag = '1'
                hxMoney = whxIsum
                money = sub(money,whxIsum)
              } else {
                qcskd.hxIsum = add(qcskd.hxIsum,money)
                qcskd.hxFlag = '0'
                hxMoney = qcskd.hxIsum
                money = 0
              }
            } else {
              if (qcskd.isum < 0) {
                if (money <= whxIsum) {
                  qcskd.hxIsum = qcskd.ysIsumBenbi
                  qcskd.hxFlag = '1'
                  hxMoney = whxIsum
                  money = sub(money,whxIsum)
                } else {
                  qcskd.hxIsum = add(qcskd.hxIsum,money)
                  qcskd.hxFlag = '0'
                  hxMoney = qcskd.hxIsum
                  money = 0
                }
              }
            }
            await useRouteApi(saveBeginBalance, {schemaName: dynamicTenantId})(qcskd)
            //保存核销单
            let writeOff: any = {
              iyear: pageParameter.year,
              ccode: qcskd.ccode,
              ddate: qcskd.ddate,
              billStyle: 'SKD',
              hxStyle: formItems.value.billStyle,
              cvencode: formItems.value.cvencodeJs,
              hxCcode: formItems.value.ccode,
              hxIsum: formItems.value.isum,
              hxMoney: hxMoney,
              citemcode: formItems.value.citemcode,
              citemClass: formItems.value.citemClass,
              currency: qcskd.currency,
              exRate: qcskd.exRate,
              skdQichu: '1',
              hxUser: useUserStoreWidthOut().getUserInfo.id,
            }
            await useRouteApi(saveWriteOff, {schemaName: dynamicTenantId})(writeOff)
            //保存下游单据
            let stockXyCsource: any = {
              iyear: pageParameter.year,
              xyBillStyle: 'YUE',
              billStyle: formItems.value.billStyle,
              ccode: formItems.value.ccode,
              ccodeDate: formItems.value.ddate,
              xyccode: qcskd.ccode,
              xyccodeDate: qcskd.ddate,
            }
            await useRouteApi(saveStockXyCsource, {schemaName: dynamicTenantId})(stockXyCsource)
          }
        }
        //查询收款单
        let ysyfList = await useRouteApi(findWhxskd,{schemaName: dynamicTenantId})({year:pageParameter.year,cvencode:formItems.value.cvencode})
        for (let i = 0; i < ysyfList.length; i++) {
          let ysyf = ysyfList[i]
          let whxIsum = sub(ysyf.isum, ysyf.hxIsum)
          let hxMoney:any = 0
          if (money != 0) {
            if (money > 0) {
              if (ysyf.isum > 0) {
                if (money >= whxIsum) {
                  ysyf.hxIsum = ysyf.isum
                  ysyf.writeOffStatus = '1'
                  hxMoney = whxIsum
                  money = sub(money,whxIsum)
                } else {
                  ysyf.hxIsum = add(ysyf.hxIsum,money)
                  ysyf.writeOffStatus = '0'
                  hxMoney = ysyf.hxIsum
                  money = 0
                }
              }
            } else {
              if (ysyf.isum < 0) {
                if (money <= whxIsum) {
                  ysyf.hxIsum = ysyf.isum
                  ysyf.writeOffStatus = '1'
                  hxMoney = whxIsum
                  money = sub(money,whxIsum)
                } else {
                  ysyf.hxIsum = add(ysyf.hxIsum,money)
                  ysyf.writeOffStatus = '0'
                  hxMoney = ysyf.hxIsum
                  money = 0
                }
              }
            }
            await useRouteApi(saveYsyf, {schemaName: dynamicTenantId})(ysyf)
            //保存核销单
            let writeOff: any = {
              iyear: pageParameter.year,
              ccode: ysyf.ccode,
              ddate: ysyf.ddate,
              billStyle: 'SKD',
              hxStyle: formItems.value.billStyle,
              cvencode: formItems.value.cvencodeJs,
              hxCcode: formItems.value.ccode,
              hxIsum: formItems.value.isum,
              hxMoney: hxMoney,
              citemcode: formItems.value.citemcode,
              citemClass: formItems.value.citemClass,
              currency: ysyf.currency,
              exRate: ysyf.exRate,
              hxUser: useUserStoreWidthOut().getUserInfo.id,
            }
            await useRouteApi(saveWriteOff, {schemaName: dynamicTenantId})(writeOff)
            //保存下游单据
            let stockXyCsource: any = {
              iyear: pageParameter.year,
              xyBillStyle: 'SKD',
              billStyle: formItems.value.billStyle,
              ccode: formItems.value.ccode,
              ccodeDate: formItems.value.ddate,
              xyccode: ysyf.ccode,
              xyccodeDate: ysyf.ddate,
            }
            await useRouteApi(saveStockXyCsource, {schemaName: dynamicTenantId})(stockXyCsource)
          }
        }
        formItems.value.hxIsum = sub(formItems.value.isum,money)
        if (money==0){
          formItems.value.hxFlag = '1'
        } else {
          formItems.value.hxFlag = '0'
        }
        await useRouteApi(saveSaleousing, {schemaName: dynamicTenantId})(formItems.value)
        //修改销货单子表
        let money1 = formItems.value.hxIsum
        for (let j = 0; j < saleousingsList.length; j++) {
          let aa = saleousingsList[j]
          if (!hasBlank(money1) && money1 != 0) {
            if (money1 > 0) {
              if (sub(aa.isum, aa.hxIsum) < money1) {
                aa.hxIsum = aa.isum
                money1 = sub(money1, sub(aa.isum, aa.hxIsum == null ? '0' : aa.hxIsum))
                aa.hxFlag = '1'
              } else {
                aa.hxIsum = add(aa.hxIsum == null ? '0' : aa.hxIsum, money1)
                money1 = 0
              }
            } else {
              if (sub(aa.isum, aa.hxIsum) > money1) {
                aa.hxIsum = aa.isum
                aa.hxFlag = '1'
                money1 = sub(money1, sub(aa.isum, aa.hxIsum == null ? '0' : aa.hxIsum))
              } else {
                aa.hxIsum = add(aa.hxIsum == null ? '0' : aa.hxIsum, money1)
                money1 = 0
              }
            }
            if (sub(aa.isum, aa.hxIsum) == 0) {
              aa.hxFlag = '1'
            } else {
              aa.hxFlag = '0'
            }
            aa.hzhcNum = add(aa.hzhcNum == null ? '0' : aa.hzhcNum, 1)
          }
          saleousingsList[j] = aa
        }
        await useRouteApi(saveSaleousingsList, {schemaName: dynamicTenantId})(saleousingsList)
      } else {
        //应收审核不自动核销
        await useRouteApi(saveSaleousing, {schemaName: dynamicTenantId})(formItems.value)
        await useRouteApi(saveSaleousingsList, {schemaName: dynamicTenantId})(saleousingsList)
      }
      //删除任务锁定
      await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'复核',recordNum:formItems.value.ccode})
    } else {
      // console.log('取消复核')
      if (formItems.value.hxFlag=='1' || formItems.value.hxIsum>0) {
        createErrorModal({
          iconType: 'warning',
          title: '警告',
          content: '记录已有核销记录，操作无效！'
        })
      } else {
        await jiezhang()
        if(flag.value){
          return createWarningModal({ content: '应收款已进行月末结账,不能进行操作！' });
        }
        let zdhx= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收自动核销',method:'核销'})
        if(zdhx.length){
          return createWarningModal({ content: zdhx[0]?.username+'正在进行应收自动核销,不能同时进行操作！' });
        }
        let ymjz= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收款月末结账',method:'月末结账'})
        if(ymjz.length){
          return createWarningModal({ content: ymjz[0]?.username+'正在进行应收款月末结账,不能同时进行操作！' });
        }
        let taskData= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应收单',method:'修改,删除,复核,弃复',recordNum:formItems.value.ccode})
        if(taskData.length==0){
          await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'弃复',recordNum:formItems.value.ccode,caozuoModule:'ar'})
        } else {
          // 任务不是当前操作员的
          if(String(taskData[0]?.caozuoUnique)!==String(useUserStoreWidthOut().getUserInfo.id)){
            return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+'应收单,不能同时进行操作！' });
          }else{
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:taskData[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'弃复',recordNum:formItems.value.ccode,caozuoModule:'ar'})
          }
        }
        formItems.value.bcheck = '0'
        formItems.value.bcheckTime = ''
        formItems.value.bcheckUser = ''
        formItems.value.bworkable = '0'
        formItems.value.bworkableTime = ''
        formItems.value.bworkableUser = ''
        await useRouteApi(saveSaleousing, {schemaName: dynamicTenantId})(formItems.value)
        const ysyfsList = await useRouteApi(findSaleousingsByCcode,{schemaName: dynamicTenantId})({ccode:formItems.value.ccode,billStyle:'YSD'})
        ysyfsList.map(ysyfs => {
          ysyfs.bcheck = '0'
          ysyfs.bcheckTime = ''
          ysyfs.bcheckUser = ''
          return ysyfs
        })
        await useRouteApi(saveSaleousingsList, {schemaName: dynamicTenantId})(ysyfsList)
        //删除任务锁定
        await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'弃复',recordNum:formItems.value.ccode})
      }
    }
    message.success(`${b?'复核':'弃复'}成功！`)
    await pageReload()
  } else {
    if (hasBlank(a)) message.error('获取用户信息异常！')
  }
}

const loadMark = ref(false)

//行赋值
function saveRow(row,index){
  tableData1.value[index] = row
  countTable()
}

//保存验证
function saveCheck(list) {
  let form = formFuns.value.getFormValue();

  if (hasBlank(form.ccode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '入库单号不能为空！'
    })
    return false
  }

  if (hasBlank(form.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '入库时间不能为空！'
    })
    return false
  }
  if (hasBlank(form.cvencode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '供应商不能为空！'
    })
    return false
  }
  if (list.length == 0) {
    createWarningModal({
      title: '温馨提示',
      content: '列表完整内容至少存在一条!仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整!'
    })
    return false
  }/* else if ((list.filter(it => hasBlank(it.cunitid) || hasBlank(it.baseQuantity) || hasBlank(it.icost + '') || hasBlank(it.price + ''))).length > 0) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '列表内容:仓库级别与存货编码为必选项,主数量、无税单价和本币无税金额为必填项,请补充完整,且必须存在一条！'
    })
    return false
  }*/
  return true
}

//数据保存
/*async function saveData() {
  let id = formItems.value.id
  formItems.value = formFuns.value.getFormValue()
  formItems.value.id = id // 制单人
  formItems.value.cmaker = useUserStoreWidthOut().getUserInfo.id // 制单人
  formItems.value.billStyle = pageParameter.type // 制单人
  formItems.value.bdocumStyle = titleValue.value == 0 ? "0" : "1" // 制单人
  let list = getDataSource().filter(it => !hasBlank(it.cwhcode) && !hasBlank(it.cinvode) && !hasBlank(it.cunitid) && !hasBlank(it.baseQuantity) && !hasBlank(it.icost + '') && !hasBlank(it.price + ''))
  if (saveCheck(list)) {
    list = list.map(it => ObjTool.dels(it, Object.keys(it).map(i => i.startsWith('edit') || i.startsWith('temp')))) //清理辅助字段
    list.forEach((o, i) => {  //转化
      o['lineCode'] = o['key']
      o['lineId'] = (i + 1) + ''
      o['isGive'] = o['isGive'] ? '1' : '0'
      o['cwhcode1'] = ckListOptions.value.filter(it => it.id == o['cwhcode'])[0]?.ckName || '默认仓库'
    })
    formItems.value.entryList = JsonTool.json(list)
    if (formItems.value?.id == null)
      formItems.value.ccode = await generateCode(formItems.value.ddate)
    await useRouteApi(saveRuKu, {schemaName: dynamicTenantId})(formItems.value)
    message.success('保存成功！')
    await pageReload()
    status.value = 3
  }
}*/
//只有预收款才能审核，普通收款直接审核核销
//收款金额为0时强制为预收款，审核时核销状态改为完成
async function saveData() {
  await jiezhang()
  if(flag.value){
    return createWarningModal({ content: '应收款已进行月末结账,不能进行操作！' });
  }
  if (hasBlank(formItems.value.ccode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据编号不能为空！'
    })
    return false
  }
  if (hasBlank(formItems.value.ddate)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '单据日期不能为空！'
    })
    return false
  }
  if (hasBlank(formItems.value.cvencode)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '客户不能为空！'
    })
    return false
  }
  if (hasBlank(formItems.value.cvencodeJs)) {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '结算客户不能为空！'
    })
    return false
  }
  if (isum.value==0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '价税合计不能为0！'
    })
    return false
  }
  let a=0
  if (getDataSource().length!=0){
    for (let i = 0; i < getDataSource().length; i++) {
      const item = getDataSource()[i]
      if (!hasBlank(item.cmemo) && !hasBlank(item.isum) && item.isum!=0) {
        a++
      }
    }
  }
  if(a==0){
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '明细至少有一条！'
    })
    return false
  }
  //保存收款单主表
  let ysd:any = {}
  if (formItems.value.id!=null && formItems.value.id!=''){
    ysd.id = formItems.value.id
  }
  ysd.iyear = dynamicYear.value
  ysd.ccode = formItems.value.ccode
  ysd.ccodePl = formItems.value.ccodePl
  ysd.cmaker = useUserStoreWidthOut().getUserInfo.id
  ysd.ddate = formItems.value.ddate
  ysd.bstyle = formItems.value.bstyle
  ysd.cvencode = formItems.value.cvencode
  ysd.cvencodeJs = formItems.value.cvencodeJs
  ysd.wlzzType = formItems.value.wlzzType
  ysd.cvencodeWl = formItems.value.cvencodeWl
  ysd.cwhcode = formItems.value.cwhcode
  ysd.cwhcodeUser = formItems.value.cwhcodeUser
  ysd.cdepcode = formItems.value.cdepcode
  ysd.bcheck = '0'
  ysd.bcheckTime = formItems.value.bcheckTime
  ysd.bcheckUser = formItems.value.bcheckUser
  ysd.cmemo = formItems.value.cmemo
  ysd.cpersoncode = formItems.value.cpersoncode
  ysd.bcloser = '0'
  ysd.bcloserTime = formItems.value.bcloserTime
  ysd.bcloserUser = formItems.value.bcloserUser
  ysd.squantity = formItems.value.squantity
  ysd.squantity1 = formItems.value.squantity1
  ysd.squantity2 = formItems.value.squantity2
  ysd.icost = formItems.value.icost
  ysd.isum = isum.value
  ysd.billStyle = 'YSD'
  ysd.bdocumStyle = isum.value>0?'0':'1'
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
  await useRouteApi(saveSaleousing,{schemaName: dynamicTenantId})(ysd)
  //删除收款单子表
  for (let i = 0; i < delIds.value.length; i++) {
    let id = delIds.value[i]
    await useRouteApi(deleteSaleousingsById,{schemaName: dynamicTenantId})(id)
  }
  let list:any = []
  //保存应收单子表
  for (let i = 0; i < getDataSource().length; i++) {
    const item = getDataSource()[i]
    if(!hasBlank(item.isum)) {
      let ysds: any = {}
      ysds.id = item.id
      ysds.iyear = dynamicYear.value
      ysds.lineCode = buildUUID()
      ysds.lineId = i+1
      ysds.billStyle = 'YSD'
      ysds.bstyle = item.bstyle
      ysds.ddate = formItems.value.ddate
      ysds.ccode = formItems.value.ccode
      ysds.cvencode = formItems.value.cvencode
      ysds.cvencodeJs = formItems.value.cvencodeJs
      ysds.cwhcode = item.cwhcode
      ysds.cinvode = item.cinvode
      ysds.cangkuDuli = item.cangkuDuli
      ysds.batchId = item.batchId
      ysds.cmaker = useUserStoreWidthOut().getUserInfo.id
      ysds.cunitid = item.cunitid
      ysds.cunitidF1 = item.cunitidF1
      ysds.cunitidF2 = item.cunitidF2
      ysds.unitId = item.unitId
      ysds.baseQuantity = item.baseQuantity
      ysds.subQuantity1 = item.subQuantity1
      ysds.subQuantity2 = item.subQuantity2
      ysds.citemClass = item.citemClass
      ysds.citemcode = item.citemcode
      ysds.cwhcode1 = item.cwhcode1
      ysds.cwhcode2 = item.cwhcode2
      ysds.cwhcode3 = item.cwhcode3
      ysds.cwhcode4 = item.cwhcode4
      ysds.cwhcode5 = item.cwhcode5
      ysds.cwhcode6 = item.cwhcode6
      ysds.itaxrate = item.itaxrate
      ysds.price = item.price
      ysds.taxprice = item.taxprice
      ysds.itaxprice = item.itaxprice
      ysds.icost = item.icost
      ysds.isum = item.isum
      ysds.isumJiesuan = item.isumJiesuan
      ysds.isumFapiao = item.isumFapiao
      ysds.isumXiaohuo = item.isumXiaohuo
      ysds.isumJijian = item.isumJijian
      ysds.isumWuliu = item.isumWuliu
      ysds.isumChuku = item.isumChuku
      ysds.cdepcode = formItems.value.cdepcode
      ysds.baccFlag = item.baccFlag
      ysds.baccUser = item.baccUser
      ysds.baccDate = item.baccDate
      ysds.baccId = item.baccId
      ysds.cmemo = item.cmemo
      ysds.isGive = item.isGive
      ysds.cgspstate = item.cgspstate
      ysds.sgspdate = item.sgspdate
      ysds.sgspperson = item.sgspperson
      ysds.dpdate = item.dpdate
      ysds.dvdate = item.dvdate
      ysds.cordercode = item.cordercode
      ysds.csource = item.csource
      ysds.bcheck = '0'
      ysds.bcheckTime = item.bcheckTime
      ysds.bcheckUser = item.bcheckUser
      ysds.bcloser = '0'
      ysds.bcloserTime = item.bcloserTime
      ysds.bcloserUser = item.bcloserUser
      ysds.changer = item.changer
      ysds.changedate = item.changedate
      ysds.totalsourceid = item.totalsourceid
      ysds.sourcetype = item.sourcetype
      ysds.sourcecode = item.sourcecode
      ysds.sourcedetailId = item.sourcedetailId
      ysds.sourcedate = item.sourcedate
      ysds.hxFlag = '0'
      ysds.hxIsum = item.hxIsum
      ysds.quantityPd = item.quantityPd
      ysds.subPandian1 = item.subPandian1
      ysds.subPandian2 = item.subPandian2
      ysds.quantityUk = item.quantityUk
      ysds.quantityUk1 = item.quantityUk1
      ysds.quantityUk2 = item.quantityUk2
      list.push(ysds)
    }
  }
  await useRouteApi(saveSaleousingsList,{schemaName: dynamicTenantId})(list)
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
  await balanceTaskDel()
  if (status.value == 1) {
    // await contentSwitch('first')
    await contentSwitch('tail')
  } else if (status.value == 2) {
    await contentSwitch('curr')
  }
  tableSelectedRowKeys.value = []
  status.value = 3
}

async function balanceTaskDel() {
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'添加'})
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收单',method:'修改',recordNum:formItems.value.ccode})
}

const loadPage = (e) => {
  columnReload()
}

function formatUniqueJiLiang(uniqueCodeUser) {
  let str = uniqueCodeUser
  jiList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.unitName
      }
    }
  )
  return str || ''
}

function formatUniqueOperator(uniqueCodeUser) {
  let str = uniqueCodeUser
  operatorList.value.forEach(
    function (psn: any) {
      if (psn.id == uniqueCodeUser) {
        str = psn.realName
      }
    }
  )
  return str || ''
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


const rowDataGrab = async (rowObj, type: string) => {
  let arr = assetsCardList.value.filter(it => (type == 'one' ? (it.sysId == rowObj.sysId) : type == 'two' ? (it.assetsCode == rowObj.assetsCode) : (it.assetsName == rowObj.assetsName)))
  if (arr.length > 0 && rowObj['assetsUniqueCode'] != arr[0].assetsUniqueCode) {
    rowObj['assetsUniqueCode'] = arr[0].assetsUniqueCode
    rowObj['sysId'] = arr[0].sysId
    rowObj['assetsCode'] = arr[0].assetsCode
    rowObj['assetsName'] = arr[0].assetsName
    // 初始化其他参数
    let res = await useRouteApi(findFaAssetInfoByCode, {schemaName: dynamicTenantId})({code: arr[0].assetsUniqueCode}) || []
    if (null != res && res.length > 0) {
      rowObj['speciType'] = res[0].speciType
      rowObj['bookAmount'] = res[0].bookAmount
      rowObj['measureUnit'] = res[0].measureUnit
      rowObj['yuanzhi'] = res[0].yuanzhi
      rowObj['jtBy'] = res[0].jtBy
      rowObj['zjLj'] = res[0].zjLj
      rowObj['jingzhi'] = res[0].jingzhi
    }
    cardListOptions.value = []
  }
}

const handleSearch = async (val: string, type: string) => {
  if (!hasBlank(val)) {
    // 排除已存在到存货
    let filterList =[] // getDataSource().filter(it => !hasBlank(it.cinvode)).map(it => it.cinvode)
    await fetch(val, type, filterList, (d: any[]) => (cardListOptions.value = d));
  }
};
const handleChange = async (val: string, type: string) => {
  // debugger
  // await fetch(val, type,(d: any[]) => (cardListOptions.value = d));
  // 赋值
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
    /*let qData = {
      date: formFuns.value.getFormValue().ddate,
      type: type,
      qValue: value,
    }
    let res = await useRouteApi(findCunHuoListByCondition, {schemaName: dynamicTenantId})(qData) || []*/
    let res = assetsCardList.value.filter(it=>it[type == 'one'?'stockNum':'stockName'].indexOf(value) !=-1)
    let data:any = []
    res = res.filter(it => filterList.indexOf(it.stockNum) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r[type == 'one' ? 'stockNum' : 'stockName'],
        label: (r['stockNum'] + ' ' + r['stockName']),
      });
    });
    callback(data);
  }

  timeout = setTimeout(fake, 300);
}

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
const [registerSelectProjectPage, {openModal: openSelectProjectPage}] = useModal()

const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cvencode':
      openMoalPopPage(true, {
        database: dynamicTenantId.value,
        accId: dynamicAccId.value,
      });
      break;
    case 'cvencodeJs':
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
  if (thisEditType.value=='cvencode'){
    formItems.value.cvencode = o[0].id
    changeCvencode()
  }
  if (thisEditType.value=='cvencodeJs'){
    formItems.value.cvencodeJs = o[0].id
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
  /*if (thisEditObj.value) {
    if (thisEditType.value == 'cinvode') {
      thisEditObj.value['tempTwo'] = o[0].stockNum
    } else {
      thisEditObj.value['tempOne'] = o[0].id
    }
    focusNext(thisEditObj.value,thisEditType.value)
    thisEditObj.value = null
  } else {
    let e = formFuns.value.getFormValue()
    e[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
    formFuns.value.setFormValue(e)
  }*/
}
const resetRow = (record) => {
  record['key'] = record.lineCode
  let o = assetsCardList.value.filter(it => it.stockNum == record.cinvode )[0]
  record.cinvodeName = o?.stockName || ''
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  record.isGive = record.isGive == '1'
  // 计量类型
  record.cunitType = o?.stockMeasurementType ==  '单计量'?'1':'0'
  record.cunitid = o?.stockMeasurementUnit // 计量类型
  if (record.cunitType == '0'){ //
    let res =  manyJiList.value.filter(it=>it.id == record.cunitid)[0]
    if (res != null) {
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      if (list.length > 0)
        record.cunitidText = list[0].unitName + `[${list[0].conversionRate}]`
    }
  }
  record.isBatch = o?.stockPropertyBatch == '1'
  return record;
}

function changeCvencode(){
  const cusList = customerList.value.filter(item=>formItems.value.cvencode==item.id)
  if(cusList[0].uniqueCodeCcus!=null && cusList[0].uniqueCodeCcus!=''){
    const res = customerList.value.filter(item=>item.uniqueCodeCcus==item.uniqueCode)
    if (res.length!=0) {
      formItems.value.cvencodeJs = res[0].id
    }
  } else {
    formItems.value.cvencodeJs = formItems.value.cvencode
  }
}

const isum:any = ref('0')
const isum1:any = ref('0')
const hxIsum:any = ref('0')
const hxMoney:any = ref('0')
const idiscount:any = ref('0')
//计算收款明细和核销明细
function countTable(){
  isum.value = 0
  getDataSource().forEach(item=>{
    if (item.isum!=null && item.isum!=''){
      isum.value = add(isum.value,item.isum)
    }
  })
  isum1.value = 0
  hxIsum.value = 0
  hxMoney.value = 0
  idiscount.value = 0
}

const tableDataChange =  (r,c) => {
  switch (c) {
    case 'isum':
      if(titleValue.value != 0 && c=='isum' ){
        r.tempTwo=parseFloat(r.tempTwo) > 0?0 - (Math.abs(parseFloat(r.tempTwo))):r.tempTwo
        r.isum=r.tempTwo
      } else {
        r.tempTwo=parseFloat(r.tempTwo) < 0?(Math.abs(parseFloat(r.tempTwo))):r.tempTwo
        r.isum=r.tempTwo
      }
      break
  }
  countTable()
}

const slChange = (r,c) => {
  if (c == 'baseQuantity' && r.cunitType == '0' && r.unitInfo != null){ // 存在多计量的清空
    // 运算辅助数量
    let list:any = JsonTool.parseObj(r.unitInfo.detail) || []
    if (list.length > 0){
      let n:any = parseFloat(r.baseQuantity).toFixed(10)
      let isnum:any  = (r.unitInfo.unitType == '2')
      let one =  parseFloat((n/parseFloat(list[1].conversionRate))).toFixed(10)
      let two =  null != list[2]?parseFloat((n/parseFloat(list[2].conversionRate))).toFixed(10):0
      if (isnum){ //取整数}
        r.baseQuantity = NumberTool.toCeil(n,2)+''
        r.subQuantity1 = NumberTool.toCeil(one,2)+''
        r.subQuantity2 = NumberTool.toCeil(two,2)+''
      }else {
        r.subQuantity1 = one+''
        r.subQuantity2 = two+''
      }
    }
  }
}
const chChange = (record) => {
  let o = assetsCardList.value.filter(it => (it.stockNum == record.cinvode) || (it.stockName == record.cinvodeName))[0]
  record.cinvodeName = o?.stockName
  record.cinvode = o?.stockNum
  record.cinvodeType = o?.stockGgxh // 规格型号
  record.bcheck1 = o?.stockBarcode // 条形码
  // 计量类型
  record.cunitType = o.stockMeasurementType == '单计量'?'1':'0'
  record.cunitid = o?.stockMeasurementUnit // 计量类型
  record.isBatch = o?.stockPropertyBatch == '1' // 批号必须输入
  if (o.stockMeasurementType == '多计量' && !hasBlank(record.cunitid) &&  record?.unitInfo == null){
    let res =  manyJiList.value.filter(it=>it.id == record.cunitid)[0]
    if (res != null){
      record.unitInfo = res
      let list = JsonTool.parseObj(res.detail) || []
      if (list.length > 0){
        record.cunitidText = list[0].unitName +`[${list[0].conversionRate}]`
        if (list.length > 1){
          record.cunitidF1 = list[1].unitName +`[${list[1].conversionRate}]`
          if (list.length > 2)
            record.cunitidF2 = list[2].unitName +`[${list[2].conversionRate}]`
        }
      }
    }
  }
}

const outBefore = () => {
  balanceTaskDel()
  if (status.value != 3){
    createConfirm({
      iconType: 'warning',
      title: '编辑中',
      content: '当前正在处于编辑,退出编辑将丢失,您确定要继续进行吗？',
      onOk: async () => {
        // 调整数据库 列参数
        closeCurrent()
      },
      onCancel: async () => {

      }
    });
  } else {
    closeCurrent()
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
  if(titleValue.value != 0 && c=='isum' ){
    r.tempTwo=parseFloat(r.tempTwo) > 0?0 - (Math.abs(parseFloat(r.tempTwo))):r.tempTwo
    r.isum=r.tempTwo
  } else {
    r.tempTwo=parseFloat(r.tempTwo) < 0?(Math.abs(parseFloat(r.tempTwo))):r.tempTwo
    r.isum=r.tempTwo
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
  let filters = ['cmemo','isum']
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
    let doms:any = nextC == 'cmemo' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model:any = {cmemo:'One',isum:'Two'}
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
