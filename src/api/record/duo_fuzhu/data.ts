import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

export const findAll = defRouteApi(async (params) => {
  return {
    url: '/duo_fuzhuyue/findAll',
    method: 'POST',
    params,timeout: 100000000000,
  };
});

