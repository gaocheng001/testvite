<template>
  <div class="nc-hr">
    <div class="nc-hr-top" :style="bgStyle">
      <div class="nc-hrt-one">
        <span style="font-size: 30px;font-weight: bold;color: #1c6ca1">会计</span>
        <div>
          <a-select v-model:value="panelFlag" placeholder="" style="justify-content: space-between;width: 120px;border:none;border-bottom: 1px solid black;">
            <a-select-option key="1" value="1">系统方案</a-select-option>
            <a-select-option key="2" value="2">个人方案</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="nc-hrt-two">
        <div class="nc-hrtt-one">
          <AccountPicker theme="one" @reloadTable="reloadTable"/>
        </div>
        <div>
<!--          <Button @click="delCache">缓存</Button>-->
        </div>
        <div class="nc-hrtt-two">
          <span style="font-size: 18px;font-weight: bold;color: #1c6ca1;margin-top: .5%">凭证最新日期：{{pingZhengNewestDate || '暂无凭证'}}</span>
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
    <div class="nc-hr-middle"  :style="bgStyle2">
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
            <span>手动设置或自动结转上年</span><br/>
            <span class="derlined-span-white">开始</span>
          </template>
        </Step>

        <Step title="填制凭证">
          <template #description>
            <span>手动设置或自动结转上年</span><br/>
            <span class="derlined-span-white">日常工作</span>
          </template>
        </Step>
        <Step title="">
          <template #description>
            <span>出纳签字</span><br/>
            <span>审核签字</span><br/>
            <span>主管签字</span>
          </template>
        </Step>
        <Step title="">
          <template #description>
            <span>自定义结转</span><br/>
            <span>销售成本结转</span><br/>
            <span>汇兑损益结转</span>
          </template>
        </Step>
        <Step title="期间损益结转">
          <template #description>
            <span>期间损益结转本年利润</span><br/>
            <span class="derlined-span-white">可选任务</span>
          </template>
        </Step>
        <Step title="记账">
          <template #description>
            <span>所以有效凭证登账并锁定</span><br/>
            <span class="derlined-span-white">凭证记账</span>
          </template>
        </Step>
        <Step title="月末结账">
          <template #description>
            <span>当月所以数据关账</span><br/>
            <span class="derlined-span-white">结束</span>
          </template>
        </Step>
      </Steps>
    </div>
    <HomeRightBottom v-if="sonRefresh" class="nc-hr-bottom" :pageAccId="database" :accYear="accYear"/>
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
import HomeRightBottom from './HomeRightBottom-Zz.vue';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {ref, nextTick, provide} from "vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findNewDate} from "/@/api/record/system/accvoucher";
import {
  getGlobalFinanceSettingInfo
} from "/@/api/record/system/financial-settings";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
import {ACCOUNT_LIST_KEY, AUTHORIZE_LIST_KEY} from "/@/enums/cacheEnum";
import {recrawlResetAccountCache} from "/@/boozsoft/components/AccountPicker/utils/accountUtils";
const Step = Steps.Step
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const props = defineProps(['modelValue'])
const database = ref('');
const accYear = ref('');
const sonRefresh = ref(false);
const pingZhengNewestDate = ref('2021-01-01')

const panelFlag=ref('1')
const reloadTable = async (e) => {
  database.value=e.accountMode
  accYear.value=e.iyear
  e.settings = await getGlobalFinanceSettingInfo(e.accId);
  useAccountPickerCache().set(e)
  sonRefresh.value=false
  nextTick().then(() => {
    sonRefresh.value=true
  })
  // 获取每次凭证切换后 凭证最新日期
  pingZhengNewestDate.value = await useRouteApi(findNewDate,{schemaName:e.accountMode })({});
}
provide('panelFlag',panelFlag)
const delCache = async () => {
 await recrawlResetAccountCache()
}
const bgStyle='background-image: url(\''+new URL('/img/bg/010.png', import.meta.url).href+'\')'
const bgStyle2='background-image: url(\''+new URL('/assets/images/homes/home-block.png', import.meta.url).href+'\')'
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
