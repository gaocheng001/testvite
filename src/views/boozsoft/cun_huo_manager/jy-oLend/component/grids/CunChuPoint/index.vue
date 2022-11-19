<template>
<div>
  <Select
    v-model:value="record.tempOne"
    :default-active-first-option="false"
    :filter-option="false"
    :not-found-content="null"
    :show-arrow="false"
    show-search
    :options="props.ckListOptions.map(it=>({value: it.id,label: it.ckName}))"
    style="width: 82%;"
    class="cwhcode"
  ></Select>
  <SearchOutlined @click="openSelectContent(record,'cwhcode')"/>
  <StockCangKuModalPop @register="registerStockCangKuModalPage" @throwData="modalData"/>

</div>
</template>
<script setup>
import { Select } from "ant-design-vue";
import { SearchOutlined } from '@ant-design/icons-vue';
import {computed, inject} from "vue";
import {useModal} from "/@/components/Modal";
const props=defineProps(['record','ckListOptions'])
const record=computed(()=>props.record)
const dynamicTenantId=inject('dynamicTenantId')
const [registerStockCangKuModalPage, {openModal: openStockCangKuModalPage}] = useModal();
import StockCangKuModalPop
  from "/@/views/boozsoft/global/popup/dept/select-dept.vue";
const openSelectContent = (o, type) => {
  openStockCangKuModalPage(true, {
    database: dynamicTenantId.value,
  })
}

const setRecord=inject('setRecord')
const setGridVisible=inject('setGridVisible')
function modalData(e){
  // console.log(e[0].cangkuId)
  // console.log(e[0].cangkuName)
  setRecord({
    cwhcode:e[0].cangkuId,
    cwhcodeName:e[0].cangkuName

  })
  setGridVisible(false)
}
</script>
