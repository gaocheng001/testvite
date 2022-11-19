<template>
  <BasicModal
    width="650px"
    :height="200"
    class="spaceLogo"
    v-bind="$attrs"
    title="入库单查询"
    @ok="handleOk()"
    @cancel="handleClose()"
    :canFullscreen="false"
    :footer="null"
    @visible-change="openOrClose"
    @register="register"
    :loading="modelLoadIng"
    loadingTip="查询参数初始化中"
  >

    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px"/>
        <span style="font-size: 14px">库存管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 130px);height: 100%;">
        <div style="display: flex;margin-top: 10px;padding-left: 25%;">
          <SettingTwoTone  style="font-size: 30px;color: #0096c7;margin-left: 1em;"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;整理现存量</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>业务范围</span>
              <div style="margin-left: 72px;">
                <ul>
                  <li style="margin: 2% 0px;">
                    <AccountPicker theme="three" @reloadTable="codeChange"/>
                  </li>
                </ul>
              </div>
            </div>
            <div class="border-div">
              <span>整理仓库</span>
              <div style="margin-left: 72px;">
                <ul>
                  <li style="margin: 2% 0px;">
                      <span class="right_span"> 存货仓库：</span>
                      <a-select
                        :allowClear="true"
                        v-model:value="formItems.cwhcode"
                        style="width: 60%;text-align: center;"
                        ref="select"
                      >
                        <a-select-option v-for="data in searchData" :key="data.key" :value="data.id">{{ data.label }}</a-select-option>
                      </a-select>
                      <a style="font-weight: bold;font-size: 18px;"><PaperClipOutlined @click="openCkSelectContent" /></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 360px;">
        <Button style="width: 100px;" shape="round" @click="handleOk()" type="primary">开始整理</Button>
        <Button style="width: 100px;margin-top: 10px" shape="round" @click="handleClose">取消</Button>
      </div>
    </div>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {ref, unref, reactive, onMounted, watch, computed} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput,
  Checkbox as ACheckbox,
  Radio as ARadio,
  Popconfirm as APopconfirm,
  Tabs as ATabs, message, Transfer as ATransfer,Modal,Button
} from "ant-design-vue"
import {
  PlusSquareOutlined,
  FileSearchOutlined,
  SearchOutlined,SettingTwoTone,
  PicLeftOutlined, PaperClipOutlined
} from '@ant-design/icons-vue';
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import moment, {Moment} from 'moment';
import {
  findCodeKmByPeriod,
  findMaxPingZhengQiJian, findAllAuthPeriodListByUserAndCode
} from '/@/api/record/generalLedger/data';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {
  currentAccountTypes,
  currentCyDatas,
  filterAccListByAuth, findVoucherTypeAuthorList
} from "/@/api/record/system/financial-settings";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {
  hasBlank,
  pointMessage
} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {psnFindByFlag} from "/@/api/psn/psn";
import Assist from "/@/views/boozsoft/global/popup/accvoucher/HelloAbc.vue";
import ModalAllPop from './modalAllPop.vue';
import {findParameterValue, modifyParameterValue} from "/@/api/task-api/query-bus-api";
import {ObjTool, StrTool} from "/@/api/task-api/tools/universal-tools";
import {findAllFuzhuHesuanList} from "/@/api/record/system/fuzhu-hesuan";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import StockCangKuModalPop from '/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue';
import {xclMake,findTask} from "/@/api/record/stock/stock-account";

//红字（无现金科目，请设置现金科目后再进行查询）
const {closeCurrent} = useTabs(router);
const emit = defineEmits(['register', 'save'])

const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const ACheckboxGroup = ACheckbox.Group
const ATabPane = ATabs.TabPane

const userStore = useUserStore();
const formItems: any = ref({
  flg: '5'
})
let changeBeforeModel: any = {}

const busDate = useCompanyOperateStoreWidthOut().getLoginDate
const maxPingzhengQj = ref('')
const ifCrossYear = ref('1')

