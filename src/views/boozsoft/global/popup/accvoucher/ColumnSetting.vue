<template>
                <a-popconfirm
                ok-text="确定"
                cancel-text="放弃"
                @confirm="confirm"
                @cancel="cancel">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <a-table bordered :data-source="props.dynamicColumnData" :columns="props.dynamicColumns"
                           childrenColumnName="children" :pagination="false" style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                    <template #checkBox="{ text, record }">
                      <a-checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                    </template>
                    <template #widthInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <a-input type="number" v-model:value="editableData[record.key].width"
                                   @pressEnter="save(record.key,record.min,record.max)"
                                   style="width: 80px"/>
                          <check-outlined class="editable-cell-icon-check"
                                          @click="save(record.key,record.min,record.max)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <edit-outlined class="editable-cell-icon" @click="edit(record.key)"/>
                          <span style="float: right;">{{ record.min + '~' + record.max }}</span>
                        </div>
                      </div>
                    </template>
                    <template #nameInput="{ text, record }">
                      <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                          <a-input type="text" v-model:value="editableData[record.key].nameNew"
                                   @pressEnter="saveName(record.key)" style="width: 100px"/>
                          <check-outlined class="editable-cell-icon-check"
                                          @click="saveName(record.key)"/>
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                          {{ text || ' ' }}
                          <edit-outlined class="editable-cell-icon" @click="edit(record.key)"/>
                        </div>
                      </div>
                    </template>
                    <template #alignRadio="{ text, record }">
                      <a-radio-group default-value="a" size="small" v-model:value="record.align"
                                     :disabled="record.align==''">
                        <a-radio-button value="left">
                          左
                        </a-radio-button>
                        <a-radio-button value="center">
                          中
                        </a-radio-button>
                        <a-radio-button value="right">
                          右
                        </a-radio-button>
                      </a-radio-group>
                    </template>
                  </a-table>
                </template>
                <a-button style="width: 165px;border: none">栏目设置</a-button>
              </a-popconfirm>
</template>
<script setup lang="ts">
import {reactive,onMounted} from 'vue'

import {
  Input as AInput,
  Radio as ARadio,
  Popconfirm as APopconfirm,
  Table as ATable,
  Checkbox as ACheckbox,
  message,
} from "ant-design-vue";
const AInputSearch = AInput.Search
const ARadioGroup = ARadio.Group
const ARadioButton = ARadio.Button
import {
  CheckOutlined,
  EditOutlined,
} from '@ant-design/icons-vue';
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {saveLanMuList} from "/@/api/record/system/accvoucher";
import {useMessage} from "/@/hooks/web/useMessage";
import {cloneDeep} from "lodash-es";
const {createConfirm, createWarningModal} = useMessage();
const emit = defineEmits(['register','reloadColumn'])
const props =  defineProps(['dynamicColumnData','dynamicColumns','lanMuData','dynamicColumnDataCopy'])
const editableData = reactive({});
const confirm = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      props.lanMuData.accId = getCurrentAccountName(false)
      props.lanMuData.objects = JSON.stringify(filterModifyData(props.dynamicColumnData, props.dynamicColumnDataCopy))
      if (props.lanMuData.objects == '[]') {
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
      } else {
        saveLanMuList(props.lanMuData).then(res => {
          message.success("数据库同步成功！")
        })
        // 重新赋值
        props.dynamicColumnDataCopy = JSON.parse(JSON.stringify(props.dynamicColumnData))
      }
    }
  });
  // 重新获取数据
  emit('reloadColumn')
}

const cancel = (e: MouseEvent) => {
  // 恢复默认
  props.dynamicColumnData = []
  props.dynamicColumnData = JSON.parse(JSON.stringify(props.dynamicColumnDataCopy))
}
function filterModifyData(lanMuList: any, copyList) {
  let a = lanMuList.filter(item => {
    try {
      copyList.forEach(item2 => {
        if (item.key === item2.key && item.name == item2.name) {
          if (item.nameNew != item2.nameNew || item.width != item2.width || item.check != item2.check || item.align != item2.align)
            throw new Error('ok')
        }
      })
      return false
    } catch (e) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  return a;
}

const edit = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData[key] = cloneDeep(props.dynamicColumnData[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1] - 1)
      editableData[key] = cloneDeep(props.dynamicColumnData[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData[key] = cloneDeep(props.dynamicColumnData.filter(item => key === item.key)[0]);
  }
}

const save = (key: string, min: number, max: number) => {
  editableData[key].width = editableData[key].width > max ? max : editableData[key].width < min ? min : editableData[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(props.dynamicColumnData[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(props.dynamicColumnData[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(props.dynamicColumnData[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(props.dynamicColumnData.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}

const saveName = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(props.dynamicColumnData[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(props.dynamicColumnData[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(props.dynamicColumnData[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(props.dynamicColumnData.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}
</script>
<style lang="less" scoped>
</style>
