<template>
  <div v-show="props.visible" style="height:100%">
  <template v-for="it in iframeList">
    <iframe :ref="(e)=>it.ref=e" v-if="it.active" v-show="it.show" :src="it.path"
            style="width:100%;height:100%"></iframe>
  </template>
  </div>
</template>
<script setup>
import {computed} from "vue";

const props=defineProps(['items','visible'])
const iframeList=computed(()=>props.items)
</script>