const userId = userStore.getUserInfo.id

const currentDynamicTenant = ref('')
const {createWarningModal} = useMessage();

const targetKeys: any = ref(['subjectNumber', 'direction', 'number', 'amount', 'wbAmount', 'reviewStatus', 'bookStatus', 'preparedMan'])
const selectedKeys: any = ref([])

const targetKeys2: any = ref([])
const startRendering = ref(false)
const selectedKeys2: any = ref([])

const companyOperateStore = useCompanyOperateStoreWidthOut()

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  // 方式2
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  setModalProps({minHeight: 400});

})

const totalChange = computed(() => formItems.value.total)
watch(totalChange, async (a) => {
    if (a != 0) {
      modelLoadIng.value = false
      closeModal()
      formItems.value.total = 0
    }
  }
)

let count = 0
const codeChange = async (value) => {
  ++count
  if (count == 2) return false; // 防止重复打开
  // 赋值默认参数
  console.log(value)
  dbQueryJson.accountId = value.accId;
  defaultModel.constant.companyCode = value.coCode
  defaultModel.constant.tenantId = value.accountMode
  defaultModel.constant.year = value.year
  modelLoadIng.value = true
  // 初始化基础参数
  modelList[defaultTabsKey.value].constant.tenantId = value.accountMode
  currentDynamicTenant.value = value.accountMode
  initData()

  formItems.value.cwhcode= ''
  modelLoadIng.value = false
}


/*********Mr·Ye*********/
const defaultTabsKey = ref('1')
const modelLoadIng = ref(false)

const defaultModel = {
  constant: {
    currency: '',
    tenantId: '',
    companyCode: '',
    queryType: '1',
    showType: '2',
    year:'',
    thisAdInfo: {}
  },
  authority: {codes: [], types: []},
  variable: {
    periodStart: '',
    periodEnd: '',
    dateStart: '',
    dateEnd: '',
    voucherNumberStart: '',
    voucherNumberEnd: '',
    voucherType: '',
    summary: '',
    reviewStatus: '',
    bookStatus: '',
    subjectNumber: '',
    direction: '',
    amountMax: '',
    amountMin: '',
    numberMax: '',
    numberMin: '',
    wbAmountMax: '',
    wbAmountMin: '',
    /*    billNumberStart: '',
        billNumberEnd: '',*/
    preparedMan: '',
    checkMan: '',
    cashierMan: '',
    reviewMan: '',
    bookMan: '',
    accounting: {},
    assists: {}
  }
}
const modelList = reactive({
  '1': {
    constant: {
      currency: '',
      tenantId: '',
      thisAdInfo: {},
      queryType: '1',
      showType: '2',
      companyCode: ''
    },
    authority: {codes: [], types: []},
    variable: {
      periodStart: '',
      periodEnd: '',
      dateStart: '',
      dateEnd: '',
      voucherNumberStart: '',
      voucherNumberEnd: '',
      voucherType: '',
      summary: '',
      reviewStatus: '',
      bookStatus: '',
      subjectNumber: '',
      direction: '',
      amountMax: '',
      amountMin: '',
      numberMax: '',
      numberMin: '',
      wbAmountMax: '',
      wbAmountMin: '',
      /*  billNumberStart: '',
        billNumberEnd: '',*/
      preparedMan: '',
      checkMan: '',
      cashierMan: '',
      reviewMan: '',
      bookMan: '',
      accounting: {},
      assists: {},
    }
  },
})

const openOrClose = (visible: boolean) => {
    defaultTabsKey.value = '1'
}

/*********Mr·Ye*********/
let isChanged: boolean = false

