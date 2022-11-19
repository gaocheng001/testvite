<template>
  <BasicModal
    width="900px"
    :height="400"
    class="spaceLogo"
    v-bind="$attrs"
    @ok="handleOk()"
    @cancel="handleClose()"
    :canFullscreen="false"
    @visible-change="openOrClose"
    @register="register"
    :loading="modelLoadIng"
    loadingTip="查询参数初始化中"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px"> 采购管理</span>
      </div>
    </template>
    <div class="nc-open-content" style="height: 100%">
      <SearchOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px;margin-left: 40%;"/>
      <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;采购排行榜</span>
      <div class="open-content-up">
        <div class="ocup-position">
          <PicLeftOutlined/>
          查询方案
        </div>
        <Tabs type="card" v-model:activeKey="defaultTabsKey" tabPosition="left" style="width: 20%;float: left;">
          <TabPane key="1" tab="存货采购排行榜"></TabPane>
          <TabPane key="2" tab="供应商采购排行榜"></TabPane>
        </Tabs>
        <ul style="width: 80%;display: inline-block;margin-top: -29px;">
          <li>
            <div class="special-border-div">
              <span>业务范围</span>
              <AccountPicker theme="three" @reloadTable="codeChange"/>
            </div>
          </li>
          <li>
            <div class="special-border-div">
              <span style="color: #5a5a5a">查询日期</span>
              <div>
                <div class="sbd-left">
                  <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                    <p>
                      <a-radio value="1"></a-radio>
                      <span style="font-size: 14px;" class="spanclass">会计期间：</span>
                      <a-select
                        v-model:value="strDate"
                        show-search
                        :disabled="dateselflg"
                        style="width: 110px;color: black;"
                        @focus="focusStrDate"
                        @change="handleChangeStrDate"
                      >
                        <a-select-option
                          v-for="item in strDateList"
                          :value="item.stockYear+'-'+item.stockMonth"
                        >
                          {{ item.stockYear+'-'+item.stockMonth }}
                        </a-select-option>
                        <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                      </a-select>
                      <span>&emsp;~&emsp;</span>
                      <a-select
                        v-model:value="endDate"
                        show-search
                        :disabled="dateselflg"
                        style="width: 110px;color: black;"
                        @focus="focusEndDate"
                        @change="handleChangeEndDate"
                      >
                        <a-select-option
                          v-for="item in endDateList"
                          :value="item.stockYear+'-'+item.stockMonth"
                        >
                          {{ item.stockYear+'-'+item.stockMonth }}
                        </a-select-option>
                        <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                      </a-select>
                    </p>
                    <p>
                      <a-radio value="2"></a-radio>
                      <span style="font-size: 14px;" class="spanclass">单据日期：</span>
                      <a-date-picker style="width: 125px;" v-model:value="strDate2" @change="datePickerChange()"/>
                      <a-date-picker style="width: 125px;" v-model:value="endDate2" @change="datePickerChange()"/>
                    </p>
                  </a-radio-group>
                </div>
                <div class="sbd-right">
                  <a-radio-group size="small" :disabled="radiovalue=='2'" @change="checkChange">
                    <a-radio-button value="1">上月</a-radio-button>
                    <a-radio-button value="2">本月</a-radio-button>
                    <a-radio-button value="3">本季</a-radio-button>
                    <a-radio-button value="4">本年</a-radio-button>
                  </a-radio-group>
                  <a-radio-group size="small" :disabled="radiovalue=='1'" @change="checkChange">
                    <a-radio-button value="5">今天</a-radio-button>
                    <a-radio-button value="6">昨天</a-radio-button>
                    <a-radio-button value="7">前天</a-radio-button>
                    <a-radio-button value="8">月末</a-radio-button>
                  </a-radio-group>
                </div>

              </div>
            </div>
          </li>
          <li>
            <div class="special-border-div">
              <span style="color: #5a5a5a">查询条件</span>
              <div style="display: inline-block;width: 96%;">
                <div style="width: 50%;float: left;">
                  <span class="right_span">单据编号：</span>
                  <a-input :allowClear="true" placeholder="" style="width: 80px"
                           v-model:value="queryModel.variable.ccodeMin"/>
                  <span>&emsp;~&emsp;</span>
                  <a-input :allowClear="true" placeholder="" style="width: 80px"
                           v-model:value="queryModel.variable.ccodeMax"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">状态：</span>
                  <a-select
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px;text-align: center;"
                    v-model:value="queryModel.variable.bcheck">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="0">未审核</a-select-option>
                    <a-select-option value="1">已审核</a-select-option>
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                  </a-select>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">供应商：</span>
                  <a-select
                    show-search
                    :filter-option="filterSupplierOption"
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px;text-align: center;"
                    v-model:value="queryModel.variable.cvencode"
                    @change="xscustChange(true)"
                    :options="dataMap['supplier']"
                  >
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cvencode')"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">结算供应商：</span>
                  <a-select
                    show-search
                    :filter-option="filterSupplierOption"
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px;text-align: center;"
                    v-model:value="queryModel.variable.cvencodeJs"
                    @change="xscustChange(false)"
                    :options="dataMap['supplier']"
                  >
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cvencodeJs')"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">存货：</span>
                  <a-select
                    show-search
                    :filter-option="filterStockOption"
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px;text-align: center;"
                    :options="dataMap['stock']?.filter(it=>queryModel.variable.cinvodeClass==''?true:it.stockClass == queryModel.variable.cinvodeClass)"
                    v-model:value="queryModel.variable.cinvode"
                  >
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cinvode')"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">规格型号：</span>
                  <a-select
                    show-search
                    :filter-option="filterGgxhOption"
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px;text-align: center;"
                    :options="dataMap['stock']?.filter(it=>null!=it.stockGgxh && ''!=it.stockGgxh).map(it=>({lable: it.stockGgxh,value:it.stockGgxh }))"
                    v-model:value="queryModel.variable.stockGgxh"
                  >
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" />
                </div>
                <div style="width: 50%;float: left;" >
                  <span class="right_span">仓库：</span>
                  <a-select
                    show-search
                    :filter-option="filterCangKuOption"
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px;text-align: center;"
                    :options="dataMap['warehouse']"
                    v-model:value="queryModel.variable.cwhcode"
                  >
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cwhcode')"/>
                </div>
                <div style="width: 50%;float: left;">
                  <span class="right_span">存货分类：</span>
                  <a-select
                    show-search
                    :filter-option="filterStockClassOption"
                    :allowClear="true"
                    show-searchplaceholder=""
                    style="width: 180px;text-align: center;"
                    :options="dataMap['whClass']"
                    @change="queryModel.variable.cinvode = ''"
                    v-model:value="queryModel.variable.cinvodeClass"
                  >
                    <template #suffixIcon><CaretDownOutlined style="color:#666666;"/></template>
                  </a-select>
                  <PaperClipOutlined style="color: #0a84ff;margin-left: 5px;cursor: pointer;" @click="openHeadSelectContent('cinvodeClass')"/>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <ClassAllModalPop @throwData="modalData" @register="registerClassAllPage" />
      <SupperModalPop @throwData="modalData" @register="registerModalPopPage"/>
      <DeptModalPop @register="registerSelectDeptPage" @save="modalData"/>
      <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>
      <SelectPsn @register="registerSelectPsnPage" @save="modalData"/>

      <StockInfiModalPop @register="registerStockInfoModalPage" @throwData="modalData"/>
    </div>
    <template #footer>
      <div style="height: 35px">
        <div style="float: right">
          <a-button @click="handleClose" shape="round" style="width: 100px">取消</a-button>
          <a-button @click="handleOk" v-if="!modelLoadIng" type="primary" shape="round"  style="width: 100px">查询</a-button>
        </div>
      </div>
    </template>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {computed, onMounted, reactive, ref, unref, watch} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  Checkbox as ACheckbox,
  DatePicker as ADatePicker,
  Input as AInput,
  message,
  Popconfirm as APopconfirm,
  Radio as ARadio,
  Select as ASelect,
  Tabs ,Cascader
} from "ant-design-vue"
import {FileSearchOutlined, PaperClipOutlined, AppstoreOutlined,PicLeftOutlined,CaretDownOutlined,SearchOutlined} from '@ant-design/icons-vue';
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import moment, {Moment} from 'moment';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStore} from "/@/store/modules/user";
import {hasBlank, pointMessage} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {findParameterValue, modifyParameterValue} from "/@/api/task-api/query-bus-api";
import {ObjTool, StrTool} from "/@/api/task-api/tools/universal-tools";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import dayjs from "dayjs";
import {findStockCaiGouList} from "/@/api/record/stock/stock-caigou";
import ClassAllModalPop from "/@/views/boozsoft/stock/stock_class/popup/classAllModalPop.vue";
import SupperModalPop from "/@/views/boozsoft/global/popup/supplier/modalPop.vue";
import DeptModalPop from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
import StockCangKuModalPop from "/@/views/boozsoft/stock/stock_cangku/popup/stockCangKuModalPop.vue";
import SelectPsn from "/@/views/boozsoft/global/popup/dept/select-psn.vue";
import StockInfiModalPop from "/@/views/boozsoft/stock/stock_info/popup/stockInfoModalPop.vue";
import {findAllProvince} from "/@/api/record/system/zone";
import {periodAllList} from "/@/api/record/group/im-unit";
import SecondaryTitle from "/@/views/boozsoft/stock/stock_piliang/popup/SecondaryTitle.vue";
const {closeCurrent} = useTabs(router);
const emit = defineEmits(['register', 'query'])

