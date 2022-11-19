<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    title="设置仓库级别"
    @ok="handleOk()"
    @register="register"
  >
    <template #title>
      <div style="display: flex;color: #0096c7;">
        <span style="line-height:40px;font-size: 28px;">
          <PlusCircleOutlined style="font-size: 29px;font-weight: bold"/>
        </span>
        <span style="line-height:40px;font-size: 20px;">
          &nbsp;&nbsp;设置仓库级别
        </span>
      </div>
    </template>
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <a-table bordered :data-source="levelNameData" :columns="columns" :pagination="false" style="max-height: 500px;overflow-y: auto;margin-top: 2px;" class="lanmu-table">
        <template #level1="{ text, record }">
          <a-select
            disabled
            allowClear
            show-search
            v-model:value="formItems.level1"
            style="width: 100%"
          >
            <a-select-option
              v-for="item in level1List"
              :key="item.levelName"
              :value="item.levelName"
            >
              {{item.levelName}}
            </a-select-option>
          </a-select>
        </template>
        <template #level2="{ text, record }">
          <a-select
            allowClear
            show-search
            v-model:value="formItems.level2"
            style="width: 100%"
            @change="levelNameCheck"
          >
            <a-select-option
              v-for="item in level2List"
              :key="item.levelName"
              :value="item.levelName"
            >
              {{item.levelName}}
            </a-select-option>
          </a-select>
        </template>
        <template #level3="{ text, record }">
          <a-select
            allowClear
            show-search
            v-model:value="formItems.level3"
            :disabled="formItems.level2===undefined || formItems.level2===''"
            style="width: 100%"
            @change="levelNameCheck"
          >
            <a-select-option
              v-for="item in level3List"
              :key="item.levelName"
              :value="item.levelName"
            >
              {{item.levelName}}
            </a-select-option>
          </a-select>
        </template>
        <template #level4="{ text, record }">
          <a-select
            allowClear
            show-search
            v-model:value="formItems.level4"
            :disabled="formItems.level3===undefined || formItems.level3===''"
            style="width: 100%"
            @change="levelNameCheck"
          >
            <a-select-option
              v-for="item in level4List"
              :key="item.levelName"
              :value="item.levelName"
            >
              {{item.levelName}}
            </a-select-option>
          </a-select>
        </template>
        <template #level5="{ text, record }">
          <a-select
            allowClear
            show-search
            v-model:value="formItems.level5"
            :disabled="formItems.level4===undefined || formItems.level4===''"
            style="width: 100%"
            @change="levelNameCheck"
          >
            <a-select-option
              v-for="item in level5List"
              :key="item.levelName"
              :value="item.levelName"
            >
              {{item.levelName}}
            </a-select-option>
          </a-select>
        </template>
        <template #level6="{ text, record }">
          <a-select
            allowClear
            show-search
            v-model:value="formItems.level6"
            :disabled="formItems.level5===undefined || formItems.level5===''"
            style="width: 100%"
            @change="levelNameCheck"
          >
            <a-select-option
              v-for="item in level6List"
              :key="item.levelName"
              :value="item.levelName"
            >
              {{item.levelName}}
            </a-select-option>
          </a-select>
        </template>
      </a-table>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {PlusCircleOutlined} from '@ant-design/icons-vue'
import {ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  Input as AInput,
  Select as ASelect,
  Statistic as AStatistic,
  Table as ATable,
} from 'ant-design-vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {findAllLevelName} from "/@/api/record/stock/stock-cangku-level-name";
import {
  cangkuLevelSave,
  countByLevel2,
  countByLevel3,
  countByLevel4,
  countByLevel5,
  countByLevel6
} from "/@/api/record/stock/stock-cangku-level";

