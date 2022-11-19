<template>
  <div>
    <div class="app-container">
      <div class="app-container-neck">
        <div class="ant-btn-group" style="float:left;" >
          <button type="button" class="ant-btn ant-btn-me" @click="openAddPage()">新建</button>
          <button type="button" class="ant-btn ant-btn-me" @click="openEditPageBefore">修改</button>
          <button type="button" class="ant-btn ant-btn-me" @click="openPwdPageBefore">密码</button>
          <button type="button" class="ant-btn ant-btn-me">解锁</button>
          <button type="button" class="ant-btn ant-btn-me">删除</button>
          <button type="button" class="ant-btn ant-btn-me" @click="openExcel">导入</button>
          <button type="button" class="ant-btn ant-btn-me" @click="exportExcel">导出</button>
          <!--          <button type="button" class="ant-btn ant-btn-me"-->
          <!--                  @click="closeCurrent(),router.push(`/${mark == 1003?'system':'origin'}/home/welcome`)">-->
          <!--            退出-->
          <!--          </button>-->
        </div>
        <div style="float: right; margin-left: 10px">
          <a-button class="ant-btn-me">
            <SyncOutlined :style="{ fontSize: '14px' }"/>
          </a-button>
          <a-popover placement="bottom">
            <template #content>
              <a-popconfirm
                ok-text="保存"
                cancel-text="关闭"
                @confirm="confirm"
                @cancel="cancel">
                <template #icon><b>栏目设置</b><br></template>
                <template #title>
                  <div style="width: 640px">
                    <a-table bordered :data-source="dynamicColumnData" :columns="dynamicColumns"
                             childrenColumnName="children" :pagination="false"
                             style="max-height: 500px;overflow-y: auto" class="lanmu-table">
                      <template #checkBox="{ text, record }">
                        <a-checkbox v-model:checked="record.check" :disabled="record.isFixed"/>
                      </template>
                      <template #widthInput="{ text, record }">
                        <div class="editable-cell">
                          <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                            <a-input type="number" v-model:value="editableData[record.key].width"
                                     @pressEnter="save(record.key,record.min,record.max)"
                                     style="width: 80px"/>
                            <check-outlined class="editable-cell-icon-check"
                                            @click="save(record.key,record.min,record.max)"/>
                          </div>
                          <div v-else class="editable-cell-text-wrapper">
                            {{ text || ' ' }}
                            <edit-outlined class="editable-cell-icon" @click="edit(record.key)"/>
                            <span style="float: right;">{{ record.min + '~' + record.max }}</span>
                          </div>
                        </div>
                      </template>
                      <template #nameInput="{ text, record }">
                        <div class="editable-cell">
                          <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                            <a-input type="text" v-model:value="editableData[record.key].nameNew"
                                     @pressEnter="saveName(record.key)" style="width: 100px"/>
                            <check-outlined class="editable-cell-icon-check"
                                            @click="saveName(record.key)"/>
                          </div>
                          <div v-else class="editable-cell-text-wrapper">
                            {{ text || ' ' }}
                            <edit-outlined class="editable-cell-icon" @click="edit(record.key)"/>
                          </div>
                        </div>
                      </template>
                      <template #alignRadio="{ text, record }">
                        <a-radio-group default-value="a" size="small" v-model:value="record.align"
                                       :disabled="record.align==''">
                          <a-radio-button value="left">
                            左
                          </a-radio-button>
                          <a-radio-button value="center">
                            中
                          </a-radio-button>
                          <a-radio-button value="right">
                            右
                          </a-radio-button>
                        </a-radio-group>
                      </template>
                    </a-table>
                  </div>
                </template>
                <a-button style="width: 120px;margin-bottom: 2px">栏目设置</a-button>
              </a-popconfirm>
              <br/>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MAX'"
                    :style="pageParameter.showRulesSize==='MAX'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortDescendingOutlined/>&nbsp;大号字体&ensp;<CheckOutlined
                v-if="pageParameter.showRulesSize==='MAX'"/></span><br/>
              <span class="group-btn-span-special2" @click="pageParameter.showRulesSize = 'MIN'"
                    :style="pageParameter.showRulesSize==='MIN'?{backgroundColor: '#0096c7',color: 'white'}:''">
                <SortAscendingOutlined/>&nbsp;小号字体&ensp;<CheckOutlined
                v-if="pageParameter.showRulesSize==='MIN'"/></span>
            </template>
            <a-button>
              <SettingFilled :style="{ fontSize: '14px' }"/>
            </a-button>
          </a-popover>

          <a-button @click="activeKey = !activeKey">
            <PicLeftOutlined :style="{ fontSize: '14px' }"/>
          </a-button>
          <!--          <a-button>
                      <FilterFilled :style="{ fontSize: '14px' }"/>
                    </a-button>-->
        </div>

        <div style="float: right; position: relative">
          <!-- 搜索 -->
          <a-select v-model:value="pageParameter.searchConditon.requirement" style="width: 150px;"
                    class="special_select">
            <!--          v-if="item.ifShow == true" .slice(1) -->
            <template v-for="item in CrudApi.columns">
              <a-select-option :value="item.dataIndex">
                {{ item.title }}
              </a-select-option>
            </template>
          </a-select>
          <a-input-search
            placeholder=""
            v-model:value="pageParameter.searchConditon.value"
            @search="onSearch"
            style="width: 200px;border-radius: 4px"
          />
        </div>
      </div>
    </div>
    <div class="app-container">
      <PageWrapper dense content-full-height fixed-height content-class="flex">
        <Edit @save="saveData" @register="registerEditPage"/>
        <EditBatch @save="saveDataBatch" @register="registerEditBatchPage"/>
        <Pwd @save="saveData" @register="registerPwdPage"/>
        <Excel
          @reload="reload"
          @register="registerExcelPage"
        />
        <!--        style="width: calc(100% - 250px);"  <LeftTree @select="handleSelect"/>-->
        <div>
          <BasicTable
            v-show="activeKey"
            ref="tableRef"
            :row-selection="{ type: 'checkbox',fixed: true, selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
            :rowKey="r=>r.id"
            :class="pageParameter.showRulesSize=='MAX'?'a-table-font-size-16':'a-table-font-size-12'"
            :scroll="{ x: totalColumnWidth,y: windowHeight }"
            :loading="loadMark"
            @register="registerTable"
          >
            <template #username="{ record }"><span class="tableUStyle" @click="openEdit(record)">{{
                record.username
              }}</span></template>
            <template #realName="{ record }"><span class="tableUStyle" @click="openEdit(record)">{{
                record.realName
              }}</span></template>
            <template #userType="{ record }"> {{ formatUserType(record.beiyong5) }}</template>
            <template #pwdPolicy="{ record }"> {{
                formatPwdLength(record.pwdPolicy, 'pwdName')
              }}
            </template>
            <template #beiyong4="{ record }"> {{
                formatPwdLength(record.pwdPolicy, 'pwdLength')
              }}
            </template>
            <template #flag="{ record }">
              <Tag :color="record.flag === '1'?'green':record.flag === '2'?'black':'red'">{{
                  record.flag === '1' ? '启用' : record.flag === '2' ? '锁定' : '停用'
                }}
              </Tag>
            </template>
            <!--      <template #action="{ record }">
                    <div>
                      <a-popover placement="bottom">
                        <template #content>
                          <p style="cursor: pointer" @click="openEdit(record)">
                            <FormOutlined/>
                            编辑
                          </p>
                          <p v-if="record.flag === '0'" style="cursor: pointer" @click="upFlag(record.id, '1')"
                          >
                            <CheckCircleOutlined/>
                            启用
                          </p
                          >
                          <p v-if="record.flag === '1'" style="cursor: pointer" @click="upFlag(record.id, '0')"
                          >
                            <CloseCircleOutlined/>
                            停用
                          </p
                          >
                          <p style="cursor: pointer" @click="del(record.id)">
                            <DeleteOutlined/>
                            删除
                          </p>
                        </template>
                        <a-button>
                          <CaretDownFilled/>
                        </a-button>
                      </a-popover>
                    </div>
                  </template>-->
          </BasicTable>
        </div>
        <div v-if="!activeKey" :class="cardList">
          <div :class="`${cardList}__content`">
            <!--        <div>ID:{{ item.id }}</div>-->
            <a-list style="height: 700px; overflow-y: scroll; overflow-x: hidden">
              <a-row :gutter="16">
                <template v-for="(item, index) in cardList" :key="index">
                  <a-col :span="6">
                    <a-list-item style="width: 100%">
                      <a-card
                        :hoverable="true"
                        :class="`${cardList}__card`"
                        :style="
                          item.flag === '1' ? 'width: 100%;' : 'width: 100%;background-color: #b7b5b5;'
                        "
                      >
                        <div style="width: 30%; float: left"></div>
                        <div style="width: 100%; float: left">
                          <div :class="`${cardList}__card-title`">
                            <Icon v-if="item.icon" class="icon" :icon="item.icon"
                                  :color="item.color"/>
                          </div>
                          <div
                            style="
                              float: right;
                              border: 1px solid rgb(1, 143, 251);
                              border-radius: 10px;
                              padding: 0 10px;
                            "
                          >
                            {{ formatUserType(item.beiyong5) }}
                          </div>
                          <div style="font-size: 24px; width: 100%; text-align: center">
                            {{ item.username }}
                          </div>
                          <div style="font-size: 16px; width: 100%; text-align: left">
                            Mob: {{ item.phone }}
                          </div>
                          <div style="font-size: 16px; width: 100%; text-align: left">
                            E-mail: {{ item.email }}
                            <div style="float: right">
                              <Icon
                                class="icon"
                                icon="ant-design:ellipsis-outlined"
                                size="16"
                                @click="del(item.id)"
                              />
                            </div>
                          </div>
                        </div>
                      </a-card>
                    </a-list-item>
                  </a-col>
                </template>
              </a-row>
            </a-list>
          </div>
        </div>
      </PageWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import {deletById, updateFlag} from '/@/api/record/system/caozuoyuan';
