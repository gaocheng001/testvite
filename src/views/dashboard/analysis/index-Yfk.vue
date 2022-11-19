<template>
  <div class="nc-home" :style="{height: windowHeight+'px'}">
    <HomeLeft :loading="loading" class="nc-home-left" v-model="homeDataModel"/>
    <HomeRight :loading="loading" class="nc-home-right" v-model="homeDataModel"/>
  </div>
</template>
<script setup lang="ts">
import HomeLeft from './components/new/HomeLeft.vue';
import HomeRight from './components/new/HomeRight-Yfk.vue';
import {ref, reactive,onMounted} from "vue";
import moment from "moment";
const loading = ref(false);
const windowHeight = document.documentElement.clientHeight - 150;
const homeDataModel = reactive({
  loginDate: '2021-01-01', // 登录平台的日期
  dynamicAdModel: {},      // 动态账套数据模型
})
onMounted(async ()=>{
  homeDataModel.loginDate = moment(new Date()).format("YYYY-MM-DD")
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
