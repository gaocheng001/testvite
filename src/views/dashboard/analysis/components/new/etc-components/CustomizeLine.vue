<template>
  <div class="customize-line">
    <span>{{props.title || '标题'}}</span>
    <div></div>
    <CaretRightOutlined />
  </div>
</template>
<script setup lang="ts">
import {CaretRightOutlined} from '@ant-design/icons-vue';
const props = defineProps(['title'])
</script>
<style lang="less" scoped>
.customize-line{
  display: inline-block;
  position: relative;
  min-width: 80px;
  font-size: 12px;
  margin: 0 1%;
  user-select: none;
  >span:nth-of-type(1){
    text-align: center;
    color: #00969e;;
  }
  >div{
    height: 2px;
    width: 100%;
    background-color: #afb0b0;
  }
  >span:nth-of-type(2){
    position: absolute;
    right: -8px;
    top: 13px;
    color: #afb0b0;
  }
}
/*@media screen and (min-width: 1400px) {
  .customize-line {
    >span:nth-of-type(1){
      width: 80px!important;
      overflow-x: unset!important;
    }
  }
}*/
</style>
