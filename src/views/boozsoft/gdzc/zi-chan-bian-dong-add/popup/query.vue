<template>
  <BasicModal width="400px" v-bind="$attrs" :title="''"
              @ok="handleOk()"
              :show-ok-btn="showOk"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <img src="/create.svg" style="width:25px;margin-right: 10px;"/>
        <span style="line-height: 25px;font-size: 16px;">资产变动内容选择</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <div class="ncqopen-content-left">
        <CheckboxGroup v-model:value="openParameter.values" :options="changeContents"
                       @change="radioChange"/>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {hasBlank} from "/@/api/task-api/tast-bus-api";

import {DatePicker, Select, Checkbox, Row, message} from 'ant-design-vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {findFaCheckByDate} from "/@/api/fa/fa-pandian";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {canChangeContent, findFaInvoiceByDate} from "/@/api/fa/fa-change";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const CheckboxGroup = Checkbox.Group;

const emit = defineEmits(['register', 'query']);
const formItems: any = ref({});
const showOk = ref(false);
const assetTypeList = ref([]);
const usageStatusList = ref([]);
const locationList = ref([]);
const deptList = ref([]);
const psnList = ref([]);
const proList = ref([]);

const mUnqieCode = ref('')

const changeContents = ref([
  {value: "yuanzhi", label: '原值', type: 'INPUT'},// not 0
  {value: "ljzhejiu", label: '累计折旧/摊销', type: 'INPUT'},
  {value: "jingcanzhilv", label: '预计净残值(率)', type: 'INPUT'},
  {value: "zhejiuMethod", label: '折旧/摊销方法', type: 'SELECT'},
  {value: "life", label: '预计使用年限(月)', type: 'INPUT'},// not 0
  {value: "shuliang", label: '数量', type: 'INPUT'},
  {value: "faClass", label: '资产分类', type: 'SELECT'},
  {value: "zongliang", label: '预计工作总量', type: 'INPUT'},
  {value: "addr", label: '存放位置', type: 'SELECT'},
  {value: "DEPT", label: '部门', type: 'SELECT'},
  {value: "PRO", label: '项目', type: 'SELECT'},
  {value: "zerenUser", label: '责任人', type: 'SELECT'},
  {value: "useType", label: '使用状况', type: 'SELECT'},
  {value: "jinxiangshuilv", label: '进项税率', type: 'INPUT'}
])


const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  // 方式2
  formItems.value = {}
  mUnqieCode.value = o.data.code
  // 获取当前 时间变动的内容
  let res1 = await useRouteApi(findFaInvoiceByDate, {schemaName:  o.data.mode})({code: o.data.code,date:  o.data.date})
  if (null != res1 && !res1.isError) {
    openParameter.value.date = res1.date
    openParameter.value.code = res1.code
    let res = await useRouteApi(canChangeContent, {schemaName: o.data.mode})({code: o.data.code,date: openParameter.value.date})
    if (null != res?.isError  && !res?.isError) {
      if (res.contents.length > 0)
        changeContents.value = changeContents.value.filter(it => res.contents.indexOf(it.value) == -1)
      showOk.value = true
    } else {// 已结账 或者 第一个月
      showOk.value = false
      createWarningModal({
        title: '温馨提示',
        content: `当前资产业务日期【${o.data.date}】固定资产账${res.type != '01' ? '已结账' : '为开始月,不能进行资产变动操作'}！`,
      })
    }
  } else {
    createWarningModal({
      title: '温馨提示',
      content: '固定资产账当前月份已结账不能进行新增操作！'
    })
  }


  setModalProps({minHeight: 360});
});

const openParameter = ref({
  values: [],
  date: '',
  code: '',
})
const {createWarningModal} = useMessage()

async function handleOk() {
  if (openParameter.value.values.length == 0) {
    createWarningModal({title: '温馨提示', content: '变动内容选择至少选择一条！'})
  } else {
    emit('query', unref(openParameter.value));
    closeModal();
    return true;
  }
}

async function handleClose() {
}

const radioChange = (v) => {
  if (v.length > 3) {
    openParameter.value.values = v.slice(0, 3)
    message.info('变动内容选择最多支持三条！')
  } else if (v.indexOf('YJJCZ') != -1) { // 存在净残值时
    let a = ['YZ', 'YJJCZ']
    if (v.length == 3) {
      a.push(v.filter(z => z != 'YJJCZ' && z != 'YZ')[0])
      openParameter.value.values = a
    }
  }
}


</script>
<style src="../../../../../assets/styles/global-open.less" lang="less"></style>
<style lang="less" scoped="scoped">
.nc-query-open-content {
  text-align: center;
  padding: 2% 4%;
  height: 100%;


  :deep(.ant-select-selector), :deep(.ant-picker), .ant-input {
    border: none;
    border-bottom: 1px solid #c9c9c9;
  }

  > div {
    display: inline-block;
    margin-top: 2%;
  }

  .ncqopen-content-left {
    width: 100%;
    padding: 0 30%;

    :deep(.ant-checkbox-wrapper) {
      width: 100%;
      text-align: left;

      .ant-checkbox {
        margin: .5% 0;

        > span {
          border-color: #c9c9c9;
        }
      }
    }
  }
}
</style>
