<template>
  <div class="nc-hr">
    <div class="nc-hr-top">
      <div class="nc-hrt-one">
        <div>
          <span>集团财务管理平台</span>
          <br/>
          <br/>
          <ul style="list-style: circle;">
            <li>全面支持集团财务</li>
            <li>灵活组合公司账套</li>
            <li>主数据支持新增申请及分配引用</li>
            <li>统一权限管理，解决网络复杂场景的应用</li>
          </ul>
          <br/>
          <Button>帮助文档</Button>
        </div>
        <div></div>
      </div>
      <div class="nc-hrt-two">
        <span>组织架构</span>
        <br/>
        <br/>
        <p>同一核算模式下的公司(单位)账套,统-的主数据分配</p>
        <br/>
        <br/>
        <Button>学习一下</Button>
      </div>
      <div class="nc-hrt-three">
        <div>
          <FileDoneOutlined style="font-size: 30px;margin-bottom: 5%;"/>
          <br/>
          <span>主数据新增申请</span>
        </div>
        <span>
          集团主数据统-管理
        </span>
        <ul style="list-style: disc;">
          <li>集团统一管理主数据</li>
          <li>新增主数据审批自动化</li>
          <li>集团档案更新动态同步</li>
        </ul>
      </div>
      <div class="nc-hrt-four">
        <div>
          <MedicineBoxOutlined style="font-size: 30px;margin-bottom: 5%;"/>
          <br/>
          <span>集团模式下建立新账套</span>
        </div>
        <span>集团统-账套规则</span>
        <ul style="list-style: disc;">
          <li>统-编码规则</li>
          <li>统一主数据档案</li>
          <li>统会计科目</li>
        </ul>
      </div>
    </div>
    <div class="nc-hr-middle">
      <a-row type="flex">
        <a-col :span="3" @click="toPage('/institution-management/im-organize')">
          <div><ClusterOutlined style="font-size: 30px;"/></div>
          <div><span>组织</span></div>
          <div><span>{{props.modelValue.dataCount?.t1}}</span></div>
        </a-col>
        <a-col :span="3" @click="toPage('/institution-management/im-unit')">
          <div><ShoppingCartOutlined style="font-size: 30px;"/></div>
          <div><span>公司</span></div>
          <div><span>{{props.modelValue.dataCount?.t2}}</span></div>
        </a-col>
        <a-col :span="3" @click="toPage('/auth-management/opearManager')">
          <div><UserOutlined style="font-size: 30px;"/></div>
          <div><span>操作员</span></div>
          <div><span>{{props.modelValue.dataCount?.t3}}</span></div>
        </a-col>
        <a-col :span="3" @click="toPage('/create-account/ca-account')">
          <div><PayCircleOutlined style="font-size: 30px;"/></div>
          <div><span>财务账套</span></div>
          <div><span>{{props.modelValue.dataCount?.t4}}</span></div>
        </a-col>
        <a-col :span="3" @click="toPage('/create-account/ca-fixed-assets')">
          <div><CarOutlined style="font-size: 30px;"/></div>
          <div><span>固定资产账套</span></div>
          <div><span>{{props.modelValue.dataCount?.t5}}</span></div>
        </a-col>
        <a-col :span="3" @click="toPage('/create-account/ca-stock')">
          <div><CloudServerOutlined style="font-size: 30px;"/></div>
          <div><span>存货管理账套</span></div>
          <div><span>{{props.modelValue.dataCount?.t6}}</span></div>
        </a-col>
      </a-row>
    </div>
    <div class="nc-hr-temp">
      <HomeRightBottom :orgList="props.modelValue.orgList"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ClusterOutlined,CloudServerOutlined,ShoppingCartOutlined,CarOutlined,PayCircleOutlined,UserOutlined,
  MedicineBoxOutlined,
  FileDoneOutlined
} from '@ant-design/icons-vue';
import {
  message,
  Input as AInput,
  Select as ASelect,
  Popover as APopover,
  Steps, Button,Row as ARow,Col as ACol
} from "ant-design-vue";
import {onMounted, reactive} from "vue";
import {useModal} from "/@/components/Modal";
import HomeRightBottom
  from "/@/views/dashboard/analysis/components/new/HomeRightBottom-Org.vue";
import router from "/@/router";
import {usePlatformsStore} from "/@/store/modules/platforms";
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const Step = Steps.Step
const props = defineProps(['modelValue'])
const mark = usePlatformsStore().getCurrentPlatformId
const toPage = (path) => {
  if (null != path)
    router.push({
      path: ((mark == '1003'?'/system':'/origin') + path)
    });
}
</script>
<style lang="less" scoped>
.nc-hr {
  .nc-hr-top {
    font-weight: bold;
    color: white;
    height: 200px;
    width: 100%;
    display: inline-flex;
    justify-content: space-between;

    div {
      border-radius: 3px;

      > .ant-btn {
        background-color: #ffcd36;
        color: black;
        font-weight: bold;
      }

      ul {
        padding-left: 8%;
        font-size: 12px;
        margin-bottom: 0;
      }
    }

    .nc-hrt-one {
      width: 45%;
      background-color: #4b6ae1;
      display: inline-flex;
      justify-content: space-between;

      div {
        height: 95%;
        margin: .5%;
      }

      div:nth-of-type(1) {
        width: 30%;
        margin-left: 4%;
        margin-top: 1.5%;
      }

      div:nth-of-type(2) {
        width: 30%;
        margin-right: 3%;
        background-image: url(/@/assets/images/homes/org1.png);
        background-size: 80% 80%;
        background-repeat: no-repeat;
        background-position: 12px;
      }
    }

    .nc-hrt-two {
      background-color: white;
      color: #545454;
      width: 25%;
      padding: 1% 2%;

      span {
        font-weight: bold;
        color: black;
      }

      p {
        font-size: 12px;
      }
    }

    .nc-hrt-three {
      background-color: #0aa699;
      width: 14%;
      padding: 1.3% 2% 0;

      > div {
        height: 50%;
        text-align: center;
      }
    }

    .nc-hrt-four {
      background-color: #0a84ff;
      width: 14%;
      padding: 1.3% 2% 0;

      > div {
        height: 50%;
        text-align: center;
      }
    }
  }

  .nc-hr-middle{
    height: 160px;
    padding: .5%;
    margin: .5% 0 1%;
    :deep(.ant-row) {
      .ant-col {
        text-align: center;
        height: 150px;
        background-color: white;
        margin: 0 1% 1%;
        border-radius: 4px;
        padding: .5% 0px;
        border-top: 3px solid slateblue;
        flex: 0 0 14.6%;
        max-width: 14.6%;
        div{
          .container-head-img {
            width: 40px;
            height: 40px;
            display: inline-flex;
            -webkit-user-drag: none;
          }
          color: #666666;
          font-size: 20px;
          font-weight: bold;
          margin: 3% 0;
        }
        div:nth-of-type(3){
          color: #128ecb;
        }
      }
      .ant-col:hover{
        cursor: pointer;
        border: 1px solid #146dc1;
        border-top: 3px solid #146dc1;
      }
    }
  }
  .nc-hr-temp{
    padding: .5% 1%;
  }
}
</style>
