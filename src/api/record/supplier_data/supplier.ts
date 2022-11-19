// @ts-ignore
import {defHttp} from '/@/utils/http/axios';
// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

enum Api {
  findAll = '/supplier/findAll',
  findById = '/supplier/findById',
  findAllByFlag = '/supplier/findAllByFlag',
  findAllCountry = '/supplier/findAllCountry',
  findAllSysTradeNature = '/supplier/findAllSysTradeNature',
  customerAddApi = '/supplier/save',
  saveCus = '/supplier/saveCus',
  allotSave = '/supplier/allotSave',
  duLiSaveApi = '/supplier/duLiSave',
  verifyCustomerId = '/supplier/verifyCustomerId',
  verifyCustAccount = '/supplier/verifyCustAccount',
  verifyCustomerName = '/supplier/verifyCustomerName',
  verifyCustomerNum = '/supplier/verifyCustomerNum',
  verifyByCustAbbname = '/supplier/verifyByCustAbbname',
  verifyByCustSregcode = '/supplier/verifyByCustSregcode',
  findByDatabaseUniqueCode = '/supplier/findByDatabaseUniqueCode',
  updateKeyWordIsAutoSave = '/supplier/updateKeyWordIsAutoSave',
  editDatabaseApi = '/supplier/editDatabaseApi',
  exportExcelFindAllJSON = '/supplier/exportExcelFindAllJSON',
  importCus = '/supplier/importCus',
  editCusFlag = '/supplier/editCusFlag',
  countAccVoucheryByCusUnique = '/supplier/countAccVoucherByCusUnique',
  countAccVoucherByCusUnique20 = '/supplier/countAccVoucherByCusUnique20',
  countAccVoucherByCusUnique21 = '/supplier/countAccVoucherByCusUnique21',
  delCus = '/supplier/delCus',
  delCusArr = '/supplier/delCusArr',
  findAllByUniqueCustclass = '/supplier/findAllByUniqueCustclass',
  findAllByAllotRecordCus = '/supplier/findAllByAllotRecordCus',
  findAllOrderByCustCode = '/supplier/findAllOrderByCustCode',
  custCountAll = '/supplier/custCountAll',
  getSupAll = '/supplier/getSupAll',
}

export const getSupAll = defRouteApi(async () => {
  return {
    timeout: 100000000000,
    url: Api.getSupAll,
    method: 'GET',
  };
});
export const custCountAll = defRouteApi(async () => {
  return {
    timeout: 100000000000,
    url: Api.custCountAll,
    method: 'GET',
  };
});

export const findById = defRouteApi(async (id) => {
  return {
    timeout: 100000000000,
    url: Api.findById + '?id=' + id,
    method: 'GET',
  };
});
export const findAllOrderByCustCode = defRouteApi(async () => {
  return {
    timeout: 100000000000,
    url: Api.findAllOrderByCustCode,
    method: 'GET',
  };
});

export const findAllByAllotRecordCus = defRouteApi(async (accId) => {
  return {
    timeout: 100000000000,
    url: Api.findAllByAllotRecordCus + '?accId=' + accId,
    method: 'POST',
  };
});

/* 导出信息 */
export async function exportExcelFindAllJSON() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.exportExcelFindAllJSON,
    method: 'GET',
  });
}

export function findByDatabaseUniqueCode() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findByDatabaseUniqueCode,
    method: 'POST',
  });
}

export const verifyByCustSregcode = defRouteApi(async (custSregcode) => {
  return {
    timeout: 100000000000,
    url: Api.verifyByCustSregcode + '?custSregcode=' + custSregcode,
    method: 'POST',
  };
});

export const verifyByCustAbbname = defRouteApi(async (custAbbname) => {
  return {
    timeout: 100000000000,
    url: Api.verifyByCustAbbname + '?custAbbname=' + custAbbname,
    method: 'POST',
  };
});

export const verifyCustomerNum = defRouteApi(async (num) => {
  return {
    timeout: 100000000000,
    url: Api.verifyCustomerNum + '?num=' + num,
    method: 'POST',
  };
});

export const verifyCustomerName = defRouteApi(async (name) => {
  return {
    timeout: 100000000000,
    url: Api.verifyCustomerName + '?name=' + name,
    method: 'POST',
  };
});

export const verifyCustAccount = defRouteApi(async (bankNum) => {
  return {
    timeout: 100000000000,
    url: Api.verifyCustAccount + '?bankNum=' + bankNum,
    method: 'POST',
  };
});

export const verifyCustomerId = defRouteApi(async (id) => {
  return {
    timeout: 100000000000,
    url: Api.verifyCustomerId + '?id=' + id,
    method: 'POST',
  };
});


