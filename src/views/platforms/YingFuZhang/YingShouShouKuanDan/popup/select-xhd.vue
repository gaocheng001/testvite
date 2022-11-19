<template>
    <BasicModal
      width="900px"
      v-bind="$attrs"
      title="收款单"
      @ok="handleOk()"
      @cancel="handleOk()"
      wrapClassName="head-title"
      @register="register"
    >
      <template #title>
        <div style="display: flex;height:30px;" class="vben-basic-title">
        <span style="font-size: 24px;line-height:30px;">
          <SearchOutlined style="font-size: 28px;font-weight: bold"/>&nbsp;&nbsp;付款单
        </span>
        </div>
      </template>
      <div class="nc-open-content" style="margin:0;padding:0;">
        <div class="open-content-up" style="margin:0;padding:0;">
          <div style="background:#0096c7;padding:10px;border-radius: 2px;margin-bottom:10px;display: flex;justify-content : space-between;color: #ffffff;font-weight: bold">
            <div class="a1">
              <a-select v-model:value="formItems.selectType" style="width: 120px;font-size: 14px;" class="special_select">
                <a-select-option value="ddate">单据日期</a-select-option>
                <a-select-option value="ccode">单据编号</a-select-option>
                <a-select-option value="cdepcode">部门</a-select-option>
                <a-select-option value="cpersoncode">业务员</a-select-option>
              </a-select>
              <a-input-search
                placeholder=""
                style="width: 200px; border-radius: 4px"
                v-model:value="formItems.selectValue"
                @search="onSearch"
              />
              &emsp;&emsp;
              <span>单据类型：</span>
              <a-select v-model:value="formItems.billStyle" style="width: 120px;font-size: 14px;" placeholder="单据类型" class="special_select">
                <a-select-option value="CGDHD">采购到货单</a-select-option>
                <a-select-option value="CGFP">采购发票</a-select-option>
                <a-select-option value="YFD">应付单</a-select-option>
                <a-select-option value="QCYFD">期初应付单</a-select-option>
              </a-select>
            </div>
            <div class="a2">
              <button
                type="button"
                class="ant-btn ant-btn-me"
              ><span>刷新</span></button>
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
                <template #billStyle="{ record }">{{formatBillStyle(record.billStyle)}}</template>
                <template #isum="{ record }">{{toThousandFilter(record.isum)}}</template>
                <template #whxIsum="{ record }">{{toThousandFilter(sub(record.isum==null?'0':record.isum,record.hxIsum==null?'0':record.hxIsum))}}</template>
              </BasicTable>
          </div>
        </div>
      </div>

    </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import { PageWrapper } from '/@/components/Page'
