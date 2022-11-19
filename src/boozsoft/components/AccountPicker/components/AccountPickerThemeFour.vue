<template>
  <div>
    <slot :fun="teleportState.fun" :info="datasourcePicker.params"/>
    <!--  公司代码  -->
    <teleport :to="teleportState.ref.code">
      <Popover v-model:visible="visible" placement="bottomLeft" trigger="contextmenu">
        <Input v-model:value="datasourcePicker.params.coCode" v-on="codeInputEvents"
               class="accountCodeInput">
          <template #suffix>
            <SearchOutlined @click="codeInputEvents.openSearchPage"/>
          </template>
        </Input>
        <template #content>
          <AccountPopover v-model="authorizedList" :visible="visible"
                          @modify="codeInputEvents.coInfoChange"
                          @reset="codeInputEvents.setDefaultCode"/>
        </template>
      </Popover>
    </teleport>

    <!--  公司名称  -->
    <teleport :to="teleportState.ref.name">
      <NameText :len="16">{{ datasourcePicker.params.companyName }}</NameText>
    </teleport>
    <teleport :to="teleportState.ref.year">
      <Select class="thisDateSelect"
              :options="yearList.map(it=>({value:it,label:it}))"
              v-model:value="datasourcePicker.params.iyear"
              @change="yearSelectChange('year')">
        <template #suffixIcon>
          <CalendarOutlined/>
        </template>
      </Select>
    </teleport>
  </div>
</template>
<script setup>
import {onMounted, ref, provide} from 'vue';
import NameText from './NameText.vue'
import AccountPopover from "./AccountPopover.vue";
import {useUserStore} from "/@/store/modules/user";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useMessage} from "/@/hooks/web/useMessage";
import {message, Input, Popover, Select} from "ant-design-vue";
import {SearchOutlined, CalendarOutlined} from '@ant-design/icons-vue';
import {
  filterAccListByAuth,
  useAccountPickerModel,
  useDatasourcePicker
} from "../utils/accountUtils";
import {
  getAllAccAuths, getFixedAssetsModel,
  resetDefaultAccount
} from "../../../../api/record/system/financial-settings";
import {findDataBase1} from "../../../../api/record/system/account";
import {
  useAccountPickerCache
} from "../../../../store/modules/boozsoft/components/AccountPicker/cache";
import {
  findAssetsDate,
  findByAuthAssetsByUniqueCode,
} from "../../../../api/record/group/im-unit";
import {object} from "vue-types";
import {JsonTool} from "../../../../api/task-api/tools/universal-tools";

const {createWarningModal} = useMessage();
const userStore = useUserStore();

const emit = defineEmits(['reloadTable'])

const datasourcePicker = useDatasourcePicker()


// 公司代码、公司名称、资产账年度的穿梭门 start
const teleportState = ref({
  ref: {
    code: ref(document.createElement('div')),
    name: ref(document.createElement('div')),
    year: ref(document.createElement('div'))
  },
  fun: {
    one: (e) => {
      teleportState.value.ref.code = e
    },
    two: (e) => {
      teleportState.value.ref.name = e
    },
    three: (e) => {
      teleportState.value.ref.year = e
    },
  }
})

const visible = ref(false)

// 所以账套授权详细列表
const authorizationDetails = ref([])
// 已授权存货管理账套列表
const authorizedList = ref([])
const fixedAssetsList = ref([])
// 存货管理对应所有年度
const yearList = ref([])
provide('authorizationDetails', authorizationDetails)

const {resetParams} = useAccountPickerModel(datasourcePicker, authorizationDetails, yearList)

