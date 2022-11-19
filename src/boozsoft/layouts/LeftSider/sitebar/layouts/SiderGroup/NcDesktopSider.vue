<template>
  <div class="icon-color" style="font-size:16px;margin: 20px 0px 0px">
    <ul>
      <li @click="layoutsStore.switchPlatform({ id: ncDeskTopPlatfrom?.id })"
          :style="{background: ncDeskTopPlatfrom?.selected?'rgba(27, 154, 238, 0.1)':''}"
      >
        <div style="padding-left:8px">
          <span class="this_ico">
            <HomeOutlined></HomeOutlined>
          </span>
<!--          <img src="../../../../../../assets/svg/system_option/app2.svg"-->
<!--               style="margin:-1px auto 0;width: 15px;"/>-->
        </div>
        <span style="margin-left: 20px"
        >NC工作台</span>
      </li>
    </ul>
  </div>
</template>
<script setup>

import {computed, inject} from "vue";
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";
import {HomeOutlined} from '@ant-design/icons-vue';
const layoutsStore = usePlatformsStoreWidthOut();
const ncDeskTopPlatfrom = computed(() =>layoutsStore.getPlatforms.filter((item) => item.category === 106)[0]);

</script>
<style scoped>
.icon-color:hover{
  background:white;
  color:black !important;
}
.icon-color:hover .this_ico{
  color:black !important;

}

.icon-color .this_ico{
  color:#929191
}
.icon-color:hover .this_ico{
  color:white
}
</style>
