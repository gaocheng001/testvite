// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";


export const getStockArBalanceMaxIineId = defRouteApi( async (iyear) => {
    return {
      url:'/stock_ar_balance/getStockArBalanceMaxIineId?iyear='+iyear,
      method: 'POST',
      timeout: 100000000000,
    };
  }
);
export const stockArBalanceSave = defRouteApi( async (params) => {
    return {
      url:'/stock_ar_balance/stockArBalanceSave',
      method: 'POST',
      timeout: 100000000000,params
    };
  }
);
export const stockArBalanceEdit = defRouteApi( async (params) => {
    return {
      url:'/stock_ar_balance/stockArBalanceEdit',
      method: 'POST',
      timeout: 100000000000,params
    };
  }
);

export const findByStockArBalance = defRouteApi( async (params) => {
    return {
      url:'/stock_ar_balance/findByStockArBalance',
      method: 'POST',
      timeout: 100000000000,params
    };
  }
);
export const auditStockArBalance = defRouteApi(async (params) => {
  return {
    url: '/stock_ar_balance/auditStockArBalance',timeout: 100000000000,
    method: 'POST',params
  };
});
export const delStockArBalance = defRouteApi(async (params) => {
  return {
    url: '/stock_ar_balance/delStockArBalance',timeout: 100000000000,
    method: 'POST',params
  };
});
export const countByCustIdAndIyearAndBcheck = defRouteApi(async (params) => {
  return {
    url: '/stock_ar_balance/countByCustIdAndIyearAndBcheck',timeout: 100000000000,
    method: 'POST',params
  };
});



/************************************* 任务 *******************************************/
export const getByStockArBalanceTask = defRouteApi(async (iyear) => {
  return {
    url: '/stock_ar_balance/getByStockArBalanceTask?iyear='+iyear,timeout: 100000000000,
    method: 'GET',
  };
});
export const stockArBalanceTaskSave = defRouteApi(async (params) => {
  return {
    url: '/stock_ar_balance/stockArBalanceTaskSave',timeout: 100000000000,
    method: 'POST',params
  };
});
export const stockArBalanceTaskEditNewTime = defRouteApi(async (id) => {
  return {
    url: '/stock_ar_balance/stockArBalanceTaskEditNewTime?id='+id,timeout: 100000000000,
    method: 'POST',
  };
});
export const stockArBalanceTaskDelByUserName = defRouteApi(async (params) => {
  return {
    url: '/stock_ar_balance/stockArBalanceTaskDelByUserName',timeout: 100000000000,
    method: 'POST',params
  };
});
