<template>
  <div class="customize-line">
    <div></div>
    <CaretRightOutlined />
  </div>
</template>
<script setup lang="ts">
import {CaretRightOutlined} from '@ant-design/icons-vue';
</script>
<style lang="less" scoped>
.customize-line{
  display: inline-block;
  position: relative;
  min-width: 50px;
  font-size: 12px;
  user-select: none;
  >span:nth-of-type(1){
    position: absolute;
    right: -24px;
    top: 0px;
    font-size: 34px;
    color: yellow;
  }
  >div{
    height: 10px;
    width: 100%;
    background-color: yellow;
    margin-top: 12px;
  }
}
</style>
