<template>
  <div class="nc-home" :style="{height: windowHeight+'px'}">
    <HomeLeft :loading="loading" class="nc-home-left" v-model="homeDataModel"/>
    <HomeRight :loading="loading" class="nc-home-right" v-model="homeDataModel"/>
  </div>
</template>
<script setup lang="ts">
import HomeLeft from './components/new/HomeLeft.vue';
import HomeRight from './components/new/HomeRight-Data.vue';
import {ref, reactive} from "vue";
const loading = ref(false);
const windowHeight = document.documentElement.clientHeight - 150;
const homeDataModel = reactive({
  authorizedAdList: [], // 已授权的账套列表
  authorizedInfoList: [], // 授权账套详情
  loginDate: '2021-01-01', // 登录平台的日期
  thisAdInfo: {},          // 最新查询账套信息
  thisUserInfo: {}
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
    width: calc(100% - 269px);
  }
}
</style>
