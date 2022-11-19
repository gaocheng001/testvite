<template>
  <MainView></MainView>
</template>
<script lang="ts">
import MainView from './index2.vue'
import {defineComponent} from "vue";
import router from "/@/router";

export default defineComponent({
  name: `XiaoHuoDanZhiXingBiao`,
  components: {
    MainView
  },
  mounted() {

  }
})

</script>
