<template>
  <div class="left-list-tree">
    <div class="head">模板样式</div>
    <div class="customize-toolbar">
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
    />
  </div>
</template>
<script setup lang="ts">
import {inject, onMounted, ref, watch} from "vue";
import {BasicTree} from '/@/components/Tree';
import {Select, Tabs} from 'ant-design-vue';
const TabPane = Tabs.TabPane
const SelectOption = Select.Option
import {SyncOutlined,SearchOutlined,PlusOutlined,MinusOutlined} from '@ant-design/icons-vue';
const emit = defineEmits(['select','save'])

const treeList = inject('treeList')
const treeData: any = ref([])
const checkedKeys: any = ref([])
const expandedKeys: any = ref([])
const typeList = [{value:'0',label:'系统'},{value:'1',label:'A4横向'},{value:'2',label:'A4纵向'},{value:'3',label:'二等分'},{value:'4',label:'三等分'}]
const windowHeight = (window.innerHeight-272)
onMounted(() => {
  fetch()
})
watch(() => treeList.value, async () => {
  fetch()
})
async function fetch() {
  treeData.value = []
  let d = {value: 'all', title: '全部'}
  let dV = null
  if (treeList.value.length > 0) {
    d.children = treeList.value.map(it => {
      let data = {
        value: it.id,
        title: `[${typeList.filter(a=>a.value == it.templateType)[0]?.label}]${it.templateName}`,
        children: [{value:it.id+'-0',title: '标题：'},{value:it.id+'-1',title: '表头：'},{value:it.id+'-2',title: '表体：'},{value:it.id+'-3',title: '表尾：'}]
      }
      return data
    })
    if (d.children.length > 0)dV = d.children[0]['children'][0].value
  }
/*  d.children = [
    {value:'1',title:'[系统]系统模板',children: [{value:'1-1',title: '标题：'},{value:'1-2',title: '表头：'},{value:'1-3',title: '表体：'},{value:'1-4',title: '表尾：'}]},
    // {value:'2',title:'[自定义]金牧销货单',children: [{value:'2-1',title: '标题：'},{value:'2-2',title: '表头：'},{value:'2-3',title: '表体：'},{value:'2-4',title: '表尾：'}]},
  ]*/
  treeData.value = [d]
  checkedKeys.value = [dV]
  handleSelect(checkedKeys.value)
}


function handleSelect(keys: string, e: any) {
  if (keys[0] != 'all' && keys[0].indexOf('-')==-1)
    keys[0] += ('-'+(treeList.value.filter(it=>it.id == keys[0])[0]?.templateType || 0))
  expandedKeys.value = ['all',keys[0].split('-')[0]]
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
  min-width: 250px;
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
    text-align: left;
  }
}
</style>
