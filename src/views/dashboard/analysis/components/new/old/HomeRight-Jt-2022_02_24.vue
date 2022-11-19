<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hrtt-two">
<!--        <span>业务日期：</span>
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
        <Step title="集团信息">
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">开始</span>
          </template>
        </Step>

        <Step title="规划组织">
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">统一规则</span>
          </template>
        </Step>
        <Step title="初始化账套"  >
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">建立公司</span>
          </template>
        </Step>
        <Step title="操作授权">
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">账务处理</span>
          </template>
        </Step>
      </Steps>
    </div>
    <div class="nc-hr-temp">
        <HomeRightBottomTags/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {SearchOutlined,SmileOutlined,HeartFilled} from '@ant-design/icons-vue';
import {message, Input as AInput ,Select as ASelect,Popover as APopover,Steps,DatePicker as ADatePicker} from "ant-design-vue";
import {onMounted, reactive} from "vue";
import {useModal} from "/@/components/Modal";
import HomeRightBottomTaskAndMsg
  from "/@/views/dashboard/analysis/components/new/HomeRightBottomTaskAndMsg.vue";
import HomeRightBottomTags
  from "/@/views/dashboard/analysis/components/new/HomeRightBottomTags.vue";

const AInputSearch  = AInput.Search
const ASelectOption = ASelect.Option
const Step = Steps.Step
const props=defineProps(['modelValue'])
const 会计准则 = props.modelValue.thisAdInfo.accStandard
</script>
<style lang="less" scoped>
.nc-hr{
  .nc-hr-top{
    display: flex;
    justify-content: space-around;
    font-weight: bold;
    color: #545454;
    height: 50px;
    background-color: #f1f1f1;
    padding: 10px;
    .nc-hrtt-two{
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
      :deep(.ant-select-selector), :deep(.ant-input-search){
        border-color: #d2cfcf;
      }
    }
  }
  .nc-hr-middle{
    height: 140px;
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
  .nc-hr-temp{
    height: 300px;
    background-color: #1c6ca1;
    padding: 1.5%;

  }
}
</style>
