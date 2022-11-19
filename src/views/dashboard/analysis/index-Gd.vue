<template>
  <div class="nc-home" :style="{height: windowHeight+'px'}">
    <HomeLeft :loading="loading" class="nc-home-left" v-model="homeDataModel"/>
    <HomeRight :loading="loading" class="nc-home-right" v-model="homeDataModel"/>
  </div>
</template>
<script setup lang="ts">
import HomeLeft from './components/new/HomeLeft.vue';
import HomeRight from './components/new/HomeRight-Gd.vue';
import {ref, reactive,onMounted} from "vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {getAllAccAuths, filterAccListByAuth} from "/@/api/record/system/financial-settings";
import {pointMessage} from "/@/api/task-api/tast-bus-api";
import {useUserStore} from "/@/store/modules/user";

const loading = ref(false);
const windowHeight = document.documentElement.clientHeight - 150;
const homeDataModel = reactive({
  authorizedAdList: [], // 已授权的账套列表
  authorizedInfoList: [], // 授权账套详情
  loginDate: '2021-01-01', // 登录平台的日期
  thisAdInfo: {},          // 最新查询账套信息
  thisUserInfo: {}
})

const getThisAdInfo = async () => {
  loading.value = true
  homeDataModel.thisUserInfo = useUserStore().getUserInfo
  homeDataModel.loginDate = useCompanyOperateStoreWidthOut().getLoginDate
  if (Object.keys(homeDataModel.thisUserInfo).length !== 0){
    homeDataModel.authorizedInfoList = await getAllAccAuths({'userId': homeDataModel.thisUserInfo.id})
    homeDataModel.authorizedAdList = filterAccListByAuth(useCompanyOperateStoreWidthOut().getAccountList, homeDataModel.authorizedInfoList)
    if (homeDataModel.authorizedAdList.length != 0) {
      let afterFilterList = homeDataModel.authorizedAdList.filter(item => item.coCode === useCompanyOperateStoreWidthOut().getTenentCoCode)
      homeDataModel.thisAdInfo = afterFilterList.length > 0 ? afterFilterList[0] : {}
    } else {
      await pointMessage({
        title: '温馨提示', content: '请联系管理员获取相关账套权限！', delay: true
      })
    }
    loading.value = false
  }else {
    await pointMessage({
      title: '温馨提示', content: '登录信息丢失，请重新登录！', delay: true
    })
    loading.value = false
  }
}


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
    width: calc(100% - 269px);
  }
}
</style>
