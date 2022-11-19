<template>
<div>
  <ColGrid :label="props.record?.cinvodeName" :record="record">
    <CinvodeNameSlot :record="props.record" :cardListOptions="props.cardListOptions"/>
  </ColGrid>
</div>
</template>
<script setup>
import ColGrid from '../ColGrid.vue'
import {useModal} from "../../../../../../components/Modal";
import {computed, inject, provide, ref} from "vue";
// import CinvodeNameSlot from './CinvodeName/CinvodeNameSlot.vue'
const [registerStockInfoModalPage, {openModal: openStockInfoModalPage}] = useModal();
const dynamicTenantId =inject('dynamicTenantId')
const props=defineProps(['record','cardListOptions'])
const record=computed(()=>props.record)
const openSelectContent = (o, type) => {
  // thisEditObj.value = o
  // thisEditType.value = type
  switch (type) {
    case 'cinvode':
      openStockInfoModalPage(true, {
        database: dynamicTenantId.value,
      })
      break;
  }
  visible.value=false
}

function handleChange(){

}
function handleSearch(){

}
function focusNext(){

}

function modalData(){
  visible.value=false

}
</script>
