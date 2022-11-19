import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findByReportName({reportName,originId}:any) {
  return defHttp.request({
    url: '/originReportTemplate/findByReportName?reportName='+reportName+'&originId='+originId,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByReportNameAndFlag(reportName:any,originId:any) {
  return defHttp.request({
    url: '/originReportTemplate/findByReportNameAndFlag?reportName='+reportName+'&originId='+originId,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByTemplateName(templateName:any,originId:any) {
  return defHttp.request({
    url: '/originReportTemplate/findByTemplateName?templateName='+templateName+'&originId='+originId,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByColumn(templateId:any) {
  return defHttp.request({
    url: '/originReportTemplate/findByColumn?templateId='+templateId,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByColumnAndType(templateId:any, columnType:any) {
  return defHttp.request({
    url: '/originReportTemplate/findByColumnAndType?templateId='+templateId+'&columnType='+columnType,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByFormula(columnId:any) {
  return defHttp.request({
    url: '/originReportTemplate/findByFormula?columnId='+columnId,
    timeout:1000000,
    method: 'GET',
  })
}

export function saveTemplate(params:any) {
  return defHttp.request({
    url: '/originReportTemplate/saveTemplate',
    timeout:1000000,
    method: 'POST',
    params
  })
}

export function saveColumn(params:any) {
  return defHttp.request({
    url: '/originReportTemplate/saveColumn',
    timeout:1000000,
    method: 'POST',
    params
  })
}

export function saveFormula(params:any) {
  return defHttp.request({
    url: '/originReportTemplate/saveFormula',
    timeout:1000000,
    method: 'POST',
    params
  })
}

export function deleteTemplate(params:any) {
  return defHttp.request({
    url: '/originReportTemplate/deleteTemplate',
    timeout:1000000,
    method: 'DELETE',
    params
  })
}

export function deleteColumn(params:any) {
  return defHttp.request({
    url: '/originReportTemplate/deleteColumn',
    timeout:1000000,
    method: 'DELETE',
    params
  })
}

export function deleteFormula(params:any) {
  return defHttp.request({
    url: '/originReportTemplate/deleteFormula',
    timeout:1000000,
    method: 'DELETE',
    params
  })
}

export function deleteFormulaByTemplate(params:any) {
  return defHttp.request({
    url: '/originReportTemplate/deleteFormulaByTemplate',
    timeout:1000000,
    method: 'DELETE',
    params
  })
}

export function editFlag(params:any) {
  return defHttp.request({
    url: '/originReportTemplate/editFlag',
    timeout:1000000,
    method: 'POST',
    params
  })
}

export function findTemplateById(id:any) {
  return defHttp.request({
    url: '/originReportTemplate/findById?id='+id,
    timeout:1000000,
    method: 'GET',
  })
}

export function findFormulaByTemplate(templateId:any) {
  return defHttp.request({
    url: '/originReportTemplate/findFormulaByTemplate?templateId='+templateId,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByTitleName({reportName, titleName,originId}:any) {
  return defHttp.request({
    url: '/originReportTemplate/findByTitleName?reportName='+reportName+'&titleName='+titleName+'&originId='+originId,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByNum(num: any,originId:any) {
  return defHttp.request({
    url: '/originReportTemplate/findByTitleName?num=' + num+'&originId='+originId,
    timeout: 1000000,
    method: 'GET',
  })
}

export function findByAccStandardAndReportName(accStandard, reportName,originId) {
  return defHttp.request({
    url: '/originReportTemplate/findByAccStandardAndReportName?accStandard=' + accStandard + '&reportName=' + reportName+'&originId='+originId,
    timeout: 1000000,
    method: 'GET',
  })
}
