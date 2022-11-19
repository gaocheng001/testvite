<template>
  <BasicModal
    width="900px"
    :title="'操作员'+(activeKey == '2'?'修改密码':activeKey == '3'?'操作日志':'个人信息')"
    :loading="modelLoadIng"
    :showOkBtn="false"
    :cancel-text="'关闭'"
    :canFullscreen="false"
    @register="register"
  >
    <div class="nc-open-content">
      <Tabs type="card" :tabBarGutter="1" v-model:activeKey="activeKey" tabPosition="left">
        <TabPane :key="1" :style="activeKey=='1'?{height: (windowHeight)+'px',overflowY: 'auto'}:{}"
                 tab="个人信息">
          <div class="tabpane-top">
            <Button class="ant-btn-me" v-if="isEdit[1]" @click="handleOk(1)">保存</Button>
            <Button class="ant-btn-me" v-if="!isEdit[1]" @click="isEdit[1] = true">修改</Button>
          </div>
          <div class="tabpane-bottom">
            <div class="border-div">
              <span>系统信息</span>
              <div>
                <span>登录账号：</span><Input :value="formItems.username"
                                         style="pointer-events: none;"/>
                <LockOutlined/>
                <br>
                <span>所属角色：</span><Input :value="nameAndRole.roleName"
                                         style="pointer-events: none;"/>
                <LockOutlined/>
                <br>
                <span>生效日期：</span><Input :value="formItems.effectiveDate"
                                         style="pointer-events: none;"/>
                <LockOutlined/>
                <br>
                <span>密码策略：</span><Input :value=" formatPwdLength(formItems.pwdPolicy, 'pwdName')"
                                         style="pointer-events: none;"/>
                <LockOutlined/>
                <br>
              </div>
            </div>
            <div class="border-div">
              <span>个人信息</span>
              <div>
                <span>姓名：&emsp;</span><Input v-model:value="formItems.realName"
                                             :style="!isEdit[1]?{pointerEvents: 'none'}:{}"/>
                <FormOutlined/>
                <br>
                <span>手机号：</span><Input v-model:value="formItems.phone" @blur="checkPhone()"
                                        :style="!isEdit[1]?{pointerEvents: 'none'}:{}"/>
                <FormOutlined/>
                <br>
                <span>邮箱：&emsp;</span><Input v-model:value="formItems.email" @blur="checkMail()"
                                             :style="!isEdit[1]?{pointerEvents: 'none'}:{}"/>
                <FormOutlined/>
                <br>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane :key="2" :style="activeKey=='2'?{height: (windowHeight)+'px',overflowY: 'auto'}:{}"
                 tab="修改密码">
          <div class="tabpane-top">
            <Button class="ant-btn-me" v-if="isEdit[2]" @click="isEdit[2] = false,handleOk(2)">保存
            </Button>
            <Button class="ant-btn-me" v-if="!isEdit[2]" @click="isEdit[2] = true">修改</Button>
          </div>
          <div class="tabpane-bottom">
            <div class="border-div">
              <span>密码策略</span>
              <div><label>密码最小长度：&emsp;&emsp;</label>
                <Input :value="policyModel != null?policyModel.pwdLength:'无'" style="pointer-events: none;width: 42%;text-align: center;"/>
                <LockOutlined/>
                <br/>
                <label>强制包含大写字母：</label>
                <Input :value="policyModel != null?policyModel.pwdUpperCase=='1'?'是':'否':'无'" style="pointer-events: none;width: 42%;text-align: center;"/>
                <LockOutlined/>
                <br/>
                <label>强制包含特殊字符：</label>
                <Input :value="policyModel != null?policyModel.pwdTe=='1'?'是':'否':'无'" style="pointer-events: none;width: 42%;text-align: center;"/>
                <LockOutlined/>
              </div>
            </div>
            <div class="border-div">
              <span>修改密码</span>
              <div><label>旧密码：&emsp;&emsp;</label>
                <InputPassword :value="formItems.password" style="pointer-events: none"/>
                <FormOutlined/>
                <br/>
                <label>新密码：&emsp;&emsp;</label>
                <InputPassword v-model:value="passwordModel.password1" ref="focus7"
                               @blur="checkPwd(passwordModel.password1,'1')"
                               :style="!isEdit[2]?{pointerEvents: 'none'}:{}"/>
                <FormOutlined/>
                <br/>
                <label>确认新密码：</label>
                <InputPassword v-model:value="passwordModel.password2" ref="focus8"
                               @blur="checkPwd(passwordModel.password2,'2')"
                               :style="!isEdit[2]?{pointerEvents: 'none'}:{}"/>
                <FormOutlined/>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane :key="3" :style="activeKey=='3'?{height:(windowHeight)+'px',overflowY: 'auto'}:{}"
                 tab="操作日志">
          <div class="tabpane-top" style="text-align: center">
            <span>日志区间：</span><DatePickerRangePicker v-model:value="logParm.interval" @change="rangeChange" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD"/>
          </div>
          <div class="tabpane-bottom">
            <BasicTable @register="registerTable" @change="tableReload" v-if="activeKey==3" :class="'a-table-font-size-12'">
              <template #logMethod="{ record }">
                <Tag :color="funType(record.logMethod,'color')">
                  {{ funType(record.logMethod,'text') }}</Tag>
              </template>
            </BasicTable>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {ref, onMounted,inject} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal';
