import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

enum Api {
  findAll = '/KeMuBalance/findAll',
}

//总账列表
export const findAll = defRouteApi(async (params) => {
  return {
    url: Api.findAll,
    timeout: 100000000000,
    method: 'POST',
    params,
  };
});
