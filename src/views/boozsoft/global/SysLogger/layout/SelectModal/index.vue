<template>
  <BasicModal
    width="750px"
    height="250px"
    v-bind="$attrs"
    :title="'选择日期'"
    cancel-text="确定"
    :showOkBtn="false"
    @register="register"
  >
    <Layout />

  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Input } from 'ant-design-vue';
  import Layout from './layouts/index.vue';


  const { createWarningModal } = useMessage();

  const emit = defineEmits(['reload', 'register']);
  const [register, { closeModal, changeOkLoading, setModalProps }] = useModalInner(
    async (data) => {},
  );

  const voucherErrorTypeAutocomplete = (key, map) => {
    return map[key] || '其他错误';
  };
</script>
