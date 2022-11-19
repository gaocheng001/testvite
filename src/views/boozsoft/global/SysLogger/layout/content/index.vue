<template>
  <div style="width: 100%; display: flex">
    <div style="height: 500px; width: 300px">
      <Tree />
    </div>
    <div style="width: 50px"></div>
    <div style="width: calc(100% - 300px - 20px)">
      <HelloTable @register="register" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import Tree from '../Tree.vue';
  import HelloTable from '../Table.vue';
  import { provide } from 'vue';
  import { useLoggerTable } from '/@/views/boozsoft/global/SysLogger/layout/funs';

  const loggerTableFuns = useLoggerTable();
  const { register, reloadTableByYearAndMonth, reloadTableByYearAndMonthAndDay } = loggerTableFuns;
  provide('reloadTableByYearAndMonth', reloadTableByYearAndMonth);
  provide('loggerTableFuns', loggerTableFuns);
</script>
<style
  src="../../../../../../assets/styles/generate-code-record-style/record.less"
  lang="less"
  scoped
></style>
