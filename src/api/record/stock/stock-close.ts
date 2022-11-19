import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const closeBeforeCheck = defRouteApi(async (params: any) => {
  return {
    url: '/stockClose/check',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const closeBeforeCheckAr = defRouteApi(async (params: any) => {
  return {
    url: '/stockClose/checkAr',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
