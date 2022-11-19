<template>
  <slot></slot>
</template>
<script setup>
import {provide,ref,computed} from "vue";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useBoozSoftStoreWidthOut} from "/@/store/modules/boozsoft/boozsoft-app";
const AppProviderLang=ref(useBoozSoftStoreWidthOut())

provide('AppProviderLang',AppProviderLang)
</script>
