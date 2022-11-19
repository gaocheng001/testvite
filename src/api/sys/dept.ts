import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';
import { defHttp } from '/@/utils/http/axios';

import { getJigouListByIdParams, getJigouListByIdParamsResultModel } from './model/jigouModel';
import {DeptListItem} from "/@/api/demo/model/systemModel";

enum Api {
  GetDeptListById = 'sys/department/findById',
  GetDeptTree = '/sys/department/treeDept',
  GetDeptAll = '/sys/department/all',
  GetDeptTreeByFlag = '/sys/department/treeDeptByFlag',
}

/**
 * @description: Get user jigou based on id
 */
export function getJigouListById(params: getJigouListByIdParams) {
  return defHttp.request<getJigouListByIdParamsResultModel>({
    url: Api.GetDeptListById,
    method: 'GET',
    params,
  });
}


export const GetDeptTree = defRouteApi((params)=>{
  return {
    url: Api.GetDeptTree,
    method: 'GET',
    params
  }
})

export const getDbAllData = defRouteApi(()=>{
  return {
    url: Api.GetDeptAll,
    method: 'GET',
  }
})


export const GetDeptTreeByFlag = defRouteApi(async () => ({
  url: Api.GetDeptTreeByFlag,
  method: 'GET',
}));
