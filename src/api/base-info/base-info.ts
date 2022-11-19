import { defHttp } from '/@/utils/http/axios'
import {
  LoginResultModel,
} from '/@/api/sys/model/userModel'

enum Api {
  FindAll = '/base/info/findAll'
}

/**
 * @description: user login api
 */
export async function baseInfoFindAll() {
  return defHttp.request<LoginResultModel>(
    {
      url: Api.FindAll,
      method: 'GET'
    }
  )
}

export async function columnFindTable(baseTable:any) {
  return defHttp.request<LoginResultModel>(
    {
      url: '/base/info/findColumnByTable?baseTable='+baseTable,
      method: 'GET',
    }
  )
}

export async function columnIsFlagFindTable(baseTable:any) {
  return defHttp.request<LoginResultModel>(
    {
      url: '/base/info/findColumnAndIsflagByTable?baseTable='+baseTable,
      method: 'GET',
    }
  )
}
