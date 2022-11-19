<template>
  <BasicModal
              v-bind="$attrs"
              :title="''"
              :canFullscreen="true"
              :defaultFullscreen="true"
              @ok="handleOk()"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <img src="/create.svg" style="width:25px;margin-right: 10px;"/>
        <span style="line-height: 25px;font-size: 16px;">生成凭证</span>
      </div>
    </template>
    <div class="nc-query-open-content">
<!--      <PingzhengIndex></PingzhengIndex>-->
    </div>
  </BasicModal>
</template>

<script setup>
import {BasicModal, useModalInner} from '/@/components/Modal';
import {GenerateDynamicColumn} from "../../component/DynamicForm";
import {JsonTool} from "../../../../../../api/task-api/tools/universal-tools";
/*import PingzhengIndex from '/@/components/pingzheng-fillin/index.vue';*/
import {provide,ref} from "vue";

let fun = null;
provide('onActivedFun', (fun1) => {
  fun = fun1;
});
if (fun != null) {
  fun();
}
const showPingzheng=ref(false)

function openPingzheng(){
  showPingzheng.value=true
}

const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
});

function handleOk(){

}
</script>
<style>
.full-pingzheng-modal .ant-modal{
  top:10px !important;
}
</style>
