<template>
  <div class="voucher-list-tree">
    <Tabs type="card" size="small" :tabBarGutter="0" v-model:activeKey="activeKey">
      <TabPane key="1" tab="按资产类别显示" :style="activeKey=='1'?{height: (windowHeight-285)+'px'}:{}">
        <div style="text-align: center;height: 50px;background-color: #f1f1f1"></div>
        <BasicTree
          title=""
          :tree-data="treeData"
          :replace-fields="{ key: 'value', title: 'title' }"
          v-model:checkedKeys="checkedKeys"
          v-model:expandedKeys="expandedKeys"
          :height="400"
          checkable
          :selectable="false"
          @check="handleSelect"
        />
      </TabPane>
      <TabPane key="2" tab="按部门显示" :style="activeKey=='2'?{height: (windowHeight-285)+'px'}:{}">
        <div style="text-align: center;height: 50px;line-height: 50px;background-color: #f1f1f1">
          <span>{{ compParameter.year }}年</span>
          <Select style="width: 80px;text-align: center;" v-model:value="compParameter.dayMonth"
                  @change="monthChange">
            <SelectOption v-for="i in showYearList" :value="i">{{ i }}月</SelectOption>
          </Select>
        </div>
        <BasicTree
          title=""
          v-model:checkedKeys="checkedKeys2"
          v-model:expandedKeys="expandedKeys2"
          :replace-fields="{ key: 'value', title: 'title' }"
          checkable
          :height="600"
          :selectable="false"
          :tree-data="treeData2"
          @check="handleSelect"
        />
      </TabPane>
    </Tabs>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {BasicTree} from '/@/components/Tree';
import {Select, Tabs} from 'ant-design-vue';
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {findAllAccvoucher, findAllAccvoucherTree} from "/@/api/record/system/accvoucher";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

const TabPane = Tabs.TabPane
const SelectOption = Select.Option
const emit = defineEmits(['select'])
const props = defineProps(['treeInterval', 'database'])

const compParameter = ref({
  year: '2021',
  dayMonth: '01',
})

const activeKey = ref('1')
const treeData: any = ref([])
const checkedKeys: any = ref([])
const expandedKeys: any = ref([])

const treeData2: any = ref([])
const checkedKeys2: any = ref([])
const expandedKeys2: any = ref([])
const windowHeight = (window.innerHeight)
const yearList: any = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
const showYearList = ref([])
let reQ = false; // 是否再次查询
watch(() => props.treeInterval, async () => {
  if (activeKey.value == '2'){activeKey.value = '1';reQ = true}
  if (null != props.treeInterval && props.treeInterval.length > 0) {
    let sM = props.treeInterval[0].substring(5, 7)
    let eM = props.treeInterval[1].substring(5, 7)
    let arr = []
    for (let i = parseInt(sM); i <= parseInt(eM); i++) {
      let tM = i > 9 ? i + '' : '0' + i
      if (yearList.indexOf(tM) != -1)
        arr.push(tM)
    }
    showYearList.value = arr
    compParameter.value.year = props.treeInterval[0].substring(0, 4)
    compParameter.value.dayMonth = arr[arr.length - 1]
   /* if (activeKey.value == '2') {
      fetch2()
    } else {
      fetch()
    }*/
  }
})
watch(() => activeKey.value, async () => {
  if (activeKey.value == '2') await fetch2()
  checkedKeys.value = []
  checkedKeys2.value = []
  if (!reQ){
    handleSelect([], [])
  }else {
    reQ = false
  }

})

async function fetch() {
  let deptTree = yearList.map(i => ({
    'value': i,
    'title': `${i}月`,
    'disabled': showYearList.value.indexOf(i) == -1
  }))
  treeData.value = [{
    value: compParameter.value.year,
    title: `${compParameter.value.year}年`,
    children: deptTree
  }]
  expandedKeys.value = [compParameter.value.year]
  //emit('select', {uniqueCode: checks[0], deptList: deptTree})
}

async function fetch2() {
  let res = await useRouteApi(findAllAccvoucherTree, {schemaName: props.database})({yearMonth: `${compParameter.value.year}-${compParameter.value.dayMonth}`})
  let keys = Object.keys(res)
  let list = []
  let exps = []
  for (let key in keys) {
    let arr = []
    let keys2 = Object.keys(res[keys[key]])
    for (let key2 in keys2) {
      let dates = keys2[key2].split('-')
      let values = res[keys[key]][keys2[key2]]
      let els = []
      for (let v in values) {
        els.push({value: `${keys2[key2]}-${values[v]}`, title: `${values[v]}号`,})
      }
      let newArr = els.sort((a, b) => parseInt(a.title.substring(0, a.title.length - 1)) - parseInt(b.title.substring(0, b.title.length - 1)))
      arr.push({value: `${keys2[key2]}`, title: `${dates[1]}月${dates[2]}日`, children: newArr})
      exps.push(keys2[key2])
    }
    let newArr2 = arr.sort((a, b) => parseInt(a.value.substring(a.value.length - 2)) - parseInt(b.value.substring(b.value.length - 2)))
    list.push({value: keys[key], title: keys[key], children: newArr2,})
    exps.push(keys[key])
  }
  treeData2.value = list
  expandedKeys2.value = exps
  /*  selectedKeys2.value = ['j','01','02']
    expandedKeys2.value = ['j','01','02']*/
  //emit('select', {uniqueCode: checks[0], deptList: deptTree})
}

function handleSelect(keys: string, e: any) {
  let arr = []
  if (activeKey.value == '1') {
    keys.forEach(v => {
      if (v != compParameter.value.year)
        arr.push(`${compParameter.value.year}-${v}`)
    })
  } else {
    keys.forEach(v => {
      if (v.length > 10)
        arr.push(`${v}`)
    })
  }
  emit('select', {type: (activeKey.value == 1 ? 'month' : 'day'),monthVal: compParameter.value.dayMonth, treeCondition: arr})
}

const monthChange = (v) => {
  fetch2()
  handleSelect([], [])
}
</script>
<style lang="less" scoped>
.voucher-list-tree {
  display: inline-block;
  height: calc(100%);
  width: 236px;
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
      .ant-tree-list{
         background-color: #f1f1f1 !important;
      }
    }
  }
}
</style>
