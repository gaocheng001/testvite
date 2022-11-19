<template>
  <div class="nc-home" :style="{height: windowHeight+'px'}">
<!--    <HomeLeft :loading="loading" class="nc-home-left" v-model="homeDataModel"/>-->
    <HomeRight :loading="loading" class="nc-home-right" v-model="homeDataModel"/>
  </div>
</template>
<script setup lang="ts">
import HomeLeft from './components/new/HomeLeft.vue';
import HomeRight from './components/new/HomeRight-Org.vue';
import {ref, reactive,onMounted} from "vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {
  getAllAccAuths,
  filterAccListByAuth,
  findGroupDownCount
} from "/@/api/record/system/financial-settings";
import {pointMessage} from "/@/api/task-api/tast-bus-api";
import {useUserStore} from "/@/store/modules/user";
import {getOrganizeAll} from "/@/api/record/group/im-organize";

const loading = ref(false);
const windowHeight = document.documentElement.clientHeight - 150;
const homeDataModel = reactive({
  authorizedAdList: [], // 已授权的账套列表
  authorizedInfoList: [], // 授权账套详情
  loginDate: '2021-01-01', // 登录平台的日期
  thisAdInfo: {},          // 最新查询账套信息
  thisUserInfo: {},
  orgList: [],
  dataCount: {},
})
const getThisAdInfo = async () => {
  loading.value = true
  homeDataModel.thisUserInfo = useUserStore().getUserInfo
  homeDataModel.loginDate = useCompanyOperateStoreWidthOut().getLoginDate
  homeDataModel.orgList = await getOrganizeAll()
  homeDataModel.dataCount =await findGroupDownCount()
}
onMounted(async ()=>{
 await getThisAdInfo()
})
</script>
<style lang="less" scoped>
.nc-home {
  margin: 10px 5px;
  height: 900px;
  display: flex;

   .nc-home-left {
    width: 265px;
    background-color: #fdfdfd;
  }

  .nc-home-right {
    margin-left: 4px;
    //width: calc(100% - 269px);
    width: 100%;
  }
}
</style>
