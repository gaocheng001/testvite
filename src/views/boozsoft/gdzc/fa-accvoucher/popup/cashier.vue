<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    :title="pageMark?'出纳签字':'取消出纳签字'"
    :ok-text="pageMark?'出纳签字':'取消出纳签字'"
    @ok="handleOk()"
    @cancel="resetPageData()"
    @register="register"
  >
    <a-spin :spinning="spinning" :delay="500">
      <div class="nc-open-content">
        <div style="width: 160px;border-bottom: 3px solid #0188e8">
          <span style="font-size: 18px;color: #2828c9;margin-left: 5px">{{pageMark?'出纳签字':'取消出纳签字'}}范围</span>
        </div>
        <div style="margin: 4% 0">
          <a-radio-group v-model:value="pageVariable.scopeCondition" @change="radioChange">
            <a-radio :value="1">
              对当前选择的凭证进行{{pageMark?'出纳签字':'取消出纳签字'}}
            </a-radio>
            <div style="height: 10px"></div>
            <a-radio :value="2">
              按条件批量对凭证进行{{pageMark?'出纳签字':'取消出纳签字'}}
            </a-radio>
          </a-radio-group>
        </div>
        <div style="position: relative;border: 1px #666565 solid">
          <span style="position: inherit; top: -12px; left: 35px;background-color: white;">&emsp;条件批量{{pageMark?'出纳签字':'取消出纳签字'}}&emsp;</span>
          <div>
            <ul>
              <li>
                <span>凭证期间：</span>
                <a-select
                  v-model:value="pageVariable.batchCondition.voucherPeriod"
                  :disabled="pageVariable.scopeCondition == 1"
                  @change="conditionSwitching(true)"
                  style="width: 227px"
                >
                  <a-select-option
                    v-for="item in dateList"
                    :key="item.id"
                    :value="item.value"
                  >
                    {{ item.value }}
                  </a-select-option>
                </a-select>
              </li>
              <li>
                <span>凭证日期：</span>
                <a-range-picker
                  :disabled="pageVariable.scopeCondition == 1"
                  v-model:value="intervals"
                  @change="conditionSwitching(false)"
                  style="width: 496px"/>
              </li>
              <li>
                <span>&emsp;凭证号：</span>
                <a-input v-model:value="pageVariable.batchCondition.voucherNumberStart" :allowClear="true"
                         :disabled="pageVariable.scopeCondition == 1" placeholder="" style="width: 227px"/>
                <span>&emsp;~&emsp;</span>
                <a-input v-model:value="pageVariable.batchCondition.voucherNumberEnd" :allowClear="true"
                         :disabled="pageVariable.scopeCondition == 1" placeholder="" style="width: 227px"/>
              </li>
              <li>
                <span>&emsp;制单人：</span>
                <a-select v-model:value="pageVariable.batchCondition.maker" :disabled="pageVariable.scopeCondition == 1"
                          style="width: 227px">
                </a-select>
                <span v-if="!pageMark">&emsp;&emsp;&emsp;出纳：</span>
                <a-select v-if="!pageMark" v-model:value="pageVariable.batchCondition.cashier"
                          :disabled="pageVariable.scopeCondition == 1" style="width: 185px">
                </a-select>
              </li>
            </ul>
          </div>
        </div>
<!--        <div style="margin: 4% 0">
          <a-checkbox v-model:checked="pageVariable.selectMaker" style="pointer-events: none">含本人制单凭证</a-checkbox>
        </div>-->
      </div>
    </a-spin>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import {onMounted, ref, reactive,  unref} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal'
import {message} from 'ant-design-vue'
import {useUserStore} from "/@/store/modules/user";
import {useMessage} from "/@/hooks/web/useMessage";

const {
  createErrorModal, createWarningModal,createInfoModal
} = useMessage()
import {
  DatePicker as ADatePicker,
  Select as ASelect,
  Input as AInput,
  Popover as APopover,
  Switch as ASwitch,
  Radio as ARadio,
  Checkbox as ACheckbox,
  Spin as ASpin
} from "ant-design-vue"
import {findPeriodByAccontId} from "/@/api/record/generalLedger/data";
import {
  askTask,
  compareTime,
  findByFunctionModule,
  findAccCloseListByYaer,
  getCurrentAccountName,
  offsetToStr, pointMessage
} from "/@/api/task-api/tast-bus-api";
import {initBasisTabData} from "/@/api/record/system/financial-settings";
import {startVoucherCashierProcedural,startVoucherCloseCashierProcedural} from '/@/api/record/system/accvoucher'

const ARangePicker = ADatePicker.RangePicker
const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
const emit=defineEmits(['reload','register'])
const userStore = useUserStore();
// 页面变量
const pageMark = ref(true)

