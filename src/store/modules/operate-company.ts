import {defineStore} from 'pinia';
import {store} from '/@/store';
import {filterAccListByAuth} from "/@/api/record/system/financial-settings";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
import {usePlatformsStoreWidthOut} from "/@/store/modules/platforms";

export const useCompanyOperateStore = defineStore({
  id: 'companyOperate',
  state: (): any => ({
    accountList: null, // 财务账
    authorizeList: null,
    loginDate: null,
    serverDate: null,
    schemaName: null,
    schemaYear: null,
    showLoginDate: true,
    accountPickerInfo: {},
    currentAccountInfo: {},
    assetsAccountList: null,  // 固定资产账
    stockAccountList: null,  // 存货管理账
    allAuthorizeAccountList: null // 所有已授权账套
  }),
  getters: {
    /* 获取当前租户相关信息 */
    getAccountPickerInfo() {
      return useAccountPickerCache().get()
    },
    /* 获 取当前账套实体参数 */
    getCurrentAccountInfo() {
      return useAccountPickerCache().get().target
    },
    /* 获取当前账套财务信息设置 */
    getCurrentAccountSettingInfo() {
      return useAccountPickerCache().get()?.settings
    },
    getTenentName() {
      // return this.getLoginDate.slice(0,4)!==''?this.getSchemaName + '-' +this.getLoginDate.slice(0,4):this.getSchemaName
      // 出现了 gsy-001-2021-2021
      var test = this.getLoginDate.slice(0, 4) !== '' ? this.getSchemaName + '-' + this.getLoginDate.slice(0, 4) : this.getSchemaName
      if (test.split('-').length === 4) {
        test = test.substring(0, test.length - 5);
      }
      return test
    },
    getTenentCoCode() {
      return this.accountList[0].coCode
    },
    getSchemaName() {
      if (this.schemaName == null) {
        const cacheSchemaName = window.localStorage.getItem('schemaName')
        if (cacheSchemaName != null) {
          this.schemaName = cacheSchemaName
        }
      }
      return this.schemaName;
    },
    getSchemaYear() {
      this.schemaYear
    },
    getAccountList() {
      return this.accountList;
    },
    getAuthorizeList() {
      return this.authorizeList;
    },
    getAccountAuthorizeList() {
      return filterAccListByAuth(this.accountList,this.authorizeList);
    },
    getShowLoginDate() {
      if (window.localStorage.getItem('loginDate') == null) {
        this.showLoginDate = true
      } else {
        this.showLoginDate = false

      }
      return this.showLoginDate

    },
    getLoginDate() {
      if (this.loginDate == null) {
        this.loginDate = window.localStorage.getItem('loginDate')
      }
      return this.loginDate;
    },
    getAssetsAccountList(){
      return this.assetsAccountList
    },
    getStockAccountList(){
      return this.stockAccountList
    },
    getAllAuthorizeAccountList(){
      return this.allAuthorizeAccountList
    },
    getCurrServeDate(){
      return this.serverDate
    },
  },
  actions: {
    setAccountPickerInfo(accountPickerInfo) {
      const currentPlatform = usePlatformsStoreWidthOut().getCurrentPlatform
      window.localStorage.setItem('accountPickerInfo', JSON.stringify(accountPickerInfo))
      window.localStorage.setItem('schemaName', accountPickerInfo.accId)

    },
    setSchemaYear(schemaYear) {
      this.schemaYear = schemaYear
    },
    commitShowLoginDate(showLoginDate) {
      this.showLoginDate = showLoginDate
    },
    commitLoginDate(loginDate) {
      window.localStorage.setItem('loginDate', loginDate)
      this.loginDate = loginDate;
    },
    commitSchemaName(schemaName) {
      this.schemaName = schemaName;
      this.currentAccountInfo = this.accountList.filter(item => item.accId == schemaName)[0]
      window.localStorage.setItem('schemaName', schemaName)
      window.localStorage.setItem('accountInfo', JSON.stringify(this.currentAccountInfo))
      const datasource = {databaseName: '', schemaName};
      window.localStorage.setItem('datasource', JSON.stringify(datasource));
    },
    commitAccountList(items) {
      this.accountList = items;
    },
    commitAuthorizeList(items) {
      this.authorizeList = items;
    },
    commitAccountSelectFirst() {
      this.commitSchemaName(this.accountList[0].accId);
    },
    commitAssetsAccountList(items) {
      this.assetsAccountList = items
    },
    commitStockAccountList(items) {
      this.stockAccountList = items
    },
    commitAllAuthorizeAccountList(items) {
      this.allAuthorizeAccountList = items
    },
    commitServeDate(date) {
      this.serverDate = date
    },
  },
});

// Need to be used outside the setup
export function useCompanyOperateStoreWidthOut() {
  return useCompanyOperateStore(store);
}

// 财税达
// 1.做nc的凭证
// 2.做vue3版本的凭证
// 3.凭证组件修改，毫无意义
// 4.整体改成nc架构
