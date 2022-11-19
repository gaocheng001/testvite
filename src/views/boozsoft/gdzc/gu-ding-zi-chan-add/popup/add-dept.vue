<template>
  <BasicModal
    width="600px"
    v-bind="$attrs"
    title="新增资产部门"
    @ok="handleOk()"
    :loading="loadMark"
    @register="register"
  >
    <div class="nc-open-content" style="margin-top: 10px;margin-bottom: 10px;height: 240px;">
      <div class="open-content-up">
        <div>
          <a-button @click="createRow()" style="padding: 0px 4px; height: 25px;background-color: rgb(1,129,226);color: #ffffff">
            <PlusOutlined/>
          </a-button>
        </div>
        <table class="layui-table" id="tableId" style="height: calc( 100% - 20px );margin-top: 10px;background-color:#f2f4f6;">
          <thead>
            <tr class="dy_table_thead_tr even">
              <th style="width: 50%;">部门</th>
              <th style="width: 30%;">所占比例</th>
              <th style="width: 20%;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr class="odd" v-for="(row,rowIndex) in formItems">
              <td style="width: 50%;">
                <Select v-model:value="row.deptUnique" @change="changeDept(row,rowIndex)" style="width: 100%;">
                  <SelectOption v-for="item in deptList" :value="item.uniqueCode">{{item.deptCode}}-{{item.deptName}}</SelectOption>
                </Select>
              </td>
              <td style="width: 30%;">
                <InputNumber v-model:value="row.proportion" class="right" :precision="2" style="width: 100%;" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"/>
              </td>
              <td style="width: 20%;">
                <a @click="delRow(row,rowIndex)"><DeleteOutlined/>删除</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </BasicModal>
</template>

<script setup="props, { content }" lang="ts">
import {onMounted, ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {Select,TreeSelect, Input, InputNumber} from 'ant-design-vue';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import router from "/@/router";
import {useTabs} from "/@/hooks/web/useTabs";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import {add} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
const {
  createErrorModal
} = useMessage()
const InputSearch = Input.Search;
const SelectOption = Select.Option;

const {closeCurrent} = useTabs(router);

const emit = defineEmits(['register', 'save']);

const loadMark = ref(false)

const dynamicTenantId = ref(getCurrentAccountName(true))
const defaultAdName = ref(useCompanyOperateStoreWidthOut().getSchemaName)
const year = ref()

const formItems: any = ref([{
  uniqueCode: '',
  manageCode: '',
  cardUnique: '',
  deptUnique: '',
  proportion: '100',
  cdate: '',
  cuserId: ''
}]);

const deptList:any = ref([])

const [register, {closeModal}] = useModalInner((data) => {
  deptList.value = data.data.deptList
  if (data.data.changeDeptList.length>0) {
    formItems.value = data.data.changeDeptList
  } else {
    formItems.value = [{
      uniqueCode: '',
      manageCode: '',
      cardUnique: '',
      deptUnique: '',
      proportion: '100',
      cdate: '',
      cuserId: ''
    }]
  }
});

onMounted(async () => {
})

async function handleOk() {
  let sum = 0
  for (let i = 0; i < formItems.value.length; i++) {
    const item = formItems.value[i]
    if (item.deptUnique==null || item.deptUnique==''){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '第'+(i+1)+'行部门为空，不能进行保存！'
      })
      return false
    }
    if (item.proportion==null || item.proportion==''){
      createErrorModal({
        iconType: 'warning',
        title: '提示',
        content: '第'+(i+1)+'行所占比例为空，不能进行保存！'
      })
      return false
    }
    sum = add(sum,item.proportion)
  }
  if (sum!=100){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '所占比例必须为100%！'
    })
    return false
  }
  emit('save', unref(formItems));
  closeModal();
  return true;
}

const assetTypeList:any = ref([])
const accountList:any = ref([])
async function reloadList(){
}

//添加行
function createRow() {
  const item = {
    uniqueCode: '',
    manageCode: '',
    cardUnique: '',
    deptUnique: '',
    proportion: '',
    cdate: '',
    cuserId: ''
  }
  formItems.value.push(item)
  console.log(formItems.value)
}

//删除行
function delRow(row:any,rowIndex:any) {
  formItems.value.splice(rowIndex, 1);
}

//判读部门是否重复
function changeDept(row,rowIndex){
  formItems.value.forEach((item,index)=>{
    if (rowIndex!=index){
      if (row.deptUnique==item.deptUnique){
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '部门已存在，请重新选择部门！'
        })
        row.deptUnique=''
      }
    }
  })
}

</script>
<style>
.vben-basic-title {
  color: rgb(1, 129, 226) !important;
}

.ant-modal-body {
  padding: 0px;
  border: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
}
</style>
<style lang="less" scoped>
:deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input), :deep(.ant-input) {
  border: none;
  //border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  font-size: 14px;
  font-weight: bold;
}

:deep(.ant-input-number){
  border: none;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;

  .ant-input-number-handler-wrap{
    display:none;
  }
  input{
    width: 100%;
    font-size: 14px;
    font-weight: bold;
  }
}
:deep(.right) input{
  text-align:right;
}

.vben-basic-title {
  color: rgb(1, 129, 226) !important;
}

.ant-modal-body {
  padding: 0px;
  border: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
}

.nc-open-content {
  input {
    width: 50%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-size: 14px;
    font-weight: bold;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-size: 14px;
    font-weight: bold;
  }

  label {
    text-align: left;
    width: 90px;
    display: inline-block;
    padding: 5px 10px;
    margin-left: 2em;
    color: #535353;
    font-size: 13px;
    font-weight: bold;
  }

  .open-content-down {
    margin-top: 5%;

    .ant-tabs-tab-active::before {
      position: absolute;
      top: 0px;
      left: 0;
      width: 100%;
      border-top: 2px solid transparent;
      border-radius: 2px 2px 0 0;
      transition: all 0.3s;
      content: '';
      pointer-events: none;
      background-color: rgb(1, 143, 251);
    }
  }
}
</style>
<style lang="less" scoped>
@import "../../../../../assets/styles/layui.less";
@import "../../../../../assets/styles/theme.less";
@import "../../../../../assets/styles/global-menu-index.less";
</style>
<style type="text/css">

.even {
  background: #FCFCFC;
}

.odd {
  background: #FFFFFF;
}

td:hover {
  background: none;
}

td .bjgs {
  display: none;
}

td:hover .bjgs {
  display: block;
  position: absolute;
  top: 8px;
  left: 130px;
  /*background-color: whitesmoke;*/
  color: royalblue;
}
table{

  table-layout:fixed;/* 只有定义了表格的布局算法为fixed，下面td的定义才能起作用。 */
}
th,td{
  width:100%;
  word-break:keep-all;/* 不换行 */
  white-space:nowrap;/* 不换行 */
  overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
#tableId > thead,
#tableId > tbody > tr {
  display: table;
  width: 100%;
  height: 30px;
  table-layout: fixed; /**表格列的宽度由表格宽度决定，不由内容决定*/
  text-align: center;
}

#tableId th {
  border: 1px solid #6f696f;
}
#tableId tr td  {
  border: 1px solid #6f696f;
  border-top: hidden;
}

a{
  cursor: pointer;
}
/*td缩进*/
.indent{
  text-indent:30px;
}
</style>
