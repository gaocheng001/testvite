<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    :title="formItems.type=='edit'?'批量操作员信息修改':'批量操作员密码修改'"
    :ok-text="'保存'"
    :cancel-text="'取消'"
    :showOkBtn="showNext"
    @ok="handleOk()"
    @register="register"
    :canFullscreen="false"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <FormOutlined style="font-size: 50px;color: #0096c7;"/>
        <span style="line-height:50px;font-size: 30px;color: #0096c7;">&ensp;{{formItems.type=='edit'?'批量操作员信息修改':'批量操作员密码修改'}}</span>
      </div>
      <div style="display: inline-block;position:absolute;right: 120px;top: 20px;background:#ffffff">
        <img src="/@/assets/images/cz.png" draggable="false" style="height:100px;margin-right: 10px;"/>
      </div>
    </template>
    <div
      class="nc-open-content"
      style="height: 100%"
    >
      <div class="open-content-up">
        <div style="width: 720px;margin-top: 5%">
          <span style="font-size: 18px;font-weight: bold;">&ensp;选择的操作员名称：</span>
          <span style="color:#000;font-weight: bold;margin-left: 1em">{{ splicingShowValue }}</span>
        </div>
        <br/>
        <div v-if="formItems.type=='edit'">
          <label>所属角色：</label>
          <a-select
            ref="focus1"
            mode="multiple"
            @keydown.enter.native="$refs.focus2.focus()"
            v-model:value="formItems.roleList"
            placeholder=""
            style="width: 75.2%;border: none"
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
          <label>密码策略：</label>
          <a-select
            ref="focus2"
            @keydown.enter.native="$refs.focus3.focus()"
            v-model:value="formItems.pwdPolicy"
            placeholder=""
            @change="policyChange"
            style="width: 26%;border: none"
          >
            <a-select-option
              v-for="psn in pwdList"
              :value="psn.id"
            >{{ psn.pwdName }}
            </a-select-option>
          </a-select>
          <span class="red_span">⋆</span>
          <label>生效日期：</label>
          <DatePicker v-model:value="formItems.effectiveDate" value-format="YYYY-MM-DD"
                      format="YYYY-MM-DD" @change="dateChange" ref="focus3"
                      placeholder="" style="width: 26%"/>
          <span class="red_span"><span
            v-if="null != policyModel && policyModel.pwdLock == 1">⋆</span></span>
          <br/>
          <label>密码最小长度：</label>
          <a-input :value="policyModel != null?policyModel.pwdLength:'不限制'"
                   style="pointer-events: none;width: 26%;text-align: center;"/>
          <span class="red_span"></span>
          <label>强制包含大写字母：</label>
          <a-input :value="policyModel != null?policyModel.pwdUpperCase=='1'?'是':'否':'无'"
                   style="pointer-events: none;width: 26%;text-align: center;"/>
          <span class="red_span"></span>
          <br/>
          <label>强制包含特殊字符：</label>
          <a-input :value="policyModel != null?policyModel.pwdTe=='1'?'是':'否':'无'"
                   style="pointer-events: none;width: 26%;text-align: center;"/>
          <span class="red_span"></span>
          <label>操作员状态：</label>
          <RadioGroup v-model:value="formItems.flag" button-style="solid" size="small">
            <RadioButton value="1">启用</RadioButton>
            <RadioButton value="0">停用</RadioButton>
          </RadioGroup>
          <span class="red_span"></span>
        </div>
        <div v-else>
          <div class="border-div">
            <span>密码策略</span>
            <div><label>密码最小长度：&emsp;&emsp;</label>
              <a-input :value="policyModel != null?policyModel.pwdLength:'无'"
                       style="pointer-events: none;text-align: center;"/>
              <LockOutlined/>
              <br/>
              <label>强制包含大写字母：</label>
              <a-input :value="policyModel != null?policyModel.pwdUpperCase=='1'?'是':'否':'无'"
                       style="pointer-events: none;text-align: center;"/>
              <LockOutlined/>
              <br/>
              <label>强制包含特殊字符：</label>
              <a-input :value="policyModel != null?policyModel.pwdTe=='1'?'是':'否':'无'"
                       style="pointer-events: none;text-align: center;"/>
              <LockOutlined/>
            </div>
          </div>
          <div class="border-div">
            <span>修改密码</span>
            <div>
              <label>新密码：&emsp;&emsp;</label>
              <a-input-password v-model:value="formItemsP.password1" ref="focus7"
                                @blur="checkPwd(formItemsP.password1,'1')"
              />
              <FormOutlined/>
              <br/>
              <label>确认新密码：</label>
              <a-input-password v-model:value="formItemsP.password" ref="focus8"
                                @blur="checkPwd(formItemsP.password,'2')"
              />
              <FormOutlined/>
            </div>
          </div>
        </div>
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
} from 'ant-design-vue';
import {LockOutlined, FormOutlined,} from '@ant-design/icons-vue';
import {DateTool, StrTool} from "/@/api/task-api/tools/universal-tools";

