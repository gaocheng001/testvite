import { defHttp } from '/@/utils/http/axios'
// params 是getEmpListByIdParams 类型的
export function getCateListById() {
  return defHttp.request({
    url: '/project/category/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function saveCate(params:any) {
  return defHttp.request({
    url: '/project/category',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteCate(params:any) {
  return defHttp.request({
    url: '/project/category',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}

export function deleteColumn(id:any) {
  return defHttp.request({
    url: '/project/category/deleteColumn?id=' + id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  })
}
