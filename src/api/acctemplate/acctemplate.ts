import { defHttp } from '/@/utils/http/axios';
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';

// 持久层
enum Api {
  treeCode = '/sys/acctemplate/treeCode',
  countByName = '/sys/acctemplate/countByName',
  codekemuDel = '/sys/acctemplate/codekemuDel',
  finByTemplate = '/sys/acctemplate/finByTemplate',
  accTemplateDel = '/sys/acctemplate/accTemplateDel',
  accTemplateSave = '/sys/acctemplate/accTemplateSave',
  findTemplateByAccId = '/sys/acctemplate/findTemplateByAccId',
  accTemplateZZSave = '/sys/acctemplate/accTemplateZZSave',
  editTemplateName = '/sys/acctemplate/editTemplateName',
  findAllAssTemplate = '/sys/acctemplate/findAllAssTemplate',
  findAllByTemplateID = '/sys/acctemplate/findAllByTemplateID',
  findByTOrganization = '/sys/acctemplate/findByTOrganization',
  findByCustomTemplate = '/sys/acctemplate/findByCustomTemplate',
  findByUniqueAccStandard = '/sys/acctemplate/findByUniqueAccStandard',
  findAllByUniqueAccStndard = '/sys/acctemplate/findAllByUniqueAccStndard',
  countByUniqueAccStandardAndTName = '/sys/acctemplate/countByUniqueAccStandardAndTName',
  findAllByUniqueAccStandardAndTemplateIdAndCclass = '/sys/acctemplate/findAllByUniqueAccStandardAndTemplateIdAndCclass',

  company_findAllByTemplateID = '/sys/acctemplate/company/company_findAllByTemplateID',
  company_findByTemplateIdCode = '/sys/acckemu/company/company_findByTemplateIdCode',
  company_findAllByUniqueAccStandardAndTemplateIdAndCclass = '/sys/acctemplate/company/company_findAllByUniqueAccStandardAndTemplateIdAndCclass',
  group_findByTemplateIdCode = '/sys/acckemu/group/findGroupByTemplateIdCode',
  findByAccId = '/sys/acctemplate/findByAccId',
}

export function acctemplateFindByAccId(accId: any) {
  return defHttp.request({
    url: Api.findByAccId + '?accId=' + accId,
    method: 'POST',timeout: 100000000000,
  });
}
export function findTemplateByAccId(accId: any) {
  return defHttp.request({
    url: Api.findTemplateByAccId + '?accId=' + accId,
    method: 'POST',timeout: 100000000000,
  });
}
export function countByName(ttype: any,tName: any) {
  return defHttp.request({
    url: Api.countByName + '?type=' + ttype+'&tName='+tName,
    method: 'POST',timeout: 100000000000,
  });
}

export function findByCustomTemplate(ttype: any) {
  return defHttp.request({
    url: Api.findByCustomTemplate + '?type=' + ttype,
    method: 'POST',timeout: 100000000000,
  });
}

export function accTemplateSave(params: any) {
  return defHttp.request({
    url: Api.accTemplateSave,
    method: 'POST',timeout: 100000000000,
    params,
  });
}

export function accTemplateZZSave(params: any) {
  return defHttp.request({
    url: Api.accTemplateZZSave,
    method: 'POST',timeout: 100000000000,
    params,
  });
}
export function editTemplateName(id: any,name: any,tjici: any) {
  return defHttp.request({
    url: Api.editTemplateName+'?id='+id+'&name='+name+'&tjici='+tjici,
    method: 'POST',timeout: 100000000000,
  });
}

export function findAllAssTemplate(params: any) {
  return defHttp.request({
    url: Api.findAllAssTemplate,
    method: 'GET',timeout: 100000000000,
    params,
  });
}
export function accTemplateDel(id: any) {
  return defHttp.request({
    url: Api.accTemplateDel + '?id=' + id,
    method: 'POST',timeout: 100000000000,
  });
}
export function codekemuDel(id: any) {
  return defHttp.request({
    url: Api.codekemuDel + '?id=' + id,
    method: 'POST',timeout: 100000000000,
  });
}

export function countByUniqueAccStandardAndTName(uniqueAccStandard: any, tName: any,ttype:any) {
  return defHttp.request({
    url:
      Api.countByUniqueAccStandardAndTName +
      '?uniqueAccStandard=' +
      uniqueAccStandard +
      '&tName=' +
      tName+'&ttype='+ttype,
    method: 'POST',timeout: 100000000000,
  });
}

