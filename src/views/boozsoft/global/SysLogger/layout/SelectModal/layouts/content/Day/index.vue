<template>
  <div style="display: flex; text-align: center">
    <DatePicker
      v-model:value="month"
      :locale="localeCn"
      placeholder="时点日期"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      style="width: 50%"
    />
  </div>
</template>
<script setup>

  import { Select, DatePicker } from 'ant-design-vue';
  import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';

  import { ref } from 'vue';
  const year = ref('2021');
  const month = ref('2021-01-01');
  const day = ref('1');
</script>
