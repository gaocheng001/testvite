<template>
  <div class="nci-hr">
    <div class="nc-hr-top">
      <div class="nc-hr-top-left">
        <div>
          <Avatar src="" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 80 }">
            <CarryOutOutlined style="font-size: 30px;color: #146dc1;"/>
          </Avatar>
        </div>
        <div>
          <span>固定资产</span><br/>
          <span>期末例行工作点及任务</span>
        </div>
      </div>
      <div style="line-height: 75px;">
        <span style="font-size: 32px;">月末结账</span>
      </div>
      <div class="nc-hr-top-right">
        <div>
          <Rate v-model:value="rateValue" allow-half/>
        </div>
        <div>
          <span>了解月末工作检查步骤</span>
        </div>
      </div>
    </div>
    <div class="nc-hr-middle">
      <div>
        <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
      </div>
      <div>

      </div>
      <div>
        <Button @click="closeCurrent()">
          退出
        </Button>
      </div>
    </div>
    <div class="nc-hrm-body" :style="{maxHeight: windowHeight+'px'}">
      <div><span>结账月份：</span><span>{{ currMonth }}月</span></div>
      <div>
        <Steps :current="stepValue" status="error">
          <Step title="开始工作检查" description=""/>
          <Step :title="stepValue < 2?'未完成':'已完成'" description="计提折旧"/>
          <Step :title="stepValue < 3?'未完成':'已完成'" description="凭证生成"/>
          <Step :title="stepValue < 4?'未完成':'已完成'" description="月末结账"/>
        </Steps>
      </div>
      <div>
        <Button type="primary" shape="round" size="large" v-if="!indicator"
                :disabled="stepValue != 3" @click="startBill">
          开始结账
        </Button>
        <Spin :indicator="indicator" :tip="`正在进行${tipText}工作检查中...`" v-else="indicator"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  CarryOutOutlined, SearchOutlined
} from '@ant-design/icons-vue';
import {
  Input, Select, Button,
  Tag, Avatar,
  Steps, Rate, message, Spin
} from "ant-design-vue";
import {onMounted, ref} from "vue";

const Step = Steps.Step
const InputSearch = Input.Search
const SelectOption = Select.Option
const props = defineProps(['modelValue'])
const windowHeight = (window.innerHeight - (280))
/*列表逻辑*/
const {
  createErrorModal,
  createSuccessModal,
  createConfirm
} = useMessage()
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
  closeBill, findAssetsDate,
  findAssetsUniqueCodeAndCode,
  findByAuthAssetsByUniqueCode, findZiChanPeriodByCode
} from "/@/api/record/group/im-unit";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
import {useDatasourcePicker} from "/@/boozsoft/components/AccountPicker/utils/accountUtils";

const {closeCurrent} = useTabs(router);
const rateValue = ref(4)
const stepValue = ref(1)
const stepStatus = ref(1)
const indicator = ref(false)

const currMonth = ref('12')
const currId = ref('')

const dynamicTenantId = ref('')
const dynamicYear = ref('')
const managementCode = ref('')
const tipText = ref('')
const faAccountList = ref([])

const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  dynamicYear.value = obj.managementYear
  managementCode.value = obj.managementCode
  if ( managementCode.value == '') {
    message.warning('请先建立该公司下资产账后进行操作！')
  }else {
    await selectChange(managementCode.value)
  }
}

async function selectChange(v) {
  let dbE = await findZiChanPeriodByCode({code: v, iyear: dynamicYear.value})
  if (null != dbE && dbE.isSettle == '0') {
    currMonth.value = dbE.imonth
    currId.value = dbE.id
    stepValue.value = 1
    tipText.value = '计提折旧'
    indicator.value = true
    setTimeout(() => {
      if (dbE.isZhejiu == '1') {
        stepValue.value = 2
        indicator.value = false
      } else {
        indicator.value = false
        return false;
      }
      tipText.value = '凭证生成情况'
      indicator.value = true
      setTimeout(() => {
        if (dbE.isFilledIn == '1') {
          stepValue.value = 3
          indicator.value = false
        } else {
          indicator.value = false
          return false;
        }
        tipText.value = '月末结账'
        indicator.value = true
        setTimeout(() => {
          if (dbE.isSettle == '1') {
            stepValue.value = 4
            indicator.value = false
          } else {
            indicator.value = false
            return false;
          }
        }, 2000)
      }, 2000)
    }, 2000)
  } else {
    message.info('本年度已完成所有月份结账操作')
  }
}

const startBill = async () => {
  tipText.value = '月末结账'
  indicator.value = true
  let e = await closeBill({id: currId.value, value: '1'})
  setTimeout(async () => {
    indicator.value = false
    if (null != e) {
      message.success('已成功完成结账操作！')
      setTimeout(async () => {
        stepValue.value = 1
        // useAccountPickerCache().set(null)
        await selectChange(managementCode.value)
        await resetCache()
      }, 1000)
    }
  }, 2000)
}
async function resetCache()  {
  // 最新结账日期发生变化
  let e =  useAccountPickerCache().get()
  e.managementYearInfo = await findAssetsDate({code: managementCode.value,iyear: dynamicYear.value})
  console.log(e.managementYearInfo)
  useAccountPickerCache().set(e)
}
</script>
<style lang="less" scoped>
.nci-hr {
  padding: 10px;

  .nc-hr-top {
    font-weight: bold;
    color: white;
    height: 120px;
    width: 100%;
    background-color: #146dc1;
    display: inline-flex;
    justify-content: space-between;
    padding: 1.2% 5%;

    > div {
      display: inline-flex;
      justify-content: space-between;
    }

    .nc-hr-top-left {
      width: 400px;

      > div:nth-of-type(1) {
        width: 80px;
        height: 80px;
        border-radius: 50%;

        .ant-avatar {
          background-color: white;
        }
      }

      > div:nth-of-type(2) {
        padding: 4%;

        span:nth-of-type(2) {
          font-size: 22px;

        }
      }
    }

    .nc-hr-top-right {
      width: 360px;
      padding: 1% 0;

      > div:nth-of-type(1) {
        > span {
          font-size: 13px;
        }
      }

      > div:nth-of-type(2) {
        width: 180px;
        background-color: white;
        height: 50px;
        line-height: 50px;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        color: #146dc1;

        > span {
          font-size: 13px;
        }
      }

      > div:nth-of-type(2):hover {
        background-color: #f1f1f1;
        color: rebeccapurple;
      }
    }
  }

  .nc-hr-middle {
    height: 50px;
    margin: .5% 0;
    line-height: 40px;
    background-color: #f1f1f1;
    padding: 5px;
    display: flex;
    justify-content: space-between;

    > div:nth-of-type(1) {
      width: 50%;
      text-align: center;
    }

    > div:nth-of-type(2) {
      > span {
        color: red;
      }
    }

    .ant-btn {
      border-color: #c9c9c9
    }
  }

  .nc-hrm-body {
    background-color: white;

    > div {
      width: 100%;
      height: 150px;
      padding: 3% 5%;
    }

    > div:nth-of-type(1) {
      font-size: 26px;
      font-weight: bold;

      span:nth-of-type(1) {
        color: #666666;
      }
    }

    > div:nth-of-type(2) {
      font-weight: bold;
    }

    > div:nth-of-type(3) {
      text-align: center;

    }
  }
}
</style>
