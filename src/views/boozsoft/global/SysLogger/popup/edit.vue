<template>
  <BasicModal @register="register" title="档案编辑页"
              destroyOnClose
              :canFullscreen="true"
              :ok-text="'保存'"
              :closeFunc="handleClose"
              @ok="handleOk()"
              v-bind="$attrs"
              width="940px"
  >
    <div style="height: 500px">
      <BasicForm @register="registerForm"/>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import {inject, nextTick, ref} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal'
import {useMessage} from "/@/hooks/web/useMessage";
import {BasicForm, useForm} from '/@/components/Form/index'

const {createMessage} = useMessage();
const emit = defineEmits(['register', 'save'])
const isLook = ref(true)

const recordData = inject(['recordData'])
const [registerForm, {
  getFieldsValue,
  setFieldsValue,
  updateSchema,
  resetFields,
  validate
}] = useForm({
  labelWidth: 100,
  schemas: recordData.value.columns.map(item => {
    return {
      field: item.field,
      label: item.label,
      component: 'Input',
    }
  }),
  showActionButtonGroup: false,
  actionColOptions: {
    span: 23
  }
})

function defineRecordEditor() {
  const editorPreData = ref({})
  const [register, {closeModal, setModalProps}] = useModalInner(params => {
    if (params == 2) {
      resetFields()
    } else {
      editorPreData.value = params.params
      setFieldsValue(editorPreData.value)
    }
    // params.params
  })
  return [register, {
    closeModal,
    setModalProps,
    editorPreData,
    handleOk() {
      emit('save', [getFieldsValue(), {editorPreData}])
      closeModal()
    },
    handleClose() {
      return true
    }
  }]
}

const [register, {
  closeModal,
  setModalProps,
  editorPreData,
  handleOk,
  handleClose
}] = defineRecordEditor()


</script>
