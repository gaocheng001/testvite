// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const wuliuCsourceSave = defRouteApi(async (params: any) => {
  return {
    url: '/stock/wuliuCsource/wuliuCsourceSave',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const wuliuCsourceDel = defRouteApi(async (params: any) => {
  return {
    url: '/stock/wuliuCsource/wuliuCsourceDel',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
