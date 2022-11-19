<template>
  <SelectModal @register="registerSelectModal" />
</template>
<script setup>
  import { useModal } from '../../../../../../../components/Modal';
  import SelectModal from '../index.vue';
  import { onMounted } from 'vue';

  const [registerSelectModal, { openModal: openSelectModal }] = useModal();
  onMounted(() => {
    openSelectModal();
  });
</script>
