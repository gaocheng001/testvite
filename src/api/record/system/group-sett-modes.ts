import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
/*export const findSettModesAll=defRouteApi( ()=>{
  return {
    url: '/groupSettModes/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})*/

export function findSettModesAll() {
  return defHttp.request({
    url: '/groupSettModes/findAll',
    method: 'GET',
  })
}

export function findSettModesByFlag() {
  return defHttp.request({
    url: '/groupSettModes/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

/*export function saveSettModes(params:any) {
  return defHttp.request({
    url: '/groupSettModes',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}*/
export function saveSettModes(params) {
  return defHttp.request({
    url: '/groupSettModes',
    method: 'POST',
    params
  })
}

export function deleteSettModes(params) {
  return defHttp.request({
    url: '/groupSettModes',
    method: 'DELETE',
    params
  })
}

/*export function deleteSettModes(params:any) {
  return defHttp.request({
    url: '/groupSettModes',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}*/

export function findBySettModes(settModesCode:any) {
  return defHttp.request({
    url: '/groupSettModes/findByCode?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  })
}

export function editFlag(params:any) {
  return defHttp.request({
    url: '/groupSettModes/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}
