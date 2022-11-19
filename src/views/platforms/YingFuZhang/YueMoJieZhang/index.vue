<template>
  <div class="nci-hr">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>月末结账的页面</textarea>复制内容快速定位页面</div>-->
    <div class="nc-hr-top">
      <div class="nc-hr-top-left">
        <div>
          <Avatar src="" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 80 }">
            <CarryOutOutlined style="font-size: 30px;color: #146dc1;"/>
          </Avatar>
        </div>
        <div>
          <span>应付款管理</span><br/>
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
        <Button class="ant-btn-me" @click="balanceTaskDel();closeCurrent()">
          退出
        </Button>
      </div>
    </div>
    <div class="nc-hrm-body" :style="{maxHeight: windowHeight+'px'}">
      <div><span>结账期间：</span><span>{{ currMonth }}</span></div>
      <div>
        <Steps :current="stepValue" status="error" style="padding-top: 100px;">
          <Step title="开始检查" description=""/>
          <Step :title="stepModel['0'].chgl.finish ?'存货结账':'存货结账'">
            <template #description>
              <div class="step-div" v-if="!stepModel['0'].chgl.finish">
                <span :class="stepModel['0'].chgl.finish?'span-green':'span-red'">存货管理{{stepModel['0'].chgl.finish?'已':'未'}}结账</span><br/>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['1'].qcye.finish?'期初余额':'期初余额'">
            <template #description>
              <div class="step-div" v-if="!stepModel['1'].qcye.finish">
                <span :class="stepModel['1'].qcye.finish?'span-green':'span-red'">{{stepModel['1'].qcye.number}}个期初余额{{stepModel['1'].qcye.finish?'已':'未'}}审核</span><br/>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['2'].ysd.finish ?'应付单审核':'应付单审核'">
            <template #description>
              <div class="step-div" v-if="!stepModel['2'].ysd.finish">
                <span :class="stepModel['2'].ysd.finish?'span-green':'span-red'">{{stepModel['2'].ysd.number}}个应付单{{stepModel['2'].ysd.finish?'已':'未'}}审核</span><br/>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['3'].skd.finish ?'付款单审核':'付款单审核'">
            <template #description>
              <div class="step-div" v-if="!stepModel['3'].skd.finish">
                <span :class="stepModel['3'].skd.finish?'span-green':'span-red'">{{stepModel['3'].skd.number}}个付款单{{stepModel['3'].skd.finish?'已':'未'}}审核</span><br/>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['4'].skdhx.finish ?'付款单核销':'付款单核销'">
            <template #description>
              <div class="step-div" v-if="!stepModel['4'].skdhx.finish">
                <span :class="stepModel['4'].skdhx.finish?'span-green':'span-red'">{{stepModel['4'].skdhx.number}}个付款单{{stepModel['4'].skdhx.finish?'已':'未'}}核销</span>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['5'].hzhc.finish ?'红字回冲单':'红字回冲单'">
            <template #description>
              <div class="step-div" v-if="!stepModel['5'].hzhc.finish">
                <span :class="stepModel['5'].hzhc.finish?'span-green':'span-red'">{{stepModel['5'].hzhc.number}}个红字单据{{stepModel['5'].hzhc.finish?'已':'未'}}核销</span>
              </div>
            </template>
          </Step>
          <Step :title="stepModel['6'].pzzd.finish ?'凭证制单':'凭证制单'">
            <template #description>
              <div class="step-div" v-if="!stepModel['6'].pzzd.finish">
                <span :class="stepModel['6'].pzzd.finish?'span-green':'span-red'">{{stepModel['6'].pzzd.number}}个应付及付款单据{{stepModel['6'].pzzd.finish?'已':'未'}}制单</span><br/>
              </div>
            </template>
          </Step>
          <Step :title="isClose?'检查已通过,可以结账!':'检查未完成,不能结账！'" description=""/>
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
import {nextTick, ref} from "vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {
  findStockPeriodLatest,
  findStockPeriodTree,
  closeBillStock as closeBill,
} from "/@/api/record/group/im-unit";
import {closeBeforeCheck, closeBeforeCheckAr} from "/@/api/record/stock/stock-close";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useUserStore, useUserStoreWidthOut} from "/@/store/modules/user";
import {
  findArApYsyfByDateList,
  findBeginBalanceByYearList,
  findPeriodByYearList,
  findSaleousingByDateList, findWarehousingByDateList, saveApPeriod, savePeriod
} from "/@/api/record/system/ar-ap-period";
import {
  getByStockBalanceTask,
  stockBalanceTaskDelByUserName
} from "/@/api/record/stock/stock_balance";
import {findByIyearAndCaozuoModule, saveTaskApi} from "/@/api/record/system/task";

