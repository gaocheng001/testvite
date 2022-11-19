<template>
  <MainView></MainView>
</template>
<script lang="ts">
import MainView from './index2.vue'
import {defineComponent} from "vue";
import router from "/@/router";

export default defineComponent({
  name: `XiaoShouTongJiBiao`,
  components: {
    MainView
  },
  mounted() {
    // 动态组建名称
    let path = router.currentRoute?.value?.fullPath
    this.$options.name = `XiaoShouTongJiBiao${path == '/xs-gjgList' ? '2' : path == '/xs-gjList' ? '1' : path == '/xs-xsCountUser' ? '3' : path == '/xs-xsCountArea' ? '4' : ''}`
  }
})

</script>
