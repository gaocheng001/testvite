// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";


export const stockArCustFindAll = defRouteApi( async (params) => {
    return {
      url:'/stock_ar_cust/findAll',
      method: 'POST',
      timeout: 100000000000,
      params
    };
  }
);
export const stockArCustSave = defRouteApi( async (params) => {
    return {
      url:'/stock_ar_cust/save',
      method: 'POST',
      timeout: 100000000000,
      params
    };
  }
);

export const delSrCustByCustId = defRouteApi( async (params) => {
    return {
      url:'/stock_ar_cust/delSrCustByCustId',
      method: 'POST',
      timeout: 100000000000,
      params
    };
  }
);
export const getArCustCustId = defRouteApi( async () => {
    return {
      url:'/stock_ar_cust/getArCustCustId',
      method: 'POST',
      timeout: 100000000000,
    };
  }
);
