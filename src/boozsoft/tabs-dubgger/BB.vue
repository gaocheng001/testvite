<template>
  <div>
    {{fuZhuHeSuanTableModel}}
    <button @click="visible=true">开启</button>
    <button @click="visible=false">关闭</button>
    <div v-if="visible">
      {{fuZhuHeSuanTableModel}}
    </div>
  </div>
</template>
<script setup>
import {watch,ref,computed} from 'vue'

const requireFuZhuColumns=ref([])
const props=defineProps(['modelValue'])

async function abc(){
  return [1]
}

watch(props.modelValue,async ()=>{
  console.log(1);
  requireFuZhuColumns.value=await abc(props.modelValue.value)

})
const isRequireJieSuanDanWei=computed(()=>requireFuZhuColumns.value.filter(item=>item.label==='供应商' ||item.label==='客户').length===-1)

const fuZhuHeSuanTableModel=computed(()=>{
  if(requireFuZhuColumns.value.length==0){
    return '1'
  }else{
    return '2'
  }
})

const visible=ref(false)
</script>
