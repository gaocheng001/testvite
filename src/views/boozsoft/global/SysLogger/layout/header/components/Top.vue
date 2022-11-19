<template>
  <div style="position: absolute; top: 10px; right: 0; width: 370px">
    <template v-for="it in recordData.arr">
      <button
        v-if="it.enable"
        @click="it.fun"
        class="ant-btn ant-btn-me"
        v-text="it.label"
      ></button>
    </template>
  </div>
</template>
<script setup>
  import { inject } from 'vue';

  const recordData = inject('recordData');
</script>
