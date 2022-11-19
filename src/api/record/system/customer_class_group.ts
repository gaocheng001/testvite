// @ts-ignore
import {defHttp} from "/@/utils/http/axios";

enum Api {
  findAllCustomerClass = '/sys/cusromerclass_group/findAllCustomerClass',
  treeCustomerClass = '/sys/cusromerclass_group/treeCustomerClass',
  customerSaveApi = '/sys/cusromerclass_group/save',
  delGroupCustomerClass = '/sys/cusromerclass_group/del',
  verifyCusClass = '/sys/cusromerclass_group/verifyCusClass',
  verifyCusClassName = '/sys/cusromerclass_group/verifyCusClassName',
  verifySuperCusClassName = '/sys/cusromerclass_group/verifySuperCusClassName',
  findAllByCusBendEq1 = '/sys/cusromerclass_group/findAllByCusBendEq1',
  sysimportCusClassGroup = '/sys/cusromerclass_group/sysimportCusClassGroup',
  delImportExcel = '/sys/cusromerclass_group/delImportExcel',
  findByLikeCusGradeCode = '/sys/cusromerclass_group/findByLikeCusGradeCode',
}

export function findByLikeCusGradeCode(cusGradeCode,cusClassGrade,cusBend) {
  return defHttp.request({
    url: Api.findByLikeCusGradeCode+'?cusGradeCode='+cusGradeCode+'&cusClassGrade='+cusClassGrade+'&cusBend='+cusBend,timeout: 100000000000,
    method: 'POST',
  });
}

export function GroupCustomerSaveApi(params: any, username: any) {
  return defHttp.request({
    url: Api.customerSaveApi + '?username=' + username,timeout: 100000000000,
    method: 'POST',
    params
  });
}

export function GetCustomerClassTree() {
  return defHttp.request({
    url: Api.treeCustomerClass,timeout: 100000000000,
    method: 'GET',
  });
}

export function findAllCustomerClass(params) {
  return defHttp.request({
    url: Api.findAllCustomerClass,timeout: 100000000000,
    method: 'POST',params
  });
}

export function delGroupCustomerClass(params) {
  return defHttp.request({
    url: Api.delGroupCustomerClass,timeout: 100000000000,
    method: 'POST',params
  });
}

export function verifyCusClass(cusClass) {
  return defHttp.request({
    url: Api.verifyCusClass + '?cusClass=' + cusClass,timeout: 100000000000,
    method: 'POST',
  });
}

export function verifyCusClassName(cusClassName) {
  return defHttp.request({
    url: Api.verifyCusClassName + '?cusCclassName=' + cusClassName,timeout: 100000000000,
    method: 'POST',
  });
}
export function verifySuperCusClassName(parentId, cusClassName) {
  return defHttp.request({
    url: Api.verifySuperCusClassName + '?parentId=' + parentId + '&cusCclassName=' + cusClassName,timeout: 100000000000,
    method: 'POST',
  });
}

export function findAllByCusBendEq1() {
  return defHttp.request({
    url: Api.findAllByCusBendEq1,timeout: 100000000000,
    method: 'GET',
  });
}
export  async function sysimportCusClassGroup(params:any){
  return defHttp.request({
    url: Api.sysimportCusClassGroup,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}
export  async function delImportExcel(params:any){
  return defHttp.request({
    url: Api.delImportExcel,
    timeout: 100000000000,
    method: 'POST',
    params
  })
}



/****************************** Assign *******************************/
// 添加集团客户分类分配表
export  async function assignOrgSave(params:any){
  return defHttp.request({
    url: '/sys/customerClassAssign/save',
    timeout: 100000000000,
    method: 'POST',
    params
  })
}

// 集团客户分类分配表
export  async function findByOrgAssigAccount(orgUnique:any,ctype:any){
  return defHttp.request({
    url: '/sys/customerClassAssign/findByOrgAssigAccount?orgUnique='+orgUnique+'&ctype='+ctype,
    timeout: 100000000000,
    method: 'POST',
  })
}
// 组织分配给账套
export  async function findByOrgAssigTenantId(orgUnique:any,ctype:any,tenantId){
  return defHttp.request({
    url: '/sys/customerClassAssign/findByOrgAssigTenantId?orgUnique='+orgUnique+'&ctype='+ctype+'&tenantId='+tenantId,
    timeout: 100000000000,
    method: 'POST',
  })
}

// 取消组织分配
export  async function delByCtypeAndOrgUnique(params){
  return defHttp.request({
    url: '/sys/customerClassAssign/delByCtypeAndOrgUnique',
    timeout: 100000000000,
    method: 'POST',params
  })
}
// 取消账套分配
export  async function delByCtypeAndOrgUniqueAndTenantId(params){
  return defHttp.request({
    url: '/sys/customerClassAssign/delByCtypeAndOrgUniqueAndTenantId',
    timeout: 100000000000,
    method: 'POST',params
  })
}

export  async function findByRepeat(orgUnique,ctype){
  return defHttp.request({
    url: '/sys/customerClassAssign/findByRepeat?orgUnique='+orgUnique+'&ctype='+ctype,
    timeout: 100000000000,
    method: 'POST',
  })
}
export  async function delByCtypeAndOrgUniqueAndFlag(orgUnique,ctype,flag){
  return defHttp.request({
    url: '/sys/customerClassAssign/delByCtypeAndOrgUniqueAndFlag?orgUnique='+orgUnique+'&ctype='+ctype+'&flag='+flag,
    timeout: 100000000000,
    method: 'POST',
  })
}
export  async function delByCtypeAndOrgUniqueAndFlagAndTenantId(orgUnique,ctype,flag,tenantId){
  return defHttp.request({
    url: '/sys/customerClassAssign/delByCtypeAndOrgUniqueAndFlagAndTenantId?orgUnique='+orgUnique+'&ctype='+ctype+'&flag='+flag+'&tenantId='+tenantId,
    timeout: 100000000000,
    method: 'POST',
  })
}

// 批量修改引入状态
export  async function editFlagByCtypeAndOrgUnique(params){
  return defHttp.request({
    url: '/sys/customerClassAssign/editFlagByCtypeAndOrgUnique',
    timeout: 100000000000,
    method: 'POST',params
  })
}
export  async function editFlagByCtypeAndTenantId(params){
  return defHttp.request({
    url: '/sys/customerClassAssign/editFlagByCtypeAndTenantId',
    timeout: 100000000000,
    method: 'POST',params
  })
}

export  async function findByOrgAssigAccountCtype(ctype){
  return defHttp.request({
    url: '/sys/customerClassAssign/findByOrgAssigAccountCtype?ctype='+ctype,
    timeout: 100000000000,
    method: 'POST',
  })
}
