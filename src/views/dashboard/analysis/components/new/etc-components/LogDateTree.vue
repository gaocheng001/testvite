<template>
  <div class="voucher-list-tree">
    <Tabs type="card" size="small" :tabBarGutter="0">
      <TabPane :style="{height: (windowHeight-390)+'px'}">
        <template #tab>
          <div style="text-align: center;height: 50px;line-height: 50px;background-color: #f1f1f1">
            <Select style="width: 74px;text-align: center;" v-model:value="compParameter.year"
                    @change="monthChange">
              <SelectOption v-for="i in yearList" :value="i">{{ i }}</SelectOption>
            </Select>年
            <Select style="width: 56px;text-align: center;" v-model:value="compParameter.dayMonth"
                    @change="monthChange">
              <SelectOption v-for="i in showMonthList" :value="i">{{ i }}</SelectOption>
            </Select>月
          </div>
        </template>
        <BasicTree
          title=""
          v-model:selectedKeys="checkedKeys2"
          :height="650"
          :selectable="true"
          :tree-data="treeData2"
          @select="handleSelect"
        />
      </TabPane>
    </Tabs>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {BasicTree} from '/@/components/Tree';
import {Select, Tabs} from 'ant-design-vue';
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import {findLeftTree} from "/@/api/record/system/group-sys-login-log";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";

const TabPane = Tabs.TabPane
const SelectOption = Select.Option
const emit = defineEmits(['select'])
const props = defineProps(['treeInterval', 'database'])

const compParameter = ref({
  year: '2021',
  dayMonth: '01',
})

const treeData2: any = ref([])
const checkedKeys2: any = ref([])
const windowHeight = (window.innerHeight)
const yearList = ref(['2022'])
const monthList: any = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
const showMonthList = ref([])
const currServerDate = useCompanyOperateStoreWidthOut().getCurrServeDate

onMounted(async () => {
  if (null != currServerDate) {
    let dates = currServerDate.split('-')
    compParameter.value.year = dates[0]
    compParameter.value.dayMonth = dates[1]
    resetList()
    // 默认显示当天
    await fetch2(currServerDate)
    checkedKeys2.value = [currServerDate]
  }
})

async function fetch2(date) {
  //let res = await findLeftTree({date: compParameter.value.year + '-' + compParameter.value.dayMonth})
  let dates = date.split('-')
  let list = []
  for (let i = 1; i <= parseInt(dates[2]); i++) {
    let day = i < 10 ? '0' + i : '' + i
    list.push({key: `${dates[0]}-${dates[1]}-` + day, title: `${day}号`})
  }
  treeData2.value = list
}

import {DateTool} from "/@/api/task-api/tools/universal-tools";

const monthChange = async (v) => {
  resetList()
  let ym = compParameter.value.year + '-' + compParameter.value.dayMonth
  await fetch2(( ym == currServerDate.substring(0, 7)) ? currServerDate : ym+'-'+DateTool().getLastDay(compParameter.value.year, compParameter.value.dayMonth))
}

const resetList = () => {
  let dates = currServerDate.split('-')
  if (compParameter.value.year == dates[0]) {
    showMonthList.value = monthList.filter(v => parseInt(dates[1]) >= parseInt(v))
  } else {
    if (parseInt(compParameter.value.year) > dates[0]) {
      showMonthList.value = []
    } else {
      showMonthList.value = monthList.value
    }
  }
}

function handleSelect(keys: string, e: any) {
  emit('select', {date: keys[0]})
}
</script>
<style lang="less" scoped>
.voucher-list-tree {
  display: inline-block;
  height: calc(100%);
  min-width: 181px;
  float: left;

  :deep(.ant-select-selector) {
    background-color: #f1f1f1;
    border: none;
    border-bottom: solid 1px rgb(191, 191, 191) !important;
  }

  :deep(.ant-tabs-nav) {
    margin-bottom: 0px;

    .ant-tabs-tab-active {
      background-color: #f1f1f1;
      border-top: 2px solid #0096c7;
      border-bottom: none;
    }
  }

  :deep(.ant-tabs-content) {
    padding: 0 10px 10px;
    background-color: #f1f1f1;

    .scroll-container {
      border: 2px groove #cac2c2;
      background-color: #f1f1f1;
      height: calc(100% - 60px) !important;

      .ant-tree-list {
        background-color: #f1f1f1 !important;
      }
    }
  }
}
</style>
