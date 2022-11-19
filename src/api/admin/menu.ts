import { defHttp } from '/@/utils/http/axios'
import {GetJigouInfoModel} from './model/jigou'
enum Api {
  //
  ALL_INFO = '/record/menu/getAll'
}

// Get personal center-basic settings
export function getMenuAll() {
  return defHttp.request<GetJigouInfoModel>({
    url: Api.ALL_INFO,
    method: 'GET',
  });
}
