<template>
  <div class="nc-hr-tags">
    <Row type="flex">
      <Col :span="6" >
        <div class="div-configure">
          <div><span>NC应用服务器配置</span></div>
          <div>
            <div>
              <div>
                <span>软件配置</span>
                <SettingOutlined @click="openConfigSetting"/>
              </div>
              <ul>
                <li><span>操作系统：</span><span>{{serverConfig.osName}}</span></li>
                <li><span>数据库：</span><span>{{serverConfig.databaseName}}</span></li>
                <li><span>管理系统：</span><span>{{serverConfig.managementSystem}}</span></li>
                <li><span>数据备份：</span><span>{{serverConfig.dataBackup}}</span></li>
                <li><span>安全防护：</span><span>{{serverConfig.security}}</span></li>
                <li><span>外网IP地址：</span><span>{{serverConfig.extranetIp}}</span></li>
                <li><span>内网IP地址：</span><span>{{serverConfig.intranetIp}}</span></li>
              </ul>
            </div>
            <!--            <div>
                          <div>
                            <span>硬件配置</span>
                            <SettingOutlined @click="openConfigSetting"/>
                          </div>
                          <ul>
                            <li><span>结构：</span><span>{{serverConfig.serverStructure}}</span></li>
                            <li><span>品牌型号：</span><span>{{serverConfig.brandInfo}}</span></li>
                            <li><span>处理器：</span><span>{{serverConfig.processor}}</span></li>
                            <li><span>内存：</span><span>{{serverConfig.memoryCard}}</span></li>
                            <li><span>存储：</span><span>{{serverConfig.memoryStorage}}</span></li>
                            <li><span>网卡：</span><span>{{serverConfig.networkCard}}</span></li>
                            <li><span>电源：</span><span>{{serverConfig.powerSupply}}</span></li>
                          </ul>
                        </div>-->
          </div>
        </div>
      </Col>
      <Col :span="6">
        <div class="div-server">
          <div :style="bgStyle">
            <span>服务器资源使用监控</span>
          </div>
          <div>
            <ul>
              <li><span>中央处理器CPU</span><span :style="{backgroundColor: 'green',color: 'white'}">59%</span></li>
              <li><span>内存RAM</span><span :style="{backgroundColor: '#eaa932'}">15%</span></li>
              <li><span>磁盘RAID</span><span :style="{backgroundColor: '#d8d8d8'}">26%</span></li>
            </ul>
          </div>
          <div>
            <Button size="large" style="color: #0a84ff;background-color: #b4c8e3;width: 80%">输出服务器资源日志</Button>
          </div>
        </div>
      </Col>
      <Col :span="12">
        <div class="table-title">
          <div><LockOutlined/><span>锁定任务列表</span></div>
          <div class="table-btns"><Button @click="delList()" type="primary">清除任务</Button>
            <Button @click="delState()" type="primary">清除异常</Button></div>
        </div>
        <BasicTable
          :loading="loadMark"
          :scroll="{ y: 216 }"
          :row-selection="{ type: 'checkbox',fixed: true,selectedRowKeys: tableSelectedRowKeys, onChange: onSelectChange }"
          class="alone-basic-table"
          @register="registerTable"
          size="small"
        >
          <template #state="{ record }">
            <Tag :color="record.state === '1' ? 'green' : 'volcano'">
              {{ record.state === '1' ? '正常' : '异常' }}
            </Tag>
          </template>
        </BasicTable>
        <div></div>
      </Col>
    </Row>
    <ServerConfigSettingPage @throwData="loadConfig" @register="registerEditPage"/>
  </div>
</template>
<script setup lang="ts">
import {message, Row ,Col,List,Tag,Button} from "ant-design-vue";
import {SettingOutlined,LockOutlined} from '@ant-design/icons-vue';
import {reactive, ref,onMounted} from "vue";
import router from "/@/router";
import BasicTable from "/@/components/Table/src/BasicTable.vue";
import {useTable} from "/@/components/Table";
import {deleteByState, deleteList, getTaskList} from "/@/api/record/system/task";
import {useMessage} from "/@/hooks/web/useMessage";
import {findServerConfigInfo, saveServerConfigInfo} from "/@/api/record/system/server-config";
import ServerConfigSettingPage from './etc-components/ServerConfigSettingPage.vue'
import {useModal} from "/@/components/Modal";
import {JsonTool} from "/@/api/task-api/tools/universal-tools";
import {findAllList} from "/@/api/caozuoyuan/caozuoyuan";
const {
  createErrorModal,
  createSuccessModal,
  createConfirm
} = useMessage()

const CrudApi = {
  list: getTaskList,
  columns: [
    {
      title: '状态',
      dataIndex: 'state',
      ellipsis: true,
      fixed: true,
      width: 80,
      slots: { customRender: 'state' }
    },
    {
      title: '公司代码',
      dataIndex: 'companyCode',
      ellipsis: true,
      width: 80,
    },
    {
      title: '账套名称',
      dataIndex: 'companyName',
      ellipsis: true,
      align:'left'
    },
    {
      title: '操作员',
      dataIndex: 'caozuoUnique',
      ellipsis: true,
      width: 120,
      align:'left',format: (v=>operatorList.value.filter(it=>it.id === v)[0]?.realName)
    },
    {
      title: '最后操作时间',
      dataIndex: 'time',
      ellipsis: true,
      align:'left'
    },
    {
      title: '功能模块',
      dataIndex: 'functionModule',
      ellipsis: true,
      align:'left'
    },
    {
      title: '操作动作',
      dataIndex: 'method',
      ellipsis: true,
      align:'center',width: 80
    },
    {
      title: '档案编码',
      dataIndex: 'recordNum',
      ellipsis: true,
      align:'left'
    },
    {
      title: '任务年度',
      dataIndex: 'iyear',
      ellipsis: true,
      width: 80
    },
    // {
    //   title: '任务月份',
    //   dataIndex: 'imonth',
    //   ellipsis: true,
    //   width: 80
    // },

  ]
}
const pageParameter = reactive({
  overtime:'0',
  searchInfo:{
    searchQuery:'companyCode',
    searchValue:'',
  }
})
const loadMark = ref(false)
const tableSelectedRowObjs = ref([])
const tableSelectedRowKeys = ref([])
const defaultConfig = {
  osName: '',
  databaseName: '',
  managementSystem: '',
  dataBackup: '',
  security: '',
  extranetIp: '',
  intranetIp: '',
  serverStructure:'',
  brandInfo:'',
  processor:'',
  memoryCard:'',
  memoryStorage:'',
  networkCard:'',
  powerSupply:''
}
const serverConfig = ref({})
const operatorList = ref([])
onMounted(async ()=>{
  reloadConfig()
  operatorList.value = await findAllList()
})

