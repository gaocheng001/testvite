import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

/**
 * @description: Get Emp based on id
 */


export const findVoucherTypeAll = defRouteApi(async (params) => {
    return {
      url: '/voucherType/findAll',
      method: 'GET',
      params
    };
  }
);

export const saveVoucherType = defRouteApi((params:any)=> {
  return {
    url: '/voucherType',
    method: 'POST',
    params
  }
})

export const deleteVoucherType = defRouteApi((params:any)=> {
  return {
    url: '/voucherType',
    method: 'DELETE',
    params
  }
})

export const findVoucherTypeByNum = defRouteApi((voucherNum:any)=> {
  return {
    url: '/voucherType/findByNum?voucherNum='+voucherNum,
    method: 'GET',
  }
})

export const findVoucherTypeByCode = defRouteApi((voucherTypeCode:any)=> {
  return {
    url: '/voucherType/findByCode?voucherTypeCode='+voucherTypeCode,
    method: 'GET',
  }
})

export const findVoucherTypeByName = defRouteApi((voucherTypeName:any)=> {
  return {
    url: '/voucherType/findByName?voucherTypeName='+voucherTypeName,
    method: 'GET',
  }
})

export const excelVoucherType = defRouteApi((params:any)=> {
  return {
    url: '/voucherType/excel',
    method: 'POST',
    params
  }
})

export const findAccountByCode = defRouteApi((voucherTypeCode:any)=> {
  return {
    url: '/voucherType/findAccountByCode?voucherTypeCode=' + voucherTypeCode,
    method: 'GET',
  }
})
