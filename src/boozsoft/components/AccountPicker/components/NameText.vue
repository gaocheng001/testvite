<template>
  <span class="thisNameSpan" v-text="text.slice(0,(props.len || 8))"/>
  <span v-if="null != text && text.length > (props.len || 8)" :title="text">...</span>
</template>
<script setup>
import {computed, onMounted, useSlots} from "vue";

const text = computed(() => useSlots().default()[0].children)
const props = defineProps(['len'])
</script>
<style scoped>

.thisNameSpan {
  color: black;
  font-weight: bold;
  width: 8em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden; /*display: inline-flex;*/
}
</style>