import {nextTick, onMounted, reactive, ref, unref} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {
  SearchOutlined
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
import {findByFkWhxCgdhd} from "/@/api/record/system/hexiao";
import {sub, toThousandFilter} from "../../YingShouKuanQiChuYuE/calculation";
import {findByCvencode} from "/@/api/record/system/arBeginBalance";

const {
  createErrorModal,
  createConfirm,
  createWarningModal
} = useMessage()

const emit = defineEmits(['register', 'save'])

const formItems: any = ref({
  selectType: '',
  selectValue: ''
})
const accountList: any = ref([])
const dynamicTenantId = ref('')
const tableData:any = ref([]);
const tableDataAll:any = ref([]);
const year:any = ref('')
const cvencode:any = ref('')
const hxmxList:any = ref([])
const apHexiaoAuto:any = ref()
const apSourceFlag:any = ref()
const apCheckFlag:any = ref()
const [register, {closeModal,setModalProps}] = useModalInner(async(data) => {
  dynamicTenantId.value = data.dynamicTenantId
  year.value = data.year
  cvencode.value = data.cvencode
  hxmxList.value = data.list
  apHexiaoAuto.value = data.apHexiaoAuto
  apSourceFlag.value = data.apSourceFlag
  apCheckFlag.value = data.apCheckFlag
  await reloadList()
  state.selectedRowKeys = []
  checkRow.value = []
})

const columns = [
  {
    title: '单据类型',
    dataIndex: 'billStyle',
    ellipsis: true,
    width: 100,
    slots: {customRender: 'billStyle'}
  },
  {
    title: '单据日期',
    dataIndex: 'ddate',
    align: 'left',
    ellipsis: true,
    width: 100,
  },
  {
    title: '单据编号',
    dataIndex: 'ccode',
    width: 150,
    ellipsis: true,
  },
  {
    title: '金额',
    dataIndex: 'isum',
    width: 120,
    align: 'right',
    ellipsis: true,
    slots: {customRender: 'isum'}
  },
  {
    title: '未结款金额',
    dataIndex: 'whxIsum',
    width: 120,
    align: 'right',
    ellipsis: true,
    slots: {customRender: 'whxIsum'}
  },
]

function formatBillStyle(billStyle){
  let str = billStyle
  if (billStyle=='CGDHD'){
    str = '采购到货单'
  } else if (billStyle=='YFD'){
    str = '应付单'
  } else if(billStyle=='CGFP'){
    str = '采购发票'
  }
  return str
}

// 这是示例组件
const [registerTable, {reload,getColumns,setPagination}] = useTable({
  columns: columns,
  bordered: true,
  showIndexColumn: false,
  pagination: false,
  searchInfo: {
    accId: '',
    flag: '0',
  }
})

const xhdList:any = ref([])
const qcysdList:any = ref([])
const thisCheckKey:any = ref('')
async function reloadList(){
  tableDataAll.value = []
  let qcList = await useRouteApi(findByCvencode,{schemaName: dynamicTenantId})({cvencode:formItems.value.cvencode,iyear:year.value})
  if (apSourceFlag.value!='1') {
    qcysdList.value = qcList.filter(item => item.busStyle == 'YFD' && item.arIsumBenbi > 0)
  } else {
    qcysdList.value = qcList.filter(item => item.arStyle == 'YFD' && item.arIsumBenbi > 0)
  }
  tableDataAll.value.push(...qcysdList.value.map(item=>{
    item.hxStyle = item.arStyle
    item.hxCcode = item.ccode
    item.cvencode = item.cvencodeJs
    item.isum = item.arIsumBenbi
    if (item.hxIsum!=null && item.hxIsum !='') {
      item.whxIsum = sub(item.isum, item.hxIsum)
    } else {
      item.whxIsum = item.isum
    }
    item.type = 'YUE'
    return item
  }))
  const res:any = await useRouteApi(findByFkWhxCgdhd,{schemaName: dynamicTenantId})({year:year.value,cvencode:cvencode.value})
  xhdList.value = res.filter(item => item.bdocumStyle!='1')
  // console.log(thisCheckKey.value)
  if (apSourceFlag.value=='1') {
    tableData.value.push(...xhdList.value.filter(item => item.busStyle !='CGDHD' && item.bworkable=='1' && item.bdocumStyle!='1').map(item=>{
      item.hxStyle = item.billStyle
      item.hxCcode = item.ccode
      if (item.hxIsum!=null && item.hxIsum !='') {
        item.whxIsum = sub(item.isum, item.hxIsum)
      } else {
        item.whxIsum = item.isum
      }
      item.type = 'CGDHD'
      return item
    }))
  } else {
    if(apCheckFlag=='1'){
      tableData.value.push(...xhdList.value.filter(item => item.busStyle != 'CGFP' && item.bworkable=='1' && item.bdocumStyle!='1').map(item=>{
        item.hxStyle = item.billStyle
        item.hxCcode = item.ccode
        if (item.hxIsum!=null && item.hxIsum !='') {
          item.whxIsum = sub(item.isum, item.hxIsum)
        } else {
          item.whxIsum = item.isum
        }
        item.type = 'CGDHD'
        return item
      }))
    } else {
      tableData.value.push(...xhdList.value.filter(item => item.busStyle != 'CGFP' && item.bdocumStyle!='1').map(item=>{
        item.hxStyle = item.billStyle
        item.hxCcode = item.ccode
        if (item.hxIsum!=null && item.hxIsum !='') {
          item.whxIsum = sub(item.isum, item.hxIsum)
        } else {
          item.whxIsum = item.isum
        }
        item.type = 'CGDHD'
        return item
      }))
    }
  }
  tableData.value = tableDataAll.value.filter(item =>{
    if (hxmxList.value.length>0){
      return hxmxList.value.map(aa => aa.hxCcode).indexOf(item.ccode) == -1
    }
    return item
  })
  await setPagination({
    total: tableData.value.length
  })
}

onMounted(async () => {
})

const condClick = () => {

}

//选中内容
const state = reactive<{
  selectedRowKeys: [];
  loading: boolean;
}>({
  selectedRowKeys: [], // Check here to configure the default column
  loading: false,
});
const checkRow: any = ref([])
const onSelectChange = (selectedRowKeys, row) => {
  // console.log('selectedRowKeys changed: ', row);
  // if(selectedRowKeys.length>0){
    state.selectedRowKeys = selectedRowKeys;
    checkRow.value = row
  // }
};

async function handleOk() {
  if (checkRow.value.length>0) {
    emit('save', unref(checkRow.value));
    closeModal();
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '温馨提示',
      content: '请先需要添加的选择单据！'
    })
    return false
  }
}

async function onSearch(){
  tableData.value = tableDataAll.value.filter(item => {
    //通过部门编码过滤
    if (formItems.value.selectType == 'psnCode' && formItems.value.selectValue != '') {
      return item.psnCode.indexOf(formItems.value.selectValue) != -1
    }
    //通过部门名称过滤
    if (formItems.value.selectType == 'psnName' && formItems.value.selectValue != '') {
      return item.psnName.indexOf(formItems.value.selectValue) != -1
    }
    return item
  })
  await setPagination({
    total: tableData.value.length
  })
}

</script>
<style scoped lang="less">
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

.tables :deep(td),
.tables :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
  border-color: #aaaaaa !important;
}

:deep(.ant-table-measure-row) th,
:deep(.ant-table-measure-row) td{
  border-color: #aaaaaa !important;
}

.tables :deep(th) {
  text-align: center !important;
  font-weight: bold;
  background-color: #cccccc;
  line-height:30px;
}

.bg-white{
  width: 250px !important;
  min-height: 385px !important;
  height: calc(100%);
  border: 1px #cccccc solid;
  background:white !important;
}

:deep(.ant-table-row-selected) td{
  background: #0096c7 !important;
}

:deep(.ant-tree-list){
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.ant-checkbox) {
  border: 1px solid #999999 !important;
  border-radius: 0 !important;
  margin-top: -10px !important;
}
.ant-checkbox-inner{
  width:14px;
  height:14px;
}
</style>
<style>
.head-title .scroll-container .scrollbar__wrap {
  margin-bottom: -45px !important;
}

</style>
