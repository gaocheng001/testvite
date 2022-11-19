<template>
  <Layout/>
</template>
<script setup>
import Layout from '../boozsoft/layouts/index.vue'
import {ref} from 'vue'

window.platformData = {}
window.platformData.storeList = ref([])

</script>
