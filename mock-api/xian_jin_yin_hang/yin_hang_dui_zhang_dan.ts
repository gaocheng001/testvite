/**
 * @author zhh
 */
// admin页 end
import {MockMethod} from "vite-plugin-mock";
import {saveItem} from "../../mock/_utils/_crud";
// import {accvocher} from "../_datatable/_pingzheng";
const accvocher=null
function creatModel(){
  return {
    id: '',
    statementDate: '',
    kemuCode: '',
    duifangUnit: '',
    settModes: '',
    piaohao: '',
    jie: '',
    dai: '',
    fangxiang: '',
    flag: '',
    statementNum: '',
    remarks: '',
    currencyId: '',
    beiyong1: '',
    beiyong2: '',
    beiyong3: '',
    beiyong4: '',
    beiyong5: ''
  }
}

const list=[
  {
    "id": "1",
    "statementDate": "2021-05-13",
    "kemuCode": "1002",
    "duifangUnit": null,
    "settModes": "hwuqqwhi",
    "piaohao": "45zxd",
    "jie": "",
    "dai": "786",
    "fangxiang": "",
    "flag": "",
    "statementNum": "",
    "remarks": "",
    "currencyId": "",
    "beiyong1": null,
    "beiyong2": null,
    "beiyong3": null,
    "beiyong4": null,
    "beiyong5": null
  }, {
    "id": "2",
    "statementDate": "2021-05-13",
    "kemuCode": "1002",
    "duifangUnit": null,
    "settModes": "支出",
    "piaohao": "1010",
    "jie": "1000",
    "dai": "",
    "fangxiang": "",
    "flag": "",
    "statementNum": "",
    "remarks": "",
    "currencyId": "",
    "beiyong1": null,
    "beiyong2": null,
    "beiyong3": null,
    "beiyong4": null,
    "beiyong5": null
  }]
 const kemuMock=[{"id":381,"uniqueCode":"1002","uniqueAccStandard":2,"cclass":"资产","cclassEngl":null,"ccode":"1002","ccodeName":"银行存款","ccodeEngl":null,"igrade":"1","bprogerty":"1","cbookType":"金额式","cbookTypeEngl":null,"bperson":null,"bcus":null,"bsup":null,"bdept":null,"bitem":null,"cassItem":null,"bnum":"0","menterage":null,"bstock":null,"currency":"0","currencyType":null,"bcash":null,"bbank":"1","bend":"0","bdaybook":"1","flag":"1","iyear":"2021","templateId":2,"lowerControl":null,"fuzhuControl":null,"superiorCcode":"0","bcashEquivalence":null,"uniqueAccStandardName":null,"templateName":null,"beiyong1":null,"beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null,"beiyong6":null,"beiyong7":null,"beiyong8":null,"beiyong9":null,"beiyong10":null,"beiyong11":null,"beiyong12":null,"beiyong13":null,"beiyong14":null,"beiyong15":null,"beiyong16":null,"beiyong17":null,"beiyong18":null,"beiyong19":null,"beiyong20":null},{"id":382,"uniqueCode":"100201","uniqueAccStandard":2,"cclass":"资产","cclassEngl":null,"ccode":"100201","ccodeName":"兴业银行","ccodeEngl":null,"igrade":"2","bprogerty":"1","cbookType":"金额式","cbookTypeEngl":null,"bperson":null,"bcus":null,"bsup":null,"bdept":null,"bitem":null,"cassItem":null,"bnum":"0","menterage":"个","bstock":null,"currency":"0","currencyType":null,"bcash":null,"bbank":"1","bend":"1","bdaybook":"1","flag":"1","iyear":"2021","templateId":2,"lowerControl":null,"fuzhuControl":null,"superiorCcode":"1002","bcashEquivalence":null,"uniqueAccStandardName":null,"templateName":null,"beiyong1":null,"beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null,"beiyong6":null,"beiyong7":null,"beiyong8":null,"beiyong9":null,"beiyong10":null,"beiyong11":null,"beiyong12":null,"beiyong13":null,"beiyong14":null,"beiyong15":null,"beiyong16":null,"beiyong17":null,"beiyong18":null,"beiyong19":null,"beiyong20":null},{"id":383,"uniqueCode":"100202","uniqueAccStandard":2,"cclass":"资产","cclassEngl":null,"ccode":"100202","ccodeName":"招商银行","ccodeEngl":null,"igrade":"2","bprogerty":"1","cbookType":"金额式","cbookTypeEngl":null,"bperson":null,"bcus":null,"bsup":null,"bdept":null,"bitem":null,"cassItem":null,"bnum":"0","menterage":null,"bstock":null,"currency":"0","currencyType":null,"bcash":null,"bbank":"1","bend":"1","bdaybook":"1","flag":"1","iyear":"2021","templateId":2,"lowerControl":null,"fuzhuControl":null,"superiorCcode":"1002","bcashEquivalence":null,"uniqueAccStandardName":null,"templateName":null,"beiyong1":null,"beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null,"beiyong6":null,"beiyong7":null,"beiyong8":null,"beiyong9":null,"beiyong10":null,"beiyong11":null,"beiyong12":null,"beiyong13":null,"beiyong14":null,"beiyong15":null,"beiyong16":null,"beiyong17":null,"beiyong18":null,"beiyong19":null,"beiyong20":null},{"id":384,"uniqueCode":"100203","uniqueAccStandard":2,"cclass":"资产","cclassEngl":null,"ccode":"100203","ccodeName":"农业银行","ccodeEngl":null,"igrade":"2","bprogerty":"1","cbookType":"金额式","cbookTypeEngl":null,"bperson":null,"bcus":null,"bsup":null,"bdept":null,"bitem":null,"cassItem":null,"bnum":"0","menterage":null,"bstock":null,"currency":"0","currencyType":null,"bcash":null,"bbank":"1","bend":"1","bdaybook":"1","flag":"1","iyear":"2021","templateId":2,"lowerControl":null,"fuzhuControl":null,"superiorCcode":"1002","bcashEquivalence":null,"uniqueAccStandardName":null,"templateName":null,"beiyong1":null,"beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null,"beiyong6":null,"beiyong7":null,"beiyong8":null,"beiyong9":null,"beiyong10":null,"beiyong11":null,"beiyong12":null,"beiyong13":null,"beiyong14":null,"beiyong15":null,"beiyong16":null,"beiyong17":null,"beiyong18":null,"beiyong19":null,"beiyong20":null}]
