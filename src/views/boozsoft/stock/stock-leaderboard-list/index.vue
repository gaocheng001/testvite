<template>
  <MainView></MainView>
</template>
<script lang="ts">
import MainView from './index2.vue'
import {defineComponent} from "vue";
import router from "/@/router";

export default defineComponent({
  name: `XiaoShouPaiHangBang`,
  components: {
    MainView
  },
  mounted() {
    // 动态组建名称
    let path = router.currentRoute?.value?.fullPath
    this.$options.name = `XiaoShouPaiHangBang${path == '/xs-phbStock' ? '1' : '2'}`
  }
})

</script>
