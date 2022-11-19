<template>
  <BasicModal
    width="920px"
    class="spaceLogo"
    v-bind="$attrs"
    title=""
    @ok="handleOk()"
    @cancel="handleClose()"
    :loading="modelLoadIng"
    :showOkBtn="!modelLoadIng"
    :canFullscreen="false"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <PrinterOutlined style="font-size: 50px;color: #0096c7;"/>
        <span style="line-height:50px;font-size: 30px;color: #0096c7;">&ensp;凭证打印</span>
      </div>
    </template>
    <div class="nc-open-content" style="height: 100%">
      <div class="open-content-up">
        <div class="ocup-position">
          系统方案
        </div>
        <a-tabs type="card" v-model:activeKey="defaultTabsKey" @change="tabsChange"
                tabPosition="left">
          <a-tab-pane key="1" tab="普通纸张">
            <ul>
              <li>打印方式
                <a-radio-group style="width: 80%"
                               v-model:value="modelList['1'].variable.printingMethod">
                  <a-radio :value="1" style="width: 150px;font-weight: bold;font-size: 18px;">
                    <span style="color: black;font-size: 16px;">选中凭证打印</span>
                  </a-radio>
                  <a-radio :value="2" style="width: 150px;font-weight: bold;">
                    <span style="color: black;font-size: 16px;">所有凭证打印</span>
                  </a-radio>
                </a-radio-group>
                <br/>
                <br/>
              </li>
              <li>
                <div class="special-border-div">
                  <span>纸张类型</span>
                  <div>
                    <a-radio-group v-model:value="modelList['1'].variable.rodioValue"
                                   style="width: 100%">
                      <a-radio :value="1">A4横版29.7*21CM</a-radio>
                      <a-radio :value="2">A4两版(偏上)</a-radio>
                      <a-radio :value="3">A4两版(居中)</a-radio>
                      <a-radio :value="7">A4宽21*12CM</a-radio>
                      <a-radio :value="8">A4宽21*14CM</a-radio>
                      <a-radio :value="4">发票版29.7*21CM</a-radio>
                      <a-radio :value="5">发票版-外币版29.7*21CM</a-radio>
                      <a-radio :value="6">发票版-数量版29.7*21CM</a-radio>
                    </a-radio-group>
                  </div>
                </div>
              </li>
              <li v-if="modelList['1'].variable.rodioValue != 1"><span
                style="font-weight: bold;width: 150px;display: inline-block;">凭证分录打印行数：</span>
                <a-select v-model:value="modelList['1'].variable.rowNumber">
                  <a-select-option :value="5"> 5</a-select-option>
                  <a-select-option :value="6"> 6</a-select-option>
                  <a-select-option :value="7"> 7</a-select-option>
                  <a-select-option :value="8"> 8</a-select-option>
                </a-select>
              </li>
              <li>
                <a-checkbox v-if="modelList['1'].variable.rodioValue <= 3" v-model:checked="modelList['1'].variable.printForeign"
                            style="width: 200px;font-weight: bold">摘要栏中打印外币/数量
                </a-checkbox>
                <a-checkbox v-model:checked="modelList['1'].variable.printInvalid"
                            style="width: 180px;font-weight: bold">打印作废凭证
                </a-checkbox>
              </li>
            </ul>
          </a-tab-pane>
          <a-tab-pane key="3" tab="专业套打">
            <ul>
              <li>
                <span>期间：</span>
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
                  style="width: 210px;text-align-last: center">
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
              <li style="margin-top: 5%;">
                <div class="special-border-div">
                  <span>纸张类型</span>
                  <div>
                    <a-radio-group v-model:value="modelList['3'].variable.rodioValue"
                                   style="width: 100%">
                      <a-radio :value="1">A4横版29.7*21CM</a-radio>
                      <a-radio :value="2">A4两版(偏上)</a-radio>
                      <a-radio :value="3">A4两版(居中)</a-radio>
                      <a-radio :value="7">A4宽21*12CM</a-radio>
                      <a-radio :value="8">A4宽21*14CM</a-radio>
                      <a-radio :value="4">发票版29.7*21CM</a-radio>
                      <a-radio :value="5">发票版-外币版29.7*21CM</a-radio>
                      <a-radio :value="6">发票版-数量版29.7*21CM</a-radio>
                    </a-radio-group>
                  </div>
                </div>
              </li>
              <li>
                <a-checkbox v-model:checked="modelList['3'].variable.printForeign"
                            style="width: 200px;font-weight: bold">摘要栏中打印外币/数量
                </a-checkbox>
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

