<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hrt-two">
        <div>
          <span>组织：</span>
          <a-select placeholder="" style="width: 300px;" :default-value="0">
            <!--  :value="item.uniqueCode"      -->
            <a-select-option v-for="(item,index) in props.modelValue.orgList" :key="index"   >{{item.orgName}}</a-select-option>
          </a-select>
        </div>
<!--          <span>公司简称：<span class="increase-bold">{{props.modelValue.thisAdInfo.accNameCn}}</span></span>
          <span>业务日期：<span class="underlined-span increase-bold">{{props.modelValue.loginDate || '2021-01-01'}}</span></span>-->
          <div>
            <span>检索条件：</span>
            <a-select placeholder="" style="width: 120px;border-radius: 4px;border: 1px solid black;" default-value="1">
              <a-select-option key="0" value="1">会计科目</a-select-option>
            </a-select>
            <a-input-search placeholder="" style="width: 300px; border-radius: 4px;border: 1px solid black;" />
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
        <Step title="组织管理">
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">年度建账</span>
          </template>
        </Step>

        <Step title="公司或单位">
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">年度科目</span>
          </template>
        </Step>
        <Step title="会计"  >
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">凭证分类</span>
          </template>
        </Step>
        <Step title="业务组">
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">银行结算</span>
          </template>
        </Step>
        <Step title="参数设置" >
          <template #description>
            <span></span><br/>
            <span class="derlined-span-white">对应科目设置</span>
          </template>
        </Step>
      </Steps>
    </div>
     <HomeRightBottom class="nc-hr-bottom" v-model="props.modelValue"/>
  </div>
</template>
<script setup lang="ts">
import {SearchOutlined,SmileOutlined,HeartFilled} from '@ant-design/icons-vue';
import {message, Input as AInput ,Select as ASelect,Popover as APopover,Steps} from "ant-design-vue";
// import HomeRightBottom from './HomeRightBottom-Org.vue';
import {onMounted, reactive} from "vue";
import {useModal} from "/@/components/Modal";
const AInputSearch  = AInput.Search
const ASelectOption = ASelect.Option
const Step = Steps.Step
const props=defineProps(['modelValue'])
const 会计准则 = props.modelValue.thisAdInfo.accStandard

</script>
<style lang="less" scoped>
.nc-hr{
  .nc-hr-top{
    font-weight: bold;
    color: #545454;
    height: 60px;
    background-color: white;
    .nc-hrt-one{
      padding: .6% 3% 0;
      display: flex;
      justify-content: space-between;
    }
    .nc-hrt-two{
      padding: 1.2% 3% 0;
      display: flex;
      justify-content: space-between;
      .underlined-span{
        border-bottom: 1px solid black; width: 120px; display: inline-flex; justify-content: center;
      }
      .increase-bold{
        color: black;
      }
      >div:nth-of-type(1){
        :deep(.ant-select-selector){
          border: 0;
          border-bottom: 1px solid black;
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