import {
  DatePicker,
  Select as ASelect,
  Input,
  Checkbox as ACheckbox,
  Tabs, Button,Tag
} from "ant-design-vue";

const DatePickerRangePicker = DatePicker.RangePicker
const ASelectOption = ASelect.Option
const InputSearch = Input.Search
const InputPassword = Input.Password
const ACheckboxGroup = ACheckbox.Group
const TabPane = Tabs.TabPane
import {LockOutlined, FormOutlined} from '@ant-design/icons-vue';
import {useUserStore} from "/@/store/modules/user";
import {findAll as findAllPassword} from "/@/api/record/pwd-rule/data";
import {checkUser, findAllById, saveUser} from "/@/api/caozuoyuan/caozuoyuan";
import {getAllRoleList as findAllRoles} from "/@/api/sys/system";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {useMessage} from "/@/hooks/web/useMessage";
import {JsonTool, StrTool,DateTool} from "/@/api/task-api/tools/universal-tools";
import {BasicTable, useTable} from "/@/components/Table";
import {findInterval, serveDate} from "/@/api/record/log";
import moment from "moment";

const userStore = useUserStore();
const {createWarningModal, createInfoModal} = useMessage();
const emit = defineEmits(['register', 'save'])

const windowHeight = /*(document.documentElement.clientHeight - 280)*/560

const modelLoadIng: any = ref(false)
const activeKey = ref(1)
const formModel = {
  username: '',
  beiyong5: '',
  effectiveDate: '',
  pwdPolicy: '',
  realName: '',
  phone: '',
  email: '',
  password: '',
}
const formItems: any = ref(formModel)
const thisLoginInfo = ref(null)

const nameAndRole = inject('nameAndRole')
const pwdList = ref([])
const roleList = ref([])
const isEdit = ref({1: false, 2: false, 3: false})


onMounted(async () => {
  pwdList.value = await findAllPassword()
  if (roleList.value.length == 0) await loadDbRoldData()
  thisLoginInfo.value = await findAllById({'userId': userStore.getUserInfo.id})
  nameAndRole.value.realName = thisLoginInfo.value.realName
  nameAndRole.value.roleName = formatUserType(thisLoginInfo.value.beiyong5)
  nameAndRole.value.mail = thisLoginInfo.value?.email
})

const [register, {closeModal, setModalProps}] = useModalInner(async (data) => {
  activeKey.value = data.index
  restForm()
  formItems.value = thisLoginInfo.value != null ? JsonTool.parseProxy(thisLoginInfo.value) : userStore.getUserInfo
  // 根据ID获取数据数据
  if (data.index == 1) {

  } else if (data.index == 2) {
    if (pwdList.value.length == 0) pwdList.value = await findAllPassword()
    if (!hasBlank(formItems.value.pwdPolicy)) policyChange(formItems.value.pwdPolicy)
  } else if (data.index == 3) {
    // 获取当前服务器时间
    let dateTime = await serveDate()
    let lastDay =  DateTool().getLastDay(parseInt(dateTime.substring(0,4)),parseInt(dateTime.substring(5,7)))
    logParm.value.interval = [dateTime.substring(0,7)+'-01',dateTime.substring(0,7)+'-'+(lastDay>9?lastDay:"0"+lastDay)]
    await tableReload()
  }
  //setModalProps({minHeight: 400});
})

function restForm() {
  passwordModel.value.password1 = ''
  passwordModel.value.password2 = ''
}

let isChanged: boolean = false

