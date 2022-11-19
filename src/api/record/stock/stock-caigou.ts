import {defRouteApi} from '/@/utils/boozsoft/datasource/datasourceUtil';

export const findStockColumnList = defRouteApi(async (params: any) => {
  return {
    url: '/api/stockColumnSettings',
    method: 'GET',
    params,
  };
});
export const saveStockColumnList = defRouteApi(async (params: any) => {
  return {
    url: '/api/stockColumnSettings',
    method: 'POST',
    params
  };
});
export const delStockColumnList = defRouteApi(async (params: any) => {
  return {
    url: '/api/stockColumnSettings',
    method: 'DELETE',
    params
  };
});

//供应商
export const findSupplierList = defRouteApi(async () => {
  return {
    url: '/caigou/findSupplierList',
    method: 'GET',
  };
});
//仓库
export const findStockCangkuList = defRouteApi(async () => {
  return {
    url: '/caigou/findStockCangkuList',
    method: 'GET',
  };
});

// 获取条件
export const findStockCaiGouList = defRouteApi(async (keys) => {
  return {
    url: '/caigou/findStockCaiGouList?types=' + keys,
    method: 'GET',
  };
});

export const findCunHuoListByCondition = defRouteApi(async (params) => {
  return {
    url: '/caigou/findCunHuoListByCondition',
    method: 'post',params
  };
});

export const findCunHuoAllList = defRouteApi(async (params) => {
  return {
    url: '/caigou/findCunHuoAllList',
    method: 'post',params
  };
});
