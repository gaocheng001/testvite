/**
 * 资产负载表
 */
import {resultSuccess} from '../../mock/_util';
import {MockMethod} from 'vite-plugin-mock';
import {any} from "vue-types";

const dataTable=[

]
function creatModel(){
  return {
    id:'1',
    name:'2'
  }
}
for(let i=0;i<10;i++){
  dataTable.push(creatModel({id:i,name:'张三'+i}))
}

// admin页 end
export default [
  // {
  //   url: '/api/sys/accstandard/findAllAcctandardList',
  //   timeout: 0,
  //   method: 'get',
  //   response: ({query}) => {
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": [
  //         {
  //           "id": 6,
  //           "uniqueAccStandard": 1,
  //           "accStandardName": "2013年小企业会计准则",
  //           "flagYusuan": "0",
  //           "num": 1,
  //           "accStyleUnique": "1",
  //           "styleName": "资产,负债,权益,成本,损益",
  //           "codeFirst": 4
  //         },
  //         {
  //           "id": 7,
  //           "uniqueAccStandard": 2,
  //           "accStandardName": "2007年新会计准则（企业）",
  //           "flagYusuan": "0",
  //           "num": 2,
  //           "accStyleUnique": "2",
  //           "styleName": "资产,负债,共同,权益,成本,损益",
  //           "codeFirst": 4
  //         },
  //         {
  //           "id": 8,
  //           "uniqueAccStandard": 3,
  //           "accStandardName": "个体工商户会计制度",
  //           "flagYusuan": "0",
  //           "num": 3,
  //           "accStyleUnique": "1",
  //           "styleName": "资产,负债,权益,成本,损益",
  //           "codeFirst": 3
  //         },
  //         {
  //           "id": 9,
  //           "uniqueAccStandard": 4,
  //           "accStandardName": "2014行政单位会计制度",
  //           "flagYusuan": "0",
  //           "num": 4,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 4
  //         }, {
  //           "id": 10,
  //           "uniqueAccStandard": 5,
  //           "accStandardName": "2013事业单位会计制度",
  //           "flagYusuan": "0",
  //           "num": 5,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 4
  //         }, {
  //           "id": 11,
  //           "uniqueAccStandard": 6,
  //           "accStandardName": "2014科学事业单位会计制度",
  //           "flagYusuan": "0",
  //           "num": 6,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 3
  //         }, {
  //           "id": 12,
  //           "uniqueAccStandard": 7,
  //           "accStandardName": "2014高等学校会计制度",
  //           "flagYusuan": "0",
  //           "num": 7,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 3
  //         }, {
  //           "id": 13,
  //           "uniqueAccStandard": 8,
  //           "accStandardName": "2014中小学校会计制度",
  //           "flagYusuan": "0",
  //           "num": 8,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 3
  //         }, {
  //           "id": 14,
  //           "uniqueAccStandard": 9,
  //           "accStandardName": "2014彩票机构会计制度",
  //           "flagYusuan": "0",
  //           "num": 9,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 4
  //         }, {
  //           "id": 15,
  //           "uniqueAccStandard": 10,
  //           "accStandardName": "2011年医院会计制度",
  //           "flagYusuan": "0",
  //           "num": 10,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 4
  //         }, {
  //           "id": 16,
  //           "uniqueAccStandard": 11,
  //           "accStandardName": "2011年新农保基金核算办法",
  //           "flagYusuan": "0",
  //           "num": 11,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 4
  //         }, {
  //           "id": 17,
  //           "uniqueAccStandard": 12,
  //           "accStandardName": "民间非营利组织会计制度",
  //           "flagYusuan": "0",
  //           "num": 12,
  //           "accStyleUnique": "3",
  //           "styleName": "资产,负债,净资产,收入费用",
  //           "codeFirst": 4
  //         }, {
  //           "id": 18,
  //           "uniqueAccStandard": 13,
  //           "accStandardName": "村集体经济组织会计制度",
  //           "flagYusuan": "0",
  //           "num": 13,
  //           "accStyleUnique": "1",
  //           "styleName": "资产,负债,权益,成本,损益",
  //           "codeFirst": 4
  //         }, {
  //           "id": 19,
  //           "uniqueAccStandard": 14,
  //           "accStandardName": "工会会计制度",
  //           "flagYusuan": "0",
  //           "num": 14,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 4
  //         }, {
  //           "id": 20,
  //           "uniqueAccStandard": 15,
  //           "accStandardName": "基层医疗卫生机构",
  //           "flagYusuan": "0",
  //           "num": 15,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 4
  //         }, {
  //           "id": 21,
  //           "uniqueAccStandard": 16,
  //           "accStandardName": "典当行业新会计准则",
  //           "flagYusuan": "0",
  //           "num": 16,
  //           "accStyleUnique": "2",
  //           "styleName": "资产,负债,共同,权益,成本,损益",
  //           "codeFirst": 4
  //         }, {
  //           "id": 22,
  //           "uniqueAccStandard": 17,
  //           "accStandardName": "行政单位会计制度",
  //           "flagYusuan": "0",
  //           "num": 17,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 3
  //         }, {
  //           "id": 23,
  //           "uniqueAccStandard": 18,
  //           "accStandardName": "事业单位会计制度",
  //           "flagYusuan": "0",
  //           "num": 18,
  //           "accStyleUnique": "4",
  //           "styleName": "资产,负债,净资产,收入,支出或费用",
  //           "codeFirst": 3
  //         }, {
  //           "id": 24,
  //           "uniqueAccStandard": 19,
  //           "accStandardName": "2001年企业会计制度",
  //           "flagYusuan": "0",
  //           "num": 19,
  //           "accStyleUnique": "1",
  //           "styleName": "资产,负债,权益,成本,损益",
  //           "codeFirst": 4
  //         }, {
  //           "id": 26,
  //           "uniqueAccStandard": 20,
  //           "accStandardName": "小企业会计制度",
  //           "flagYusuan": "0",
  //           "num": 20,
  //           "accStyleUnique": "1",
  //           "styleName": "资产,负债,权益,成本,损益",
  //           "codeFirst": 4
  //         }, {
  //           "id": 27,
  //           "uniqueAccStandard": 21,
  //           "accStandardName": "建设单位会计制度",
  //           "flagYusuan": "0",
  //           "num": 21,
  //           "accStyleUnique": "5",
  //           "styleName": "占用,来源",
  //           "codeFirst": 3
  //         }],
  //       "list": null
  //     }
  //   }
  // },
  // {
  //   //?reportName=zcfzb
  //   url: '/api/reportTemplate/findByReportName',
  //   timeout: 0,
  //   method: 'get',
  //   response: ({query}) => {
  //     return {"code":0,"type":"success","message":"ok","result":{"total":1,"items":[{"id":"1395663448800628736","reportName":"zcfzb","templateName":"2007资产负债表系统模板","accStandard":2,"titleName":"2007系统模板","kemuTemplateId":2,"flag":"1","menu1":"","menu2":"","menu3":"","menu4":"","menu5":"","beiyong1":"1","beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null,"table":null,"zcTable":null,"fzTable":null}]},"list":null}
  //   }
  // },
  // {
  //   //?reportName=zcfzb
  //   url: '/api/reportTemplate/findByReportName',
  //   timeout: 0,
  //   method: 'get',
  //   response: ({query}) => {
  //     return {"code":0,"type":"success","message":"ok","result":{"total":1,"items":[{"id":"1395663448800628736","reportName":"zcfzb","templateName":"2007资产负债表系统模板","accStandard":2,"titleName":"2007系统模板","kemuTemplateId":2,"flag":"1","menu1":"","menu2":"","menu3":"","menu4":"","menu5":"","beiyong1":"1","beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null,"table":null,"zcTable":null,"fzTable":null}]},"list":null}
  //   }
  // },
  // {
  //   url: '/api/reportTemplate/findByReportNameAndFlag',
  //   timeout: 0,
  //   method: 'get',
  //   response: ({query}) => {
  //     return {
  //       "code": 0,
  //       "type": "success",
  //       "message": "ok",
  //       "result": {
  //         "total": 1,
  //         "items": [{
  //           "id": "1395663448800628736",
  //           "reportName": "zcfzb",
  //           "templateName": "2007资产负债表系统模板",
  //           "accStandard": 2,
  //           "titleName": "2007系统模板",
  //           "kemuTemplateId": 2,
  //           "flag": "1",
  //           "menu1": "",
  //           "menu2": "",
  //           "menu3": "",
  //           "menu4": "",
  //           "menu5": "",
  //           "beiyong1": "1",
  //           "beiyong2": null,
  //           "beiyong3": null,
  //           "beiyong4": null,
  //           "beiyong5": null,
  //           "table": null,
  //           "zcTable": null,
  //           "fzTable": null
  //         }]
  //       },
  //       "list": null
  //     }
  //   }
  // },
// const /api/reportTemplate/findByReportNameAndFlag?reportName=zcfzb={"code":0,"type":"success","message":"ok","result":{"total":1,"items":[{"id":"1395663448800628736","reportName":"zcfzb","templateName":"2007资产负债表系统模板","accStandard":2,"titleName":"2007系统模板","kemuTemplateId":2,"flag":"1","menu1":"","menu2":"","menu3":"","menu4":"","menu5":"","beiyong1":"1","beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null,"table":null,"zcTable":null,"fzTable":null}]},"list":null}
// const /api/sys/department/findAll={"code":0,"type":"success","message":"ok","result":{"total":10,"items":[{"id":"1","uniqueCode":"1","deptCode":"001","deptName":"希格科技","parentId":"0","uniqueCodeUser":null,"createDate":null,"flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null},{"id":"2","uniqueCode":"2","deptCode":"001001","deptName":"研发部","parentId":"1","uniqueCodeUser":null,"createDate":null,"flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null},{"id":"3","uniqueCode":"3","deptCode":"001001001","deptName":"测试部","parentId":"2","uniqueCodeUser":null,"createDate":null,"flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null},{"id":"4","uniqueCode":"4","deptCode":"001001002","deptName":"开发部","parentId":"2","uniqueCodeUser":null,"createDate":null,"flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null},{"id":"5","uniqueCode":"5","deptCode":"001002","deptName":"运维部","parentId":"1","uniqueCodeUser":null,"createDate":null,"flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null},{"id":"6","uniqueCode":"6","deptCode":"002","deptName":"希格咨询","parentId":"0","uniqueCodeUser":null,"createDate":null,"flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null},{"id":"7","uniqueCode":"7","deptCode":"002001","deptName":"财务部","parentId":"6","uniqueCodeUser":null,"createDate":null,"flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null},{"id":"8","uniqueCode":"8","deptCode":"111","deptName":"111","parentId":"0","uniqueCodeUser":null,"createDate":null,"flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null},{"id":"11","uniqueCode":"60615046f14cce11a4b8dfd7","deptCode":"211","deptName":"212","parentId":"0","uniqueCodeUser":"","createDate":"","flag":"0","beiyong1":null,"beiyong2":null,"beiyong3":null},{"id":"22","uniqueCode":"60629892f14c5edc6bea7ba0","deptCode":"xxxx","deptName":"888","parentId":"3","uniqueCodeUser":"","createDate":" 2021-03-30 11:18:42 ","flag":"1","beiyong1":null,"beiyong2":null,"beiyong3":null}]},"list":null}
// const /api/sys/psn/findAll={"code":0,"type":"success","message":"ok","result":{"total":4,"items":[{"id":"1","uniqueCode":"60597598f14c342954ed3d28","psnCode":"1001","jobNum":"1001","psnName":"张三1","psnSex":"1","uniqueCodeDept":"4","uniquePsnType":"1","psnType":"1","psnPost":"1","documentType":"","documentCode":null,"psnStation":"4","cellPhoneNum":"13522006013","psnEmail":"1823613445@qq.com","psnWechat":"13522006013","psnQq":"1823616445","psnAddress":"","psnBank":"","bankArea":"","bankAccount":"","entryDate":null,"createDate":"2021-05-12 09:32:03","flag":"1","countryId":"中国","uniqueCodeZone":null,"bankNum":null,"province":"110000,110100,110101","city":null,"district":null,"birthDate":null,"leaveDate":null,"beiyong1":null,"beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null},{"id":"2","uniqueCode":"60597598f14c342954ed3d29","psnCode":"1002","jobNum":"1002","psnName":"张三2","psnSex":"1","uniqueCodeDept":"1","uniquePsnType":"1","psnType":"1","psnPost":"1","documentType":"","documentCode":null,"psnStation":"2","cellPhoneNum":"13522006014","psnEmail":"1823613445@qq.com","psnWechat":"13522006014","psnQq":"1823616445","psnAddress":"","psnBank":"","bankArea":"","bankAccount":"","entryDate":"","createDate":null,"flag":"1","countryId":"1","uniqueCodeZone":null,"bankNum":null,"province":null,"city":null,"district":null,"birthDate":null,"leaveDate":null,"beiyong1":null,"beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null},{"id":"3","uniqueCode":"60597598f14c342954ed3d30","psnCode":"1003","jobNum":"1003","psnName":"张三3","psnSex":"1","uniqueCodeDept":"1","uniquePsnType":"1","psnType":"1","psnPost":"1","documentType":"","documentCode":null,"psnStation":"1","cellPhoneNum":"13522006015","psnEmail":"1823613445@qq.com","psnWechat":"13522006015","psnQq":"1823616445","psnAddress":"","psnBank":"","bankArea":"","bankAccount":"","entryDate":"","createDate":null,"flag":"1","countryId":"1","uniqueCodeZone":null,"bankNum":null,"province":null,"city":null,"district":null,"birthDate":null,"leaveDate":null,"beiyong1":null,"beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null},{"id":"4","uniqueCode":"60597598f14c342954ed3d31","psnCode":"1004","jobNum":"1004","psnName":"张三4","psnSex":"1","uniqueCodeDept":"1","uniquePsnType":"1","psnType":"1","psnPost":"1","documentType":"","documentCode":null,"psnStation":"3","cellPhoneNum":"13522006016","psnEmail":"1823613445@qq.com","psnWechat":"13522006016","psnQq":"1823616445","psnAddress":"","psnBank":"","bankArea":"","bankAccount":"","entryDate":"","createDate":null,"flag":"1","countryId":"1","uniqueCodeZone":null,"bankNum":null,"province":null,"city":null,"district":null,"birthDate":null,"leaveDate":null,"beiyong1":null,"beiyong2":null,"beiyong3":null,"beiyong4":null,"beiyong5":null}]},"list":null}
// cosnt /api/sys/accstandard/findAllAcctandardList={"code":0,"type":"success","message":"ok","result":[{"id":6,"uniqueAccStandard":1,"accStandardName":"2013年小企业会计准则","flagYusuan":"0","num":1,"accStyleUnique":"1","styleName":"资产,负债,权益,成本,损益","codeFirst":4},{"id":7,"uniqueAccStandard":2,"accStandardName":"2007年新会计准则（企业）","flagYusuan":"0","num":2,"accStyleUnique":"2","styleName":"资产,负债,共同,权益,成本,损益","codeFirst":4},{"id":8,"uniqueAccStandard":3,"accStandardName":"个体工商户会计制度","flagYusuan":"0","num":3,"accStyleUnique":"1","styleName":"资产,负债,权益,成本,损益","codeFirst":3},{"id":9,"uniqueAccStandard":4,"accStandardName":"2014行政单位会计制度","flagYusuan":"0","num":4,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":10,"uniqueAccStandard":5,"accStandardName":"2013事业单位会计制度","flagYusuan":"0","num":5,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":11,"uniqueAccStandard":6,"accStandardName":"2014科学事业单位会计制度","flagYusuan":"0","num":6,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":3},{"id":12,"uniqueAccStandard":7,"accStandardName":"2014高等学校会计制度","flagYusuan":"0","num":7,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":3},{"id":13,"uniqueAccStandard":8,"accStandardName":"2014中小学校会计制度","flagYusuan":"0","num":8,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":3},{"id":14,"uniqueAccStandard":9,"accStandardName":"2014彩票机构会计制度","flagYusuan":"0","num":9,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":15,"uniqueAccStandard":10,"accStandardName":"2011年医院会计制度","flagYusuan":"0","num":10,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":16,"uniqueAccStandard":11,"accStandardName":"2011年新农保基金核算办法","flagYusuan":"0","num":11,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":17,"uniqueAccStandard":12,"accStandardName":"民间非营利组织会计制度","flagYusuan":"0","num":12,"accStyleUnique":"3","styleName":"资产,负债,净资产,收入费用","codeFirst":4},{"id":18,"uniqueAccStandard":13,"accStandardName":"村集体经济组织会计制度","flagYusuan":"0","num":13,"accStyleUnique":"1","styleName":"资产,负债,权益,成本,损益","codeFirst":4},{"id":19,"uniqueAccStandard":14,"accStandardName":"工会会计制度","flagYusuan":"0","num":14,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":20,"uniqueAccStandard":15,"accStandardName":"基层医疗卫生机构","flagYusuan":"0","num":15,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":21,"uniqueAccStandard":16,"accStandardName":"典当行业新会计准则","flagYusuan":"0","num":16,"accStyleUnique":"2","styleName":"资产,负债,共同,权益,成本,损益","codeFirst":4},{"id":22,"uniqueAccStandard":17,"accStandardName":"行政单位会计制度","flagYusuan":"0","num":17,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":3},{"id":23,"uniqueAccStandard":18,"accStandardName":"事业单位会计制度","flagYusuan":"0","num":18,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":3},{"id":24,"uniqueAccStandard":19,"accStandardName":"2001年企业会计制度","flagYusuan":"0","num":19,"accStyleUnique":"1","styleName":"资产,负债,权益,成本,损益","codeFirst":4},{"id":26,"uniqueAccStandard":20,"accStandardName":"小企业会计制度","flagYusuan":"0","num":20,"accStyleUnique":"1","styleName":"资产,负债,权益,成本,损益","codeFirst":4},{"id":27,"uniqueAccStandard":21,"accStandardName":"建设单位会计制度","flagYusuan":"0","num":21,"accStyleUnique":"5","styleName":"占用,来源","codeFirst":3}],"list":null}
// const /api/sys/accstandard/findAllAcctandardList={"code":0,"type":"success","message":"ok","result":[{"id":6,"uniqueAccStandard":1,"accStandardName":"2013年小企业会计准则","flagYusuan":"0","num":1,"accStyleUnique":"1","styleName":"资产,负债,权益,成本,损益","codeFirst":4},{"id":7,"uniqueAccStandard":2,"accStandardName":"2007年新会计准则（企业）","flagYusuan":"0","num":2,"accStyleUnique":"2","styleName":"资产,负债,共同,权益,成本,损益","codeFirst":4},{"id":8,"uniqueAccStandard":3,"accStandardName":"个体工商户会计制度","flagYusuan":"0","num":3,"accStyleUnique":"1","styleName":"资产,负债,权益,成本,损益","codeFirst":3},{"id":9,"uniqueAccStandard":4,"accStandardName":"2014行政单位会计制度","flagYusuan":"0","num":4,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":10,"uniqueAccStandard":5,"accStandardName":"2013事业单位会计制度","flagYusuan":"0","num":5,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":11,"uniqueAccStandard":6,"accStandardName":"2014科学事业单位会计制度","flagYusuan":"0","num":6,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":3},{"id":12,"uniqueAccStandard":7,"accStandardName":"2014高等学校会计制度","flagYusuan":"0","num":7,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":3},{"id":13,"uniqueAccStandard":8,"accStandardName":"2014中小学校会计制度","flagYusuan":"0","num":8,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":3},{"id":14,"uniqueAccStandard":9,"accStandardName":"2014彩票机构会计制度","flagYusuan":"0","num":9,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":15,"uniqueAccStandard":10,"accStandardName":"2011年医院会计制度","flagYusuan":"0","num":10,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":16,"uniqueAccStandard":11,"accStandardName":"2011年新农保基金核算办法","flagYusuan":"0","num":11,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":17,"uniqueAccStandard":12,"accStandardName":"民间非营利组织会计制度","flagYusuan":"0","num":12,"accStyleUnique":"3","styleName":"资产,负债,净资产,收入费用","codeFirst":4},{"id":18,"uniqueAccStandard":13,"accStandardName":"村集体经济组织会计制度","flagYusuan":"0","num":13,"accStyleUnique":"1","styleName":"资产,负债,权益,成本,损益","codeFirst":4},{"id":19,"uniqueAccStandard":14,"accStandardName":"工会会计制度","flagYusuan":"0","num":14,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":20,"uniqueAccStandard":15,"accStandardName":"基层医疗卫生机构","flagYusuan":"0","num":15,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":4},{"id":21,"uniqueAccStandard":16,"accStandardName":"典当行业新会计准则","flagYusuan":"0","num":16,"accStyleUnique":"2","styleName":"资产,负债,共同,权益,成本,损益","codeFirst":4},{"id":22,"uniqueAccStandard":17,"accStandardName":"行政单位会计制度","flagYusuan":"0","num":17,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":3},{"id":23,"uniqueAccStandard":18,"accStandardName":"事业单位会计制度","flagYusuan":"0","num":18,"accStyleUnique":"4","styleName":"资产,负债,净资产,收入,支出或费用","codeFirst":3},{"id":24,"uniqueAccStandard":19,"accStandardName":"2001年企业会计制度","flagYusuan":"0","num":19,"accStyleUnique":"1","styleName":"资产,负债,权益,成本,损益","codeFirst":4},{"id":26,"uniqueAccStandard":20,"accStandardName":"小企业会计制度","flagYusuan":"0","num":20,"accStyleUnique":"1","styleName":"资产,负债,权益,成本,损益","codeFirst":4},{"id":27,"uniqueAccStandard":21,"accStandardName":"建设单位会计制度","flagYusuan":"0","num":21,"accStyleUnique":"5","styleName":"占用,来源","codeFirst":3}],"list":null}


] as MockMethod[];