const ASelectOption = ASelect.Option;
  const AInputSearch = AInput.Search;
  const AStatisticCountdown = AStatistic.Countdown;
  const { createErrorModal } = useMessage()
  const emit=defineEmits(['register']);

  const level1List:any = ref([])
  const level2List:any = ref([])
  const level3List:any = ref([])
  const level4List:any = ref([])
  const level5List:any = ref([])
  const level6List:any = ref([])

  const formItems:any = ref({})
  const levelNameData:any = ref([{level1:'',level2:'',level3:'',level4:'',level5:'',level6:'',}])
  const columns=[
    {
      title: '级别1',
      dataIndex: 'level1',
      slots: { customRender: 'level1' },width:100,
    },
    {
      title: '级别2',
      dataIndex: 'level2',
      slots: { customRender: 'level2' },width:100,
    },
    {
      title: '级别3',
      dataIndex: 'level3',
      slots: { customRender: 'level3' },width:100,
    },
    {
      title: '级别4',
      dataIndex: 'level4',
      slots: { customRender: 'level4' },width:100,
    },
    {
      title: '级别5',
      dataIndex: 'level5',
      slots: { customRender: 'level5' },width:100,
    },
    {
      title: '级别6',
      dataIndex: 'level6',
      slots: { customRender: 'level6' },width:100,
    },
  ]

  // 数据库模式名称
  const [register, { closeModal }] = useModalInner( async (data) => {
    formItems.value.level2=''
    formItems.value.level3=''
    formItems.value.level4=''
    formItems.value.level5=''
    formItems.value.level6=''
    // 获取仓库名称
   let temp= await findAllLevelName()
    formItems.value.level1='仓库'
    level1List.value=temp
    level2List.value=temp.filter(v=>v.levelName!==formItems.value.level1)
  });

  // 每级级次触发
  async function levelNameCheck() {
    if(formItems.value.level2===undefined){
      formItems.value.level3=''
      formItems.value.level4=''
      formItems.value.level5=''
      formItems.value.level6=''
    }else if(formItems.value.level3===undefined){
      formItems.value.level4=''
      formItems.value.level5=''
      formItems.value.level6=''
    }
    else if(formItems.value.level4===undefined){
      formItems.value.level5=''
      formItems.value.level6=''
    }else if(formItems.value.level5===undefined){
      formItems.value.level6=''
    }
    let temp=await findAllLevelName()
    level2List.value=temp.filter(v=>v.levelName!==formItems.value.level1 && v.levelName!==formItems.value.level2&& v.levelName!==formItems.value.level3&& v.levelName!==formItems.value.level4&& v.levelName!==formItems.value.level5&& v.levelName!==formItems.value.level6)
    level3List.value=temp.filter(v=>v.levelName!==formItems.value.level1 && v.levelName!==formItems.value.level2&& v.levelName!==formItems.value.level3&& v.levelName!==formItems.value.level4&& v.levelName!==formItems.value.level5&& v.levelName!==formItems.value.level6)
    level4List.value=temp.filter(v=>v.levelName!==formItems.value.level1 && v.levelName!==formItems.value.level2&& v.levelName!==formItems.value.level3&& v.levelName!==formItems.value.level4&& v.levelName!==formItems.value.level5&& v.levelName!==formItems.value.level6)
    level4List.value=temp.filter(v=>v.levelName!==formItems.value.level1 && v.levelName!==formItems.value.level2&& v.levelName!==formItems.value.level3&& v.levelName!==formItems.value.level4&& v.levelName!==formItems.value.level5&& v.levelName!==formItems.value.level6)
    level5List.value=temp.filter(v=>v.levelName!==formItems.value.level1 && v.levelName!==formItems.value.level2&& v.levelName!==formItems.value.level3&& v.levelName!==formItems.value.level4&& v.levelName!==formItems.value.level5&& v.levelName!==formItems.value.level6)
    level6List.value=temp.filter(v=>v.levelName!==formItems.value.level1 && v.levelName!==formItems.value.level2&& v.levelName!==formItems.value.level3&& v.levelName!==formItems.value.level4&& v.levelName!==formItems.value.level5&& v.levelName!==formItems.value.level6)
  }

  async function handleOk() {
    if(formItems.value.level2===undefined){
      return createErrorPop('一级级别已存在,不能重复!');
    }else if(formItems.value.level2!==undefined && formItems.value.level2!=='' &&(formItems.value.level3===undefined || formItems.value.level3==='')){
      formItems.value.levelOrder='2'
      let temp=await countByLevel2(formItems.value.level2)
      if(temp>0){
        return createErrorPop('二级级别已存在,不能重复!');
      }
    }
    if(formItems.value.level3!==undefined && formItems.value.level3!=='' &&(formItems.value.level4===undefined || formItems.value.level4==='')){
      formItems.value.levelOrder='3'
      let temp=await countByLevel3(formItems.value.level2,formItems.value.level3)
      if(temp>0){
        return createErrorPop('三级级别已存在,不能重复!');
      }
    }
    if(formItems.value.level4!==undefined && formItems.value.level4!=='' &&(formItems.value.level5===undefined || formItems.value.level5==='')){
      formItems.value.levelOrder='4'
      let temp=await countByLevel4(formItems.value.level2,formItems.value.level3,formItems.value.level4)
      if(temp>0){
        return createErrorPop('四级级别已存在,不能重复!');
      }
    }
    if(formItems.value.level5!==undefined && formItems.value.level5!=='' &&(formItems.value.level6===undefined || formItems.value.level6==='')){
      formItems.value.levelOrder='5'
      let temp=await countByLevel5(formItems.value.level2,formItems.value.level3,formItems.value.level4,formItems.value.level5)
      if(temp>0){
        return createErrorPop('五级级别已存在,不能重复!');
      }
    }
    if(formItems.value.level6!==undefined && formItems.value.level6!==''){
      formItems.value.levelOrder='6'
      let temp=await countByLevel6(formItems.value.level2,formItems.value.level3,formItems.value.level4,formItems.value.level5,formItems.value.level6)
      if(temp>0){
        return createErrorPop('六级级别已存在,不能重复!');
      }
    }
    await cangkuLevelSave(unref(formItems))
    emit('save', '');
    closeModal();
  }
function createErrorPop(text) {
  createErrorModal({
    iconType: 'warning',
    title: '提示',
    content: text
  })
  return false
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
:deep(.vben-basic-title) {
  color: rgb(1, 129, 226) !important;
}

:deep(.ant-select-single:not(.ant-select-customize-input)
.ant-select-selector
.ant-select-selection-search-input) {
  border: none !important;
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

.red_span {
  color: red;
  font-weight: bold;
  display: inline-block;
  width: 20px;
  text-align: right;
}

.nc-open-content {
  input {
    width: 50%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  .abc{
    border-bottom: 2px solid #666666 !important;
    font-size: 18px;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  label {
    text-align: left;
    width: 110px;
    display: inline-block;
    padding-top: 5px;
    padding-bottom: 5px;
    color: #535353;
    font-size: 13px;
    margin-left: 1em;
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
