<template>
  <div>
    <div class="secondary-title">
      <div>
        <SearchOutlined v-if="props.iconType=='query'"/>
        <PrinterOutlined v-else-if="props.iconType=='print'"/>
        <PlusCircleOutlined v-else/>
      </div>
      <div>
        <span><slot></slot></span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {PlusCircleOutlined,SearchOutlined,PrinterOutlined} from '@ant-design/icons-vue';
const props = defineProps(['iconType'])
</script>
<style lang="less" scoped>
.secondary-title {
  width: 100%;
  color: #0096c7;
  text-align: center;
  font-weight: bold;
  margin: 5px 0;
  >div:nth-of-type(1){
    width: 40px;
    display: inline-flex;
    font-size: 30px;
  }
  >div:nth-of-type(2){
    display: inline-block;
    text-align: left;
    font-size: 22px;
  }
}
</style>
