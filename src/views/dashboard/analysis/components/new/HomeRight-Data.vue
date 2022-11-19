<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hrt-one">
        <AccountPicker theme="three" @reloadTable="dynamicAdReload"/>
        <!--        <span style="font-size: 30px;font-weight: bold;color: #1c6ca1">主数据设置</span>-->
        <SearchPiece :dynamicTenantId="dynamicTenantId"/>
<!--        <div>
          <a-select placeholder="" v-model:value="searchModel.condition"
                    :options="conditionOptions"/>
          <a-input-search placeholder="" v-model:value="searchModel.content" @search="onSearch"/>
        </div>-->
      </div>
      <!--      <div class="nc-hrt-two">
              <div class="nc-hrtt-one">
                <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
              </div>
              <div class="nc-hrtt-two">
      &lt;!&ndash;          <span>业务日期：</span>
                <a-date-picker v-model:value="props.modelValue.loginDate" value-format="YYYY-MM-DD"
                               format="YYYY-MM-DD"/>&ndash;&gt;
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
            </div>-->
    </div>
    <!--    <div class="nc-hr-middle">-->
    <!--      <Steps :current="0" size="small" type="default">-->
    <!--        <template #progressDot="{ index, status, prefixCls }">-->
    <!--          <a-popover>-->
    <!--            <template #content>-->
    <!--              <span>step {{ index }} status: {{ status }}</span>-->
    <!--            </template>-->
    <!--            <HeartFilled/>-->
    <!--            &lt;!&ndash;            <SmileOutlined style="font-size: 20px"/>&ndash;&gt;-->
    <!--            &lt;!&ndash;            <span :class="`${prefixCls}-icon-dot`" />&ndash;&gt;-->
    <!--          </a-popover>-->
    <!--        </template>-->
    <!--        <Step title="会计期间">-->
    <!--          <template #description>-->
    <!--            <span></span><br/>-->
    <!--            <span class="derlined-span-white">年度建账</span>-->
    <!--          </template>-->
    <!--        </Step>-->

    <!--        <Step title="会计科目">-->
    <!--          <template #description>-->
    <!--            <span></span><br/>-->
    <!--            <span class="derlined-span-white">年度科目</span>-->
    <!--          </template>-->
    <!--        </Step>-->
    <!--        <Step title="凭证类别">-->
    <!--          <template #description>-->
    <!--            <span></span><br/>-->
    <!--            <span class="derlined-span-white">凭证分类</span>-->
    <!--          </template>-->
    <!--        </Step>-->
    <!--        <Step title="结算方式">-->
    <!--          <template #description>-->
    <!--            <span></span><br/>-->
    <!--            <span class="derlined-span-white">银行结算</span>-->
    <!--          </template>-->
    <!--        </Step>-->
    <!--        <Step title="现金流量">-->
    <!--          <template #description>-->
    <!--            <span></span><br/>-->
    <!--            <span class="derlined-span-white">对应科目设置</span>-->
    <!--          </template>-->
    <!--        </Step>-->
    <!--      </Steps>-->
    <!--    </div>-->
    <HomeRightBottom class="nc-hr-bottom" :loading="loading" :dynamicTenantId="dynamicTenantId" :type="dynamicType"/>
  </div>
</template>
<script setup lang="ts">
import {SyncOutlined, SmileOutlined, HeartFilled} from '@ant-design/icons-vue';
import {
  Input as AInput,
  Select as ASelect,
  Popover as APopover,
  Steps,
  DatePicker as ADatePicker,message
} from "ant-design-vue";
import HomeRightBottom from './HomeRightBottom-Data.vue';
import {ref, reactive} from "vue";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-DATA.vue";
import {getGlobalFinanceSettingInfo,} from "/@/api/record/system/financial-settings";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import SearchPiece from "/@/views/dashboard/analysis/components/new/etc-components/SearchPiece.vue";

const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const Step = Steps.Step
const props = defineProps(['modelValue'])
const loading = ref(false);
const dynamicTenantId = ref('');
const dynamicType = ref('');
const dynamicAdReload = async (obj) => {
  dynamicTenantId.value = obj.accountMode
  obj.settings = await getGlobalFinanceSettingInfo(obj.accId)
  useAccountPickerCache().set(obj)
  dynamicType.value = obj.target.ztStyle
  if (null != obj && null != obj.accId && obj.accId != '') {
    // await resetPageData(obj.accId, obj.year)
  }
}
const bgStyle2='background-image: url(\''+new URL('/assets/images/homes/home-block.png', import.meta.url).href+'\')'
</script>
<style lang="less" scoped>
.nc-hr {
  .nc-hr-top {
    font-weight: bold;
    color: #545454;
    height: 52px;
    background-color: #f1f1f1;

    .nc-hrt-one {
      padding: .6% 3% 0;
      display: flex;
      justify-content: space-between;

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
          width: 100px;
          border: 1px solid white;
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
