<template>
  <div style="    width: calc(100% - 20px);margin-top: 0px">
    <div class="collapse-container" style="margin-left: 13px; margin-bottom: 10px"
    >
      <span class="title" style="color:white">应用</span>
      <span class="icon__YImk icon dls-icon icon-chevron-up show-on-hover"
      data-role="icon"
      color="gray"
      type="subtle"
      style="font-size: 14px"></span>
    </div>
    <AppBox>
      <template v-for="it in appPlatfroms">
        <div style="position: relative">
          <Item
            :selected="it.selected"
            v-if="abc2(it)"
            @click="clickItem(it)"
            :isCloud="it.isCloud"
            :icon="it.icon"
            :isOutLink="it.isOutLink"
            :isTargetBlank="it.isTargetBlank"
          >
            {{ it.name }}
            <div v-if="it.name=='薪酬管理' ||it.name=='网上报销'|| it.name=='财税达'"
                 style="position: absolute;top:10px;right:10px">
<!--              <ReloadOutlined @click="layoutsStore.reloadIframe(it.name)"/>-->
            </div>

          </Item>
        </div>
      </template>
    </AppBox>
  </div>
</template>
<script setup>
import AppBox from '../../components/appbox/index.vue';
import Item from '../../components/appbox/item.vue';
import {computed, inject} from "vue";
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";
import {
  ProjectOutlined,
  CloudServerOutlined,
  PayCircleOutlined,
  DesktopOutlined,
  RedEnvelopeOutlined,
  RotateRightOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  UserAddOutlined,
  UnlockOutlined,
  DeleteOutlined,
  SnippetsOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  ReloadOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons-vue';

const icons=[
  ProjectOutlined,
  CloudServerOutlined,
  PayCircleOutlined,
  DesktopOutlined,
  RedEnvelopeOutlined,
  RotateRightOutlined,
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

function clickItem(it){
  abc()
  // 跳转同一个页面
  if (it.name.indexOf('应付账') != -1 && false) {
  layoutsStore.switchPlatform({ id: appPlatfroms.value.filter(it=>it.name=='应收账')[0].id })
  }else{
  layoutsStore.switchPlatform({ id: it.id })
  }
}
</script>
