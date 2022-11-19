import { defHttp } from '/@/utils/http/axios'

import { getDeptListByIdParams, getDeptListByIdParamsResultModel } from './model/deptModel'

enum Api {
  GetDeptListById = '/record/getDeptAll',
  // GetDeptListOneById = '/record/getDeptOne',

}

/**
 * @description: Get user dept based on id
 */
// params 是getDeptListByIdParams 类型的
export function getDeptListById(params: getDeptListByIdParams) {
  return defHttp.request<getDeptListByIdParamsResultModel>({
    url: Api.GetDeptListById,
    method: 'GET',
    params
  })
}

// export function getDeptListOneById(params: getDeptListOneByIdParams) {
//   return defHttp.request<getDeptListOneByIdParamsResultModel>({
//     url: Api.GetDeptListOneById,
//     method: 'GET',
//     params,
//   });
// }
