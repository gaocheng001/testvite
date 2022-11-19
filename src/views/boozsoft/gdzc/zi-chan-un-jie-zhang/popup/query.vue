<template>
  <BasicModal width="600px"
              v-bind="$attrs"
              :title="''"
              @ok="handleOk()"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <img src="/create.svg" style="width:25px;margin-right: 10px;"/>
        <span style="line-height: 25px;font-size: 16px;">资产盘点</span>
      </div>
    </template>
    <div class="nc-query-open-content">
      <template v-if="nofirst">
        <span style="color: black;font-weight: bold;">盘点截止日期：</span>
        <DatePicker :locale="localeCn" v-model:value="openParameter.expirationDate"
                    placeholder="截止日期"
                    format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 120px"/>
        <br/>
      </template>
      <RadioGroup v-model:value="openParameter.condition.choose" @change="radioChange">
        <Radio value="0"><span style="float:left;">按全部资产盘点：</span>
        </Radio>
        <Radio value="1">
          <span>按资产类别盘点：&emsp;&emsp;</span>
          <Select style="width: 70%" :disabled="openParameter.condition.choose!='1'"
                  :filter-option="filterOption" v-model:value="formItems['1']" mode="multiple">
            <SelectOption v-for="item in assetTypeList" :value="item.uniqueCode"
                          :label="item.ecCode+' '+item.ecName">{{ item.ecCode }} {{ item.ecName }}
            </SelectOption>
          </Select>
        </Radio>
        <Radio value="2">
          <span>按使用部门盘点：&emsp;&emsp;</span>
          <Select style="width: 70%" :disabled="openParameter.condition.choose!='2'"
                  :filter-option="filterOption" v-model:value="formItems['2']" mode="multiple">
            <SelectOption v-for="item in deptList" :value="item.uniqueCode">{{ item.ecName }}
            </SelectOption>
          </Select>
        </Radio>
        <Radio value="3">
          <span>按所属项目盘点：&emsp;&emsp;</span>
          <Select style="width: 70%" :disabled="openParameter.condition.choose!='3'"
                  :filter-option="filterOption" v-model:value="formItems['3']" mode="multiple">
            <SelectOption v-for="item in proList" :value="item.uniqueCode">{{ item.ecName }}
            </SelectOption>
          </Select>
        </Radio>
        <Radio value="4">
          <span>按责任人盘点：&emsp;&emsp;&emsp;</span>
          <Select style="width: 70%" :disabled="openParameter.condition.choose!='4'"
                  :filter-option="filterOption" v-model:value="formItems['4']" mode="multiple">
            <SelectOption v-for="item in psnList" :value="item.uniqueCode">{{ item.ecName }}
            </SelectOption>
          </Select>
        </Radio>
        <Radio value="5">
          <span>按存放位置盘点：&emsp;&emsp;</span>
          <Select style="width: 70%" :disabled="openParameter.condition.choose!='5'"
                  :filter-option="filterOption" v-model:value="formItems['5']" mode="multiple">
            <SelectOption v-for="item in locationList" :value="item.uniqueCode"
                          :label="item.ecName">{{ item.ecName }}
            </SelectOption>
          </Select>
        </Radio>
        <Radio value="6">
          <span>按使用状况盘点：&emsp;&emsp;</span>
          <Select style="width: 70%" :disabled="openParameter.condition.choose!='6'"
                  :filter-option="filterOption" v-model:value="formItems['6']" mode="multiple">
            <SelectOption v-for="item in usageStatusList" :value="item.uniqueCode"
                          :label="item.ecCode+' '+item.ecName">{{ item.ecCode }} {{ item.ecName }}
            </SelectOption>
          </Select>
        </Radio>
      </RadioGroup>
    </div>
  </BasicModal>
</template>
<script setup="props, { content }" lang="ts">
import {ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {hasBlank} from "/@/api/task-api/tast-bus-api";

import {DatePicker, Select, Radio} from 'ant-design-vue';
import {useMessage} from "/@/hooks/web/useMessage";
import {findFaCheckByDate} from "/@/api/fa/fa-pandian";

const RangePicker = DatePicker.RangePicker;
const SelectOption = Select.Option;
const RadioGroup = Radio.Group;

const emit = defineEmits(['register', 'query']);
const formItems: any = ref({});
const assetTypeList = ref([]);
const usageStatusList = ref([]);
const locationList = ref([]);
const deptList = ref([]);
const psnList = ref([]);
const proList = ref([]);

const mUnqieCode = ref('')
const nofirst = ref(true)

const [register, {closeModal, setModalProps}] = useModalInner((o) => {
  // 方式2
  formItems.value = {}
  mUnqieCode.value = o.data.code
  assetTypeList.value = o.data.assetTypeList
  usageStatusList.value = o.data.usageStatusList
  locationList.value = o.data.locationList
  deptList.value = o.data.deptList
  psnList.value = o.data.psnList
  proList.value = o.data.proList

  if (!hasBlank(o.data.date)) {
    nofirst.value = false
    openParameter.value.expirationDate = o.data.date
    openParameter.value.condition.choose = '0'
  }
  setModalProps({minHeight: 360});
});

const openParameter = ref({
  expirationDate: null,
  condition: {
    choose: '0',
    values: null,
  }
})
const {createWarningModal} = useMessage()

async function handleOk() {
  if (hasBlank(openParameter.value.expirationDate)) {
    createWarningModal({title: '温馨提示', content: '请选选择盘点截止日期！'})
  } else if (openParameter.value.condition.choose != '0' && hasBlank(formItems.value[openParameter.value.condition.choose])) {
    createWarningModal({title: '温馨提示', content: '请选选择盘点内容！'})
  } else {
    let e = await findFaCheckByDate({
      code: mUnqieCode.value,
      date: openParameter.value.expirationDate
    })
    if (null == e) {
      createWarningModal({title: '温馨提示', content: '当月未发生，不能进行盘点！'})
    } else if (e.isSettle == '1') {
      createWarningModal({title: '温馨提示', content: '当月已记账，不能进行盘点！'})
    } else {
      openParameter.value.condition.values = formItems.value[openParameter.value.condition.choose] || null
      emit('query', unref(openParameter.value));
      closeModal();
      return true;
    }
  }
}

async function handleClose() {
}

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

const radioChange = (v) => {

}


</script>
<style src="../../../../../assets/styles/global-open.less" lang="less"></style>
<style lang="less" scoped="scoped">
.nc-query-open-content {
  text-align: center;
  padding: 2% 5%;
  height: 100%;


  :deep(.ant-select-selector), :deep(.ant-picker), .ant-input {
    border: none;
    border-bottom: 1px solid #c9c9c9;
  }

  :deep(.ant-radio-wrapper) {
    width: 100%;
    margin: 1% 0;

    > span:nth-of-type(2) {
      width: 100%;

      > span {
        color: #666666;
        font-weight: bold;
      }
    }
  }
}
</style>
