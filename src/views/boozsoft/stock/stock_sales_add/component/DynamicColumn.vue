<template>
  <div>
    <Popconfirm
      placement="leftTop"
      ok-text="保存"
      cancel-text="关闭"
      @confirm="confirm"
      @cancel="cancel()">
      <template #icon><b>栏目设置</b><br></template>
      <template #title>
        <div style="width: 800px;max-height: 500px;overflow-y: auto;">
          <BasicTable
            :scroll="{ y: 290 }"
            :dataSource="prop.dynamicData.value"
            class="alone-basic-table"
            size="small"
            @register="registerTable"
          >
            <template #checkBox="{ text, record }">
              <Checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
            </template>
            <template #widthInput="{ text, record }">
              <div class="editable-cell">
                <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                  <Input type="number" v-model:value="editableData[record.key].width"
                         @pressEnter="save(record.key,record.min,record.max)"
                         style="width: 80px"/>
                  <CheckOutlined class="editable-cell-icon-check"
                                 @click="save(record.key,record.min,record.max)"/>
                </div>
                <div v-else class="editable-cell-text-wrapper">
                  {{ text || ' ' }}
                  <EditOutlined class="editable-cell-icon" @click="edit(record.key)"/>
                  <span style="float: right;">{{ record.min + '~' + record.max }}</span>
                </div>
              </div>
            </template>
            <template #nameInput="{ text, record }">
              <div class="editable-cell">
                <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                  <Input type="text" v-model:value="editableData[record.key].nameNew"
                         @pressEnter="saveName(record.key)" style="width: 100px"/>
                  <CheckOutlined class="editable-cell-icon-check"
                                 @click="saveName(record.key)"/>
                </div>
                <div v-else class="editable-cell-text-wrapper">
                  {{ text || ' ' }}
                  <EditOutlined class="editable-cell-icon" @click="edit(record.key)"/>
                </div>
              </div>
            </template>
            <template #alignRadio="{ text, record }">
              <RadioGroup default-value="a" size="small" v-model:value="record.align">
                <RadioButton value="left">
                  左
                </RadioButton>
                <RadioButton value="center">
                  中
                </RadioButton>
                <RadioButton value="right">
                  右
                </RadioButton>
              </RadioGroup>
            </template>
            <template #operate="{ text, record , index }">
              <div>
                <Button size="small" @click="move(record,'up')" v-show="index != 0">
                  <VerticalAlignTopOutlined/>
                </Button>
                <Button size="small" @click="move(record,'down')" v-show="index != (dynamicColumnLength-1)">
                  <VerticalAlignBottomOutlined/>
                </Button>
              </div>
            </template>
          </BasicTable>
        </div>
      </template>
      <Button style="width: 120px;margin-bottom: 2px">表体栏目设置</Button>
    </Popconfirm>
  </div>
</template>
<script setup="props, { content }" lang="ts">
import {findDbLanMuList, saveLanMuList} from "/@/api/record/system/accvoucher";
import {Button, Checkbox, Input, message, Popconfirm, Radio} from "ant-design-vue";
import {CheckOutlined, EditOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined} from '@ant-design/icons-vue';
import {onMounted, reactive,ref,watch,computed} from "vue";
import {cloneDeep} from "lodash-es";
import {BasicTable, useTable} from '/@/components/Table';
import {useMessage} from "/@/hooks/web/useMessage";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import {combineParameters,filterModifyData,swapItems} from './DynamicColumn.ts'

const {createConfirm, createWarningModal} = useMessage()
const emit = defineEmits(['register', 'reload']);
const prop = defineProps(['dynamicData', 'lanmuInfo','defaultData'])

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const lanMuData = {
  accId: 'postgres',
  menuName: '未知名的列表',
  type: '列表',
  objects: '',
  username: ''// useUserStoreWidthOut().getUserInfo.username
}

let dynamicColumnDataCopy = []
const dynamicColumnLength = ref(0)
const editableData = reactive({});
const [registerTable, {getDataSource, setTableData}] = useTable({
  columns: [
    {
      title: '栏目名称',
      dataIndex: 'name',
      align: 'left',
      width: 150,
    },
    {
      title: '显示',
      dataIndex: 'check',
      align: 'center',
      width: 50,
      slots: {customRender: 'checkBox'},
    },
    {
      title: '显示名称',
      dataIndex: 'nameNew',
      width: 150,
      align: 'left',
      slots: {customRender: 'nameInput',},
    },
    {
      title: '宽度(范围)',
      dataIndex: 'width',
      align: 'center',
      width: 140,
      slots: {customRender: 'widthInput',},
    },
    {
      title: '对齐方式',
      dataIndex: 'align',
      align: 'center',
      width: 140,
      slots: {customRender: 'alignRadio'}
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      width: 100,
      slots: {customRender: 'operate'}
    }],
  bordered: true,
  showIndexColumn: true,
  pagination: false,
})

const currentCateCode = computed(() => prop.lanmuInfo.changeNumber)
watch(currentCateCode, (abc) => {
  resetDynamicColumnData()
})
/*onMounted(()=>{
  // resetDynamicColumnData()
})*/
function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  const statiList = JsonTool.parseProxy(prop.defaultData)
  findDbLanMuList(prop.lanmuInfo).then(res => {
    // 栏目列
    let dbList = res.items
    prop.dynamicData.value = []
    if (dbList.length > 0) {
      let  lastList = combineParameters(statiList, dbList)
      prop.dynamicData.value = lastList
    } else {
      prop.dynamicData.value = statiList
    }
    dynamicColumnLength.value = prop.dynamicData.value.length
    dynamicColumnDataCopy = JsonTool.parseProxy(prop.dynamicData.value)
    // 表格列
    emit('reload')
  })
}

const confirm = (e: MouseEvent) => {
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      prop.lanmuInfo.objects = JSON.stringify(filterModifyData(prop.dynamicData.value, dynamicColumnDataCopy))
      if (prop.lanmuInfo.objects == '[]') {
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
      } else {
        saveLanMuList(prop.lanmuInfo).then(res => {
          message.success("数据库同步成功！")
        })
        // 重新赋值
        dynamicColumnDataCopy = JSON.parse(JSON.stringify(prop.dynamicData.value.filter(it => it != null)))
        // 重新加载表格

      }
    }
  });
  emit('reload')
}

function cancel(e) {
  setTableData(dynamicColumnDataCopy.filter(it=>null != it))
}
const edit = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData[key] = cloneDeep(prop.dynamicData.value[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1] - 1)
      editableData[key] = cloneDeep(prop.dynamicData.value[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData[key] = cloneDeep(prop.dynamicData.value.filter(item => key === item.key)[0]);
  }
}

const save = (key: string, min: number, max: number) => {
  editableData[key].width = editableData[key].width > max ? max : editableData[key].width < min ? min : editableData[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(prop.dynamicData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(prop.dynamicData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(prop.dynamicData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(prop.dynamicData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}
const saveName = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(prop.dynamicData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(prop.dynamicData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(prop.dynamicData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(prop.dynamicData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}



const move = (e, action) => {
if (null == e?.key){
  message.error('栏目数据异常！')
  return false
}
  let list =  getDataSource()
  let $index = list.findIndex(it=>it?.key == e?.key)
  if ((action=='up' && $index != 0)  || (action == 'down' &&  $index != (list.length-1)) ){
    list = swapItems(list, $index, action=='up'?($index - 1):($index + 1));
    setTableData(list)
  }
}
</script>
<style lang="less" scoped="scoped">
@import '/@/assets/styles/alone-basic-table.less';
</style>
