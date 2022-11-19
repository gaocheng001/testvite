import { defHttp } from '/@/utils/http/axios'

import { getEmpListByIdParams, getEmpListByIdParamsResultModel } from './model/empModel'

enum Api {
  GetEmpListById = '/record/getEmpAll',
}

/**
 * @description: Get user Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getEmpListById(params: getEmpListByIdParams) {
  return defHttp.request<getEmpListByIdParamsResultModel>({
    url: Api.GetEmpListById,
    method: 'GET',
    params
  })
}
