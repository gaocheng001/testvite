<template>
<div>
<!--  <div style="margin-top:15px">登陆日期: {{date}}</div>-->
</div>
</template>
<script setup>
import {Select, Button} from 'ant-design-vue'

const Option = Select.Option
import {useCompanyOperateStoreWidthOut} from '/@/store/modules/operate-company';
import {ref, computed} from 'vue';

const closeThis = ref(true)
const accountList = computed(() => useCompanyOperateStoreWidthOut().getAccountList)
const date = computed(() => {

  return useCompanyOperateStoreWidthOut().getLoginDate
})
const schemaName = computed(() => {
  if (useCompanyOperateStoreWidthOut().getSchemaName == null) {
    const accId = accountList.value[0].accId
    useCompanyOperateStoreWidthOut().commitSchemaName(accId)
    return accId
  } else {
    return useCompanyOperateStoreWidthOut().getSchemaName
  }
})
const changeAdInfo = (accId) => {
  useCompanyOperateStoreWidthOut().commitSchemaName(accId)
  useCompanyOperateStoreWidthOut().commitShowLoginDate(true)
  window.location.reload()
}
</script>
