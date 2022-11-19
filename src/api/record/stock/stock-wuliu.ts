// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const stockWuLiuSave = defRouteApi(async (params: any) => {
  return {
    url: '/stock/wuliu/wuliuSave',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findWuLiuByCondition = defRouteApi(async (params: any) => {
  return {
    url: '/stock/wuliu/findBillByCondition',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const wuliuDel = defRouteApi(async (params: any) => {
  return {
    url: '/stock/wuliu/wuliuDel',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const editStockSaleousingDelivery = defRouteApi(async (params: any) => {
  return {
    url: '/stock/wuliu/editStockSaleousingDelivery',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findWuliuCode = defRouteApi(async (ccode) => {
  return {
    url: '/stock/wuliu/findWuliuCode?ccode='+ccode,
    timeout: 10000000,
    method: 'POST',
  };
});
export const findNewWuLiuCode = defRouteApi(async (params: any) => {
  return {
    url: '/stock/wuliu/code',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findAllWuliusList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/wuliu/findAllWuliusList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