const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const ACheckboxGroup = ACheckbox.Group
const TabPane = Tabs.TabPane

const userStore = useUserStore();
const formItems: any = ref({})
let changeBeforeModel: any = {}
// 会计区间
const dateList: any = ref([])
const quarterList: any = ref([])
// 人员
const dataMap: any = ref({})
const defaultTabsKey = ref('1')
// 过滤
const endDate2:any = ref<String>("")
const strDate2:any = ref<String>("")
const endDate = ref<String>("")
const strDate = ref<String>("")
let endDateList: any = ref([])
let strDateList: any = ref([])
let time: any = ref<Moment[]>([]);
// 日期是否可选
let timeselflg: any = ref(true);
// 期间是否可选
let dateselflg: any = ref(false);
const minKm = ref<string>()
const maxKm = ref<string>()

const busDate = useCompanyOperateStoreWidthOut().getLoginDate
const maxPingzhengQj = ref('')
const ifCrossYear = ref('1')

const userId = userStore.getUserInfo.id
//查询条件
// 已授权账套列表
const accAuthList = ref([])

const currentDynamicTenant = ref('')
const {createWarningModal} = useMessage();

const filterStockOption = (input: string, option: any) => {
  return option.stockName.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const filterSupplierOption = (input: string, option: any) => {
  return option.custName.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
const filterGgxhOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
const filterCangKuOption = (input: string, option: any) => {
  return option.ckName.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}
const filterStockClassOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  formItems.value = data.data
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  defaultTabsKey.value = data.data.mark
  setModalProps({minHeight: 400});
})


