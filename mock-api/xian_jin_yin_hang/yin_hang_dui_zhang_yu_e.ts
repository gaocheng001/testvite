/**
 * @author zhh
 */
// admin页 end
import {MockMethod} from "vite-plugin-mock";
import {saveItem} from "../../mock/_utils/_crud";
import {accvocher} from "../_datatable/_pingzheng";

function creatModel(){
  return {
    id: '',
    iyear: '',
    qiyongDate: '',
    ccode: '',
    flag: '',
    dayBeforeMoney: '',
    statementBeforeMoney: '',
    beiyong1: '',
    beiyong2: '',
    beiyong3: '',
    beiyong4: '',
    beiyong5: ''
  }
}
const list=[]
// const list=[creatModel({id:121321321,iyear:2021}),creatModel(),creatModel()]



export default [
  // {
  //   url: '/api/bankStatementHeader',
  //   timeout: 0,
  //   method: "post",
  //   response: ({body,query}) => {
  //     if (body.qiyongDate!=undefined){
  //       body.qiyongDate = body.qiyongDate.substring(0,10)
  //     }
  //     body=saveItem(list,body)
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": {"items":body},
  //       "list": null
  //     }
  //   }
  // },
  // {
  //   url: '/api/bankStatementHeader/del',
  //   timeout: 0,
  //   method: 'delete',
  //   response: ({body,query}) => {
  //     let str = '刪除'
  //     if (body.id!=undefined){
  //       list.forEach(
  //         function (item, index){
  //           if (body.id==item.id){
  //             list.splice(index, 1)
  //             str = '刪除成功'
  //           }
  //         }
  //       )
  //     }
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": str,
  //       "list": null
  //     }
  //   }
  // },
  // {
  //   url: '/api/bankStatementHeader/findAll',
  //   timeout: 0,
  //   method: "get",
  //   response: ({query}) => {
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": {"items":list},
  //       "list": null
  //     }
  //   }
  // },
  // {
  //   url: '/api/bankStatementHeader/findById',
  //   timeout: 0,
  //   method: "get",
  //   response: ({body,query}) => {
  //     let item = {}
  //     if (body.id!=undefined){
  //       list.forEach(
  //         function (res){
  //           if (res.id == body.id){
  //             item = res
  //           }
  //         }
  //       )
  //     }
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": item,
  //       "list": null
  //     }
  //   }
  // },
  // {
  //   url: '/api/bankStatementHeader/findByYearAndKemu',
  //   timeout: 0,
  //   method: "get",
  //   response: ({body,query}) => {
  //     const bshlist = list.filter(item=>{
  //       return item.iyear==query.year && item.ccode==query.kemuCode
  //     })
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": bshlist,
  //       "list": null
  //     }
  //   }
  // },

] as MockMethod[];


