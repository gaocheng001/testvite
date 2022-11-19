<template>
  <BasicModal
    width="850px"
    class="spaceLogo"
    v-bind="$attrs"
    title="凭证批量打印"
    @ok="handleOk()"
    @cancel="handleClose()"
    :loading="modelLoadIng"
    :canFullscreen="false"
    @visible-change="openOrClose"
    @register="register"
  >
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-up">
        <div class="ocup-position">
          系统方案
        </div>
        <a-tabs type="card" v-model:activeKey="defaultTabsKey" @change="tabsChange"
                tabPosition="left">
          <a-tab-pane key="1" tab="标准模式">
            <ul>
              <li>
                <AccountPicker theme="one" @reloadTable="codeChange" />
              </li>
              <li>
                <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                  <p>
                    <span>期间：</span>
                    <a-radio :value="1">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-select
                      v-model:value="strDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 210px;"
                      @focus="focusStrDate"
                      @change="handleChangeStrDate"
                    >
                      <a-select-option
                        v-for="item in strDateList"
                        :key="item.id"
                        :value="item.value"
                      >
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                    <span>&emsp;~&emsp;</span>
                    <a-select
                      v-model:value="endDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 210px"
                      @focus="focusEndDate"
                      @change="handleChangeEndDate"
                    >
                      <a-select-option
                        v-for="item in endDateList"
                        :key="item.id"
                        :value="item.value"
                      >
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                  </p>
                  <p>
                    <span>日期：</span>
                    <a-radio :value="2">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-range-picker
                      v-model:value="riqi"
                      style="width: 456px;    "
                      :disabled="timeselflg"
                      @change="timechange"
                    />
                  </p>
                </a-radio-group>
              </li>
              <li><span>凭证编号：</span>
                <a-input v-model:value="modelList['1'].variable.voucherNumberStart"
                         :allowClear="true" placeholder="" style="width: 210px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['1'].variable.voucherNumberEnd" :allowClear="true"
                         placeholder="" style="width: 210px"/>
              </li>
              <li><span class="right_span">凭证状态：</span>
                <a-select
                  :allowClear="true"
                  v-model:value="modelList['1'].variable.reviewStatus"
                  placeholder="全部/正常/作废/错误"
                  style="width: 210px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">作废</a-select-option>
                  <a-select-option value="2">暂存</a-select-option>
                  <a-select-option value="3">错误</a-select-option>
                  <a-select-option value="5">冲销</a-select-option>
                </a-select>
                &emsp;&emsp;<span class="right_span">凭证类别：</span>
                <a-select
                  v-model:value="modelList['1'].variable.voucherType"
                  placeholder=""
                  style="width: 94px"
                  :allowClear="true">
                  <a-select-option v-for="(item,index) in typesList" :key="index"
                                   :value="item.voucherTypeCode">{{ item.voucherTypeCode }}
                  </a-select-option>
                </a-select>
              </li>
              <li>
                <div class="special-border-div">
                  <span>纸张类型</span>
                  <div>
                    <a-radio-group v-model:value="modelList['1'].variable.rodioValue" style="width: 100%">
                      <a-radio :value="1">A4横版29.7*21CM</a-radio>
                      <a-radio :value="2">A4两版(偏上)</a-radio>
                      <a-radio :value="3">A4两版(居中)</a-radio>
                      <a-radio :value="4">发票版29.7*21CM</a-radio>
                      <a-radio :value="5">发票版-外币版29.7*21CM</a-radio>
                    </a-radio-group>
                  </div>
                </div>
              </li>
              <li>
                <a-checkbox v-model:checked="modelList['1'].variable.printForeign" style="width: 166px;font-weight: bold">摘要打印外币币种</a-checkbox>
              </li>
            </ul>
          </a-tab-pane>
          <a-tab-pane key="3" tab="套打模式">
            <ul>
              <li>
                <AccountPicker theme="one" @reloadTable="codeChange" />
              </li>
              <li>
                <a-radio-group style="width: 100%" v-model:value="radiovalue" @change="radiochange">
                  <p>
                    <span>期间：</span>
                    <a-radio :value="1">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-select
                      v-model:value="strDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 210px;"
                      @focus="focusStrDate"
                      @change="handleChangeStrDate"
                    >
                      <a-select-option
                        v-for="item in strDateList"
                        :key="item.id"
                        :value="item.value"
                      >
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                    <span>&emsp;~&emsp;</span>
                    <a-select
                      v-model:value="endDate"
                      show-search
                      :disabled="dateselflg"
                      style="width: 210px"
                      @focus="focusEndDate"
                      @change="handleChangeEndDate"
                    >
                      <a-select-option
                        v-for="item in endDateList"
                        :key="item.id"
                        :value="item.value"
                      >
                        {{ item.value }}
                      </a-select-option>
                    </a-select>
                  </p>
                  <p>
                    <span>日期：</span>
                    <a-radio :value="2">
                      <span style="color: red;font-size: 18px;">⋆</span>
                    </a-radio>
                    <a-range-picker
                      v-model:value="riqi"
                      style="width: 456px;    "
                      :disabled="timeselflg"
                      @change="timechange"
                    />
                  </p>
                </a-radio-group>
              </li>
              <li><span>凭证编号：</span>
                <a-input v-model:value="modelList['3'].variable.voucherNumberStart"
                         :allowClear="true" placeholder="" style="width: 210px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="modelList['3'].variable.voucherNumberEnd" :allowClear="true"
                         placeholder="" style="width: 210px"/>
              </li>
              <li><span class="right_span">凭证状态：</span>
                <a-select
                  :allowClear="true"
                  v-model:value="modelList['3'].variable.reviewStatus"
                  placeholder="全部/正常/作废/错误"
                  style="width: 210px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">作废</a-select-option>
                  <a-select-option value="2">暂存</a-select-option>
                  <a-select-option value="3">错误</a-select-option>
                  <a-select-option value="5">冲销</a-select-option>
                </a-select>
                &emsp;&emsp;<span class="right_span">凭证类别：</span>
                <a-select
                  v-model:value="modelList['3'].variable.voucherType"
                  placeholder=""
                  style="width: 94px"
                  :allowClear="true">
                  <a-select-option v-for="(item,index) in typesList" :key="index"
                                   :value="item.voucherTypeCode">{{ item.voucherTypeCode }}
                  </a-select-option>
                </a-select>
              </li>
              <li>
                <div class="special-border-div">
                  <span>纸张类型</span>
                  <div>
                    <a-radio-group v-model:value="modelList['3'].variable.rodioValue" style="width: 100%">
                      <a-radio :value="1">KPJ101-21*12.7CM</a-radio>
                      <a-radio :value="2">KPJ103-24*14CM</a-radio>
                      <a-radio :value="3">KPJ102-21*12.7处币式</a-radio>
                      <a-radio :value="4">KPJ106H-全A4模板</a-radio>
                      <a-radio :value="5">KPJ105-A4竖板</a-radio>
                    </a-radio-group>
                  </div>
                </div>
              </li>
              <li>
                <a-checkbox v-model:checked="modelList['3'].variable.printForeign" style="width: 166px;font-weight: bold">摘要打印外币币种</a-checkbox>
              </li>
            </ul>
          </a-tab-pane>
        </a-tabs>
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
  Tabs as ATabs, message,
} from "ant-design-vue"
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import {Moment} from 'moment';
import {
  findPeriodByAccontId,
  findMaxPingZhengQiJian
} from '/@/api/record/generalLedger/data';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {
  currentAccountTypes,
} from "/@/api/record/system/financial-settings";
import {useUserStore} from "/@/store/modules/user";
import {
  hasBlank,
  pointMessage
} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {findParameterValue, modifyParameterValue} from "/@/api/task-api/query-bus-api";
import {ObjTool, StrTool} from "/@/api/task-api/tools/universal-tools";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
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
const formItems: any = ref({})
let changeBeforeModel: any = {}
// 会计区间
const dateList: any = ref([])
// 类别
const typesList: any = ref([])
const endDate = ref<String>("")
const strDate = ref<String>("")
let endDateList: any = ref([])
let strDateList: any = ref([])
let time: any = ref<Moment[]>([]);
// 日期是否可选
let timeselflg: any = ref(true);
// 期间是否可选
let dateselflg: any = ref(false);

