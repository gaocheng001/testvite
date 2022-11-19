<template>
  <div class="left-list-tree">
    <div class="head">客户分类</div>
<!--    <div class="customize-toolbar">
      <SyncOutlined />&ensp;
      <SearchOutlined />&ensp;
      <PlusOutlined @click="open('add')"/>&ensp;
      <MinusOutlined @click="open('del')"/>
    </div>-->
    <BasicTree
      title=""
      :style="{minHeight: (windowHeight)+'px' } "
      :tree-data="treeData"
      :replace-fields="{ key: 'value', title: 'title' }"
      v-model:selectedKeys="checkedKeys"
      v-model:expandedKeys="expandedKeys"
      :height="650"
      :selectable="true"
      :defaultExpand-all="true"
      @select="handleSelect"
    />
  </div>
</template>
<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {BasicTree} from '/@/components/Tree';
import {Select, Tabs} from 'ant-design-vue';
const TabPane = Tabs.TabPane
const SelectOption = Select.Option
import {SyncOutlined,SearchOutlined,PlusOutlined,MinusOutlined} from '@ant-design/icons-vue';
const emit = defineEmits(['select','save'])

const custClassList = inject('custClassList')
const treeData: any = ref([])
const checkedKeys: any = ref([])
const expandedKeys: any = ref([])
const windowHeight = (window.innerHeight-272)
onMounted(() => {
  fetch()
})

async function fetch() {
  treeData.value = []
  let d = {value: 'all', title: '全部'}
  let dV = null
  if (custClassList.value.length > 0) {
    d.children = custClassList.value.map(it => {
      let data = {
        value: it.uniqueCustclass,
        title: it.cusClass + ' ' + it.cusCclassName,
      }
      return data
    })
    if (d.children.length > 0)dV = d.children[0].value
  }
  treeData.value = [d]
  expandedKeys.value = ['all']
  checkedKeys.value = ['all']
  handleSelect(checkedKeys.value)
}


function handleSelect(keys: string, e: any) {
  emit('select', keys.length==0?'all':keys[0])
}

const open = (v) => {
  emit('save',v)
}
</script>
<style lang="less" scoped>
.left-list-tree {
  display: inline-block;
  height: calc(100%);
  min-width: 300px;
  float: left;
  position: relative;

  .head {
    font-weight: bold;
    text-align: center;
    height: 30px;
    line-height: 30px;
    background-color: rgb(216 216 216);
    color: #282121;
  }
  .customize-toolbar{
    position: absolute;
    top: 4px;
    right: 10px;
    color: #0096c7;
    font-weight: bold;
    z-index: 999999999!important;
    .anticon:hover{
      cursor: pointer;
      font-size: 16px;
    }
  }
  :deep(.ant-tree-list) {
    background-color: #f1f1f1;
  }
}
</style>
