import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

enum Api {
  findAll = '/KeMuProMingXi/findAll',
}

export const findAll = defRouteApi(async (params) => {
  return {
    url: Api.findAll,
    method: 'POST',
    params,timeout: 100000000000,
  };
});
export const exportAll = defRouteApi(async (params) => {
  return {
    url: '/KeMuProMingXi/exportAll',
    method: 'POST',
    params,timeout: 100000000000,
  };
});
export const exportAll2 = defRouteApi(async (params) => {
  return {
    url: '/KeMuProMingXi/exportAll2',
    method: 'POST',
    params,timeout: 100000000000,
  };
});
