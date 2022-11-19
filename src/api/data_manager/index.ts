import {defHttp} from "/@/utils/http/axios";

export function importRoleApi(params) {
  return defHttp.request({
    url: '/dataManager/importRoleData',
    method: 'POST',
    params
  });
}

export function importMenuDataApi(params) {
  return defHttp.request({
    url: '/dataManager/importMenuData',
    method: 'POST',
    params
  });
}

export async function importRoleMenuDataApi(params) {
  return defHttp.request({
    url: '/dataManager/importRoleMenuData',
    method: 'POST',
    params
  });
}

