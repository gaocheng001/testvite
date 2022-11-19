import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get jigou Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getProjectList = defRouteApi((params:any)=> {
  return {
    url: '/project/findByClass',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAllList = defRouteApi((params:any)=> {
  return {
    url: '/project/findAllList',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const saveProject = defRouteApi((params:any)=> {
  return {
    url: '/project',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteProject = defRouteApi((params: any)=> {
  return {
    url: '/project',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteProjectList = defRouteApi((params: any)=> {
  return {
    url: '/project/deleteList',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByCode = defRouteApi((params:any)=> {
  return {
    url: '/project/findByCode',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByName = defRouteApi((params:any)=> {
  return {
    url: '/project/findByName',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelProject = defRouteApi((params:any)=> {
  return {
    url: '/project/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findProjectByCateCode = defRouteApi(({projectCateCode,itemCode,projectClassCtl}:any)=>{
  return {
    url: '/project/findByCateCode?projectCateCode='+projectCateCode+'&itemCode='+itemCode+'&projectClassCtl='+projectClassCtl,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
  }
})
export const findAllProject = defRouteApi(()=>{
  return {
    url: '/project/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
  }
})

export const findProjectDelList =  defRouteApi(()=>{
  return {
    url: '/project/findDelList',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findBukongProjectCode = defRouteApi(({num,sum,qzNum,qianzhui})=> {
  return {
    url: '/project/findBukongProjectCode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui,
    method: 'GET',
  }
})

export const findMaxProjectCode = defRouteApi(({num,sum,qzNum,qianzhui})=> {
  return {
    url: '/project/findMaxProjectCode?num='+num+'&sum='+sum+'&qzNum='+qzNum+'&qianzhui='+qianzhui,
    method: 'GET',
  }
})
