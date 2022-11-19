import {defRouteApi} from '/@/utils/boozsoft/datasource/datasourceUtil';
import {defHttp} from '/@/utils/http/axios';

enum Api {
  findAllApi = '/home-right/findAll',
  queryDataApi = '/home-right/queryData'
}

export function findAllByPid(params: any) {
  return defHttp.request({
    url: Api.findAllApi,
    method: 'POST', params
  });
}

export function queryDataByCondition(params: any) {
  return defHttp.request({
    url: Api.queryDataApi,
    method: 'POST', params
  });
}

/*export const findByAccountInfo = defRouteApi(async () => {
  return {
    url: Api.findByAccountInfo,
    timeout: 100000000000,
    method: 'GET',
  };
});*/
