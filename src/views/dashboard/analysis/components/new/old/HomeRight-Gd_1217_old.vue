<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hrt-one">
        <span style="font-size: 26px;font-weight: bold;color: black">固定资产数据</span>
<!--        <a-select placeholder="点击下来菜单相应视图" style="justify-content: space-between;width: 350px;border:none;border-bottom: 1px solid black;">

        </a-select>-->
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
          <a-select placeholder="" style="width: 130px;border-radius: 4px;text-align: left"
                    default-value="1">
            <a-select-option key="1" value="1">凭证编号</a-select-option>
            <a-select-option key="2" value="2">凭证摘要</a-select-option>
            <a-select-option key="3" value="3">会计科目编码</a-select-option>
            <a-select-option key="4" value="4">会计科目名称</a-select-option>
            <a-select-option key="5" value="5">发票抬头</a-select-option>
          </a-select>
          <a-input-search placeholder="" style="width: 200px; border-radius: 4px;"/>
          <a-button style="margin-left: 2px;">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </a-button>
        </div>
      </div>
    </div>
    <div class="nc-hr-middle">
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
        <Step title="资产管理">
          <template #description>
            <span>所有固定资产</span><br/>
            <span class="derlined-span-white">资产列表</span>
          </template>
        </Step>

        <Step title="新增资产">
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">添加资产</span>
          </template>
        </Step>
        <Step title="低值易耗品"  >
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">办公领用</span>
          </template>
        </Step>
        <Step title="资产变动">
          <template #description>
            <span></span><br/>
<!--            <span class="derlined-span-white"></span>-->
          </template>
        </Step>
        <Step title="计提折旧">
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">计提折旧</span>
          </template>
        </Step>
        <Step title="凭证处理" >
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">凭证生成</span>
          </template>
        </Step>
        <Step title="月末结账" >
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">月末结账</span>
          </template>
        </Step>
      </Steps>
    </div>
     <HomeRightBottom class="nc-hr-bottom" v-model="props.modelValue"/>
  </div>
</template>
<script setup lang="ts">
import {SyncOutlined, SmileOutlined, HeartFilled} from '@ant-design/icons-vue';
// import HomeRightBottom from './HomeRightBottom-Gd.vue';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {onMounted, reactive} from "vue";
import {useModal} from "/@/components/Modal";
import {
  Input as AInput,
  Select as ASelect,
  Popover as APopover,
  Steps,
  DatePicker as ADatePicker
} from "ant-design-vue";
import {getGlobalFinanceSettingInfo} from "/@/api/record/system/financial-settings";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
const AInputSearch  = AInput.Search
const ASelectOption = ASelect.Option
const Step = Steps.Step
const props=defineProps(['modelValue'])
const 会计准则 = props.modelValue.thisAdInfo.accStandard
const dynamicAdReload =async (e) => {
  e.settings = await getGlobalFinanceSettingInfo(e.accId)
  useAccountPickerCache().set(e)
}
</script>
<style lang="less" scoped>
.nc-hr{
  .nc-hr-top{
    font-weight: bold;
    color: #545454;
    height: 120px;
    background-color: white;
    .nc-hrt-one{
      padding: .6% 3% 0;
      display: flex;
      justify-content: space-between;
      :deep(.ant-select-selector){
        border: none;
      }
    }
    .nc-hrt-two {
      padding: 1.2% 3% 0;
      display: flex;

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

      .nc-hrtt-three {
        text-align: right;
        width: calc(100% - 40% - 200px);

        :deep(.ant-select-selector), :deep(.ant-input-search) {
          border-color: #d2cfcf;
        }

        .ant-btn {
          border-color: #d2cfcf;
        }

        .ant-btn:hover {
          background-color: #0096c7;
          color: white;
        }
      }
    }
  }
  .nc-hr-middle{
    height: 160px;
    background-image: url(/@/assets/images/homes/home-block.png);
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
