<template>
  <div>
    <ProvideData>
      <component ref="aaa" :is="props.adsas"></component>
    </ProvideData>
  </div>
</template>
<script setup>
import {ref,nextTick, onMounted} from "vue";

const props=defineProps(['adsas'])
import ProvideData from './ProvideData.vue'


</script>
