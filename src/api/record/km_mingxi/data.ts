import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

enum Api {
  findAll = '/KeMuMingXi/findAll',
  finByParameterAccuracy = '/KeMuMingXi/finByParameterAccuracy',
  findAllDayBook = '/KeMuMingXi/findAllDayBook',
  findByCodeExportExcel = '/KeMuMingXi/findByCodeExportExcel',
  findByCodeExportExcel2 = '/KeMuMingXi/findByCodeExportExcel2',
}

export const findAll = defRouteApi(async (params) => {
  return {
    url: Api.findAll,
    method: 'POST',
    params,timeout: 100000000000,
  };
});
export const findAllDayBook = defRouteApi(async (params) => {
  return {
    url: Api.findAllDayBook,
    method: 'POST',
    params,timeout: 100000000000,
  };
});
// 获取账套：参数精度表
export const finByParameterAccuracy = defRouteApi(async () => {
  return {
    url: Api.finByParameterAccuracy,
    method: 'POST',timeout: 100000000000,
  };
});
// 获取账套：参数精度表
export const findByCodeExportExcel = defRouteApi(async (params) => {
  return {
    url: Api.findByCodeExportExcel,
    method: 'POST',timeout: 100000000000,params
  };
});
// 获取账套：参数精度表
export const findByCodeExportExcel2 = defRouteApi(async (params) => {
  return {
    url: Api.findByCodeExportExcel2,
    method: 'POST',timeout: 100000000000,params
  };
});
