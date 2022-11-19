// @ts-ignore
import { defHttp } from '/@/utils/http/axios';

enum Api {
  findAllSupplierByFlag = '/sys/supplier_group/findAllSupplierByFlag',
  findAll = '/sys/supplier_group/findAll',
  findAllByFlag = '/sys/supplier_group/findAllByFlag',
  findAllCountry = '/sys/supplier_group/findAllCountry',
  findAllSysTradeNature = '/sys/supplier_group/findAllSysTradeNature',
  GroupCustomerAddApi = '/sys/supplier_group/save',
  verifyCustAccount = '/sys/supplier_group/verifyCustAccount',
  verifyCustomerName = '/sys/supplier_group/verifyCustomerName',
  verifyCustomerNum = '/sys/supplier_group/verifyCustomerNum',
  verifyByCustAbbname = '/sys/supplier_group/verifyByCustAbbname',
  verifyByCustSregcode = '/sys/supplier_group/verifyByCustSregcode',
  exportExcelFindAllJSON = '/sys/supplier_group/exportExcelFindAllJSON',
  sysimportCusInfoGroup = '/sys/supplier_group/importCus',
  delCusGroup = '/sys/supplier_group/delCus',
  delCusArrGroup = '/sys/supplier_group/delCusArr',
  findAllByUniqueCustclass = '/sys/supplier_group/findAllByUniqueCustclass',
  findAllByGroupAndAllot = '/sys/supplier_group/findAllByGroupAndAllot',
  findAllByAllot = '/sys/supplier_group/findAllByAllot',
  countAllotByCustUnique = '/sys/supplier_group/countAllotByCustUnique',
}
export async function findAllSupplierByFlag(flag: any) {
  return defHttp.request({
    url: Api.findAllSupplierByFlag + '?flag=' + flag,timeout: 100000000000,
    method: 'GET',
  });
}
export function findByCustName(custName: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/findByCustName?custName=' + custName,
    method: 'POST',
  });
}
export function findByCustAbbname(custAbbname: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/findByCustAbbname?custAbbname=' + custAbbname,
    method: 'POST',
  });
}

export function countAllotByCustUnique(cusUnique: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.countAllotByCustUnique + '?cusUnique=' + cusUnique,
    method: 'POST',
  });
}
export function findAllByAllot() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllByAllot,
    method: 'POST',
  });
}

export function findAllByGroupAndAllot(tenantId: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllByGroupAndAllot + '?tenantId=' + tenantId,
    method: 'POST',
  });
}

export function delCusArrGroup(id: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.delCusArrGroup + '?id=' + id,
    method: 'POST',
  });
}
export function delCusGroup(id: any,delName) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.delCusGroup + '?id=' + id+'&delName='+delName,
    method: 'POST',
  });
}
export function verifyByCustSregcode(custSregcode: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.verifyByCustSregcode + '?custSregcode=' + custSregcode,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}
export function verifyByCustAbbname(custAbbname: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.verifyByCustAbbname + '?custAbbname=' + custAbbname,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}
export function verifyCustomerNum(num: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.verifyCustomerNum + '?num=' + num,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}

export function findByCustAbbnameAndCustName(custAbbname: any,custName) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/findByCustAbbnameAndCustName?custAbbname=' + custAbbname+'&custName='+custName,
    method: 'POST',
  });
}
export function verifyCustomerName(name: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.verifyCustomerName + '?name=' + name,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}
export function verifyCustAccount(bankNum: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.verifyCustAccount + '?bankNum=' + bankNum,
    method: 'POST',
    headers: {
      ignoreCancelToken: true,
    },
  });
}

/* 获取启用中的供应商信息 */
export async function findAllByFlag(flag: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllByFlag + '?flag=' + flag,
    method: 'GET',
  });
}

/* 获取国家信息*/
export async function findAllCountry() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllCountry,
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
export async function findAll(params: any) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAll,
    method: 'POST',
    params,
  });
}

export function GroupCustomerAddApi(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.GroupCustomerAddApi,
    method: 'POST',
    params,
  });
}

export async function exportExcelFindAllJSON() {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.exportExcelFindAllJSON,
    method: 'GET',
  });
}
export  async function sysimportCusInfoGroup(params:any){
  return defHttp.request({
    url: Api.sysimportCusInfoGroup,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
export  async function OrgApplyImportCus(params:any){
  return defHttp.request({
    url: '/sys/supplier_group/OrgApplyImportCus',
    timeout: 100000000000,
    method: 'POST',
    params
  })
}

export async function findAllByUniqueCustclass(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: Api.findAllByUniqueCustclass,
    method: 'POST',params
  });
}
// 读取编码规则
export async function getCodingRule(ctype) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/getCodingRule?ctype='+ctype,
    method: 'POST',
  });
}
// 获取最新编码
export async function getMaxCusCodeByCodingFlag(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/getMaxCusCodeByCodingFlag',params,
    method: 'POST',
  });
}
export async function recoverCus(id) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/recoverCus?id='+id,
    method: 'POST',
  });
}

