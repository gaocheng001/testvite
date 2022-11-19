/**
 * 日志管理器
 */
export function useLoggerManager(){
  const tableData={
    id:0,
    num:'',
    type:'',
    title:'',
    creatBy:'',
    creatTime:'',
    ip:'',
    agent:'',
    chrome:'',
    method:'',
    commitData:'',
    execTime:'',
    errorInfo:'',
    appFlag:'',
  }


  return {
    log:{
      info:()=>{},
      error:()=>{},
      debug:()=>{},
      warn:()=>{},
      fatal:()=>{},
      FATAL:()=>{},
    }
  }
}

/**
 * 数据管理器
 */
export function useDataManager(){

}


/**
 * 任务管理器
 */
export function useTaskManager(){

}