let count = 0
const companyName=ref('')
const codeChange = async (value) => {
  ++count
  if (count == 2) return false; // 防止重复打开
  // 赋值默认参数
  dbQueryJson.accountId = value.accId;
  companyName.value = value.companyName;
  defaultModel.constant.tenantId = value.accountMode
  modelLoadIng.value = true
  let dbQueryData = await findParameterValue(dbQueryJson)
  if (null != dbQueryData) { // 存在
    dbQueryJson.id = dbQueryData.id
    dbQueryJson.queryConditions = dbQueryData.queryConditions
    dbQueryJson.filterConditions = dbQueryData.filterConditions

    if (!hasBlank(dbQueryData.queryConditions)) {
      let queryMap = JSON.parse(dbQueryData.queryConditions)
      queryModel.constant = queryMap.constant
      queryModel.variable = queryMap.variable
    }
  } else {
    // 清除条件
    queryModel.constant = defaultModel.constant
    queryModel.variable = defaultModel.variable
    dbQueryJson.id = null
  }
  // 初始化基础参数
  queryModel.constant.tenantId = value.accountMode
  currentDynamicTenant.value = value.accountMode
  await reLifeQueryParameter(currentDynamicTenant.value,value.target.id)
  await reLifeEtcList(currentDynamicTenant.value)
  modelLoadIng.value = false
}

