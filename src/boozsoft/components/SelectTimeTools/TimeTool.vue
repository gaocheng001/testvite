<template>
  <div>
    <div class="ant-btn-group">
      <button
        type="button"
        class="ant-btn ant-btn-me"
        @click="findByTime('1')"
      ><span>本月</span></button>
      <button
        type="button"
        :disabled="btn2"
        class="ant-btn ant-btn-me"
        @click="findByTime('2')"
      ><span>上月</span></button>
      <button
        type="button"
        class="ant-btn ant-btn-me"
        @click="findByTime('3')"
      ><span>本季度</span></button>
      <button
        type="button"
        class="ant-btn ant-btn-me"
        @click="findByTime('4')"
      ><span>本年</span></button>
    </div>
  </div>
</template>
<script setup>
import {ref, computed,watch,onMounted} from 'vue';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
const databaseTrue = ref(getCurrentAccountName(true));
const btn2=ref(false)
const time={
  strDate:'',
  endDate:''
}
const props = defineProps(['databaseyearCopy','yewuMonth'])
onMounted(async () => {
  if(parseInt(props.yewuMonth)==1){
    btn2.value=true
  }
})
const emit = defineEmits(['reloadTable'])

function findByTime(type) {
  if(type==='1'){
    let temp=parseInt(props.yewuMonth)-1
    if(temp==1){ btn2.value=false }
    time.strDate=props.databaseyearCopy+'-'+props.yewuMonth
    time.endDate=props.databaseyearCopy+'-'+props.yewuMonth
  }else if(type==='2'){
    let temp=parseInt(props.yewuMonth)-1
    if(temp==1){
      btn2.value=true
    }
    temp=temp <10 ?'0'+temp:temp
    time.strDate=props.databaseyearCopy+'-'+temp
    time.endDate=props.databaseyearCopy+'-'+temp
  }else if(type==='3'){
    let quarter=[
      {
        title:[1,2,3],
        value:[props.databaseyearCopy+'-01',props.databaseyearCopy+'-03'],
      },
      {
        title:[4,5,6],
        value:[props.databaseyearCopy+'-04',props.databaseyearCopy+'-06'],
      },
      {
        title:[7,8,9],
        value:[props.databaseyearCopy+'-07',props.databaseyearCopy+'-09'],
      },
      {
        title:[10,11,12],
        value:[props.databaseyearCopy+'-10',props.databaseyearCopy+'-12'],
      }
    ]
   let temp= quarter.filter(v=>v.title.indexOf(parseInt(props.yewuMonth))!=-1)
    btn2.value=parseInt(temp[0].value[0].split('-')[1])==1
    time.strDate=temp[0].value[0]
    time.endDate=temp[0].value[1]
  }
  else if(type==='4'){
    time.strDate=props.databaseyearCopy+'-01'
    time.endDate=props.databaseyearCopy+'-12'
  }
  emit('reloadTable', time)
}
</script>
<style lang="less">
.ant-btn-group{
  display: inline-block;
}
</style>