const intervals = ref([])
const dateList: any = ref([])
const pageVariable = reactive({
  scopeCondition: 2,
  batchCondition: {
    voucherPeriod: '',
    voucherDateStart: '',
    voucherDateEnd: '',
    voucherNumberStart: '',
    voucherNumberEnd: '',
    maker: '',
    cashier: '',
    checkName: ''
  },
  operatorUserName: '',
   selectMaker: false,
  selectCashier: false,
  selectImanager: false,
  selectifVerify: false,
})


const selectedRowKeys: any = ref([])
const yearMonths: any = ref([])
// iverify,icashier
const pingZhenControlList: any = ref([])

const spinning = ref<boolean>(false);

const [register, {closeModal, changeOkLoading}] = useModalInner((data) => {
  openInitPageData()
  selectedRowKeys.value = data.data.selectedRowKeys
  yearMonths.value = data.data.yearMonths
  pageMark.value = data.data.mark
})


onMounted(async () => {

})

const resetPageData = ()=>{
  pageVariable.scopeCondition = 1
  pageVariable.batchCondition.voucherPeriod = ''
  pageVariable.batchCondition.voucherDateStart = ''
  pageVariable.batchCondition.voucherDateEnd = ''
  pageVariable.batchCondition.voucherNumberStart = ''
  pageVariable.batchCondition.voucherNumberEnd = ''
  pageVariable.batchCondition.maker = ''
  pageVariable.batchCondition.cashier = ''
  pageVariable.batchCondition.checkName = ''
  intervals.value = []
  pageVariable.selectMaker = false
  pageVariable.selectCashier =  false
  selectedRowKeys.value = []
  yearMonths.value = {}
}

const openInitPageData = async () => {
  dateList.value = await findPeriodByAccontId(getCurrentAccountName(false));
  initBasisTabData({'accId': getCurrentAccountName(false)}).then(res => {
    pingZhenControlList.value = res.pingZhenControlList
    if (pingZhenControlList.value.indexOf('iverify') != -1) pageVariable.selectMaker = true
    if (pingZhenControlList.value.indexOf('icashier') != -1) pageVariable.selectCashier = true
    if (pingZhenControlList.value.indexOf('imanager') != -1) pageVariable.selectImanager = true
    if (pingZhenControlList.value.indexOf('ifVerify') != -1) pageVariable.selectifVerify = true
  }).catch(error => {
    console.log('error', error)
  })
}

const handleOk = async () => {
  //
  if (pageVariable.scopeCondition === 1 && selectedRowKeys.value.length == 0) {
    message.info('请先选中需要进行记账的凭证！')
    setTimeout(() => {
      closeModal()
      resetPageData()
    }, 2000)
    return false
  } else if (pageVariable.scopeCondition === 2 && (pageVariable.batchCondition.voucherPeriod == '' && intervals.value.length === 0)) {
    message.info('批量记账期间or凭证日期不能为空！')
    return false
  } else {
    spinning.value = true
    changeOkLoading(spinning.value)
    if (await checkMeetSpecifyConditions()) { // 开始审核
      pageVariable.operatorUserName = userStore.getUserInfo.realName
      let data1 = JSON.parse(JSON.stringify(pageVariable))
      if (pageVariable.scopeCondition == 1) {
        data1.selectedRowKeys = selectedRowKeys.value
      }
      let res = null
      if (pageMark.value){
        res = await startVoucherCashierProcedural(data1)
      }else {
         res = await startVoucherCloseCashierProcedural(data1)
      }
      await pointMessage({title: '处理结果', content: res,delay: true})
    }
    spinning.value = false
    changeOkLoading(spinning.value)
    setTimeout(()=>{
      closeModal()
      resetPageData()
      emit('reload', {})
    },2000)
  }
}

