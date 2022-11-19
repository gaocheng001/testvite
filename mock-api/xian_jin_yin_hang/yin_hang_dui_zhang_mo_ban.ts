/**
 * @author zhh
 */
// admin页 end
import {MockMethod} from "vite-plugin-mock";

function creatModel(){
  return {
    id: '',
    templateName: '',
    templateEnName: '',
    templateTitleStart: '',
    flag: '',
    table: [creatTable()],
    beiyong1: '',
    beiyong2: '',
    beiyong3: '',
    beiyong4: '',
    beiyong5: ''
  }
}
function creatTable(){
  return {
    id:'',
    templateId: '',
    systemField: '',
    tableField: '',
    billField: '',
    billType: '',
    billStyle: '',
    flag: '',
    beiyong1: '',
    beiyong2: '',
    beiyong3: '',
    beiyong4: '',
    beiyong5: ''
  }
}
const list=[{"id":1,"templateName":"招商银行对账模板","templateEnName":"","templateTitleStart":"2","flag":"1","table":[{"id":1,"templateId":1,"systemField":"日期","tableField":"statementDate","billField":"日期","billType":"日期","billStyle":"","flag":""},{"id":2,"templateId":1,"systemField":"对方单位","tableField":"duifangUnit","billField":"对方单位","billType":"文本","billStyle":"","flag":""},{"id":3,"templateId":1,"systemField":"结算方式","tableField":"settModes","billField":"结算方式","billType":"文本","billStyle":"","flag":""},{"id":4,"templateId":1,"systemField":"票号","tableField":"piaohao","billField":"票号","billType":"文本","billStyle":"","flag":""},{"id":5,"templateId":1,"systemField":"借方金额","tableField":"jie","billField":"借方金额","billType":"金额","billStyle":"","flag":""},{"id":6,"templateId":1,"systemField":"贷方金额","tableField":"dai","billField":"贷方金额","billType":"金额","billStyle":"","flag":""},{"id":7,"templateId":1,"systemField":"摘要","tableField":"remarks","billField":"摘要","billType":"文本","billStyle":"","flag":""},{"id":8,"templateId":1,"systemField":"币种","tableField":"currencyId","billField":"币种","billType":"文本","billStyle":"","flag":""}]},{"id":2,"templateName":"农业银行对账单","templateEnName":"","templateTitleStart":"3","flag":"1","table":[{"id":10,"templateId":2,"systemField":"日期","tableField":"statementDate","billField":"交易日期","billType":"日期","billStyle":"","flag":""},{"id":11,"templateId":2,"systemField":"对方单位","tableField":"duifangUnit","billField":"对方户名","billType":"文本","billStyle":"","flag":""},{"id":12,"templateId":2,"systemField":"结算方式","tableField":"settModes","billField":"交易方式","billType":"文本","billStyle":"","flag":""},{"id":13,"templateId":2,"systemField":"票号","tableField":"piaohao","billField":"交易凭证号","billType":"文本","billStyle":"","flag":""},{"id":14,"templateId":2,"systemField":"借方金额","tableField":"jie","billField":"收入金额","billType":"金额","billStyle":"","flag":""},{"id":15,"templateId":2,"systemField":"贷方金额","tableField":"dai","billField":"支出金额","billType":"金额","billStyle":"","flag":""},{"id":16,"templateId":2,"systemField":"摘要","tableField":"remarks","billField":"交易附言","billType":"文本","billStyle":"","flag":""},{"id":17,"templateId":2,"systemField":"币种","tableField":"currencyId","billField":"","billType":"文本","billStyle":"","flag":""}]}]

export default [
  // {
  //   url: '/api/bankTemplate',
  //   timeout: 0,
  //   method: "post",
  //   response: ({body,query}) => {
  //     if (body.id!=undefined&& body.id!=''){
  //       list.forEach(
  //         function (item, index){
  //           if (body.id==item.id){
  //             list[index]=body
  //           }
  //         }
  //       )
  //     } else {
  //       if (list.length>0) {
  //         const maxId = Math.max(...list.map(item => parseInt(item.id)))
  //         body.id = maxId + 1
  //       } else {
  //         body.id=1
  //       }
  //       body.table.forEach(
  //         function (item,index){
  //           item.templateId = body.id
  //           item.id = parseInt(body.id)+(parseInt(body.id)-1)*8+index
  //         }
  //       )
  //       list.push(body)
  //     }
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
  //   url: '/api/bankTemplate/del',
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
  //   url: '/api/bankTemplate/findByName',
  //   timeout: 0,
  //   method: "get",
  //   response: ({body,query}) => {
  //     const nameList = []
  //     list.forEach(
  //       function (item){
  //         if (item.templateName==body.templateName){
  //           nameList.push(item)
  //         }
  //       }
  //     )
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": nameList,
  //       "list": null
  //     }
  //   }
  // },
  // {
  //   url: '/api/bankTemplate/findByFlag',
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
  //   url: '/api/bankTemplate/findAll',
  //   timeout: 0,
  //   method: 'get',
  //   response: ({query}) => {
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": {"items":list},
  //       "list": null
  //     }
  //   },
  // },
] as MockMethod[];
