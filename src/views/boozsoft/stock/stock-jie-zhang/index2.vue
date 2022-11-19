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
          <span>存货管理</span><br/>
          <span>当期业务完成后进行业务结账并销定</span>
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
        <AccountPicker theme="three" @reloadTable="dynamicAdReload"/>
        <div class="customize-select-year">
          <span>年度：</span>
          <Select style="width: 80px" v-model:value="dynamicYear" :options="yearList.map(it=>({value:it,label:it}))" />
        </div>
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
      <div><span>结账期间：</span><span>{{ currMonth }}</span></div>
      <div>
        <Steps :current="stepValue" status="error">
          <Step title="开始工作检查" description=""/>
          <Step :title="stepModel['1'].cg.finish && stepModel['1'].qtr.finish ?'已完成':'未完成'">
            <template #description>
              <div class="step-div">
                <span :class="stepModel['1'].cg.finish?'span-green':'span-red'">{{stepModel['1'].cg.number}}个采购入库单{{stepModel['1'].cg.finish?'已':'未'}}审核</span><br/>
                <span :class="stepModel['1'].qtr.finish?'span-green':'span-red'">{{stepModel['1'].qtr.number}}个其他入库单{{stepModel['1'].qtr.finish?'已':'未'}}审核</span>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['2'].db.finish ?'已完成':'未完成'">
            <template #description>
              <div class="step-div">
                <span :class="stepModel['2'].db.finish?'span-green':'span-red'">{{stepModel['2'].db.number}}个调拨单{{stepModel['2'].db.finish?'已':'未'}}审核</span><br/>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['3'].xt.finish ?'已完成':'未完成'">
            <template #description>
              <div class="step-div">
                <span :class="stepModel['3'].xt.finish?'span-green':'span-red'">{{stepModel['3'].xt.number}}个形态转换单{{stepModel['3'].xt.finish?'已':'未'}}审核</span><br/>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['4'].pd.finish ?'已完成':'未完成'">
            <template #description>
              <div class="step-div">
                <span
                  :class="stepModel['4'].pd.finish?'span-green':'span-red'">{{
                    stepModel['4'].pd.number
                  }}个盘点单{{ stepModel['4'].pd.finish ? '已' : '未' }}审核</span><br/>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['5'].ck.finish && stepModel['5'].cl.finish && stepModel['5'].qtc.finish ?'已完成':'未完成'">
            <template #description>
              <div class="step-div">
                <span :class="stepModel['5'].ck.finish?'span-green':'span-red'">{{stepModel['5'].ck.number}}个销售出库单{{stepModel['5'].ck.finish?'已':'未'}}审核</span><br/>
                <span :class="stepModel['5'].cl.finish?'span-green':'span-red'">{{stepModel['5'].cl.number}}个材料出库单{{stepModel['5'].cl.finish?'已':'未'}}审核</span><br/>
                <span :class="stepModel['5'].qtc.finish?'span-green':'span-red'">{{stepModel['5'].qtc.number}}个其他出库单{{stepModel['5'].qtc.finish?'已':'未'}}审核</span>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['6'].jh.finish && stepModel['6'].wl.finish ?'已完成':'未完成'">
            <template #description>
              <div class="step-div">
                <span :class="stepModel['6'].jh.finish?'span-green':'span-red'">{{stepModel['6'].jh.number}}个拣货装箱单{{stepModel['6'].jh.finish?'已':'未'}}审核</span><br/>
                <span :class="stepModel['6'].wl.finish?'span-green':'span-red'">{{stepModel['6'].wl.number}}个销售物流送货单{{stepModel['6'].wl.finish?'已':'未'}}审核</span>
              </div>
            </template>
          </Step>
          <Step :title="isClose?'已通过检查,请点击按钮完成结账!':'检查未通过,不能结账！'" description=""/>
        </Steps>
      </div>
      <div>
<!--  :disabled="!isClose"      -->
        <Button type="primary" shape="round" size="large" v-if="!indicator"
                 @click="startBill">
          {{isClose?'开始结账':'开始检查'}}
        </Button>
        <Spin :indicator="indicator" :tip="`正在进行${tipText}工作检查中...`" v-else="indicator"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {CarryOutOutlined} from '@ant-design/icons-vue';
import {Avatar, Button, Input, message, Rate, Select, Spin, Steps} from "ant-design-vue";
import {ref} from "vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
  findStockPeriodLatest,
  findStockPeriodTree,
  closeBillStock as closeBill,
} from "/@/api/record/group/im-unit";
import {closeBeforeCheck} from "/@/api/record/stock/stock-close";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useUserStore} from "/@/store/modules/user";
import {useAccvoucherStoreWidthOut} from "/@/store/modules/accvoucher";

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