async function handleOk(type) {
  if (type == 1) {
    formItems.value.realName = formItems.value.realName.trim()
    isChanged = !(formItems.value.realName == thisLoginInfo.value.realName &&
      formItems.value.phone == thisLoginInfo.value.phone &&
      formItems.value.email == thisLoginInfo.value.email)
  } else if (type == 2) {
    isChanged = (passwordModel.value.password1 != '' || passwordModel.value.password2 != '')
  } else if (type == 3) {
  }
  if (!isChanged) {
    createInfoModal({title: '温馨提醒', content: "暂未无变化！"});
    return false;
  } else if (type == 1 && hasBlank(formItems.value.realName)) {
    createInfoModal({title: '温馨提醒', content: "操作员姓名必填项！"});
  } else if (type == 2 && policyModel.value.pwdLength > 0 && (hasBlank(passwordModel.value.password2) || hasBlank(passwordModel.value.password1))) {
    createWarningModal({title: '温馨提醒', content: "新密码为必填项！"});
  } else if (type == 2 && passwordModel.value.password2 != passwordModel.value.password1) {
    createWarningModal({title: '温馨提醒', content: "两次密码不一致！"});
  } else if (type == 2 && passwordModel.value.password1 == formItems.value.password) {
    createWarningModal({title: '温馨提醒', content: "新旧密码不得一致！"});
  } else {
    formItems.value.roleList = JsonTool.parseObj(formItems.value.beiyong5)
    formItems.value.beiyong5 = null
    formItems.value.beiyong4 = '1'
    if (type == 2) formItems.value.password = passwordModel.value.password1
    await saveUser(formItems.value).then(() => {
      createInfoModal({title: '温馨提示', content: '修改成功！'})
      closeModal()
    }).catch(() => {
      createInfoModal({title: '温馨提示', content: '修改失败！'})
    }).finally(() => {
      isEdit.value[type] = false
    })
  }
  return true
}

/********************* 修改信息 ************************/
async function checkPhone(value) {
  value = formItems.value.phone.trim()
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (value != '' && (!reg.test(value))) {
    formItems.value.phone = ''
    createWarningModal({title: '温馨提醒', content: "请输入正确的手机号"});
  } else if (value != '' && thisLoginInfo.value.phone != value) {
    let data = {
      id: thisLoginInfo.value.id || null,
      phone: value,
      type: 'phone'
    }
    await checkOperator(data)
  }
}

async function checkMail(value) {
  value = formItems.value.email.trim()
  const reg = /^\w{3,15}\@\w+\.[a-z]{2,3}$/;
  if (value != '' && (!reg.test(value))) {
    formItems.value.email = ''
    createWarningModal({content: "请输入正确的邮箱"});
  } else if (value != '' && thisLoginInfo.value.email != value) {
    let data = {
      id: thisLoginInfo.value.id || null,
      email: value,
      type: 'email'
    }
    await checkOperator(data)
  }
}

async function checkOperator(data) {
  let res = await checkUser(data)
  if (null != res && !res.pass) {
    createWarningModal({title: '温馨提醒', content: res.msg});
    if (data.type == 'username') {
      formItems.value.username = ''
    } else if (data.type == 'phone') {
      formItems.value.phone = thisLoginInfo.value.phone
    } else {
      formItems.value.email = thisLoginInfo.value.email
    }
  }
}

async function loadDbRoldData() {
  let dbRoleList = await findAllRoles()
  let list = []
  dbRoleList.forEach((item, index) => {
    list.push({id: item.id, roleName: item.roleName})
  })
  roleList.value = list;
}

function formatUserType(id) {
  let str = '';
  if (hasBlank(id)) return str
  let arr = JSON.parse(id)
  let names = roleList.value.filter(item => arr.indexOf(item.id) != -1).map(item => item.roleName)
  if (names.length > 0) str = names.join(',')
  return str;
}

function formatPwdLength(id, type) {
  let str = '';
  let names = pwdList.value.filter(item => item.id == id).map(item => item[type])
  if (names.length > 0) str = names[0]
  return str;
}

