import { defHttp } from '/@/utils/http/axios'

import { getJigouListByIdParams, getJigouListByIdParamsResultModel } from './model/jigouModel'

enum Api {
  GetJigouListById = '/getJigouListById',
  GetJigouTree = '/sys/jigou/tree'
}

/**
 * @description: Get user jigou based on id
 */
export function getJigouListById(params: getJigouListByIdParams) {
  return defHttp.request<getJigouListByIdParamsResultModel>({
    url: Api.GetJigouListById,
    method: 'GET',
    params
  })
}

export function GetJigouTree() {
  return defHttp.request<getJigouListByIdParamsResultModel>({
    url: Api.GetJigouTree,
    method: 'GET',

  })
}