const {closeCurrent} = useTabs(router);
const rateValue = ref(4)
const stepValue = ref(0)
const isClose = ref(false)
const stepModel = ref({
  '1': {
    cg: {finish: false,number: 0},
    qtr: {finish: false,number: 0},
  },
  '2':{
    db: {finish: false,number: 0},
  },
  '3':{
    xt: {finish: false,number: 0},
  },
  '4':{
    pd: {finish: false,number: 0},
  },
  '5':{
    ck: {finish: false,number: 0},
    cl: {finish: false,number: 0},
    qtc: {finish: false,number: 0},
  },
  '6':{
    jh: {finish: false,number: 0},
    wl: {finish: false,number: 0},
  }
})
const indicator = ref(false)

const currMonth = ref('12')
const yearList = ref([])
const currId = ref('')
const userId = useUserStore().getUserInfo.id
const dynamicTenantId = ref('')
const accountId = ref('')
const dynamicYear = ref('')
const managementCode = ref('')
const tipText = ref('')
const faAccountList = ref([])

const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  // dynamicYear.value = obj.managementYear
  managementCode.value = obj.managementCode
  accountId.value = obj.target.id
  if ( managementCode.value == '') {
    message.warning('请先建立该公司下资产账后进行操作！')
  }else {
    await loadYears()
  }
}

async function loadYears(){
  yearList.value =  (await findStockPeriodTree({id: accountId.value})) || []
  // 获取最新未结账月
  if (yearList.value.length > 0){
    let res = (await findStockPeriodLatest({id: accountId.value,action: '0'}))
    dynamicYear.value = res.stockYear
    currMonth.value = res.stockYear+'.'+res.stockMonth
    currId.value = res.id
  }
}

const startBill = async () => {
  indicator.value = true
  if (isClose.value){ // 开始结账
     tipText.value = '月末结账'
    let e = await closeBill({id: currId.value, value: '1',user: userId})
    setTimeout(async () => {
      indicator.value = false
      if (null != e) {
        message.success('已成功完成结账操作！')
        setTimeout(async () => {
          stepValue.value = 0
          isClose.value = false
          await loadYears()
        }, 1000)
      }
    }, 2000)
  }else {
    // 获取所有信息
    let date = currMonth.value.replace('.', '-')
    let types = []
    let keys = Object.keys(stepModel.value)
    keys.map(k => types.push(...(Object.keys(stepModel.value[k]))))
    let res = await useRouteApi(closeBeforeCheck, {schemaName: dynamicTenantId})({
      date: date,
      types: types.join()
    })
    new Promise((resolve, reject) => {
      for (let i = 0; i <= keys.length; i++) {
        setTimeout(() => {
          tipText.value = getCurrTip((i+1) + '')
          stepValue.value += 1
          if (i!=0)
            for (let l of Object.keys(stepModel.value[(i) + ''])){
              let d =  res[l]
              d.finish = d.finish=='true'
              stepModel.value[(i) + ''][l] = d
            }
          if (i == 6)resolve('')

        }, (i + 1) * 2000)
      }
    }).then((i) => {
        // 校验最终结果
      tipText.value = ''
      indicator.value = false
      types = []
      keys.map(k => types.push(...(Object.values(stepModel.value[k]).map(it=>it.finish))))
      stepValue.value += 1
      isClose.value = types.filter(s=>!s).length == 0 // 可以完成结账
    }).catch((i) => {

    })
  }
}
const getCurrTip = (k) => {
  let text = ''
  switch (k) {
    case '1':
      text = '入库单';
      break;
    case '2':
      text = '调拨单';
      break;
    case '3':
      text = '形态转换单';
      break;
    case '4':
      text = '盘点单';
      break;
    case '5':
      text = '出库单与材料出库单';
      break;
    case '6':
      text = '装箱单与送货单';
      break;
    default:
      break
  }
  return text
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

        span:nth-of-type(1) {
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
      text-align: left;
      padding: 4px 0px;
      display: flex;
      justify-content: space-between;
      .customize-select-year{
        margin-left: 2em;
        line-height: 32px;
        >span{
          font-weight: bold;
        }
        :deep(.ant-select-selector){
          border: 1px solid #c9c9c9;
          .ant-select-selection-item{
            font-weight: bold;
          }
        }
      }
    }

    > div:nth-of-type(2) {

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
    .step-div{
      font-size: 12px;
      .span-green{
        color: green;
      }
      .span-red{
        color: red;
      }
    }
  }
}
</style>
