
import { defHttp } from '/@/utils/http/axios'
enum Api {
  //
  getAll = '/chuna/zhangmu/getAll'
}

// Get personal center-basic settings
export function getZhangmuAll() {
  return defHttp.request({
    url: Api.getAll,
    method: 'GET',
  });
}
