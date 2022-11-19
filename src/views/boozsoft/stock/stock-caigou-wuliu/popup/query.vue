<template>
  <BasicModal width="925px"
              v-bind="$attrs"
              :title="''"
              @ok="handleOk()"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <img src="/create.svg" style="width:25px;margin-right: 10px;"/>
        <span style="line-height: 25px;font-size: 16px;">表头栏目设置</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div class="content-head">
        <Button type="primary" @click="addRow">
          增行
        </Button>&nbsp;&nbsp;
        <Button @click="delRow">
          删行
        </Button>&nbsp;&nbsp;
        <Button @click="exec('up')">
          上调
        </Button>&nbsp;&nbsp;
        <Button @click="exec('down')">
          下调
        </Button>
      </div>
      <div class="content-body">
        <BasicTable
          :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onSelect: onSelectChange ,getCheckboxProps: onCheckChange}"
          :row-key="r=>r.field"
          :scroll="{ y: 290 }"
          class="alone-basic-table"
          size="small"
          @register="registerTable"
        >
          <template #columnType="{ record }">
            <Tag color="#87d068" v-if="record.columnType == '1'">系统</Tag>
            <Tag color="#f50" v-else>自定义</Tag>
          </template>
          <template #field="{ record }">
            <template v-if="record?.editOne">
              <Select v-model:value="record.tempOne" style="width: 85%;"
                      @change="change(record.tempOne,record)" @focus="filterList">
                <SelectOption v-for="v in fieldList" :value="v">
                  {{ v }}
                </SelectOption>
              </Select>
              <CheckOutlined @click="record.editOne = null;record.field=record.tempOne;"/>
            </template>
            <template v-else>
              <span>{{ record.field }}
              <EditOutlined v-if="record?.readonly != true && record.columnType != '1'"
                            @click="record.editOne = true;record.tempOne=record.field"/></span>
            </template>
          </template>
          <template #label="{ record }">
            <template v-if="record?.editTwo">
              <Input v-model:value="record.tempTwo"
                     style="width: 82%;"
                     @keyup.enter="checkNameF(record)"/>
              <CheckOutlined @click="checkNameF(record)"/>
            </template>
            <template v-else>
              <span class="a-table-font-arial">{{ record.label }}
              <EditOutlined v-if="record?.readonly != true"
                            @click="record.editTwo = true;record.tempTwo=record.label"/></span>
            </template>
          </template>
          <template #component="{ record }">
            <template v-if="record?.editThree">
              <Select v-model:value="record.tempThree" style="width: 85%;">
                <SelectOption value="Input">手工录入</SelectOption>
                <SelectOption value="Select">来源档案</SelectOption>
                <SelectOption value="DatePicker">日期选择</SelectOption>
              </Select>
              <CheckOutlined @click="record.editThree = null;record.component=record.tempThree;"/>
            </template>
            <template v-else>
              <span>{{
                  record.component == 'Select' ? '下拉选择' : record.component == 'DatePicker' ? '日期选择' : '手工录入'
                }}
              <EditOutlined v-if="record?.readonly != true && record.columnType != '1'"
                            @click="record.editThree = true;record.tempThree=record.component"/></span>
            </template>
          </template>
          <template #required="{ record }">
            <Checkbox v-model:checked="record.required" :disabled="record.readonly"/>
          </template>
          <template #componentProps="{ record }">
            <template v-if="record?.editFive">
              <Select v-model:value="record.tempFive" style="width: 85%;"
                      :options="dataSourceList"/>
              <CheckOutlined
                @click="record.editFive = null;record.componentProps=record.tempFive;"/>
            </template>
            <template v-else>
              <span>{{ record.componentProps }}
              <EditOutlined
                v-if="!record?.readonly &&  (record.component == 'Select') && record.columnType != '1'"
                @click="record.editFive = true;record.tempFive=record.componentProps"/></span>
            </template>
          </template>
          <template #isShow="{ record }">
            <Checkbox v-model:checked="record.isShow" :disabled="record.readonly"/>
          </template>
        </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {ref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {CheckOutlined, EditOutlined} from '@ant-design/icons-vue';
import {Button, Checkbox, DatePicker, Input, message, Radio, Select, Tag} from 'ant-design-vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {BasicTable, useTable} from '/@/components/Table'
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {delStockColumnList, saveStockColumnList} from "/@/api/record/stock/stock-caigou";
import {JsonTool, ObjTool} from "/@/api/task-api/tools/universal-tools";
import {
  GenerateDynamicColumn
} from "/@/views/boozsoft/stock/stock-caigou-dh/component/DynamicForm";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;

const emit = defineEmits(['register', 'query']);
const formItems: any = ref({});
const schemaName = ref('')

const dataSourceList = ref([{value: 'customer', label: '客户'}, {value: 'supplier', label: '供应商'}])
const tableSelectedRowKeys = ref([])
const onSelectChange = (record, selected, obj, nativeEvent) => {
  let o = obj.map(it => it.field)
  tableSelectedRowKeys.value = o.filter(v => v != 'field1' && v != 'field2' && v != 'field3')
}
const onCheckChange = (record) => {
  return {disabled: (record.label === '到货日期' || record.label === '到货单号' || record.label === '供应商' || record.label === '仓库')}
}

const [registerTable, {getDataSource, setTableData}] = useTable({
  columns: [
    {
      title: '属性类型',
      dataIndex: 'columnType',
      width: '75px',
      slots: {customRender: 'columnType'}
    },
    {
      title: '属性名称',
      dataIndex: 'field',
      width: '130px',
      align: 'left',
      slots: {customRender: 'field'}
    }, {
      title: '标题名称',
      dataIndex: 'label',
      width: '120px',
      align: 'left',
      slots: {customRender: 'label'}
    },
    {
      title: '输入类型',
      dataIndex: 'component',
      width: '140px',
      align: 'left',
      slots: {customRender: 'component'}
    },
    {
      title: '参数来源',
      dataIndex: 'componentProps',
      width: '140px',
      slots: {customRender: 'componentProps'}
    }, {
      title: '必填',
      dataIndex: 'required',
      width: '80px',
      slots: {customRender: 'required'}
    }, {
      title: '显示',
      dataIndex: 'isShow',
      width: '80px',
      slots: {customRender: 'isShow'}
    }
  ],
  bordered: true,
  showIndexColumn: true,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['50'],
    showTotal: t => `总共${t}条数据`
  },
})


