<template>
  <BasicModal
    width="700px"
    :height="300"
    class="spaceLogo"
    v-bind="$attrs"
    title="入库单查询"
    @ok="handleOk()"
    @cancel="handleClose()"
    :canFullscreen="false"
    :maskClosable="false"
    :draggable="false"
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
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="display: flex;margin-top: 10px">
          <SearchOutlined style="font-size: 30px;color: #0096c7;margin-left: 1em;"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;库存台账查询</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>业务范围</span>
              <AccountPicker style="text-align: center;" theme="three" @reloadTable="dynamicAdReload"/>
            </div>
            <div class="border-div">
              <span>查询条件</span>
              <div style="margin-left: 72px;">
                <ul>

                  <li style="margin: 2% 0px;">
                    <span><font style="color: red">*</font>制单日期：</span>
                    <a-date-picker style="width: 120px;" v-model:value="formItems.dateStart" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
                    -
                    <a-date-picker style="width: 120px;" v-model:value="formItems.dateEnd" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                  </li>
                  <li style="margin: 2% 0px;">
                    <span style="text-align: left"> <font style="color: red">*</font>存货仓库：</span>
                    <a-select
                      :allowClear="true"
                      v-model:value="formItems.cwhcode"
                      style="width: 60%;margin-left: 28px;"
                      ref="select"
                    >
                      <a-select-option v-for="data in ckList" :key="data.key" :value="data.cangkuId">{{ data.cangkuName }}</a-select-option>
                    </a-select>
                    <a style="font-weight: bold;font-size: 18px;"><PaperClipOutlined @click="openCkSelectContent" /></a>
                  </li>
                  <li style="margin: 2% 0px;">
                    <span style="text-align: left"> <font style="color: red">*</font>存货档案：</span>
                    <a-select
                      show-search
                      v-model:value="formItems.stockNum"
                      style="width: 60%;margin-left: 28px;"
                      ref="select"
                    >
                      <a-select-option
                        v-for="item in chList"
                        :key="item.stockNum"
                        :value="item.stockNum"
                      >
                        {{ item.stockNum+'-'+ item.stockName}}
                      </a-select-option>
                    </a-select>
                    <a style="font-weight: bold;font-size: 18px;"><PaperClipOutlined @click="openChSelectContent" /></a>
                  </li>
                  <li style="margin: 2% 0px;">
                    <span style="text-align: left"> <font style="color: red">*</font>单据状态：</span>
                    <a-select
                      :allowClear="true"
                      show-searchplaceholder=""
                      v-model:value="formItems.flg"
                      style="width: 63%;text-align: center;margin-left: 28px;"
                    >
                      <a-select-option v-for="d in typeList" :value="d.value">
                        {{ d.name }}
                      </a-select-option>
                    </a-select>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 360px;">
        <Button style="width: 100px;" shape="round" @click="handleOk"  type="primary">确定</Button>
        <Button style="width: 100px;margin-top: 10px" shape="round" @click="handleClose">放弃</Button>
      </div>

      <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="throwStockCangKuData"/>
      <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="stockAdd"/>

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
  Tabs as ATabs, message, Transfer as ATransfer,Button
} from "ant-design-vue"
import {
  PlusSquareOutlined,
  FileSearchOutlined,
  SearchOutlined,AppstoreOutlined,
  PicLeftOutlined, PaperClipOutlined
} from '@ant-design/icons-vue';
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";

import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";

import {useUserStore} from "/@/store/modules/user";

import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";

import {findParameterValue, modifyParameterValue} from "/@/api/task-api/query-bus-api";
import {ObjTool, StrTool} from "/@/api/task-api/tools/universal-tools";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";

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
  flg: '5',
  dateStart: '2022-01-01',
  dateEnd: dayjs(useCompanyOperateStoreWidthOut().getLoginDate),
})
let changeBeforeModel: any = {}

const typeList = [
  {
    'name': '全部',
    'value': '5'
  },{
    'name': '未审核',
    'value': '0'
  },
  {
    'name': '已审核',
    'value': '1'
  }
]


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
const tabsChange = (value) => {
  if (value == '1') {
    modelList[defaultTabsKey.value] = defaultModel
  } else if (value == '2') {
    modelList[defaultTabsKey.value] = modelList[value]
  } else if (value == '3') {
    modelList[defaultTabsKey.value] = modelList[value]
  } else if (value == '4') {
    modelList[defaultTabsKey.value] = modelList[value]
  }
  if ((value == '1' || value == '3' || value == '2') && modelList[defaultTabsKey.value].constant.companyCode == '') {
    modelList[defaultTabsKey.value].constant.companyCode = defaultModel.constant.companyCode
    modelList[defaultTabsKey.value].constant.tenantId = defaultModel.constant.tenantId
  }
}


