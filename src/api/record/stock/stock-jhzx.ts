import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const saveJhzx = defRouteApi(async (params: any) => {
  return {
    url: '/stock/jhzx',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});


export const modifyJhzx = defRouteApi(async (params: any) => {
  return {
    url: '/stock/jhzx/modify',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findBillCode = defRouteApi(async (params: any) => {
  return {
    url: '/stock/jhzx/code',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/jhzx/findByList',
    method: 'POST',
    params,
  };
});
export const findByCode = defRouteApi(async (params: any) => {
  return {
    url: '/stock/jhzx/findByCode',
    method: 'POST',
    params,
  };
});
export const review = defRouteApi(async (params: any) => {
  return {
    url: '/stock/jhzx/review',
    method: 'POST',
    params,
  };
});
export const dels = defRouteApi(async (params: any) => {
  return {
    url: '/stock/jhzx/dels',
    method: 'POST',
    params,
  };
});
