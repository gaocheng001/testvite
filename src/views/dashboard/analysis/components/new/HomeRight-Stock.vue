<template>
  <div class="nc-hr">
    <div class="nc-hr-top" :style="bgStyle">
      <div class="nc-hrt-one">
        <span style="font-size: 30px;font-weight: bold;color: #1c6ca1">{{showTitle(ncHrMark)}}</span>
        <div>
<!--          <a-select v-model:value="panelFlag" placeholder="" style="justify-content: space-between;width: 120px;border:none;border-bottom: 1px solid black;" v-if="ncHrMark == ''">
            <a-select-option key="1" value="1">系统方案</a-select-option>
            <a-select-option key="2" value="2">个人方案</a-select-option>
          </a-select>-->
<!--          <Button v-else @click="toggleRight('')">返回主页</Button>-->
        </div>
      </div>
      <div class="nc-hrt-two">
        <div class="nc-hrtt-one">
          <AccountPicker theme="three" @reloadTable="reloadTable"/>
        </div>
        <div>
<!--          <Button @click="delCache">缓存</Button>-->
        </div>
        <div class="nc-hrtt-two">
<!--          <span style="font-size: 18px;font-weight: bold;color: #1c6ca1;margin-top: .5%">凭证最新日期：{{pingZhengNewestDate || '暂无凭证'}}</span>-->
<!--          <span>业务日期：</span>
          <a-date-picker v-model:value="props.modelValue.loginDate" value-format="YYYY-MM-DD"
                         format="YYYY-MM-DD"/>-->
        </div>
<!--        <div class="nc-hrtt-three">
          <a-select placeholder="" style="width: 130px;border-radius: 4px;text-align: left" default-value="1">
            <a-select-option key="1" value="1">凭证编号</a-select-option>
            <a-select-option key="2" value="2">凭证摘要</a-select-option>
            <a-select-option key="3" value="3">会计科目编码</a-select-option>
            <a-select-option key="4" value="4">会计科目名称</a-select-option>
            <a-select-option key="5" value="5">发票抬头</a-select-option>
          </a-select>
          <a-input-search placeholder="" style="width: 200px; border-radius: 4px;"/>
        </div>-->
      </div>
    </div>
    <template v-if="ncHrMark==''">
      <div class="nc-hr-middle" :style="bgStyle2">
        <Steps :current="0" size="small" type="default">
          <template #progressDot="{ index, status, prefixCls }">
            <a-popover>
              <template #content>
                <span>step {{ index }} status: {{ status }}</span>
              </template>
              <HeartFilled/>
              <!--            <SmileOutlined style="font-size: 20px"/>-->
              <!--            <span :class="`${prefixCls}-icon-dot`" />-->
            </a-popover>
          </template>
          <Step title="期初余额">
            <template #description>
              <span>存货期初余额</span><br/>
              <span>期初到货单</span><br/>
              <span>期初销货单</span><br/>
              <span>期初暂估入库单</span>
            </template>
          </Step>

          <Step title="采购业务">
            <template #description>
              <span>采购订单</span><br/>
              <span>采购到货单</span><br/>
              <span>采购发票</span><br/>
              <span>采购结算</span>
            </template>
          </Step>
          <Step title="销售业务">
            <template #description>
              <span>销售订单</span><br/>
              <span>销货单</span><br/>
              <span>批量销货单</span><br/>
              <span>销售发票</span>
            </template>
          </Step>
          <Step title="库存业务">
            <template #description>
              <span>拣货装箱</span><br/>
              <span>盘点单</span>
              <span>调拨单</span><br/>
              <span>形态转换单</span>
            </template>
          </Step>
          <Step title="成本核算">
            <template #description>
              <span>自动成本核算</span><br/>
              <span>入库调整单</span><br/>
              <span>出库调整单</span>
            </template>
          </Step>
          <Step title="凭证制单">
            <template #description>
              <span>入库单制单</span><br/>
              <span>出库单制单</span><br/>
              <span>其他出入库制单</span>
            </template>
          </Step>
          <Step title="月末结账">
            <template #description>
              <span>月末结账</span><br/>
              <span>取消结账</span><br/>
