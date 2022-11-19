<template>
  <div class="bg-white m-4 mr-0 overflow-hidden" :style="{height: windowHeight+'px'}">
    <div style="width: 100%;height: 50px;">
      <label style="font-size: 20px;line-height: 50px;margin-left: 20px;">角色</label>
    </div>
    <BasicTree
      title=""
      :click-row-to-expand="false"
      :defaultExpandAll="true"
      :tree-data="treeData"
      :replace-fields="{ key: 'id', title: 'roleName' }"
      v-model:selectedKeys="selectedKeys"
      v-model:expandedKeys="selectedKeys2"
      @select="handleSelect"
    />

  </div>
</template>
<script setup lang="ts">
import {inject, onMounted, ref} from 'vue';
import { BasicTree } from '/@/components/Tree';
import { useModal } from '/@/components/Modal';

import {
  PlusOutlined
} from '@ant-design/icons-vue'
import { saveDept } from '/@/api/record/system/dept'
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";

const windowHeight = (window.innerHeight - 260)
const emit=defineEmits(['select'])
const treeData:any = ref([])
const selectedKeys = ref<string[]>([])
const selectedKeys2 = ref<string[]>([])
const roleList = inject('roleList'); //消费者
async function fetch() {
  treeData.value = [{id: 'all',roleName: '全部',children: roleList}]
  selectedKeys.value = ['all']
  selectedKeys2.value = ['all']
}

function handleSelect(keys: string, e:any) {
  let keyStr = keys[0]/*+','*/;
  /*if (null != e.selectedNodes && e.selectedNodes.length > 0
    && null != e.selectedNodes[0].props.children &&  e.selectedNodes[0].props.children.length > 0){
    keyStr = getThisNodeStr(e.selectedNodes[0].props.children,keyStr)
  }*/
  emit('select', {uniqueCode: keyStr/*.substring(0,keyStr.length-1)*/,deptList: []} )
}

function getThisNodeStr(list,str) {
  for (const nods of list) {
    str+=(nods.uniqueCode+',')
    if (null != nods.children && nods.children.length > 0){
      str = getThisNodeStr(nods.children,str)
    }
  }
  return str
}
onMounted(async () => {
  await fetch()
})
</script>
<style scoped>
.bg-white{
  width: 250px !important;
  min-height: 250px !important;
  border: 1px #cccccc solid;
  background:white !important;
  margin: 0%;
  margin-right: .2%;
}
</style>