const dynamicColumnDataCopy = ref([])


const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  formItems.value = {}
  schemaName.value = o.schemaName
  let list = await GenerateDynamicColumn(schemaName.value)
  // 加载默认数据
  dynamicColumnDataCopy.value = JsonTool.parseProxy(list.filter(it => it.label != '送货日期' && it.label != '送货单号' && it.label != '供应商'))
  setTableData(list)
  setModalProps({minHeight: 420});
});

const change = (v, o) => {
  /*let list = model.filter(it => it.field == v)
  if (list.length > 0) {
    o.label = list[0].label
    o.component = list[0].component
    o.componentProps = list[0].componentProps
    o.required = list[0].required
  }*/
}

const {createWarningModal, createConfirm} = useMessage()
const lanMuData = {
  'menuName': '销售送货物流单',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
}

function filterModifyData(lanMuList: any, copyList) {
  let a = lanMuList.filter(item => {
    try {
      let arr = copyList.filter(it => it.field == item.field)
      if (arr.length > 0) { // 存在
        let item2 = arr[0]
        if (item.label != item2.label || item.component != item2.component || item.componentProps != item2.componentProps || item.required != item2.required || item.isShow != item2.isShow || item.serial != item2.serial)
          throw new Error('ok')
      } else {// 新增的
        return true;
      }
      return false
    } catch (e) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  if (lanMuList.length < copyList.length){
    // 找到减少项
    let keys = lanMuList.map(it=>it.field)
    let b = copyList.filter(it=>keys.indexOf(it.field) == -1).map(it=>{it['del']=true;return it})
    a.push(...b)
  }
  return a;
}

async function handleOk() {
  let list = getDataSource().filter(it => !hasBlank(it.field) && !hasBlank(it.label) && !hasBlank(it.component)).filter(it => it.label != '送货日期' && it.label != '送货单号' && it.label != '供应商')
  list = filterModifyData(list, dynamicColumnDataCopy.value).map(it => ObjTool.dels(it, ['editOne', 'editTwo', 'editThree', 'editFive', 'tempOne', 'tempTwo', 'tempThree', 'tempFive']))
  let lastList = list.filter(it=>it['del'] == null)
  let delList = list.filter(it=>it['del'] == true)
  if (lastList.length == 0 && delList.length == 0) {
    createWarningModal({title: '温馨提示', content: '暂未发现数据任何变化！'})
  } else {
    createConfirm({
      iconType: 'warning',
      title: '标题栏目同步',
      content: '是否将刚才设置同步数据库!',
      onOk: async () => {
        // 调整数据库 列参数
        if (delList.length > 0) {
          useRouteApi(delStockColumnList, {schemaName: schemaName.value})({
            menuName: '销售送货物流单表头栏目',
            fieldFame: JsonTool.json(delList.filter(it => it.columnType == '2').map(it => it.field))
          })
        }
        if (lastList.length > 0) {
          lanMuData.objects = JSON.stringify(lastList)
          let res = await useRouteApi(saveStockColumnList, {schemaName: schemaName.value})(lanMuData)
          if (null == res) message.success('后台同步成功！')
          emit('query', {})
        }
        closeModal();
        return true;
      }
    });
  }
}

async function handleClose() {
}

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const addRow = () => {
  let list = getDataSource()
  if (list.length < 27) {
    list.push({readonly: false, required: false, component: 'Input', columnType: 2, isShow: true,serial: list.length+1})
    setTableData(list)
  } else {
    createWarningModal({title: '温馨提示', content: '自定义项不可超过16行!'})
  }
}
const delRow = () => {
  if (tableSelectedRowKeys.value.length == 0) {
    createWarningModal({title: '温馨提示', content: '删行时请至少选择一下项!'})
  } else {
    let list = getDataSource()
    let a = (list.filter(it => tableSelectedRowKeys.value.indexOf(it.field) != -1 && it.columnType == '1')).length
    if (a > 0) {
      createWarningModal({title: '温馨提示', content: '所选行存在系统字段,不能进行删除操作!'})
      return false;
    }
    list = list.filter(it => tableSelectedRowKeys.value.indexOf(it.field) == -1)
    setTableData(list)
    tableSelectedRowKeys.value.length = []
  }
}
let swapItems = (arr, index1, index2) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  arr.forEach((v,i)=> v['serial'] = (i+1)) // 整理后台序号
  return arr;
};
const exec = (t) => {
  if (tableSelectedRowKeys.value.length != 1) {
    createWarningModal({title: '温馨提示', content: '上下移动行时,只能选择一行进行移动!'})
  } else {
    let arr = getDataSource()
    let $index = arr.findIndex(it => it.field == tableSelectedRowKeys.value[0])
    if (t == 'up') {
      if ($index < 5) return;
      arr = swapItems(arr, $index, $index - 1);
    } else {
      if ($index == arr.length - 1) return;
      arr = swapItems(arr, $index, $index + 1);
    }
    setTableData(arr)
  }
}
const fieldList = ref([])
const filterList = () => {
  let list = getDataSource().filter(it => it.field && '' != it.field).map(it => it.field)
  let arr = []
  for (let i = 1; i <= 12; i++) {
    let v = 'cfree' + i
    if (list.indexOf(v) == -1) arr.push(v)
  }
  fieldList.value = arr
}

function checkNameF(record) {
  let list = getDataSource().filter(it => it.field != null && '' != it.field).map(it => it.label)
  if (list.length > 0 && list.indexOf(record.tempTwo) != -1) {
    createWarningModal({title: '温馨提示', content: '标题名称已重复!'})
    record.tempTwo = ''
  } else {
    record.editTwo = null;
    record.label = record.tempTwo;
  }
}
</script>
<style lang="less" scoped="scoped">
@import '/@/assets/styles/part-open.less';
@import '/@/assets/styles/alone-basic-table.less';

.nc-query-open-content {
  text-align: center;
  padding: 1%;
  height: 100%;

  .content-head {
    text-align: right;
    margin-bottom: 1em;
  }
}
</style>
