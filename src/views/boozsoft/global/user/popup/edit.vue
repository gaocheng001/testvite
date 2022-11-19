<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    title="操作员"
    :ok-text="isEdit?'保存':'新建'"
    :cancel-text="isLook?'关闭':!isEdit?'放弃':'取消'"
    :showOkBtn="showNext && !isLook"
    @ok="handleOk()"
    @register="register"
    :canFullscreen="false"
  >
    <template #title>
      <div style="display: flex;margin-top: 5px;" class="vben-basic-title">
        <PlusCircleOutlined v-if="!isEdit" style="font-size: 50px;color: #0096c7;"/>
        <FormOutlined v-else-if="isEdit && !isLook" style="font-size: 50px;color: #0096c7;"/>
        <FileSearchOutlined v-else style="font-size: 50px;color: #0096c7;"/>
        <span style="line-height:50px;font-size: 30px;color: #0096c7;">&ensp;操作员</span>
      </div>
      <div style="display: inline-block;position:absolute;right: 80px;top: 20px;background:#ffffff">
        <img src="/@/assets/images/cz.png" draggable="false" style="height:100px;margin-right: 10px;"/>
      </div>
    </template>
    <div class="nc-open-content" style="height: 100%">
      <div class="open-content-up">

        <div style="width: 580px;margin: 5% 15% 3%">
<!--          <RadioGroup v-model:value="formItems.sex" button-style="solid">
            <RadioButton value="1">男</RadioButton>
            <RadioButton value="0">女</RadioButton>
          </RadioGroup>
          <br/>-->
          <span style="font-weight: bold;font-size: 20px;">&ensp;操作员名称：</span>
          <a-input v-model:value="formItems.realName" placeholder="操作员名称"
                   @keydown.enter.native="$refs.focus1.focus()"
                   style="margin-left: 3%;font-size: 20px;width: 400px;font-weight: bold;border-bottom: 3px #666666 solid !important;"/>
          <span class="red_span">⋆</span>
        </div>
        <br/>
        <label>登录账户：</label>
        <a-input v-model:value="formItems.username" @blur="checkAccount()" ref="focus1"
                 @keydown.enter.native="$refs.focus2.focus()" placeholder=""
                 style="width: 28%"/>
        <span class="red_span">⋆</span>
        <label>所属角色：</label>
        <a-select
          ref="focus2"
          mode="multiple"
          @keydown.enter.native="$refs.focus3.focus()"
          v-model:value="formItems.roleList"
          placeholder=""
          style="width: 28%;border: none"
        >
          <a-select-option
            v-for="(item,index) in roleList"
            :key="index"
            :value="item.id"
          >{{ item.roleName }}
          </a-select-option>
        </a-select>
        <span class="red_span">⋆</span>
        <br/>
        <label>性别：</label>
        <a-select style="width: 28%;border: none" v-model:value="formItems.sex">
          <a-select-option value="0">未知的性别</a-select-option>
          <a-select-option value="1">男</a-select-option>
          <a-select-option value="2">女</a-select-option>
          <a-select-option value="9">未说明的性别</a-select-option>
        </a-select>
        <span class="red_span"></span>
        <label>手机号：</label>
        <a-input v-model:value="formItems.phone" @blur="checkPhone()" ref="focus3"
                 @keydown.enter.native="$refs.focus4.focus()" placeholder=""
                 :maxlength="11" :minlength="11"
                 style="width: 28%"/>
        <span class="red_span"></span>
        <br/>
        <label>电子邮箱：</label>
        <a-input v-model:value="formItems.email" @blur="checkMail()" ref="focus4" :maxlength="20"
                 :minlength="10"
                 @keydown.enter.native="$refs.focus5.focus()" placeholder="" style="width: 28%"/>
        <span class="red_span"></span>
        <label>密码策略：</label>
        <a-select
          ref="focus5"
          @keydown.enter.native="$refs.focus6.focus()"
          v-model:value="formItems.pwdPolicy"
          placeholder=""
          @change="policyChange"
          style="width: 28%;border: none"
        >
          <a-select-option
            v-for="psn in pwdList"
            :value="psn.id"
          >{{ psn.pwdName }}
          </a-select-option>
        </a-select>
        <span class="red_span">⋆</span>
        <br/>
        <label>生效日期：</label>
        <DatePicker v-model:value="formItems.effectiveDate" value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD" @change="dateChange" ref="focus6"
                    @keydown.enter.native="$refs.focus7.focus()" placeholder="" style="width: 28%"/>
        <span class="red_span"><span v-if="null != policyModel && policyModel.pwdLock == 1">⋆</span></span>

        <label>失效日期：</label>
        <DatePicker v-model:value="formItems.invalidDate" value-format="YYYY-MM-DD"  ref="focus7"
                    @keydown.enter.native="$refs.focus8.focus()"
                    format="YYYY-MM-DD" placeholder="" style="width: 28%"/>
        <span class="red_span"></span>
        <br/>
        <label>密码最小长度：</label>
        <a-input :value="policyModel != null?policyModel.pwdLength != null?policyModel.pwdLength:'不限制':'不限制'"
                 style="pointer-events: none;width: 28%;text-align: center;"/>
        <span class="red_span"></span>
        <label>强制包含大写字母：</label>
        <a-input :value="policyModel != null?policyModel.pwdUpperCase=='1'?'是':'否':'无'"
                 style="pointer-events: none;width: 28%;text-align: center;"/>
        <span class="red_span"></span>
        <br/>
        <label>强制包含特殊字符：</label>
        <a-input :value="policyModel != null?policyModel.pwdTe=='1'?'是':'否':'无'"
                 style="pointer-events: none;width: 28%;text-align: center;"/>
        <span class="red_span"></span>

        <template v-if="formItems.id == ''">
          <!--          <label>密码：</label>
                    <a-input-password v-model:value="formItems.password1" ref="focus7"
                                      @blur="checkPwd(formItems.password1,'1')"
                                      @keydown.enter.native="$refs.focus8.focus()" placeholder=""
                                      style="width: 28%"/>
                    <span class="red_span"><span
                      v-if="null != policyModel && policyModel.pwdLength > 0">⋆</span></span>-->
          <label>登录密码：</label>
          <a-input-password v-model:value="formItems.password" ref="focus8"
                            @blur="checkPwd(formItems.password,'2')"
                            placeholder="" style="width: 28%"/>
          <span class="red_span"><span
            v-if="null != policyModel && policyModel.pwdLength > 0">⋆</span></span>
        </template>
        <template v-else>
          <label>操作员状态：</label>
          <RadioGroup v-model:value="formItems.flag" size="small">
            <RadioButton value="1">启用</RadioButton>
            <RadioButton value="0">停用</RadioButton>
          </RadioGroup>
        </template>
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
import {serveDate} from "/@/api/record/log";
import {PlusCircleOutlined, FormOutlined, FileSearchOutlined} from '@ant-design/icons-vue';
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const ASelectOption = ASelect.Option
const AInputPassword = AInput.Password

