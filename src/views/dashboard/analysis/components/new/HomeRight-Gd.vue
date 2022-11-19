<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hrt-one">
        <div class="nc-hrto-one"><span
          style="font-size: 18px;font-weight: bold;color: #0aa699;border-bottom: 3px solid rebeccapurple;padding: 10px 5px">固定资产状况</span>
        </div>
        <div class="nc-hrto-two">

        </div>
        <div class="nc-hrto-three">
          <AccountPicker theme="one" @reloadTable="dynamicAdReload"/>
        </div>
      </div>
      <div class="nc-hrt-two">
        <div style="pointer-events: none;">
          <div>
            <ScheduleOutlined style="font-size: 40px;"/>
          </div>
          <div><span>资产业务日期</span><br/>
            <DatePicker :locale="localeCn" v-model:value="pageParameter.businessDate"
                        :allow-clear="false"
                        placeholder="" format="YYYY.MM.DD" value-format="YYYY-MM-DD"
                        style="width: 120px;pointer-events: none;"/>
          </div>
        </div>
        <div>
          <div>
            <CloudServerOutlined style="font-size: 40px;"/>
          </div>
          <div><span>资产原值</span><br/><span>$ {{ thousands(pageParameter.yuanzhi) }}</span></div>
        </div>
        <div>
          <div>
            <DashboardOutlined style="font-size: 40px;"/>
          </div>
          <div><span>累计折旧</span><br/><span>$ {{ thousands(pageParameter.zhejiuleiji) }}</span></div>
        </div>
        <div>
          <div>
            <DisconnectOutlined style="font-size: 40px;"/>
          </div>
          <div><span>净残值</span><br/><span>$ {{ thousands(pageParameter.jingcanzhi) }}</span></div>
        </div>
        <div>
          <div>
            <CreditCardOutlined style="font-size: 40px;"/>
          </div>
          <div><span>资产净值</span><br/><span>$  {{ thousands(pageParameter.jingzhi) }}</span></div>
        </div>
      </div>
    </div>
    <div class="nc-hr-top2">
      <div>
        <img src="/img/home/gt1.png" class="container-head-img"
             @click="toMenu('/depreciation-content/jtzj')">
        <img src="/img/home/gt2.png" class="container-head-img"
             @click="toMenu('/qm-handle/qm-close')">
        <Popover title="操作" placement="bottom" trigger="click">
          <template #content>
            <p>Content</p>
            <p>Content</p>
          </template>
          <img src="/img/home/t3.png" class="container-head-img">
        </Popover>
        <img src="/img/home/gt4.png" class="container-head-img" @click="toMenu('/management/list')">
        <Popover title="操作" placement="bottom" trigger="click">
          <template #content>
            <p>Content</p>
            <p>Content</p>
          </template>
          <img src="/img/home/gt5.png" class="container-head-img">
        </Popover>
        <Popover title="操作" placement="bottom" trigger="click">
          <template #content>
            <p>Content</p>
            <p>Content</p>
          </template>
          <img src="/img/home/gt6.png" class="container-head-img">
        </Popover>
      </div>
    </div>
    <div class="nc-hr-middle">
      <div class="nchrm-left" @click="toList" >
        <span>通用设备</span>
        <div>
          <InputSearch
            style="width: 60%"
            placeholder="输入资产编码或名称快速查询资产"
            enter-button
          />
        </div>
      </div>
      <div class="nchrm-center" @click="toList">
        <div>
          <span>专用设备</span>
        </div>
        <div>
          <span>家具用具</span>
        </div>
        <div>
          <span>土地房屋</span>
        </div>
        <div>
          <span>图书档案</span>
        </div>
      </div>
      <div class="nchrm-right" @click="toList">
        <span>文物和阵列品</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ScheduleOutlined,
  CloudServerOutlined,
  CreditCardOutlined,
  DisconnectOutlined,
  DashboardOutlined
} from '@ant-design/icons-vue';
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-GDZC.vue";
import {reactive, ref} from "vue";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {
  Input,
  Select,
  Steps,
  DatePicker, message, Popover
} from "ant-design-vue";
const {createConfirm} = useMessage()
import {getGlobalFinanceSettingInfo} from "/@/api/record/system/financial-settings";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
import router from "/@/router";
import {useMessage} from "/@/hooks/web/useMessage";

