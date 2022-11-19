<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <!--    <AppLocalePicker
          class="absolute top-4 right-4 enter-x text-white xl:text-gray-600"
          :showText="false"
          v-if="!sessionTimeout"
        />-->
<!--    <AppDarkModeToggle class="absolute top-3 right-7 enter-x" v-if="!sessionTimeout"/>-->

    <!--    <span class="-enter-x xl:hidden">
          <AppLogo :alwaysShowTitle="true" />
        </span>-->
    <div class="enter-x login-img-div">
      <img src="/img/login/nc_logo.png"/>
      <img src="/img/login/boozsoft_logo.png" style="height: 24px;margin-top: 5px;"/>
    </div>
    <div class="container relative h-full py-2 mx-auto sm:px-10">
      <div class="flex h-full">
        <div class="hidden xl:flex xl:flex-col xl:w-6/12 min-h-full  pl-4 login-left-mark">
          <!--     图标     <AppLogo class="-enter-x" />-->
          <!--          <div class="my-auto">
                      <img
                        :alt="title"
                        src="../../../assets/svg/login-box-bg.svg"
                        class="w-1/2 -mt-16 -enter-x"
                      />
                      <div class="mt-10 font-medium text-white -enter-x">
                        <span class="mt-4 text-3xl inline-block"> {{ t('sys.login.signInTitle') }}</span>
                      </div>
                      <div class="mt-5 text-md text-white font-normal dark:text-gray-500 -enter-x">
                        {{ t('sys.login.signInDesc') }}
                      </div>手机登录
                    </div>-->
          <div class="
              my-auto
              mx-auto
              xl:mr-0
              xl:bg-transparent
              px-5
              py-8
              sm:px-8
              xl:p-4
              rounded-md
              shadow-md
              xl:shadow-none
              w-full
              sm:w-3/4
              lg:w-2/4
              xl:w-auto
              enter-x
              relative login-left-content
            ">
            <h1 align="center"
                style="margin: 5% 0 5%; color: white; font-size: 20px; font-weight: bold;">
              财税达NC-ERP</h1>
            <div
              style="width: 40px;height: 10px;background-color: white;float: left;margin-left: 26px"></div>
            <br>
            <p style="text-indent: 2em;margin:0">自主可控：支持开源及华为EulerOS操作系统</p>
            <p style="text-indent: 7em;margin:0">使用开源Postgresql数据库</p>
            <p style="text-indent: 7em;margin:0">不使用任何第三方授权控件</p>
            <p style="text-indent: 7em;">支持国产CPU内核的服务器系统</p>
            <p style="text-indent: 2em;margin:0">功能特点：意图驱动，智能学习业务流程</p>
            <p style="text-indent: 7em;margin:0">智能AI，发票智能识别并验真</p>
            <p style="text-indent: 7em;margin:0">应用商城自由组合应用功能模块</p>
            <div style="text-align: center;padding: 20px;">
              <span><a
                style="color:white;">手机登录</a></span><span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <span><a
                style="color:white;">获取授权</a></span><span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <span><a style="color:white;">登录账户</a></span>
            </div>
          </div>
        </div>
        <div class="h-full xl:h-auto flex py-5 xl:py-0 xl:my-0 w-full xl:w-6/12">
          <div
            style="background-color: white;"
            :class="`${prefixCls}-form`"
            class="
              my-auto
              mx-auto
              xl:ml-0
              xl:bg-transparent
              px-5
              py-8
              sm:px-8
              xl:p-4
              rounded-md
              shadow-md
              xl:shadow-none
              w-full
              sm:w-3/4
              lg:w-2/4
              xl:w-auto
              enter-x
              relative
            "
          >
            <LoginForm/>
            <!--            <ForgetPasswordForm />
                        <RegisterForm />
                        <MobileForm />
                        <QrCodeForm />-->
          </div>
        </div>
      </div>
    </div>
    <div class="enter-x login-footer">
			<span style="color: white;font-size:15px;"> Copyright ©
				2020 All Rights Reserved 湖北万亚软件技术有限公司</span><br>
    </div>
  </div>
<!--  珀卡博科技（北京）有限公司  -->
</template>
<script lang="ts">
import {defineComponent, computed} from 'vue';

