
import '@surely-vue/table/dist/index.css'
import STable from '@surely-vue/table';
import '/@/design/index.less';
import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import 'virtual:windi-utilities.css';
import XLSX from "xlsx-js-style";
import {createApp, nextTick} from 'vue';
import App from './boozsoft/App.vue';
import {initAppConfigStore} from '/@/logics/initAppConfig';
import router, {setupRouter} from '/@/router';
import {setupRouterGuard} from '/@/router/guard';
import {setupStore} from '/@/store';
import {setupErrorHandle} from '/@/logics/error-handle';
import {setupGlobDirectives} from '/@/directives';
import {setupI18n} from '/@/locales/setupI18n';
import {registerGlobComp} from '/@/components/registerGlobComp';


import pinyin from 'js-pinyin'

window.pinyin = pinyin
// Register icon Sprite
import 'virtual:svg-icons-register';
import {getCurrentPlatformIdCache, usePlatformsStoreWidthOut} from "/@/store/modules/platforms";

// Do not introduce on-demand in local development?
// In the local development for introduce on-demand, the number of browser requests will increase by about 20%.
// Which may slow down the browser refresh.
// Therefore, all are introduced in local development, and only introduced on demand in the production environment
// if (import.meta.env.DEV) {
import 'ant-design-vue/dist/antd.less';
import {createWindowDebuggerInfo} from "/@/utils/boozsoft/boozsoftDebuggerInfo/pingzhengFillin";
import {sysMenuQueryAll} from "/@/utils/boozsoft/rbac/menuData";
import {putMenu} from "/@/api/mock/mock-menu";
import {isUseMock} from "/@/utils/env";
// }



(async () => {
  if(isUseMock()){
    const aa=sysMenuQueryAll()
    await putMenu(aa)
  }

  createWindowDebuggerInfo()
  const app = createApp(App);

  // Configure store
  setupStore(app);

  // Initialize internal system configuration
  initAppConfigStore();

  // Register global components
  registerGlobComp(app);

  // Multilingual configuration
  await setupI18n(app);


  // 优化加载，提前加载内容 end

  // Configure routing
  // 跳转到 缓存平台id 对应的平台
  getCurrentPlatformIdCache() != null && await usePlatformsStoreWidthOut().goCurrentCachePlatform()

  setupRouter(app);

  // router-guard
  setupRouterGuard();

  // Register global directive
  setupGlobDirectives(app);

  // Configure global error handling
  setupErrorHandle(app);


  // 优化加载，提前加载内容 start
  const {Hello} = await import('/@/boozsoft/layouts/platforms/platform-nc-enter/index.vue')
  const {Root} = await import( '/@/views/Root.vue')
  const {Aaa} = await import('/@/views/Aaa.vue')
  // Mount when the route is ready
  // https://next.router.vuejs.org/api/#isready
  await router.isReady();

  app.use(STable);
  app.mount('#system-web', true);

  console.log(window?.$wujie.bus)



})();


window?.$wujie.bus.$on("goGuDingZiChanxxxx", function (id) {
  const layoutsStore = usePlatformsStoreWidthOut();
  // /** 设定延时请求( 比如router.ready() )，防止首次加载,组件还未渲染 start **/
  layoutsStore.switchPlatform({id})
  /** 非该模块的平台，抛出异常，弹出错误 start **/
})
