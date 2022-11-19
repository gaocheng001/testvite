<template>
  <BasicMenuItem v-if="!menuHasChildren(item) && getShowMenu" v-bind="$props" />
  <SubMenu
    v-if="menuHasChildren(item) && getShowMenu"
    :class="[theme]"
    :key="`submenu-${item.path}`"
    popupClassName="app-top-menu-popup"
  >
    <template #title>
      <MenuItemContent v-bind="$props" :item="item"/>
    </template>
    <Cashier
      @register="registerCashierPage"
    />
    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <template v-if="childrenItem.title == '出纳签字' || childrenItem.title == '取消签字'">
        <div class="ant-menu-item ant-menu-item-only-child"  @click="openBookPage(childrenItem.title == '出纳签字')">
          {{childrenItem.title}}
        </div>
      </template>
      <template v-else>
        <BasicSubMenuItem v-bind="$props" :item="childrenItem" />
      </template>
    </template>
  </SubMenu>
</template>
<script lang="ts">
import type { Menu as MenuType } from '/@/router/types';

import { defineComponent, computed } from 'vue';
import { Menu } from 'ant-design-vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { itemProps } from '../props';
import BasicMenuItem from './BasicMenuItem.vue';
import MenuItemContent from './MenuItemContent.vue';
import {useModal} from "/@/components/Modal";
import Cashier from "/@/views/boozsoft/global/pingzheng-list-cashier.vue";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
export default defineComponent({
  name: 'BasicSubMenuItem',
  isSubMenu: true,
  components: {
    BasicMenuItem,
    SubMenu: Menu.SubMenu,
    MenuItemContent,
    Cashier
  },
  props: itemProps,
  setup(props) {
    const { prefixCls } = useDesign('basic-menu-item');
    const [registerCashierPage, { openModal: openCashierPageM }] = useModal()

    const getShowMenu = computed(() => !props.item.meta?.hideMenu);
    function menuHasChildren(menuTreeItem: MenuType): boolean {
      return (
        !menuTreeItem.meta?.hideChildrenInMenu &&
        Reflect.has(menuTreeItem, 'children') &&
        !!menuTreeItem.children &&
        menuTreeItem.children.length > 0
      );
    }
    const openBookPage = (flag) =>{
      openCashierPageM(true, {
        data: {'selectedRowKeys':[],'yearMonths': {year:'',months:[]},'mark': flag}
      })
    }

    return {
      prefixCls,
      menuHasChildren,
      getShowMenu,
      openBookPage,
      registerCashierPage,
    };
  },
});
</script>