const reLifeQueryParameter = async (dynamicTenant,id) => {
  // 加载DB所有会计期间与季报数据
  dateList.value = await periodAllList({id: id});
  if (dateList.value.length > 0) {
    const busDates = busDate.split('-');
    // 查看当前业务日期与期间列表年度是否匹配
    let blist = dateList.value.filter(it => it.stockYear == busDates[0])
    if (blist.length > 0) { // 存在与业务日期相匹配的年度 使用业务期间 反之使用最大年度期间
      let busQj = blist.filter(it => it.stockMonth == (busDates[1]))[0]
      maxPingzhengQj.value = (busQj.stockYear+'-'+busQj.stockMonth)
      strDate.value = (busQj.stockYear+'-'+busQj.stockMonth)
      endDate.value = (busQj.stockYear+'-'+busQj.stockMonth)
    } else {
      // 获取最大凭证期间
      const qijian = ''
      if (hasBlank(qijian)) {
        maxPingzhengQj.value = ''
        strDate.value = dateList.value[0].value
        endDate.value = dateList.value[dateList.value.length - 1].value
      } else {
        maxPingzhengQj.value = qijian.substring(0, 4) + '-' + qijian.substring(4, 6)
        strDate.value = maxPingzhengQj.value
        endDate.value = maxPingzhengQj.value
      }
    }
  } else {
    await pointMessage({title: '温馨提示', content: '请先进行账套年度授权后再进行查询操作！', delay: true})
    strDate.value = ''
    endDate.value = ''
  }
}


async function reLifeEtcList(dynamicTenant) {
  let q = ['user', 'cust', 'dept', 'operator', 'warehouse', 'stock', 'whClass','custClass','zone']
  dataMap.value = (await useRouteApi(findStockCaiGouList, {schemaName: currentDynamicTenant})([...new Set(q)].join(',')))
  dataMap.value['zone'] = (await findAllProvince())
}

const oldStrYear = ref('')

async function handleChangeStrDate() {
  endDate.value = strDate.value

  return false;
  if (strDate.value === undefined) {
    endDate.value = '';
    timeselflg.value = false;
  }
  // 开始日期变动  如果开始日期大于结束于日期 则重置结束日期
  if (endDate.value) {
    if (strDate.value > endDate.value) {
      endDate.value = '';
    }
    timeselflg.value = true;
  }
}

function timechange() {
  dateselflg.value = time.value.length > 0;
}

async function handleChangeEndDate() {
  if (endDate.value === undefined) {
    strDate.value = '';
    timeselflg.value = false;
  }
  // 开始日期变动  如果结束日期小于开始日期 则重置开始日期
  if (strDate.value) {
    if (strDate.value > endDate.value) {
      strDate.value = '';
    }
    /*  // 会计科目
      await reLifeKmList(currentDynamicTenant.value)
      timeselflg.value = true;*/
  }
}

async function focusStrDate() {
  /*if (endDate.value) {
    strDateList.value = dateList.value.filter(o => o.value <= endDate.value)
  } else {
    strDateList.value = dateList.value
  }*/
  strDateList.value = dateList.value
}

async function focusEndDate() {
  if (strDate.value) {
    endDateList.value = dateList.value.filter(o => o.stockYear+''+o.stockMonth >= strDate.value)
  } else {
    endDateList.value = dateList.value
  }
}

const confirm = () => {

}
const cancel = () => {

}
/*********Mr·Ye*********/
const modelLoadIng = ref(false)

const defaultModel = {
  constant: {
    tenantId: '',
    queryType: '1',
  },
  variable: {
    periodStart: '',
    periodEnd: '',
    dateStart: '',
    dateEnd: '',
    ccodeMin: '',
    ccodeMax: '',
    cvencode: '',
    cvencodeJs: '',
    cinvode: '',
    cinvodeClass: '',
    cwhcode: '',
    cpersoncode: '',
    cdepcode: '',
    wuliuUser: '',
    region: '',
    bcheck: '',
    stockGgxh: '',
  }
}

const queryModel:any = reactive({constant: {}, variable: {}})

const openOrClose = (visible: boolean) => {
  // 初始化选中
}
/*********Mr·Ye*********/
let isChanged: boolean = false

