import {defHttp} from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {object} from "vue-types";
import {closeBill} from "/@/api/record/group/im-unit";

enum Api {
  findFinancialBasisInfoApi = '/sys/acctemplate/findBasisInfo',
  findAccoutOneApi = '/sys/account/findOne',
  findAccoutNeatApi = '/sys/account/findNeatOne',
  findAccoutInfoApi = '/sys/account/findAllInfo',
  findAccAuthsApi = '/sys/account/findAccAuths',
  resetAccAuthApi = '/sys/account/resetDefaultAccount',
  findGroupDownCountApi = '/sys/account/findGroupDownCount',
  findAccoutNeatOneApi = '/iperiod/findPeriodInfo',
  findAccoutNeatTwoApi = '/iperiod/findPeriodInfo2',
  findCloseMonthApi = '/iperiod/closeMonth',
  findCloseApi = '/iperiod/close',
  findCloseListApi = '/iperiod/closeList',
  checkPeriodApi = '/iperiod/checkPeriod',
  savePeriodApi = '/iperiod/savePeriod',
  getFixedAssetsModelApi = '/group/faAccount/getFixedAssetsModel',
  modifyPeriodApi = '/iperiod/modifyPeriod',
  modifyPeriodTwoApi = '/iperiod/modifyPeriod2',
  initNextPeriodByCodeAndYaerApi = '/iperiod/initNextPeriod',
  modifyAccoutOneApi = '/sys/account/modifyByOne',
  findQjAndJdListApi = '/iperiod/findAllByIyear',
  saveSystemQuarterly = '/iperiod/saveSystemQuarterly',
  saveQuarterlyApi = '/iperiod/saveQuarterly',
  findVoucherTypeListApi = '/voucherType/findAll',
  findVoucherTypeAuthorListApi = '/voucherType/authorizedList',
  findGroupVoucherTypeListApi = '/voucherType/group/findAll',
  saveVoucherDataApi = '/voucherType',
  delVoucherDataApi = '/voucherType',
  currentCyDatasApi = '/exchangeRate/foreignCurrency',
  findCurrencyTypeListApi = '/exchangeRate/currency',
  saveCurrencyTypeApi = '/exchangeRate/foreignCurrency',
  delCurrencyTypeApi = '/exchangeRate/foreignCurrency',
  findCurrentWbhvInfoApi = '/exchangeRate',
  findAllWbhvInfoApi = '/exchangeRate/all',
  saveWbhvInfoApi = '/exchangeRate',
  deleteWbhvInfoApi = '/exchangeRate',
  findAllWbhvEntrysApi = '/exchangeRate/entry',
  deleteWbhvEntryApi = '/exchangeRate/entry',
  parameterAccuracyApi = '/parameterAccuracy',
  saveWbhvEntrysApi = '/exchangeRate/entry',
  findAllXjOrLlListApi = '/sys/acckemu/company/findAllXjOrLlList',
  findAllMJListApi = '/sys/acckemu/company/findAllMJList',
}

const Basis = {
  basisMap: {
    'accStandard': '2',
    'ccodeLevel': '4-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2',
    'currency': 'RMB',
    'taxClass': '1',
  },
  zhiDanList: ['ichronological', 'ideficit', 'isave', 'ifreecorp'],
  pingZhenNumberList: ['ibreakCode'],
  pingZhenControlList: ['iverify', 'iverifyCancel', 'ifVerify',],
  settingList: ['ibook', 'icheckOut', 'icash'],
  dateMap: {
    'addAccDate': '1',
    'cashhierDate': '1',
    'verifyDate': '1',
    'managerDate': '1',
    'bookDate': '1',
    'wotDate': '1'
  },
  statementMap: {
    'statementFangxiang': '1',
    'cashBankDayBookSort': '1',
    'bankStatementSort': '1'
  }
}

//export const initBasisTabAccoutData = defRouteApi(()=> {return { url: Api.findFinancialBasisInfoApi, method: 'get'}})
export function initBasisTabAccoutData() {
  return defHttp.request({url: Api.findFinancialBasisInfoApi, method: 'get'})
}

