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
//list
export const findAll = defRouteApi(async (params) => {
  return {
    url: '/stockPrice/findAll',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});

export const savePrice = defRouteApi(async (params) => {
  return {
    url: '/stockPrice/save',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
//list
export const improtExcel = defRouteApi(async (params) => {
  return {
    url: '/stockPrice/improtExcel',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const clearList = defRouteApi(async (params) => {
  return {
    url: '/stockPrice/clearList',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const findListByTypeAndId = defRouteApi(async ({type,id}) => {
  return {
    url: '/sys/unitmea/findListByTypeAndId/'+type+'/'+id,
    timeout: 100000000000,
    method: 'GET',
  };
});
export const saveMx = defRouteApi(async (params) => {
  return {
    url: '/stockPrice/saveMx',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
export const getPriceDataByStockNum = defRouteApi(async (stockNum) => {
  return {
    url: '/stockPrice/getPriceDataByStockNum/'+stockNum,
    timeout: 100000000000,
    method: 'GET',
  };
});

export const savePriceTwo = defRouteApi(async (params) => {
  return {
    url: '/stockPrice/savePrice',
    timeout: 100000000000,
    method: 'POST',
    params
  };
});
