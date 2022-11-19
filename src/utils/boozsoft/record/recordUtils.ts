import {useModal} from "/@/components/Modal";
import {ref} from "vue";
import {saveApi} from "/@/api/group/SysLogger";
import {saveTaskApi} from "/@/api/record/system/task";
import {saveTableAuditApi} from "/@/api/group/TableAudit";
import {savePlatforms} from "/@/api/group/platform";
import {useBoozSoftStoreWidthOut} from "/@/store/modules/boozsoft/boozsoft-app";

export function defineRecrodData(paramsFun) {

  function defineStore(params) {
    return {
      ...params.state(),
      ...params.actions,
    }
  }

  const {columns,crud,crudFuns,actions,state:stateFun,mounted}=paramsFun
  crudFuns.forEach(it=>it.enable=true)
  const [registerEditPage, {openModal: openEditPage}] = useModal()
  let newState={}
  if(stateFun!=null){
    newState=stateFun()
  }
  const instance = defineStore({
    state: function () {
      return {
        activeKey:ref(true),
        crud,
        columns,
        arr:crudFuns.map(it=>{
          return {label:it[0],enable:true,fun:it[1]}
        }),
        ...newState
      }
    },
    actions: {
      ...actions,
      registerEditPage,
      openEditPage,
      reload() {

      },
      async saveData(params) {
        await instance.crud[2](params)
        const [registerTable, {
          reload,
          setTableData,
          getDataSource,
          setColumns,
          getColumns
        }] = instance.useTableParams
        reload()
      }
    },

  })
  if(mounted!=null){
    mounted(instance)
  }
  // logger.info('进入日志档案')
  return instance
}


export function useNcLogger({recordName}) {
  return {
    ncLogger: {
      info: function (title) {
        // console.log(title)
        saveApi({
          type: '0',
          title,
          creatby: useBoozSoftStoreWidthOut().getUserInfo.realName,
          creattime: new Date().getTime(),
          ip: '198.0.2.1',
          agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38',
          chrome: '/goods/merge/buy',
          method: 'GET',
          commitdata: 'amount=%5B1%5D',
          exectime: '59',
          errorinfo: '',
          appflag: 'pig',

        })
      }
    }
  }
}

export function useNcTask({recordName}) {
  return {
    ncTask: {
      info: function ({functionModule}) {
        const date='2020-01-01'
        saveTaskApi({
          params: {
            caozuoUnique: '001',
            time: date,
            functionModule,
            recordNum:recordName,
            state: 1,
            iyear: date.split('-')[0],
            imonth: date.split('-')[1],
            method: null,
          }
        }, null)
      },
      getTaskApi(params){
        function debuggerInfo() {
          console.warn(
            '--------- 调试信息 ---------\n',
            '\n\n传入任务名:',
            '\n\n获取任务列表:',['当前角色','拥有的平台'],
            '\n',
            // '\n\n\n\n\n--------- 当前角色 ---------',{id:thisRole.value,object:roleList.value.filter(it=>it.value==thisRole.value)[0]},
            // '\n\n\n\n\n--------- 拥有的平台 ---------',[ownPlatforms.value,ownPlatforms.value.map(it => it.value.id)],
            // '\n\n\n\n\n--------- 接口数据详情 ---------',null,
            // '\n\n\n\n\n--------- 接口数据 ---------',{roleId:thisRole.value,ownPlatformsIds:ownPlatforms.value.map(it => it.value.id)},
            // '\n\n\n\n\n--------- APi ---------',[savePlatforms]
          )
        }
        debuggerInfo()
        const date='2020-01-01'
        return {
          caozuoUnique: '001',
          time: date,
          recordNum:recordName,
          state: 1,
          iyear: date.split('-')[0],
          imonth: date.split('-')[1],
          method: null,
        }
      },
      delete:function (key){

      }
    }
  }
}

export function useNcAudit({recordName}) {
  return {
    ncAudit: {
      info: function (params) {
        const {data:arr, recordName2:tableName, auth, type} = params
        const createTime='2020-01-01'
        saveTableAuditApi({data: JSON.stringify(arr)})
      }
    }
  }
}
