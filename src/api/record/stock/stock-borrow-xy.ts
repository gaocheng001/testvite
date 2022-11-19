// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export const stockXyBorrowSave = defRouteApi(async (params: any) => {
  return {
    url: '/stock_xyborrow/stockXyBorrowSave',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const deleteByCcodeAndXyccode = defRouteApi(async (params: any) => {
  return {
    url: '/stock_xyborrow/deleteByCcodeAndXyccode',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});

export const findByCcodeAndXyBillStyle = defRouteApi(async (params: any) => {
  return {
    url: '/stock_xyborrow/findByCcodeAndXyBillStyle',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
