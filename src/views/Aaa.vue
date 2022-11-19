<template>
  <div style="background:white;padding:10px">
    <Skeleton active  :paragraph="{ rows: 24 }"  />
  </div>
</template>
<script setup>
import {Skeleton} from 'ant-design-vue'
</script>
