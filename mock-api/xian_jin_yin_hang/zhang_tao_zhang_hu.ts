/**
 * @author zhh
 */
// admin页 end
import {MockMethod} from "vite-plugin-mock";
import {saveItem} from "../../mock/_utils/_crud";

function creatModel(){
  return {
    id: '',
    corpBankCode: '',
    corpBankName: '',
    corpBankType: '',
    bankCode: '',
    ccode: '',
    accountNum: '',
    icash: '',
    ibank: '',
    ibankStatement: '',
    beiyong1: '',
    beiyong2: '',
    beiyong3: '',
    beiyong4: '',
    beiyong5: ''
  }
}
const list=[]

export default [
  {
    url: '/api/corpBank',
    timeout: 0,
    method: "post",
    response: ({body,query}) => {
      const item=saveItem(list,body)

      console.log(111111111111111)
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": item,
        "list": null
      }
    }
  },
  {
    url: '/api/corpBank/del',
    timeout: 0,
    method: 'delete',
    response: ({body,query}) => {
      let str = '刪除'
      if (body.id!=undefined){
        list.forEach(
          function (item, index){
            if (body.id==item.id){
              list.splice(index, 1)
              str = '刪除成功'
            }
          }
        )
      }
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": str,
        "list": null
      }
    }
  },
  {
    url: '/api/corpBank/findAll',
    timeout: 0,
    method: "get",
    response: ({query}) => {
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": {"items":list},
        "list": null
      }
    }
  },
  {
    url: '/api/corpBank/findById',
    timeout: 0,
    method: "get",
    response: ({body,query}) => {
      let item = {}
      if (body.id!=undefined){
        list.forEach(
          function (res){
            if (res.id == body.id){
              item = res
            }
          }
        )
      }
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": item,
        "list": null
      }
    }
  },

] as MockMethod[];


