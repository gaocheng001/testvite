// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export const findAllStockSupBalance = defRouteApi(async (params: any) => {
  return {
    url: '/stockSupBalance/findAllStockSupBalance',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
