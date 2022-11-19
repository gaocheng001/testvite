import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const findDefinedFileList=defRouteApi( ()=>{
  return{
    url: '/definedFile/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getDefinedFileList=defRouteApi( ()=>{
  return{
    url: '/definedFile/getAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveDefinedFile=defRouteApi((params:any)=>{
  return {
    url: '/definedFile',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteDefinedFile=defRouteApi((params:any)=>{
  return {
    url: '/definedFile/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteDefinedFileList=defRouteApi((params:any)=>{
  return {
    url: '/definedFile/deleteList',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByCode=defRouteApi((definedCode:any)=>{
  return {
    url: '/definedFile/findByCode?definedCode='+definedCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByName=defRouteApi((definedName:any)=>{
  return {
    url: '/definedFile/findByName?definedName='+definedName,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editByFlag=defRouteApi((params:any)=>{
  return {
    url: '/definedFile/editByFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAllDefinedFileList=defRouteApi(()=>{
  return {
    url: '/definedFile/findAllList',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByModelList=defRouteApi(({scope,model})=>{
  return {
    url: '/definedFile/findByModelList?scope='+scope+'&model='+model,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const excelDefinedFile = defRouteApi((params:any)=> {
  return {
    url: '/definedFile/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findMaxDefinedCode=defRouteApi(()=>{
  return {
    url: '/definedFile/findMaxDefinedCode',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findBukongDefinedCode=defRouteApi(()=>{
  return {
    url: '/definedFile/findBukongDefinedCode',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByModelOrderByDefinedCode=defRouteApi((model)=>{
  return {
    url: '/definedFile/findByModelOrderByDefinedCode?model='+model,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
