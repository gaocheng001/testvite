<template>
  <BasicModal
    width="800px"
    :minHeight="260"
    :height="600"
    v-bind="$attrs"
    @ok="handleOk()"
    @cancel="handleClose()"
    @register="register"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">配置设置</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;min-height:260px;">
      <div style="height:100%;width: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <EditOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;NC应用服务器配置</span>
        </div>
        <div class="nc-open-content" style="padding-top: 15px;max-height:260px;">

          <div class="border-div">
            <span>软件配置</span>
            <div>
              <ul>
                <li>
                  <span>操作系统：</span>
                  <Input v-model:value="formItems.osName"/>
                </li>
                <li><span>数据库：</span><Input v-model:value="formItems.databaseName"/></li>
                <li><span>管理系统：</span><Input v-model:value="formItems.managementSystem"/></li>
                <li><span>数据备份：</span><Input v-model:value="formItems.dataBackup"/></li>
                <li><span>安全防护：</span><Input v-model:value="formItems.security"/></li>
                <li><span>外网IP地址：</span><Input v-model:value="formItems.extranetIp"/></li>
                <li><span>内网IP地址：</span><Input v-model:value="formItems.intranetIp"/></li>
              </ul>
            </div>
          </div>
          <div class="border-div">
            <span>硬件配置</span>
            <div>
              <ul>
                <li><span>结构：</span><Input v-model:value="formItems.serverStructure"/></li>
                <li><span>品牌型号：</span><Input v-model:value="formItems.brandInfo"/></li>
                <li><span>处理器：</span><Input v-model:value="formItems.processor"/></li>
                <li><span>内存：</span><Input v-model:value="formItems.memoryCard"/></li>
                <li><span>存储：</span><Input v-model:value="formItems.memoryStorage"/></li>
                <li><span>网卡：</span><Input v-model:value="formItems.networkCard"/></li>
                <li><span>电源：</span><Input v-model:value="formItems.powerSupply"/></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div>
        <Button @click="handleOk()"  type="primary">保存</Button>
        <Button @click="closeModal()">取消</Button>
      </div>
    </template>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
/********************************************* 公共参数 ********************************************************/
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {Input, Button} from "ant-design-vue"
import {AppstoreOutlined,EditOutlined} from '@ant-design/icons-vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {reactive, ref} from "vue";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
const { closeCurrent } = useTabs(router);
const emit = defineEmits(['register', 'save'])
const {createWarningModal} = useMessage();
const formItems: any = ref({});

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  formItems.value = data;
  setModalProps({ minHeight: 340 });
})


function handleOk() {
  emit('throwData',formItems.value);
  closeModal();
}

async function handleClose() {
  closeModal();
  return true;
}

</script>
<style lang="less" scoped>
.nc-open-content {
  background-image: url(/@/assets/images/homes/bg-pattern.png);
  background-repeat: no-repeat;
  background-position: 66% 8%;
  background-size: contain;
  position: relative;
  .border-div {
    position: relative;
    border: 1px #a29f9f solid;
    margin: 20px 10px;
    padding: 2.5%;

    > span {
      display: block;
      width: 80px;
      text-align: center;
      background-color: white;
      position: absolute;
      left: 50px;
      top: -10px;
      color: #888888;
      font-size: 12px;
      font-weight: bold;
    }
      >div{
       ul{
         li{
           padding: 5px 0;
           width: 50%;
           display: inline-flex;
           >span{
             display: block;
             width: 100px;
           }
           .ant-input{
             width: calc( 100% - 120px );
             border: none;
             border-bottom: 1px solid #c9c9c9;

           }
         }
       }
      }
  }
}
:deep(.ant-card-body) {
  padding: 16px;
  border-left: 2px solid rgb(1, 143, 251);
  box-shadow: rgb(72 113 140) -3px 1px 7px -1px;
}
:global(.ant-modal-header) {
  padding: 10px 0 !important;
}
:global(.ant-modal-close-x){
  height: 30px !important;
  color: white;
}
:deep(.ant-input){

}
</style>
