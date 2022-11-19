import { defHttp } from '/@/utils/http/axios';
import {saveLanMuList} from "/@/api/record/system/accvoucher";
import {message} from "ant-design-vue";
import {useMessage} from "/@/hooks/web/useMessage";
import {defRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import moment from "moment";
import {useCompanyOperateStoreWidthOut} from "/@/store/modules/operate-company";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {useAccountPickerCache} from "/@/store/modules/boozsoft/components/AccountPicker/cache";
const { createConfirm,createWarningModal ,createInfoModal,createSuccessModal} = useMessage();

enum Api {
  findByFunctionModule = '/sys/subjectinitialBalance/findByFunctionModule',
  saveTaskInfo = '/sys/subjectinitialBalance/saveTaskInfo',
  markAnomalyApi = '/sys/subjectinitialBalance/markAnomaly',
  closeAnomalyApi = '/sys/subjectinitialBalance/closeAnomaly',
  delFunctionModule = '/sys/subjectinitialBalance/delFunctionModule',
  findByTaskId = '/sys/subjectinitialBalance/findByTaskId',
  countByTaskId = '/sys/subjectinitialBalance/countByTaskId',
  findAccCloseListApi = '/api/accClose/findByIyear'
}


export const countByTaskId = defRouteApi( ({id})=>{
  return {
    url: Api.countByTaskId + '?id=' + id,
    method: 'POST',
  }
})

export const findByTaskId = defRouteApi( ({id})=>{
  return {
    url: Api.findByTaskId + '?id=' + id,
    method: 'POST',
  }
})

export const findByFunctionModule = defRouteApi( (params:any)=>{
  return {
    url: Api.findByFunctionModule + '?iyear=' + params.iyear,
    method: 'POST',
  }
})

export const findAccCloseListByYaer = defRouteApi( (params:any)=>{
    return   {
      url: Api.findAccCloseListApi + '?iyear=' + params.iyear,
      method: 'GET',
    }
})

export const saveTaskInfo = defRouteApi( (params:any)=>{
  return   {
    url: Api.saveTaskInfo + '?id=' + params.id + '&iyear=' + params.iyear,
    method: 'POST',
  }
})
export const markAnomaly = defRouteApi( (params:any)=>{
  return   {
    url: Api.markAnomalyApi + '?id=' + params.id + '&iyear=' + params.iyear,
    method: 'POST',
  }
})
export const closeAnomaly = defRouteApi( (params:any)=>{
  return  {
    url: Api.closeAnomalyApi + '?id=' + params.id + '&iyear=' + params.iyear,
    method: 'POST',
  }
})

export const delFunctionModule = defRouteApi( (params:any)=>{
  return {
    url: Api.delFunctionModule + '?id=' + params.id,
    method: 'POST',
  }
})

export function compareDate(DateOne, DateTwo) {//当前时间 ~ 任务最大时间
  let OneMonth = DateOne.substring(5, DateOne.lastIndexOf("-"));
  let OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf("-") + 1);
  let OneYear = DateOne.substring(0, DateOne.indexOf("-"));
  let TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf("-"));
  let TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf("-") + 1);
  let TwoYear = DateTwo.substring(0, DateTwo.indexOf("-"));
  if (Date.parse(OneMonth + "/" + OneDay + "/" + OneYear) > Date.parse(TwoMonth + "/" + TwoDay + "/" + TwoYear)) {
    return true;
  } else {
    return false;
  }
}
export function compareTime(DateTwo) {//当前时间 ~ 任务最大时间
  let thisDate = new Date();
  if (thisDate> new Date(DateTwo.replace(/-/,"/"))) {
    return true;
  } else {
    return false;
  }
}
export function offsetToStr(DateOne){
  let value = new Date(DateOne.replace(/-/,"/"))
  let now=new Date( value.getTime()+ (30*60*1000));//后偏移30分钟
  let year = now.getFullYear();
  let month =(now.getMonth() + 1).toString();
  let day = (now.getDate()).toString();
  let hour = (now.getHours()).toString();
  let minute = (now.getMinutes()).toString();
  let second = (now.getSeconds()).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  if (hour.length == 1) {
    hour = "0" + hour;
  }
  if (minute.length == 1) {
    minute = "0" + minute;
  }
  if (second.length == 1) {
    second = "0" + second;
  }
  let dateTime = year + "-" + month + "-" + day +" "+ hour +":"+minute+":"+second;
  return dateTime;
}
export function serverTime(){
  let now = new Date()
  let year = now.getFullYear();
  let month =(now.getMonth() + 1).toString();
  let day = (now.getDate()).toString();
  let hour = (now.getHours()).toString();
  let minute = (now.getMinutes()).toString();
  let second = (now.getSeconds()).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  if (hour.length == 1) {
    hour = "0" + hour;
  }
  if (minute.length == 1) {
    minute = "0" + minute;
  }
  if (second.length == 1) {
    second = "0" + second;
  }
  let dateTime = year + "-" + month + "-" + day +" "+ hour +":"+minute+":"+second;
  return dateTime;
}