async function handleOk() {
  if (dateList.value.length === 0) {
    message.error('请先初始化会计期间后再进行查询!');
    return
  }
  if(radiovalue.value=='2'&&(hasBlank(strDate2.value)||hasBlank(endDate2.value))){
    return message.error('请选择会计区间or日期期间!');
  }
  let startQj = strDate.value || ''
  let endQj = endDate.value || ''
  if ((startQj == '' && endQj == '')&&(hasBlank(strDate2.value)||hasBlank(endDate2.value))) {
    message.error('请选择会计区间or日期期间!');
    return
  }
  if ((startQj != '' && endQj == '') || (startQj == '' && endQj != '')) {
    message.error('请完善会计区间');
    return
  } else if (ifCrossYear.value != '2' && (startQj != '' && endQj != '' && (startQj.substring(0, 4) != endQj.substring(0, 4)))) {
    message.error('暂不支持跨越年度会计区间查询');
    return
  }

  let strTimeView=radiovalue.value=='1'?strDate.value:timeformat(strDate2.value)
  let endTimeView=radiovalue.value=='1'?endDate.value:timeformat(endDate2.value)
  let strTime=radiovalue.value=='1'?strDate.value+'-01':timeformat(strDate2.value)
  let endTime=radiovalue.value=='1'?endDate.value+'-31':timeformat(endDate2.value)

  queryModel.variable.strTimeView = strTimeView
  queryModel.variable.endTimeView = endTimeView
  queryModel.variable.strTime = strTime
  queryModel.variable.endTime = endTime
  modelLoadIng.value = false
  queryModel.constant.queryType = defaultTabsKey.value
  queryModel.constant.companyName = companyName.value

  let cinvode=dataMap.value['stock'].filter(a=>a.id==queryModel.variable.cinvode)[0]?.stockNum
  queryModel.variable.cinvode2=hasBlank(cinvode)?'':cinvode
  queryModel.variable.radiovalue=radiovalue.value
  queryModel.variable.searchInput=''
  queryModel.variable.searchVal=''
  emit('query', {data: unref(queryModel),map: dataMap.value})
  closeModal()
  return true
}


async function handleClose() {
  if (null != formItems.value.openOne && formItems.value.openOne == 1)
    await closeCurrent()
  closeModal()
}

// 查询

let radiovalue = ref('1');

function radiochange(val) {
  timeselflg.value = val.target.value === '1';
  dateselflg.value = val.target.value === '2';
  if (val.target.value === '1') {
    strDate2.value = ''
    endDate2.value = ''
    strDate.value = maxPingzhengQj.value;
    endDate.value = maxPingzhengQj.value;
  } else {
    strDate.value = '';
    endDate.value = '';
  }
}


const dbQueryJson = reactive({ // 后台数据模型
  id: null,
  accountId: '',
  owningMenuName: '采购排行榜',
  owningPlan: '1',
  planPerson: userId,
  filterConditions: '',
  queryConditions: ''
})

/**
 * 针对与凭证查询条件是否改变
 */
const modelNoChange = () => {
  let constant = queryModel.constant
  if (!hasBlank(dbQueryJson.queryConditions)) {
    let map = JSON.parse(dbQueryJson.queryConditions)
    let variableJSON = JSON.stringify(ObjTool.dels(queryModel.variable, []))
    let s = StrTool
    let flag = s.eq(constant.companyCode, map.constant.companyCode) && s.eq(constant.currency, map.constant.currency) && s.eq(constant.tenantId, map.constant.tenantId)
      && s.eq(variableJSON, JSON.stringify(map.variable))
    return flag;
  }
  return false;
}
/*辅助核算过滤框*/

