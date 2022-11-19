<template>
 <div>
   <Edit @save="saveData" @register="registerEditPage"/>

   <div
     :class="cardList"
   >
     <div :class="`${cardList}__content`">
       <!--        <div>ID:{{ item.id }}</div>-->
       <a-list style="height: 700px;overflow-y: scroll;overflow-x: hidden;">
         <a-row :gutter="16">
           <template
             v-for="(item) in cardList"
           >
             <a-col :span="8">
               <a-list-item style="width: 95%">
                 <a-card
                   :hoverable="true"
                   :class="`${cardList}__card`"
                   style="width: 100%"
                 >
                   <div class="abc" style="width: 100%;float: right;" @click="openEdit(item)">
                     <div style="width: 88px;height: 88px;display: inline-block">

                       <Popover placement="right">
                         <template #content>
                           <p class="p_specifics" @click="openEdit(item,false)">
                             <FormOutlined/>
                             修改
                           </p>
                           <p class="p_specifics" @click="del(item)">
                             <DeleteOutlined/>
                             删除
                           </p>
                         </template>
                         <EllipsisOutlined style="font-size: 20px"/>
                       </Popover>
                     </div>
                     <div style="width: calc(100% - 88px);display: inline-block;float: right;">
                       <div
                         style="float: right; border: 1px solid rgb(1, 143, 251);border-radius: 10px;padding: 0 10px; margin-top: -5px;">
                         {{ item.orgCode }}
                       </div>
                       <div style="font-size: 24px;margin-top: 20px;">
                         {{ item.orgName }}
                       </div>
                     </div>
                     <div style="font-size: 14px;">
                       行业性质：{{ formatHyInCharge(item.industryclassCode) }}
                     </div>
                     <!--                      <div style="float: right;">
                                             {{ item.sysFlag === '1' ? '系统模板' : '自定义模板' }}
                                           </div>-->
                   </div>
                 </a-card>
               </a-list-item>
             </a-col>
           </template>
         </a-row>
       </a-list>
     </div>

   </div>
 </div>
</template>
<script setup lang="ts">
import {BasicTable, useTable} from '/@/components/Table'
import {useModal} from '/@/components/Modal'

import {computed, onMounted, ref, reactive, watch} from 'vue'
import {
  getOrganizeList,
  deleteOrganize,
  saveOrganize,
  getOrganizeAll
} from '/@/api/record/group/im-organize'
import {findAllIndustry, getGroupAll} from "/@/api/record/group/im-group";
import Edit from '../popup/edit.vue'
import {cateFindStateFlag} from "/@/api/project_category/project_category";
import {useProjectStoreWidthOut} from '/@/store/modules/project'
import {getDeptListById} from "/@/api/record/system/dept";
import {psnFindAll} from "/@/api/psn/psn";
import {projectClassFindAll} from "/@/api/record/system/project_class";
import {
  CaretDownFilled,
  FormOutlined,
  DeleteOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined, EllipsisOutlined,
  EditFilled,
  PieChartFilled,
  FilterFilled, EditOutlined, SortAscendingOutlined, CheckOutlined, SortDescendingOutlined
} from '@ant-design/icons-vue';
import {
  Select as ASelect, Input as AInput, Popover, Tag as ATag, Popconfirm as APopconfirm,
  Radio as ARadio, Checkbox as ACheckbox, List as AList, Row as ARow, Col as ACol, Card as ACard,
  Table as ATable, message
} from 'ant-design-vue'
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group
const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const AListItem = AList.Item

//选择项目大类
const cateCode: any = ref()
const currentCateCode = computed(() => cateCode.value)

watch(currentCateCode, (abc) => {
  // projectStore.projectClassTree()
  reload({
    searchInfo: {}
  })
})

function createColumn({label,field}){
  return    {
    key: '0',
    title:label,
    dataIndex: field,
    align: 'center',
    width: 150,
  }
}
// const arr=[
//   $$columnModel$$
// ]
const arr=[
  {field:'name',label:'栏目名称'},
  {field:'name2',label:'栏目名称2'},
  {field:'name2',label:'栏目名称2'},
  {field:'name2',label:'栏目名称2'},
  {field:'name2',label:'栏目名称2'},
  {field:'name2',label:'栏目名称2'},
  {field:'name2',label:'栏目名称2'},
  {field:'name2',label:'栏目名称2'},
  {field:'name2',label:'栏目名称2'},
  {field:'name2',label:'栏目名称2'},

]