export function initBasisTabData(params: any) {
  return defHttp.request({
    url: Api.findAccoutOneApi,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}


export function getThisAdInfoData(params: any) {
  return defHttp.request({
    url: Api.findAccoutNeatApi,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function getAdInfoDatas() {
  return defHttp.request({
    url: Api.findAccoutInfoApi,
    timeout: 100000000000,
    method: 'GET'
  })
}

export function getAllAccAuths(params: any) {
  return defHttp.request({
    url: Api.findAccAuthsApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}

export function resetDefaultAccount(params: any){
  return defHttp.request({
    url: Api.resetAccAuthApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}


export function currentAccountQjInfo(params: any) {
  return defHttp.request({
    url: Api.findAccoutNeatOneApi,
    timeout: 100000000000,
    method: 'GET',
    params
  })
}

export function findAccoutNeatTwoApi(params: any) {
  return defHttp.request({
    url: Api.findAccoutNeatTwoApi,
    timeout: 100000000000,
    method: 'GET',
    params
  })
}

export function findNewestCloseMonth(params: any) {
  return defHttp.request({
    url: Api.findCloseMonthApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
export function findCloseList(params: any) {
  return defHttp.request({
    url: Api.findCloseListApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}

export function closeBill(params: any) {
  return defHttp.request({
    url: Api.findCloseApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
export function currentAccountYaerQjAndJdList(params: any) {
  return defHttp.request({
    url: Api.findQjAndJdListApi,
    timeout: 100000000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function saveQjJdQuarterly(params: any) {
  return defHttp.request({
    url: Api.saveQuarterlyApi,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function saveSystemQuarterly(params: any) {
  return defHttp.request({
    url: Api.saveSystemQuarterly,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export const saveVoucherData = defRouteApi(async (params) => {
  return {
    url: Api.saveVoucherDataApi,
    timeout: 100000000000,
    method: 'POST',
    params
  };
});


export const saveCsData = defRouteApi(async (params) => {
  return {
    url: Api.parameterAccuracyApi,
    timeout: 100000000000,
    method: 'POST',
    params
  };
});


export function delVoucherData(params: any) {
  return defHttp.request({
    url: Api.delVoucherDataApi,
    timeout: 100000000000,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function delAccountData(params: any) {
  return defHttp.request({
    url: '/corpBank/del',
    timeout: 100000000000,
    method: 'delete',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function modifyBasisTabDBData(params: any) {
  return defHttp.request({
    url: Api.modifyAccoutOneApi,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function modifyPeriodDBDataByAccId(params: any) {
  return defHttp.request({
    url: Api.modifyPeriodApi,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
export function modifyPeriodDBDataByAccIdAndYaer(params: any) {
  return defHttp.request({
    url: Api.modifyPeriodTwoApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
export function initNextPeriodByCodeAndYaer(params: any) {
  return defHttp.request({
    url: Api.initNextPeriodByCodeAndYaerApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}

export function initBasisTabDataDefault() {
  return Basis
}

/*export function currentAccountTypes(params){
  return defHttp.request({
    url: Api.findVoucherTypeListApi,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}*/

export function findGroupVoucherTypes(params) {
  return defHttp.request({
    url: Api.findGroupVoucherTypeListApi,
    timeout: 100000000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export const currentAccountTypes = defRouteApi(async (params) => {
  return {
    url: Api.findVoucherTypeListApi,
    timeout: 100000000000,
    method: 'GET',
    params
  };
});
export const findVoucherTypeAuthorList = defRouteApi(async (params) => {
  return {
    url: Api.findVoucherTypeAuthorListApi,
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

/*export const currentAccountTypes = defRouteApi(async(params)=>{
  return {
    url: Api.findVoucherTypeListApi,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})*/

export function findCurrencyTypeList(params: any) {
  return defHttp.request({
    url: Api.findCurrencyTypeListApi,
    timeout: 100000000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

// export function currentCyDatas(params: any) {
//   return defHttp.request({
//     url: Api.currentCyDatasApi,
//     method: 'GET',
//     headers: {
//       ignoreCancelToken: true
//     },
//     params
//   })
// }
export const currentCyDatas = defRouteApi(async (params) => {
  return {
    url: Api.currentCyDatasApi,
    timeout: 100000000000,
    method: 'GET',
    params
  };
});


export const parameterAccuracyDatas = defRouteApi(async (params) => {
  return {
    url: Api.parameterAccuracyApi,
    timeout: 100000000000,
    method: 'GET',params
  }
})

// export function saveCurrencyData(params: any) {
//   return defHttp.request({
//     url: Api.saveCurrencyTypeApi,
//     method: 'POST',
//     headers: {
//       ignoreCancelToken: true
//     },
//     params
//   })
// }
export const saveCurrencyData = defRouteApi(async (params) => {
  return {
    url: Api.saveCurrencyTypeApi,
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

export const deleteCurrencyData = defRouteApi(async (params) => {
  return {
    url: Api.saveCurrencyTypeApi,
    timeout: 100000000000,
    method: 'DELETE',
    params
  };
});


/*export function findCurrentWbhvInfo(params: any) {
  return defHttp.request({
    url: Api.findCurrentWbhvInfoApi,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}*/

export const findCurrentWbhvInfo = defRouteApi(async (params) => {
  return {
    url: Api.findCurrentWbhvInfoApi,
    timeout: 100000000000,
    method: 'GET',
    params
  };
});

export const findAllWbhvInfo = defRouteApi(async (params) => {
  return {
    url: Api.findAllWbhvInfoApi,
    timeout: 100000000000,
    method: 'GET',
    params
  };
});


export const saveWbhvData = defRouteApi(async (params) => {
  return {
    url: Api.saveWbhvInfoApi,
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

/*export function saveWbhvData(params: any) {
  return defHttp.request({
    url: Api.saveWbhvInfoApi,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}*/

export const deleteWbData = defRouteApi(async (params) => {
  return {
    url: Api.deleteWbhvEntryApi,
    timeout: 100000000000,
    method: 'DELETE',
    params
  };
});
export const deleteWbInfo = defRouteApi(async (params) => {
  return {
    url: Api.deleteWbhvInfoApi,
    timeout: 100000000000,
    method: 'DELETE',
    params
  };
});

/*export function deleteWbData(params: any) {
  return defHttp.request({
    url: Api.deleteWbhvEntryApi,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}*/
export const deleteCsData = defRouteApi(async (params) => {
  return {
    url: Api.parameterAccuracyApi,
    timeout: 100000000000,
    method: 'DELETE',
    params
  };
});

export const findAllXjOrLlList = defRouteApi(() => {
  return {
    url: Api.findAllXjOrLlListApi,
    timeout: 100000000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export function findAllMJList(params: any) {
  return defHttp.request({
    url: Api.findAllMJListApi,
    timeout: 100000000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export const findAllWbhvEntrys = defRouteApi(async (params: any) => {
  return {
    url: Api.findAllWbhvEntrysApi,
    timeout: 100000000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const saveWbhvEntrys = defRouteApi(async (params: any) => {
  return {
    url: Api.saveWbhvEntrysApi,
    timeout: 100000000000,
    method: 'POST',
    params
  }
})

/*export function saveWbhvEntrys(params: any) {
  return defHttp.request({
    url: Api.saveWbhvEntrysApi,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}*/

export function saveAIData(params: any) {
  return defHttp.request({
    url: '/corpBank',
    timeout: 100000000000,
    method: 'post',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function findCorpBankAll() {
  return defHttp.request({
    url: '/corpBank/findAll',
    timeout: 100000000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
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

export const defaultSettingModel = {
  basisMap: {
    'accStandard': '2',
    'ccodeLevel': '4-2-2-2',
    'currency': 'RMB',
    'taxClass': '1',
    'accName': '',
    'unitName': '',
  },
  zhiDanList: ['ichronological', 'ideficit', 'isave', 'ifreecorp'],
  pingZhenNumberList: ['ibreakCode'],
  pingZhenControlList: ['iverify', 'iverifyCancel', 'ifVerify',],
  settingList: ['ibook', 'icheckOut', 'icash','projectClassCtl'],
  dateMap: {
    'addAccDate': '1',
    'cashhierDate': '1',
    'verifyDate': '1',
    'managerDate': '1',
    'bookDate': '1',
    'wotDate': '1'
  },
  statementMap: {
    'statementFangxiang': '1',
    'cashBankDayBookSort': '1',
    'bankStatementSort': '1'
  }
}

export function getFinanceSettingInfo(params: any) {
  return defHttp.request({
    url: Api.findAccoutOneApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
export function checkPeriod(params: any) {
  return defHttp.request({
    url: Api.checkPeriodApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
export function savePeriod(params: any) {
  return defHttp.request({
    url: Api.savePeriodApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}


export function findGroupDownCount() {
  return defHttp.request({
    url: Api.findGroupDownCountApi,
    method: 'GET'
  })
}
export async function getGlobalFinanceSettingInfo(accId: string) {
  let dataModel = defaultSettingModel
  if (null == accId || accId == '') return dataModel
  let res = await getFinanceSettingInfo({'accId': accId})
  if (null != res && res.basisMap.length != 0) {
    dataModel.basisMap = res.basisMap
    if (res.zhiDanList.length != 0)
      dataModel.zhiDanList = res.zhiDanList

    if (res.pingZhenNumberList.length != 0)
      dataModel.pingZhenNumberList = res.pingZhenNumberList

    if (res.pingZhenControlList.length != 0)
      dataModel.pingZhenControlList = res.pingZhenControlList

    if (res.settingList.length != 0)
      dataModel.settingList = res.settingList

    if (Object.keys(res.dateMap).length != 0)
      dataModel.dateMap = res.dateMap
  }
  return dataModel
}

export function assemblyPingZhengApproveCanshu(dataModel:any) {
  if (null == dataModel ) return null
  let defaultFinancialParameters = {
    icashier: false, // 出纳必须出纳签字
    icashierNo: false, // 取消需为同一人
    iverify: false, //制单与审批同一人
    iverifyCancel: false, // 取消需为同一人
    imanager: false, // 必须主管签字
    icdirectorNo: false, // 取消需为同一人
    ifVerify: false, // 凭证记账必须主管签字
    iotherAccvouch:false, // 准许修改凭证
    projectClassCtl: false, // 是否项目大类控制科目及项目
  }
  Object.keys(defaultFinancialParameters).map(key=>{
    if (dataModel.pingZhenControlList.indexOf(key) != -1)
      defaultFinancialParameters[key] = true
    if (dataModel.settingList.indexOf(key) != -1)
      defaultFinancialParameters[key] = true
      return key;
  })
  return defaultFinancialParameters
}

export function getFixedAssetsModel(params: any) {
  return defHttp.request({
    url: Api.getFixedAssetsModelApi,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
