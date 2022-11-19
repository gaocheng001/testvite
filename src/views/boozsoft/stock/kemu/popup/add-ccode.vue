<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    title="扩展设置"
    @ok="handleOk()"
    wrapClassName="head-title"
    @register="register"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="font-size: 24px;line-height:30px;margin-top: 10px;margin-left: 10px;">
          <SettingFilled style="font-size: 28px;font-weight: bold"/>&nbsp;&nbsp;扩展设置
        </span>
      </div>
    </template>
    <div class="nc-open-content" style="margin-top:10px;">
      <div class="open-content-up">
        <div style="background:#0096c7;padding:10px;border-radius: 2px;margin-bottom:10px;display: flex;justify-content : flex-end;">
<!--          <div class="a1">
            <a-select v-model:value="formItems.selectType" style="width: 120px;font-size: 12px;" class="special_select">
              <a-select-option style="font-size: 12px;" value="psnCode">人员编码</a-select-option>
              <a-select-option style="font-size: 12px;" value="psnName">人员姓名</a-select-option>
            </a-select>
            <a-input-search
              placeholder=""
              style="width: 200px; border-radius: 4px"
              v-model:value="formItems.selectValue"
              @search="onSearch"
            />
          </div>-->
          <div class="a2">
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="addRow()"
            ><span>增行</span></button>
            <button
              type="button"
              class="ant-btn ant-btn-me"
              @click="delRow()"
            ><span>删行</span></button>
          </div>
        </div>

        <div style="height: 400px;padding:0;display: flex;justify-content : space-between;">
          <BasicTable
            :row-selection="{ type: 'checkbox', selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
            @row-click="condClick"
            :scroll="{ y: 290 }"
            @register="registerTable"
            :dataSource="tableData"
            class="tables"
          >
            <template #stName="{ record }">
              <template v-if="record.editstName">
                <a-input v-model:value="record.stName" class="stName" style="width: 85%;" placeholder="" @keyup.enter="focusNext(record,'stName')"/>
                <CheckOutlined @click="record.editstName = null;tableDataChange(record,'stName')"/>
              </template>
              <template v-else>
                <div @click="record.editstName = true;" class="suspended-div">
                  <span class="a-table-font-arial">{{record.stName}}</span>
                </div>
              </template>
            </template>

            <template #ckName="{ record }">
              <template v-if="record.editckName">
                <a-input v-model:value="record.ckName" class="ckName" style="width: 85%;" placeholder="" @keyup.enter="focusNext(record,'ckName')"/>
                <CheckOutlined @click="record.editckName = null;tableDataChange(record,'ckName')"/>
              </template>
              <template v-else>
                <div @click="record.editckName = true;" class="suspended-div">
                  <span class="a-table-font-arial">{{record.ckName}}</span>
                </div>
              </template>
            </template>

            <template #ccode="{ record }">
              <template v-if="record.editccode">
<!--                <a-input v-model:value="record.ccode" class="ccode" style="width: 85%;" placeholder="" @keyup.enter="focusNext(record,'ccode')"/>-->
                <a-select v-model:value="record.ccode" style="width: 85%;"
                          class="ccode"
                          @change="handleChange"
                          show-search
                          :filter-option="false"
                          @search="handleSearch"
                          @keyup.enter="focusNext(record,'ccode')">
                  <template #suffixIcon><SearchOutlined/></template>
                  <a-select-option v-for="kemu in kemuCodeList" :key="kemu.ccode" :value="kemu.ccode">
                    {{ kemu.ccode }}--{{ kemu.ccodeName }}
                  </a-select-option>
                </a-select>
                <CheckOutlined @click="record.editccode = null;tableDataChange(record,'ccode')"/>
              </template>
              <template v-else>
                <div @click="record.editccode = true;" class="suspended-div">
                  <span class="a-table-font-arial">{{record.ccode}}</span>
                </div>
              </template>
            </template>
          </BasicTable>
        </div>
      </div>
    </div>

    <template #footer>
      <div>
        <a-button @click="handleOk" type="primary">保存</a-button>
        <a-button @click="closeModal">退出</a-button>
      </div>
    </template>

  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import { PageWrapper } from '/@/components/Page'
import {nextTick, onMounted, reactive, ref, unref} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  SettingFilled,CheckOutlined,SearchOutlined
} from '@ant-design/icons-vue'
import {
  Select as ASelect,
  Input as AInput,
  Checkbox as ACheckbox,
  Button as AButton,
  message
} from 'ant-design-vue'

const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
import {useMessage} from "/@/hooks/web/useMessage";
import {BasicTable, useTable} from "/@/components/Table";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findByUniqueId} from "/@/api/record/system/stock-ccode";

