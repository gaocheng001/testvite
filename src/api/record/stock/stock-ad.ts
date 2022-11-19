// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export const findAllStockAd = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/findAllStockAd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const getNewStockAdNum = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/getNewStockAdNum',
    timeout: 10000000,
    method: 'GET',
    params,
  };
});

export const saveStockAd = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/saveStockAd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveStockAds = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/saveStockAds',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const delStockAd = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/delStockAd',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const delStockAdZip = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/delStockAdZip',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const getXyQTRKD_And_QTCKD = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/getXyQTRKD_And_QTCKD',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const getStockAdsUnitRate = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/getUnitRate',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const verifyDataState = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/verifyDataState',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});


////////////////////////// 列表
export const findByStockAdTableList = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/findByStockAdTableList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByStockAdMXTableList = defRouteApi(async (params: any) => {
  return {
    url: '/stock_ad/findByStockAdMXTableList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