const Step = Steps.Step
const InputSearch = Input.Search
const SelectOption = Select.Option
const props = defineProps(['modelValue'])
const windowHeight = (window.innerHeight - (280))
/*列表逻辑*/
const {
  createErrorModal,
  createSuccessModal,
  createConfirm,
  createWarningModal
} = useMessage()


const {closeCurrent} = useTabs(router);
const rateValue = ref(4)
const stepValue = ref(0)
const isClose = ref(false)
/*const stepModel = ref({
  '0': {
    chgl: {finish: false,number: 0},
  },
  '1': {
    cg: {finish: false,number: 0},
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
  },
  '6':{
    jh: {finish: false,number: 0},
  }
})*/
const stepModel = ref({
  '0': {
    chgl: {finish: false,number: 0},
  },
  '1': {
    qcye: {finish: false,number: 0},
  },
  '2':{
    ysd: {finish: false,number: 0},
  },
  '3':{
    skd: {finish: false,number: 0},
  },
  '4':{
    skdhx: {finish: false,number: 0},
  },
  '5':{
    hzhc: {finish: false,number: 0},
  },
  '6':{
    pzzd: {finish: false,number: 0},
  }
})
const indicator = ref(false)

const currMonth = ref('12')
const month = ref('12')
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
    month.value = res.stockMonth
    currId.value = res.id
  }
}

