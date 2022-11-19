<template>
  <div ref="pageRootDom">
    <slot></slot>
  </div>
</template>
<script setup>
import {watch, provide, ref, computed, onMounted, inject} from "vue";
import {buildUUID} from "/@/utils/uuid";
import {useCurrentPageDatasourcePickerState} from "/@/layouts/page/ProvideDataFuns";
import router from "/@/router";
import {usePageDataStore, usePageDataStoreWidthOut} from "/@/store/modules/pageDataStore";


const props = defineProps(['getCaches'])
const caches = computed(() => props.getCaches)
const AppProviderLang = inject('AppProviderLang')
const uuid = ref(buildUUID())
/** ---------------------- 数据源路由 start  ---------------------- **/

const {getCurrentPageDatasourcePickerState} = useCurrentPageDatasourcePickerState()
const datasourcePicker = ref()
watch(router.currentRoute, () => {
  datasourcePicker.value = getCurrentPageDatasourcePickerState().value
  usePageDataStoreWidthOut().commitDatasourcePicker(getCurrentPageDatasourcePickerState().value)
}, {immediate: true})
AppProviderLang.value.setCurrentDataPicker(datasourcePicker)

const pageRootDom = ref()
const datasource = computed(() => datasourcePicker.value.datasource)
provide('datasourcePicker', datasourcePicker)
provide('datasourceLock', datasourcePicker.value.datasourceLock)
provide('usePageRouterApi', (params) => {
  return datasourcePicker.value.usePageRouterApi(params)
})
provide('pageRootDom', pageRootDom)

window.pageRootDom = pageRootDom

/** ---------------------- end ---------------------- **/

async function waitLoadView() {
  await new Promise((r) => {

    const interval = setInterval(() => {
      if (pageRootDom.value.parentElement.parentElement.parentElement != null) {
        r('')
        window.clearInterval(interval)
      }
    }, 10)

  })
}


// // 异步路由视图加载完毕，关闭系统启动加载页
onMounted(async () => {



})
</script>
