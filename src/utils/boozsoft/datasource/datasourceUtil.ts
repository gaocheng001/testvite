import {defHttp, otherHttp} from '/@/utils/http/axios';
import {inject} from "vue";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";

function getCurrentDatasourceStr() {
  // const a=JSON.parse(window.localStorage.getItem('datasource'))
  // a.schemaName=a.schemaName+'-'+window.localStorage.getItem('loginDate').split('-')[0]
  // return JSON.stringify(a)

  const accountPickerInfo=useAccountPickerCache().get()

  // const a=JSON.parse(window.localStorage.getItem('datasource'))
  // a.schemaName=a.schemaName+'-'+window.localStorage.getItem('loginDate').split('-')[0]
  return JSON.stringify({
    schemaName:accountPickerInfo.accountMode
  })
}
export function defRouteApi(requestDataApi) {
  return async function (params, datasource) {
    const requestData = await requestDataApi(params);
    if (requestData.headers == null) {
      requestData.headers = {};
    }
    if (datasource != null) {
      requestData.headers.datasource = datasource;
    } else {
      datasource = getCurrentDatasourceStr();
      requestData.headers.datasource = datasource;
    }
    return await defHttp.request(requestData);
  };
}

//
export function otherRouteApi(requestDataApi, datasourceStr?) {
  return async function (params, datasource) {
    const requestData = await requestDataApi(params);
    if (requestData.headers == null) {
      requestData.headers = {};
    }
    if (datasourceStr != null) {
      requestData.headers.datasource = datasourceStr;
    } else {
      datasourceStr = getCurrentDatasourceStr();
      requestData.headers.datasource = datasourceStr;
    }
    return await otherHttp.request(requestData);
  };
}

export function useRouteApi(api, datasource) {
  return (params) => {
    const newDatasource=JSON.parse(JSON.stringify(datasource))
    if(null !=datasource.schemaName && typeof(datasource.schemaName)!='string'){
      newDatasource.schemaName=datasource.schemaName.value
    }
    return api(params, JSON.stringify(newDatasource));
  };
}



export function useTenantId(tenantId){
  return {
    schemaName:tenantId
  }
}


export function useRouterApi() {
  return {
    usePageRouterApi: inject('usePageRouterApi')
  }
}
