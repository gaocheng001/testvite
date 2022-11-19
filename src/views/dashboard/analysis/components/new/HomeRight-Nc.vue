<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hr-top-left">
        <div>
          <Avatar src="" :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 80 }">
            <HomeFilled style="font-size: 40px;color: black;margin-top: 40%;" />
          </Avatar>
        </div>
        <div>
          <span>欢迎使用</span><br/>
          <span>财税达应用软件平台</span>
        </div>
      </div>
      <div class="nc-hr-top-right">
        <div>
          <Rate v-model:value="rateValue" allow-half/>
          <br/>
          <span>100%自主可控、版权无忧</span>
        </div>
        <div>
          <span>进入在线应用商城</span>
        </div>
      </div>
    </div>
    <div class="nc-hr-middle">
      <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
    </div>
    <div class="nc-hrm-body" :style="{maxHeight: windowHeight+'px'}">
      <a-row type="flex">
        <a-col :span="8" v-for="(item,index) in platforms"
               @click="platforms.platformId==0?null:layoutsStore.switchPlatform({ id: item.platformId })">
          <div>
            <div>
              <!--              <img v-bind:src="imgValue(index)">-->
              <AppstoreOutlined v-if="index == 0"/>
              <AccountBookOutlined v-else-if="index == 1"/>
              <AimOutlined v-else-if="index == 2"/>
              <BlockOutlined v-else-if="index == 3"/>
              <DollarCircleOutlined v-else-if="index == 4"/>
              <EuroOutlined v-else-if="index == 5"/>
              <GroupOutlined v-else-if="index == 6"/>
              <HddOutlined v-else-if="index == 7"/>
              <InsertRowBelowOutlined v-else-if="index == 8"/>
              <GatewayOutlined v-else-if="index == 9"/>
              <OneToOneOutlined v-else-if="index == 10"/>
              <ReconciliationOutlined v-else/>
            </div>
          </div>
          <div>
            <span>{{ item.title }}</span><br/>
            <span :title="item.legend">{{ item.legend }}</span>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  HomeFilled,
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
  ReconciliationOutlined
} from '@ant-design/icons-vue';
import {
  Input as AInput, Select as ASelect, Popover as APopover, Button as AButton,
  Row as ARow, DatePicker as ADatePicker, Avatar,
  Col as ACol, Steps, Rate
} from "ant-design-vue";
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {ref} from "vue";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";

const Step = Steps.Step
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const props = defineProps(['modelValue'])
const layoutsStore = usePlatformsStoreWidthOut();
const windowHeight = (window.innerHeight - (280))

const rateValue = ref(4)
const colorlists = [
  'rgb(229, 0, 19)',
  'rgb(206,194,28)',
  'rgb(0,161,233)',
  'rgb(109,185,45)',
  'rgb(166,0,130)',
  'rgb(237,108,0)',
  'rgb(240, 28, 131)',
  'rgb(84, 21, 226)',
  'rgb( 0,128,0)',
  'rgb( 255,69,0)',
  'rgb( 255,165,0)',
  'rgb( 178,34,34)',
  'rgb( 255,0,255)',
  'rgb(65,105,225)',
  'blueviolet'
]
let platforms = ref([
  {
    title: '总账',
    legend: '凭证添加、总分类账和余额表',
    platformId: 1001,
  },
  {
    title: '现金银行',
    legend: '出纳工作平台、银行对账和承兑汇票业务',
    platformId: 1006,
  }, {
    title: '报表中心',
    legend: '税务报表、集团报表和管理报表和业务报表集成平台',
    platformId: 10131200,
  }, {
    title: '网上报销',
    legend: '在线费控报销系统，只能发票识别、验重和验真',
    platformId: 20005,
  }, {
    title: '固定资产',
    legend: '资产卡片管理、实现折旧分摊和凭证自动生单',
    platformId: 20001,
  }, {
    title: '薪酬管理',
    legend: '支持2019个税法规、集团化多类别和多次发放',
    platformId: 20013,
  },
  {
    title: '存货管理',
    legend: '进销存业务单据的填制、审核及业务流管理',
    platformId: 1099,
  }, {
    title: '主数据',
    legend: '平台基础档案管理，包含所有公用或共享档案信息',
    platformId: 20007,
  }, {
    title: '集团管理',
    legend: '集团账套架构管理，组织和公司设置，集团管控档案设置',
    platformId: 1003,
  }, {
    title: '组织管理',
    legend: '集团账套通过组织进行统一管理与信息管理',
    platformId: 1014,
  }, {
    title: '权限设置',
    legend: '操作员对公司账套的操作权限和数据权限配置',
    platformId: 10133400,
  }, {
    title: '清除锁定',
    legend: '对操作员锁定任务进行管理，方便清除锁定任务',
    platformId: 10133200,
  },
  {
    title: '应收款管理',
    legend: '应收业务单据的审核、收款核销、往来转账业务',
    platformId: 1007,
  },
  {
    title: '应付款管理',
    legend: '应付业务单据的审核、付款核销、往来转账业务',
    platformId: 20017,
  },
])
const imgValue = (index) => {
  return '/nc/img/nc/' + (index > 8 ? ('' + (index + 1)) : ('0' + (index + 1))) + '.png';
}
const dynamicAdReload = (e) => {
  useAccountPickerCache().set(e)
}
</script>
<style lang="less" scoped>
.nc-hr {
  .nc-hr-top {
    font-weight: bold;
    color: white;
    height: 120px;
    width: 100%;
    background-color: #146dc1;
    background-image: url(/nc/img/bg/007.png);
    background-position: 50% 50%;
    background-repeat: no-repeat;
    display: inline-flex;
    justify-content: space-between;
    padding: 1.2% 5%;

    > div {
      display: inline-flex;
      justify-content: space-between;
    }

    .nc-hr-top-left {
      width: 320px;

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
    margin-top: .5%;
    background-color: #f1f1f1;
    padding: 5px;
  }

  .nc-hrm-body {
    overflow-y: auto;

    :deep(.ant-row) {
      .ant-col {
        flex: 0 0 32%;
        max-width: 32%;
        height: 80px;
        background-color: #f1f1f1;
        margin: .5%;
        color: #8c8c8c;
        /*     border-radius: 4px;
             border: 1px solid #807f7f;*/

        div {
          height: 100%;
          display: inline-block;
        }

        div:nth-of-type(1) {
          width: 60px;
          padding: 6px;

          > div {
            font-size: 30px;
            width: 65px;
            height: 65px;
            padding: 10px;
            /*  .container-head-img {
                width: 56px;
                height: 52px;
                -webkit-user-drag: none;
              }*/
          }

        }

        div:nth-of-type(2) {
          width: calc(100% - 60px);
          font-weight: bold;
          float: right;
          font-size: 16px;

          span:nth-of-type(1) {
            margin: 1% 2%;
            font-size: 18px;
            padding: 5px;
            display: inline-block;
          }

          span:nth-of-type(2) {
            margin-left: 3%;
            display: block;
            width: calc(100% - 30px);
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            word-wrap:break-word;word-break:break-all;
          }
        }
      }

      .ant-col:hover {
        cursor: pointer;
        border: 2px solid #146dc1;
        color: #146dc1;
      }
    }
  }
}
</style>
