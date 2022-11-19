<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hrt-one">
        <span style="font-size: 30px;font-weight: bold;color: #1c6ca1">应收款管理</span>
        <div>

<!--          <a-select v-model:value="panelFlag" placeholder="" style="justify-content: space-between;width: 120px;border:none;border-bottom: 1px solid black;">
            <a-select-option key="1" value="1">系统方案</a-select-option>
            <a-select-option key="2" value="2">个人方案</a-select-option>
          </a-select>-->
        </div>
      </div>
      <div class="nc-hrt-two">
        <div class="nc-hrtt-one">
          <AccountPicker theme="three" @reloadTable="dynamicAdReload"/>
        </div>
<!--        <div>
          <span style="font-size: 18px;font-weight: bold;color: #1c6ca1;margin-top: .5%">凭证最新日期：2021-12-12</span>
        </div>-->
        <div class="nc-hrtt-two">

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
            <span>应收款期初</span><br/>
            <span>期初应收单</span><br/>
            <span class="derlined-span-white">开始</span>
          </template>
        </Step>

        <Step title="应收业务">
          <template #description>
            <span>应收单</span><br/>
            <span>销售发票</span><br/>
          </template>
        </Step>
        <Step title="收款">
          <template #description>
            <span>选择收款</span><br/>
            <span>收款单</span><br/>
          </template>
        </Step>

        <Step title="核销">
          <template #description>
            <span>手动核销</span><br/>
            <span>自动核销</span><br/>
          </template>
        </Step>

        <Step title="往来转账">
          <template #description>
            <span>预收冲应收</span><br/>
            <span>应收冲应收</span><br/>
            <span>应收冲应付</span><br/>
<!--            <span class="derlined-span-white">对应结转</span>-->
          </template>
        </Step>
        <Step title="凭证制单">
          <template #description>
            <span>应收制单</span><br/>
            <span>收款制单</span><br/>
            <span>核销制单</span><br/>
            <span>转账制单</span><br/>
          </template>
        </Step>
        <Step title="月末结账">
          <template #description>
            <span>月末检查</span><br/>
            <span>月末结账</span><br/>
            <span>取消结账</span><br/>
            <span class="derlined-span-white">结束</span>
          </template>
        </Step>
      </Steps>
    </div>
    <HomeRightBottom v-if="sonRefresh" class="nc-hr-bottom" :pageAccId="database"/>
  </div>
</template>
<script setup lang="ts">
import { SmileOutlined, HeartFilled} from '@ant-design/icons-vue';
import {
  Input as AInput,
  Select as ASelect,
  Popover as APopover,
  Steps,
  DatePicker as ADatePicker
} from "ant-design-vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import HomeRightBottom from './HomeRightBottom-Ysk.vue';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {ref, nextTick, provide} from "vue";
import {getGlobalFinanceSettingInfo} from "/@/api/record/system/financial-settings";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
const Step = Steps.Step
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const props = defineProps(['modelValue'])
const database = ref(getCurrentAccountName(true));
const sonRefresh = ref(true);

const panelFlag=ref('1')
const dynamicAdReload = async (e) => {
  props.modelValue.dynamicAdModel = e
  database.value=e.accountMode
  e.settings = await getGlobalFinanceSettingInfo(e.accId)
  useAccountPickerCache().set(e)
  sonRefresh.value=false
  nextTick().then(() => {
    sonRefresh.value=true
  })
}
provide('panelFlag',panelFlag)
const bgStyle2='background-image: url(\''+new URL('/assets/images/homes/home-block.png', import.meta.url).href+'\')'
</script>
<style lang="less" scoped>
.nc-hr {
  .nc-hr-top {
    font-weight: bold;
    color: #545454;
    height: 120px;
    background-color: #f1f1f1;

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