import {makeNum, saveBoozUserApi} from '/@/api/sys/user';
import {getCurrentAccountName, getThisIndexImg} from '/@/api/task-api/tast-bus-api';
import {PageWrapper} from '/@/components/Page'
import {BasicTable, useTable, TableAction} from '/@/components/Table';
import Edit from './popup/edit.vue';
import EditBatch from './popup/editBatch.vue';
import Pwd from './popup/password.vue';
import Excel from './popup/excel.vue';
import {useModal} from '/@/components/Modal';
import {onMounted, provide, reactive, ref, unref} from 'vue';
import Icon from '/@/components/Icon/index';
import {getAllRoleList as findAllRoles} from '/@/api/sys/system';
import {findAll as findAllPassword} from '/@/api/record/pwd-rule/data';

const {closeCurrent} = useTabs(router);
import {useMessage} from '/@/hooks/web/useMessage';
import LeftTree from './popup/LeftTree.vue';
import {
  CaretDownFilled,
  FormOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined, EditOutlined,
  FilterFilled, SortAscendingOutlined, CheckOutlined, SortDescendingOutlined
} from '@ant-design/icons-vue';
import {
  Col as ACol,
  Popover as APopover,
  Input as AInput,
  Select as ASelect,
  Checkbox as ACheckbox,
  Row as ARow,
  Card as ACard, Popconfirm as APopconfirm,
  List as AList, message, Radio as ARadio, Table as ATable, Tag
} from 'ant-design-vue'