const emit = defineEmits(['register'])
const roleList = inject('roleList'); //消费者
const pwdList = inject('pwdList'); //消费者

const formItems = ref({
  id: '',
  sex: '0',
  realName: '',
  pwdPolicy: '',
  effectiveDate: '',
  invalidDate: '',
  password: '123456',
  username: '',
  phone: '',
  email: '',
  flag: '',
  openid: '',
  roleList: []
})
const isEdit=ref(false)
const isLook=ref(false)
const showNext=ref(true)
const [register, {closeModal,setModalProps}] = useModalInner(async (data) => {
  // 方式2
  isEdit.value = data.isEdit
  isLook.value = data.isLook
  showNext.value = true
  formItems.value.id = data.data.id
  formItems.value.sex = data.data.sex || '0'
  formItems.value.effectiveDate = hasBlank(data.data.effectiveDate) ? await serveDate() : data.data.effectiveDate
  formItems.value.effectiveDate = formItems.value.effectiveDate.substring(0,10)
  formItems.value.invalidDate = data.data.invalidDate
  formItems.value.pwdPolicy = data.data.pwdPolicy
  formItems.value.password = data.data.password
  formItems.value.username = data.data.username
  formItems.value.realName = data.data.realName
  formItems.value.phone = data.data.phone
  formItems.value.email = data.data.email
  formItems.value.flag = data.data.flag
  formItems.value.openid = data.data.openid
  formItems.value.roleList = hasBlank(data.data.beiyong5) ? [] : JSON.parse(data.data.beiyong5)
  if (hasBlank(data.data.id) && formItems.value.roleList.length == 0 && roleList.value.length > 0) formItems.value.roleList = roleList.value[0].id
  if (!hasBlank(data.data.pwdPolicy)) policyChange(data.data.pwdPolicy)
  setModalProps({minHeight: 340});
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
  showNext.value = false
  if (hasBlank(formItems.value.realName)) {
    createWarningModal({title: '温馨提醒', content: "操作员名称为必填项！"});
    showNext.value = true
  } else if (hasBlank(formItems.value.username)) {
    createWarningModal({title: '温馨提醒', content: "操作员账户为必填项！"});
    showNext.value = true
  } else if (formItems.value.roleList.length == 0) {
    createWarningModal({title: '温馨提醒', content: "操作员所属角色为必选项！"});
    showNext.value = true
  } else if (hasBlank(formItems.value.pwdPolicy)) {
    createWarningModal({title: '温馨提醒', content: "操作员密码策略为必选项！"});
    showNext.value = true
  } else if (null != policyModel.value && policyModel.value.pwdLock == '1' && formItems.value.effectiveDate == '') {
    createWarningModal({title: '温馨提醒', content: "操作员生效日期为必选项！"});
    showNext.value = true
  } else if (/*policyModel.value.pwdLength > 0 && */(hasBlank(formItems.value.password) /*|| hasBlank(formItems.value.password1)*/)) {
    createWarningModal({title: '温馨提醒', content: "操作员密码为必填项！"});
    showNext.value = true
  }/* else if (formItems.value.password != formItems.value.password1) {
    createWarningModal({title: '温馨提醒', content: "两次密码不一致！"});
  }*/ else {
    if ((typeof formItems.value.roleList) == 'string')
      formItems.value.roleList = [formItems.value.roleList[0]]
    emit('save', unref(formItems))
    closeModal()
  }
}

const {createWarningModal} = useMessage()

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

async function checkPhone(value) {
  value = formItems.value.phone
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (value != '' && (!reg.test(value))) {
    formItems.value.phone = ''
    createWarningModal({title: '温馨提醒', content: "请输入正确的手机号"});
  } else if (value != '') {
    let data = {
      id: formItems.value.id || null,
      phone: value,
      type: 'phone'
    }
    await checkOperator(data)
  }
}

async function checkMail(value) {
  value = formItems.value.email
  const reg = /^\w{3,15}\@\w+\.[a-z]{2,3}$/;
  if (value != '' && (!reg.test(value))) {
    formItems.value.email = ''
    createWarningModal({content: "请输入正确的邮箱"});
  } else if (value != '') {
    let data = {
      id: formItems.value.id || null,
      email: value,
      type: 'email'
    }
    await checkOperator(data)
  }
}

async function checkAccount(value) {
  value = formItems.value.username
  // 检查数据库
  let data = {
    id: formItems.value.id || null,
    username: value,
    type: 'username'
  }
  if (value != '') await checkOperator(data)
}
async function checkOperator(data) {
  let res = await checkUser(data)
  if (null != res && !res.pass) {
    createWarningModal({title: '温馨提醒', content: res.msg});
    if (data.type == 'username') {
      formItems.value.username = ''
      focus1.value.focus()
    } else if (data.type == 'phone') {
      formItems.value.phone = ''
      focus3.value.focus()
    } else {
      formItems.value.email = ''
      focus4.value.focus()
    }
  }
}

/* 页面策略 */
const policyModel = ref(null)
const policyChange = (value) => {
  if (pwdList.value.length > 0){
    let arr = pwdList.value.filter(item => item.id == value)
    if (arr.length > 0) policyModel.value = arr[0]
    if (!hasBlank(formItems.value.effectiveDate)) dateChange(formItems.value.effectiveDate)
  }
}
const dateChange = (value) => {
  if (hasBlank(value) || null == policyModel.value || policyModel.value.pwdLock != '1') {
    formItems.value.invalidDate = ''
  } else if (policyModel.value.pwdLock == '1') {
    let longV = (24 * 60 * 60 * 1000) * (policyModel.value.pwdValidity + 1)
    formItems.value.invalidDate = DateTool().offsetToStr(new Date(value), longV).substring(0, 10)
  }
}

</script>
<style lang="less" scoped>
@import '/@/assets/styles/part-open.less';

:deep(.ant-calendar-picker-input.ant-input),
:deep(.ant-select-single:not(.ant-select-customize-input)
  .ant-select-selector
  .ant-select-selection-search-input), :deep(.ant-picker), :deep(.ant-input-number),:deep(.ant-input-password) {
  border: none;
  width: 100%;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  text-align: center;
}

:deep(.ant-form-item-control button) {
  display: none;
}

:deep(.ant-input-number-input) {
  width: 100%;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
}

:deep(.ant-input-number) {
  width: 90%;
  border: none;
}

:deep(.nc-open-content input ) {
  width: 100% !important;
}

:deep(.ant-calendar-picker-input) {
  text-align: center;
}

:deep(.ant-select-single:not(.ant-select-customize-input)
  .ant-select-selector
  .ant-select-selection-search-input) {
  border: none !important;
}

.nc-open-content-look {
  pointer-events: none;
  cursor: default;
}

.nc-open-content {
  color: #666666;

  input {
    width: 32%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  :deep(.ant-upload-picture-card-wrapper) {
    width: 88px;

    .ant-upload-select-picture-card {
      width: 280px;
      height: 80px;
      margin-right: 0;
      margin-bottom: 0;

      .ant-upload {
        //padding: 0;
      }
    }
  }

  :deep(.ant-cascader-input) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
  }

  label:not(.ant-radio-button-wrapper) {
    text-align: left;
    width: 150px;
    display: inline-block;
    padding: 6px 10px;
    margin-left: 15px;
    font-weight: bold;
  }

  .red_span {
    color: red;
    font-weight: bold;
    display: inline-block;
    width: 20px;
    text-align: right;
  }
}

:deep(.ant-select-disabled) {
  .ant-select-selector {
    background-color: white !important;
    color: black !important;
  }
}


</style>
