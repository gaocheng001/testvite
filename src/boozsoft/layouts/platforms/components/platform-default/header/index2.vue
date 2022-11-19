<template>
  <Header :class="getHeaderClass">
    <!-- left start -->
    <div :class="`${prefixCls}-left`">
      <!-- logo -->
      <img src="/img/work.png" @click="goHome()" class="workbenchImg"
           style="width: 24px;height: 24px;margin: 12px;-webkit-user-drag: none;cursor: pointer"/>
      <span style="font-weight: bold;font-size: 20px;display: block;width: 200px">&emsp;{{ titleName }}</span>
      <LayoutTrigger
          v-if="
          (getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile
        "
          :theme="getHeaderTheme"
          :sider="false"
      />
      <LayoutBreadcrumb v-if="getShowContent && getShowBread" :theme="getHeaderTheme"/>
    </div>
    <!-- left end -->

    <!-- menu start -->
    <div :class="`${prefixCls}-menu`" v-if="!(getShowTopMenu && !getIsMobile)" style="position:relative;">

      <div style="position:absolute;height:100%;width:calc(100% - 100px);left:100px">
        <div style="display:flex;justify-content:flex-start">
          <Skeleton active :width="9500"  :paragraph="{ rows: 1 }"  />
          <Skeleton active :width="9500"  :paragraph="{ rows: 1 }"  />
          <Skeleton active :width="9500"  :paragraph="{ rows: 1 }"  />
          <Skeleton active :width="9500"  :paragraph="{ rows: 1 }"  />
          <Skeleton active :width="9500"  :paragraph="{ rows: 1 }"  />
        </div>
      </div>
    </div>
    <div v-else :class="`${prefixCls}-menu`" style="position:relative;">
      <Menu mode="horizontal">
        <MenuItem key="mail">
          <template #icon>
            <mail-outlined />
          </template>
          Navigation One
        </MenuItem>
        <MenuItem key="sub1" disabled>
          <template #icon>
            <appstore-outlined />
          </template>
          Navigation Two
        </MenuItem>
        <SubMenu key="sub1">
          <template #icon>
            <setting-outlined />
          </template>
          <template #title>Navigation Three - Submenu</template>
          <MenuItemGroup title="Item 1">
            <MenuItem key="setting:1">Option 1</MenuItem>
            <MenuItem key="setting:2">Option 2</MenuItem>
          </MenuItemGroup>
          <MenuItemGroup title="Item 2">
            <MenuItem key="setting:3">Option 3</MenuItem>
            <MenuItem key="setting:4">Option 4</MenuItem>
          </MenuItemGroup>
        </SubMenu>
        <MenuItem key="sub1">
          <a href="https://antdv.com" target="_blank" rel="noopener noreferrer">
            Navigation Four - Link
          </a>
        </MenuItem>
      </Menu>

    </div>
    <!-- menu-end -->

    <!-- action  -->
    <div :class="`${prefixCls}-action`" style="width:30px;min-width:30px">
<!--            <AppSearch :class="`${prefixCls}-action__item `"/>

            <ErrorAction v-if="getUseErrorHandle" :class="`${prefixCls}-action__item error-action`"/>

            <Notify v-if="getShowNotice" :class="`${prefixCls}-action__item notify-item`"/>-->
      <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`"/>

<!--      <AppLocalePicker
        v-if="getShowLocalePicker"
        :reload="true"
        :showText="false"
        :class="`${prefixCls}-action__item`"
      />-->

      <!--      <UserDropDown :theme="getHeaderTheme"/>-->
<!--
            <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`"/>-->
    </div>
  </Header>
</template>
<script lang="ts" setup>
import {unref, computed} from 'vue';

import {propTypes} from '/@/utils/propTypes';

import {Layout, Badge,Skeleton,Menu} from 'ant-design-vue';
import {AppLogo} from '/@/components/Application';
import LayoutMenu from '../menu/index.vue';
import LayoutTrigger from '../trigger/index.vue';

import {AppSearch} from '/@/components/Application';

import {useHeaderSetting} from '/@/hooks/setting/useHeaderSetting';
import {useMenuSetting} from '/@/hooks/setting/useMenuSetting';
import {useRootSetting} from '/@/hooks/setting/useRootSetting';

import {MenuModeEnum, MenuSplitTyeEnum} from '/@/enums/menuEnum';
import {SettingButtonPositionEnum} from '/@/enums/appEnum';
import {AppLocalePicker} from '/@/components/Application';

import {UserDropDown, LayoutBreadcrumb, FullScreen, Notify, ErrorAction} from './components';
import {useAppInject} from '/@/hooks/web/useAppInject';
import {useDesign} from '/@/hooks/web/useDesign';
import {createAsyncComponent} from '/@/utils/factory/createAsyncComponent';
import {useLocale} from '/@/locales/useLocale';
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";

import {busUnit} from "/@/api/record/group/im-unit";
import {pointMessage} from "/@/api/task-api/tast-bus-api";
import router from "/@/router";

const MenuItem=Menu.Item
const MenuItemGroup=Menu.ItemGroup
const SubMenu=Menu.SubMenu
function goHome() {
  usePlatformsStoreWidthOut().goHome()
}

const props = defineProps({fixed: propTypes.bool})
const Header = Layout.Header
const SettingDrawer = createAsyncComponent(() => import('../setting/index.vue'), {
  loading: true,
})

const {prefixCls} = useDesign('layout-header');
const {
  getShowTopMenu,
  getShowHeaderTrigger,
  getSplit,
  getIsMixMode,
  getMenuWidth,
  getIsMixSidebar,
} = useMenuSetting();
const {getUseErrorHandle, getShowSettingButton, getSettingButtonPosition} =
    useRootSetting();

const {
  getHeaderTheme,
  getShowFullScreen,
  getShowNotice,
  getShowContent,
  getShowBread,
  getShowHeaderLogo,
  getShowHeader,
} = useHeaderSetting();

const {getShowLocalePicker} = useLocale();

const {getIsMobile} = useAppInject();

const getHeaderClass = computed(() => {
  const theme = unref(getHeaderTheme);
  return [
    prefixCls,
    {
      [`${prefixCls}--fixed`]: props.fixed,
      [`${prefixCls}--mobile`]: unref(getIsMobile),
      [`${prefixCls}--${theme}`]: theme,
    },
  ];
});

const getShowSetting = computed(() => {
  if (!unref(getShowSettingButton)) {
    return false;
  }
  const settingButtonPosition = unref(getSettingButtonPosition);

  if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
    return unref(getShowHeader);
  }
  return settingButtonPosition === SettingButtonPositionEnum.HEADER;
});

const getLogoWidth = computed(() => {
  if (!unref(getIsMixMode) || unref(getIsMobile)) {
    return {};
  }
  const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
  return {width: `${width}px`};
});

const getSplitType = computed(() => {
  return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
});

const getMenuMode = computed(() => {
  return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
});
const titleName = computed(() => {
  const platformStore = usePlatformsStoreWidthOut()
  const id = platformStore.getCurrentPlatformId
  const platforms = platformStore.getPlatforms
  if(platforms.filter(item => item.id == id).length==0){
    return ''
  }
  return platforms.filter(item => item.id == id)[0].name
})
</script>
<style scoped lang="less">
@import './index.less';
</style>
