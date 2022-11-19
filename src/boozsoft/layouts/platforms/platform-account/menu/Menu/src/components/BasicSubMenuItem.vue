<template>
  <BasicMenuItem v-if="!menuHasChildren(item) && getShowMenu" v-bind="$props"/>
  <SubMenu
    v-if="menuHasChildren(item) && getShowMenu"
    :class="[theme,'zhongzhangMenuItem']"
    :key="`submenu-${item.path}`"
    popupClassName="app-top-menu-popup-hello"
  >
<!--    <Import-->
<!--      @reloadProjects="()=>{}"-->
<!--      @register="registerImportPage"-->
<!--    />-->
<!--    <ZcAuthorize-->
<!--      @register="registerAuthorizePage"-->
<!--    />-->
    <CancelClose
      @register="registerCancelPage"
    />
    <template #title>
      <MenuItemContent v-bind="$props" :item="item" />
    </template>
    <template    v-for="childrenItem in item.children || []">
      <MenuItemGroup :title="childrenItem.name"  >
        <template  v-for="(threeChildrenItem, index) in childrenItem.children || []"   >
        <MenuItem
          v-if="!threeChildrenItem.hideMenu"
          :key="threeChildrenItem.path"
        >{{threeChildrenItem.name}}</MenuItem>
        </template>
      </MenuItemGroup>
    </template>


  </SubMenu>
</template>
<script lang="ts">
import type {Menu as MenuType} from '/@/router/types';
import {defineComponent, computed, ref, watch} from 'vue';
import {Menu} from 'ant-design-vue';
import {useDesign} from '/@/hooks/web/useDesign';
import {itemProps} from '../props';
import BasicMenuItem from './BasicMenuItem.vue';
import MenuItemContent from './MenuItemContent.vue';
import {RouteLocationRaw} from 'vue-router';
import router from '/@/router';
// import Import from "/@/views/boozsoft/global/popup/accvoucher/import.vue";
// import ZcAuthorize from "/@/views/boozsoft/management/im-unit-three/popup/Authorization.vue";
// import CancelClose from "/@/views/boozsoft/global/popup/CancelClose.vue";
import {useModal} from "/@/components/Modal";
import {getCurrentAccountName, getCurrentAccountYear} from "/@/api/task-api/tast-bus-api";

export default defineComponent({
  name: 'BasicSubMenuItem',
  isSubMenu: true,
  components: {
    BasicMenuItem,
    SubMenu: Menu.SubMenu,
    MenuItemGroup: Menu.ItemGroup,
    MenuItem: Menu.Item,
    MenuItemContent
  },
  props: itemProps,
  setup(props) {
    const [registerImportPage, {openModal: openImportPageM}] = useModal()
    const [registerAuthorizePage, {openModal: openAuthorizePageM}] = useModal()
    const [registerCancelPage, { openModal: openCancelPageM }] = useModal()
    const hideMenu = ref(false);
    watch(
      props,
      () => {
        if (props.item != null) {
          hideMenu.value = props.item.hideMenu;
        }
      },
      {immediate: true}
    );

    const maxLength = ref(0);
    const {prefixCls} = useDesign('basic-menu-item');
    const getShowMenu = computed(() => {
      return !props.item.meta?.hideMenu;
    });

    function menuHasChildren(menuTreeItem: MenuType): boolean {
      return (
        Reflect.has(menuTreeItem, 'children') &&
        !!menuTreeItem.children &&
        menuTreeItem.children.length > 0
      );
    }

    function changeHigh(list: any) {
      // 获取当前list 最大数量 高度
      list.forEach((item) => {
        if (item.children == null) {
          return;
        }
        let value = item.children.length;
        if (maxLength.value < value) {
          maxLength.value = value;
        }
      });
    }

    function openImportPage() {
      openImportPageM(true, {
        data: {'schemaName': getCurrentAccountName(true)}
      })
    }

    function openAuthorizePage() {
      openAuthorizePageM(true, {
        'schemaName': getCurrentAccountName(true)
      })
    }
    function openCancelPage(){
      openCancelPageM(true, {
        'schemaName': getCurrentAccountName(true),
        'year': getCurrentAccountYear()
      })
    }
    return {
      hideMenu,
      prefixCls,
      menuHasChildren,
      getShowMenu,
      toRouting(path: RouteLocationRaw) {
        router.push(path);
      },
      changeHigh,
      maxLength,
      openImportPage,
      openAuthorizePage,
      openCancelPage,
      registerCancelPage,
      registerImportPage,
      registerAuthorizePage,
    };
  },
});
</script>
<style>
.ant-menu-submenu-popup::before {
  width: 0;
}
</style>
<style lang="less" scoped>
/*菜单面板样式*/
:deep(.ant-menu-submenu-title:hover) {
  color: #c6c6c6 !important;
}

.ant-menu-submenu {
  .menu-panel-content {
    * {
      background-color: white;
      font-size: 14px;
    }

    .two-children-item {
      display: inline-block;
      vertical-align: top;
      width: 160px;
      line-height: 30px;

      .two-children-item-title {
        text-align: center;
        font-weight: bold;
        color: black;
      }

      .two-children-item-title:hover {
        /* background-color: #f1adad;
         cursor: pointer;*/
      }

      .three-children-item {
        color: #3b3b3b;
        text-align: justify;

        .three-children-item-title:hover {
          background-color: #0096c7;
          cursor: pointer;
          color: white;
        }

        .four-children-item {
        }

        .four-children-item:hover {
          /*  background-color: #f1adad;
            cursor: pointer;*/
        }
      }
    }
  }
}

.app-top-menu-popup-hello .ant-menu-item-group{
  display: table-cell;

}

</style>
<style>

.app-top-menu-popup-hello .ant-menu.ant-menu-sub.ant-menu-vertical{
  padding: 0px 13px;
}
.app-top-menu-popup-hello .ant-menu-item-group-title{
  text-align: center;
  font-weight: 900 !important;
  color:#666666 !important;
  min-width:150px;
}
.app-top-menu-popup-hello .ant-menu-item-group-list li{
  text-align: left;
  padding:0 !important;
  height:30px;
  margin-top:0 !important;
  margin-bottom:0 !important;
  line-height: 30px;
 font-weight: bold!important;
  font-size: 13px!important;
}
</style>
