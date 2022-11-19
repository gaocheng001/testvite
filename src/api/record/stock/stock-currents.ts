// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';


export const delCGDHDverifyBaseQuantity = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/delCGDHDverifyBaseQuantity',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const delCGDHDverifyZTRKSum = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/delCGDHDverifyZTRKSum',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const subtractZTRKSum = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/subtractZTRKSum',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findStockCurr = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/findStockCurr',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByStockNumVerifyLack = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/findByStockNumVerifyLack',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
/**
 * 获取现存批次
 */
export const findXianCunBatch = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/findXianCunBatch',
    timeout: 10000000,
    method: 'GET',
    params,
  };
});
// 增加增加在途入库
export const saveZTRK_XCL = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/saveZTRK_XCL',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

// 审核时修改在途入库、现存量
export const shenheZTRK_XCL = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/shenheZTRK_XCL',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const editByIdZTRK = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/editByIdZTRK',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const editByIdCgrk = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/editByIdCgrk',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const editByIdQtrk = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/editByIdQtrk',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const editByIdXCL = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/editByIdXCL',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

/**
 * 根据id修改在途入库-相加
 */
export const editByIdZTRKAdd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/editByIdZTRKAdd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const editByIdCgrkAdd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/editByIdCgrkAdd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const editByIdQtrkAdd = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/editByIdQtrkAdd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findByXclAndKeyong = defRouteApi(async (stockNum) => {
  return {
    url: '/stock/currents/findByXclAndKeyong?stockNum='+stockNum,
    timeout: 10000000,
    method: 'POST',
  };
});
export const verifyStockRowXCL = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/verifyStockRowXCL',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const verifyStockXCLList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/verifyStockXCLList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findAvailability = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/findAvailability',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const batchSelectorList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/batchSelectorList',
    method: 'POST',
    params,
  };
});
export const batchSelectorXCLList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/batchSelectorXCLList',
    method: 'POST',
    params,
  };
});

export const getStockList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/currents/getStockList',
    method: 'POST',
    params,
  };
});

