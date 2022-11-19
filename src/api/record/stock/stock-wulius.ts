// @ts-ignore
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const editStockSaleousingsIsSumWuliu = defRouteApi(async ({wuliuNum,ccode}) => {
  return {
    url: '/stock/wulius/editStockSaleousingsIsSumWuliu?wuliuNum='+wuliuNum+'&lineCode='+ccode,
    timeout: 10000000,
    method: 'POST',
  };
});

