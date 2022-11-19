<template>
  <div class="booz_nav booz_nav1">
    <div style="top:-5px;right:0;height:30px;position: absolute">
    </div>
    <SiderHeader></SiderHeader>
    <SiderClose></SiderClose>
    <NcDesktopSider></NcDesktopSider>
    <div style="height: calc(100% - 168px);overflow-y:scroll">
      <AppSider></AppSider>
      <ManagerSider></ManagerSider>
      <BasicRecordSider></BasicRecordSider>
      <div v-if="appPlatfroms.length==0" style="padding:20px">
        <Skeleton active :width="9500"  :paragraph="{ rows: 17 }"  />
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed, provide, watch} from 'vue';
import {usePlatformsStoreWidthOut} from '/@/store/modules/platforms';
import AppBox from './components/appbox/index.vue';
import Item from './components/appbox/item.vue';
import aaa from 'file-saver'
import {Skeleton} from 'ant-design-vue'
import DebuggerInfo from './index2.vue'
import LoginInfo from './LoginInfo.vue'
import ShutdownPage from './ShutdownPage.vue'
import SiderClose from './layouts/SiderClose.vue'
import SiderHeader from './layouts/SiderHeader.vue'
import AppSider from './layouts/SiderGroup/AppSider.vue'
import ManagerSider from './layouts/SiderGroup/ManagerSider.vue'
import BasicRecordSider from './layouts/SiderGroup/BasicRecordSider.vue'
import {
  CaretDownFilled,
  FormOutlined,
  DeleteOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined, EllipsisOutlined,
  EditFilled,
  PieChartFilled,
  FilterFilled, EditOutlined, SortAscendingOutlined, CheckOutlined, SortDescendingOutlined
} from '@ant-design/icons-vue';


import BugInfo from './BugInfo.vue'
const layoutsStore = usePlatformsStoreWidthOut();
import {nextTick, ref} from 'vue';
import {syncMenuAndRoleMenuApi} from '/@/api/sys/menu';
import router from '/@/router';
import {useMultipleTabWithOutStore} from '/@/store/modules/multipleTab';
import {useUserStore, useUserStoreWidthOut} from '/@/store/modules/user';
import {useHeaderSetting} from "/@/hooks/setting/useHeaderSetting";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import NcDesktopSider from './layouts/SiderGroup/NcDesktopSider.vue'

const {
  getHeaderTheme,
} = useHeaderSetting();


const showShutdownPage = ref(false)



const platforms = computed(() => layoutsStore.getPlatforms);

const appPlatfroms = computed(() =>
  layoutsStore.getPlatforms.filter((item) => item.category === 102)
);



const taskL = [{name: '总账'}, {name: '薪酬管理'}, {name: '网上报销'}, {name: '现金银行'}, {name: '系统管理'}, {name: '组织管理'}]
const platformsRef = ref([]);

watch(
  platforms,
  () => {
    nextTick(() => {
      const currentLayoutId = layoutsStore.getCurrentLayoutId;
      if (currentLayoutId == null) {
        platformsRef.value[0].click();
      }
    });
  },
  {deep: true}
);

const apps = computed(() => layoutsStore.getApps);
// selectPromissPage(item)
const showDevTool = ref(false)
if (useUserStoreWidthOut().getRoleList?.filter(item => item.roleAlias == 'devrole').length > 0) {

  showDevTool.value = true
}

const date = computed(() => {

  return useCompanyOperateStoreWidthOut().getLoginDate
})
const schemaName = computed(() => {
  if (useCompanyOperateStoreWidthOut().getSchemaName == null) {
    const accId = accountList.value[0].accId
    useCompanyOperateStoreWidthOut().commitSchemaName(accId)
    return accId
  } else {
    return useCompanyOperateStoreWidthOut().getSchemaName
  }
})


function aaaadddd(){
  showShutdownPage.value=true
}

</script>

<style scoped>
.collapse-container span {
  flex: 1;
  -ms-flex-align: center;
  margin-right: 8px;
  color: #8c8c8c;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 218ms ease;
}

.selectLi {
  background-color: rgba(27, 154, 238, 0.1);
}

span {
  font-size: 16px;
}
</style>
<style scoped>
svg {
  width: 20px;
}

:deep( li) {
  padding: 10px 16px;
  text-align: left;
  display: flex;
  height: auto;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  line-height: 20px;
  transition: none;
  cursor: pointer;
  border-radius: 4px;
}

.booz_nav1 {
  position: relative;
  width: 100%;
  background: rgb(246, 248, 252);
  height: 100%;
  border: 1px solid black;
  overflow: hidden;
}


.booz_nav.booz_nav1{
  background:#0c2556;color:white; width:228px;   height: calc(100%);
}
</style>
