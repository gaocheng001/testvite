import {ok} from "../../mock/_utils/r";
import {MockMethod} from "vite-plugin-mock";
import {JsData,JcDataByInfo,JcDataByOne} from "../_datatable/_fibancial-info-data";
export default [
  {
    url: '/api/settModes/findAll',
    timeout: 0,
    method: 'get',
    response: ({query}) => {
      return JsData
    }
  },
  {
    url: '/api/sys/acctemplate/findBasisInfo',
    timeout: 0,
    method: 'get',
    response: ({query}) => {
      return JcDataByInfo
    }
  },
  {
    url: '/sys/account/findOne',
    timeout: 0,
    method: 'post',
    response: ({body}) => {
      const {accId} = body
      return JcDataByOne
    }
  },

/*  {
    url: '/api/settModes',
    timeout: 0,
    method: 'post',
    response: ({body}) => {
      if (body.state==1){
       /!* const {a} = body
        JsData.result.items.filter(item=>{})
        JsData.result.items.splice(0,10)*!/
      }else{

      }
      return JsData
    }
  },*/

] as MockMethod[]
