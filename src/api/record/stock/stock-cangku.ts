// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const findByAll = defRouteApi(async (params: any) => {
  return {
    url: '/cangku/findByAll',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findAll = defRouteApi(async (params: any) => {
  return {
    url: '/cangku/findAll',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByCkNum = defRouteApi(async (ckNum: any) => {
  return {
    url: '/cangku/findByCkNum?ckNum=' + ckNum,
    timeout: 10000000,
    method: 'POST',
  };
});
export const findByCkName = defRouteApi(async (ckName: any) => {
  return {
    url: '/cangku/findByCkName?ckName=' + ckName,
    timeout: 10000000,
    method: 'POST',
  };
});
export const ckSave = defRouteApi(async (params: any) => {
  return {
    url: '/cangku/ckSave',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const delById = defRouteApi(async (params: any) => {
  return {
    url: '/cangku/delById',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const importCangku = defRouteApi(async (params: any) => {
  return {
    url: '/cangku/importCangku',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByCkIsDuli = defRouteApi(async (ckIsDuli) => {
  return {
    url: '/cangku/findByCkIsDuli?ckIsDuli='+ckIsDuli,
    timeout: 10000000,
    method: 'POST',
  };
});
export const findByCkNoIsDuliTree = defRouteApi(async () => {
  return {
    url: '/cangku/findByCkNoIsDuliTree',
    timeout: 10000000,
    method: 'POST',
  };
});

export const findByCkId = defRouteApi(async (id) => {
  return {
    url: '/cangku/findByCkId?id='+id,
    timeout: 10000000,
    method: 'POST',
  };
});
export const findByNewCkNum = defRouteApi(async () => {
  return {
    url: '/cangku/findByNewCkNum',
    timeout: 10000000,
    method: 'GET',
  };
});
