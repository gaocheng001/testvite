<template>
  <div style="width: 300px">
    <Tree
      class="draggable-tree"
      draggable
      block-node
      :tree-data="treeData"
      v-model:checkedKeys="checkedKeys"
      v-model:expandedKeys="expandedKeys"
      @dragenter="selectFun"
      @drop="selectFun"
      @select="selectFun"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { Tree } from 'ant-design-vue';
  import { getMonthsData } from '/@/views/boozsoft/global/SysLogger/layout/Tree/datas';
  import { getLoggerTableFuns } from '/@/views/boozsoft/global/SysLogger/layout/funs';

  const loggerTableFuns = getLoggerTableFuns();

  const treeData = ref(getMonthsData());
  const checkedKeys = ref([]);
  const expandedKeys = ref(['2021']);

  function selectFun(e) {
    loggerTableFuns.reloadTableByYearAndMonth(e[0]);
  }
</script>