/********************* 修改密码 ************************/
const passwordModel = ref({
  password1: '',
  password2: ''
})
const policyModel = ref(null)
const policyChange = (value) => {
  let arr = pwdList.value.filter(item => item.id == value)
  if (arr.length > 0) policyModel.value = arr[0]
}
const checkPwd = (value, type) => {
  /*  let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');
    if (!pwdRegex.test(value)) {
      createWarningModal({content: "您的密码复杂度太低（密码中必须包含大小写字母、数字、特殊字符），请及时修改密码！"})
    }
    return false*/
  type == '1' ?
    passwordModel.value.password1 = passwordModel.value.password1.trim() :
    passwordModel.value.password2 = passwordModel.value.password2.trim()
  if (null == policyModel.value) {
    createWarningModal({title: '温馨提醒', content: "请选择操作员密码策略！"});
  } else if (policyModel.value.pwdLength != 0 && (value.length < policyModel.value.pwdLength)) {
    createWarningModal({title: '温馨提醒', content: "操作员密码长度不得小于" + policyModel.value.pwdLength});
  } else if (policyModel.value.pwdUpperCase == '1' && !StrTool.hasCapital(value)) {
    createWarningModal({title: '温馨提醒', content: "操作员密码必须存在大写字母！"});
  } else if (policyModel.value.pwdTe == '1' && !StrTool.hasOther(value)) {
    createWarningModal({title: '温馨提醒', content: "操作员密码至少存在一个特殊字符！"});
  } else {
    return false
  }
  type == '1' ?
    passwordModel.value.password1 = '' :
    passwordModel.value.password2 = ''
}
/********************* 操作日志 ************************/
const logParm = ref({
  userName: userStore.getUserInfo.username,
  interval: ['2021-09-01', '2021-10-01']
})
// 组件实例区
const [registerTable, {setPagination, setTableData,getPaginationRef,reload}] = useTable({
  columns: [
    {
      title: '操作时间',
      dataIndex: 'operationDate',
      key: 'operationDate',
      align: 'center',
      width: '140px',customRender: (o)=>formatTime(o.operationDate)
    },
    {title: '账套号', dataIndex: 'accId', key: 'accId', align: 'left', width: '120px'},
    {
      title: '操作内容',
      dataIndex: 'operationCont',
      key: 'operationCont',
      align: 'left',
      width: '200px',
      ellipsis: true
    },
    {title: '操作类型', dataIndex: 'logMethod', key: 'logMethod', align: 'center', width: '80px',slots: {customRender: 'logMethod'}},
    {title: '主机名', dataIndex: 'client', key: 'client', align: 'center', width: '100px'}
  ],
  bordered: true,
  immediate: false,
  canResize: false,
  showIndexColumn: false, //显示序号列
  pagination: {
    pageSize: 100,
    showSizeChanger: true,
    pageSizeOptions: ['50', '100', '500', '1000'],
    showTotal: t => `总共${t}条数据`,
  },
  scroll:{ y: 400 }
})
const rangeChange =async (value) => {
 await tableReload()
}
const tableReload = async () => {
  let data = JSON.parse(JSON.stringify(logParm.value))
  data.page = getPaginationRef().current
  data.size = getPaginationRef().pageSize
  console.log(data)
  let result = await findInterval(data)
  setTableData([])
  setTableData(result.items)
  setPagination({total: result.total})
}
const formatTime = (val)=>{
  return moment(val).format('YYYY-MM-DD HH:mm:ss')
}
const funType = (val,type)=>{
  let text = '其他'
  let color = 'blue'
  switch (val){
    case '1':
      text = '修改'
      color = 'purple'
    break;
    case '2':
      text = '删除'
      color = 'aliceblue'
      break;
    case '3':
      text = '停用'
      color = 'antiquewith'
      break;
    case '4':
      text = '查看'
      color = 'green'
      break;
    case '5':
      text = '导入'
      color = 'blueviolet'
      break;
    case '6':
      text = '导出'
      color = 'beige'
      break;
    case '7':
      text = '打印'
      color = 'burlywood'
      break;
  }
  return type=='text'?text:color
}
</script>
<style src="../../../../../../assets/styles/global-open.less" lang="less" scoped></style>
<style lang="less" scoped>
.nc-open-content {
  :deep(.ant-tabs-card) {
    height: 100%;
    background-color: #b4c8e3;

    .ant-tabs-card-bar {
      width: 180px;

      .ant-tabs-nav-wrap {
        background-color: #b4c8e3;
      }

      .ant-tabs-tab, .ant-tabs-tab-active {
        text-align: center;
        background-color: #b4c8e3;
        font-weight: bold;
        color: slategrey;
        margin-bottom: 0;
      }

      .ant-tabs-tab-active {
        color: black;
        background-color: white;
      }
    }

    .ant-tabs-content {
      height: 100%;
      background-color: white;

      .tabpane-top {
        height: 40px;
        line-height: 40px;
        text-align: right;
        width: auto;
        padding-right: 2em;

        .ant-btn-me {
          margin: 0 1px;
          border-color: #d2cfcf;
          color: #0096c7;
          font-weight: bold;
          font-size: 14px;
        }

        .ant-btn-me:hover {
          background-color: #0096c7;
          color: white;
        }
      }

      .tabpane-bottom {
        height: calc(100% - 40px);
        width: auto;

        .border-div {
          position: relative;
          border: 1px #a29f9f solid;
          margin: 20px 10px;
          padding: 5%;

          > span {
            display: block;
            width: 80px;
            text-align: center;
            background-color: white;
            position: absolute;
            left: 50px;
            top: -12px;
            color: black;
            font-weight: bold;
          }

          > div {
            text-align: center;

            span {
              color: #595858;
            }

            .ant-input {
              border: none;
              border-radius: 0;
              margin-left: 4em;
              margin-right: 2em;
              border-bottom: 1px solid #949494;
              width: 50%;
            }

            .ant-input-password {
              margin-left: 4em;
              margin-right: 2em;
              width: 50%;

              .ant-input {
                width: 100%;
                margin-left: 0em;
                margin-right: 0em;
                border-bottom: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style scoped>
.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}
.a-table-font-size-12 :deep(th) {
  text-align: center !important;
}
</style>
