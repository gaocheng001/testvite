import { defHttp } from '/@/utils/http/axios';

import { getCaiwuListByIdParams, getCaiwuListByIdParamsResultModel } from '/@/api/record/model/caiwuModel';

enum Api {
  GetCaiwuListById = '/record/getCaiwuAll',
}

/**
 * @description: Get user caiwu based on id
 */
// params 是getCaiwuListByIdParams 类型的
export function getCaiwuListById(params: getCaiwuListByIdParams) {
  return defHttp.request<getCaiwuListByIdParamsResultModel>({
    url: Api.GetCaiwuListById,
    method: 'GET',
    params,
  });
}
