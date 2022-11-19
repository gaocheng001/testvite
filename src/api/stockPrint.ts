import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findStockPrintAllByCcode = defRouteApi( async (params) => {
  return {
    url:'/stockPrint/findAllByCcode',
    method: 'GET',
    params
  };
});

export const findStockPrintAll = defRouteApi( async (params) => {
  return {
    url:'/stockPrint/findAll',
    method: 'GET',
    params
  };
});
