import { defHttp } from '/@/utils/http/axios'
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoByUserIdParams,
  GetUserInfoByUserIdModel
} from './model/userModel'
import { ErrorMessageMode } from '/@/utils/http/axios/types'

enum Api {
  MenusByUser = '/ncMenu/byUser',
}

export function ncMenusByUser() {
  return defHttp.request<GetUserInfoByUserIdModel>({
    url: Api.MenusByUser,
    method: 'GET'
  })
}
