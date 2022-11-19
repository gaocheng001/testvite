<template>
  <div :class="getWrapClass">
    <Tabs
      type="editable-card"
      size="small"
      :animated="false"
      :hideAdd="true"
      :tabBarGutter="3"
      :activeKey="activeKeyRef"
      @change="handleChange"
      @edit="handleEdit"
    >
      <template v-for="item in getTabsState.filter(it=>it.meta.title!='加载中222')" :key="item.query ? item.fullPath : item.path">
        <TabPane :closable="!(item && item.meta && item.meta.affix)">
          <template #tab>
            <TabContent :tabItem="item" />
          </template>
        </TabPane>
      </template>

      <template #rightExtra v-if="getShowRedo || getShowQuick">
        <TabRedo v-if="getShowRedo" />
        <TabContent ref="TabContent" :open="opendorp" isExtra :tabItem="$route" v-if="getShowQuick" />
        <FoldButton v-if="getShowFold" />
      </template>
    </Tabs>
  </div>
</template>
<script lang="ts">
  import type { RouteLocationNormalized } from 'vue-router';

  import { defineComponent, computed, unref, ref } from 'vue';

  import { Tabs } from 'ant-design-vue';
  import TabContent from './components/TabContent.vue';
  import FoldButton from './components/FoldButton.vue';
  import TabRedo from './components/TabRedo.vue';

  import { useGo } from '/@/hooks/web/usePage';

  import { useMultipleTabStore } from '/@/store/modules/multipleTab';
  import { useUserStore } from '/@/store/modules/user';

  import { initAffixTabs, useTabsDrag } from './useMultipleTabs';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';

  import { REDIRECT_NAME } from '/@/router/constant';
  import { listenerRouteChange } from '/@/logics/mitt/routeChange';

  import { useRouter } from 'vue-router';
  import {usePlatformsStore} from "/@/store/modules/platforms";
  import {abcasdsadsa} from "./helloPlatform";

  export default defineComponent({
    name: 'MultipleTabs',
    components: {
      TabRedo,
      FoldButton,
      Tabs,
      TabPane: Tabs.TabPane,
      TabContent,
    },
    setup() {

      const TabContent=ref()
      const affixTextList = initAffixTabs();

      useTabsDrag(affixTextList);

      const activeKeyRef = computed(()=>abcasdsadsa().getActiveKeyRef);

      const userStore = useUserStore();
      const router = useRouter();

      const { prefixCls } = useDesign('multiple-tabs');
      const go = useGo();
      const { getShowQuick, getShowRedo, getShowFold } = useMultipleTabSetting();

      const getTabsState = computed(() => {
        const arr = abcasdsadsa().getTabList.filter((item) => !item.meta?.hideTab);
        return arr
      });

      const unClose = computed(() => unref(getTabsState).length === 1);

      const getWrapClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--hide-close`]: unref(unClose),
          },
        ];
      });

      if(window.listenerRouteChange==null){
        window.listenerRouteChange="1"
        listenerRouteChange((route) => {
          const tabStore = abcasdsadsa();
          const { name } = route;
          if (name === REDIRECT_NAME || !route || !userStore.getToken) {
            return;
          }

          const { path, fullPath, meta = {} } = route;
          const { currentActiveMenu, hideTab } = meta;
          const isHide = !hideTab ? null : currentActiveMenu;
          const p = isHide || fullPath || path;
          if (activeKeyRef.value !== p) {
            abcasdsadsa().setActiveKeyRef(p)
          }
          if (isHide) {
            const findParentRoute = router
              .getRoutes()
              .find((item) => item.path === currentActiveMenu);

            findParentRoute &&
            tabStore.addTab((findParentRoute as unknown) as RouteLocationNormalized);
          } else {
            tabStore.addTab(unref(route));
            window.abc=tabStore
          }
        });
      }

      function handleChange(activeKey: any) {
        abcasdsadsa().setActiveKeyRef(activeKey as string)
        go(activeKey, false);
      }

      // Close the current tab
      function handleEdit(targetKey: string) {
        // Added operation to hide, currently only use delete operation
        if (unref(unClose)) {
          return;
        }
        // console.log(TabContent.value)
        // TabContent.value.openThis()
        abcasdsadsa().closeTabByKey(targetKey, router);
      }
      return {
        TabContent,
        // prefixCls,
        // unClose,
        getWrapClass,
        handleEdit,
        handleChange,
        activeKeyRef,
        getTabsState,
        getShowQuick,
        getShowRedo,
        getShowFold,
        opendorp(e){
          e()
        }
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
</style>
