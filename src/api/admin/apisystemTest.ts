import { defHttp } from '/@/utils/http/axios'
import { GetJigouInfoModel } from './model/jigou'

enum Api {
  //
  GetAll_INFO = '/api/apisystemTest/getAll'

// ACCOUNT_INFO2 = '/api/administrativeZone/getone';
}

// Get personal center-basic settings
export function getApisystemTestAll() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.GetAll_INFO,
    method: 'GET'
  })
}

//
// export function getAdministrativeZoneOne() {
//   return defHttp.request<GetJigouInfoModel>({
//     url: Api.ACCOUNT_INFO2,
//     method: 'GET',
//   });
// }
