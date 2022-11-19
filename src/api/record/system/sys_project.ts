import { defHttp } from '/@/utils/http/axios'
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getProjectList = defRouteApi((params:any)=> {
  return {
    url: '/sysProject/findByClass',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const getAccProjectList = defRouteApi((params:any)=> {
  return {
    url: '/sysProject/accFindByClass',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const saveProject = defRouteApi((params:any)=> {
  return {
    url: '/sysProject',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const sysSaveProject = defRouteApi((params:any)=> {
  return {
    url: '/sysProject/sysSave',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteProject = defRouteApi((params: any)=> {
  return {
    url: '/sysProject',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByDatabaseUniqueCode = defRouteApi((projectCateCode:any)=> {
  return {
    url: '/sysProject/findByDatabaseUniqueCode?projectCateCode='+projectCateCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const approveProject = defRouteApi((params:any)=> {
  return {
    url: '/sysProject/approve',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByCode = defRouteApi((params:any)=> {
  return {
    url: '/sysProject/findByCode',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByName = defRouteApi((params:any)=> {
  return {
    url: '/sysProject/findByName',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelProject = defRouteApi((params:any)=> {
  return {
    url: '/sysProject/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findProjectByCateCode = defRouteApi((projectCateCode:any)=>{
  return {
    url: '/sysProject/findByCateCode?projectCateCode='+projectCateCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
  }
})