const maxPingzhengQj = ref('')

const userId = userStore.getUserInfo.id

onMounted(async () => {
  // 获取所有账套信息 并过滤已授权的账套
});

const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  // 方式2
  formItems.value = data.data
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  setModalProps({minHeight: 400});
})

const reLifeQueryParameter = async (dynamicTenant) => {
  if (hasBlank(dynamicTenant)) return
  // 获取最大凭证区间
  let tenantName = dynamicTenant.split('-')[0] + '-' + dynamicTenant.split('-')[1]
  // 初始化已知自定义辅助核算
  //加载期间数据
  dateList.value = []
  dateList.value = await findPeriodByAccontId(tenantName);
  if (dateList.value.length > 0) {
    const qijian = await useRouteApi(findMaxPingZhengQiJian, {schemaName: dynamicTenant})({}) || '';
    // 初始化默认区间
    if (hasBlank(qijian)) {
      strDate.value = dateList.value[0].value
      endDate.value = dateList.value[dateList.value.length - 1].value
    } else {
      maxPingzhengQj.value = qijian.substring(0, 4) + '-' + qijian.substring(4, 6)
      strDate.value = maxPingzhengQj.value
      endDate.value = maxPingzhengQj.value
    }

      typesList.value = []
      await useRouteApi(currentAccountTypes, {schemaName: dynamicTenant})({
        pageSize: 20,
        pageNumber: 1
      }).then(res => {
        typesList.value = res.items
      })
  } else {
    await pointMessage({title: '温馨提示', content: '请先初始化该公司代码账套会计期间后在进行查询！', delay: true})
    strDate.value = ''
    endDate.value = ''
  }
}
let count = 0
const codeChange = async (value) => {
  ++count
  if (count == 2){ //
    return false;
  }
  let newName = value.accId
  // 查看是否存在 查询参数
  dbQueryJson.accountId = newName;
  let dbQueryData = await findParameterValue(dbQueryJson)
  if (null != dbQueryData) { // 存在
    defaultTabsKey.value = '3'
    dbQueryJson.id = dbQueryData.id
    dbQueryJson.queryConditions = dbQueryData.queryConditions
    if (!hasBlank(dbQueryData.queryConditions)) {
      let queryMap = JSON.parse(dbQueryData.queryConditions)
      modelList["3"].constant = queryMap.constant
      modelList["3"].variable = queryMap.variable
    }
  } else {
    // 清除条件
    modelList[defaultTabsKey.value].constant = defaultModel.constant
    modelList[defaultTabsKey.value].variable = defaultModel.variable
    dbQueryJson.id = null
  }
  modelList[defaultTabsKey.value].constant.tenantId = value.accountMode
  currentDynamicTenant.value = value.accountMode
  reLifeQueryParameter(value.accountMode)
}


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
    endDateList.value = dateList.value.filter(o => o.value >= strDate.value)
  } else {
    endDateList.value = dateList.value
  }
}

