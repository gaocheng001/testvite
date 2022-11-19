<template>
  <div class="nc-search-piece">
    <Loading :loading="spinning" tip="请稍后...正在前往目的页面！"/>
    <Select placeholder="" v-model:value="searchModel.condition" :options="conditionOptions"/>
    <Popover v-model:visible="visible" placement="bottomLeft" trigger="contextmenu">
      <InputSearch placeholder="" v-model:value="searchModel.content" @search="onSearch"/>
      <template #content>
        <SearchPieceView @jump="toPage" :data="dataList"/>
      </template>
    </Popover>
  </div>
</template>
<script setup lang="ts">
import {SyncOutlined} from '@ant-design/icons-vue';
import {Input, Select, Popover, Spin, message} from "ant-design-vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {ref, reactive, onMounted} from "vue";
import SearchPieceView
  from "/@/views/dashboard/analysis/components/new/etc-components/SearchPieceView.vue";
import {Loading} from '/@/components/Loading';
import router from "/@/router";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {findAllByPid, queryDataByCondition} from "/@/api/search-piece/search-piece";
import {hasBlank} from "/@/api/task-api/tast-bus-api";

const InputSearch = Input.Search
const SelectOption = Select.Option

const props = defineProps(['modelValue', 'dynamicTenantId'])
const mark = usePlatformsStore().getCurrentPlatformId
// 主页搜索
const visible = ref(false)
const spinning = ref(false)
const searchModel = reactive({
  condition: '',
  content: ''
})
const dataList = ref([{id: '1', code: '001', name: '中国组'},
  {id: '2', code: '002', name: '美国组'},
  {id: '3', code: '003', name: '英国组'},
  {id: '4', code: '004', name: '法国组'},
  {id: '5', code: '005', name: '俄罗斯组'},
])
const theMarkConditionList = ref([])
const conditionOptions = ref([
  {value: 'DEPT', label: '部门'},
  {value: 'USER', label: '人员'},
  {value: 'CUST', label: '客户'},
  {value: 'SUP', label: '供应商'},
  {value: 'PRO', label: '项目'},
  {value: 'CUST', label: '自定义项'}
])

onMounted(async () => {
  theMarkConditionList.value = await findAllByPid({id: mark})
  conditionOptions.value = theMarkConditionList.value.map(it => ({
    value: it.menuId,
    label: it.menuName
  }))
  searchModel.condition = conditionOptions.value.length == 0 ? '' : conditionOptions.value[0].value
})
const toDbSearech = () => {

}

const getMenuAddress = async (e) => {
  // '/zhongZhang/account-book/ab-kemuzhang/abk-mxtable'
  console.log(mark)
  return ''
}
const onSearch = async (v) => {
  if (hasBlank(searchModel.condition)) {
    message.info('请先选择查询条件！')
    searchModel.condition = ''
  } else {
    let res = hasBlank(v) || hasBlank(props.dynamicTenantId) ? null : await queryDataByCondition(getQueryParameter())
    if (null == res || res.length == 0) {
      message.info(`暂未发现与之相关内容！`)
      dataList.value = []
    } else {
      visible.value = true
      dataList.value = res
    }
  }
}
const getQueryParameter = () => {
  let data = theMarkConditionList.value.filter(it => searchModel.condition == it.menuId)[0];
  data['beiyong1'] = searchModel.content
  data['beiyong2'] = props.dynamicTenantId
  return data
}
const toPage = async (e) => {
  visible.value = false
  spinning.value = true
  router.push({
    path: getQueryParameter().routerPath,
    query: e.id,
  });
  spinning.value = false
}

</script>
<style lang="less" scoped>
.nc-search-piece {
  :deep(.ant-select-selector) {
    border: none;
    line-height: 32px;
    height: 32px;
    width: 130px;
    border-radius: 4px;
    text-align: left;
    border: 1px solid #c9c9c9;
    border-radius: 4px 0 0 4px;
  }

  :deep(.ant-input-search) {
    border: 1px solid #c9c9c9;
    border-left: none;
    width: 200px;
    border-radius: 0 4px 4px 0;
  }
}
</style>
