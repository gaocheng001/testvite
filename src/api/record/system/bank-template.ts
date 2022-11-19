import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getBankTemplateList=defRouteApi(()=> {
  return {
    url: '/bankTemplate/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findBankTemplateByFlag=defRouteApi(()=> {
  return {
    url: '/bankTemplate/findByFlag',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveBankTemplate=defRouteApi((params:any)=> {
  return {
    url: '/bankTemplate',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteBankTemplate=defRouteApi((params:any)=> {
  return {
    url: '/bankTemplate/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByColumn=defRouteApi((templateId:any)=> {
  return {
    url: '/bankTemplate/findByColumn?templateId='+templateId,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByName=defRouteApi((templateName:any)=> {
  return {
    url: '/bankTemplate/findByName?templateName='+templateName,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const editFlag=defRouteApi((params:any)=> {
  return {
    url: '/bankTemplate/editFlag',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