export async function findGroupCusByOrg(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/findGroupCusByOrg',params,
    method: 'POST',
  });
}
export async function findGroupCusByTenantId(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/findGroupCusByTenantId',params,
    method: 'POST',
  });
}

export async function editGroupCusAll(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/editGroupCusAll',params,
    method: 'POST',
  });
}
export async function findAllByGroupCusNameAndCustAbbnameLike(name,abbName) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/findAllByGroupCusNameAndCustAbbnameLike?name='+name+'&abbName='+abbName,
    method: 'POST',
  });
}
export async function editByIdSuccessState(id,approveUser) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/editByIdSuccessState?id='+id+'&approveUser='+approveUser,
    method: 'POST',
  });
}
export async function delByIdCustNameAndCustAbbnameAndSuccessState(custName,custAbbName,successState) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplier_group/delByIdCustNameAndCustAbbnameAndSuccessState?custName='+custName+'&custAbbName='+custAbbName+'&successState='+successState,
    method: 'POST',
  });
}






/******************************************* Assign *****************************************************/
export async function findByOrgAssigAccount(orgUnique,ctype) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/findByOrgAssigAccount?orgUnique='+orgUnique+'&ctype='+ctype,
    method: 'POST',
  });
}
export async function groupCusAssignOrgSave(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/groupCusAssignOrgSave',params,
    method: 'POST',
  });
}
export async function groupCusAssignDelById(orgUnique,ctype,dataUnique) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/groupCusAssignDelById?orgUnique='+orgUnique+'&ctype='+ctype+'&dataUnique='+dataUnique,
    method: 'POST',
  });
}
export async function groupCusAssignDelByIdAndTenantId(orgUnique,ctype,tenantId,dataUnique) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/groupCusAssignDelByIdAndTenantId?orgUnique='+orgUnique+'&ctype='+ctype+'&tenantId='+tenantId+'&dataUnique='+dataUnique,
    method: 'POST',
  });
}
export async function findAllByOrgUniqueAndCtypeAndFlag(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/findAllByOrgUniqueAndCtypeAndFlag',params,
    method: 'POST',
  });
}
export async function editFlagByCtypeAndOrgUnique(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/editFlagByCtypeAndOrgUnique',params,
    method: 'POST',
  });
}
export async function editFlagByCtypeAndOrgUniqueAndTenantId(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/editFlagByCtypeAndOrgUniqueAndTenantId',params,
    method: 'POST',
  });
}

export async function findByOrgAssigAccountCtype(ctype) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/findByOrgAssigAccountCtype?ctype='+ctype,
    method: 'POST',
  });
}
export async function findByOrgCusAbbNameAssignAccount(ctype,flag,abbName,orgUnique) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/findByOrgCusAbbNameAssignAccount?ctype='+ctype+'&flag='+flag+'&abbName='+abbName+'&orgUnique='+orgUnique,
    method: 'POST',
  });
}
export async function findByOrgCusNameAssignAccount(ctype,flag,name,orgUnique) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/findByOrgCusNameAssignAccount?ctype='+ctype+'&flag='+flag+'&name='+name+'&orgUnique='+orgUnique,
    method: 'POST',
  });
}
export async function findByOrgCusAbbNameAndCustNameAssignAccount(ctype,flag,abbName,custName,orgUnique) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/findByOrgCusAbbNameAndCustNameAssignAccount?ctype='+ctype+'&flag='+flag+'&abbName='+abbName+'&custName='+custName+'&orgUnique='+orgUnique,
    method: 'POST',
  });
}
export async function findByTenantIdCusAbbNameAndCustNameAssignAccount(ctype,flag,abbName,custName,tenantId) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/findByTenantIdCusAbbNameAndCustNameAssignAccount?ctype='+ctype+'&flag='+flag+'&abbName='+abbName+'&custName='+custName+'&tenantId='+tenantId,
    method: 'POST',
  });
}
export async function findAllByCusAssignLeftJoinGroupCusDataAndTenantId(orgUnique,ctype,tenantId) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/findAllByCusAssignLeftJoinGroupCusDataAndTenantId?orgUnique='+orgUnique+'&ctype='+ctype+'&tenantId='+tenantId,
    method: 'POST',
  });
}
export async function findAllByOrgUniqueAndTenantIdAndCtypeAndFlag(params) {
  return defHttp.request({
    timeout: 100000000000,
    url: '/sys/supplierAssign/findAllByOrgUniqueAndTenantIdAndCtypeAndFlag',
    method: 'POST',params
  });
}
