// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

export const getStockBorrowNewCode = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/getStockBorrowNewCode',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const stockBorrowSave = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/StockBorrowSave',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByStockBorrow = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/findByStockBorrow',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveStockBorrowMxPojoList = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/saveStockBorrowMxPojoList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const saveStockBorrowPojo = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/saveStockBorrowPojo',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const delStockBorrowByccode = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/delStockBorrowByccode',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const delStockBorrowByCcodeZip = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/delStockBorrowByCcodeZip',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const updateStockBorrowBcheckByCcodeList = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/updateStockBorrowBcheckByCcodeList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const getReferData = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/getReferData',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByStockBorrowCcode = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/findByStockBorrowCcode',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const verifyDataState = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/verifyDataState',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});



//------------------ stock_borrows表 ----------------------
export const findByStockBorrowTableList = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/findByStockBorrowTableList',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByStockBorrowTableUnitRate = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/getUnitRate',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByStockBorrowTableLineCode = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/findByStockBorrowTableLineCode',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
export const findByStockBorrowTableCcode = defRouteApi(async (params: any) => {
  return {
    url: '/stock_borrow/findByStockBorrowTableCcode',
    timeout: 10000000,
    method: 'POST',
    params,
  };
});