//获取指定时间的最后一天
export function getCurrentMonthLast (date){
  var endDate = new Date(date); //date 是需要传递的时间如：2018-08
  var month=endDate.getMonth();
  var nextMonth=++month;
  var nextMonthFirstDay=new Date(endDate.getFullYear(),nextMonth,1);
  var oneDay=1000*60*60*24;
  var dateString=new Date(nextMonthFirstDay-oneDay);
  return dateString.toLocaleDateString().split("/")[2]; //toLocaleDateString() 返回 如：2018/8/31
}

export function getCurrentAccountName(detail=false){

  const accountPickerInfo=useAccountPickerCache().get()
  if (null != detail && !detail){
    return accountPickerInfo.accId
  }
  return accountPickerInfo?.accountMode
}

export function getCurrentAccountYear(){
  const accountPickerInfo=useAccountPickerCache().get()
  return accountPickerInfo.iyear
}
export function getCurrentAccountCode(){
  return useCompanyOperateStoreWidthOut().getTenentCoCode
}
export async function  askTask (data){
 return new Promise((resolve) => {
   createConfirm({
      iconType: 'warning',
      title: '清除异常任务',
      content: data.msg,
      onOk: async () => {
        await closeAnomaly({iyear: data.year,id: data.taskId})
        resolve(true); //代码正常执行！
      },onCancel: async () => {
        resolve(false); //代码正常执行！
      }
    });
  })
}
export async function pointMessage (data){
  if(data.type = 'warning'){
      createWarningModal(data)
  }else if(data.type = 'success'){
      createSuccessModal(data)
  }else {
      createInfoModal(data)
  }
  if (data.delay){
    setTimeout(()=>{
      try {
        document.getElementsByClassName("ant-modal-confirm-body-wrapper")[0].childNodes[1].childNodes[1].click()
      }catch (e) {
      }
    },2000)
  }
}

export async function fireKeyEvent(el, evtType, keyCode){
  var doc = el.ownerDocument,
    win = doc.defaultView || doc.parentWindow,
    evtObj;
  if(doc.createEvent){
    if(win.KeyEvent) {
      evtObj = doc.createEvent('KeyEvents');
      evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
    }
    else {
      evtObj = doc.createEvent('UIEvents');
      Object.defineProperty(evtObj, 'keyCode', {
        get : function() { return this.keyCodeVal; }
      });
      Object.defineProperty(evtObj, 'which', {
        get : function() { return this.keyCodeVal; }
      });
      evtObj.initUIEvent( evtType, true, true, win, 1 );
      evtObj.keyCodeVal = keyCode;
      if (evtObj.keyCode !== keyCode) {
        console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
      }
    }
    el.dispatchEvent(evtObj);
  }
  else if(doc.createEventObject){
    evtObj = doc.createEventObject();
    evtObj.keyCode = keyCode;
    el.fireEvent('on' + evtType, evtObj);
  }
}

export async function MonthsBetw(date1, date2) { // 计算两个日期之间的所有月份

  date1 = date1.split("-");
  date2 = date2.split("-");
  //获取年,月数
  let year1 = parseInt(date1[0]),
    month1 = parseInt(date1[1]),
    year2 = parseInt(date2[0]),
    month2 = parseInt(date2[1]),
    //通过年,月差计算月份差
    months = (year2 - year1) * 12 + (month2 - month1) + 1;
  let i = 0
  let month = moment(date1).add(-1,'month');
  let yearMonth = []
  while (i<months)
  {
    if (i != 0) month.add(1,'month')
    yearMonth.push(month.format('YYYY-MM'))
    i++;
  }
  return yearMonth;
}
export function hasBlank(value:string){
  return  null == value || value == '' || value==undefined || value.length == 0
}
export function getThisIndexImg() {
  let imgNumber = ''
  switch(usePlatformsStore().getCurrentPlatformId)
  {
    case 1003:
      imgNumber = '14'
      break;
    case 1014:
      imgNumber = '37'
      break;
    default:
      imgNumber = '01'
  }
  return `/nc/img/nc/${imgNumber}.png`
}
export function duringGeneration(year, size) {
  let i = 1
  let list = []
  while (i <= parseInt(size)) {
    let num = i;
    if (i < 10) {
      num = '0' + num
    }
    list.push(year + num)
    i++
  }
  return list
}
export function trim(str){
  return hasBlank(str)?'': str.toString().replace(/(^\s*)|(\s*$)/g,"")
}
