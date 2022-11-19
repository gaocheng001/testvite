<template>
  <div style="margin: 20px 0px 0px">
    <div class="collapse-container" style="margin-left: 13px; margin-bottom: 10px"
         v-if="permissionPlatfroms.length!=0">
      <span class="title" style="color:white">管理</span>
    </div>
    <ul style="padding-left:23px">
      <Item
        :selected="it.selected"
        v-for="it in permissionPlatfroms"
        @click="layoutsStore.switchPlatform({ id: it.id })"
        :icon="it.icon"
        :isCloud="it.isCloud"
        :isOutLink="it.isOutLink"
        :isTargetBlank="it.isTargetBlank"
      >{{ it.name }}
      </Item>

<!--      <Item :icon="UserAddOutlined">操作员</Item>-->
<!--      <Item :icon="UnlockOutlined">权限设置</Item>-->
<!--      <Item :icon="DeleteOutlined">清除锁定</Item>-->
<!--      <Item :icon="SnippetsOutlined">操作日志</Item>-->
    </ul>
  </div>
</template>
<script setup>
import AppBox from '../../components/appbox/index.vue';
import Item from '../../components/appbox/item.vue';
import {
  FormOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  UserAddOutlined,
  UnlockOutlined,
  DeleteOutlined,
  SnippetsOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons-vue';

const icons=[
  AppstoreOutlined,
  ClusterOutlined,
  UserAddOutlined,
  UnlockOutlined,
  DeleteOutlined,
  SnippetsOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined
]
import {computed, inject} from "vue";
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";

const layoutsStore = usePlatformsStoreWidthOut();
const ncDeskTopPlatfrom = computed(() =>layoutsStore.getPlatforms.filter((item) => item.category === 106)[0]);

const appPlatfroms = computed(() =>{
    let i=0
    return layoutsStore.getPlatforms
      .filter((item) => item.category === 102)
      .map(it=>({
        ...it,
        icon:icons[i++]
      }))
  });

function abc2(item) {
  let a = true
  if (item.name.indexOf('主数据') != -1 || item.name.indexOf('机构') != -1 || item.name.indexOf('客户') != -1 || item.name.indexOf('供应商') != -1) {
    a = false
  }
  return a
}
function abc() {
  // useMultipleTabWithOutStore().closeAllTab(router);
  // router.push('/zhongZhang/home/welcome');

  // setTimeout(()=>{
  // },1000)
}

const permissionPlatfroms = computed(() =>{
  let i=0
  return layoutsStore.getPlatforms
    .filter((item) => item.category === 101)
    .map(it=>({
      ...it,
      icon:icons[i++]
    }))
});
</script>
