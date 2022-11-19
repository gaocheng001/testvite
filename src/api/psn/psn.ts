import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

enum Api {
  FindAll = '/sys/psn/findAll',
  FindByFlag = '/sys/psn/findByFlag',
}

/**
 * @description: user login api
 */
export const psnFindAll = defRouteApi(async (params) => {
  return {
    url: Api.FindAll,
    method: 'GET',
    params
  };
});

export const psnFindByFlag = defRouteApi(async (params) => {
  return {
    url: Api.FindByFlag,
    method: 'GET',
    params
  };
});
