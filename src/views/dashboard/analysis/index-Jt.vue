<template>
  <div class="nc-home" :style="{height: windowHeight+'px'}">
<!--    <HomeTop :loading="loading" class="nc-home-top" v-model="homeDataModel"/>-->
<!--    <HomeLeft :loading="loading" class="nc-home-left" :style="{height: (windowHeight-120)+'px'}" v-model="homeDataModel"/>-->
    <HomeRight :loading="loading" class="nc-home-right" :style="{height: (windowHeight-120)+'px'}" v-model="homeDataModel"/>
  </div>
</template>
<script setup lang="ts">
import HomeLeft from './components/new/HomeLeft.vue';
import HomeRight from './components/new/HomeRight-Jt.vue';
import {ref, reactive, onMounted} from "vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {findGroupDownCount} from "/@/api/record/system/financial-settings";
import {useUserStore} from "/@/store/modules/user";
import HomeTop from "/@/views/dashboard/analysis/components/new/HomeTop.vue";
import {getGroupAll} from "/@/api/record/group/im-group";

const loading = ref(false);
const windowHeight = document.documentElement.clientHeight - 150;
const homeDataModel = reactive({
  authorizedAdList: [], // 已授权的账套列表
  authorizedInfoList: [], // 授权账套详情
  loginDate: '2021-01-01', // 登录平台的日期
  thisAdInfo: {},          // 最新查询账套信息
  thisUserInfo: {},
  groupList: [],
  dataCount: {}
})
const getThisAdInfo = async () => {
  loading.value = true
  homeDataModel.thisUserInfo = useUserStore().getUserInfo
  homeDataModel.loginDate = useCompanyOperateStoreWidthOut().getLoginDate
  // homeDataModel.groupList = await getGroupAll()
  homeDataModel.dataCount =await findGroupDownCount()
}
onMounted(async () => {
  await getThisAdInfo()
})
</script>
<style lang="less" scoped>
.nc-home {
  margin: 10px 5px;
  height: 100%;
/*  .nc-home-top {
    width: 100%;
    height: 120px;
    margin-bottom: 10px;
  }*/

  /*
  .nc-home-left {
    width: 265px;
    background-color: #fdfdfd;
    display: inline-block;
    float: left;
  }
  */

  .nc-home-right {
    margin-left: 4px;
    //width: calc(100% - 269px);
    width: calc(100%);
    display: inline-block;
    float: right;
  }

}
</style>