const confirm = () => {

}
const cancel = () => {

}
/*********Mr·Ye*********/
const defaultTabsKey = ref('1')
const currentDynamicTenant = ref('')
const whetherGroup = ref(false)
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
    voucherNumberStart: '',
    voucherNumberEnd: '',
    voucherType: '',
    reviewStatus: '',
    printForeign:true,
    rodioValue: 1
  }
}
const modelList = reactive({
  '1': {
    constant: {
      tenantId: '',
      queryType: '1',
    },
    variable: {
      periodStart: '',
      periodEnd: '',
      dateStart: '',
      dateEnd: '',
      voucherNumberStart: '',
      voucherNumberEnd: '',
      voucherType: '',
      reviewStatus: '',
      printForeign:true,
      rodioValue: 1
    }
  },
  '2': {
  },
  '3': {
    constant: {
      tenantId: '',
      queryType: '2',
    },
    variable: {
      periodStart: '',
      periodEnd: '',
      dateStart: '',
      dateEnd: '',
      voucherNumberStart: '',
      voucherNumberEnd: '',
      voucherType: '',
      reviewStatus: '',
      printForeign:true,
      rodioValue: 1
    }
  },
  '4': {}
})

const openOrClose = (visible: boolean) => {
  // 初始化选中
  if (visible && null != formItems.value.openOne && Object.keys(modelList['3']).length != 0) {
    //默认赋值
    defaultTabsKey.value = '3'
  }
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
  if ((value == '1' || value == '3' ) && modelList[defaultTabsKey.value].constant.companyCode == '') modelList[defaultTabsKey.value].constant.companyCode = defaultModel.constant.companyCode
}

