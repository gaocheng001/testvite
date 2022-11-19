<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    title=""
    @ok="handleOk()"
    @register="register"
    :showOkBtn="showNext"
    okText="开始导入"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <CloudUploadOutlined style="font-size: 50px;color: #0096c7;"/>
        <span style="line-height:50px;font-size: 30px;color: #0096c7;">&ensp;数据导入</span>
      </div>
    </template>
    <div class="nc-open-content">
      <div class="open-content-up" style="height: 400px;margin-left: 5%;width:90%;">
        <div class="open-content-up-one">
          <div>
            <img src="/@/assets/images/import.png" draggable="false" style="height:140px;margin: 10px 0"/>
          </div>
          <div>
            <label>导入内容：</label><span style="display: inline-flex;width: 60%; font-weight: bold;">操作员</span>
            <Button size="small" style="color: #3eadbe;margin-left: 2%">查看帮助</Button>&emsp;<EllipsisOutlined style="cursor: pointer"/>
            <br/>
            <label>模板样式：</label><a-select style="width: 50%;margin-right: 10%;" :value="0">
            <a-select-option :value="0">系统标准模板</a-select-option>
            </a-select>
            <DownloadOutlined  style="font-size: 28px;margin: 0 2%" @click="exportExcel()"/><a @click="exportExcel()">模板下载</a>
          </div>
        </div>

        <Tabs @change="fileList = []" v-model:activeKey="excelValue" type="card">
          <TabPane :key="1" tab="全新添加导入"></TabPane>
          <TabPane :key="2" tab="字段覆盖导入"></TabPane>
        </Tabs>
        <div style="margin-left: 40px;margin-top: 30px;">
          <ImpExcel v-if="isActiveImpExcel" @success="loadDataSuccess">
            <a-button class="m-3"> 导入Excel</a-button>
          </ImpExcel>
        </div>
        <br>
      </div>
    </div>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {inject, nextTick, ref, unref} from 'vue'
import {BasicModal, useModalInner} from '/@/components/Modal'
import {ImpExcel} from "/@/views/boozsoft/global/importexcel";
import {Select as ASelect, Input as AInput, Radio as ARadio,Button,Tabs} from 'ant-design-vue'

const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const ARadioGroup = ARadio.Group
const TabPane = Tabs.TabPane
import {useMessage} from "/@/hooks/web/useMessage";
// import {aoaToSheetXlsx} from "/@/views/boozsoft/xian_jin_liu_liang/yin_hang_dui_zhang/yin_hang_dui_zhang_dan/excel/components/importexcel";
const aoaToSheetXlsx=null
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {DateTool, JsonTool, StrTool} from "/@/api/task-api/tools/universal-tools";
import {checkUser, checkUserList, saveUser, saveUserList} from "/@/api/caozuoyuan/caozuoyuan";
import { CloudUploadOutlined,EllipsisOutlined,DownloadOutlined} from '@ant-design/icons-vue';
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {saveLog} from "/@/api/record/system/group-sys-login-log";
const {
  createErrorModal,createInfoModal
} = useMessage()

const formItems: any = ref({})
const excelValue: any = ref(1)

const emit = defineEmits(['register', 'reload'])
const isActiveImpExcel = ref(false)
const showNext = ref(true)
const list: any = ref([])
const roleList = inject('roleList'); //消费者
const pwdList = inject('pwdList'); //消费者
function loadDataSuccess(excelDataList) {
  // 将解析后的数据存入集合
  list.value = []
  const items = excelDataList[0].results
  for (let i = 0; i < items.length; i++) {
    list.value.push(items[i])
  }
}

//导入时判断日期、借贷方、结算方式
let msg = ''