/* 获取启用中的客户信息 */
export const findAllByFlag = defRouteApi(async (flag) => {
  return {
    timeout: 100000000000,
    url: Api.findAllByFlag + '?flag=' + flag,
    method: 'GET',
  };
});

/* 获取国家信息*/
export async function findAllCountry() {
  return defHttp.request({
    url: Api.findAllCountry,
    timeout: 100000000000,
    method: 'GET',
  });
}

/* 获取行业性质信息*/
export async function findAllSysTradeNature() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllSysTradeNature,
    method: 'GET',
  });
}

export const findAll = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: Api.findAll,
    method: 'POST',
    params,
  };
});
export const findAllParent = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/supplier/findAllParent',
    method: 'POST',
    params,
  };
});

export const customerAddApi = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: Api.customerAddApi,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});

export const saveCus = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: Api.saveCus,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});

export const allotSave = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: Api.allotSave,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});

export const duLiSaveApi = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: Api.duLiSaveApi,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params,
  };
});

export const importCus = defRouteApi(async ({params, userid}) => {
  return {
    url: Api.importCus + '?userid=' + userid,
    timeout: 100000000000,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
    params
  };
});

export function updateKeyWordIsAutoSave(params: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.updateKeyWordIsAutoSave,
    method: 'POST',
    params,
  });
}

export const editDatabaseApi = defRouteApi(async ({params, username}) => {
  return {
    timeout: 100000000000,
    url: Api.editDatabaseApi + '?username=' + username,
    method: 'POST',
    params,
  };
});
export const editCusFlag = defRouteApi(async ({id, flag}) => {
  return {
    timeout: 100000000000,
    url: Api.editCusFlag + '?id=' + id + '&flag=' + flag,
    method: 'POST',
  };
});
export const countAccVoucheryByCusUnique = defRouteApi(async ({cusUnique}) => {
  return {
    timeout: 100000000000,
    url: Api.countAccVoucheryByCusUnique + '?cusUnique=' + cusUnique,
    method: 'POST',
  };
});
export const countAccVoucherByCusUnique20 = defRouteApi(async ({cusUnique}) => {
  return {
    timeout: 100000000000,
    url: Api.countAccVoucherByCusUnique20 + '?cusUnique=' + cusUnique,
    method: 'POST',
  };
});
export const countAccVoucherByCusUnique21 = defRouteApi(async ({cusUnique}) => {
  return {
    timeout: 100000000000,
    url: Api.countAccVoucherByCusUnique21 + '?cusUnique=' + cusUnique,
    method: 'POST',
  };
});
export const delCus = defRouteApi(async ({id}) => {
  return {
    timeout: 100000000000,
    url: Api.delCus + '?id=' + id,
    method: 'POST',
  };
});
export const delCusArr = defRouteApi(async ({id}) => {
  return {
    timeout: 100000000000,
    url: Api.delCusArr + '?id=' + id,
    method: 'POST',
  };
});
export const findAllByUniqueCustclass = defRouteApi(async ({uniqueCustclass}) => {
  return {
    timeout: 100000000000,
    url: Api.findAllByUniqueCustclass + '?uniqueCustclass=' + uniqueCustclass,
    method: 'POST',
  };
});
export const applyImportCus = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/supplier/applyImportCus',
    method: 'POST',params
  };
});
export const editIsDel = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/supplier/editIsDel',
    method: 'POST',params
  };
});
export const findAllIsDel = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/supplier/findAllIsDel',
    method: 'POST',params
  };
});
export const recoverIsDel = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/supplier/recoverIsDel',
    method: 'POST',params
  };
});

export const findBySupMaxNum = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/supplier/findBySupMaxNum',
    method: 'POST',params
  };
});
export const editUniqueCustclass = defRouteApi(async ({uniqueCustclass,oldUniqueCustclass}) => {
  return {
    timeout: 100000000000,
    url: '/supplier/editUniqueCustclass?uniqueCustclass='+uniqueCustclass+'&oldUniqueCustclass='+oldUniqueCustclass,
    method: 'POST',
  };
});

export const batchEditCust = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/supplier/batchEditCust',
    method: 'POST',params
  };
});
/**************************************************** 审计日志记录 ***************************************************************************/
export const auditSupplierSave = defRouteApi(async (params) => {
  return {
    timeout: 100000000000,
    url: '/cusrtomer/auditSupplierSave',
    method: 'POST',params
  };
});
export async function getCusDataAuthorData(params) {
  return defHttp.request({
    url: '/supplier/getCusDataAuthorData',timeout: 100000000000,
    method: 'POST',
    params,
  });
}

