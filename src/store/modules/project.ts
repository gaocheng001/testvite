import {store} from '/@/store'

import {GetDeptTreeByFlag} from "/@/api/sys/dept";
import {psnFindByFlag} from "/@/api/psn/psn";
import {findClassByBend, findProClassTree} from "/@/api/record/system/project_class";
import { ref } from 'vue';
// import {findByDatabaseUniqueCode} from "/@/api/record/system/project";
import {defineStore} from "pinia";
import {getCurrentAccountName} from "/@/api/task-api/tast-bus-api";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";


function dept(deptTree:any) {
  deptTree.forEach(
    (item: any) => {
      if (item.children != null) {
        dept(item.children)
      }
      item.title = '(' + item.deptCode + ')' + item.deptName
      item.value = item.uniqueCode
      item.key = item.uniqueCode
    })
}

function proClassTree(classTree:any) {
  classTree.forEach(
    (item: any) => {
      if (item.children != null) {
        proClassTree(item.children)
      }
      item.id = item.uniqueCode
      item.value = '(' + item.projectClassCode + ')' + item.projectClassName
    })
}
export const useProjectStore = defineStore({
  id: 'project',
  state: (): any => ({
    num:'01',
    treeData:ref([]),
    dynamicTenantId: getCurrentAccountName(true)

  }),
  getters: {
    getNum():any {
      return this.num
    },
    getTreeData():any {
      return this.treeData
    },
    getDynamicTenantId():any {
      return this.dynamicTenantId
    }


  },
  actions:{


    commitTreeData(treeData:any) {
      this.treeData=treeData
    },
    commitNum(num:any) {
      this.num=num
    },
    commitDynamicTenantId(dynamicTenantId:any) {
      // debugger
      this.dynamicTenantId = dynamicTenantId
    },


    async bb({treeData,psnList,classList,formItems,data}:any){
      //选择部门
      const res:any=await useRouteApi(GetDeptTreeByFlag,{schemaName: this.getDynamicTenantId})({})
      dept(res)
      treeData.value = res
      //选择人员
      const res2: any = await useRouteApi(psnFindByFlag, {schemaName: this.getDynamicTenantId})({})
      psnList.value = res2
      //选择项目分类
      const res3: any = await useRouteApi(findClassByBend, {schemaName: this.getDynamicTenantId})({itemCode:data.itemCode,projectClassCtl:data.projectClassCtl})
      classList.value = res3
      //数据库控制权限查询
      // const dist:any = await findByDatabaseUniqueCode(this.num)
      // 方式2
      formItems.value = JSON.parse(JSON.stringify(data))
      formItems.value.projectClassCode = (data.projectClassCode == 0 ? '' : data.projectClassCode)
      // formItems.value.projectCateCode = this.num

      // formItems.value.isControl = dist.isControl
      // formItems.value.isKeyword = dist.isKeyword
      // formItems.value.isOther = dist.isOther
      // formItems.value.isAuto = dist.isAuto
    },



    async toCateCodeProject({num}:any){
      this.commitNum(num)
    },


    /*async projectClassTree(){
      const res3=await useRouteApi(findProClassTree,{schemaName: this.getDynamicTenantId})(this.getNum)
      proClassTree(res3)
      this.treeData.value = res3
      return this.treeData
    }*/
  }

});

// Need to be used outside the setup
export function useProjectStoreWidthOut() {
  return useProjectStore(store);
}
