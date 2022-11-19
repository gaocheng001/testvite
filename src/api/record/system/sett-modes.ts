import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
/*export const findSettModesAll=defRouteApi( ()=>{
  return {
    url: '/settModes/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})*/

export const findSettModesAll = defRouteApi(async () => {
  return {
    url: '/settModes/findAll',
    method: 'GET',
  };
});

export const findSettModesByFlag = defRouteApi(() => {
  return {
    url: '/settModes/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

/*export function saveSettModes(params:any) {
  return defHttp.request({
    url: '/settModes',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}*/
export const saveSettModes = defRouteApi(async (params) => {
  return {
    url: '/settModes',
    method: 'POST',
    params
  };
});

export const deleteSettModes = defRouteApi(async (params) => {
  return {
    url: '/settModes',
    method: 'DELETE',
    params
  };
});

/*export function deleteSettModes(params:any) {
  return defHttp.request({
    url: '/settModes',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  })
}*/

export const findBySettModes = defRouteApi((settModesCode:any)=> {
  return {
    url: '/settModes/findByCode?settModesCode='+settModesCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editFlag = defRouteApi((params:any)=> {
  return {
    url: '/settModes/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelSettModes = defRouteApi((params:any)=> {
  return {
    url: '/settModes/excel',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
