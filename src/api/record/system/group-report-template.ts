import { defHttp } from '/@/utils/http/axios'

/**
 * @description: Get Emp based on id
 */
// params 是getEmpListByIdParams 类型的
export function findByReportName({reportName}:any) {
  return defHttp.request({
    url: '/groupReportTemplate/findByReportName?reportName='+reportName,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByReportNameAndFlag(reportName:any) {
  return defHttp.request({
    url: '/groupReportTemplate/findByReportNameAndFlag?reportName='+reportName,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByTemplateName(templateName:any) {
  return defHttp.request({
    url: '/groupReportTemplate/findByTemplateName?templateName='+templateName,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByColumn(templateId:any) {
  return defHttp.request({
    url: '/groupReportTemplate/findByColumn?templateId='+templateId,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByColumnAndType(templateId:any, columnType:any) {
  return defHttp.request({
    url: '/groupReportTemplate/findByColumnAndType?templateId='+templateId+'&columnType='+columnType,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByFormula(columnId:any) {
  return defHttp.request({
    url: '/groupReportTemplate/findByFormula?columnId='+columnId,
    timeout:1000000,
    method: 'GET',
  })
}

export function saveTemplate(params:any) {
  return defHttp.request({
    url: '/groupReportTemplate/saveTemplate',
    timeout:1000000,
    method: 'POST',
    params
  })
}

export function saveColumn(params:any) {
  return defHttp.request({
    url: '/groupReportTemplate/saveColumn',
    timeout:1000000,
    method: 'POST',
    params
  })
}

export function saveFormula(params:any) {
  return defHttp.request({
    url: '/groupReportTemplate/saveFormula',
    timeout:1000000,
    method: 'POST',
    params
  })
}

export function deleteTemplate(params:any) {
  return defHttp.request({
    url: '/groupReportTemplate/deleteTemplate',
    timeout:1000000,
    method: 'DELETE',
    params
  })
}

export function deleteColumn(params:any) {
  return defHttp.request({
    url: '/groupReportTemplate/deleteColumn',
    timeout:1000000,
    method: 'DELETE',
    params
  })
}

export function deleteFormula(params:any) {
  return defHttp.request({
    url: '/groupReportTemplate/deleteFormula',
    timeout:1000000,
    method: 'DELETE',
    params
  })
}

export function deleteFormulaByTemplate(params:any) {
  return defHttp.request({
    url: '/groupReportTemplate/deleteFormulaByTemplate',
    timeout:1000000,
    method: 'DELETE',
    params
  })
}

export function editFlag(params:any) {
  return defHttp.request({
    url: '/groupReportTemplate/editFlag',
    timeout:1000000,
    method: 'POST',
    params
  })
}

export function findTemplateById(id:any) {
  return defHttp.request({
    url: '/groupReportTemplate/findById?id='+id,
    timeout:1000000,
    method: 'GET',
  })
}

export function findFormulaByTemplate(templateId:any) {
  return defHttp.request({
    url: '/groupReportTemplate/findFormulaByTemplate?templateId='+templateId,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByTitleName({reportName, titleName}:any) {
  return defHttp.request({
    url: '/groupReportTemplate/findByTitleName?reportName='+reportName+'&titleName='+titleName,
    timeout:1000000,
    method: 'GET',
  })
}

export function findByNum(num: any) {
  return defHttp.request({
    url: '/groupReportTemplate/findByTitleName?num=' + num,
    timeout: 1000000,
    method: 'GET',
  })
}

export function findByAccStandardAndReportName(accStandard, reportName) {
  return defHttp.request({
    url: '/groupReportTemplate/findByAccStandardAndReportName?accStandard=' + accStandard + '&reportName=' + reportName,
    timeout: 1000000,
    method: 'GET',
  })
}
