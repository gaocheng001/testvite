<template>
  <RouterView>
    <template #default="{ Component, route }">
<!--      {{getCaches}}-->
      <!--      {{getCaches}}-->
      <ProvideData :getCaches="getCaches"  :updated="route">
      <transition
        :name="
          getTransitionName({
            route,
            openCache,
            enableTransition: getEnableTransition,
            cacheTabs: getCaches,
            def: getBasicTransition,
          })
        "
        mode="out-in"
        appear
      >

        <keep-alive v-if="openCache" :include="getCaches" >
          <component :key="route.fullPath" :is="Component"></component>
        </keep-alive>

        <component v-else :is="Component" :key="route.fullPath" />
      </transition>
      </ProvideData>
    </template>
  </RouterView>
  <FrameLayout v-if="getCanEmbedIFramePage" />
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, onActivated, unref} from 'vue';

import Index2 from './index2.vue'
import FrameLayout from '/@/layouts/iframe/index.vue';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';

import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
import { getTransitionName } from './transition';

import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import ProvideData from "/@/layouts/page/ProvideData.vue";
import {abcasdsadsa} from "/@/boozsoft/layouts/platforms/components/platform-default/tabs/helloPlatform";
import {buildUUID} from "/@/utils/uuid";
import { onBeforeRouteLeave } from 'vue-router';
export default defineComponent({
  name: 'PageLayout',
  components: { FrameLayout,ProvideData,Index2 },
  setup() {
    const { getShowMultipleTab } = useMultipleTabSetting();
    const tabStore = computed(()=>abcasdsadsa());

    const { getOpenKeepAlive, getCanEmbedIFramePage } = useRootSetting();

    const { getBasicTransition, getEnableTransition } = useTransitionSetting();

    const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab));

    const getCaches = computed((): string[] => {
      if (!unref(getOpenKeepAlive)) {
        return [];
      }
      return tabStore.value.getCachedTabList;
    });

    return {
      abc(){
        return buildUUID()
      },
      getTransitionName,
      openCache,
      getEnableTransition,
      getBasicTransition,
      getCaches,
      getCanEmbedIFramePage,
    };
  },
});
</script>
