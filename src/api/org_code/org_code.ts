import { defHttp } from '/@/utils/http/axios';
import { defRouteApi } from '/@/utils/boozsoft/datasource/datasourceUtil';


export function orgNewYearCodeKeMu(newyear: any,orgUnique:any) {
  return defHttp.request({
    url: '/sys/org_code/orgNewYearCodeKeMu?newyear=' + newyear+'&orgUnique='+orgUnique,
    method: 'POST',timeout: 100000000000,
  });
}

export const company_NewYearCodeSave = defRouteApi( (params) => {
  return {
    url: '/sys/org_code/company_NewYearCodeSave',params,
    method: 'POST',timeout: 100000000000,
  };
});

