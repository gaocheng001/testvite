import {
  findDataBase,
  getAccountList, getAllAuthorAccountList,
  getAssetsAccountList,
  getStockAccountList
} from "/@/api/record/system/account";
import {inject} from "vue";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {getAuthCache, setAuthCache} from "/@/utils/auth";
import {
  ACCOUNT_ALL_LIST_KEY,
  ACCOUNT_GDZC_LIST_KEY,
  ACCOUNT_LIST_KEY,
  ACCOUNT_STOCK_LIST_KEY,
  AUTHORIZE_LIST_KEY
} from "/@/enums/cacheEnum";
import {getAllAccAuths} from "/@/api/record/system/financial-settings";

export async function toDatasource({accId: accountId, year}) {
  const dataBase = await findDataBase(accountId, year)
  return {schemaName: dataBase.accountMode}
}

export function useDatasourcePicker() {
  const datasourcePicker = inject('datasourcePicker')
  if (!datasourcePicker.value.enable) {
    Object.assign(datasourcePicker.value, {
      enable: false,
      panelFlag: '1',
      iyear: '',
      sysuser: useUserStoreWidthOut().getUserInfo.id,
      companyCode: '',
      companyName: '',
    })
  }
  return datasourcePicker
}


export function filterAccListByAuth(acclist, authList) {
  return acclist.filter(item => {
    for (let i = 0; i < authList.length; i++) {
      if (item.accId == authList[i].accId) {
        return true
      }
    }
    return false;
  })
}


export async function useAccountPickerParams(coInfo, year) {
  return {
    datasource: {schemaName: `${coInfo.accId}-${year}`},
    companyName: coInfo.accNameCn,
    coCode: coInfo.coCode,
    baseName: coInfo.accNameCn,
    year,
    iyear: year,
    accId: coInfo.accId,
    accountMode: (await findDataBase(coInfo.accId, year)).accountMode,
    target: coInfo
  }
}


export function getAvailableYearList(authorizationDetails, coInfo) {
  // 获取公司会计年度
  const availableYearArr = authorizationDetails.value.filter(item => coInfo.accId === item.accId)
  return availableYearArr
}

export function getAvailableYear(yearList, year) {
  if (yearList.length > 0 && yearList.filter(it => year === it.iyear).length == 0) {
    return yearList[0].iyear
  }
  return year
}

export function useAccountPickerModel(datasourcePicker, authorizationDetails, yearList) {
  return {
    async resetParams({coInfo, year}) {
      if (year == null) {
        year = datasourcePicker.value.params.year
      }
      // 获取公司会计年度
      yearList.value = getAvailableYearList(authorizationDetails, coInfo)

      // 不存在年度 赋值存在年度
      datasourcePicker.value.params.year = getAvailableYear(yearList.value, year)

      const params = await useAccountPickerParams(coInfo, datasourcePicker.value.params.year)
      // 设置参数
      datasourcePicker.value.resetParams(params)
    }
  }
}

/**
 * type 财务账套
 * 账套信息、权限信息发生变化后 重新抓取赋值
 */
export async function recrawlResetAccountCache() {
  const companyOperateStore = useCompanyOperateStoreWidthOut()

  async function layzyAuthorizeList() {
    let userStore = useUserStoreWidthOut()
    let accountList = await getAllAccAuths({'userId': userStore.getUserInfo.id});
    setAuthCache(AUTHORIZE_LIST_KEY, accountList);
    return accountList;
  }

  async function layzyAccountList() {
    let accountList = await getAccountList();
    setAuthCache(ACCOUNT_LIST_KEY, accountList);
    return accountList;
  }

  const authorizeList = await layzyAuthorizeList()
  companyOperateStore.commitAuthorizeList(authorizeList);
  companyOperateStore.commitAccountList(await layzyAccountList())
}

export async function recrawlResetAssetsAccountCache() {
  const companyOperateStore = useCompanyOperateStoreWidthOut()

  async function layzyAssetsAccountList() {
    let accountList = await getAssetsAccountList({'userId': useUserStoreWidthOut().getUserInfo.id});
    setAuthCache(ACCOUNT_GDZC_LIST_KEY, accountList);
    return accountList;
  }
  companyOperateStore.getAssetsAccountList == null && companyOperateStore.commitAssetsAccountList(await layzyAssetsAccountList())
}

export async function recrawlResetStockAccountCache() {
  const companyOperateStore = useCompanyOperateStoreWidthOut()

  async function layzyStockAccountList() {
    let accountList = await getStockAccountList({'userId': useUserStoreWidthOut().getUserInfo.id});
    setAuthCache(ACCOUNT_STOCK_LIST_KEY, accountList);
    return accountList;
  }
  companyOperateStore.getStockAccountList == null && companyOperateStore.commitStockAccountList(await layzyStockAccountList())
}
export async function recrawlResetAllAccountCache() {
  async function allAuthorAccountList() {  // 存货
    let accountList = getAuthCache(ACCOUNT_ALL_LIST_KEY);
    if (accountList == null) {
      accountList = await getAllAuthorAccountList({'userId': useUserStoreWidthOut().getUserInfo.id});
      setAuthCache(ACCOUNT_ALL_LIST_KEY, accountList);
    }
    return accountList;
  }
  const companyOperateStore = useCompanyOperateStoreWidthOut()
  const res = await allAuthorAccountList()
  // console.log(`当前用户ID:${userStore.getUserInfo.id} 账套权限 `+JSON.stringify(res))
  companyOperateStore.getAuthorizeList == null && companyOperateStore.commitAuthorizeList(res['zzAuthors']);
  companyOperateStore.getAccountList == null && companyOperateStore.commitAccountList(res['zzAccount'])
  companyOperateStore.getAssetsAccountList == null && companyOperateStore.commitAssetsAccountList(res['zcAccount'])
  companyOperateStore.getStockAccountList == null && companyOperateStore.commitStockAccountList(res['chAccount'])
  companyOperateStore.getAllAuthorizeAccountList == null && companyOperateStore.commitAllAuthorizeAccountList(res['allAccount'])
}
