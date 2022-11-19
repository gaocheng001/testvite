import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  FindAll = '/project/category/findAll',
}

/**
 * @description: user login api
 */
export const cateFindAll = defRouteApi((params: any) => {
  return {
    url: Api.FindAll,
    method: 'GET',
    params
  }
})

export const cateFindAllList = defRouteApi((params: any) => {
  return {
    url: '/project/category/findAllList',
    method: 'GET',
    params
  }
})

export const findMaxProjectCateCode = defRouteApi((params: any) => {
  return {
    url: '/project/category/findMaxProjectCateCode',
    method: 'GET',
    params
  }
})

export const findBukongProjectCateCode = defRouteApi((params: any) => {
  return {
    url: '/project/category/findBukongProjectCateCode',
    method: 'GET',
    params
  }
})

export const columnFindCate = defRouteApi((projectCateCode:any)=> {
  return {
      url: '/project/category/findColumnByCate?projectCateCode=' + projectCateCode,
      method: 'GET',
    }
})

export const cateFindStateFlag = defRouteApi(()=> {
  return {
      url: '/project/category/findBySuccessStateAndFlag',
      method: 'GET'
    }
})
export const editFlag = defRouteApi((params:any)=> {
  return {
    url: '/project/category/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const saveCate = defRouteApi((params:any)=> {
  return {
    url: '/project/category',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteCate = defRouteApi((params:any)=> {
  return {
    url: '/project/category',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteColumn = defRouteApi((id:any)=> {
  return {
    url: '/project/category/deleteColumn?id=' + id,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findProCateByCode = defRouteApi((projectCateCode:any)=> {
  return {
      url: '/project/category/findByCode?projectCateCode=' + projectCateCode,
      method: 'GET',
    }
})

export const findProCateByName = defRouteApi((projectCateName:any)=> {
  return {
      url: '/project/category/findByName?projectCateName=' + projectCateName,
      method: 'GET',
    }
})
