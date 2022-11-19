<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hr-top-left">
        <div>
          <Avatar src="" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 80 }">
            <UnlockFilled style="font-size: 30px;color: #146dc1;" />
          </Avatar>
        </div>
        <div>
          <span>多任务网络版</span><br/>
          <span>网络版任务及数据锁定保护</span>
        </div>
      </div>
      <div class="nc-hr-top-right">
        <div>
          <Rate v-model:value="rateValue" allow-half/>
          <br/>
          <span>99.99%数据完整性机制保护</span>
        </div>
        <div>
          <span>了解锁定保护机制及说明</span>
        </div>
      </div>
    </div>
    <div class="nc-hrm-body" :style="{maxHeight: windowHeight+'px'}">
        <OperatorIndex/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {
  AppstoreOutlined,
  AccountBookOutlined,
  AimOutlined,
  BlockOutlined,
  DollarCircleOutlined,
  EuroOutlined,
  GroupOutlined,
  HddOutlined,
  InsertRowBelowOutlined,
  GatewayOutlined,
  OneToOneOutlined,
  ReconciliationOutlined,UnlockFilled,SyncOutlined,FilterFilled
} from '@ant-design/icons-vue';
import {
  Input, Select, Button,
  Tag, DatePicker as ADatePicker, Avatar,
  Steps, Rate, message
} from "ant-design-vue";
import {onMounted, reactive, ref} from "vue";

const Step = Steps.Step
const InputSearch = Input.Search
const SelectOption = Select.Option
const props = defineProps(['modelValue'])
const windowHeight = (window.innerHeight - (280))

import {useMessage} from "/@/hooks/web/useMessage";
const rateValue = ref(4)
import OperatorIndex from '/@/views/boozsoft/global/user/index-home.vue';
</script>
<style lang="less" scoped>
.nc-hr {
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
        padding: 5%;

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

    >div:nth-of-type(1){
      width: 15%;
      text-align: center;
    }
    >div:nth-of-type(2){
      >span{
        color: red;
      }
    }

    .ant-btn{
      border-color: #c9c9c9
    }
  }
  .nc-hrm-body {
    width: 100%;
  }
}
</style>
