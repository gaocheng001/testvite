<template>
  <div class="abc" style="height: 230px;overflow-y: scroll;width: 200px;margin:100px 0 0 500px;border:solid 1px black" @scroll="scroll=$event.target.scrollTop">
    <div  :style="{height: dyHeight+'px',marginTop:dyMarginTop+'px'}">
      <ul style="" v-for="it in  tableDataEngine">
        <li>{{it.rowIndex}}</li>
        <li>{{it.name}}</li>
        <li>{{it.name}}</li>
        <li>{{it.name}}</li>
        <li>{{it.name}}</li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import {ref,computed} from 'vue'
// 给指定长度的数组
function giveArr(number){
  const arr=[]
  for(let j=0;j<number;j++){
    arr.push({rowIndex:j,name:'张三'})
  }
  return arr
}

// js处理数据的性能远远大于渲染速度
// jquery偏向渲染
// vue（虚拟dom）偏向数据处理

// 以下用vue的API,实践了无限数据表格

// 原数组
const originArr=ref(giveArr(1000001))


// 表格数据引擎
const tableDataEngine=computed(()=>{
  const start=parseInt(scroll.value/23)
  return originArr.value.slice(start,start+10)
})

// 变化scroll长度
const scroll=ref(0)

// 变化高度
const dyHeight=computed(()=>originArr.value.length*23-scroll.value)

// 变化marginTop
const dyMarginTop=computed(()=>scroll.value)

</script>
<style>
ul {
  display: flex;
  border:solid 1px black;
  border-bottom: none;
  margin:0;
  box-sizing: border-box;

  margin-bottom:0px !important;
  padding:0;
}
li{
  border:solid 1px black;
}

</style>
