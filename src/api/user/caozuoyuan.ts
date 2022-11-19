import { defHttp } from '/@/utils/http/axios'
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoByUserIdParams,
  GetUserInfoByUserIdModel
} from './model/userModel'
import { ErrorMessageMode } from '/@/utils/http/axios/types'

enum Api {
  FindAll = '/sys/user/findAll'
}

/**
 * @description: user login api
 */
export async function findAll() {
  return defHttp.request<LoginResultModel>(
    {
      url: Api.FindAll,
      method: 'GET'
    }
  )
}
