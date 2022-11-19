import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const findFuzhuHesuanList=defRouteApi( ()=>{
  return{
    url: '/fuzhuHesuan/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByCfield=defRouteApi( (params)=>{
  return{
    url: '/fuzhuHesuan/findByCfield',
    method: 'GET',
    params,
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const getFuzhuHesuanList=defRouteApi( ()=>{
  return{
    url: '/fuzhuHesuan/getAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveFuzhuHesuan=defRouteApi((params:any)=>{
  return {
    url: '/fuzhuHesuan',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteFuzhuHesuan=defRouteApi((params:any)=>{
  return {
    url: '/fuzhuHesuan/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteFuzhuHesuanList=defRouteApi((params:any)=>{
  return {
    url: '/fuzhuHesuan/deleteList',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByCode=defRouteApi((ccode:any)=>{
  return {
    url: '/fuzhuHesuan/findByCode?ccode='+ccode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByName=defRouteApi((cname:any)=>{
  return {
    url: '/fuzhuHesuan/findByName?cname='+cname,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})
export const findByCankaoDuixiang=defRouteApi((cankaoDuixiang:any)=>{
  return {
    url: '/fuzhuHesuan/findByCankaoDuixiang?cankaoDuixiang='+cankaoDuixiang,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editByFlag=defRouteApi((params:any)=>{
  return {
    url: '/fuzhuHesuan/editByFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAllFuzhuHesuanList=defRouteApi(()=>{
  return {
    url: '/fuzhuHesuan/findAllList',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const excelFuzhuHesuan = defRouteApi((params:any)=> {
  return {
    url: '/fuzhuHesuan/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findMaxCcode = defRouteApi(() => {
  return {
    url: '/fuzhuHesuan/findMaxCcode',
    method: 'GET'
  }
})

export const findBukongCcode = defRouteApi(() => {
  return {
    url: '/fuzhuHesuan/findBukongCcode',
    method: 'GET'
  }
})
