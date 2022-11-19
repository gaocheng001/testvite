<template>
  <div style="height:100%">
<!--    ZOOM_FADE = 'zoom-fade',-->
<!--    ZOOM_OUT = 'zoom-out',-->
<!--    FADE_SIDE = 'fade-slide',-->
<!--    FADE = 'fade',-->
<!--    FADE_BOTTOM = 'fade-bottom',-->
<!--    FADE_SCALE = 'fade-scale',-->
    <transition
      name="fade-slide"
      mode="out-in"
      appear
    >
    <component v-if="layout!=10" :is="layout" ref="hello"/>
    </transition>
    <teleport v-if="showTeleport" :to="teleportTo">
        <slot name="routerInner"></slot>
    </teleport>
  </div>
</template>
<script setup>
import {nextTick, computed, onMounted, watch, ref, provide, markRaw, shallowRef, unref} from 'vue'

const showLayout = ref(false)
const showTeleport = ref(false)
const hello = ref()
const teleportTo = ref(document.createElement('div'))
const props = defineProps(['modelValue'])
const layout = shallowRef(10)
const layoutContainerData = ref({})
provide('layoutContainerData', layoutContainerData)
watch(props, async (e) => {
  layoutContainerData.value.routerView=null
  showTeleport.value = true
  layout.value = props.modelValue
  await new Promise((r,e)=>{
    let i=0
    const aaa=setInterval(()=>{
      if(++i>500){
        e("错误：123213")
      }
      if(layoutContainerData.value.routerView!=null){
        window.clearInterval(aaa)
        r()
      }
    },200)
  })
  teleportTo.value = layoutContainerData.value.routerView
}, {immediate: true})

function triggerLayout() {
  if (showLayout.value) {
    teleportTo.value = document.createElement('div')
    showLayout.value = false
  } else {
    showLayout.value = true
    teleportTo.value = "#layout"
  }
}

// defineExpose({triggerLayout})
// onMounted(() => {
//   const a=hello.value
//   debugger
//   showTeleport.value = true
// })

</script>
