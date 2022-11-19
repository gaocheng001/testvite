<template>
  <div class="nc-home" :style="{height: windowHeight+'px'}">
  111111
  </div>
</template>
<script setup lang="ts">
import HomeLeft from './components/new/HomeLeft.vue';
import HomeRight from './components/new/HomeRight-Log.vue';
import {ref, reactive,onMounted, watch} from "vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {pointMessage} from "/@/api/task-api/tast-bus-api";
import {useUserStore} from "/@/store/modules/user";
import moment from "moment";

const loading = ref(false);
const windowHeight = document.documentElement.clientHeight - 150;
const homeDataModel = reactive({
  loginDate: '2021-01-01', // 登录平台的日期
  thisAdInfo: {},          // 最新查询账套信息
})
onMounted(async ()=>{
  const loginDate=useCompanyOperateStoreWidthOut().getLoginDate
  homeDataModel.loginDate = loginDate
})

// watch(homeDataModel,(e)=>{
//   useCompanyOperateStoreWidthOut().commitLoginDate(e.loginDate)
// })
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
