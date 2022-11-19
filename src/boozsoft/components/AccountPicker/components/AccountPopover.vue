<template>
  <div style="width:300px;height:300px">
    <div style="text-align: center">
      <span style="font-weight: bold">模糊过滤: &emsp;</span>
      <a-input-search
        @search="fiterTable"
        style="width: 160px;border-radius: 4px"
      />
      <Button size="small" type="primary" :disabled="currentStayCode == ''" @click="modifyDb">默认</Button>
    </div>
    <BasicTable
      :pagination="false"
      :showIndexColumn="false"
      @row-dbClick="handleOk"
      @row-click="x.tableTdClick"
      :rowKey='record=>record.coCode'
      :columns="[
          // {title: '公司代码',dataIndex: 'coCode',width: 80},
          {title: '选择账套',dataIndex: 'accNameCn',width: 200,align: 'left',slots: {customRender: 'accCodeAndNameCn'},
          customHeaderCell: () => {	return {style: {fontWeight: 'bold', color: 'white',backgroundColor: '#1e9378'}} },
          customCell: (o) => {	return {style: {textAlign: 'left',padding: '2px 5px'},className: currentStayCode == o.coCode?'current_show_code':''} }}
      ]"
      :data-source="tableDatasource"
      :scroll="{y: 200} "
      ref="tableRef"
      class="account-popover-table"
      size="small"
    >
      <template #accCodeAndNameCn="{ record }">
        {{record.coCode }}&emsp;{{record.accNameCn }}
      </template>
    </BasicTable>
  </div>
</template>
<script setup="props, {content}" lang="ts">
import {computed, inject, onMounted, ref, unref} from 'vue'
import { BasicTable } from '/@/components/Table'
import {
  Input as AInput,Button,message
} from "ant-design-vue"
import { hasBlank} from "/@/api/task-api/tast-bus-api";
import {useMessage} from "/@/hooks/web/useMessage";
const AInputSearch = AInput.Search
const emit = defineEmits(['register','modify'])

const props=defineProps(['modelValue','visible'])
const tableRef = ref(null)
const tableDatasource = ref([])

const currentStayCode = ref('')

onMounted(()=>{
  tableDatasource.value = props.modelValue

  document.onkeydown = async function (e) {
    if (props.visible){
      if (e.keyCode == 38) { // 上
        stayCodeChange('up')
      }
      if (e.keyCode == 40) { // 下
        stayCodeChange('down')
      }

      if (e.keyCode == 13){
        if (!hasBlank(currentStayCode.value)) await handleOk({coCode:  currentStayCode.value})
      }
    }
  }
})

const x = {
  keyup(e) {
    if (e.keyCode == 38) { // 上
      stayCodeChange('up')
    }
    if (e.keyCode == 40) { // 下
      stayCodeChange('down')
    }
    if (e.keyCode == 13){
      handleOk({coCode:  currentStayCode.value})
    }
  },
  tableTdClick(o){
    currentStayCode.value=o.coCode
  }
}

const stayCodeChange = (type:string) =>{
  let index = tableDatasource.value.findIndex(value => value.coCode == currentStayCode.value)
  if ((type == 'up' && index != 0) || ( type != 'up' && index != (tableDatasource.value.length-1))){
    type == 'up'?index--:index++
    let tCode =  tableDatasource.value[index].coCode
    if (!hasBlank(tCode)) currentStayCode.value = tCode
    // tableRef.value.$el.getElementsByClassName('ant-table-body')[0].autofocus = true
  }
}

const fiterTable = (value) => {
  tableDatasource.value = []
  if(hasBlank(value)){
    tableDatasource.value = props.modelValue
  }else {
    tableDatasource.value = props.modelValue.filter(item=>item.coCode.indexOf(value) != -1 || item.accNameCn.indexOf(value) != -1)
  }
}
const handleOk = async (obj) => {
  emit('modify', unref(obj['coCode']))
  return true
}
const { createConfirm,createWarningModal} = useMessage();
const authorizationDetails = inject('authorizationDetails')
const modifyDb = async () => {

  if (!hasBlank(currentStayCode.value)){
      // 询问是否设为默认
    let accId =   props.modelValue.filter(item=>item.coCode == currentStayCode.value)[0].accId
    if (null != authorizationDetails && authorizationDetails.value.filter(it=>it.accId == accId && it?.defaultLogin == '1').length > 0){
      message.info( `公司代码为【${currentStayCode.value}】的账套已设置为默认登入账套！`)
    }else {
      createConfirm({
        iconType: 'warning',
        title: `默认账套设置`,
        content: `是否将公司代码为【${currentStayCode.value}】的账套设置为默认登入账套？`,
        onOk: async () => {
          let data = {
            coCode: currentStayCode.value,
            userId: ''
          }
          emit('reset', data)
        },
        onCancel: async () => {
        }
      });
    }

  }
}
/*const visibleComp=computed(()=>props.visible)
watch(visibleComp, async (a)=>{
    if (a){
      //let b = tableRef.value.$refs.wrapRef?.childNodes[1]?.getElementsByClassName('ant-table-tbody').click()
    /!*  let b = tableRef.value.$refs.wrapRef?.childNodes[1]?.getElementsByTagName("tr")[4]
      b.cells[0].classList.add('current_show_code')*!/
    }
  }
)*/
</script>
<style scoped>
:deep(.account-popover-table) .current_show_code{
  font-weight: bold;
  /*color: white;*/
  background-color: #b4b5b7;
}
:deep(.account-popover-table) .ant-table-container .ant-table-header th{
  text-align: center!important;
}
</style>
