<template>
  <MainView></MainView>
</template>
<script lang="ts">
import MainView from './index2.vue'
import {defineComponent} from "vue";

export default defineComponent({
  name: '单据表头自定义项',
  components: {
    MainView
  },
  mounted() {
  }
})

</script>