function createCurdModel({api,columns}){
  return {
    list:api,
    columns,
    editData: {
      id: '',
      uniqueCode: '',
      orgCode: '',
      orgName: '',
      orgSimpName: '',
      uniqueGroupCode: '',
      orgSuperior: '',
      industryclassCode: '',
      uniqueCodeZone: '',
      countryId: '',
      createDate: '',
      personInCharge: '',
      uniqueAccStandard: '',
      telephone: '',
      address: '',
      ccodeLevel: '',
      remarks: '',
    }
  }
}
const CrudModel=createCurdModel({
  api: getOrganizeList,
  columns: [
    ...arr.map(it=>{
      return createColumn({label:it.label,field:it.field})
    })
  ]
})
const CrudApi = CrudModel
//项目分类
const proClassList = ref([])
const groupInfoList = ref([])
const normList = ref([])
const levelList = ref([])


//部门
const deptList = ref([])

async function reloadDept() {
  const res: any = await getDeptListById()
  deptList.value = res.items
  // console.log(deptList.value)
}

function formatDeptCode(deptCode: any) {
  let str = deptCode
  // console.log(deptCode)
  deptList.value.forEach(
    function (dept: any) {
      if (dept.uniqueCode == deptCode) {
        // console.log(dept)
        str = dept.deptName
      }
    }
  )
  return str
}

//人员
const psnList = ref([])

async function reloadPsn() {
  const res: any = await psnFindAll()
  psnList.value = res.items
  // console.log(psnList.value)
}

function formatGroupInCharge(psnInCharge: any) {
  let str = psnInCharge
  groupInfoList.value.forEach(
    function (psn: any) {
      if (psn.uniqueCode == psnInCharge) {
        // console.log(psn)
        str = psn.groupName
      }
    }
  )
  return str
}

function formatNormInCharge(psnInCharge: any) {
  let str = psnInCharge
  normList.value.forEach(
    function (psn: any) {
      if (psn.uniqueAccStandard == psnInCharge) {
        // console.log(psn)
        str = psn.accStandardName
      }
    }
  )
  return str
}

function formatPsnInCharge(psnInCharge: any) {
  let str = psnInCharge
  // console.log(psnInCharge)
  psnList.value.forEach(
    function (psn: any) {
      if (psn.uniqueCode == psnInCharge) {
        // console.log(psn)
        str = psn.psnName
      }
    }
  )
  return str
}

function formatDqInCharge(psnInCharge: any) {
  if (psnInCharge == '' || null == psnInCharge) {
    return ""
  } else {
    let str = ""
    countryList.value.forEach((item) => {
      if (item.uniqueCode == psnInCharge) str = item.namech
    })
    return str
  }
}

function formatHyInCharge(psnInCharge: any) {
  if (psnInCharge == '' || null == psnInCharge) {
    return ""
  } else {
    let arr = JSON.parse(psnInCharge);
    let str = ""
    if (arr.length >= 1) {
      industryList.value.forEach((item) => {
        if (item.value == arr[0]) {
          str += item.label
          if (item.children.length > 0) {
            item.children.forEach((item1) => {
              if (item1.value == arr[1]) {
                str = str + ' / ' + item1.label
              }
            })
          }
        }
      })
    }
    return str
  }
}

