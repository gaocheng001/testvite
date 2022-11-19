import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const findProjectItemList=defRouteApi( ()=>{
  return{
    url: '/projectItem/findAll',
    method: 'GET',timeout: 100000000000,
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getProjectItemList=defRouteApi( ()=>{
  return{
    url: '/projectItem/getAll',timeout: 100000000000,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveProjectItem=defRouteApi((params:any)=>{
  return {
    url: '/projectItem',timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteProjectItem=defRouteApi((params:any)=>{
  return {
    url: '/projectItem/del',
    method: 'DELETE',timeout: 100000000000,
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteProjectItemList=defRouteApi((params:any)=>{
  return {
    url: '/projectItem/deleteList',
    method: 'DELETE',timeout: 100000000000,
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByCode=defRouteApi((itemCode:any)=>{
  return {
    url: '/projectItem/findByCode?itemCode='+itemCode,
    method: 'GET',timeout: 100000000000,
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByName=defRouteApi((itemName:any)=>{
  return {
    url: '/projectItem/findByName?itemName='+itemName,
    method: 'GET',timeout: 100000000000,
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editByFlag=defRouteApi((params:any)=>{
  return {
    url: '/projectItem/editByFlag',
    method: 'POST',timeout: 100000000000,
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAllProjectItemList=defRouteApi(()=>{
  return {
    url: '/projectItem/findAllList',
    method: 'GET',timeout: 100000000000,
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const excelProjectItem = defRouteApi((params:any)=> {
  return {
    url: '/projectItem/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