export function findAllByUniqueAccStandardAndTemplateIdAndCclass(
  uniqueAccStandard: any,
  templateId: any,
  cclass: any
) {
  return defHttp.request({
    url:
      Api.findAllByUniqueAccStandardAndTemplateIdAndCclass +
      '?uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId +
      '&cclass=' +
      cclass,
    method: 'POST',timeout: 100000000000,
  });
}

export function findAllByCountryCodeKeMu(
  uniqueAccStandard: any,
  templateId: any,
  cclass: any
) {
  return defHttp.request({
    url: '/sys/country_code/findAll?uniqueAccStandard=' +
      uniqueAccStandard +
      '&templateId=' +
      templateId +
      '&cclass=' +
      cclass,
    method: 'POST',timeout: 100000000000,
  });
}
export function findAllByOrgCodeKeMu(
  cclass: any,
  orgIyear: any,
  orgUnique: any
) {
  return defHttp.request({
    url: '/sys/org_code/findAll?cclass=' +
      cclass+'&orgIyear=' +
      orgIyear+'&orgUnique='+orgUnique,
    method: 'POST',timeout: 100000000000,
  });
}

export function findAllByUniqueAccStndard(uniqueAccStandard: any, accStyleUnique: any, type: any) {
  return defHttp.request({
    url:
      Api.findAllByUniqueAccStndard +
      '?uniqueAccStandard=' +
      uniqueAccStandard +
      '&accStyleUnique=' +
      accStyleUnique +
      '&type=' +
      type,
    method: 'POST',timeout: 100000000000,
  });
}

export function findAllByTemplateID(id: any) {
  return defHttp.request({
    url: Api.findAllByTemplateID + '?id=' + id,
    method: 'POST',timeout: 100000000000,
  });
}

export function treeCode(uniqueAccStandard: any, templateId: any) {
  return defHttp.request({
    url: Api.treeCode + '?uniqueAccStandard=' + uniqueAccStandard + '&templateId=' + templateId,
    method: 'POST',timeout: 100000000000,
  });
}
export function treeOrgCode(originId: any,iyear) {
  return defHttp.request({
    url: '/sys/acctemplate/treeOrgCode?originId=' + originId+'&iyear='+iyear,
    method: 'POST',timeout: 100000000000,
  });
}

export function finByTemplate(templateId: any) {
  return defHttp.request({
    url: Api.finByTemplate + '?templateId=' + templateId,
    method: 'POST',timeout: 100000000000,
  });
}

export function findByTOrganization(tOrganization: any) {
  return defHttp.request({
    url: Api.findByTOrganization + '?tOrganization=' + tOrganization,
    method: 'POST',timeout: 100000000000,
  });
}


/* ********************************* 获取账套数据 ******************************** */

export const company_findAllByUniqueAccStandardAndTemplateIdAndCclass = defRouteApi(
  async (params) => {
    return {
      url:
        Api.company_findAllByUniqueAccStandardAndTemplateIdAndCclass,
      method: 'POST',
      params,timeout: 100000000000,
    };
  }
);

export const company_findAllByTemplateID = defRouteApi(async (id) => {
  return {
    url: Api.company_findAllByTemplateID + '?id=' + id,
    method: 'POST',timeout: 100000000000,
  };
});
export function findByUniqueAccStandard(uniqueAccStandard: any) {
  return defHttp.request({
    url:
      Api.findByUniqueAccStandard +
      '?uniqueAccStandard=' + uniqueAccStandard ,
    method: 'POST',timeout: 100000000000,
  });
}
export const company_findByTemplateIdCode = defRouteApi(async (templateid) => {
  return {
    url: Api.company_findByTemplateIdCode + '?templateid=' + templateid,
    method: 'POST',timeout: 100000000000,
  };
});

export async function group_findByTemplateIdCode(templateid) {
  return defHttp.request({
    url: Api.group_findByTemplateIdCode + '?templateid=' + templateid,
    method: 'POST',timeout: 100000000000,
  });
}
export async function editTemplateNameById(id,name) {
  return defHttp.request({
    url: '/sys/acctemplate/editTemplateNameById?id=' + id+'&name='+name,
    method: 'POST',timeout: 100000000000,
  });
}
