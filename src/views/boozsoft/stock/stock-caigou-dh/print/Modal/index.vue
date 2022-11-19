<template>
  <BasicModal width="925px"
              v-bind="$attrs"
              :title="''"
              @ok="handleOk()"
              @register="register">
    <template #title>
      <div style="display: flex;" class="vben-basic-title">

        <PrinterFilled :style="{ fontSize: '34px' }"/>

        <span style="line-height: 25px;font-size: 20px;">打印</span>
      </div>
    </template>
    <div>
      <!--- 头 -->
      <div style="display:flex">
        <div>
          <span>打印模版:</span>
          <Select :options="modelOptions" :value="1"/>
          <Button>
            <SettingFilled/>
          </Button>
        </div>
        <div>
          <span>纸张大小:</span>
          <Select v-model:value="formData.paper.size" :options="paperModelOptions"/>
          <Button>
            <SettingFilled/>
          </Button>
        </div>
      </div>
      <div>
        <div class="special-border-div">
          <span>页边距</span>
          <div style="padding:20px">
            <InputGroup compact>
              <Input style="width: 40%">
                <template #addonBefore>
                  左边距:
                </template>
              </Input>
              <Input style="width: 40%">
                <template #addonBefore>
                  右边距:
                </template>
              </Input>
              <Input style="width: 40%">
                <template #addonBefore>
                  上边距:
                </template>
              </Input>
              <Input style="width: 40%">
                <template #addonBefore>
                  下边距:
                </template>
              </Input>
            </InputGroup>
          </div>
        </div>

      </div>
      <Row>
        <Col :span="12">
          <Checkbox :checked="true"/>
          打印单合计
        </Col>
        <Col :span="12">
          <Checkbox :checked="true"/>
          打印页小计
        </Col>
      </Row>
      <PrintTest ref="printTestRef" :style="{ fontSize: '14px' }"/>

    </div>
  </BasicModal>
</template>
<script setup>
import {ref} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal';
import {GenerateDynamicColumn} from "../../component/DynamicForm";
import {JsonTool} from "../../../../../../api/task-api/tools/universal-tools";
import PrintTest from '../index.vue';
import {Select, Checkbox, Col, Row, Input, Button} from "ant-design-vue";


import {PrinterFilled, SettingFilled} from '@ant-design/icons-vue';
import {findStockPrintAllByCcode} from "/@/api/stockPrint";

const InputGroup = Input.Group
const printTestRef = ref()
const [register, {closeModal, setModalProps}] = useModalInner(async (o) => {
  modelOptions.value = getModelOptions()
});

const props = defineProps(['getDataSource', 'getColumns'])

const modelOptions = ref([])
const paperModelOptions = ref([
  {key:1,label:'A4',value:'a4' },
  {key:2,label:'二等分',value:'width14' },
  {key:3,label:'三等分',value:'width9' },
])

const formData=ref({
  // 模版
  model: {
    // 获取列信息
    getColumns:props.getColumns
  },
  paper:{
    size:'a4'
  },
  info:{
    // 打印单合计
    printSum:true,
    // 打印页小记
    printPageLittleSum:true
  }
})

function getModelOptions() {
  return [
    {key: 1, label: '系统模版', value: 1, target: {}},
    {key: 1, label: '自定义模版', value: 1, target: {}},
  ]
}

async function handleOk() {
  const realData = props.getDataSource().filter(it => {
    return Object.keys(it).length > 1
  })
  const result=await findStockPrintAllByCcode({ccode:'caigoudaohuo'})
  const stockPrintBody = result.stockPrintBody
    .map(it => {
      return {dataIndex: it.printNameP, title: it.printName, width: it.printKd}
    })


  formData.value.data=realData
  formData.value.model.columns=stockPrintBody
  printTestRef.value.openPrint(formData)
}
</script>
<style lang="less">
.special-border-div {
  position: relative;
  border: 1px #acabab solid;
  margin: 20px 1%;

  > span {
    position: absolute;
    top: -12px;
    left: 50px;
    font-size: 15px;
    background: white;
    padding: 0 15px;
  }

}
</style>
