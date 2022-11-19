import { defineStore } from 'pinia'
import { store } from '/@/store'
;
import {saveApi} from "/@/api/group/SysLogger";
import {message} from "ant-design-vue";
import {useThisPrint} from "/@/views/boozsoft/global/SysLogger/popup/print";
import {exportExcel} from "/@/views/boozsoft/global/SysLogger/popup/excel";

export const useGroupSystemLoggerStore = defineStore({
  id: 'useGroupSystemLoggerStore',
  state: (): any => ({
  }),
  getters: {
  },
  actions:{
    openEditPageByAddFun(params,recordData) {
      recordData.value.openEditPage(true, 2)
      saveApi({
        type:'0',
        title:'进入了日志档案页面',
        creatby:'木子桉易洋',
        creattime:'2021-09-20',
        ip:'198.0.2.1',
        agent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38',
        chrome:'/goods/merge/buy',
        method:'GET',
        commitdata:'amount=%5B1%5D',
        exectime:'59',
        errorinfo:'',
        appflag:'pig',

      })

    },
    openEditPageByEditFun(params,recordData) {
      if (!(params instanceof MouseEvent)) {
        recordData.value.openEditPage(true, {
          params
        })
        return
      } else {
        if (recordData.value.tableSelectedRowKeys.length == 0) {
          message.info("请选择需要进行修改的行且只能是一行！")
          return
        }
        saveApi({
          type:'0',
          title:'进入了日志档案页面',
          creatby:'木子桉易洋',
          creattime:'2021-09-20',
          ip:'198.0.2.1',
          agent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38',
          chrome:'/goods/merge/buy',
          method:'GET',
          commitdata:'amount=%5B1%5D',
          exectime:'59',
          errorinfo:'',
          appflag:'pig',

        })
        recordData.value.openEditPage(true, {

          params: recordData.value.tableSelectedRowObjs[0]
        })
      }

    },

    async deleteFun(params,recordData) {
      if (!(params instanceof MouseEvent)) {
        await recordData.value.crud[3](params)
      } else {
        if (recordData.value.tableSelectedRowKeys.length == 0) {
          message.info("请选择需要进行修改的行且只能是一行！")
          return
        }
        await recordData.value.crud[3]({id: recordData.value.tableSelectedRowObjs[0].id})
      }
      const [registerTable, {
        reload,
        setTableData,
        getDataSource,
        setColumns,
        getColumns
      }] = recordData.value.useTableParams
      reload()
    },

    printFun(params,recordData) {
      useThisPrint(params,recordData)
    },

    excelFun(params,recordData) {
      exportExcel(params,recordData)
      return 'editBefore'
    },

    importFun(params,recordData) {
      return 'edit'
    }



  }
})

// Need to be used outside the setup
function useGroupSystemLoggerStoreWidthOut() {
  return useGroupSystemLoggerStore(store)
}
