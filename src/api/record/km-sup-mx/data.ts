import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

enum Api {
  findAll = '/KeMuSupMingXi/findAll',
}

//科目部门明细列表
export const findAll = defRouteApi(async (params) => {
  return {
    url: Api.findAll,
    method: 'POST',
    params,timeout: 100000000000,
  };
});
export const exportAll = defRouteApi(async (params) => {
  return {
    url: '/KeMuSupMingXi/exportAll',
    method: 'POST',
    params,timeout: 100000000000,
  };
});
export const exportAll2 = defRouteApi(async (params) => {
  return {
    url: '/KeMuSupMingXi/exportAll2',
    method: 'POST',
    params,timeout: 100000000000,
  };
});