/*********Mr·Ye*********/
let isChanged: boolean = false

async function handleOk() {
  modelLoadIng.value = false
  if (hasBlank(currentDynamicTenant.value)) {
    message.error('请先获取账套查询权限!');
    return
  } else if (modelList[defaultTabsKey.value].constant.queryType == '1' && hasBlank(modelList[defaultTabsKey.value].constant.companyCode)) {
    message.error('请选择公司代码!');
    return
  }else if (dateList.value.length === 0) {
    message.error('请先初始化会计期间后再进行查询!');
    return
  }
  let startQj = strDate.value || ''
  let endQj = endDate.value || ''
  let startRq = null == riqi.value[0] ? '' : riqi.value[0].format('YYYY-MM-DD')
  let endRq = null == riqi.value[1] ? '' : riqi.value[1].format('YYYY-MM-DD')
  if ((startQj == '' && endQj == '') && riqi.value.length === 0) {
    message.error('请选择会计区间or日期期间!');
    return
  }
  if ((startQj != '' && endQj == '') || (startQj == '' && endQj != '')) {
    message.error('请完善会计区间');
    return
  } else if ((startQj != '' && endQj != '' && (startQj.substring(0, 4) != endQj.substring(0, 4)))) {
    message.error('暂不支持跨越年度会计区间查询');
    return
  } else if ((startRq != '' && endRq != '' && (startRq.substring(0, 4) != endRq.substring(0, 4)))) {
    message.error('暂不支持跨越年度日期区间查询');
    return
  }
  let pingS = modelList[defaultTabsKey.value].variable.voucherNumberStart
  let pingE = modelList[defaultTabsKey.value].variable.voucherNumberEnd
  if (pingS != '' || pingS != '') {
    if (pingS == '' || pingE == '') {
      message.error('请完善凭证编号区间条件!');
      return
    } else if (Number(pingE) < Number(pingS)) {
      message.error('凭证编号区间条件必须自小到大!');
      return
    }
  }
  let min = modelList[defaultTabsKey.value].variable.amountMin
  let max = modelList[defaultTabsKey.value].variable.amountMax
  if ((min != '' && max == '') || max != '' && min == '') {
    message.error('请完善本币金额区间条件!');
    return
  } else if (parseFloat(min) > parseFloat(max)) {
    message.error('本币金额区间条件必须自小到大!');
    return
  }
  let nMin = modelList[defaultTabsKey.value].variable.numberMin
  let nMax = modelList[defaultTabsKey.value].variable.numberMax
  if ((nMin != '' && nMax == '') || nMax != '' && nMin == '') {
    message.error('请完善数量区间条件!');
    return
  } else if (parseFloat(nMin) > parseFloat(nMax)) {
    message.error('数量条件必须自小到大!');
    return
  }

  let wbMin = modelList[defaultTabsKey.value].variable.wbAmountMin
  let wbMax = modelList[defaultTabsKey.value].variable.wbAmountMax
  if ((wbMin != '' && wbMax == '') || wbMax != '' && wbMin == '') {
    message.error('请完善外币金额区间条件!');
    return
  } else if (parseFloat(wbMin) > parseFloat(wbMax)) {
    message.error('外币金额区间条件必须自小到大!');
    return
  }

  modelList[defaultTabsKey.value].variable.periodStart = startQj
  modelList[defaultTabsKey.value].variable.periodEnd = endQj
  modelList[defaultTabsKey.value].variable.dateStart = startRq
  modelList[defaultTabsKey.value].variable.dateEnd = endRq
  // 存入自定义
  if (defaultTabsKey.value == '1' || defaultTabsKey.value == '3') {
    if ((!hasBlank(dbQueryJson.id)) && modelNoChange('1')) { // 存在个人时不同步

    } else {
      modelList['3'] = modelList[defaultTabsKey.value]
      // 更新个人
      modifyDbPersonData(modelList['3']);
    }
  }
  modelLoadIng.value = true
  // emit('save', unref(modelList[defaultTabsKey.value]))
  closeModal()
  return true
}

async function handleClose() {
  closeModal()
}

// 查询

let radiovalue = ref(1);
const riqi: any = ref([]);

