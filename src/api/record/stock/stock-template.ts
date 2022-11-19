import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findTree = defRouteApi(async (params: any) => {
  return {
    url: '/stock/template/tree',
    method: 'POST',
    params,
  };
});
export const findTable = defRouteApi(async (params: any) => {
  return {
    url: '/stock/template/table',
    method: 'POST',
    params,
  };
});
export const findStencil = defRouteApi(async (params: any) => {
  return {
    url: '/stock/template/query',
    method: 'POST',
    params,
  };
});
export const initDefault = defRouteApi(async (params: any) => {
  return {
    url: '/stock/template/init',
    method: 'POST',
    params,
  };
});
export const copyTree = defRouteApi(async (params: any) => {
  return {
    url: '/stock/template/copy',
    method: 'POST',
    params,
  };
});
export const checkName = defRouteApi(async (params: any) => {
  return {
    url: '/stock/template/check',
    method: 'POST',
    params,
  };
});
export const delTree = defRouteApi(async (params: any) => {
  return {
    url: '/stock/template',
    method: 'DELETE',
    params,
  };
});
export const modifyTable = defRouteApi(async (params: any) => {
  return {
    url: '/stock/template/modify',
    method: 'POST',
    params,
  };
});