const AInputSearch = AInput.Search
const ASelectOption = ASelect.Option
const AListItem = AList.Item
const ACheckboxGroup = ACheckbox.Group
const ARadioButton = ARadio.Button
const ARadioGroup = ARadio.Group
import {findAll, saveUser, saveUserBatch} from '/@/api/caozuoyuan/caozuoyuan';
import {hasBlank} from "/@/api/task-api/tast-bus-api";
// import {aoaToSheetXlsx} from "/@/views/boozsoft/xian_jin_liu_liang/yin_hang_dui_zhang/yin_hang_dui_zhang_dan/excel/components/importexcel";
const aoaToSheetXlsx=null
import {useTabs} from "/@/hooks/web/useTabs";
import router from "/@/router";
import {usePlatformsStore} from "/@/store/modules/platforms";
import {assemblyDynamicColumn, initDynamics} from "./data";
import {useUserStoreWidthOut} from "/@/store/modules/user";
import {findDbLanMuList, saveLanMuList} from "/@/api/record/system/accvoucher";
import {cloneDeep} from "lodash-es";

const CrudApi = {
  list: findAll,
  columns: [
    {
      title: '状态',
      dataIndex: 'flag',
      slots: {customRender: 'flag'},
    },
    {
      title: '操作员姓名',
      dataIndex: 'realName',
      ellipsis: true,
      slots: {customRender: 'realName'},
    },
    {
      title: '登录账户',
      dataIndex: 'username',
      ellipsis: true,
      slots: {customRender: 'username'},
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      ellipsis: true,
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      ellipsis: true,
    },
    {
      title: '生效日期',
      dataIndex: 'effectiveDate',
      ellipsis: true,
    },
    {
      title: '失效日期',
      dataIndex: 'invalidDate',
      ellipsis: true,
    }, {
      title: '最新登录日期',
      dataIndex: 'beiyong1',
      ellipsis: true,
    },
    {
      title: '锁定日期',
      dataIndex: 'beiyong2',
      ellipsis: true,
    }
    ,
    {
      title: '密码策略',
      dataIndex: 'pwdPolicy',
      ellipsis: true,
      slots: {customRender: 'pwdPolicy'},
    }
    ,
    {
      title: '密码长度',
      dataIndex: 'beiyong4',
      ellipsis: true,
      slots: {customRender: 'beiyong4'},
    }
    ,
    {
      title: '所属角色',
      dataIndex: 'beiyong5',
      ellipsis: true,
      slots: {customRender: 'userType'},
    }
  ],
};
// 这是示例组件
const [registerTable, {setTableData, getColumns, setColumns, reload, getDataSource}] = useTable({
  api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: true,
  indexColumnProps: {width: 60,fixed: 'left'},
  /*  showTableSetting: true,*/
  /*  tableSetting: {
      redo: true,
      size: false,
      setting: true,
      fullScreen: false
    },*/
  pagination: {
    pageSize: 20,
    showSizeChanger: true,
    pageSizeOptions: ['20', '50'],
    showTotal: t => `总共${t}条数据`,
  },
  /*  actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      slots: {customRender: 'action'},
    },*/
});
const [registerEditPage, {openModal: openEditPage}] = useModal();
const [registerEditBatchPage, {openModal: openEditBatchPage}] = useModal();
const [registerPwdPage, {openModal: openPwdPage}] = useModal();
const {createConfirm, createWarningModal, createInfoModal} = useMessage();
const val = {
  id: '',
  account: '',
  password: '',
  userName: '',
  phone: '',
  email: '',
  flag: '',
};
//add
const openAddPage = (data, index, e) => {
  openEditPage(true, {
    data: val,
  });
};
//edit
const openEdit = (data) => {
  openEditPage(true, {
    data: data,
  });
};
const activeKey = ref(true);
const prefixCls = 'list-card';
const cardList = ref({});