import {PrinterOutlined} from '@ant-design/icons-vue';
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import {Moment} from 'moment';
import {
  findPeriodByAccontId,
  findMaxPingZhengQiJian, findMaxPingZhengQiJianMonth
} from '/@/api/record/generalLedger/data';
import {
  currentAccountTypes,
} from "/@/api/record/system/financial-settings";
import {useUserStore} from "/@/store/modules/user";
import {
  hasBlank,
  pointMessage
} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {JsonTool, ObjTool, StrTool} from "/@/api/task-api/tools/universal-tools";

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

const dataTable = ref([])
const theTenantId = ref('')
const theTenantYear = ref('')
const theSelectObjs = ref('')
const theUnitName = ref('')
const [register, {closeModal, setModalProps}] = useModalInner((data) => {
  defaultTabsKey.value = data.type == '1' ? '1' : '3'
  theTenantId.value = data.schemaName
  theTenantYear.value = data.year
  theSelectObjs.value = data.data
  theUnitName.value = data.unitName
  if (defaultTabsKey.value == '3') tabsChange(data.schemaName)
  setModalProps({minHeight: 400});
})

const reLifeQueryParameter = async (dynamicTenant) => {
  if (hasBlank(dynamicTenant)) return
  // 获取最大凭证区间
  let tenantName = dynamicTenant.split('-')[0] + '-' + dynamicTenant.split('-')[1]
  //加载期间数据
  dateList.value = []
  dateList.value = await findPeriodByAccontId(tenantName);
  if (dateList.value.length > 0) {
    const qijian = await useRouteApi(findMaxPingZhengQiJianMonth, {schemaName: dynamicTenant})( theTenantYear.value) || '';
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

/*********Mr·Ye*********/
const defaultTabsKey = ref('1')
const modelLoadIng = ref(false)

const defaultModel = {
  constant: {
    tenantId: '',
    queryType: '1',
  },
  variable: {
    periodStart: '',
    periodEnd: '',
    voucherNumberStart: '',
    voucherNumberEnd: '',
    voucherType: '',
    reviewStatus: '',
    rowNumber: 5,
    printForeign: true,
    printInvalid: false,
    rodioValue: 1,
    printingMethod: 1
  }
}
const modelList = reactive({
  '1': {
    constant: {
      queryType: '1',
    },
    variable: {
      printingMethod: 1,
      rowNumber: 5,
      printForeign: true,
      printInvalid: false,
      rodioValue: 1
    }
  },
  '2': {},
  '3': {
    constant: {
      queryType: '2',
    },
    variable: {
      periodStart: '',
      periodEnd: '',
      voucherNumberStart: '',
      voucherNumberEnd: '',
      voucherType: '',
      reviewStatus: '',
      printForeign: true,
      rodioValue: 1
    }
  },
  '4': {}
})

const tabsChange = (value) => {
  if (value == '1') {
    modelList[defaultTabsKey.value] = defaultModel
  } else if (value == '2') {
    modelList[defaultTabsKey.value] = modelList[value]
  } else if (value == '3') {
    modelList[defaultTabsKey.value] = modelList[value]
    reLifeQueryParameter(theTenantId.value)
  } else if (value == '4') {
    modelList[defaultTabsKey.value] = modelList[value]
  }
}

/*********Mr·Ye*********/
async function handleOk() {
  if (defaultTabsKey.value == '1') {

    if (modelList[defaultTabsKey.value].variable.printingMethod == 1) {
      if (theSelectObjs.value.length == 0) {
        message.warning('请先选中需要进行打印的凭证!');
        return
      }
      modelList[defaultTabsKey.value]['variable']['selectKeys'] = JsonTool.json([...new Set(theSelectObjs.value.map(it => it.uniqueCode))])
    }
  } else {
    if (hasBlank(theTenantId.value)) {
      message.error('请先获取账套查询权限!');
      return
    } else if (dateList.value.length === 0) {
      message.error('请先初始化会计期间后再进行查询!');
      return
    }
    let startQj = strDate.value || ''
    let endQj = endDate.value || ''
    if ((startQj == '' && endQj == '')) {
      message.error('请选择会计区间or日期期间!');
      return
    }
    if ((startQj != '' && endQj == '') || (startQj == '' && endQj != '')) {
      message.error('请完善会计区间');
      return
    } else if ((startQj != '' && endQj != '' && (startQj.substring(0, 4) != endQj.substring(0, 4)))) {
      message.error('暂不支持跨越年度会计区间查询');
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
    modelList[defaultTabsKey.value].variable.periodStart = startQj
    modelList[defaultTabsKey.value].variable.periodEnd = endQj
  }
  try {
    modelLoadIng.value = true
    let data = JsonTool.parseProxy(modelList[defaultTabsKey.value])
    dataTable.value = await useRouteApi(findPrintDataByCondition, {schemaName: theTenantId.value})(data)
    if (dataTable.value.length != 0) printData()
    message.info('正在处理打印中...请稍后！')
  } catch (e) {
  }
  modelLoadIng.value = false
  // emit('save', unref(modelList[defaultTabsKey.value]))
  closeModal()
  return true
}

async function handleClose() {
  closeModal()
}

/**********打印*********/
import {useNewPrint} from "/@/utils/boozsoft/print/print";
import {
  dataModelBuildingL, dataModelBuildingTwoP,
  getCurrPrintParameter
} from "/@/views/boozsoft/global/popup/accvoucher/printTemplate";
import {findPrintDataByCondition} from "/@/api/record/system/accvoucher";

function printData() {
  let dataArr = dataTable.value
  if (dataArr.length == 0) {
    return false;
  }
  let type = modelList[defaultTabsKey.value].variable.rodioValue
  let maxRowLen = modelList[defaultTabsKey.value].variable.rodioValue == 1 ? 10 : modelList[defaultTabsKey.value].variable.rowNumber;
  let dateModel= []
  if (type == 2 || type == 3){
    dateModel = dataModelBuildingTwoP(dataArr,{'unit': theUnitName.value},type,maxRowLen)
  }else {
    dateModel = dataModelBuildingL(dataArr,{'unit': theUnitName.value},type,maxRowLen)
  }
  console.log(dateModel)
  let {fx, size, fun} = getCurrPrintParameter(type)
  useNewPrint({data: [fx, 'px', size, false]}, (doc) => {
    dateModel.forEach((printList,index)=>{
      fun(doc, printList,[], maxRowLen)
      if (index < (dateModel.length-1)) doc.addPage()
    })
  })
  emit('log','')
}
/**********打印*********/

</script>
<style src="../../../../../assets/styles/global-open.less" lang="less" scoped></style>
<style lang="less" scoped>
.nc-open-content {
  position: relative;

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
            margin: 15px 5px;
            color: black;

            .ant-radio-group {
              .ant-radio-wrapper {
                width: 200px !important;
                text-align: left;
                padding: 5px 0px;

                .ant-radio-input {
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

      .ant-radio-input {
        border-color: slategrey;
      }
    }

    p:nth-of-type(2) {
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
    margin-bottom: 0 !important;
  }

  /*.ant-tabs-tab:nth-of-type(2) {
    margin-top: 150px !important;
  }*/
}
</style>
