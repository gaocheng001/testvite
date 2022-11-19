<template>

  <div style="width: 100%;height:100%;">
<!--    <div v-show="!showPlatform"-->
    <div v-show="false"
         style="width:100%;height:100%;padding:calc( (100% / 2 ) / 2 + 25px) calc( (100% / 2 ) - 10px) ">
      <Spin tip="加载模块中..." size="large"/>
    </div>
    <IframeView :visible="isIframe()" :items="iframeList"></IframeView>
    <transition
      name="fade-slide"
      mode="out-in"
      appear
    >
      <Layout v-show="isApp()"></Layout>
<!--      <Layout v-show="isApp() && showPlatform"></Layout>-->
    </transition>
  </div>
</template>
<script setup>
import IframeView from './components/IframeView.vue'
import Layout from '/@/boozsoft/layouts/platforms/index.vue'
import {Spin} from 'ant-design-vue'
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";
import {watch, ref, computed, nextTick} from "vue";

const platformsStore = usePlatformsStoreWidthOut()

const currentLayoutId = computed(() => platformsStore.getCurrentLayoutId)

const showLoading = computed(() => platformsStore.getShowLoading)
const showPlatform = ref(false)
const currentType = computed(() => platformsStore.getCurrentType)
const iframeList = computed(() => platformsStore.getIframeList)

function isIframe() {
  return currentType.value !== 'app'
}

function isApp() {
  return currentType.value === 'app'
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

watch(currentLayoutId, (val) => {
  platformsStore.commitShowLoading(true)
  if (isNumber(val)) {
    platformsStore.setCurrentType('app')
    nextTick(() => {
      // showLoading.value=false
      showPlatform.value = true
    })
  }
}, {immediate: true})
</script>
