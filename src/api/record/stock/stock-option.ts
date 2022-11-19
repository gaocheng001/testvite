import {defHttp} from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const defaultXsSettingModel = {
  '1':{
    basisMap: {xsNumWs: '2',xsPriceWs: '2',xsRateWs: '2',xsRate: '13',xsDhRc: '0.06',xsZdRc:'0.36',xsLiucheng:'1',xsPriceZdsjPwd:''},
    controlList:['xsKzqxCust','xsShXkd','xsThXhd','xsSaveCheck','xsPriceCxkh','xsPriceZjyc']
  },
  '2':{
    basisMap: {cgNumWs: '2',cgPriceWs: '2',cgRateWs: '2',cgRate: '13',cgLiucheng:'1',cgPriceZgjjPwd:''},
    controlList:['cgKzqxSup','cgShDhd','cgThDhd','cgSaveCheck','cgPriceIsRate','cgPriceZjyc']
  },
  '3':{
    basisMap: {kcNumWs: '2',kcPriceWs: '2',kcCostAccounting: '1',kcEstimated: '1'},
    controlList:['kcKzqxDepot','kcCgrkSaveCheck','kcXsckSaveCheck','kcJcjrCheck',/*'kcCgrkCheck','kcXsckCheck','kcQtcrkCheck'*/]
  }
}

export function getCurrDefaultModel(type){
  return defaultXsSettingModel[type]
}

export async function getGlobalFinanceSettingInfo(accId: string) {
  let dataModel = defaultSettingModel
  if (null == accId || accId == '') return dataModel
  let res = {} //await getFinanceSettingInfo({'accId': accId})
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


export const saveOption = defRouteApi(async (params) => {
  return {
    url: '/stock/option',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const findOption = defRouteApi(async (params) => {
  return {
    url: '/stock/option',
    timeout: 100000000000,
    method: 'GET',
    params
  };
});