function formatXzInCharge(psnInCharge: any) {
  if (psnInCharge == '' || null == psnInCharge) {
    return ""
  } else {
    let arr = JSON.parse(psnInCharge);
    let str = ""
    if (arr.length >= 1) {
      zoningList.value.forEach((item) => {
        if (item.value == arr[0]) {
          str += item.label
          if (item.children.length > 0) {
            item.children.forEach((item1) => {
              if (item1.value == arr[1]) {
                str = str + ' / ' + item1.label
                if (item1.children.length > 0) {
                  item1.children.forEach((item2) => {
                    if (item2.value == arr[2]) {
                      str = str + ' / ' + item2.label
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
    return str
  }
}

function formatZzInCharge(psnInCharge: any) {
  if (psnInCharge == '' || null == psnInCharge) {
    return ""
  } else {
    let str = ""
    getDataSource().forEach((item) => {
      if (item.uniqueCode == psnInCharge) str = item.orgSimpName
    })
    return str
  }
}

const countryList = ref([])
const zoningList = ref([])
const industryList = ref([])
onMounted(async () => {

})
const cardList: any = ref([])
const activeKey = ref(false)
// 这是示例组件
const [registerTable, {reload, setTableData, getDataSource, setColumns, getColumns}] = useTable({
  api: async (params) => {
    const a = {
      "items": [{
        "id": "1438082930978197504",
        "uniqueCode": "6141c6b7dd36a83bc3af1151",
        "orgCode": "JW",
        "orgName": "万亚软件集团基金会委员会",
        "orgSimpName": "万亚软件集团基金会委员会",
        "uniqueGroupCode": "6111f17bdd362fc683486337",
        "uniqueAccStandard": "1422095292169326592",
        "ccodeLevel": "4-2-2-2-2",
        "orgSuperior": "613f290add363b226833f79f",
        "createDate": "2021-09-01 18:10",
        "industryclassCode": "[\"611109dedd3632fbae7f583f\",\"611109dedd3632fbae7f5846\"]",
        "uniqueCodeZone": "",
        "personInCharge": "",
        "telephone": "",
        "address": "",
        "countryId": "",
        "remarks": "",
        "numberDec": "2",
        "unitPriceDec": "2",
        "rateDec": "5",
        "accvouchDec": "4",
        "voucherTypeNum": "1",
        "voucherTypeOtherNums": "",
        "yearStartDate": "01-01",
        "yearEndDate": "12-31",
        "periodNum": "12",
        "flag": "1",
        "beiyong1": null,
        "beiyong2": null,
        "beiyong3": null
      }, {
        "id": "1437363870829252608",
        "uniqueCode": "613f290add363b226833f79f",
        "orgCode": "AJ",
        "orgName": "湖北万亚软件集团基金会",
        "orgSimpName": "湖北万亚基金会",
        "uniqueGroupCode": "6111f17bdd362fc683486337",
        "uniqueAccStandard": "1422095292169326592",
        "ccodeLevel": "4-2-2-2-2",
        "orgSuperior": "",
        "createDate": "2021-09-01 18:32",
        "industryclassCode": "[\"611109dedd3632fbae7f583f\",\"611109dedd3632fbae7f5846\"]",
        "uniqueCodeZone": "[\"420000\",\"420100\",\"420105\"]",
        "personInCharge": "张三",
        "telephone": "13400000000",
        "address": "湖北武汉",
        "countryId": "0001",
        "remarks": "会员制基金协会，欢迎广大新老客户",
        "numberDec": "2",
        "unitPriceDec": "2",
        "rateDec": "5",
        "accvouchDec": "4",
        "voucherTypeNum": "1",
        "voucherTypeOtherNums": "",
        "yearStartDate": "2021-01-01 00:00",
        "yearEndDate": "2021-12-31 08:00",
        "periodNum": "12",
        "flag": "1",
        "beiyong1": null,
        "beiyong2": "img_20210916115215.png",
        "beiyong3": null
      }
      ], "page": 2, "total": 2, "size": 50
    }
    return a
  },
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: false,
  pagination: {
    pageSize: 50,
    showSizeChanger: true,
    pageSizeOptions: ['10', '30', '50', '100'],
    showTotal: t => `总共${t}条数据`
  },
  actionColumn: {
    width: 100,
    title: '操作',
    dataIndex: 'action',
    slots: {customRender: 'action'}
  },
  searchInfo: {}
})

const [registerEditPage, {openModal: openEditPage}] = useModal()


const openAddPage = () => {
  let data = CrudApi.editData
  data.isEdit = false
  data.groupInfoList = groupInfoList.value
  data.normList = normList.value
  data.levelList = levelList.value
  data.countryList = countryList.value
  data.zoningList = zoningList.value
  data.industryList = industryList.value
  data.numberDec = '2'
  data.unitPriceDec = '2'
  data.rateDec = '5'
  data.accvouchDec = '4'
  data.periodNum = '12'
  data.upList = getDataSource()
  openEditPage(true, {
    data: data
  })
}
const openEdit = (source: any, flag) => {
  let data = JSON.parse(JSON.stringify(source))
  data.isEdit = true
  data.isLook = flag
  data.groupInfoList = groupInfoList.value
  data.normList = normList.value
  data.levelList = levelList.value
  data.countryList = countryList.value
  data.zoningList = zoningList.value
  data.industryList = industryList.value
  data.upList = getDataSource()
  openEditPage(true, {
    data
  })
}
const del = async (data: any) => {
  await deleteOrganize(data).then(async (res) => {
    if (null != res && res.isOk == false) {
      await pointMessage({
        title: '处理结果',
        content: `删除失败,该组织下已经建立了${res.type == 'D02' ? '公司' : '下级组织'},无法进行删除！`,
        delay: true
      })
    } else {
      reload()
      await cardReload()
      await pointMessage({title: '处理结果', content: '删除成功！', delay: true})
    }
  }).catch(async () => await pointMessage({title: '处理结果', content: '删除失败！', delay: true}))
}

async function saveData(data: any) {
  if (data.id == '') data.id = null
  await saveOrganize(data).then(async (res) => {
    await pointMessage({title: '处理结果', content: '更新成功！', delay: true})
    await reload()
    await cardReload()
  }).catch(async () => await pointMessage({title: '处理结果', content: '更新失败！', delay: true}))
}

async function cardReload() {
  if (!activeKey.value) cardList.value = await getOrganizeAll()
}

onMounted(()=>{
  cardReload()
})
function onSearch() {
}

/**********************栏目设置**********************/
import {initDynamics, assemblyDynamicColumn} from "../data/data";
import {useMessage} from "/@/hooks/web/useMessage";
import {
  findDbLanMuList,
  saveLanMuList,
} from '/@/api/record/system/accvoucher';
import {
  pointMessage,
} from "/@/api/task-api/tast-bus-api";
import {cloneDeep} from "lodash-es";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findAllCountry} from "/@/api/record/costomer_data/customer";
import {findAllProvince} from "/@/api/record/system/zone";
import {initBasisTabAccoutData} from "/@/api/record/system/financial-settings";

const {createConfirm, createWarningModal} = useMessage();
const pageParameter = reactive({
  showRulesSize: 'MIN',
})
const visible = ref(false);
const windowWidth = (document.documentElement.clientWidth - (70/*+280*/))
const windowHeight = (window.innerHeight - (350))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef = ref(null)
const lanMuData = {
  'accId': 'postgre',
  'menuName': '组织信息',
  'type': '集团',
  objects: '',
  username: useUserStoreWidthOut().getUserInfo.username
}
const confirm = (e: MouseEvent) => {
  // 询问
  createConfirm({
    iconType: 'warning',
    title: '栏目同步',
    content: '是否将刚才设置同步数据库!',
    onOk: async () => {
      // 调整数据库 列参数
      //lanMuData.accId = getCurrentAccountName(false)
      lanMuData.objects = JSON.stringify(filterModifyData(dynamicColumnData.value, dynamicColumnDataCopy))
      if (lanMuData.objects == '[]') {
        createWarningModal({title: '温馨提示', content: '请先做修改后再进行确认同步数据库！'})
      } else {
        saveLanMuList(lanMuData).then(res => {
          message.success("数据库同步成功！")
        })
        // 重新赋值
        dynamicColumnDataCopy = JSON.parse(JSON.stringify(dynamicColumnData.value))
      }
    }
  });
  // 重新获取数据
  reloadColumns()
}
const cancel = (e: MouseEvent) => {
  // 恢复默认
  dynamicColumnData.value = []
  dynamicColumnData.value = dynamicColumnDataCopy
}
const edit = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children.filter(item => key === item.key)[0]);
    } else {
      let two = parseInt(arr[1] - 1)
      editableData[key] = cloneDeep(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0]);
    }
  } else {
    editableData[key] = cloneDeep(dynamicColumnData.value.filter(item => key === item.key)[0]);
  }
}
const save = (key: string, min: number, max: number) => {
  editableData[key].width = editableData[key].width > max ? max : editableData[key].width < min ? min : editableData[key].width
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}
const saveName = (key: string) => {
  if (key.toString().indexOf('-') != -1) {
    let arr = key.split('-');
    let one = parseInt(arr[0])
    if (arr.length == 2) {
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
      Object.assign(dynamicColumnData.value[one].children.filter(item => key === item.key)[0], editableData[key]);
    } else {
      let two = parseInt(arr[1] - 1)
      Object.assign(dynamicColumnData.value[one].children[two].children.filter(item => key === item.key)[0], editableData[key]);
    }
  } else {
    Object.assign(dynamicColumnData.value.filter(item => key === item.key)[0], editableData[key]);
  }
  delete editableData[key];
}

function filterModifyData(lanMuList: any, copyList) {
  let a = lanMuList.filter(item => {
    try {
      copyList.forEach(item2 => {
        if (item.key === item2.key && item.name == item2.name) {
          if (item.nameNew != item2.nameNew || item.width != item2.width || item.check != item2.check || item.align != item2.align)
            throw new Error('ok')
        }
      })
      return false
    } catch (e) {
      if (e.message == 'ok') {
        return true
      } else {
        return false
      }
    }
  })
  return a;
}

function combineParameters(staticList: any, dbList: any) {
  staticList.forEach(item => {
    dbList.forEach(item2 => {
      if (item.key === item2.key && item.name === item2.name) {
        item.nameNew = item2.nameNew
        item.width = parseInt(item2.width)
        item.check = item2.check == 'true'
        item.align = item2.align
      }
    })
  })
  return staticList
}

const reloadColumns = () => {
  let a = []
  a = getColumns()
  let last = a.pop()
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  newA.push(last)
  setColumns(newA)
  initTableWidth(newA)
  //searchConditonList.value = newA
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  //lanMuData.accId = getCurrentAccountName(false)
  findDbLanMuList(lanMuData).then(res => {
    // 栏目列
    let dbList = res.items
    if (dbList.length > 0) {
      let statiList = initDynamics()['DATA']
      dbList = combineParameters(statiList, dbList)
      dynamicColumnData.value = dbList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(dbList))
    } else {
      let statiList = initDynamics()['DATA']
      dynamicColumnData.value = statiList
      dynamicColumnDataCopy = JSON.parse(JSON.stringify(statiList))
    }
    // 表格列
    reloadColumns()
  })
}

function initTableWidth(thisCs) {
  let total = 60
  // debugger
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  /*  // 去除操作咧宽
    total -= 100*/
  if (total > windowWidth) {
    let f = 0
    if (visible.value) f = 260
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 20 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 20) + 'px')
  }
}

/*栏目设置end*/
const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const onSelectChange = (selectedRowKeys, objs) => {
  tableSelectedRowKeys.value = selectedRowKeys
  tableSelectedRowObjs.value = objs
};
const editBefore = () => {
  if (tableSelectedRowKeys.value.length == 0) {
    message.info("请选择需要进行修改的行且只能是一行！")
  } else {
    openEdit(tableSelectedRowObjs.value[0], false)
  }
}
const delBefore = async () => {
  if (tableSelectedRowKeys.value.length == 0) {
    message.info("请至少选择一行进行删除！")
  } else {
    for (let i = 0; i < tableSelectedRowObjs.value.length; i++) {
      let entity = tableSelectedRowObjs.value[i]
      let flag = false
      await deleteOrganize(entity).then(async (res) => {
        if (null != res && res.isOk == false) {
          await pointMessage({
            title: '处理结果',
            content: `删除失败,该组织下已经建立了${res.type == 'D02' ? '公司' : '下级组织'},无法进行删除！`,
            delay: true
          })
          flag = true
        } else {
          reload()
          await pointMessage({title: '处理结果', content: '删除成功！', delay: true})
        }
      }).catch(async () => {
        flag = true
        await pointMessage({title: '处理结果', content: '删除失败！', delay: true})
      })
      if (flag) break
    }
  }
}
watch(activeKey, async (v) => {
  if (!v && getDataSource().length != cardList.value.length) await cardReload()
})
</script>
<style src="../../../../../assets/styles/generate-code-record-style/record.less" lang="less" scoped></style>
