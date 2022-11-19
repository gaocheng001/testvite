// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export const findBillByCondition = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findBillByCondition',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findBillCode = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/code',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

/**
 * 期初到货单用到
 */
export const findBillCode2 = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/code2',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const delRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing',
    timeout: 10000000,
    method: 'DELETE',
    params,
  };
});

export const reviewRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/review',
    method: 'POST',
    params,
  };
});
export const reviewSetCGRKG = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/reviewSetCGRKG',
    method: 'POST',
    params,
  };
});
export const reviewSetCGRKGMx = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/reviewSetCGRKGMx',
    method: 'POST',
    params,
  };
});
export const xyCsourceSave = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/xyCsourceSave',
    method: 'POST',
    params,
  };
});
export const findByStockCurrLock = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findByStockCurrLock',
    method: 'POST',
    params,
  };
});
export const saveStockCurrentstockZTRK_Increase = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/saveStockCurrentstockZTRK_Increase',
    method: 'POST',
    params,
  };
});
export const saveStockCurrentstockZTRK_Edit_XCL = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/saveStockCurrentstockZTRK_Edit_XCL',
    method: 'POST',
    params,
  };
});


export const delXyCsourceByxyCcodeAndxyBillTypeAndBillTypeAndCcode = defRouteApi(async ({xyccode,xybillStyle,billStyle,ccode}) => {
  return {
    url: '/stock/saleousing/delXyCsourceByxyCcodeAndxyBillTypeAndBillTypeAndCcode?xyccode='+xyccode+'&xybillStyle='+xybillStyle+'&billStyle='+billStyle+'&ccode='+ccode,
    method: 'POST',
  };
});
export const delXyCsourceByCcodeAndBillType = defRouteApi(async ({ccode,billType}) => {
  return {
    url: '/stock/saleousing/delXyCsourceByCcodeAndBillType?ccode='+ccode+'&billType='+billType,
    method: 'POST',
  };
});
export const verifyXyCsourceByXyCode = defRouteApi(async ({year,code,xyCode}) => {
  return {
    url: '/stock/saleousing/verifyXyCsourceByXyCode?year='+year+'&code='+code+'&xyCode='+xyCode,
    method: 'POST',
  };
});
export const verifySyCsourceByXyCode = defRouteApi(async ({year,billStyle,ccode}) => {
  return {
    url: '/stock/saleousing/verifySyCsourceByXyCode?year='+year+'&billStyle='+billStyle+'&ccode='+ccode,
    method: 'POST',
  };
});
export const findByStockWareRecentlySupMoney = defRouteApi(async (supUnique) => {
  return {
    url: '/stock/saleousing/findByStockWareRecentlySupMoney?supUnique='+supUnique,
    method: 'POST',
  };
});
export const findStockWareByCcode = defRouteApi(async (ccode) => {
  return {
    url: '/stock/saleousing/findStockWareByCcode?ccode='+ccode,
    method: 'POST',
  };
});
export const findXyCsourceByXyStyleAndXyCodeAndIyear = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findXyCsourceByXyStyleAndXyCodeAndIyear',
    method: 'POST',
    params,
  };
});
export const saveStockWarehousing = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/saveStockWarehousing',
    method: 'POST',
    params,
  };
});
export function findStockPeriodYmFlag(iyear,flag) {
  return defHttp.request({
    url: '/stock/saleousing/findStockPeriodYmFlag?iyear='+iyear+'&flag='+flag,
    timeout: 100000000000,
    method: 'POST',
  });
}
export function findByCodeSetXyCodeBdocumStyle({syCode,billStyle}) {
  return defHttp.request({
    url: '/stock/saleousing/findByCodeSetXyCodeBdocumStyle?syCode='+syCode+'&billStyle='+billStyle,
    timeout: 100000000000,
    method: 'POST',
  });
}
export const editStockWarehousingBcheck = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/editBcheck',
    method: 'POST',
    params,
  };
});
export const delAllStockWarehousingList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/delAllList',
    method: 'POST',
    params,
  };
});
export const findAllCGDHD_And_QCDHD = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findAllCGDHD_And_QCDHD',
    method: 'POST',
    params,
  };
});
export const findAllMainList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/saleousing/findAllMainList',
    method: 'POST',
    params,
  };
});
// 期间是否结账
export const findByStockPeriodIsClose = defRouteApi(async ({iyear,month}) => {
  return {
    url: '/stock/warehousing/findByStockPeriodIsClose?iyear='+iyear+'&month='+month,
    method: 'POST',
  };
});
export const verifyQiShenStockWarCcode = defRouteApi(async (ccode) => {
  return {
    url: '/stock/saleousing/verifyQiShenStockWarCcode?ccode='+ccode,
    method: 'POST',
  };
});
