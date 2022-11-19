<template>
  <MainView></MainView>
</template>
<script lang="ts">
import MainView from './index2.vue'
import {defineComponent} from "vue";

export default defineComponent({
  name: '客户价格表',
  components: {
    MainView
  },
  mounted() {
  }
})

</script>
