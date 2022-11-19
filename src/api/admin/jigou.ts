import { defHttp } from '/@/utils/http/axios'
import {GetJigouInfoModel} from './model/jigou'
enum Api {
  //
  ACCOUNT_INFO = '/record/jigou/getAll',
  ACCOUNT_INFO2 = '/record/jigou/getone',
}

// Get personal center-basic settings
export function getJigouAll() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO,
    method: 'GET',
  });
}
export function getJigouOne() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ACCOUNT_INFO2,
    method: 'GET',
  });
}