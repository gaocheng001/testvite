/**
 * 总账
 */
import {resultSuccess} from '../../mock/_util';
import {MockMethod} from 'vite-plugin-mock';
import {any} from "vue-types";



export default [
  // 年度区间
  {
    url: '/GeneralLedger/findSeach',
    timeout: 0,
    method: 'get',
    response: ({query}) => {
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": [
          {
            "id": 1,
            "value": '2021-01',
          },
          {
            "id": 2,
            "value": '2021-02',
          },
          {
            "id": 3,
            "value": '2021-03',
          }],
        "list": null
      }
    }
  },


] as MockMethod[];
