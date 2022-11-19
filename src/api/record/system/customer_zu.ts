// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const getStockCustGroupMaxCcode = defRouteApi(async () => {
  return {
    url: '/stock/custGroup/getStockCustGroupMaxCcode',
    timeout: 100000000000,
    method: 'POST',
  };
});
export const countByStockCustGroupName = defRouteApi(async (name) => {
  return {
    url: '/stock/custGroup/countByStockCustGroupName?name='+name,
    timeout: 100000000000,
    method: 'POST',
  };
});
export const saveStockCustGroupMaxCcode = defRouteApi(async (params) => {
  return {
    url: '/stock/custGroup/saveStockCustGroupMaxCcode',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findAllStockCust = defRouteApi(async () => {
  return {
    url: '/stock/custGroup/findAllStockCust',
    timeout: 100000000000,
    method: 'POST'
  };
});
export const delByStockCustCcode = defRouteApi(async (ccode) => {
  return {
    url: '/stock/custGroup/delByStockCustCcode?ccode='+ccode,
    timeout: 100000000000,
    method: 'POST'
  };
});
// 获取客户组子表-客户唯一码
export const findAllStockCustGroupsCustCode = defRouteApi(async (ccodeGroupCcode) => {
  return {
    url: '/stock/custGroups/findAllStockCustGroupsCustCode?ccodeGroupCcode='+ccodeGroupCcode,
    timeout: 100000000000,
    method: 'POST'
  };
});
// 增加客户组子表
export const saveStockCustGroupsList = defRouteApi(async (params) => {
  return {
    url: '/stock/custGroups/saveStockCustGroupsList',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const findAllStockCustGroups = defRouteApi(async (params) => {
  return {
    url: '/stock/custGroups/findAllStockCustGroups',
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const delStockCustGroupsByCustCode = defRouteApi(async ({params,ccodeGroupCcode}) => {
  return {
    url: '/stock/custGroups/delStockCustGroupsByCustCode?ccodeGroupCcode='+ccodeGroupCcode,
    timeout: 100000000000,
    method: 'POST',params
  };
});
export const deleteByCcodeGroupCcode = defRouteApi(async (ccodeGroupCcode) => {
  return {
    url: '/stock/custGroups/deleteByCcodeGroupCcode?ccodeGroupCcode='+ccodeGroupCcode,
    timeout: 100000000000,
    method: 'POST',
  };
});
export const findAllCustGroupInfo = defRouteApi(async () => {
  return {
    url: '/stock/custGroup/findAllCustGroupInfo',
    timeout: 100000000000,
    method: 'POST',
  };
});
