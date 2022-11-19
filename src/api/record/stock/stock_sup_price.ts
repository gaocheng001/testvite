import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";


//获取存货分类
export const getStockClassTree = defRouteApi( async (params) => {
    return {
      url:'/stockclass/treeStockClass',
      method: 'GET',
      timeout: 100000000000,
      params
    };
  }
);
//获取客户
export const getAllCustTree = defRouteApi( async (params) => {
    return {
      url:'/stockSupPrice/getAllCustTree',
      method: 'GET',
      timeout: 100000000000,
      params
    };
  }
);
//list
export const findAll = defRouteApi(async (params) => {
  return {
    url: '/stockSupPrice/findAll',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

export const savePrice = defRouteApi(async (params) => {
  return {
    url: '/stockSupPrice/save',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const delPrice = defRouteApi(async (id) => {
  return {
    url: '/stockSupPrice/del/'+id,
    timeout: 100000000000,
    method: 'GET',
  };
});
export const delCust = defRouteApi(async (id) => {
  return {
    url: '/stockSupPrice/delCust/'+id,
    timeout: 100000000000,
    method: 'GET',
  };
});

export const addCusts = defRouteApi(async (params) => {
  return {
    url: '/stockSupPrice/addCusts',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const stockSupPriceFindBySupIdAndStockNum = defRouteApi(async ({supId,stockNum}) => {
  return {
    url: '/stockSupPrice/findBySupIdAndStockNum?supId='+supId+'&stockNum='+stockNum,
    timeout: 100000000000,
    method: 'POST',
  };
});
export const improtExcel = defRouteApi(async (params) => {
  return {
    url: '/stockSupPrice/improtExcel',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const clearList = defRouteApi(async (params) => {
  return {
    url: '/stockSupPrice/clearList',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const saveMx = defRouteApi(async (params) => {
  return {
    url: '/stockSupPrice/saveMx',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
