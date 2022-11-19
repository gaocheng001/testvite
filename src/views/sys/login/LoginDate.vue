<template>
  <teleport to="body">

  <div style="    background: rgba(0, 0 ,0 , 0.9);
    position: fixed;
    width: 100%;
    left:0;top:0;
    transform: unset;
    height: 100%;
    z-index: 9;
">
<!--    <div-->
<!--      style="position: fixed;width:200px;background:#6888a2;height:100px;border:solid 1px black;border-radius:10px;left:calc((100% - 200px)/ 2);top:calc((100% - 100px)/ 2)">-->
<!--      登陆日期：-->
<!--      <DatePicker v-model:value="abcYearValue" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD"-->
<!--                  :locale="locale"></DatePicker>-->
<!--      <Button @click="abcYear()">确定</Button>-->
<!--    </div>-->
  </div>

  </teleport>
</template>
<script setup>
import {computed, ref} from "vue";
import {useCompanyOperateStoreWidthOut} from "../../../store/modules/operate-company";
import {Button, DatePicker} from 'ant-design-vue';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import moment from "moment";
const showAbcYear = computed(() => useCompanyOperateStoreWidthOut().getShowLoginDate);
const  date = moment().format('YYYY-MM-DD')
// console.log(date,1111)
const abcYearValue = ref(date);
const emit=defineEmits('ok')
// function abcYear() {


// }
</script>

