<template>
  <div v-if="appPlatfroms.filter(it=>abc1(it)).length>0" style="margin-top: 20px">
    <div class="collapse-container" style="margin-left: 13px; margin-bottom: 10px"
    ><span class="title" style="color:white">基础档案</span
    ><span
      class="icon__YImk icon dls-icon icon-chevron-up show-on-hover"
      data-role="icon"
      color="gray"
      type="subtle"
      style="font-size: 14px"
    ></span>
    </div>
    <ul style="padding-left:23px">
      <template v-for="it in appPlatfroms.filter(it=>abc1(it))">
        <Item
          v-if="it.name!='机构' && it.name!='客户' && it.name!='供应商'"
          :selected="it.selected"
          @click="abc(), layoutsStore.switchPlatform({ id: '20007' })"
          :isCloud="it.isCloud"
          :isOutLink="it.isOutLink"
          :icon="it.icon"
          :isTargetBlank="it.isTargetBlank"
        >{{ it.name }}
        </Item>
      </template>
      <Item :icon="CloudUploadOutlined">导入数据</Item>
      <Item :icon="CloudDownloadOutlined">导出数据</Item>
    </ul>

  </div>
</template>
<script setup>
import AppBox from '../../components/appbox/index.vue';
import Item from '../../components/appbox/item.vue';
import {
  CaretDownFilled,
  FormOutlined,
  DeleteOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined, EllipsisOutlined,
  EditFilled,
  PieChartFilled,
  FilterFilled, EditOutlined, SortAscendingOutlined, CheckOutlined, SortDescendingOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons-vue';
import {computed, inject} from "vue";
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";
const icons=[
  FormOutlined,
  DeleteOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined,
  EllipsisOutlined,
  EditFilled,
  PieChartFilled,
  FilterFilled,
  EditOutlined,
  SortAscendingOutlined,
  CheckOutlined,
  SortDescendingOutlined
]
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
const permissionPlatfroms = computed(() =>
  layoutsStore.getPlatforms.filter((item) => item.category === 101)
);


function abc1(item) {
  let a = false
  if (item.name.indexOf('主数据') != -1 || item.name.indexOf('机构') != -1 || item.name.indexOf('客户') != -1 || item.name.indexOf('供应商') != -1) {
    a = true
  }
  return a
}

</script>