/*********Mr·Ye*********/
let isChanged: boolean = false

async function handleOk() {
  modelLoadIng.value = false
  if(!formItems.value.dateStart){
    message.error("请输入开始日期")
    return
  }

  if(!formItems.value.dateEnd){
    message.error("请输入开始日期")
    return
  }
  if(!formItems.value.cwhcode){
    message.error("请输入存货仓库")
    return
  }
  if(!formItems.value.stockNum){
    message.error("请输入存货档案")
    return
  }
  //formItems.value.dateStart = startRq
  //formItems.value.dateEnd = endRq 
  let d = chList.value.find(v=> v.stockNum == formItems.value.stockNum)
  formItems.value.chname = "（"+d.stockNum+"）"+d.stockName
  formItems.value.stockGgxh = d.stockGgxh
  formItems.value.stockUnitName = d.stockUnitName
  let ck = ckList.value.find(v=> v.cangkuId == formItems.value.cwhcode)
  formItems.value.ckname = ck.cangkuName
  modelList[defaultTabsKey.value].openOne = formItems.value.openOne

  formItems.value.accId =currentDynamicTenant.value
  console.log(formItems.value.accId )
  emit('save', unref(formItems.value))
  closeModal()
  return true
}

async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1) {
    await closeCurrent()
    router.push('/zhongZhang/home/welcome')
  }
  closeModal()
}

// 查询

let radiovalue = ref('2');
const riqi: any = ref([]);


// 过滤设置
const transferHandleChange = (nextTargetKeys: string[]) => {
  targetKeys.value = nextTargetKeys;
}
const transferHandleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
  selectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys];
}
const transferHandleChange2 = (nextTargetKeys: string[]) => {
  targetKeys2.value = nextTargetKeys;
}
const transferHandleSelectChange2 = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
  selectedKeys2.value = [...sourceSelectedKeys, ...targetSelectedKeys];
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

/**
 * 针对与凭证查询条件清理无用参数
 */
const modifyDbPersonData = async (jsonData) => { // 异步更新后台最新记录
  let json = JSON.parse(JSON.stringify(jsonData))
  delete json['authority']
  delete json['constant']['thisAdInfo']
  json.variable = ObjTool.dels(json.variable, [])
  //dbQueryJson.owningPlan = json.constant.queryType
  dbQueryJson.filterConditions = JSON.stringify({
    'filter1': (targetKeys.value),
    'filter2': (targetKeys2.value)
  });
  dbQueryJson.queryConditions = JSON.stringify(json);
  modifyParameterValue(dbQueryJson).then(() => {
    message.success('查询参数后台同步成功！')
  }).catch(() => {
    message.warn('查询参数后台同步失败！')
  });
}


import dayjs from "dayjs";
import {
  findAllStock,
  findAllStockClass,
  findDeptList, findSearchAll,
  getFwList
} from "/@/api/record/stock/stock_taking";
import {findAll as sotckCangKuAll} from "/@/api/record/stock/stock-cangku";


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
function throwStockCangKuData(data) {
  console.log(data)
  formItems.value.cwhcode = data[0].id
}

const chList:any = ref([]);
const searchData:any = ref([]);
const ckList: any = ref([]);

async function initData() {
  //仓库
  //searchData.value = await useRouteApi(findSearchAll, {schemaName: currentDynamicTenant})('')

  let temp=await useRouteApi(sotckCangKuAll,{schemaName: currentDynamicTenant})({searchConditon: {
      requirement: 'ckNum',
      value: '',
    }})
  ckList.value=[]
  temp.items.forEach(a=>{
    ckList.value.push({cangkuId:a.id,cangkuName:a.ckName})
  })
  formItems.value.cwhcode = ckList.value[0].cangkuId

  //存货
  chList.value = await useRouteApi(findAllStock,{schemaName: currentDynamicTenant})({})
}

const dynamicAdReload = async (obj) =>{
  currentDynamicTenant.value=obj.accountMode
  initData()
  formItems.value = {
    flg: '5',
    dateStart: new Date().getFullYear()+'-01-01',
    dateEnd: dayjs(useCompanyOperateStoreWidthOut().getLoginDate)
  }
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