async function handleOk() {

  //整理时发现采购、销售、库存业务单据的新增、修改和审核任务时，都提示一下
  //XXX操作员正在进行XXXX操作，不能进行整理现存量操作，请退出单据处理后继续！

  if ((formItems.value.cwhcode??true) == true){
    message.error('请先选择仓库!');
    return
  }
  modelLoadIng.value = true

  //锁定表
  let task =  await useRouteApi(findTask, {schemaName: currentDynamicTenant})({})
  console.log(task)
  if(task.id){
    console.log(task.id)

    message.error(task.caozuoUnique+"操作员正在进行"+ task.functionModule +":"+task.recordNum+"操作，不能进行整理现存量操作，请退出单据处理后继续！")
    return
  }
  //跟新现存量
  await useRouteApi(xclMake, {schemaName: currentDynamicTenant})(
    {
      ck:formItems.value.cwhcode,
      year:defaultModel.constant.year
    }
  ).then(v=>{
    setTimeout(()=>{
      modelLoadIng.value = false
      message.success("现存量整理完成！")
      //添加日志
      /************** 记录操作日志 ****************/
      saveLogData('整理现存量')
      closeModal()
      setTimeout(()=>{
        closeCurrent()
      },2000)
    },5000)
  })
  //emit('save', unref(formItems.value))
  return true
}

async function saveLogData(optAction) {
  let findOne =  searchData.value.find(v=>v.id == formItems.value.cwhcode)
  console.log(findOne.label)
  let logmap={
    loginTime:new Date( +new Date() + 8 * 3600 * 1000 ).toJSON().substr(0,19).replace("T"," "),
    userId: useUserStoreWidthOut().getUserInfo.username,
    userName: useUserStoreWidthOut().getUserInfo.realName,
    optModule:'stock',
    optFunction:'整理现存量',
    uniqueCode:formItems.value?.ccode,
    optAction:optAction,
    optContent:'操作内容【整理现存量】,仓库名称【'+findOne.label+'】',
  }
  await saveLog(logmap)
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent()
    router.push('/zhongZhang/home/welcome')
  }
  closeModal()
}

const dbQueryJson = reactive({ // 后台数据模型
  id: null,
  accountId: '',
  owningMenuName: '库存台账列表',
  owningPlan: '1',
  planPerson: userId,
  filterConditions: '',
  queryConditions: ''
})


import dayjs from "dayjs";
import {
  findAllStock,
  findAllStockClass,
  findDeptList, findSearchAll,
  getFwList
} from "/@/api/record/stock/stock_taking";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
import {stockBalanceTaskSave} from "/@/api/record/stock/stock_balance";


const [registerStockCangKuModalPage, { openModal: openStockCangKuModalPage }] = useModal();
const openCkSelectContent = async (record, type) => {
  //仓库
  openStockCangKuModalPage(true,{
    database:currentDynamicTenant.value,
  })
}
const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();

const openChSelectContent = async (record, type) => {
  //存货
  openStockInfoModalPage(true, {
    database: currentDynamicTenant.value,
  })
}
const stockAdd = (o) => {
  console.log(o)
  formItems.value.stockNum = o[0].stockNum
}
function throwStockCangKuData(data,ckFlag) {
  console.log(data)
  // 独立仓库
  if (ckFlag === '1') {
    formItems.value.cwhcode = data[0].num
  }else{
// 级别仓库
  }
}

const chList:any = ref([]);
const searchData:any = ref([]);

async function initData() {
  //仓库
  searchData.value = await useRouteApi(findSearchAll, {schemaName: currentDynamicTenant})('')

}

</script>
<style lang="less" scoped>

:deep(.ant-checkbox){
  margin-top: -8px;
}
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;
  :deep(.ant-select-selector), :deep(.ant-input-affix-wrapper) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    background: none;
  }
  .border-div {
    position: relative;
    border: 1px #a29f9f solid;
    margin: 20px 10px;
    padding: 2.5%;

    > span {
      display: block;
      width: 80px;
      text-align: center;
      background-color: white;
      position: absolute;
      left: 50px;
      top: -10px;
      color: #888888;
      font-size: 12px;
      font-weight: bold;
    }
  }
}
:global(.ant-modal-header) {
  padding: 10px 0 !important;
}
:global(.ant-modal-close-x){
  height: 30px !important;
  color: white;
}
</style>
