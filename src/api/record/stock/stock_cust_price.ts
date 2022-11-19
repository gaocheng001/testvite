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
      url:'/stockCustPrice/getAllCustTree',
      method: 'GET',
      timeout: 100000000000,
      params
    };
  }
);
//list
export const findAll = defRouteApi(async (params) => {
  return {
    url: '/stockCustPrice/findAll',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

export const savePrice = defRouteApi(async (params) => {
  return {
    url: '/stockCustPrice/save',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const delPrice = defRouteApi(async (id) => {
  return {
    url: '/stockCustPrice/del/'+id,
    timeout: 100000000000,
    method: 'GET',
  };
});
export const delCust = defRouteApi(async (id) => {
  return {
    url: '/stockCustPrice/delCust/'+id,
    timeout: 100000000000,
    method: 'GET',
  };
});

export const addCusts = defRouteApi(async (params) => {
  return {
    url: '/stockCustPrice/addCusts',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const improtExcel = defRouteApi(async (params) => {
  return {
    url: '/stockCustPrice/improtExcel',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

export const findCustAndStockPrice = defRouteApi(async (params) => {
  return {
    url: '/stockCustPrice/findCustAndStockPrice',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
