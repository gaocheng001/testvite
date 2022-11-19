<template>
  <div>
    <br/>
    <div>
      添加年度：<DatePicker class="customize-year" value-format="YYYY" format="YYYY" mode="year" placeholder="" :allowClear="false"
                       v-model:value="yearValue" :open='pageShow'
                       @openChange="openChangeOne" @panelChange="panelChangeOne"/>

      &emsp;期间数量:<Select v-model:value="numValue" class="customize-select1"
                   style="width: 80px;text-align: center" @change="changePeriod()"
    >
      <SelectOption v-for="index in 5" :value="(index+11)+''">
        {{ index + 11 }}
      </SelectOption>
    </Select>
    </div>
    <br/>
    <div>
      开始期间：<Select v-model:value="startValue" class="customize-select2"  :disabled="true"
                   style="width: 100px;text-align: center">
      <SelectOption v-for="index in dynamicInterval" :value="index">
        {{ index }}
      </SelectOption>
    </Select>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import {DatePicker,Select} from 'ant-design-vue';
const SelectOption = Select.Option

import { duringGeneration} from "/@/api/task-api/tast-bus-api";
const yearValue = ref('2021')
const numValue = ref('12')
const startValue = ref('202101')
const pageShow = ref(false)

const dynamicInterval = ref([])
onMounted(()=>changePeriod())

function openChangeOne(status) {
  if (status) {
    pageShow.value = true
  }
}

function panelChangeOne(value) {
  yearValue.value = value.format('YYYY');
  pageShow.value = false;
  changePeriod()
}
function changePeriod(){
  dynamicInterval.value = duringGeneration(yearValue.value,numValue.value)
  startValue.value = dynamicInterval.value[0]
}
</script>
<style lang="less" scoped="scoped">
.customize-year {
  display: inline-block;
  text-align: center;
  :deep(.ant-calendar-picker-input){
    width: 80px !important;
  }
}
:deep(.ant-select-selector:not(.ant-input)),:deep(.ant-calendar-picker-input) {
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
}

</style>
