<template>
  <BasicModal
    width="710px"
    v-bind="$attrs"
    :closable="false"
    @ok="handleOk()"
    @register="register"
    :canFullscreen="false"
    :footer="null"
  >
    <template #title>
      <div style="height: 30px;width: 100%;background-color: #5f375c;color: white;line-height: 30px;text-align: left;">
        <AppstoreOutlined  style="margin: 0 2px;font-size: 14px;"/>
        <span style="font-size: 14px">存货管理</span>
      </div>
    </template>
    <div style="display: inline-flex;justify-content: space-between;width: 100%;">
      <div style="width: calc(100% - 150px);height: 100%;">
        <div style="text-align: center;padding: 10px 0 5px;">
          <PlusCircleOutlined style="font-size: 24px;color: #0096c7;margin-top: 2px"/>
          <span style="line-height:30px;font-size: 24px;color: #0096c7;font-weight: bold;">&ensp;选择仓库</span>
        </div>
        <div class="nc-open-content">
          <div class="open-content-up">
            <div class="border-div">
              <span>仓库信息</span>
              <div>
                  <label style="font-size: 13px;font-weight: bold;color: #5a5a5a">仓库名称：</label>
                <a-select
                  v-model:value="cangkuId"
                  style="width: 350px;text-align: center;"
                >
                  <a-select-option :value="data.id" :key="data.id" :data="data" v-for="data in cangkuList">{{ data.ckName }}</a-select-option>
                  <template #suffixIcon><CaretDownOutlined style="color:#666666;" /></template>
                </a-select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-btns">
        <a-button style="width: 100px;margin-top: 10px" shape="round" @click="handleOk('0')" type="primary">继续</a-button>
        <a-button style="width: 100px;margin-top: 10px" shape="round" @click="closeOk">放弃</a-button>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {ref} from 'vue';
import {AppstoreOutlined, CaretDownOutlined, PlusCircleOutlined} from '@ant-design/icons-vue'
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  Form as AForm,
  Input as AInput,
  Select as ASelect,
  Statistic as AStatistic,
} from 'ant-design-vue';
import {useMessage} from "/@/hooks/web/useMessage";

const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const AFormItem = AForm.Item;
  const {createConfirm, createWarningModal } = useMessage();
  const emit=defineEmits(['register']);
  const cangkuList=ref([])
  const cangkuId=ref('')

  // 数据库模式名称
  const [register, { closeModal }] = useModalInner( async (data) => {
    cangkuList.value=data.cangkuList
    cangkuId.value=data.cangkuList[0]?.id
  });

  async function handleOk() {
    emit('save',cangkuId.value);
    closeModal();
  }
  const closeOk = () => {
    emit('closeOk');
    closeModal();
  }
</script>
<style lang="less" scoped>
:deep(.ant-checkbox){
  margin-top: -8px;
}
:deep(.ant-select-selector), :deep(.ant-input-affix-wrapper), :deep(.ant-input),:deep(.ant-picker),:deep(.ant-input-number) {
  border: none !important;
  border-bottom: 1px solid #bdb9b9 !important;
  background: none;
}
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
    text-align: left;
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
    :deep(.account-picker){
      >div{
        text-align: left;
      }
    }
  }

}

.right-btns{
  width: 150px;background-color: #f1f1f1;padding: 10% 4%;height: 200px;
  :deep(.ant-btn-primary:hover){
    border: 1px solid #5f375c;
  }
}
:global(.ant-modal-header) {
  padding: 10px 0 !important;
}
:global(.ant-modal-close-x){
  height: 30px !important;
  color: white;
}
</style>
