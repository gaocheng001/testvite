<template>
  <div class="dasddsasadsa" style="position:relative;background:#0096c733;box-shadow:#597fa1 0px 1px 7px 1px;width:1193px;border-radius:10px;height:800px;margin:20px auto 0;overflow:hidden;">
    <div style="background:#e3e3e3;padding:5px">填制凭证</div>
    <div style="position:absolute;right:12px;top:5px;color:black">
      <CloseSquareOutlined />
    </div>
      <slot></slot>
  </div>

</template>
<script setup>
import {
  SearchOutlined, PlusOutlined, SettingOutlined, CloseSquareOutlined
} from '@ant-design/icons-vue'

</script>