function datePickerChange(){
  if(!hasBlank(strDate2.value)&&!hasBlank(endDate2.value)){
    let strYear=timeformat(strDate2.value).split('-')[0]
    let endYear=timeformat(endDate2.value).split('-')[0]
    if(parseInt(strYear)!==parseInt(endYear)){
      strDate2.value=null;endDate2.value=null
      return message.error('不允许跨年！')
    }
  }
}
const checkChange = (e) => {
  let v = e.target.value
  let dates = [strDate.value.substring(0,4),strDate.value.substring(5,7)]
  switch (v) {
    case '1':
      let the = parseInt(dates[1])
      if (the != 1) {
        strDate.value = dates[0] +'-'+ (((the - 1) > 9) ? `${(the - 1)}` : `0${(the - 1)}`)
        console.log(strDate.value)
        endDate.value = strDate.value
      } else {
        message.info('暂无上月！')
      }
      break
    case '2':
      strDate.value = dates[0] + '-' + busDate.split('-')[1]
      endDate.value = strDate.value
      break
    case '3':
      let qList = quarterList.value.filter(it => it.iyear == dates[0])
      if (qList.length > 0) { // 存在季报
        let arr = qList.filter(it => {
          let min = moment(it.iyear + '-' + it.dateStart, 'YYYY-MM-DD')
          let max = moment(it.iyear + '-' + it.dateEnd, 'YYYY-MM-DD')
          let the = moment(strDate.value + '-01', 'YYYY-MM-DD')
          return min <= the && the <= max
        })
        strDate.value = arr[0].iyear + '-' + arr[0].dateStart.substring(0, 2)
        endDate.value = arr[0].iyear + '-' + arr[0].dateEnd.substring(0, 2)
      } else {
        let min = '01'
        let max = '03'
        let v = dates[1]
        switch (v) {
          case '04':case '05':case '06':
            min = '04'
            max = '06'
            break
          case '07' :case '08' :case '09':
            min = '07'
            max = '09'
            break
          case '10' :case '11' :case '12':
            min = '10'
            max = '12'
            break
        }
        strDate.value = dates[0] +'-'+  min
        endDate.value = dates[0] +'-'+  max
      }
      break
    case '4':
      let list = dateList.value.filter(it => it.stockYear == dates[0])
      strDate.value = dates[0]+'-'+list[0].stockMonth
      endDate.value = dates[0]+'-'+list[list.length - 1].stockMonth
      break
    case '5':
      strDate2.value=dayjs(busDate, 'YYYY-MM-DD')
      endDate2.value=dayjs(busDate, 'YYYY-MM-DD')
      break
    case '6':
      let yday = dayjs(busDate, 'YYYY-MM-DD').add(-1, 'day')
      strDate2.value=yday
      endDate2.value=yday
      break
    case '7':
      let yday1 = dayjs(busDate, 'YYYY-MM-DD').add(-2, 'day')
      strDate2.value=yday1
      endDate2.value=yday1
      break
    case '8':
      let yday2 = dayjs(busDate, 'YYYY-MM-DD').endOf('month')
      strDate2.value=yday2
      endDate2.value=yday2
      break
  }
}
const thisEditType = ref('')
const [registerModalPopPage, {openModal: openMoalPopPage}] = useModal();
const [registerSelectDeptPage, {openModal: openSelectDeptPage}] = useModal()
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
const [registerSelectPsnPage, {openModal: openSelectPsnPage}] = useModal()
const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const [registerClassAllPage, { openModal: openClassAllPage }] = useModal();
const openHeadSelectContent = (type) => {
  thisEditType.value = type
  switch (type) {
    case 'cvencode':
    case 'cvencodeJs':
      openMoalPopPage(true, {
        database: currentDynamicTenant.value,
        accId: dbQueryJson.accountId,
      });
      break;
    case 'cdepcode':
      openSelectDeptPage(true, {
        currentDynamicTenant: currentDynamicTenant.value
      })
      break;
    case 'cwhcode':
      openStockCangKuModalPage(true, {
        database: currentDynamicTenant.value,
      })
      break;
    case 'cpersoncode':
    case 'wuliuUser':
      openSelectPsnPage(true, {
        currentDynamicTenant: currentDynamicTenant.value
      })
      break;
    case 'cinvode':
      openStockInfoModalPage(true, {
        database:currentDynamicTenant.value
      });
      break;
    case 'cinvodeClass':
      openClassAllPage(true, {
        database:currentDynamicTenant.value
      });
      break;
  }
}
const modalData = (o) => {
  queryModel.variable[thisEditType.value] = thisEditType.value == 'cvencode' || thisEditType.value == 'cvencodeJs' || thisEditType.value == 'cwhcode' ? o[0].id : thisEditType.value == 'cdepcode' ? o.uniqueCode : o.id
  if (thisEditType.value == 'cvencode'){
    xscustChange(true)
  }else if (thisEditType.value == 'cvencodeJs'){
    xscustChange(false)
  }
}
const xscustChange = (b) => {
  if (b){
    queryModel.variable.cvencodeJs = ''
  }else {
    queryModel.variable.cvencode = ''
  }
}
function zoneChange(a,b) {
  queryModel.variable.region = a.join()
}
// 日期格式化
function timeformat(dateData) {
  let date = new Date(dateData);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  let d = date.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
</script>
<style lang="less" scoped>
@import '/@/assets/styles/redTitle-open.less';
:deep(.ant-select-selection-item){
  font-weight: bold;
}
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;
  text-align: left;

  .open-content-title {
    > div {
      display: inline-block;
    }

    > div:nth-of-type(1) {
      width: 200px;
      background-color: #efeeee;
      color: black;
      font-size: 20px;
      text-align: center;
      padding: 5px 10px
    }
  }

  .open-content-up {
    position: relative;
    top: 15px;

    .ocup-position {
      position: absolute;
      left: 0;
      width: 170px;
      background-color: #65cbec;
      color: white;
      font-size: 16px;
      text-align: left;
      padding: 5px 10px;
    }

    .ocup-position:nth-of-type(1) {
      top: 0px;
    }

    .ocup-position:nth-of-type(2) {
      top: 190px;
    }

    ul {
      padding: 10px;

      li {
        margin: 10px 0;

        //span {
        //  font-size: 14px;
        //  color: #5a5a5a;
        //}

        .right_span{
          display: inline-block;
          width: 90px !important;
          color: #5a5a5a;
          font-weight: bold;
        }

        .ant-select {
          font-size: 14px;
        }
      }


    }
  }

  .open-content-foot {
    display: block;
    position: fixed;
    margin-top: 43px;
  }

  .ant-tabs-tabpane-active {
    overflow-y: auto;
    height: 400px;
  }

  .ant-select-selection-search-input {
    border-bottom: none !important;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-input) {
    background: none !important;
  }

  :deep(.ant-select-selector), :deep(.ant-input-affix-wrapper) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    background: none;
  }

  label:not(.ant-radio-button-wrapper) {
    text-align: right;
    width: 110px;
    display: inline-block;
    padding: 5px 10px;
  }

  .ant-radio-group {
    .ant-radio-wrapper {
      width: 70px;

      .ant-radio-input {
        border-color: slategrey;
      }
    }

    p:nth-of-type(2) {
      margin-bottom: 0;
    }
  }

  :deep(.ant-picker-range) {
    background: none;
    border: none;
    border-bottom: 1px solid #bdb9b9;

    input {
      text-align: center;
    }
  }

  .special-border-div {
    position: relative;
    border: 1px #acabab solid;
    margin: 20px 0;
    text-align: left;

    .spanclass{
      font-weight: bold;
      color: #5a5a5a;
    }
    > span {
      position: absolute;
      top: -12px;
      left: 50px;
      font-size: 12px;
      background: white;
      padding: 0 15px;
      font-weight: bold;
    }

    > div {
      margin: 15px;
      color: black;
      display: flex;

      .sbd-left {
        width: 60%;

        .ant-radio-group {
          .ant-radio-wrapper {
            width: 11% !important;
            text-align: left;

            .ant-radio-input {
              border-color: slategrey;
            }
          }
        }
      }

      .sbd-right {
        width: 40%;
        padding: 2% 5% 0;

        > div:nth-of-type(2) {
          margin-top: 14px;
        }

        .ant-radio-button-wrapper {
          color: #0096c7;
        }
      }

    }
  }
}

:deep(.ant-tabs-left-bar) {
  margin-right: 0px !important;
}

:deep(.ant-tabs-left) {
  .ant-tabs-tab {
    width: 170px;
    font-weight: bold;
    display: inline-block;
  }

  .ant-tabs-tab-active {
    color: #65cbec !important;
    .ant-tabs-tab-btn:after{
      content: '√';
      margin-left: 5px;
    }
  }

  .ant-tabs-tabpane-active {
    padding-left: 0 !important;
  }

  .ant-tabs-tab:nth-of-type(1) {
    margin-top: 35px;
  }

  /*  .ant-tabs-tab:nth-of-type(3) {
      margin-top: 110px !important;
    }*/
}
:deep(.ant-cascader-input){
  border: none;
  border-bottom: 1px solid #bdb9b9;
}
</style>