const onSelectChange = (selectedRowKeys, obj) => {
  tableSelectedRowObjs.value = obj;
  tableSelectedRowKeys.value = selectedRowKeys;
};

const [registerTable, { reload,getDataSource,setTableData }] = useTable({
  api: CrudApi.list,
  columns: CrudApi.columns,
  bordered: true,
  showIndexColumn: false,
  pagination: {
    pageSize: 200,
    simple: true,
  },
  searchInfo: pageParameter
})

async function reloadConfig(){
  let res = await findServerConfigInfo()

  if (null == res || res.length == 0){
    message.warn('请完善服务器配置参数！')
  }else {
    serverConfig.value = res[0]
  }
}

async function delList(){
  let num = 0
  if (tableSelectedRowObjs.value.length>0) {
    tableSelectedRowObjs.value.forEach(
      function (item){
        if (item.state==1){
          num++
        }
      }
    )
    if (num>0){
      createConfirm({
        iconType: 'warning',
        title: '清除任务',
        content: '清除任务可能会影响当前用户的正常操作，确定要清除吗?',
        onOk: async() => {
          await deleteList(tableSelectedRowObjs.value)
          reload()
        }
      })
    } else {
      await deleteList(tableSelectedRowObjs.value)
      reload()
    }
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '清除任务',
      content: '请至少选择一条记录进行清除！'
    })
  }
}
async function delState() {
  if(getDataSource().length>0){
    await deleteByState(getDataSource().filter(a=>a.state=='0'))
    createSuccessModal({
      iconType: 'success',
      title: '清除异常',
      content: '清除异常成功！'
    })
    reload()
  }
}

const openConfigSetting = () => {
  openEditPage(true,JsonTool.parseProxy( serverConfig.value))
}

const loadConfig = async (e) => {
  e.id = null
  await saveServerConfigInfo(e)
  await reloadConfig()
}

const [registerEditPage, {openModal: openEditPage}] = useModal()

const bgStyle='background-image: url(\''+new URL('/assets/images/homes/bar.png', import.meta.url).href+'\')'

</script>
<style lang="less" scoped>
@import '/@/assets/styles/alone-basic-table.less';
.nc-hr-tags{
  :deep(.ant-row) {
    .ant-col {
      border-radius: 4px;
      background-color: white;
      margin: 0 .5%;
      .table-title{
        width: 100%;
        height: 40px;
        line-height: 40px;
        display: inline-flex;
        justify-content: space-between;
        background-color: #c8c7c7;
        padding: 0 2%;
        >div:nth-of-type(1){
          >span:nth-of-type(1){
            font-size: 30px;
            color: #0096c7;
            vertical-align: 0px !important;
          }
          >span:nth-of-type(2){
            font-size: 20px;
            margin-left: 1em;
          }
        }
      }
      .ant-table-body{
        min-height: 216px;
      }
      .div-server{
        height: 100%;
        >div:nth-of-type(1){
          height: 38%;
          padding: 3%;
          background-size: 30%;
          background-repeat: no-repeat;
          background-position: 50% 100%;
          >span{
            font-size: 18px;
            color: #0096c7;
            font-weight: bold;
          }
        }
        >div:nth-of-type(2){
          padding: 0 4%;
          ul{
            li{
              width: 100%;
              border-bottom: 1px solid #ece8e8;
              padding: 2.5% 5%;
              display: inline-flex;
              justify-content: space-between;
              span{
                font-weight: bold;
              }
              span:nth-of-type(2){
                display: block;
                border-radius: 25px;
                padding: 0px 5%;
              }
            }
          }
        }
        >div:nth-of-type(3){
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-radius: 4px;

        }
      }
      .div-configure{
        >div:nth-of-type(1){
          height: 80px;
          text-align: center;
          line-height: 80px;
          background: linear-gradient(45deg, #4b6ae1, #6b7cdd);
          span{
            color: white;
            font-weight: bold;
            font-size: 20px;
            letter-spacing: 2px;
          }
        }

        >div:nth-of-type(2){
          >div{
            padding: 5% 5% 0;
            >div{
              width: 100%;
              border-bottom: 1px solid #ece8e8;
              display: inline-flex;
              justify-content: space-between;
              height: 30px;
            }
            ul{
              li{
                padding: 2px;
                display: flex;
                >span:nth-of-type(1){
                  display: block;
                  width: 100px;
                }
                >span:nth-of-type(2){
                  float: right;
                  display: block;
                  width: calc(100% - 100px);
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  word-break: keep-all;
                }
              }
            }
          }
        }
      }
    }

    .ant-col-6{
      flex: 0 0 23.5%;
      max-width: 23.5%;
    }
  }
}

</style>
