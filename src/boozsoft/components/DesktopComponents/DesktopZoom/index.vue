<template>
  <div style="width: 100px;

    background: rgba(70 ,191 ,171 , 1);
    z-index: 10000000;
    position: fixed;
    right: 20px;
    top: 10px;
    text-align: center;
    color: white;
    border-radius: 20px;
    padding: 1px 10px;" v-show="showZoom">缩放：{{ zoom }}%
  </div>
  <div style="height: 10px;background: red;position: fixed;top: 0;z-index: 100000000;width: 100%; opacity: 0; -webkit-app-region: drag;"></div>
</template>
<script setup>
import {onMounted, ref} from "vue";

const zoom = ref(100.0);
const showZoom = ref(false);
onMounted(() => {
  if (window.process != null) {
    (async function () {
      const abc = (await import('./DesktopZoom')).abc;
      abc(zoom, showZoom);
    })();
  }

});
// const abc = ref(false);
// setTimeout(() => abc.value = true, 3000);
</script>
