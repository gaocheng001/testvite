// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";


export const stockArCustFindAll = defRouteApi( async (params) => {
    return {
      url:'/stock_ap_sup/findAll',
      method: 'POST',
      timeout: 100000000000,
      params
    };
  }
);
export const stockArCustSave = defRouteApi( async (params) => {
    return {
      url:'/stock_ap_sup/save',
      method: 'POST',
      timeout: 100000000000,
      params
    };
  }
);

export const delSrCustByCustId = defRouteApi( async (params) => {
    return {
      url:'/stock_ap_sup/delSrCustByCustId',
      method: 'POST',
      timeout: 100000000000,
      params
    };
  }
);
export const getArCustCustId = defRouteApi( async () => {
    return {
      url:'/stock_ap_sup/getArCustCustId',
      method: 'POST',
      timeout: 100000000000,
    };
  }
);