//Obtain the specified data according to the period
const getQjObjByMonthOrPeriod = (value, type) => {
  if (dateList.value.length == 0) {
    return {
      year: value.split('-')[0],
      dateStart: value.split('-')[1] + '-01',
    }
  }
  if (type == 'MONTH') {
    value.split('-')
    return dateList.value.filter((item) => {
      if (value.split('-')[0] === item.iyear && item.dateStart.split('-')[0] == value.split('-')[1]
        && item.dateEnd.split('-')[0] == value.split('-')[1]) {
        return true
      } else {
        return false
      }
    })[0]
  } else {
    return dateList.value.filter((item) => {
      if (value == item.value) {
        return true
      } else {
        return false
      }
    })[0]
  }
}
const checkMeetSpecifyConditions = async () => {
  //开始
  let taskName = pageMark.value?'出纳签字':'取消出纳签字'
  // 判断是否存在相关任务 结账 与 审核
  let msg = ''
  let yearMonthsObj = {year: '', months: []}
  if (pageVariable.scopeCondition === 1) {
    yearMonthsObj = yearMonths.value
  } else {
    let period = pageVariable.batchCondition.voucherPeriod
    if (period != '') {
      let rValue = getQjObjByMonthOrPeriod(period, 'MONTH-NO')
      yearMonthsObj.year = rValue.iyear
      let thisMonth = rValue.dateStart.split('-')[0]
      yearMonthsObj.months.push(thisMonth)
    } else {
      let start = intervals.value[0].format('YYYY-MM-DD')
      let end = intervals.value[1].format('YYYY-MM-DD')
      pageVariable.batchCondition.voucherDateStart = start
      pageVariable.batchCondition.voucherDateEnd = end
      yearMonthsObj.year = start.split('-')[0]
      for (let i = parseInt(start.split('-')[1]); i <= parseInt(end.split('-')[1]); i++) {
        yearMonthsObj.months.push(i > 9 ? i + '' : '0' + i)
      }
    }
  }
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
    createWarningModal({title: '开始' +taskName+
        '前检测', content: '凭证' + closeMonth.toString() + '月份已经结账，不能进行' +
        taskName+'操作！'})
    //开始
    spinning.value = true
    changeOkLoading(spinning.value)
    return false
  }
  let res = await findByFunctionModule({iyear: yearMonthsObj.year})
  let checkMenu = ['月末结账','凭证记账']
  if (pageMark.value){
    checkMenu.push('出纳签字')
  }else {
    checkMenu.push('取消出纳签字')
  }
  for (let i=0;i<res.length;i++)
  {
    let item = res[i]
    if (checkMenu.indexOf(item.functionModule) != -1 && item.state == '1') {
      // 校验时间
      if (item.functionModule == '月末结账' && item.time != '' && !compareTime(offsetToStr(item.time))
        && yearMonthsObj.months.indexOf(item.imonth) != -1) { // 月末处理单独
        msg = '提示：任务冲突！操作员【' +
          item.caozuoUnique +
          '】正在进行' + item.imonth + '月份' + item.functionModule + '处理!不能进行'+taskName+'操作，请销后再试，或联系财务主管清理该结账任务后再进行相关操作!'
        break;
      }else if ( item.functionModule == '月末结账' && item.time != '' && compareTime(offsetToStr(item.time))) {
        msg = '提示：发现操作员【' +
          item.caozuoUnique +
          '】正在进行' + item.imonth + '月份' + item.functionModule + '操作已经超过30分钟!可能发生任务异常导致任务超时，是否强制清除结账任务？'
        if (await askTask({msg: msg, taskId: item.id, year: yearMonthsObj.year})){
          msg = ''
          continue
        }else {
          return false
        }
      } else if ( item.time != '' && !compareTime(offsetToStr(item.time))) { // 超时
        msg = '提示：任务冲突！操作员【' +
          item.caozuoUnique +
          '】正在进行' + item.functionModule + '处理!不能继续进行' +taskName+
          '操作，该操作不能多人同时并发进行，请销后再试，或联系财务主管清理该' + item.functionModule + '任务后再进行操作!'
        break;
      }else if ( item.time != '' && compareTime(offsetToStr(item.time))) {
        msg = '提示：发现操作员【' +
          item.caozuoUnique +
          '】正在进行当前月份' + item.functionModule + '操作已经超过30分钟!可能发生任务异常导致任务超时，是否强制清除'+item.functionModule+'任务？'
        if (await askTask({msg: msg, taskId: item.id, year: yearMonthsObj.year})){
          msg = ''
          continue
        }else {
          return false
        }
      }
    }
  }
  if (msg != '') {
    createWarningModal({title: '开始'+taskName+'前检测', content: msg})
    return false
  }
  return true;
}
const radioChange = () => {
  if (pageVariable.scopeCondition === 1) {
    pageVariable.batchCondition.voucherPeriod = ''
    pageVariable.batchCondition.voucherDateStart = ''
    pageVariable.batchCondition.voucherDateEnd = ''
    pageVariable.batchCondition.voucherNumberStart = ''
    pageVariable.batchCondition.voucherNumberEnd = ''
    pageVariable.batchCondition.maker = ''
    pageVariable.batchCondition.cashier = ''
    pageVariable.batchCondition.checkName = ''
    intervals.value = []
  }
}
const conditionSwitching = (flag: boolean) => {
  if (flag) {
    intervals.value = []
    pageVariable.batchCondition.voucherDateStart = ''
    pageVariable.batchCondition.voucherDateEnd = ''
  } else {
    pageVariable.batchCondition.voucherPeriod = ''
  }
}
</script>
<style lang="less" scoped>
:deep(.ant-calendar-picker-input.ant-input), :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector), :deep(.ant-input-affix-wrapper) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
}

.nc-open-content {
  margin: 2% 10%;
  color: black;
  font-size: 14px;
  font-weight: bold;

  ul {
    margin: 0 5% 5%;

    li {
      margin: 2% 0;
    }
  }
}
</style>
