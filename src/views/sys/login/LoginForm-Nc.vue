<template>
  <div>
    <div class="login-nc">
      账户密码登录
    </div>
    <Form
      class="p-4 enter-x"
      :model="formData"
      :rules="getFormRules"
      ref="formRef"
      v-show="getShow"
      @keypress.enter="handleLogin"
    >
      <FormItem name="account" class="enter-x">
        <Input size="large" v-model:value="formData.account"
               :placeholder="t('sys.login.userName')"/>
      </FormItem>
      <FormItem name="password" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>

      <ARow class="enter-x">
        <ACol :span="12">
          <FormItem>
            <!-- No logic, you need to deal with it yourself -->
            <Checkbox v-model:checked="rememberMe" size="small">
              {{ t('sys.login.rememberMe') }}
            </Checkbox>
          </FormItem>
        </ACol>
        <ACol :span="12">
          <FormItem :style="{ 'text-align': 'right' }">
            <!-- No logic, you need to deal with it yourself -->
            <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
              {{ t('sys.login.forgetPassword') }}
            </Button>
          </FormItem>
        </ACol>
      </ARow>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
          {{ t('sys.login.loginButton') }}
        </Button>
        <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
          {{ t('sys.login.registerButton') }}
        </Button> -->
      </FormItem>
      <div class="enter-x" style="height: 80px;width: auto;padding-top: 5%;">
        <div style="text-align: center;border-top: 1px solid #ededed;padding:5% 10%">
          <span>湖北万亚软件技术有限公司</span>
        </div>
      </div>
      <!--      <ARow class="enter-x">
              <ACol :xs="24" :md="8">
                <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
                  {{ t('sys.login.mobileSignInFormTitle') }}
                </Button>
              </ACol>
              <ACol :md="8" :xs="24" class="!my-2 !md:my-0 xs:mx-0 md:mx-2">
                <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
                  {{ t('sys.login.qrSignInFormTitle') }}
                </Button>
              </ACol>
              <ACol :md="7" :xs="24">
                <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
                  {{ t('sys.login.registerButton') }}
                </Button>
              </ACol>
            </ARow>-->

      <!--    <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>

          <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
            <GithubFilled />
            <WechatFilled />
            <AlipayCircleFilled />
            <GoogleCircleFilled />
            <TwitterCircleFilled />
          </div>-->
    </Form>

  </div>
</template>
<script lang="ts">
import {defineComponent, reactive, ref, toRaw, unref, computed} from 'vue';

import {Checkbox, Form, Input, Row, Col, Button, Divider} from 'ant-design-vue';
import {
  GithubFilled,
  WechatFilled,
  AlipayCircleFilled,
  GoogleCircleFilled,
  TwitterCircleFilled,
} from '@ant-design/icons-vue';
import LoginFormTitle from './LoginFormTitle.vue';

import {useI18n} from '/@/hooks/web/useI18n';
import {useMessage} from '/@/hooks/web/useMessage';

import {useUserStore} from '/@/store/modules/user';
import {LoginStateEnum, useLoginState, useFormRules, useFormValid} from './useLogin';
import {useDesign} from '/@/hooks/web/useDesign';
import {loginxxxx, pushUserState} from "/@/api/sys/user";
import LoginDate222 from "/@/views/sys/login/LoginDate.vue";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import moment from "moment";
import {isUseMock} from "/@/utils/env";
import router from '/@/router';
import {putMenu} from "/@/api/mock/mock-menu";
import {sysMenuQueryAll} from "/@/utils/boozsoft/rbac/menuData";
//import { onKeyStroke } from '@vueuse/core';
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default defineComponent({
  name: 'LoginForm',
  components: {
    LoginDate222,
    [Col.name]: Col,
    [Row.name]: Row,
    Checkbox,
    Button,
    Form,
    FormItem: Form.Item,
    Input,
    Divider,
    LoginFormTitle,
    InputPassword: Input.Password,
    GithubFilled,
    WechatFilled,
    AlipayCircleFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
  },
  mounted() {

  },
  setup() {
    const abc = ref(false)
    const {t} = useI18n();
    const {notification, createErrorModal} = useMessage();
    const {prefixCls} = useDesign('login');
    const userStore = useUserStore();

    const {setLoginState, getLoginState} = useLoginState();
    const {getFormRules} = useFormRules();

    const formRef = ref();
    const loading = ref(false);
    const rememberMe = ref(false);

    const formData = reactive({
      account: '',
      password: '',
    });

    const {validForm} = useFormValid(formRef);

    //onKeyStroke('Enter', handleLogin);

    const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);
    let abcd = null


    async function handleLogin() {
      if(isUseMock()){
        const aa=sysMenuQueryAll()
        await putMenu(aa)
      }

      const data = await validForm();
      const info = await loginxxxx({username: data.account, password: data.password})


      if (info.info.token == 'mock token') {
        info.info.token = guid()
      }
      userStore.setToken(info.info.token)
      if (info == '失败') {
        createErrorModal({
          title: t('sys.api.errorTip'),
          content: '用户名或密码错误' || t('sys.api.networkExceptionMsg'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
        return
      } else {
        if (isUseMock()) {
          await pushUserState(info.info)
        }
        abcd = info.info
        const date = moment().format('YYYY-MM-DD')
        useCompanyOperateStoreWidthOut().commitLoginDate(date);
        useCompanyOperateStoreWidthOut().commitShowLoginDate(false);
        userStore.goLogin(abcd)
        abc.value = true
      }
    }

    return {
      abc,
      t,
      prefixCls,
      formRef,
      formData,
      getFormRules,
      rememberMe,
      handleLogin,
      loading,
      setLoginState,
      LoginStateEnum,
      getShow,
    };
  },
});
</script>
<style scoped="scoped">
.login-nc {
  text-align: center;
  font-size: 20px;
  color: #0096c7;
  font-weight: bold;
  font-family: 'Microsoft YaHei UI Light';
  padding: 5% 0 15%;
}
.vben-login input:not([type='checkbox']) {
  min-width: 300px!important;
}
</style>
