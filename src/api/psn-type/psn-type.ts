import { defHttp } from '/@/utils/http/axios'
import {
  LoginResultModel
} from '/@/api/sys/model/userModel'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  FindAll = '/sys/psnType/findAll'
}

/**
 * @description: user login api
 */
// export async function psnTypeFindAll() {
//   return defHttp.request<LoginResultModel>(
//     {
//       url: Api.FindAll,
//       method: 'GET'
//     }
//   )
// }

export const psnTypeFindAll = defRouteApi(()=> {
  return {
    url: Api.FindAll,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
