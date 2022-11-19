import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get jigou Emp based on id
 */
export const GetProClassTree = defRouteApi(({projectCateCode,projectClassCtl}:any)=> {
  return {
    url: '/project/class/treeProClass?projectCateCode='+projectCateCode+'&projectClassCtl='+projectClassCtl,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByProjectCateCodeAndNotJiciOrderByProjectClassCode = defRouteApi(({projectCateCode,projectClassCtl}:any)=> {
  return {
    url: '/project/class/findByProjectCateCodeAndNotJiciOrderByProjectClassCode?projectCateCode='+projectCateCode+'&projectClassCtl='+projectClassCtl,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findProClassTree = defRouteApi(({projectCateCode,projectClassCtl}:any)=> {
  return {
    url: '/project/class/treeProClass?projectCateCode='+projectCateCode+'&projectClassCtl='+projectClassCtl,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findProClassByCode = defRouteApi(({projectClassCode, projectCateCode,projectClassCtl}) => {
  return {
    url: '/project/class/findByCode?projectClassCode=' + projectClassCode + '&projectCateCode=' + projectCateCode+'&projectClassCtl='+projectClassCtl,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveProClass = defRouteApi((params:any)=> {
  return {
    url: '/project/class',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteProClass = defRouteApi((params:any)=> {
  return {
    url: '/project/class',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findClassByBend = defRouteApi(({itemCode,projectClassCtl})=> {
  return {
    url: '/project/class/findClassByBend?itemCode='+itemCode+'&projectClassCtl='+projectClassCtl,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const projectClassFindAll = defRouteApi(({itemCode,projectClassCtl}) => {
  return {
    url: '/project/class/findAll?itemCode='+itemCode+'&projectClassCtl='+projectClassCtl,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const deleteProClassByProjectCateCode = defRouteApi((projectCateCode: any) => {
  return {
    url: '/project/class/deleteByProjectCateCode?projectCateCode=' + projectCateCode,
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findById = defRouteApi((id) => {
  return {
    url: '/project/class/findById?id='+id,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByUniqueCode = defRouteApi((uniqueCode) => {
  return {
    url: '/project/class/findByUniqueCode?uniqueCode='+uniqueCode,
    method: 'GET',
  }
})