const {
  createErrorModal,
  createConfirm,
  createWarningModal
} = useMessage()

const emit = defineEmits(['register', 'save'])

const formItems: any = ref({})
const accountList: any = ref([])
const dynamicTenantId = ref('')
const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const kemuList:any = ref([])
const kemuCodeList:any = ref([])
const [register, {closeModal,setModalProps}] = useModalInner(async(data) => {
  dynamicTenantId.value = data.dynamicTenantId
  kemuList.value = data.kemuList
  kemuCodeList.value = kemuList.value
  formItems.value.id = data.data.id
  formItems.value.uniqueId = data.data.uniqueId
  formItems.value.stName = data.data.stName
  formItems.value.ccode = data.data.ccode
  formItems.value.ccodeName = data.data.ccodeName
  await reloadStockCcodes()
  state.selectedRowKeys = []
  checkRow.value = []
})

//搜索科目
function handleSearch(value) {
  kemuCodeList.value = kemuList.value.filter(item => {
    return item.ccode.slice(0, value.length) == value || item.ccodeName.indexOf(value) != -1
  })
  // debugger
  // console.log(sourceList.value)
}

function handleChange(value) {
  console.log(value);
  kemuCodeList.value = kemuList.value.filter(item => {
    return item.ccode.slice(0, value.length) == value
  })
}

const columns = [
  {
    title: '存货分类',
    dataIndex: 'stName',
    align: 'left',
    ellipsis: true,
    slots: {customRender: 'stName'}
  },
  {
    title: '仓库',
    dataIndex: 'ckName',
    align: 'left',
    ellipsis: true,
    slots: {customRender: 'ckName'}
  },
  {
    title: '科目编码',
    dataIndex: 'ccode',
    align: 'left',
    ellipsis: true,
    slots: {customRender: 'ccode'}
  },
  {
    title: '科目名称',
    dataIndex: 'ccodeName',
    align: 'left',
    ellipsis: true,
    slots: {customRender: 'ccodeName'}
  },
]

// 这是示例组件
const [registerTable, {reload,getColumns,getDataSource,setTableData,setPagination}] = useTable({
  columns: columns,
  bordered: true,
  showIndexColumn: true,
  pagination: false,
})

//选中内容
const state = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});

async function reloadStockCcodes(){
  const res = await useRouteApi(findByUniqueId,{schemaName: dynamicTenantId})(formItems.value.uniqueId)
  tableDataAll.value = res
  if (tableDataAll.value.length==0){
    tableDataAll.value.push({})
  }
  tableData.value = tableDataAll.value
  setTableData(tableData.value)
}

function addRow(){
  tableData.value.push({})
  setTableData(tableData.value)
}

function delRow(){
  if (state.selectedRowKeys.length > 0) {
    let list = getDataSource()
    for (let i = 0; i < state.selectedRowKeys.length; i++) {
      let item = state.selectedRowKeys[i]
      let selectIndex = list.findIndex(it => it.key === item.key)
      list.splice(selectIndex, 1)
    }
    tableData.value = list
    setTableData(list)
    state.selectedRowKeys = []
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请选择删除行次！'
    })
  }
}

onMounted(async () => {
})

const condClick = () => {

}

const checkRow: any = ref([])
const onSelectChange = (selectedRowKeys, row) => {
  // console.log('selectedRowKeys changed: ', row);
  // if(selectedRowKeys.length>0){
  state.selectedRowKeys = selectedRowKeys;
  checkRow.value = row
  // }
};

async function handleOk() {
  for (let i = 0; i < getDataSource().length; i++) {
    let item = getDataSource()[i]
    if (item.stName==null || item.stName==''){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '第'+(i+1)+'行存货分类为空，不能进行保存！'
      })
      return false
    }
    if (item.ckName==null || item.ckName==''){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '第'+(i+1)+'行仓库为空，不能进行保存！'
      })
      return false
    }
    if (item.ccode==null || item.ccode==''){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '第'+(i+1)+'行科目编码为空，不能进行保存！'
      })
      return false
    }
  }
  formItems.value.table = getDataSource()
  emit('save', unref(formItems));
  closeModal();
}

const tableDataChange =  (r,c) => {
  switch (c) {
    case 'ccode':
      if (r.ccode!=null && r.ccode!=''){
        const kemu = kemuList.value.filter(item =>item.ccode==r.ccode)
        if (kemu.length>0) {
          r.ccodeName = kemu[0].ccodeName
        }
      } else {
        r.ccodeName = ''
      }
      break
  }
}

/**
 * @param e 回车确定事件
 * @param r rowObj
 * @param c className
 * @param t mark
 */