const roleList = ref([])
const pwdList = ref([])
const loadMark = ref(false)
onMounted(async () => {
  await reloadCurrentPage();
  await loadDbRoldData()
  pwdList.value = await findAllPassword()
  resetDynamicColumnData()
});
provide('roleList', roleList) // 提供者
provide('pwdList', pwdList) // 提供者
//list
async function reloadCurrentPage() {
  const res = await findAll();
  cardList.value = res.items;
}

async function loadDbRoldData() {
  let dbRoleList = await findAllRoles()
  let list = []
  dbRoleList.forEach((item, index) => {
    list.push({id: item.id, roleName: item.roleName})
  })
  roleList.value = list;

}

async function saveDataBatch(data) {
  await saveUserBatch(data).then(() => {
    createInfoModal({title: '温馨提示', content: '操作员批量更新成功！'})
  }).catch(() => {
    createInfoModal({title: '温馨提示', content: '操作员批量更新失败！'})
  }).finally(() => {
    reload()
  })
  await reloadCurrentPage();
  tableSelectedRowKeys.value = []
  tableSelectedRowObjs.value = []
}

//save
async function saveData(data) {
  /* async function createBoozUser(user) {
     const userLoginNum = await makeNum();
     const formItems = {
       id: '',
       userLoginNum: 0,
       userName: '',
       nickName: '',
       password: '123456',
       phone: '',
       email: '',
       flag: '',
       userType: ['400']
     };
     formItems.userLoginNum = userLoginNum;
     formItems.userName = '用户' + userLoginNum;
     return formItems;
   }*/

  // await saveBoozUserApi(data);
  await saveUser(data).then(() => {
    createInfoModal({title: '温馨提示', content: '操作员已完成更新！'})
  }).catch(() => {
    createInfoModal({title: '温馨提示', content: '操作员更新失败！'})
  }).finally(() => {
    reload()
  })
  await reloadCurrentPage();
}

