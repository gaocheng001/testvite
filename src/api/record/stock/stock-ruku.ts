// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export const findBillByCondition = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/findBillByCondition',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findBillCode = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/code',
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
    url: '/stock/warehousing/code2',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const delRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing',
    timeout: 10000000,
    method: 'DELETE',
    params,
  };
});

export const delStockWareZip = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/delStockWareZip',
    method: 'POST',
    params,
  };
});
export const delSWSMx = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/delMx',
    method: 'POST',
    params,
  };
});

export const reviewRuKu = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/review',
    method: 'POST',
    params,
  };
});
export const reviewSetCGRKG = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/reviewSetCGRKG',
    method: 'POST',
    params,
  };
});
export const reviewSetCGRKGMx = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/reviewSetCGRKGMx',
    method: 'POST',
    params,
  };
});
export const xyCsourceSave = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/xyCsourceSave',
    method: 'POST',
    params,
  };
});
export const findByStockCurrLock = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/findByStockCurrLock',
    method: 'POST',
    params,
  };
});
export const saveStockCurrentstockZTRK_Increase = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/saveStockCurrentstockZTRK_Increase',
    method: 'POST',
    params,
  };
});
export const saveStockCurrentstockZTRK_Edit_XCL = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/saveStockCurrentstockZTRK_Edit_XCL',
    method: 'POST',
    params,
  };
});

export const delXyCsourceByxyCcodeAndxyBillTypeAndBillTypeAndCcode = defRouteApi(async ({xyccode,xybillStyle,billStyle,ccode}) => {
  return {
    url: '/stock/warehousing/delXyCsourceByxyCcodeAndxyBillTypeAndBillTypeAndCcode?xyccode='+xyccode+'&xybillStyle='+xybillStyle+'&billStyle='+billStyle+'&ccode='+ccode,
    method: 'POST',
  };
});
export const delXyCsourceByxyCcode = defRouteApi(async (xyccode) => {
  return {
    url: '/stock/warehousing/delXyCsourceByxyCcode?xyccode='+xyccode,
    method: 'POST',
  };
});

export const deleteByXyStyleAndBillStyleAndccode = defRouteApi(async ({xybillStyle,billStyle,ccode}) => {
  return {
    url: '/stock/warehousing/deleteByXyStyleAndBillStyleAndccode?xybillStyle='+xybillStyle+'&billStyle='+billStyle+'&ccode='+ccode,
    method: 'POST',
  };
});

export const delXyCsourceByCcodeAndBillType = defRouteApi(async ({ccode,billType}) => {
  return {
    url: '/stock/warehousing/delXyCsourceByCcodeAndBillType?ccode='+ccode+'&billType='+billType,
    method: 'POST',
  };
});
export const verifyXyCsourceByXyCode = defRouteApi(async ({year,code,xyCode}) => {
  return {
    url: '/stock/warehousing/verifyXyCsourceByXyCode?year='+year+'&code='+code+'&xyCode='+xyCode,
    method: 'POST',
  };
});
export const verifySyCsourceByXyCode = defRouteApi(async ({year,billStyle,ccode}) => {
  return {
    url: '/stock/warehousing/verifySyCsourceByXyCode?year='+year+'&billStyle='+billStyle+'&ccode='+ccode,
    method: 'POST',
  };
});
export const findByStockWareRecentlySupMoney = defRouteApi(async (supUnique) => {
  return {
    url: '/stock/warehousing/findByStockWareRecentlySupMoney?supUnique='+supUnique,
    method: 'POST',
  };
});
export const findStockWareByCcode = defRouteApi(async (ccode) => {
  return {
    url: '/stock/warehousing/findStockWareByCcode?ccode='+ccode,
    method: 'POST',
  };
});
export const findByCcodeAdnBillStyleData = defRouteApi(async (params) => {
  return {
    url: '/stock/warehousing/findByCcodeAdnBillStyleData',
    method: 'POST',params
  };
});

export const findXyCsourceByXyStyleAndXyCodeAndIyear = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/findXyCsourceByXyStyleAndXyCodeAndIyear',
    method: 'POST',
    params,
  };
});
export const saveStockWarehousing = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/saveStockWarehousing',
    method: 'POST',
    params,
  };
});
export function findStockPeriodYmFlag(iyear,flag) {
  return defHttp.request({
    url: '/stock/warehousing/findStockPeriodYmFlag?iyear='+iyear+'&flag='+flag,
    timeout: 100000000000,
    method: 'POST',
  });
}
export function findByCodeSetXyCodeBdocumStyle({syCode,billStyle}) {
  return defHttp.request({
    url: '/stock/warehousing/findByCodeSetXyCodeBdocumStyle?syCode='+syCode+'&billStyle='+billStyle,
    timeout: 100000000000,
    method: 'POST',
  });
}
export const editStockWarehousingBcheck = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/editBcheck',
    method: 'POST',
    params,
  };
});
export const delAllStockWarehousingList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/delAllList',
    method: 'POST',
    params,
  };
});
export const findAllCGDHD_And_QCDHD = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/findAllCGDHD_And_QCDHD',
    method: 'POST',
    params,
  };
});
export const findAllCGRKD_And_QCZGRKHD = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/findAllCGRKD_And_QCZGRKHD',
    method: 'POST',
    params,
  };
});

export const findAllMainList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/findAllMainList',
    method: 'POST',
    params,
  };
});
export const findAllQCZGRKD = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/findAllQCZGRKD',
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
export const findAllByCcodeAndBillStyle = defRouteApi(async ({ccode,billStyle}) => {
  return {
    url: '/stock/warehousing/findAllByCcodeAndBillStyle?ccode='+ccode+'&billStyle='+billStyle,
    method: 'POST',
  };
});
export const findByWarSearch = defRouteApi(async ({billStyle,ccode}) => {
  return {
    url: '/stock/warehousing/findByWarSearch?billStyle='+billStyle+'&ccode='+ccode,
    method: 'POST',
  };
});
export const delStockWareHCD = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/delStockWareHCD',
    method: 'POST',
    params,
  };
});
export const delXyHCD = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/delXyHCD',
    method: 'POST',
    params,
  };
});
export const verifyDataState = defRouteApi(async (params: any) => {
  return {
    url: '/stock/warehousing/verifyDataState',
    method: 'POST',
    params,
  };
});