const focusNext =  (r, c) => {
  // 得到当前临时标记
  let t = getNextMark(c,false)
  Object.keys(r).map(i=>{if (i.startsWith('edit')) r[i] = null})
  r[`${c}`] = r[`${t}`];
  // 列表值发生变动 监听调整
  // debugger
  tableDataChange(r,c)
  // 查找下一个
  let list = getDataSource();
  let filters = ['stName','ckName','ccode']
  // if (!r.isBatch)filters.push('batchId') 要求填批号才填写
  // let cols:any = getColumns().filter(it=>it.title!='序号' &&  filters.indexOf(it.dataIndex) == -1)
  let cols:any = getColumns().filter(it=>it.title!='序号')
  let index = list.findIndex(it => it.key == r.key)
  let nextC = cols[0].dataIndex // 获取下一个列位置
  if (index == list.length - 1 && cols[cols.length - 1].dataIndex == c) { // 最后一行最后一列回车追加
    list.push({editOne: true})
    tableData.value = list
    setTableData(list)
  } else {
    let cObj = cols[cols.findIndex(it => it.dataIndex == c) + 1]
    if (cObj != null) {
      nextC = cols[cols.findIndex(it => it.dataIndex == c) + 1].dataIndex
      // 的到指定位置
      let nextMark = getNextMark(c, true)
      r[`edit${nextMark}`] = true;
      r[`${nextC}`] = r[`${nextMark}`];
    } else { //之后一列时换行
      nextC = cols[0].dataIndex
      let nextMark = getNextMark(nextC, false)
      ++index
      list[index][`edit${nextMark}`] = true
      list[index][`${nextC}`] = list[index][`${nextMark}`];
      tableData.value = list
      setTableData(list)
    }
  }
  if (r.ccode!=null && r.ccode!=''){
    const kemu = kemuList.value.filter(item =>item.ccode==r.ccode)
    if (kemu.length>0) {
      r.ccodeName = kemu[0].ccodeName
    }
  } else {
    r.ccodeName = ''
  }
  nextTick(() => {
    let doms:any = nextC == 'stName' || nextC == 'ckName' ? document.getElementsByClassName(nextC)[0] : document.getElementsByClassName(nextC)[0]?.getElementsByTagName('input')[0]
    if (null != doms) doms.focus()
  })
}
const getNextMark = (c,b) => {
  let model:any = {stName:'stName',ckName:'ckName',ccode:'ccode'}
  if (b){
    // 获取下一个
    let keys= Object.keys(model)
    return model[keys[keys.findIndex(k=>k == c)+1]]
  }else {
    return model[c]
  }
}

</script>
<style scoped="scoped" lang="less">
.ant-modal-header{
  border: none !important;
}
.vben-basic-title {
  color: #0096c7 !important;
  border: none !important;
  margin-bottom: -20px !important;
}

:global(.ant-modal-body) {
  padding: 0px;
  border-bottom: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
  margin-bottom: 0!important;
  .scrollbar{
    padding: 0px;
    .scroll-container{
      margin-bottom: 0!important;
    }
  }
}

.nc-open-content {
  input:not(.ant-select-selection-search-input,.ant-input){
    width: 50%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  .ant-select-selector {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label {
    text-align: left;
    width: 110px;
    display: inline-block;
    padding-top: 5px;
    padding-bottom: 5px;
    color: #535353;
  }
}

.search input {
  width: 100%;
  border: none !important;
}

/*.tables :deep(td),
.tables :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}*/

.tables :deep(th) {
  text-align: center !important;
  font-weight: bold;
  background-color: #cccccc;
  line-height:20px;
  padding: 0 !important;
}

.bg-white{
  width: 250px !important;
  min-height: 385px !important;
  height: calc(100%);
  border: 1px #cccccc solid;
  background:white !important;
}

:deep(.ant-table-row-selected) td{
  //background: #0096c7 !important;
}

:deep(.ant-tree-list){
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.suspended-div) {
  width: 100%;
  height: 22px;

  .anticon-form {
    float: right;
    line-height: 22px;
    display: none;
  }
}
:deep(.suspended-div:hover) {
  cursor: text;
  background-color: #e4e7e7;
  .anticon-form {
    display: block;
  }
}

</style>
<style>
.head-title .scroll-container .scrollbar__wrap {
  margin-bottom: -45px !important;
}

.head-title .tables td,.head-title .tables th{
  display:table-cell;
  font-size: 14px !important;
  padding: 0 !important;
  margin: 0 !important;
}

.head-title .tables .ant-checkbox-wrapper{
  width: 100px;
  vertical-align:middle;
  text-align:center;
  height: 30px;
  margin-left: 20px !important;
  margin-top: 5px !important;
  margin-bottom: 0 !important;
}

</style>