const codeInputEvents = {
  keydown(e) {
    switch (e.key) {
      case (' '):
        codeInputEvents.openSearchPage(e)
        e.preventDefault()
        break
    }
  },
  async keyup(e) {
    switch (e.key) {
      case ('Enter'):
        if (datasourcePicker.value.params.coCode == datasourcePicker.value.params.target.coCode) return
        const coInfo = authorizedList.value.filter(item => item.coCode === e.target.value)[0]

        if (!coInfo) {
          createWarningModal({title: '温馨提示', content: '当前账套代码系统不存在或已停用！'})
          return
        }

        // await resetParams({coInfo})
        let a = {coCode: e.target.value}

        await datasourcePicker.value.resetParams(await getGdzcParameter(a))
        e.target.select()

        emitReloadTable()
        break
    }
  },
  focus: (e) => e.target.select(),
  blur() {
    datasourcePicker.value.params.coCode = datasourcePicker.value.params.target.coCode
  },
  openSearchPage(e) {
    // var e = window.event || event;
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      window.event.returnValue = false;
    }
    visible.value = !visible.value
  },
  // 弹框选择回调
  async coInfoChange(coCode) {
    //await resetParams({coInfo: authorizedList.value.filter(item => item.coCode === coCode)[0]})
    visible.value = false
    if (coCode == datasourcePicker.value.params.target.coCode) return
    let e = {coCode: coCode}
    await datasourcePicker.value.resetParams(await getGdzcParameter(e))
    emitReloadTable()
  },
  // 设置默认登入code
  async setDefaultCode(data) {
    data['userId'] = userStore.getUserInfo.id
    resetDefaultAccount(data)
      .then(() => message.success('默认登入账套设置成功！'))
      .catch(() => message.error('默认登入账套设置失败,请稍候再试!'))
  }
}

async function yearSelectChange(type) {
  debugger
  let e = datasourcePicker.value.params
  // e.managementYearInfo = await findAssetsDate({code: e.managementCode,iyear: e.year})
  datasourcePicker.value.resetParams(e)
  datasourcePicker.value.enable = false
  emitReloadTable()
}


function initZcList(res) {
  if (yearList.value.length == 0 && res != null) {
      let obj =  fixedAssetsList.value.filter(it=>it.coCode == res.coCode) [0]
      yearList.value = obj.yearList
  }
}

// 切换账套后更新存货管理账与年
async function getGdzcParameter(e) {
  if (null != e && null != e.coCode) {
    let thisCoInfo =  fixedAssetsList.value.filter(it=>it.coCode == e.coCode) [0]
    e.target = thisCoInfo
    e.accId = thisCoInfo.accId
    e.coCode = thisCoInfo.coCode
    e.companyName = thisCoInfo.accNameCn
    e.baseName = thisCoInfo.accNameCn
    yearList.value = thisCoInfo.yearList
    e.iyear = yearList.value[yearList.value.length - 1]
    e.year = e.iyear
    e.accountMode = (await findDataBase1(thisCoInfo.coCode, e.iyear)).accountMode
    e.datasource = {}
    e.datasource.schemaName = e.accountMode
  }
  return e;
}

const companyOperateStore = useCompanyOperateStoreWidthOut()

onMounted(async () => {
  // 获取已授权存货管理账套
  authorizedList.value = companyOperateStore.getAllAuthorizeAccountList
  fixedAssetsList.value = authorizedList.value

  // 获取缓存的账套信息
  const accountPickerInfoCacheParams = useAccountPickerCache().get()
  if (accountPickerInfoCacheParams?.target?.ztStyle != null) {
    await datasourcePicker.value.resetParams(accountPickerInfoCacheParams)
    null !=  accountPickerInfoCacheParams?.target && initZcList(accountPickerInfoCacheParams?.target)
  } else {
   let arr = authorizedList.value.filter(it=>(null != it.defaultLogin && it.defaultLogin == '1') || it.coCode=='101')
    let e = {'coCode': arr.length == 0 ?authorizedList.value[0].coCode:arr[0].coCode}
    await datasourcePicker.value.resetParams(await getGdzcParameter(e))
  }
  emitReloadTable()
})

function emitReloadTable() {
  emit('reloadTable', datasourcePicker.value.getParams())
}
</script>
<style lang="less" scoped>
@import '/@/boozsoft/components/AccountPicker/styles/account-theme-one.less';
</style>
