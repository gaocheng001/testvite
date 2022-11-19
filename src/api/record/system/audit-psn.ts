// @ts-ignore
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";

export const findAuditAll = defRouteApi(()=>{
  return {
    url: '/auditSysPsn/findAll',
    method: 'GET',
  }
})

export const saveAudit = defRouteApi((params)=>{
  return {
    url: '/auditSysPsn',
    method: 'POST',
    params
  }
})