//format data
function formatUserType(id) {
  let str = '';
  if (hasBlank(id)) return str
  let arr = JSON.parse(id)
  let names = roleList.value.filter(item => arr.indexOf(item.id) != -1).map(item => item.roleName)
  if (names.length > 0) str = names.join(',')
  return str;
}

function formatPwdLength(id, type) {
  let str = '';
  let names = pwdList.value.filter(item => item.id == id).map(item => item[type])
  if (names.length > 0) str = names[0]
  return str;
}


//edit updateFlag
async function upFlag(id, flag) {
  let str = '启用';
  if (flag === '0') {
    str = '停用';
  }
  createConfirm({
    iconType: 'warning',
    title: str,
    content: '请确认是否' + str + '操作!',
    onOk: async () => {
      await updateFlag(id, flag);
      await reloadCurrentPage();
      reload();
    },
  });
}

//del
async function del(id) {
  createConfirm({
    iconType: 'warning',
    title: '删除',
    content: '请确认是否删除!',
    onOk: async () => {
      await deletById(id);
      await reloadCurrentPage();
      reload();
    },
  });
}

function onSearch() {
  loadMark.value = true
  reload({
    searchInfo: pageParameter
  })
  loadMark.value = false
}

const searchConditonList = ref([])


const handleSelect = (value) => {
  loadMark.value = true
  pageParameter.roleValue = value.uniqueCode
  reload({
    searchInfo: pageParameter
  })
  loadMark.value = false
}

const tableSelectedRowKeys = ref([])
const tableSelectedRowObjs = ref([])
const openEditPageBefore = () => {
  if (tableSelectedRowKeys.value.length == 0) {
    createWarningModal({title: '温馨提醒', content: "修改时至少选中一条数据！"});
  } else if (tableSelectedRowKeys.value.length > 1) {
    openEditBatchPage(true, {
      data: tableSelectedRowObjs.value,
      type: 'edit'
    });
  } else {
    openEditPage(true, {
      data: tableSelectedRowObjs.value[0],
    });
  }
}
// 页面函数区
const onSelectChange = (selectedRowKeys, obj) => {
  tableSelectedRowObjs.value = obj;
  tableSelectedRowKeys.value = selectedRowKeys;
}

const openPwdPageBefore = () => {
  if (tableSelectedRowKeys.value.length == 0) {
    createWarningModal({title: '温馨提醒', content: "修改时至少选中一条数据！"});
  } else if (tableSelectedRowKeys.value.length > 1) {
    openEditBatchPage(true, {
      data: tableSelectedRowObjs.value,
      type: 'pass',
    });
  } else {
    openPwdPage(true, {
      data: tableSelectedRowObjs.value[0],
    });
  }
}
const [registerExcelPage, {openModal: openExcelPage}] = useModal()
const openExcel = () => {
  openExcelPage(true, {
    data: {}
  })
}

