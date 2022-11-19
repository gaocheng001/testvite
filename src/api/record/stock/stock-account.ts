// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findList = defRouteApi(async (params: any) => {
  return {
    url: '/stock/accountSheet/findAll',
    method: 'POST',
    params
  };
});

export const xclMake = defRouteApi(async (params: any) => {
  return {
    url: '/stock/accountSheet/xclMake',
    method: 'POST',
    params
  };
});
export const pcfindAll = defRouteApi(async (params: any) => {
  return {
    url: '/stock/accountSheet/pcfindAll',
    method: 'POST',
    params
  };
});
export const findTask = defRouteApi(async () => {
  return {
    url: '/stock/accountSheet/findTask',
    method: 'GET',
  };
});
