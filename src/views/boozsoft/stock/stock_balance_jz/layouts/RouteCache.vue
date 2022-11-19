<template>
  <Index></Index>
</template>
<script lang="ts">
import Index from '../index.vue';
import { defineComponent, onActivated, provide } from 'vue';

export default defineComponent({
  name: 'StockBalanceJZ',
  components: {
    Index,
  },
  setup() {
  },
  activated() {
  },
  created() {},
});
</script>
