<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hrt-one">
        <span style="font-size: 30px;font-weight: bold;color: #1c6ca1">出纳</span>
        <span style="font-size: 18px;font-weight: bold;color: #1c6ca1;margin-top: .5%">凭证最新日期：2021-12-12</span>
      </div>
      <div class="nc-hrt-two">
        <div class="nc-hrtt-one">
          <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
        </div>
        <div class="nc-hrtt-two">
<!--          <span>业务日期：</span>
          <a-date-picker v-model:value="props.modelValue.loginDate" value-format="YYYY-MM-DD"
                         format="YYYY-MM-DD"/>-->
        </div>
        <div class="nc-hrtt-three">
          <a-select placeholder="" style="width: 130px;border-radius: 4px;text-align: left" default-value="1">
            <a-select-option key="1" value="1">凭证编号</a-select-option>
            <a-select-option key="2" value="2">凭证摘要</a-select-option>
            <a-select-option key="3" value="3">会计科目编码</a-select-option>
            <a-select-option key="4" value="4">会计科目名称</a-select-option>
            <a-select-option key="5" value="5">发票抬头</a-select-option>
          </a-select>
          <a-input-search placeholder="" style="width: 200px; border-radius: 4px;"/>
        </div>
      </div>
    </div>
    <div class="nc-hr-middle" :style="bgStyle2">
      <Steps :current="0" size="small" type="default">
        <template #progressDot="{ index, status, prefixCls }">
          <a-popover>
            <template #content>
              <span>step {{ index }} status: {{ status }}</span>
            </template>
            <HeartFilled />
<!--            <SmileOutlined style="font-size: 20px"/>-->
<!--            <span :class="`${prefixCls}-icon-dot`" />-->
          </a-popover>
        </template>
        <Step title="银行对账期初">
          <template #description>
            <span>检查未达账项，调整平衡</span><br/>
            <span class="derlined-span-white">初始化对账</span>
          </template>
        </Step>

        <Step title="出纳签字">
          <template #description>
            <span>对现金银行凭证进行确认签字</span><br/>
            <span class="derlined-span-white">出纳凭证</span>
          </template>
        </Step>
        <Step title="银行对账"  >
          <template #description>
            <span>引入银行对账单并对账核销</span><br/>
            <span class="derlined-span-white">对账核销</span>
          </template>
        </Step>
        <Step title="承兑汇票">
          <template #description>
            <span>管理承兑汇票</span><br/>
            <span class="derlined-span-white">票据管理</span>
          </template>
        </Step>
        <Step title="资金情况" >
          <template #description>
            <span>设置资产情况表科目</span><br/>
            <span class="derlined-span-white">对应科目设置</span>
          </template>
        </Step>
      </Steps>
    </div>
     <HomeRightBottom v-if="sonRefresh" class="nc-hr-bottom" v-model="props.modelValue" :pageAccId="database" :accYear="accYear"/>
  </div>
</template>
<script setup lang="ts">
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {SearchOutlined,SmileOutlined,HeartFilled} from '@ant-design/icons-vue';
import {message, Input as AInput ,Select as ASelect,Popover as APopover,Steps,  DatePicker as ADatePicker} from "ant-design-vue";
import HomeRightBottom from './HomeRightBottom-Xj.vue';
import {nextTick, onMounted, provide, reactive, ref} from "vue";
import {useModal} from "/@/components/Modal";
const Step = Steps.Step
const AInputSearch  = AInput.Search
const ASelectOption = ASelect.Option
const props=defineProps(['modelValue'])
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {getGlobalFinanceSettingInfo} from "/@/api/record/system/financial-settings";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
const 会计准则 = props.modelValue.thisAdInfo.accStandard
const database = ref('');
const accYear = ref('');
const sonRefresh = ref(false);
const panelFlag=ref('1')
const dynamicAdReload = async (e) => {
  accYear.value=e.iyear
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
.nc-hr{
  .nc-hr-top{
    font-weight: bold;
    color: #545454;
    height: 120px;
    background-color: #f1f1f1;
    .nc-hrt-one{
      padding: 1% 3% 0;
      display: flex;
      justify-content: space-between;
      :deep(.ant-select-selector){
        border: none;
      }
    }
    .nc-hrt-two{
      padding: 1.2% 3% 0;
      display: flex;
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
  .nc-hr-middle{
    height: 160px;
    //background-image: url(/@/assets/images/homes/home-block.png);
    background-repeat: repeat;
    padding: 30px 35px 0;
    :deep(.ant-steps-item-content){
      .ant-steps-item-title{
        color: white;
        font-size: 20px;
      }
      .ant-steps-item-description{
        color: white;
        .derlined-span-white{
          width: 100px;
          border: 1px solid white;  display: inline-flex; justify-content: center;
          font-weight: bold;
          border-radius: 4px;
        }
        .derlined-span-white:hover{
          cursor: pointer;
          background-color: slategrey;
        }
      }
    }
  }
}
</style>