async function checkExcel() {
  msg = ''
  if (list.value.length == 0){
    msg = '请检查导入的表格是否为空！'
    return false
  }
  let checkUserNames = []
  let checkPhones = []
  let checkEmails = []
  for (let i = 0; i < list.value.length; i++) {
    const item = list.value[i];
    const realName = item['操作员姓名']
    if (realName == null || realName == '') {
      msg = "第" + (i + 1) + '行操作员姓名为必填项,不能进行操作员导入'
      return false
    }

    const username = item['登录账户']  || ''
    if (username == null || username == '') {
      msg = "第" + (i + 1) + '行登录账户为必填项,不能进行操作员导入'
      return false
    }else{
      checkUserNames.push(username.trim())
    }
    const beiyong5 = item['所属角色']  || ''
    let thisRoles = []
    if (beiyong5 == null || beiyong5 == '') {
      item['所属角色'] = '500'
   /*   msg = "第" + (i + 1) + '行所属角色为必填项,不能进行操作员导入'
      return false*/
    }else{
      thisRoles = roleResolve(beiyong5)
      if (thisRoles.length == 0){
        item['所属角色'] = '500'
       /* msg = "第" + (i + 1) + '行所属角色系统不存在,不能进行操作员导入'
        return false*/
      }
    }
    let policyModel  = null
    const pwdPolicy = item['密码策略']  || ''
    if (pwdPolicy == null || pwdPolicy == '') {
      msg = "第" + (i + 1) + '行密码策略为必填项,不能进行操作员导入'
      return false
    }else {
      policyModel = policyChange(pwdPolicy)
      if (null == policyModel){
        msg = "第" + (i + 1) + '行密码策略系统不存在,不能进行操作员导入'
        return false
      }
    }
    const phone = item['手机号'] || ''
    if (phone != null && phone != '') {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (phone != '' && (!reg.test(phone))) {
        msg = "第" + (i + 1) + '行手机号请输入正确的格式,不能进行操作员导入'
        return false
      }
      checkPhones.push(phone)
    }
    const email = item['电子邮箱']  || ''
    if (email != null && email != '') {
      const reg = /^\w{3,15}\@\w+\.[a-z]{2,3}$/;
      if (email != '' && (!reg.test(email))) {
        msg = "第" + (i + 1) + '行电子邮箱请输入正确的格式,不能进行操作员导入'
        return false
      }
      checkEmails.push(email)
    }
    const effectiveDate = item['生效日期'] || ''
    let invalidDate = ''
    if (policyModel.pwdLock == '1'){
      if (hasBlank(effectiveDate)){
        msg = "第" + (i + 1) + '行根据当前策略生效日期为必填项,不能进行操作员导入'
        return false
      }else {
        let longV = (24 * 60 * 60 * 1000) * (policyModel.pwdValidity + 1)
        invalidDate = DateTool().offsetToStr(new Date(effectiveDate), longV).substring(0, 10)
      }
    }
    const password = ruleGeneration(policyModel)
    let newItem = {}
    newItem['realName'] = realName
    newItem['username'] = username
    newItem['beiyong5'] = JsonTool.json(thisRoles)
    newItem['phone'] = phone+''
    newItem['email'] = email
    newItem['pwdPolicy'] = policyModel.id
    newItem['effectiveDate'] = effectiveDate
    newItem['invalidDate'] = invalidDate
    newItem['password'] = password
    newItem['flag'] = '1'
    list.value[i] = newItem
  }
  // 校验 账户 与 手机号
  if (checkUserNames.length > 0){
    let data = {
      username: JsonTool.json(checkUserNames),
      type: 'username'
    }
    let res = await checkUserList(data)
    if (null != res && !res.pass) {
      msg = res.msg
      return false
    }
  }

  if (checkPhones.length > 0){
    let data = {
      phone: JsonTool.json(checkPhones),
      type: 'phone'
    }
    let res = await checkUserList(data)
    if (null != res && !res.pass) {
      msg = res.msg
      return false
    }
  }
  // checkEmails
  return false
}

const policyChange = (value) => {
  let arr = pwdList.value.filter(item => item.pwdName == value)
  if (arr.length > 0){
    return arr[0]
  }
  return null
}
const ruleGeneration = (rule) => {
  return StrTool.randomPassword(rule.pwdLength)
}

const roleResolve = (value) => {
  let roles = value.indexOf(',') != -1?value.join(','):[value]
  let arr = roleList.value.filter(item => roles.indexOf(item.roleName) != -1).map(item=>item.id)
  if (arr.length > 0){
    return arr
  }
  return []
}

const [register, {closeModal}] = useModalInner((data) => {
  isActiveImpExcel.value = false
  nextTick(() => {
    isActiveImpExcel.value = true
  })
})

async function handleOk() {
  await checkExcel()
  showNext.value = false
  if (msg == '') {
    await saveUserList(unref(list)).then(async (list) => {
      createInfoModal({title: '温馨提示', content: '操作员已完成导入！'})
      if (null != list && list.length > 0){
        /************** 记录操作日志 ****************/
        let map = {
          loginTime: new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " "),
          userId: useUserStoreWidthOut().getUserInfo.username,
          userName: useUserStoreWidthOut().getUserInfo.realName,
          optModule: 'group',
          optFunction: '操作员',
          optRange: '2',
          uniqueCode: '',
          optAction: '导入',
          optContent:  '【操作员】批量导入 操作员账户名【' + list.map(it=>it.username).join(',') + '】,操作员名称【' + list.map(it=>it.realName).join(',')  + '】',
        }
        await saveLog(map)
      }
    }).catch(() => {
      createInfoModal({title: '温馨提示', content: '操作员导入失败！'})
    }).finally(() => {
      closeModal()
      emit('reload')
    })
    showNext.value = true
    return true
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '导入失败',
      content: msg
    })
    showNext.value = true
    return false
  }
}

const columnList = ref(['操作员姓名', '登录账户', '所属角色', '手机号', '电子邮箱', '密码策略', '生效日期'/*,'失效日期','状态'*/])

//下载导入模板
function exportExcel() {
  const arrHeader = columnList.value
  // 保证data顺序与header一致
  aoaToSheetXlsx({
    data: [],
    header: arrHeader,
    filename: 'NC操作员导入模板.xlsx',
  });
}

// 下划线转换驼峰
function toHump(name: any) {
  return name.replace(/\_(\w)/g, function (all: any, letter: any) {
    return letter.toUpperCase();
  });
}

//判断是否整数
function isInteger(obj) {
  return obj % 1 === 0
}
</script>
<style lang="less" scoped>
@import '/@/assets/styles/part-open.less';
.nc-open-content {
  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
  }
  :deep(.ant-tabs-tab-active){
    border-top: 2px solid #0096c7;
  }
  .open-content-up-one{
    height: 200px;
    width: 100%;
    display: inline-flex;
    margin-top: 15px;

    >div:nth-of-type(1){
      width: 25%;
      height: 100%;
    }
    >div:nth-of-type(2){
      width: 75%;
      height: 100%;
      padding: 2% 2%;
      font-size: 14px;
      label {
        text-align: right;
        width: 110px;
        display: inline-block;
        padding: 20px 10px;
        font-weight: bold;
        color: #666666;
      }
    }
  }
}
</style>
