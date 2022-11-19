import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get user Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function getGroupListById() {
  return defHttp.request({
    url: '/group/groupInfo/findByGroupId',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function createGroupInfo(params) {
  return defHttp.request({
    url: '/group/groupInfo',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
