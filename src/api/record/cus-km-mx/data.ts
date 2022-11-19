import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

enum Api {
  findAll = '/CusKeMuMingXi/findAll',
}

//客户明细列表
export const findAll = defRouteApi(async (params) => {
  return {
    url: Api.findAll,
    method: 'POST',
    params,timeout: 100000000000,
  };
});
//客户明细列表
export const exportAll = defRouteApi(async (params) => {
  return {
    url: '/CusKeMuMingXi/exportAll',
    method: 'POST',
    params,timeout: 100000000000,
  };
});
//客户明细列表
export const exportAll2 = defRouteApi(async (params) => {
  return {
    url: '/CusKeMuMingXi/exportAll2',
    method: 'POST',
    params,timeout: 100000000000,
  };
});
