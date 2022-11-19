<template>
  <div style="height:100%">
    <LayoutContainer v-model="PlatformView">
      <template #routerInner>
        <LayoutContent/>
      </template>
    </LayoutContainer>
  </div>
</template>
<script setup>
import {computed, toRaw} from 'vue';
import {usePlatformsStoreWidthOut} from '/@/store/modules/platforms';
import LayoutContent from '../platforms/components/platform-default/content/index.vue'
import LayoutContainer from './components/platform-default/LayoutContainer.vue'

const layoutsStore = usePlatformsStoreWidthOut()
// import { roleStore } from '../store/modules/role';
// import { userStore } from '../store/modules/user';

const PlatformView = computed(() => toRaw(layoutsStore.getPlatformView))

</script>
