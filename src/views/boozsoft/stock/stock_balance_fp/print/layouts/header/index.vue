<template>
  <div class="a1_header" >
  <div style="width:100%;height:100%;position:relative">
    <div style="position:absolute;left:40px;top:10px;left:60px"><AccountPicker theme="one" @reloadTable="reloadTable" />
    </div>
    <div style="position:absolute;width:100%;top:0;height:100%"><slot name="defDiv"></slot></div>
    <div style="position:absolute;top:0;color:#0096c7;font-weight: 900;font-size:20px;" class="a1_header_title" >{{props.name}}</div>
    <div style="display: flex">
      <div style="width:calc(100vw - 600px)"></div>
      <div class="a1_header_buttons">
        <div style="text-align: right"><slot name="buttons"></slot></div>
        <div style="text-align: right;margin-top:15px"><slot name="iconButtons"></slot></div>
      </div>
    </div>
  </div>
  </div>
</template>
<script setup>
import AccountPicker from '/@/boozsoft/components/AccountPicker/AccountPicker.vue';

const props = defineProps(['name'])
</script>
<style>
.a1_header {
  padding:5px 10px 0;
  position: relative;
  height: 100px;
  background: white;
  border-radius: 5px;
}
.a1_header_title{
  position: absolute;width:100vw;text-align: center;z-index: 10000;color:blue
}
.a1_header_buttons{
  padding-top:5px;
  width:600px;

}
</style>
