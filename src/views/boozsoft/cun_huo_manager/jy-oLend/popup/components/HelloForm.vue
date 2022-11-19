<template>
  <BasicForm @register="register"  ref="formElRef">

  </BasicForm>
</template>
<script setup>
import {BasicForm, useForm} from "/@/components/Form";
import {inject, watch} from "vue";
const defaultSchemas = [

  {
    field: 'cwhcodeName',
    component: 'Input',
    label: '存储位置：',
    required: true,
    colProps: {
      span: 8,
    }
  },
  {
    field: 'cinvodeName',
    component: 'Input',
    label: '存货名称：',
    required: true,
    colProps: {
      span: 8,
    }
  },
  {
    field: 'stockGgxh',
    component: 'Input',
    label: '规格型号：',
    required: true,
    colProps: {
      span: 8,
    }
  },
  {
    field: 'subQuantity12',
    component: 'Input',
    label: '主数量：',
    required: true,
    colProps: {
      span: 8,
    }
  },
  {
    field: 'cunitidF2',
    component: 'Input',
    label: '数量1：',
    required: true,
    colProps: {
      span: 8,
    }
  },
  {
    field: 'price',
    component: 'Input',
    label: '数量2：',
    required: true,
    colProps: {
      span: 8,
    }
  },


]

const record=inject('record')
watch(record,(e)=>{
  const abc={
    baseQuantity: "111",
    batchId: "111",
    ccode: "111",
    cfree1: "111",
    cfree2: "111",
    cfree3: "111",
    cfree4: "111",
    cfree5: "111",
    cinvode: "111",
    cmemo: "111",
    cwhcode: "111",
    cwhcode1: "111",
    cwhcode2: "111",
    cwhcode3: "111",
    cwhcode4: "111",
    cwhcode5: "111",
    cwhcode6: "111",
    ddate: "111",
    dpdate: "111",
    dvdate: "111",
    id: "111",
    iyear: "111",
    jrjcCcode: "111",
    jrjcDate: "111",
    jrjcFlag: "111",
    jrjcLineId: "111",
    jrjcQuantity: "111",
    key: "3a70099d149e45a2a095a5c71f64883f",
    lineId: "111",
    subQuantity1: "111",
    subQuantity2: "111",
    tenantId: "111",
  }
  console.log(e)

  setFieldsValue(e)
})
const [register, {getFieldsValue, resetFields, setFieldsValue}] = useForm({
  labelWidth: 100,
  /*  actionColOptions: {
      span: 24,
    },*/
  showResetButton: false,
  showSubmitButton: false,
  schemas: defaultSchemas,
  autoFocusFirstItem: false,
});

</script>
<style>

</style>
