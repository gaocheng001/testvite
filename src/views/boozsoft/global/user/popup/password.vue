<template>
  <BasicModal
    width="500px"
    v-bind="$attrs"
    title="密码修改"
    @ok="handleOk()"
    @register="register"
    :canFullscreen="false"
  >
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-up">

<!--        <label>旧密码：</label>
        <a-input-password v-model:value="oldPwd" style="width: 60%;pointer-events: none"/>-->
        <br/>
        <label>新密码：</label>
        <a-input-password v-model:value="formItems.password1" ref="focus7"
                          @blur="checkPwd(formItems.password1,'1')"
                          @keydown.enter.native="$refs.focus8.focus()" placeholder=""
                          style="width: 60%"/>
        <span class="red_span"><span
          v-if="null != policyModel && policyModel.pwdLength > 0">⋆</span></span>
        <br/>
        <br/>
        <label>确认新密码：</label>
        <a-input-password v-model:value="formItems.password" ref="focus8"
                          @blur="checkPwd(formItems.password,'2')"
                          placeholder="" style="width: 60%"/>
        <span class="red_span"><span
          v-if="null != policyModel && policyModel.pwdLength > 0">⋆</span></span>
      </div>
    </div>
  </BasicModal>
</template>
<script setup="props, {content}" lang="ts">
import {inject, onMounted, ref, unref} from 'vue';
import {BasicModal, useModalInner} from '/@/components/Modal'
import {useMessage} from "/@/hooks/web/useMessage";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {
  Input as AInput,
  Select as ASelect, DatePicker, Radio
} from 'ant-design-vue'
import {checkUser} from "/@/api/caozuoyuan/caozuoyuan";
import {DateTool, JsonTool, StrTool} from "/@/api/task-api/tools/universal-tools";

const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const ASelectOption = ASelect.Option
const AInputPassword = AInput.Password

const emit = defineEmits(['register'])
const roleList = inject('roleList'); //消费者
const pwdList = inject('pwdList'); //消费者

const formItems = ref({
  id: '',
  realName: '',
  pwdPolicy: '',
  effectiveDate: '',
  invalidDate: '',
  password1: '',
  password: '123456',
  username: '',
  phone: '',
  email: '',
  flag: '',
  openid: '',
  roleList: [],
  beiyong4: '1'
})
const oldPwd = ref('')
const [register, {closeModal}] = useModalInner((data) => {
  // 方式2
  formItems.value.id = data.data.id
  formItems.value.effectiveDate = data.data.effectiveDate
  formItems.value.invalidDate = data.data.invalidDate
  formItems.value.pwdPolicy = data.data.pwdPolicy
  formItems.value.password = ''
  formItems.value.password1 = ''
  formItems.value.username = data.data.username
  formItems.value.realName = data.data.realName
  formItems.value.phone = data.data.phone
  formItems.value.email = data.data.email
  formItems.value.flag = data.data.flag
  formItems.value.openid = data.data.openid
  formItems.value.roleList = hasBlank(data.data.beiyong5) ? [] : JSON.parse(data.data.beiyong5)
  if (!hasBlank(data.data.pwdPolicy)) policyChange(data.data.pwdPolicy)
  oldPwd.value = data.data.password
})
onMounted(async () => {
})
const focus1 = ref(null)
const focus2 = ref(null)
const focus3 = ref(null)
const focus4 = ref(null)
const focus5 = ref(null)
const focus6 = ref(null)
const focus7 = ref(null)
const focus8 = ref(null)

async function handleOk() {
  if (hasBlank(formItems.value.realName)) {
    createWarningModal({title: '温馨提醒', content: "操作员名称为必填项！"});
  } else if (hasBlank(formItems.value.username)) {
    createWarningModal({title: '温馨提醒', content: "操作员账户为必填项！"});
  } else if (formItems.value.roleList == 0) {
    createWarningModal({title: '温馨提醒', content: "操作员所属角色为必选项！"});
  } else if (hasBlank(formItems.value.pwdPolicy)) {
    createWarningModal({title: '温馨提醒', content: "操作员密码策略为必选项！"});
  } else if (policyModel.value.pwdLock == '1' && formItems.value.effectiveDate == '') {
    createWarningModal({title: '温馨提醒', content: "操作员生效日期为必选项！"});
  } else if (policyModel.value.pwdLength > 0 && (hasBlank(formItems.value.password) ||  hasBlank(formItems.value.password1 ))) {
    createWarningModal({title: '温馨提醒', content: "新密码为必填项！"});
  } else if (formItems.value.password != formItems.value.password1) {
    createWarningModal({title: '温馨提醒', content: "两次密码不一致！"});
  } else if (oldPwd.value == formItems.value.password.trim()) {
    createWarningModal({title: '温馨提醒', content: "新旧密码不得一致！"});
  } else {
    emit('save', unref(formItems))
    closeModal()
  }
}

const {
  createWarningModal
} = useMessage()

const checkPwd = (value, type) => {
  /*  let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');
    if (!pwdRegex.test(value)) {
      createWarningModal({content: "您的密码复杂度太低（密码中必须包含大小写字母、数字、特殊字符），请及时修改密码！"})
    }
    return false*/
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
    formItems.value.password1 = '' :
    formItems.value.password = ''
}
/* 页面策略 */
const policyModel = ref(null)
const policyChange = (value) => {
  let arr = pwdList.value.filter(item => item.id == value)
  if (arr.length > 0) policyModel.value = arr[0]
}
</script>
<style src="../../../../../assets/styles/caozuoyuan_edit.less" lang="less" scoped></style>
<style scoped lang="less">
label:not(.ant-radio-button-wrapper) {
  text-align: left;
  width: 120px;
  display: inline-block;
  padding: 5px 10px;
  margin-left: 10px;
}

.red_span {
  color: red;
  font-weight: bold;
  display: inline-block;
  width: 20px;
  text-align: right;

  > span {
    font-size: 14px;
  }
}
</style>
