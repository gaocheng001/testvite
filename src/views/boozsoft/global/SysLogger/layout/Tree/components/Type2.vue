<template>
  <div class="TreeType2">
    <BasicTree
      title=""
      :tree-data="treeData"
      :replace-fields="{ key: 'value', title: 'title' }"
      v-model:checkedKeys="checkedKeys"
      v-model:expandedKeys="expandedKeys"
      checkable
      :selectable="false"
      @check="handleSelect"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { BasicTree } from '/@/components/Tree';
  import { getDaysData } from '/@/views/boozsoft/global/SysLogger/layout/Tree/datas';
  const treeData = ref(getDaysData());
  const checkedKeys = ref([]);
  const expandedKeys = ref(['2021']);
  const handleSelect = ref(true);
</script>
<style>
  .TreeType2 {
    height: 100%;
    width: 300px;
  }
</style>