const startBill = async () => {
  indicator.value = true
  if (isClose.value){ // 开始结账
    tipText.value = '月末结账'
    let e = await saveApPeriod({id: currId.value, value: '1',user: userId})
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
    await balanceTaskDel()
  }else {
    stepValue.value = 0
    let types:any = []
    let keys = Object.keys(stepModel.value)
    const res = await findPeriodByYearList(dynamicYear.value)
    for (let i = 0; i < res.length; i++) {
      let item = res[0]
      if (item.stockMonth == month.value) {
        if (item.stockFlag == '1') {
          //锁定结账任务
          let taskData= await useRouteApi(findByIyearAndCaozuoModule, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoModule:'ap'})
          if (taskData.length>0){
            return createWarningModal({ content: taskData[0]?.username+'正在'+taskData[0]?.method+taskData[0]?.functionModule+',不能同时进行操作！' });
          }
          let ymjz= await useRouteApi(getByStockBalanceTask, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,name:'应付款月末结账',method:'月末结账'})
          if(ymjz.length==0){
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应付款月末结账',method:'月末结账',caozuoModule:'ap'})
          } else {
            await useRouteApi(saveTaskApi, { schemaName: dynamicTenantId })({id:ymjz[0]?.id,iyear:dynamicYear.value,caozuoUnique:useUserStoreWidthOut().getUserInfo.id,functionModule:'应付款月末结账',method:'月末结账',caozuoModule:'ap'})
          }
        }
      }
    }
    const res1 = await useRouteApi(findBeginBalanceByYearList,{schemaName: dynamicTenantId})({billStyle:'ap',year:dynamicYear.value})
    const qcye = res1.filter(item =>item.bcheck!='1')
    const res2 = await useRouteApi(findWarehousingByDateList, {schemaName: dynamicTenantId})({
      billStyle: 'YFD',
      year: dynamicYear.value,
      date: dynamicYear.value+month.value
    })
    const ysd = res2.filter(item => item.bcheck != '1')
    const res3 = await useRouteApi(findArApYsyfByDateList, {schemaName: dynamicTenantId})({
      billStyle: 'FKD',
      year: dynamicYear.value,
      date: dynamicYear.value+month.value
    })
    const skd = res3.filter(item => item.bcheck != '1')
    const skdhx = res3.filter(item => item.writeOffStatus != '1')
    new Promise(async(resolve, reject) => {
      setTimeout(() => {
        stepValue.value += 1
        res.forEach(item => {
          if (item.stockMonth == month.value) {
            if (item.stockFlag == '1') {
              stepModel.value['0'].chgl.finish = true
            } else {
              stepModel.value['0'].chgl.finish = false
            }
          }
        })
      }, 1*2000)
      setTimeout(() => {
        stepValue.value += 1
        if (qcye.length > 0) {
          stepModel.value['1'].qcye.finish = false
          stepModel.value['1'].qcye.number = qcye.length
        } else {
          stepModel.value['1'].qcye.finish = true
          stepModel.value['1'].qcye.number = res1.length
        }
      }, 2*2000)
      setTimeout(() => {
        stepValue.value += 1
        if (ysd.length > 0) {
          stepModel.value['2'].ysd.finish = false
          stepModel.value['2'].ysd.number = ysd.length
        } else {
          stepModel.value['2'].ysd.finish = true
          stepModel.value['2'].ysd.number = res2.length
        }
      }, 3*2000)
      setTimeout(() => {
        stepValue.value += 1
        if (skd.length > 0) {
          stepModel.value['3'].skd.finish = false
          stepModel.value['3'].skd.number = skd.length
        } else {
          stepModel.value['3'].skd.finish = true
          stepModel.value['3'].skd.number = res3.length
        }
      }, 4*2000)
      setTimeout(() => {
        stepValue.value += 1
        if (skdhx.length > 0) {
          stepModel.value['4'].skdhx.finish = false
          stepModel.value['4'].skdhx.number = skdhx.length
        } else {
          stepModel.value['4'].skdhx.finish = true
          stepModel.value['4'].skdhx.number = res3.length
        }
      }, 5*2000)
      const lzysd = res2.filter(item => item.bdocumStyle != '1' && item.hxFlag != '1')
      const hzysd = res2.filter(item => item.bdocumStyle == '1' && item.hxFlag != '1')
      const lzskd = res3.filter(item => item.bdocumStyle != '1' && item.writeOffStatus != '1')
      const hzskd = res3.filter(item => item.bdocumStyle == '1' && item.writeOffStatus != '1')
      const hzhc = hzysd.length + hzskd.length
      const hzhcNum = res2.filter(item => item.bdocumStyle == '1' && item.hxFlag == '1').length + res3.filter(item => item.bdocumStyle == '1' && item.writeOffStatus == '1')
      setTimeout(() => {
        stepValue.value += 1
        if (hzhc.length > 0) {
          stepModel.value['5'].hzhc.finish = false
          stepModel.value['5'].hzhc.number = hzhc
        } else {
          stepModel.value['5'].hzhc.finish = true
          stepModel.value['5'].hzhc.number = hzhcNum
        }
      }, 6*2000)
      setTimeout(() => {
        stepValue.value += 1
        stepModel.value['6'].pzzd.finish = true
        stepModel.value['6'].pzzd.number = 0
      }, 7*2000)
      //判断是否通过检测
      setTimeout(() => {
        stepValue.value += 1
        if (stepModel.value['0'].chgl.finish == true
          && stepModel.value['1'].qcye.finish == true
          && stepModel.value['2'].ysd.finish == true
          && stepModel.value['3'].skd.finish == true) {
          isClose.value = true// 可以完成结账
        } else {
          isClose.value = false
          balanceTaskDel()
        }
        indicator.value = false
      }, 7*2000)
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
    // 获取所有信息
    /*let date = currMonth.value.replace('.', '-')
    let types:any = []
    let keys = Object.keys(stepModel.value)
    keys.map(k => types.push(...(Object.keys(stepModel.value[k]))))
    let res = await useRouteApi(closeBeforeCheckAr, {schemaName: dynamicTenantId})({
      date: date,
      iyear: dynamicYear.value,
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

    })*/
  }
}

async function balanceTaskDel() {
  await useRouteApi(stockBalanceTaskDelByUserName, { schemaName: dynamicTenantId })({iyear:dynamicYear.value,userName:useUserStoreWidthOut().getUserInfo.id,functionModule:'应收款月末结账',method:'月末结账'})
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
      margin-left: -40px;
      .span-green{
        color: green;
      }
      .span-red{
        color: red;
      }
    }
  }
}

.ant-btn-me {
  color: #0096c7;
  font-size: 14px;
}
</style>