//文件导出
async function exportExcel() {
  // debugger
  const arrHeader = ['操作员姓名', '登录账户', '所属角色', '手机号', '电子邮箱', '密码策略', '生效日期', '失效日期', '状态']
  const columnList = ['realName', 'username', 'beiyong5', 'phone', 'email', 'pwdPolicy', 'effectiveDate', 'invalidDate', 'flag']
  const arrData = getDataSource().map((item) => columnList.map(column => {
    let v
    if (column == 'beiyong5' && null != item[column]) {
      v = formatUserType(item[column])
    } else if (column == 'pwdPolicy') {
      v = formatPwdLength(item[column], 'pwdName')
    } else if (column == 'flag') {
      v = item[column] == '1' ? "启用" : "停用";
    } else {
      v = item[column];
    }
    return v
  }));
  // 保证data顺序与header一致
  aoaToSheetXlsx({
    data: arrData,
    header: arrHeader,
    filename: 'NC系统操作员.xlsx',
  });
}


/*start栏目设置*/
const pageParameter = reactive({
  showRulesSize: 'MIN',
  searchConditon: {
    requirement: 'realName',
    value: ''
  },
  flag: '',
  roleValue: '',
})
const mark = usePlatformsStore().getCurrentPlatformId
const visible = ref(false);
const windowWidth = (document.documentElement.clientWidth - (70 + 280))
const windowHeight = (window.innerHeight - (350))
const totalColumnWidth = ref(0)
const dynamicColumns = initDynamics().DEFAULT
const dynamicColumnData: any = ref([])
let dynamicColumnDataCopy = []
const editableData = reactive({});
const tableRef: any = ref(null)
const lanMuData = {
  'accId': 'postgres',
  'menuName': '操作员',
  'type': '列表',
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
      lanMuData.accId = getCurrentAccountName(false)
      lanMuData.objects = JSON.stringify(filterModifyData(dynamicColumnData.value, dynamicColumnDataCopy))
      if (lanMuData.objects == '[]') {
        createWarningModal({content: '请先做修改后再进行确认同步数据库！'})
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
    let arr: any = key.split('-');
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
    let arr: any = key.split('-');
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
    let arr: any = key.split('-');
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
    } catch (e: any) {
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
  /*let a: any = []
  a = getColumns()
  let last = a.pop()*/
  let newA = JSON.parse(JSON.stringify(CrudApi.columns))
  newA = assemblyDynamicColumn(dynamicColumnData.value, newA)
  // newA.push(last)
  setColumns(newA)
  initTableWidth(newA)
  //searchConditonList.value = newA
}

function resetDynamicColumnData() {
  // 先从数据查询是否已经设置
  lanMuData.accId = getCurrentAccountName(false)
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
    //pageReload()
  })
}

function initTableWidth(thisCs) {
  let total = 60
  thisCs.forEach(item => {
    if (item.ifShow == null || item.ifShow)
      total += parseInt(item.width)
  })
  /*  // 去除操作咧宽
    total -= 100*/
  // debugger
  if (total > windowWidth) {
    let f = 0
    if (visible.value) f = 260
    totalColumnWidth.value = Number(windowWidth) - f
    tableRef.value.$el.style.setProperty('width', (windowWidth + 70 - f) + 'px')
  } else {
    if (visible.value && (windowWidth - 260) < total) total -= (total - (windowWidth - 260))
    totalColumnWidth.value = total
    tableRef.value.$el.style.setProperty('width', (total + 70) + 'px')
  }
}

const pageReload = () => {
  setTableData([]) // 清空可能残留的数据
  reload({
    searchInfo: pageParameter
  })
}
/*栏目设置end*/
</script>
<style src="../../../../assets/styles/global-menu-index.less" lang="less" scoped></style>
<style scoped lang="less">
.a-table-font-size-16 :deep(td),
.a-table-font-size-16 :deep(th) {
  font-size: 16px !important;
  padding: 5px 8px !important;
}

.a-table-font-size-12 :deep(td),
.a-table-font-size-12 :deep(th) {
  font-size: 14px !important;
  padding: 2px 8px !important;
}

.app-container:nth-of-type(1) {
  background-color: #f2f2f2;
  padding: 10px 5px;
  margin: 10px 10px 5px;
}

.app-container:nth-of-type(2) {
  padding: 0px;
  margin: 5px 10px;
  background: #b4c8e3 !important;
}
</style>