import {AppLogo} from '/@/components/Application';
import {AppLocalePicker, AppDarkModeToggle} from '/@/components/Application';
import LoginForm from './LoginForm-Nc.vue';
import ForgetPasswordForm from './ForgetPasswordForm.vue';
import RegisterForm from './RegisterForm.vue';
import MobileForm from './MobileForm.vue';
import QrCodeForm from './QrCodeForm.vue';

import {useGlobSetting} from '/@/hooks/setting';
import {useI18n} from '/@/hooks/web/useI18n';
import {useDesign} from '/@/hooks/web/useDesign';
import {useLocaleStore} from '/@/store/modules/locale';

export default defineComponent({
  name: 'Login',
  components: {
    AppLogo,
    LoginForm,
    ForgetPasswordForm,
    RegisterForm,
    MobileForm,
    QrCodeForm,
    AppLocalePicker,
    AppDarkModeToggle,
  },
  props: {
    sessionTimeout: {
      type: Boolean,
    },
  },
  setup() {
    const globSetting = useGlobSetting();
    const {prefixCls} = useDesign('login');
    const {t} = useI18n();
    const localeStore = useLocaleStore();

    return {
      t,
      prefixCls,
      title: computed(() => globSetting?.title ?? ''),
      showLocale: localeStore.getShowPicker,
    };
  },
});
</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-login';
@logo-prefix-cls: ~'@{namespace}-app-logo';
@countdown-prefix-cls: ~'@{namespace}-countdown-input';
@dark-bg: #293146;

html[data-theme='dark'] {
  .@{prefix-cls} {
    background-color: @dark-bg;

    &::before {
      background-image: url(/@/assets/svg/login-bg-dark.svg);
    }

    .ant-input,
    .ant-input-password {
      background-color: #232a3b;
    }

    .ant-btn:not(.ant-btn-link):not(.ant-btn-primary) {
      border: 1px solid #4a5569;
    }

    &-form {
      background: transparent !important;
    }

    .app-iconify {
      color: #fff;
    }
  }
}

.@{prefix-cls} {
  overflow: hidden;
  @media (max-width: @screen-xl) {
    background-color: #293146;

    .@{prefix-cls}-form {
      background-color: #fff;
    }
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* margin-left: -48%;*/
    background-image: url('/img/login/background-login.png');
    background-position: 100%;
    background-repeat: repeat;
    /* background-size: auto 100%;*/
    content: '';
    @media (max-width: @screen-xl) {
      display: none;
    }
  }

  .@{logo-prefix-cls} {
    position: absolute;
    top: 12px;
    height: 30px;

    &__title {
      font-size: 16px;
      color: #fff;
    }

    img {
      width: 32px;
    }
  }

  .container {
    .@{logo-prefix-cls} {
      display: flex;
      width: 60%;
      height: 80px;

      &__title {
        font-size: 24px;
        color: #fff;
      }

      img {
        width: 48px;
      }
    }
  }

  &-sign-in-way {
    .anticon {
      font-size: 22px;
      color: #888;
      cursor: pointer;

      &:hover {
        color: @primary-color;
      }
    }
  }

  input:not([type='checkbox']) {
    min-width: 360px;

    @media (max-width: @screen-xl) {
      min-width: 320px;
    }

    @media (max-width: @screen-lg) {
      min-width: 260px;
    }

    @media (max-width: @screen-md) {
      min-width: 240px;
    }

    @media (max-width: @screen-sm) {
      min-width: 160px;
    }
  }

  .@{countdown-prefix-cls} input {
    min-width: unset;
  }

  .ant-divider-inner-text {
    font-size: 12px;
    color: @text-color-secondary;
  }
}

.login-img-div {
  position: absolute;
  display: inline-flex;
  justify-content: space-between;
  padding: 2% 5%;
  width: 100%;
}

.login-left-mark {
  position: relative;

  .login-left-content {
    color: white;
    background-color: rgba(106, 106, 255, 0.8);
    width: 380px;
    height: 360px;
    left: 0;
  }
}
.login-footer{
  right:0%;line-height:35px; width:100%;text-align: center;bottom: 10px;position: absolute;
}
</style>