function radiochange(val) {
  timeselflg.value = val.target.value === 1;
  dateselflg.value = val.target.value === 2;
  if (val.target.value === 1) {
    riqi.value = '';
    strDate.value = maxPingzhengQj.value;
    endDate.value = maxPingzhengQj.value;
  } else {
    strDate.value = '';
    endDate.value = '';
  }
}
const dbQueryJson = reactive({ // 后台数据模型
  id: null,
  accountId: currentDynamicTenant.value,
  owningMenuName: '凭证列表-批量打印',
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
  dbQueryJson.queryConditions = JSON.stringify(json);
  modifyParameterValue(dbQueryJson).then(() => {
    message.success('查询参数后台同步成功！')
  }).catch(() => {
    message.warn('查询参数后台同步失败！')
  });
}

/**
 * 针对与凭证查询条件是否改变
 */
const modelNoChange = () => {
  let constant = modelList[defaultTabsKey.value].constant
  if (!hasBlank(dbQueryJson.queryConditions)) {
    let map = JSON.parse(dbQueryJson.queryConditions)
    let variableJSON = JSON.stringify(ObjTool.dels(modelList[defaultTabsKey.value].variable, []))
    let s = StrTool
    let flag =  (s.eq(constant.companyCode, map.constant.companyCode))
    flag = flag && s.eq(constant.currency, map.constant.currency && s.eq(constant.tenantId, map.constant.tenantId)
      && s.eq(variableJSON, JSON.stringify(map.variable)))
    return flag;
  }
  return false;
}
/*辅助核算过滤框*/
const assistModify = (data) => {
  // 判断是赋值还是取消
  if (data.inputMap.titles.length === 0){
    modelList[defaultTabsKey.value].variable.accounting[data.assistType] = ''
    modelList[defaultTabsKey.value].variable.assists[data.assistType] = []
  }else {
    modelList[defaultTabsKey.value].variable.accounting[data.assistType] = data.inputMap.titles
    modelList[defaultTabsKey.value].variable.assists[data.assistType] = data.inputMap.values
  }
}

const getAssistNameByKey = (key,list) => {
  let arr = list.filter(item=>key == item.key)
  return arr.length>0?arr[0].title:'未知'
}

</script>
<style src="../../../../../assets/styles/part-open.less" lang="less" scoped="scoped"></style>
<style lang="less" scoped>
.nc-open-content {
  position: relative;

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

    .ocup-position {
      position: absolute;
      left: 0;
      width: 170px;
      background-color: #0096c7;
      color: white;
      font-size: 16px;
      text-align: center;
      padding: 5px 10px;
    }
    .ocup-position:nth-of-type(1) {
      top: 0px;
    }
    .ocup-position:nth-of-type(2) {
      top: 190px;
    }

    ul {
      padding: 10px 30px;

      li {
        margin: 10px 0;

        span {
          font-size: 14px;
          color: #747272;
        }

        > span:nth-of-type(1), .right_span {
          display: inline-block;
          width: 120px;
        }

        .ant-select {
          font-size: 14px;
        }
        .special-border-div {
          position: relative;
          border: 1px #acabab solid;
          margin: 20px 1%;

          > span {
            position: absolute;
            top: -12px;
            left: 50px;
            font-size: 15px;
            background: white;
            padding: 0 15px;
          }

          > div {
            margin: 15px;
            color: black;
            .ant-radio-group {
              .ant-radio-wrapper {
                width: 30%!important;
                text-align: left;
                .ant-radio-input{
                  border-color: slategrey;
                }
              }
            }
          }
        }
      }
    }
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

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label {
    text-align: right;
    width: 110px;
    display: inline-block;
    padding: 5px 10px;
  }
  .ant-radio-group {
    .ant-radio-wrapper {
      width: 70px;
      .ant-radio-input{
        border-color: slategrey;
      }
    }
    p:nth-of-type(2){
      margin-bottom: 0;
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
  }
  .ant-tabs-tab-active {
    background-color: #65cbec !important;
    color: rgba(0, 0, 0, 0.85) !important;
  }

  .ant-tabs-tabpane-active {
    padding-left: 0 !important;
  }

  .ant-tabs-tab:nth-of-type(1) {
    margin-top: 35px;
    margin-bottom: 0!important;
  }
}
</style>
