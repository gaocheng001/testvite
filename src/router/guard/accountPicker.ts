import type {Router} from 'vue-router';
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {getAllAccAuths} from "/@/api/record/system/financial-settings";
import {
  getAccountList, getAllAuthorAccountList,
  getAssetsAccountList,
  getStockAccountList
} from "/@/api/record/system/account";
import {getAuthCache, setAuthCache} from "/@/utils/auth";
import {
  ACCOUNT_ALL_LIST_KEY,
  ACCOUNT_GDZC_LIST_KEY,
  ACCOUNT_LIST_KEY,
  ACCOUNT_STOCK_LIST_KEY, APP_SERVER_DATE_KEY,
  AUTHORIZE_LIST_KEY
} from '/@/enums/cacheEnum';
import {serveDate} from "/@/api/record/log";

/**
 * The interface used to close the current page to complete the request when the route is switched
 * @param router
 */
export function createAccountPickerGuard(router: Router) {

  router.beforeEach(async (to, from, next) => {
    if (to.fullPath == '/login' || to.fullPath == '/hello/aaa') {
      next()
      return true
    }
    // Switching the route will delete the previous request
    const companyOperateStore = useCompanyOperateStoreWidthOut()
    const userStore = useUserStoreWidthOut()

    async function layzyAuthorizeList() { // 总账
      let accountList = getAuthCache(AUTHORIZE_LIST_KEY);
      if (accountList == null) {
        accountList = await getAllAccAuths({'userId': userStore.getUserInfo.id});
        setAuthCache(AUTHORIZE_LIST_KEY, accountList);
      }
      return accountList;
    }

    async function layzyAccountList() {  // 总账
      let accountList = getAuthCache(ACCOUNT_LIST_KEY);
      if (accountList == null) {
        accountList = await getAccountList();
        setAuthCache(ACCOUNT_LIST_KEY, accountList);
      }
      return accountList;
    }

    async function layzyAssetsAccountList() {  // 资产
      let accountList = getAuthCache(ACCOUNT_GDZC_LIST_KEY);
      if (accountList == null) {
        accountList = await getAssetsAccountList({'userId': userStore.getUserInfo.id});
        setAuthCache(ACCOUNT_GDZC_LIST_KEY, accountList);
      }
      return accountList;
    }

    async function layzyStockAccountList() {  // 存货
      let accountList = getAuthCache(ACCOUNT_STOCK_LIST_KEY);
      if (accountList == null) {
        accountList = await getStockAccountList({'userId': userStore.getUserInfo.id});
        setAuthCache(ACCOUNT_STOCK_LIST_KEY, accountList);
      }
      return accountList;
    }

    async function allAuthorAccountList() {  // 存货
      let accountList = getAuthCache(ACCOUNT_ALL_LIST_KEY);
      if (accountList == null) {
        accountList = await getAllAuthorAccountList({'userId': userStore.getUserInfo.id});
        setAuthCache(ACCOUNT_ALL_LIST_KEY, accountList);
      }
      return accountList;
    }
    async function layzyServerDate() {  // 存货
      let accountList = getAuthCache(APP_SERVER_DATE_KEY);
      if (accountList == null) {
        accountList = await serveDate();
        setAuthCache(APP_SERVER_DATE_KEY, accountList);
      }
      return accountList;
    }

    const res = await allAuthorAccountList()
     // console.log(`当前用户ID:${userStore.getUserInfo.id} 账套权限 `+JSON.stringify(res))
    companyOperateStore.getAuthorizeList == null && companyOperateStore.commitAuthorizeList(res['zzAuthors']);
    companyOperateStore.getAccountList == null && companyOperateStore.commitAccountList(res['zzAccount'])
    companyOperateStore.getAssetsAccountList == null && companyOperateStore.commitAssetsAccountList(res['zcAccount'])
    companyOperateStore.getStockAccountList == null && companyOperateStore.commitStockAccountList(res['chAccount'])
    companyOperateStore.getAllAuthorizeAccountList == null && companyOperateStore.commitAllAuthorizeAccountList(res['allAccount'])
    companyOperateStore.getCurrServeDate == null && companyOperateStore.commitServeDate(await layzyServerDate())
    // !window.isNcSystemLoaded && await waitLoadView() &&
    /* const authorizeList = await layzyAuthorizeList()
     companyOperateStore.getAuthorizeList == null && companyOperateStore.commitAuthorizeList(authorizeList);
     companyOperateStore.getAccountList == null && companyOperateStore.commitAccountList(await layzyAccountList())
     companyOperateStore.getAssetsAccountList == null && companyOperateStore.commitAssetsAccountList(await layzyAssetsAccountList())
     companyOperateStore.getStockAccountList == null && companyOperateStore.commitStockAccountList(await layzyStockAccountList())
     companyOperateStore.getAllAuthorizeAccountList == null && companyOperateStore.commitAllAuthorizeAccountList(await allAuthorAccountList())*/
    next()
    return true;
  });
}


