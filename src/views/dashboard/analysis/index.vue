<template>
  <div>
    <JiTuanHome v-if="mark == 1003"/>
    <XiangJinLiuLiang v-else-if="mark == 1006"/>
    <ZhuShuJu v-else-if="mark == 20007 || mark == 20008 || mark == 20009 || mark == 200010"/>
    <ZuZhi v-else-if="mark == 1014"/>
    <GuDingZiChan v-else-if="mark == 20001"/>
    <NcGongZuoTai v-else-if="mark == 20006"/>
    <YingShouKuan v-else-if=" mark == 1007"/>
    <YingFuKuan v-else-if="mark == 20017"/>
    <CaoZuoYuan v-else-if="mark == 10133100"/>
    <QingChuSuoDing v-else-if="mark == 10133200"/>
    <CaoZuoRiZhi v-else-if="mark == 10133300"/>
    <RenWuZhongXin v-else-if="mark == 10133400"/>
    <CunHuoGuanLi v-else-if="mark == 1099"/>
  </div>
</template>
<script setup lang="ts">
import YingShouKuan from './index-Ysk.vue';
import YingFuKuan from './index-Yfk.vue';
import ZhuShuJu from './index-Data.vue';
import ZuZhi from './index-Org.vue';
import XiangJinLiuLiang from './index-Xj.vue';
import JiTuanHome from './index-Jt.vue';
import GuDingZiChan from './index-Gd.vue';
import NcGongZuoTai from './index-Nc.vue';
import CaoZuoYuan from './index-Operator.vue';
import QingChuSuoDing from './index-Clear.vue';
import RenWuZhongXin from './index-Task.vue';
import CaoZuoRiZhi from './index-Log.vue';
import CunHuoGuanLi from './index-Stock.vue';
import {usePlatformsStore} from "/@/store/modules/platforms";
import {onMounted, ref} from "vue";
const mark = ref(usePlatformsStore().getCurrentPlatformId)
onMounted(() => {


})
</script>
