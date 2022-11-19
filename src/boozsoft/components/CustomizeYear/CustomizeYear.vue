<template>
  <div class="customize-year">
    <DatePicker valueFormat="YYYY" format="YYYY" mode="year" placeholder=""
                v-model:value="props.value" :open='pageShow'
                @openChange="openChangeOne" @panelChange="panelChangeOne"/>
  </div>
</template>
<script setup>
import {ref} from "vue";
import {DatePicker} from 'ant-design-vue';
const props = defineProps(['readonly','value'])
const emit=defineEmits(['CustomizeChange']);
const pageShow = ref(false)
function openChangeOne(status) {
  if (status) {
    pageShow.value = true
  }
}
function panelChangeOne(value) {
  props.value = value;
  pageShow.value = false;
  emit('CustomizeChange',value.format('YYYY'))
}
</script>
<style lang="less" scoped="scoped">
.customize-year{
  width: 80px;
  display: inline-block;
}
</style>
