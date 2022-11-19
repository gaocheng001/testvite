import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
// params 是getEmpListByIdParams 类型的
export const getCateListById = defRouteApi(()=> {
  return {
    url: '/sys/project/category/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveCate = defRouteApi((params:any)=> {
  return {
    url: '/sys/project/category',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const sysSaveCate = defRouteApi((params:any)=> {
  return {
    url: '/sys/project/category/sysSave',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteCate = defRouteApi((params:any)=> {
  return {
    url: '/sys/project/category',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteColumn = defRouteApi((params:any)=> {
  return {
    url: '/sys/project/category/deleteColumn',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const getFromEdit = defRouteApi((projectCateCode:any)=> {
  return {
    url: '/sys/project/category/fromColumnByCate?projectCateCode='+projectCateCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const apporveCate = defRouteApi((params:any)=> {
  return {
    url: '/sys/project/category/approve',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const editFlag = defRouteApi((params:any)=> {
  return {
    url: '/sys/project/category/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
