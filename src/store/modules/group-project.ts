import {store} from '/@/store'

// import {GetDeptTreeByFlag} from "/@/api/sys/dept";
import {psnFindByFlag} from "/@/api/record/system/group-psn";
import {findProClassTree} from "/@/api/record/system/group_project_class";
import { ref } from 'vue';
// import {findByDatabaseUniqueCode} from "/@/api/record/system/project";
import {defineStore} from "pinia";


/*function dept(deptTree:any) {
  deptTree.forEach(
    (item: any) => {
      if (item.children != null) {
        dept(item.children)
      }
      item.title = '(' + item.deptCode + ')' + item.deptName
      item.value = item.uniqueCode
      item.key = item.uniqueCode
    })
}*/

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
    treeData:ref([])


  }),
  getters: {
    getNum():any {
      return this.num
    },
    getTreeData():any {
      return this.treeData
    }


  },
  actions:{


    commitTreeData(treeData:any) {
      this.treeData=treeData
    },
    commitNum(num:any) {
      this.num=num
    },


    async bb({treeData,psnList,classList,formItems,data}:any){
      //选择部门
      /*const res:any=await GetDeptTreeByFlag()
      dept(res)
      treeData.value = res*/
      treeData.value = []
      //选择人员
      const res2:any=await psnFindByFlag({})
      psnList.value = res2
      //选择项目分类
      const res3:any=await findProClassTree()
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


    async projectClassTree(){
      const res3=await findProClassTree()
      proClassTree(res3)
      this.treeData.value = res3
      return this.treeData
    }
  }

});

// Need to be used outside the setup
export function useProjectStoreWidthOut() {
  return useProjectStore(store);
}
