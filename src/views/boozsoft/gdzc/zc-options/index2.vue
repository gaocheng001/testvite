<template>
  <div class="app-financial-info" :style="{height: (windowHeight-95)+'px'}">
    <div class="a-container-head">
      <div class="a-c-head-title">
        <SettingOutlined style="font-size: 30px;color: #666666;float: left;margin: 0 .5%;"/>
        <h2>参数设置</h2>
        <div style="float: right;margin-top: -40px;" >
          <button type="button" class="ant-btn ant-btn-me" @click="closeCurrent(),router.push('/zhongZhang/home/welcome')"><span>退出</span></button>
        </div>
      </div>
      <div class="a-c-head-btns">
        <div class="ant-btn-group a-c-h-btns-group" style="min-width: 600px">
          <AccountPicker theme="one" @reloadTable="dynamicAdReload" style="width: 100%"/>
        </div>
      </div>
    </div>
    <div class="setting_box"></div>
    <div class="a-container-content">
      <a-tabs type="card" :tabBarGutter="0" v-model:activeKey="activeKey" tabPosition="left">
        <a-tab-pane key="1" :style="activeKey=='1'?{height: (windowHeight-170)+'px',overflowY: 'auto'}:{}">
          <template #tab>
            <span style="line-height: 30px;display: flex;">
            <AppstoreOutlined style="font-size: 30px;color: #666666;"/>
              基本选项
            </span>
          </template>
          <div class="a-container-content-one">
            <div class="acco-btn">
                <a-button v-if="isEdit" type="primary" @click="handleBus('0')">编辑</a-button>
                <template v-if="!isEdit">
                  <a-button @click="handleBus('1')">恢复系统设置</a-button>
                  <a-button type="primary" @click="handleBus('2')">保存</a-button>
                  <a-button @click="handleBus('3')">放弃</a-button>
                </template>
            </div>
            <div class="acco-sideline">
              <span>基础信息</span>
              <div class="acco-sideline-content-one">
                <div>
                  <span>公司代码：</span>
                  <a-input v-model:value="coCode" style="width: 280px" class="against-input-mark" disabled="true"></a-input>
                </div>
                <div>
                  <span>公司名称：</span>
                  <a-input v-model:value="companyName" style="width: 280px" class="against-input-mark" disabled="true"></a-input>

                </div>

                <div>
                  <span>&emsp;启用日期：</span>
                  <a-input v-model:value="faAccount.startYearMonth" style="width: 280px" class="against-input-mark" disabled="true"></a-input>

                </div>
                <div>
                  <span>本 位 币：</span>
                  <a-input v-model:value="faAccount.cname" style="width: 280px" class="against-input-mark" disabled="true"></a-input>

                </div>

                <div>
                  <span>&emsp;折旧方式：</span>
                  <a-input v-model:value="faAccount.zjname" style="width: 280px" class="against-input-mark" disabled="true"></a-input>
                </div>
                <div>
                  <span>分配周期：</span>
                  <a-input v-model:value="faAccount.zhejiuPeriod" style="width: 280px" class="against-input-mark" disabled="true"></a-input>
                </div>

                <div >
                  <span style="width: 100px">银行现金支付科目：</span>
                  <a-select
                    v-model:value="faAccount.kmCode"
                    show-search
                    style="width: 220px;text-align: center;"
                    allowClear="true"
                    :disabled="isEdit"
                    :filter-option="filterOption"
                  >
                    <a-select-option v-for="d in kmList" :value="d.ccode">
                      {{ d.value }}
                    </a-select-option>
                  </a-select>
                </div>

                <div>
                  <span style="width: 100px">卡片类别：</span>
                  <a-select
                    v-model:value="faAccount.cardType"
                    style="width: 220px;text-align: center;"
                    allowClear="true"
                    :disabled="isEdit"
                  >
                    <a-select-option v-for="d in typeList" :value="d.ccode">
                      {{ d.value }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
            <div class="acco-sideline">
              <span>基础档案控制</span>
              <div  class="acco-sideline-content-two">
                <a-checkbox-group v-model:value="dataModel.zhiDanList" :disabled="isEdit">
                  <a-row>
                    <a-col :span="12">
                      <a-checkbox value="isZzpz">
                        与总账模块凭证关联
                      </a-checkbox>
                    </a-col>
                    <a-col :span="12">
                      <a-checkbox value="isFilledIn">
                        月末结账需完成与总账金额对账
                      </a-checkbox>
                    </a-col>
                    <a-col :span="12">
                      <a-checkbox value="isZhejiu">
                        计提折旧/摊销
                      </a-checkbox>
                    </a-col>
                    <a-col :span="12">
                      <a-checkbox value="isGlfl">
                        管理分类控制
                      </a-checkbox>
                    </a-col>
                    <a-col :span="12">
                      <a-checkbox value="isCreateZhejiu">
                        新增资产当月计提
                      </a-checkbox>
                    </a-col>
                    <a-col :span="12">
                      <a-checkbox value="isZjtt">
                        最后折旧月剩余折旧全部提足
                      </a-checkbox>
                    </a-col>
                    <a-col :span="12">
                      <a-checkbox value="isYuanzhi">
                        原值变动当月生效
                      </a-checkbox>
                    </a-col>
                    <a-col :span="12">
                      <a-checkbox value="isLeijizjtz">
                        累计折旧变动当月生效
                      </a-checkbox>
                    </a-col>
                    <a-col :span="12">
                      <a-checkbox value="isJcanzhi">
                        净残值当月生效
                      </a-checkbox>
                    </a-col>
                    <a-col :span="12">
                      <a-checkbox value="isZjlb">
                        控制资产类别权限
                      </a-checkbox>
                    </a-col>
                  </a-row>
                </a-checkbox-group>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <Edit @save="modifyData" @register="registerEditPage" />
  </div>
</template>
<script setup="props, {emit}" lang="ts">
import {
  Select as ASelect,
  Input as AInput,
  Radio as ARadio,
  Tabs as ATabs,
  Checkbox as ACheckbox,
  Row as ARow,
  Col as ACol,
  Button as AButton,
  message,
  Table as ATable,
  DatePicker as ADatePicker,
  Tree as ATree,
  Popconfirm as APopconfirm
} from "ant-design-vue"
import router from "/@/router";
import {onMounted, reactive, ref, watch} from "vue";
import Edit from './popup/edit.vue';
import {
  SortDescendingOutlined,
  SortAscendingOutlined,
  CheckOutlined,
  OrderedListOutlined,
  FormOutlined,
  DeleteOutlined,
  SettingFilled,
  SyncOutlined,
  PicLeftOutlined,
  PieChartFilled, FilterFilled,
  EditOutlined,
  DownOutlined, SmileOutlined, FrownOutlined, FrownFilled,AppstoreOutlined,ProfileOutlined,ProjectOutlined,SettingOutlined
} from '@ant-design/icons-vue'
import {
  initBasisTabData,
  initBasisTabDataDefault,
 defaultSettingModel
} from '/@/api/record/system/financial-settings'

import {
  compareDate,
  compareTime,
  findByFunctionModule,
  markAnomaly,
  offsetToStr,
  serverTime,
  getCurrentMonthLast,
  getCurrentAccountName, hasBlank
} from "/@/api/task-api/tast-bus-api";
import {useMessage} from "/@/hooks/web/useMessage";
import {computed} from "vue";
import {cloneDeep} from "lodash-es";
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker.vue";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useTabs} from "/@/hooks/web/useTabs";
import {useModal} from "/@/components/Modal";
import {findByAccId, saveAccount} from "/@/api/record/gdzc/zc-options";
import {findCodeKmAll} from "/@/api/record/generalLedger/data";
const ATabPane = ATabs.TabPane
const ASelectOption = ASelect.Option
const ACheckboxGroup = ACheckbox.Group
const ARadioGroup = ARadio.Group
const ATreeNode = ATree.TreeNode
const AMonthPicker = ADatePicker.MonthPicker
const activeKey= ref('1')
const database = ref('')
const databaseCn = ref('')
const databaseYear = ref('')
const [registerEditPage, { openModal: openEditPage }] = useModal();
const windowHeight  = (document.documentElement.clientHeight)
const {
  createErrorModal,createWarningModal,createConfirm
} = useMessage()

const openPage = (data,type) => {
  data.type=type
  openEditPage(true, {
    data: data,
  });
};

// 数据权限控制表 ID
const authSwithId=ref(null)
/************************************基础选项************************************/
const isEdit = ref(true)
const isEdit2 = ref(true)
const pageParameter = reactive({
  acountStandardList: [],
  levelList: [],
  currencyList: []
})
const { closeCurrent } =useTabs();
const dataModel = reactive(defaultSettingModel)

const dataModelCopy = reactive(defaultSettingModel)

onMounted(()=>{
  // pageReload()
})

const pageReload = ()=>{
  //选项信息
  findByAuthSwith()
}

const handleBus = (bus)=>{
  if(bus == '0'){
    isEdit.value=false
  }else if (bus == '1'){
    let data = initBasisTabDataDefault();
    dataModel.basisMap = data.basisMap
    dataModel.zhiDanList = data.zhiDanList
    dataModel.settingList = data.settingList
    dataModel.dateMap = data.dateMap
  }else if(bus == '2'){
    isEdit.value=true

    saveAccount(faAccount.value).then(res=>{
      console.log('保存成功!')
      pageReload()
    }).catch(error => {
      console.log('error', error)
    })
  }else{
    dataModel.basisMap = dataModelCopy.basisMap
    dataModel.zhiDanList = dataModelCopy.zhiDanList
    dataModel.settingList = dataModelCopy.settingList
    dataModel.dateMap = dataModelCopy.dateMap
    isEdit.value=true
  }
}

const levelPrefix = ref('')
const levelSuffix = ref('')
const standardChange = async (val) => {
  let obj = pageParameter.acountStandardList.filter(item => item.id == val)
  if (obj.length > 0) {
    levelPrefix.value = obj[0].tjici/*.replace(/-/g,"")*/
    if (dataModel.basisMap.ccodeLevel != '' && isEdit.value) {
      levelSuffix.value = dataModel.basisMap.ccodeLevel.replace(obj[0].tjici, '').replace(/-/g, "").split('').join('-')
    }
  }
}
const importLimit = (e) => {
  e.target.value = e.target.value.replace(/[^123456789]/g, "")
  if (!hasBlank(e.target.value)) e.target.value = e.target.value.split('').join('-')
  levelSuffix.value = e.target.value
}
const splitLevel = (a, b) => {
  let c = a
  if (b != '')
    c = c + '-' + b
  return c
}
/************************************基础选项************************************/

/************************************* 2021.10.14 补充改造 ******************************************/

const coCode =ref()
const companyName =ref()
const faAccount =ref({
  isZjlb: true
})
// 会计科目
const kmList: any = ref([])
const typeList: any = ref([{
  ccode: '1',
  value: '多部门'
},{
  ccode: '2',
  value: '多项目'
}])

const dynamicAdReload = async (obj) => {
  database.value = obj.accountMode
  databaseCn.value = obj.accId
  databaseYear.value = obj.year
  coCode.value =  obj.coCode
  companyName.value =  obj.companyName

  // 会计科目
  kmList.value = await useRouteApi(findCodeKmAll,{schemaName:database})({});

  if (activeKey.value === '1') {
    pageReload()
  }else if(activeKey.value === '2'){
    // 年切换
    //yearChange()
  }else if(activeKey.value === '3'){

  }
  findByAuthSwith()
}

async function findByAuthSwith() {
  useRouteApi(findByAccId,{schemaName: database})({uniqueCode:databaseCn.value}).then(res=>{
    res.obj.zhejiuPeriod = res.obj.zhejiuPeriod + '月份'
    faAccount.value = res.obj
    if (res.basisMap.length != 0) {
      dataModel.basisMap = res.basisMap
      dataModelCopy.basisMap = res.basisMap
      standardChange(dataModel.basisMap.accStandard)
      if (res.zhiDanList.length != 0) {
        dataModel.zhiDanList = res.zhiDanList
        console.log(dataModel.zhiDanList)
        dataModelCopy.zhiDanList = res.zhiDanList
      }
    }
  }).catch(error => {
    console.log('error', error)
  })
}

const formatBoolean = (data: any) =>{
  if(data){
    if(data === '1'){
      return true
    }
  }
  return false
}


</script>
<style scoped="scoped" lang="less">
@import '/@/assets/styles/financial-info-menu.less';
</style>
