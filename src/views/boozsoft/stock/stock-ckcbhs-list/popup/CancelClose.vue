<template>
  <BasicModal
    width="900px"
    class="spaceLogo"
    v-bind="$attrs"
    title="取消结账"
    @ok="handleOk()"
    @cancel="handleClose()"
    ok-text="确定取消"
    cancel-text="放弃"
    :canFullscreen="false"
    @register="register"
  >
    <div class="nc-open-content">
      <div style="padding: 1% 0% 2%">
        <AccountPicker v-if="aShow" theme="one" @reloadTable="dynamicAdReload"/>
      </div>
      <div>
        <BasicTable
          :row-selection="{ type: 'radio',selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          :dataSource="tableDatas"
          class="alone-basic-table"
          :rowKey="r=>r.id"
          :pagination="{
          pageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: [ '20', '50', '100'],
          showTotal: t => `总共${t}条数据`
        }"
          :columns="[{
                      title: '期间',
                      dataIndex: 'iperiodNum',
                      width:80
                    },
    {
      title: '开始日期',
       dataIndex: 'dateStart',
      width:  120
    },{
      title: '结束日期',
         dataIndex: 'dateEnd',
      width:  120
    },{
      title: '状态',
      dataIndex: 'gl',
      slots: { customRender: 'gl' },
      width: 100
    },{
      title: '结账操作员',
      dataIndex: 'glUser',
      width: 120
    },{
      title: '结账时间',
      dataIndex: 'glTime',
      width: 150
    }]"
          :loading="loadMark"
        >
          <template #gl="{ text, record }">
            <Tag color="#87d068" v-if="text == '1'">已结账</Tag>
            <Tag color="#f50" v-else>未结账</Tag>
          </template>
        </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {ref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {useTabs} from '/@/hooks/web/useTabs';
import router from "/@/router";
import {
  closeBill,
  currentAccountTypes, findCloseList,
} from "/@/api/record/system/financial-settings";
import {useUserStore} from "/@/store/modules/user";
import {message, Tag} from "ant-design-vue";
const {closeCurrent} = useTabs(router);
const emit = defineEmits(['register', 'save'])
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import BasicTable from "/@/components/Table/src/BasicTable.vue";
import {useMessage} from "/@/hooks/web/useMessage";

const userStore = useUserStore();
const formItems: any = ref({})
let changeBeforeModel: any = {}
const aShow = ref(false)
const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  formItems.value = data
  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  setModalProps({minHeight: 500});
  dynamicTenantId.value = data.schemaName
  dynamicAccId.value = data.schemaName.substring(0,data.schemaName.length-5)
  dynamicYear.value = data.year
  await Change()
})

const tableDatas =  ref([])
const tableSelectedRowKeys = ref([])
const loadMark = ref(false)

const dynamicTenantId = ref('')
const dynamicAccId = ref('')
const dynamicYear = ref('')
const dynamicAdReload = async(e) => {
  dynamicTenantId.value = e.accountMode
  dynamicAccId.value = e.accId
  dynamicYear.value = e.iyear
  await Change()
}
const onSelectChange = (k) => {
 /* let list = JsonTool.parseProxy(tableDatas.value)
  let arr = list.filter(it=>it.gl == '1').map(it=>it.id)
  if (arr.indexOf(k[0]) == -1 || arr[arr.length-1] != k[0]){
    tableSelectedRowKeys.value = []
  }else{
    tableSelectedRowKeys.value = k
  }*/
    tableSelectedRowKeys.value = k
}
const Change =async () => {
  loadMark.value = true
  let res = await findCloseList({accId: dynamicAccId.value,year: dynamicYear.value})
  if (null != res && res.length > 0){
    tableDatas.value = res
  }
  loadMark.value = false
}


let isChanged: boolean = false
const {createWarningModal} = useMessage();
async function handleOk() {
  if (tableSelectedRowKeys.value.length  == 1){
    let arr = tableDatas.value.filter(it=>it.gl == '1') || []
    if (arr.length > 0 && arr[arr.length-1].id == tableSelectedRowKeys.value[0]){
      let e = await closeBill({
        id: tableSelectedRowKeys.value[0],
        accId: dynamicAccId.value,
        operator: userStore.getUserInfo.realName
      })
      setTimeout(async () => {
        if (null != e) {
          message.success('已成功完成取消结账')
          await Change()
          tableSelectedRowKeys.value = []
        }
      }, 1000)
    }else {
      createWarningModal({title: '开始操作前检测', content: '期间【'+arr[arr.length-1].iperiodNum+'】还未进行取消结账操作！'})
    }
  }else {
    createWarningModal({title: '开始操作前检测', content: '请选择最近可取消结账期间！'})
  }
  return true
}

async function handleClose() {
  closeModal()
  return true;
}
</script>
<style  lang="less" scoped>
@import '/@/assets/styles/alone-basic-table.less';
</style>