<!--              <span class="derlined-span-white">结束</span>-->
            </template>
          </Step>
        </Steps>
      </div>
      <HomeRightBottom  class="nc-hr-bottom" :pageAccId="database" @toggle="toggleRight"  @routing="goRouter"/>
    </template>
    <template v-if="ncHrMark=='CG'">
      <HomeRightBottomCg @toggle="toggleRight" @routing="goRouter"/>
    </template>
    <template v-if="ncHrMark=='XS'">
      <HomeRightBottomXs @toggle="toggleRight" @routing="goRouter"/>
    </template>
    <template v-if="ncHrMark=='KC'">
      <HomeRightBottomKc @toggle="toggleRight" @routing="goRouter"/>
    </template>
  </div>
</template>
<script setup lang="ts">
import { SmileOutlined, HeartFilled} from '@ant-design/icons-vue';
import {
  Input as AInput,
  Select as ASelect,
  Popover as APopover,
  Steps,Button,
  DatePicker as ADatePicker
} from "ant-design-vue";
import HomeRightBottom from './HomeRightBottom-Stock.vue';
import HomeRightBottomXs from './HomeRightBottom-Stock-Xs.vue';
import HomeRightBottomCg from './HomeRightBottom-Stock-Cg.vue';
import HomeRightBottomKc from './HomeRightBottom-Stock-Kc.vue';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {ref, nextTick, provide} from "vue";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
import {
  recrawlResetStockAccountCache
} from "/@/boozsoft/components/AccountPicker/utils/accountUtils";
import router from "/@/router";
const Step = Steps.Step
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const props = defineProps(['modelValue'])
const database = ref('');
const accYear = ref('');
const sonRefresh = ref(false);
const pingZhengNewestDate = ref('2021-01-01')
const ncHrMark = ref('')
const panelFlag=ref('1')
const bgStyle='background-image: url(\''+new URL('/img/bg/010.png', import.meta.url).href+'\')'
const bgStyle2='background-image: url(\''+new URL('/assets/images/homes/home-block.png', import.meta.url).href+'\')'
let num = 0
num+=1
const reloadTable = async (e) => {
  if (num != 2) {
    useAccountPickerCache().set(e)
  }
 /* nextTick().then(() => {
  sonRefresh.value=false
    sonRefresh.value=true
  })*/
  // 获取每次凭证切换后 凭证最新日期
}
const delCache = async () => {
 await recrawlResetStockAccountCache()
}
const showTitle = (t) => {
  return t=='CG'?'采购业务流程':t=='XS'?'销售业务流程':t=='KC'?'库存业务流程':'存货管理'
}
const toggleRight = (t) => {
  ncHrMark.value = t
  console.log(t)
}
// 金额格式化
async function goRouter(path) {
  router.push(path/*{
    path: path,
   /!* query: {},*!/
  }*/);
}
</script>
<style lang="less" scoped>
.nc-hr {
  .nc-hr-top {
    font-weight: bold;
    color: #545454;
    height: 120px;
    background-color: #f1f1f1;
    //background-image: url(/nc/img/bg/010.png);
    background-position: 75% 50%;
    background-repeat: no-repeat;
    .nc-hrt-one {
      padding: 1% 3% 0;
      display: flex;
      justify-content: space-between;

      :deep(.ant-select-selector) {
        border: none;
      }
    }

    .nc-hrt-two {
      padding: 1.2% 3% 0;
      display: flex;justify-content: space-between;

      div {
        :deep(.ant-select-selector), :deep(.ant-input-search) {
          border-color: #d2cfcf;
        }
      }

      .nc-hrtt-one {
        display: block;
        width: 40%;
      }

      .nc-hrtt-two {
        :deep(.ant-calendar-picker) {
          width: 120px;
          .ant-calendar-picker-input {
            border: 1px solid #d2cfcf;
            border-radius: 5px;
            color: black;
          }
        }
      }
      .nc-hrtt-three{
        text-align: right;
        width: calc(100% - 40% - 200px);
      }
    }
  }

  .nc-hr-middle {
    height: 160px;
    //background-image: url(/@/assets/images/homes/home-block.png);
    background-repeat: repeat;
    padding: 30px 35px 0;

    :deep(.ant-steps-item-content) {
      .ant-steps-item-title {
        color: white;
        font-size: 20px;
      }

      .ant-steps-item-description {
        color: white;

        .derlined-span-white {
          border: 1px solid white;
          width: 80px;
          display: inline-flex;
          justify-content: center;
          font-weight: bold;
          border-radius: 4px;
        }

        .derlined-span-white:hover {
          cursor: pointer;
          background-color: slategrey;
        }
      }
    }
  }
}
</style>
