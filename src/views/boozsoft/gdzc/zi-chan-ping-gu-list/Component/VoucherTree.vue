<template>
  <div class="voucher-list-tree">
    <BasicTree
      title="评估单"
      :tree-data="treeData"
      :replace-fields="{ key: 'value', title: 'title' }"
      v-model:checkedKeys="checkedKeys"
      v-model:expandedKeys="expandedKeys"
      checkable
      :height="600"
      :selectable="false"
      @check="handleSelect"
    />
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {BasicTree} from '/@/components/Tree';
import {Select, Tabs} from 'ant-design-vue';
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

const TabPane = Tabs.TabPane
const SelectOption = Select.Option
const emit = defineEmits(['select'])
const props = defineProps(['datasource'])

const activeKey = ref('1')
const treeData: any = ref([])
const checkedKeys: any = ref([])
const expandedKeys: any = ref([])

const windowHeight = (window.innerHeight)
const pgList = ref([])
watch(() => [props.datasource], async () => {
  pgList.value = props.datasource
  if (pgList.value.length != 0)await fetch()
})

async function fetch() {
  let deptTree = pgList.value.map(i => ({
    'value': i.id,
    'title': `${i.pgId}`,
  }))
  treeData.value = deptTree
  let o =  treeData.value[treeData.value.length - 1]
  checkedKeys.value = [o.value]
  emit('select', {key: o.value})
}


function handleSelect(keys: string, e: any) {
  checkedKeys.value = [keys[0]]
  emit('select', {key: keys[0]})
}
</script>
<style lang="less" scoped>
.voucher-list-tree {
  display: inline-block;
  height: calc(100%);
  width: 180px;
  float: left;
  background-color: #f1f1f1;

  :deep(.ant-select-selector) {
    background-color: #f1f1f1;
    border: none;
    border-bottom: solid 1px rgb(191, 191, 191) !important;
  }

  :deep(.vben-tree-header) {
    background-color: #f1f1f1;

    .vben-basic-title {
      font-weight: bold;
    }
  }
}
</style>
