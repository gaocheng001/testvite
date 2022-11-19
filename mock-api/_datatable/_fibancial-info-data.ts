const JSALLDATA=[
  {
    "id": "1392362669431984128",
    "settModesCode": "1001",
    "settModesName": "现金结算",
    "createDate": null,
    "stopDate": null,
    "flag": "1",
    "beiyong1": "",
    "beiyong2": "现金结算的说明",
    "beiyong3": null
  }, {
    "id": "1392427353761779712",
    "settModesCode": "1002",
    "settModesName": "转账",
    "createDate": null,
    "stopDate": null,
    "flag": "1",
    "beiyong1": null,
    "beiyong2": "转账的说明",
    "beiyong3": null
  }, {
    "id": "1402518527482662912",
    "settModesCode": "1003",
    "settModesName": "到付",
    "createDate": "2021-06-09 14:50:49",
    "stopDate": null,
    "flag": "1",
    "beiyong1": "",
    "beiyong2": "测试修改",
    "beiyong3": null
  }]
export const JsData = {
  "code": 0,
  "type": "success",
  "message": "ok",
  "result": {
    "total": 3,
    "items": JSALLDATA
  },
  "list": null
}
export const JcDataByInfo = {
  "code": 0,
  "type": "success",
  "message": "ok",
  "result": {
    "levelList": [{
      "id": "2",
      "uniqueAccStandard": 2,
      "styleName": null,
      "tname": "系统模板",
      "tjici": "4-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2",
      "ttype": "系统模板",
      "tflg": null,
      "tnum": 0
    }],
    "acountStandardList": [{
      "id": 5,
      "uniqueAccStandard": 2,
      "accStandardName": "2007年新会计准则（企业）",
      "flagYusuan": "0",
      "num": 2,
      "accStyleUnique": "2",
      "styleName": "资产,负债,共同,权益,成本,损益",
      "codeFirst": 4
    }]
  },
  "list": null
}
export const JcDataByOne = {
  "code": 0,
  "type": "success",
  "message": "ok",
  "result": {
    "pingZhenNumberList": ["ibreakCode"],
    "basisMap": {
      "taxClass": "1",
      "accStandard": "2",
      "ccodeLevel": "4-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2",
      "currency": "RMB"
    },
    "dateMap": {
      "cashhierDate": "1",
      "verifyDate": "1",
      "bookDate": "1",
      "addAccDate": "1",
      "managerDate": "1",
      "wotDate": "1"
    },
    "pingZhenControlList": ["iverify", "iverifyCancel", "ifVerify"],
    "zhiDanList": ["ichronological", "ideficit", "isave", "ifreecorp"],
    "settingList": ["ibook", "icheckOut", "icash"]
  },
  "list": null
}