/*for(let i=1;i<100;i++){
  kemuMock.push({
    "id": i,
    "uniqueCode": i,
    "ccode": i,
    "ccodeName": "银行存款"+i
  })
}*/
const bzMock=[]
for(let i=1;i<10;i++){
  bzMock.push({
    "id": i,
    "uniqueCode": i,
    "countryName": '国家'+i,
    "currencyZhCnName": "中文名"+i,
    "currencySymbol": '货币符号'+i
  })
}
const jsMock = [{"id":"1392362669431984128","settModesCode":"1001","settModesName":"现金结算","createDate":null,"stopDate":null,"flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null},{"id":"1392427353761779712","settModesCode":"1002","settModesName":"转账","createDate":null,"stopDate":null,"flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null}]
/*for (let i=1;i<10;i++){
  jsMock.push({
    "id": i,
    "settModesCode": i,
    "settModesName": "结算方式"+i
  })
}*/
export default [
  // {
  //   url: '/api/bankStatement',
  //   timeout: 0,
  //   method: "post",
  //   response: ({body,query}) => {
  //     if (body.statementDate!=undefined){
  //       body.statementDate = body.statementDate.substring(0,10)
  //     }
  //     if (body.id!=undefined){
  //       list.forEach(
  //         function (item, index){
  //           if (body.id==item.id){
  //             list[index]=body
  //           }
  //         }
  //       )
  //     } else {
  //       const maxId=Math.max(...list.map(item=>parseInt(item.id)))
  //       body.id = maxId+1
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
  //   url: '/api/bankStatement/excel',
  //   timeout: 0,
  //   method: "post",
  //   response: ({body,query}) => {
  //     body.forEach(
  //       function (res,index){
  //         if (list.length>0) {
  //           const maxId = Math.max(...list.map(item => parseInt(item.id)))
  //           res.id = maxId + 1
  //         } else {
  //           res.id = index + 1
  //         }
  //         list.push(res)
  //       }
  //     )
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
  //   url: '/api/bankStatement/del',
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
  //   url: '/api/bankStatement/delList',
  //   timeout: 0,
  //   method: 'delete',
  //   response: ({body,query}) => {
  //     // console.log(body)
  //     let str = '刪除'
  //     body.forEach(
  //       function (res){
  //         list.forEach(
  //           function (item, index){
  //             if (res.id==item.id){
  //               list.splice(index, 1)
  //               str = '刪除成功'
  //             }
  //           }
  //         )
  //       }
  //     )
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
  //   url: '/api/settModes/findByFlag',
  //   timeout: 0,
  //   method: 'get',
  //   response: ({query}) => {
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": {"items":jsMock},
  //       "list": null
  //     }
  //   }
  // },
  // {
  //   url: '/api/sys/currency/findAll',
  //   timeout: 0,
  //   method: "get",
  //   response: ({query}) => {
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": {"items":bzMock},
  //       "list": null
  //     }
  //   }
  // },
  // {
  //   url: '/api/bankStatement/findCodeKemuByBr',
  //   timeout: 0,
  //   method: 'get',
  //   response: ({query}) => {
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": kemuMock,
  //       "list": null
  //     }
  //   },
  // },
  // {
  //   // ?accountId=1
  //   url: '/api/bankStatement/findYearByAccount',
  //   timeout: 0,
  //   method: 'get',
  //   response: ({query}) => {
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": [{"id":"1","accountId":"bjxgkj-001","accountYear":"2021","accountMode":"bjxgkj-001-2021"}],
  //       "list": null
  //     }
  //   },
  // },
  //
  // {
  //   // ?kemuCode=1002&year=2021
  //   url: '/api/bankStatement/findByKemuAndDate',
  //   timeout: 0,
  //   method: 'get',
  //   response: ({query}) => {
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": list,
  //       "list": null
  //     }
  //   },
  // },
  {
    url: '/api/bankStatement/duizhang',
    timeout: 0,
    method: 'post',
    response: ({body,query}) => {
      const bankStatement = body.bankStatement
      const accvoucher = body.accvoucher
      accvoucher.forEach(
        function (acc){
          saveItem(accvocher,acc)
        }
      )
      bankStatement.forEach(
        function (item){
          item.flag = '1'
          saveItem(list,item)
        }
      )

      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": accvoucher,
        "list": null
      }
    },
  },
  {
    url: '/api/accvoucher/findByMonth',
    timeout: 0,
    method: "get",
    response: ({query}) => {
      const accvocherList = accvocher.filter(item=>item.iperiod == '20')
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": accvocherList,
        "list": null
      }
    }
  },
  {
    url: '/api/accvoucher/findByBank',
    timeout: 0,
    method: "post",
    response: ({body}) => {
      const accvocherList = accvocher.filter(item=>{
        if(item.ccode==null){
          return false
        }else{
          // 条件
          // let b ={"id":"6075","uniqueCode":"60caf195dd3674eca0033cd5","vouchUnCode":"60caf195dd3674eca0033d16","csign":"记","iyear":"2021","imonth":"01","iyperiod":"202101","iperiod":"01","dbillDate":"2021-01-31","inoId":"0599","inid":"65","idoc":null,"cdigest":"期间损益结转","ccode":"670101","ccodeName":"坏账准备","md":"0.00","mc":"44436.16","mdF":"","mcF":"","ndS":"","ncS":"","nfrat":"0.00","cbill":"侯晓聪","ccashier":"罗锋","ccashierDate":null,"ccheck":"罗锋","ccheckDate":"2021-01-31","cdirector":"","cbook":"","ibook":null,"ibookDate":null,"pjCsettle":"","pjId":"","pjDate":"","cdeptId":null,"cpersonId":"605975913sd312a3a4ed3d32","ccusId":null,"csupId":null,"projectClassId":null,"projectId":null,"ifrag":"0","cashProject":"","icoord":null,"coordAccname":null,"coordDate":null,"coordId":null,"cunitPrice":"","unitMeasurement":null,"foreignCurrency":null,"statementNum":null,"ljMd":null,"ljMc":null,"cdfine1":null,"cdfine2":null,"cdfine3":null,"cdfine4":null,"cdfine5":null,"cdfine6":null,"cdfine7":null,"cdfine8":null,"cdfine9":null,"cdfine10":null,"cdfine11":null,"cdfine12":null,"cdfine13":null,"cdfine14":null,"cdfine15":null,"cdfine16":null,"cdfine17":null,"cdfine18":null,"cdfine19":null,"cdfine20":null,"cdfine21":null,"cdfine22":null,"cdfine23":null,"cdfine24":null,"cdfine25":null,"cdfine26":null,"cdfine27":null,"cdfine28":null,"cdfine29":null,"cdfine30":null}
          let flag = item.ccode.slice(0,body.ccode.length)==body.ccode // 科目
          if(flag && body.variable.periodStart != ''){//区间
            flag = ( item.iyperiod >= body.variable.periodStart.replace('-','') && item.iyperiod <= body.variable.periodEnd.replace('-',''))
          }else if (flag && body.dateStart != ''){//日期
            flag = ( item.iyperiod >= body.variable.dateStart.replace('-','') && item.dbillDate <= body.variable.dateEnd.replace('-',''))
          }
          if (flag && body.variable.summary != ''){ //摘要
            flag = (item.cdigest.indexOf(body.variable.summary) != -1)
          }
          if(flag && body.variable.amountMin != ''){ //金额区间过滤
            if (body.direction == 'md'){
              flag = (parseFloat(item.md) >= parseFloat(body.variable.amountMin)  && parseFloat(item.md) <= parseFloat(body.variable.amountMax))
            }else if (body.direction == 'mc'){
              flag = (parseFloat(item.mc) >= parseFloat(body.variable.amountMin)  && parseFloat(item.mc) <= parseFloat(body.variable.amountMax))
            }else {
              flag = ((parseFloat(item.md) >= parseFloat(body.variable.amountMin)  && parseFloat(item.md) <= parseFloat(body.variable.amountMax))
              || (parseFloat(item.mc) >= parseFloat(body.variable.amountMin)  && parseFloat(item.mc) <= parseFloat(body.variable.amountMax)))
            }
          }
          if (flag && (!body.constant.unaccounted)){ // 记账凭证
            flag = (item.ibook == '1')
          }
          // showCumulative 显示累计
          return flag
        }
      })
      accvocherList.sort(function(a, b){
        let x = a.inoId.toLowerCase();
        let y = b.inoId.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      })
      accvocherList.sort(function(a, b){
        let x = a.dbillDate.toLowerCase();
        let y = b.dbillDate.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      })
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": accvocherList,
        "list": null
      }
    }
  },
  {
    url: '/api/accvoucher/findByBankAndQc',
    timeout: 0,
    method: "get",
    response: ({query}) => {
      const accvocherList = accvocher.filter(item=>{
        if(item.ccode==null){
          return false
        }else{
          return item.ccode.slice(0,query.ccode.length)==query.ccode && item.iyear == '2021' && item.iperiod=='00'
        }
      })
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": accvocherList,
        "list": null
      }
    }
  },
  {
    url: '/api/accvoucher/findByBankByStatementNum',
    timeout: 0,
    method: "get",
    response: ({query}) => {
      // console.log(query)
      let accvocherList:any = []
      if (query.flag=='0') {
        accvocherList = accvocher.filter(item => {
          return item.ccode.slice(0, 4) == '1002' && (item.statementNum == null || item.statementNum == '')
        })
      } else if (query.flag=='1'){
        accvocherList = accvocher.filter(item => {
          return item.ccode.slice(0, 4) == '1002' && item.statementNum != null && item.statementNum != ''
        })
      } else {
        accvocherList = accvocher.filter(item => {
          return item.ccode.slice(0, 4) == '1002'
        })
      }
      //方向为借
      if (query.jie != '' && query.jie != null && query.jie > 0) {
        const list1 = accvocherList.filter(item=> item.md>0)
        const list2 = accvocherList.filter(item=> item.mc>0)
        accvocherList = list1.concat(list2)
      }
      //方向为贷
      if (query.dai != '' && query.dai != null && query.dai > 0) {
        const list1 = accvocherList.filter(item=> item.md>0)
        const list2 = accvocherList.filter(item=> item.mc>0)
        accvocherList = list2.concat(list1)
      }
      //对方单位排序
      if (query.duifangUnit != null) {
        const list1 = accvocherList.filter(item=> item.ccusId==query.duifangUnit || item.csupId==query.duifangUnit)
        const list2 = accvocherList.filter(item=> item.ccusId!=query.duifangUnit && item.csupId!=query.duifangUnit)
        accvocherList = list2.concat(list1)
      }
      //票号排序
      if (query.piaohao != null) {
        const list1 = accvocherList.filter(item=> item.pjId==query.piaohao)
        const list2 = accvocherList.filter(item=> item.pjId!=query.piaohao)
        accvocherList = list2.concat(list1)
      }
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": accvocherList,
        "list": null
      }
    }
  },
  {
    url: '/api/bankStatement/findByKemuAndDateByStatementNum',
    timeout: 0,
    method: 'get',
    response: ({query}) => {
      let bsList = []
      if (query.flag=='0') {
        bsList = list.filter(item => {
          return item.flag != '1'
        })
      } else if (query.flag=='1') {
        bsList = list.filter(item => {
          return item.flag == '1'
        })
      } else {
        bsList = list
      }
      //方向为借
      if (query.jie != '' && query.jie != null && query.jie > 0) {
        const list1 = bsList.filter(item=> item.jie>0)
        const list2 = bsList.filter(item=> item.dai>0)
        bsList = list1.concat(list2)
      }
      //方向为贷
      if (query.dai != '' && query.dai != null && query.dai > 0) {
        const list1 = bsList.filter(item=> item.jie>0)
        const list2 = bsList.filter(item=> item.dai>0)
        bsList = list2.concat(list1)
      }
      //对方单位排序
      if (query.duifangUnit != null) {
        const list1 = bsList.filter(item=> item.duifangUnit==query.duifangUnit)
        const list2 = bsList.filter(item=> item.duifangUnit!=query.duifangUnit)
        bsList = list2.concat(list1)
      }
      //票号排序
      if (query.piaohao != null) {
        const list1 = bsList.filter(item=> item.piaohao==query.piaohao)
        const list2 = bsList.filter(item=> item.piaohao!=query.piaohao)
        bsList = list2.concat(list1)
      }
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": bsList,
        "list": null
      }
    },
  },
  {
    url: '/api/accvoucher/excel',
    timeout: 0,
    method: "post",
    response: ({body, query}) => {
      body.forEach(
        function (item){
          saveItem(accvocher,item)
        }
      )
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": body,
        "list": null
      }
    }
  },
  {
    url: '/api/accvoucher/delList',
    timeout: 0,
    method: 'delete',
    response: ({body,query}) => {
      let str = '刪除'
      body.forEach(
        function (res){
          accvocher.forEach(
            function (item, index){
              if (res.id==item.id){
                accvocher.splice(index, 1)
                str = '刪除成功'
              }
            }
          )
        }
      )
      return {
        "code": 0,
        "type": "success",
        "message": "ok",
        "result": str,
        "list": null
      }
    }
  }
] as MockMethod[];
