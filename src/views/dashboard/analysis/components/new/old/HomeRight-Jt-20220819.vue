<template>
  <div class="nc-hr">
    <div class="nc-hr-top" :style="bgStyle2">
        <span>系统应用框架：</span>
        <span>集团</span>
        <span>——</span>
        <span>公司</span>
        <span>——</span>
        <span>组织</span>
        <span>——</span>
        <span>账套</span>
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
      <HomeRightBottomTags/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ClusterOutlined,CloudServerOutlined,ShoppingCartOutlined,CarOutlined,PayCircleOutlined,UserOutlined} from '@ant-design/icons-vue';
import {message,
  Row as ARow,
  Col as ACol} from "ant-design-vue";
import {onMounted, reactive} from "vue";
import HomeRightBottomTags
  from "/@/views/dashboard/analysis/components/new/HomeRightBottom-Jt.vue";
import router from "/@/router";
import {usePlatformsStore} from "/@/store/modules/platforms";
const props=defineProps(['modelValue'])
const mark = usePlatformsStore().getCurrentPlatformId
const toPage = (path) => {
  if (null != path)
    router.push({
      path: ((mark == '1003'?'/system':'/origin') + path)
    });
}
const bgStyle2='background-image: url(\''+new URL('/assets/images/homes/home-block.png', import.meta.url).href+'\')'
</script>
<style lang="less" scoped>
.nc-hr{
  .nc-hr-top{
    height: 140px;
    background-image: url(/@/assets/images/homes/home-block.png);
    background-repeat: repeat;
    text-align: center;
    padding: 50px 0;
    span{
      font-size: 26px;
      font-weight: bold;
      color: white;
      margin: 0 1%;
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
