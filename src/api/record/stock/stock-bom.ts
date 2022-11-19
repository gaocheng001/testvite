// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const findBillByCondition = defRouteApi(async (params: any) => {
  return {
    url: '/stock/bom/findBillByCondition',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const bomSave = defRouteApi(async (params: any) => {
  return {
    url: '/stock/bom',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findAllPage = defRouteApi(async (params: any) => {
  return {
    url: '/stock/bom/findAll',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findEntryList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/bom/findEntryListById',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const reviewReceipt = defRouteApi(async (params: any) => {
  return {
    url: '/stock/bom/review',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const bomDel = defRouteApi(async (params: any) => {
  return {
    url: '/stock/bom',
    timeout: 10000000,
    method: 'DELETE',
    params,
  };
});

export const bomVerify  = defRouteApi(async (params: any) => {
  return {
    url: '/stock/bom/verify',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const isBomVerify  = defRouteApi(async (params: any) => {
  return {
    url: '/stock/bom/verifyComp',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findByBomUniqueId  = defRouteApi(async (params: any) => {
  return {
    url: '/stock/bom/findByBomUniqueId',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