const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const ASelectOption = ASelect.Option
const AInputPassword = AInput.Password

const emit = defineEmits(['register'])
const roleList = inject('roleList'); //消费者
const pwdList = inject('pwdList'); //消费者

const splicingShowValue = ref('')

const formItems = ref({
  ids: [],
  objs: [],
  type: 'edit',
  roleList: [],
  effectiveDate: '',
  pwdPolicy: '',
  flag: '1',
  password: '',
})

const formItemsP = ref({
  password: '',
  password1: ''
})

const isEdit = ref(true)
const showNext = ref(true)

const [register, {closeModal,setModalProps}] = useModalInner(async (data) => {
  setModalProps({ minHeight: 300 });
  formItems.value.type = data.type
  formItems.value.objs = data.data
  formItems.value.ids = data.data.map(item => item.id)
  splicingShowValue.value = formItems.value.objs.map(item => item.username + ' ' + item.realName).join(' / ')
  if (data.type != 'edit') {
    let descO = formItems.value.objs.map(item=>{
      item.beiyong4 = 0
      let names = pwdList.value.filter(item1 => item1.id == item.pwdPolicy).map(item1 => item1['pwdLength'])
      if (names.length > 0) item.beiyong4 = parseInt(names[0])
      return item
    }).sort((a,b)=> b.beiyong4 - a.beiyong4)
    policyChange(descO[0].pwdPolicy)
  }

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
  showNext.value = false
  if (formItems.value.type == 'edit') {
    if (formItems.value.roleList.length == 0) {
      createWarningModal({title: '温馨提醒', content: "操作员所属角色为必选项！"});
      showNext.value = true
      return false;
    } else if (hasBlank(formItems.value.pwdPolicy)) {
      createWarningModal({title: '温馨提醒', content: "操作员密码策略为必选项！"});
      showNext.value = true
      return false;
    } else if (policyModel.value.pwdLock == '1' && formItems.value.effectiveDate == '') {
      createWarningModal({title: '温馨提醒', content: "操作员生效日期为必选项！"});
      showNext.value = true
      return false;
    } else {
      if ((typeof formItems.value.roleList) == 'string') formItems.value.roleList = [formItems.value.roleList[0]]
    }
  } else {
    if ((hasBlank(formItemsP.value.password) || hasBlank(formItemsP.value.password1))) {
      createWarningModal({title: '温馨提醒', content: "新密码为必填项！"});
      showNext.value = true
      return false;
    } else if (formItemsP.value.password != formItemsP.value.password1) {
      createWarningModal({title: '温馨提醒', content: "两次密码不一致！"});
      showNext.value = true
      return false;
    } else {
      formItems.value.password = formItemsP.value.password
    }
  }
  formItems.value.objs = null
  emit('save', unref(formItems))
  closeModal()
}

const {
  createWarningModal
} = useMessage()

const checkPwd = (value, type) => {
  value = value.trim()
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
    formItemsP.value.password1 = '' :
    formItemsP.value.password = ''
}

/* 页面策略 */
const policyModel = ref(null)
const policyChange = (value) => {
  let arr = pwdList.value.filter(item => item.id == value)
  if (arr.length > 0) policyModel.value = arr[0]
  if (!hasBlank(formItems.value.effectiveDate)) dateChange(formItems.value.effectiveDate)
}
const dateChange = (value) => {
  if (hasBlank(value) || policyModel.value.pwdLock != '1') {
    formItems.value.invalidDate = ''
  } else if (policyModel.value.pwdLock == '1') {
    let longV = (26 * 60 * 60 * 1000) * (policyModel.value.pwdValidity + 1)
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
