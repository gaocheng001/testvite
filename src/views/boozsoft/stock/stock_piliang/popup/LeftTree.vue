<template>
  <div class="left-list-tree">
    <div class="head">存货目录</div>
    <div class="customize-toolbar">
      <SyncOutlined />&ensp;
      <SearchOutlined />&ensp;
      <PlusOutlined @click="open('add')"/>&ensp;
      <MinusOutlined @click="open('del')"/>
    </div>
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
    >
    </BasicTree>
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

const stockList = inject('stockList')
const stockXclList = inject('stockXclList')
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
  if (stockList.value.length > 0) {
    d.children = stockList.value.map(it => {
      let data = {
        value: it.id,
        title: it.stockNum + ' ' + it.stockName,
      }
      let list =  stockXclList.value.filter(t=>t.invCode == it.stockNum)
      if (it.stockPropertyBatch == '1'){
        if (list.length > 0)data.children = list.map(i=>({ value: i.id,title:i.batchId+`[数量${computeXcl(i)}]`,selectable:false}))
      }else {
        if (list.length > 0)data.title = data.title+`[数量${computeXcl(list[0])}]`
      }
      return data
    })
    if (d.children.length > 0)dV = d.children[0].value
  }
  treeData.value = [d]
  expandedKeys.value = ['all']
  checkedKeys.value = [dV?dV:'all']
  handleSelect(checkedKeys.value)
}

const computeXcl = (e) => {
  return ((parseFloat(e.baseQuantity||0)+parseFloat(e.ztrkQuantity||0))-parseFloat(e.ztckQuantity||0)).toFixed(2)
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
