import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {defHttp} from "/@/utils/http/axios";

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export const getBankStatementList=defRouteApi(()=> {
  return {
    url: '/bankStatement/findAll',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveBankStatement=defRouteApi((params:any)=> {
  return {
    url: '/bankStatement',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})
export const excelBankStatement=defRouteApi((params:any)=> {
  return {
    url: '/bankStatement/excel',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteBankStatement=defRouteApi((params:any)=> {
  return {
    url: '/bankStatement/del',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteBankStatementList=defRouteApi((params:any)=> {
  return {
    url: '/bankStatement/delList',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByKemuCode=defRouteApi((kemuCode:any)=> {
  return {
    url: '/bankStatement/findByKemuCode?kemuCode='+kemuCode,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByKemuAndDate=defRouteApi(({kemuCode, year, flag}:any)=> {
  return {
    url: '/bankStatement/findByKemuAndDate?kemuCode='+kemuCode+'&year='+year+'&flag='+flag,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findCodeKemuByBr=defRouteApi(()=> {
  return {
    url: '/bankStatement/findCodeKemuByBr',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export function findYearByAccount(accountId:any) {
  return defHttp.request({
    url: '/bankStatement/findYearByAccount?accountId='+accountId,
    method: 'GET',
  })
}

export const findAccountByMonth=defRouteApi(()=> {
  return {
    url: '/accvoucher/findByMonth',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findAccountByBank=defRouteApi(()=> {
  return {
    url: '/accvoucher/findByBank',
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const saveBankStatementByDuizhang=defRouteApi((params:any)=> {
  return {
    // url: '/bankStatement/duizhang',
    url: '/bankStatement/saveDuizhang',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const excelAccount=defRouteApi((params:any)=> {
  return {
    url: '/bankStatement/excelAccvoucher',
    timeout:100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const deleteAccountList=defRouteApi((params:any)=> {
  return {
    url: '/bankStatement/deleteAccountList',
    method: 'DELETE',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const verifySupplierNum=defRouteApi((num:any)=> {
  return {
    url: '/supplier/verifyCustomerNum?num=' + num,
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    }
  }
})

export const findByBankByStatementNum=defRouteApi(({kemuCode,year,flag,params}:any)=> {
  return {
    url: '/accvoucher/findByBankByStatementNum?kemuCode='+kemuCode+'&year='+year+'&flag='+flag,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findByKemuAndDateByStatementNum=defRouteApi(({kemuCode,year,flag,params}:any)=> {
  return {
    url: '/bankStatement/findByKemuAndDateByStatementNum?kemuCode='+kemuCode+'&year='+year+'&flag='+flag,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findBankStatementByKemuAndQichu = defRouteApi(({kemuCode, qichu}:any)=>{
  return {
    url: '/bankStatement/findByKemuAndQichu?kemuCode='+kemuCode+'&qichu='+qichu,
    method: 'GET',
    headers: {
      ignoreCancelToken:true
    }
  }
})

export const findAccvoucherByIperiod = defRouteApi(({ccode, iyear, iperiod}:any)=>{
  return {
    url: '/bankStatement/findAccvoucherByIperiod?ccode='+ccode+'&iyear='+iyear+'&iperiod='+iperiod,
    method: 'GET',
    headers: {
      ignoreCancelToken:true
    }
  }
})

export const saveAccvoucher = defRouteApi((params: any) => {
  return {
    url: '/bankStatement/saveAccvoucher',
    method: 'POST',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAccountByKemuAndDate = defRouteApi(({kemuCode, year, flag, params}: any) => {
  return {
    url: '/bankStatement/findAccountByKemuAndDate?kemuCode=' + kemuCode + '&year=' + year + '&flag=' + flag,
    method: 'GET',
    headers: {
      ignoreCancelToken: true
    },
    params
  }
})

export const findAccvoucherByIperiodList = defRouteApi(({ccode, iyear, iperiod1, iperiod2}:any)=>{
  return {
    url: '/bankStatement/findAccvoucherByIperiodList?ccode='+ccode+'&iyear='+iyear+'&iperiod1='+iperiod1+'&iperiod2='+iperiod2,
    method: 'GET',
    headers: {
      ignoreCancelToken:true
    }
  }
})
