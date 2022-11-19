<template>
  <div>
    <Select
      class="acttdrd-search-select"
      show-search
      v-model:value="selectValue"
      :placeholder="'单据编号查找'"
      :default-active-first-option="false"
      :show-arrow="false"
      :filter-option="false"
      :not-found-content="null"
      :options="receiptOptions"
      :search-value="searchValue"
      @change="toReceipt"
      @search="writeText"
      @keyup.enter="contentSearch"
    />
  </div>
</template>
<script setup="props, { content }" lang="ts">
import {Select} from "ant-design-vue";
import {ref} from "vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findReceiptList} from "/@/api/record/stock/stock-xhd";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
const emit = defineEmits(['register', 'toggle']);
const prop = defineProps(['defaultData','dynamicTenantId'])
const receiptOptions = ref([])
const selectValue = ref(null)
const searchValue = ref('')
let timeout: any;
const writeText = (v) => {
  if (!hasBlank(v))
    searchValue.value = v
}
const contentSearch = async (v) => {
  if (!hasBlank(searchValue.value)) {
    let filterList = []
    await receiptFetch(searchValue.value, filterList, (d: any[]) => (receiptOptions.value = d));
  }
}
async function receiptFetch(value: string, filterList: any, callback: any) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  async function fake() {
    let qData = prop.defaultData
    qData.qValue = value
    let res = await useRouteApi(findReceiptList, {schemaName: prop.dynamicTenantId})(qData) || []
    let data = []
    res = res.filter(it => filterList.indexOf(it) == -1)
    res.forEach((r: any) => {
      data.push({
        value: r,
        label: r,
      });
    });
    callback(data);
  }
  timeout = setTimeout(fake, 300);
}
const toReceipt = () => {
  searchValue.value = ''
  emit('toggle',selectValue.value)
}

</script>
<style lang="less" scoped="scoped">
.acttdrd-search-select {

  :deep(.ant-select-selector) {
    border-color: #c9c9c9;
    border-radius: 2px 0 0 2px;
    width: 160px;
    text-align: left;
    .ant-select-selection-placeholder{
      color: #746666;
    }
  }
}
</style>
