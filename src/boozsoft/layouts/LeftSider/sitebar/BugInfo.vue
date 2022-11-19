<template>
  <div>
    <Popover trigger="contextmenu" v-model:visible="visible">
      <div
        @click="visible=!visible"
        style="cursor:pointer;width: 35px;margin-top:10px;margin-left:18px;background:#4a4a4acc;height: 34px;border-radius:10px;padding: 7px 0px 0px 7px;">
        <BugFilled style="color:white;font-size:19px"></BugFilled>
      </div>
      <template #content>
        <div style="width:260px;text-align: center">
          <div style="font-weight: 900">调试信息</div>
          <div style="margin-top:10px;display: flex;justify-content: space-between">
            <span style="color:black">单位：</span>
            <Select size="small" :value="schemaName"
                    style="min-width:160px;max-width: 265px;"
                    @change="changeAdInfo">
              <Option v-for="item in accountList" :value="item.accId">
                {{ item.coCode + ' ' + item.accName }}
              </Option>
            </Select>
          </div>
          <div style="margin-top:10px;display: flex;justify-content: space-between">
            公司唯一码: <input readonly
                          style="background:inherit;border:solid 1px black;cursor: pointer;color:black;width:110px;text-align: center"
                          :value="schemaName"/></div>


          <div style="margin-top:10px;display: flex;justify-content: space-between">
            <div>公司账套名<span style="color:green">[存在]</span>:</div>
            <div>
              <input
                style="background:inherit;cursor: pointer;border:solid 1px black;color:black;width:100px;text-align: center"
                readonly
                :value="schemaName+'-'+date.slice(0,4)"/>

            </div>

          </div>
          <div style="margin-top:10px;display: flex;justify-content: space-between">
            <div>业务日期：</div>
            <div>{{ date }}</div>
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>
<script setup>
import {Select, Button, Popover} from 'ant-design-vue'
import {ReloadOutlined, BugOutlined, BugFilled, BugTwoTone} from '@ant-design/icons-vue';

const Option = Select.Option
import {useCompanyOperateStoreWidthOut} from '/@/store/modules/operate-company';
import {ref, computed} from 'vue';


const closeThis = ref(true)
const accountList = computed(() => useCompanyOperateStoreWidthOut().getAccountList)
const date = computed(() => useCompanyOperateStoreWidthOut().getLoginDate)
const schemaName = computed(() => {
  if (useCompanyOperateStoreWidthOut().getSchemaName == null) {
    const accId = accountList.value[0].accId
    useCompanyOperateStoreWidthOut().commitSchemaName(accId)
    return accId
  } else {
    return useCompanyOperateStoreWidthOut().getSchemaName
  }
})
const changeAdInfo = (accId) => {
  useCompanyOperateStoreWidthOut().commitSchemaName(accId)
  useCompanyOperateStoreWidthOut().commitShowLoginDate(true)
  window.location.reload()
}

const visible = ref(false)
</script>