const InputSearch = Input.Search
const SelectOption = Select.Option
const Step = Steps.Step
const props = defineProps(['modelValue'])
const 会计准则 = props.modelValue.thisAdInfo.accStandard
const faAccountList = ref([])
const pageParameter = reactive({
  businessDate: '2021-12-20',
  yuanzhi: '9999',
  zhejiuleiji: '1111',
  jingcanzhi: '8888',
  jingzhi: '8888'
})
const dynamicAdReload = async (e) => {
   useAccountPickerCache().set(e)
  if (null != e.managementCode && '' != e.managementCode) {
    pageParameter.businessDate = e.managementYearInfo.date
    if (e.managementYearInfo.isYearClose) {
      message.info('该资产账本年度已完成结账！')
    }
  } else {
    createConfirm({
      iconType: 'warning',
      title: '系统提示',
      content: `当前公司代码【${e.coCode}】下,未建立或未授权固定资产账!请立即前往集团或组织管理新建固定资产账！`,
      onOk: async () => {
        toNc()
      },onCancel: async () => {
      }
    });
  }
}
const toList = () => {
  router.push({
    path: '/management/gd-list',
    query: null,
  });
}
const toMenu = (path) => {
  router.push({
    path: path,
    query: null,
  });
}
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";
import {closeAnomaly} from "/@/api/task-api/tast-bus-api";
const layoutsStore = usePlatformsStoreWidthOut();
const toNc = () => {
  layoutsStore.switchPlatform({ id: '20006' })
}
function thousands(v) {
  if (null != v && v != '') {
    return v.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}
const bgStyle01='background-image: url(\''+new URL('/assets/images/homes/gdzc/01.png', import.meta.url).href+'\')'
const bgStyle011='background-image: url(\''+new URL('/assets/images/homes/gdzc/011.png', import.meta.url).href+'\')'
</script>
<style lang="less" scoped>
.nc-hr {
  .nc-hr-top {
    font-weight: bold;
    color: #545454;
    height: 120px;
    background-color: white;

    .nc-hrt-one {
      height: 40%;
      padding: .6% 3% 0;
      display: flex;
      justify-content: space-between;

      :deep(.ant-select-selector) {
        border-color: #c9c9c9;
      }
    }

    .nc-hrt-two {
      display: flex;
      height: 60%;

      > div {
        width: 20%;
        height: 100%;
        text-align: center;
        border-top: 1px solid #e7e7e7;
        border-right: 1px solid #e7e7e7;
        padding: .8% 0;

        > div {
          display: inline-block;
          margin: 0 5px;
        }

        > div:nth-of-type(2) {
          text-align: left;

          :deep(.ant-picker) {
            border: none;

            input {
              color: black;
              font-weight: bold;
            }
          }

          span:nth-of-type(2) {
            color: black;
          }
        }
      }

    }
  }

  .nc-hr-top2 {
    div {
      height: 120px;
      width: 100%;
      padding: 1.2%;
      text-align: center;

      .container-head-img {
        width: 80px;
        height: 80px;
        display: inline-flex;
        margin: 0 1%;
        -webkit-user-drag: none;
      }

      .container-head-img:hover {
        cursor: pointer;
        box-shadow: 0 0 10px 2px #9daad4;
        transform: scale(1.02, 1.02)
      }
    }
  }

  .nc-hr-middle {
    width: 100%;
    height: 600px;
    display: inline-flex;
    justify-content: space-between;

    > div {
      height: 100%;
    }

    span {
      color: white;
      font-size: 22px;
      font-weight: bold;
    }

    .nchrm-left {
      width: 40%;
      //background-image: url(/@/assets/images/homes/gdzc/01.png);
      background-repeat: round;
      position: relative;

      > span {
        position: absolute;
        left: 20%;
        top: 220px;
      }

      > div {
        width: 100%;
        position: absolute;
        left: 20%;
        bottom: 80px;
      }
    }

    .nchrm-left:hover {
      //background-image: url(/@/assets/images/homes/gdzc/011.png);
    }

    .nchrm-center {
      width: 39%;
      margin: 0 .5%;

      > div {
        width: calc((100% / 2) - 2.5px);
        height: 295px;
        display: inline-block;
        background-color: white;
        margin-top: 3px;
        position: relative;
      }

      > div:nth-of-type(even) {
        margin-left: 5px;
      }

      > div:nth-of-type(1) {
        background-image: url(/@/assets/images/homes/gdzc/02.png);
        background-repeat: round;

        > span {
          position: inherit;
          left: 65%;
          top: 5%;
        }
      }

      > div:nth-of-type(1):hover {
        background-image: url(/@/assets/images/homes/gdzc/022.png);
      }

      > div:nth-of-type(2) {
        background-image: url(/@/assets/images/homes/gdzc/05.png);
        background-repeat: round;

        > span {
          position: inherit;
          left: 40%;
          top: 5%;
        }
      }

      > div:nth-of-type(2):hover {
        background-image: url(/@/assets/images/homes/gdzc/055.png);
      }

      > div:nth-of-type(3) {
        background-image: url(/@/assets/images/homes/gdzc/03.png);
        background-repeat: round;

        > span {
          position: inherit;
          left: 10%;
          top: 10%;
        }
      }

      > div:nth-of-type(3):hover {
        background-image: url(/@/assets/images/homes/gdzc/033.png);
      }

      > div:nth-of-type(4) {
        background-image: url(/@/assets/images/homes/gdzc/04.png);
        background-repeat: round;

        > span {
          position: inherit;
          left: 65%;
          top: 5%;
        }
      }

      > div:nth-of-type(4):hover {
        background-image: url(/@/assets/images/homes/gdzc/044.png);
      }
    }

    .nchrm-right {
      width: 20%;
      background-image: url(/@/assets/images/homes/gdzc/06.png);
      background-repeat: round;
      position: relative;

      > span {
        position: absolute;
        left: 30%;
        top: 100px;
        color: #0aa699;
      }
    }

    .nchrm-right:hover {
      background-image: url(/@/assets/images/homes/gdzc/066.png);

    }
  }
}
</style>
