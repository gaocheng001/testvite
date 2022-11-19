<template>
  <div v-if="abc" class="boozsoftPdfViewer">
    <div
      style="
        width: 100%;
        height: 25px;
        border-radius: 5px 5px 0 0;
        position: absolute;
        top: 0px;
        background: #acdad5;
      "
    >
      <div style="color: green; margin-top: 2px; margin-left: 5px">NC打印面板</div>
      <div @click="abc = false" style="position: absolute; right: 10px; top: 3px; cursor: pointer">
        X
      </div>
    </div>
    <iframe
      v-once
      ref="ddd"
      src="/nc/?data="
      style="width: 100%; position: absolute; height: calc(100% - 0px); background: #ededf0"
    ></iframe>
    <div
      @click="abc = false"
      style="
        cursor: pointer;
        position: absolute;
        text-align: center;
        font-size: 20px;
        padding-top: 2px;
        border-radius: 5px;
        bottom: -4px;
        background: rgb(128 128 128 / 0.9);
        height: 30px;
        width: 100px;
        left: calc((100% - 20px) / 2);
      "
    >
      <CloseSquareOutlined style="color: white" />
    </div>
  </div>
</template>
<script setup>
  import { nextTick, ref } from 'vue';
  import {
    SearchOutlined,
    PlusOutlined,
    SettingOutlined,
    CloseSquareOutlined,
  } from '@ant-design/icons-vue';
  const abc = ref(false);
  const ddd = ref();
  const props = defineProps(['modelValue']);
  async function abcd() {
    return new Promise((r) => {
      let i = 0;
      const int = setInterval(() => {
        if (i++ == 100) {
          window.clearInterval(int);
          throw new Error('找不到pdf iframe');
        }
        if (ddd.value.contentWindow.startPdf != null) {
          r();
          window.clearInterval(int);
        }
      }, 100);
    });
  }

  function startPrint() {
    abc.value = true;
    nextTick(async () => {
      await abcd();
      ddd.value.contentWindow.startPdf(props.modelValue);
    });
  }
  defineExpose({ startPrint });
</script>
<style>
  .boozsoftPdfViewer {
    position: fixed;
    z-index: 2147483647;
    left: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: calc(100% - 24px);
    box-shadow: 0 0 20px black;
  }
</style>
