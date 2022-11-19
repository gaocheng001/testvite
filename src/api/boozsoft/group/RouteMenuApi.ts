import {defHttp} from '/@/utils/http/axios'

enum Api {
  findAll = `/sys/roleMenu/getRoleMenu`,
  savePlatforms = `/sys/roleMenu/savePlatforms`,
  saveMenus = `/sys/roleMenu/saveMenus`,
}

export const RoleMenuApi = {
  findAll: () => defHttp.get({url: Api.findAll}),
  savePlatforms: (params) => defHttp.post({url: Api.savePlatforms, params}),
  saveMenus: (params) => defHttp.post({url: Api.saveMenus, params,timeout:10000000}),
}
