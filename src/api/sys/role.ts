import {defHttp} from '/@/utils/http/axios'

import {getJigouListByIdParams, getJigouListByIdParamsResultModel} from './model/jigouModel'

const Api = '/sys/role'

const RoleApi = {
  GetListByJigouId: Api+'/list'
}

/**
 * @description: Get user jigou based on id
 */
export function getRoleListByJigouId(params: getJigouListByIdParams) {
  return defHttp.request<getJigouListByIdParamsResultModel>({
    url: RoleApi.GetListByJigouId,
    method: 'GET',
    params
  })
}

