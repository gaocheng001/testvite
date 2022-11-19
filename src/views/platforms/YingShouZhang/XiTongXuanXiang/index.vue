<template>
  <div class="app-financial-info" :style="{height: (windowHeight-95)+'px'}">
        <!-- 请注释下行，不要删除下行，方便快速定位页面  -->
<!--   <div><textarea>系统选项的页面</textarea>复制内容快速定位页面</div>-->
    <div class="a-container-head">
      <div class="a-c-head-title">
        <SettingOutlined style="font-size: 30px;color: #666666;float: left;margin: 0 .5%;"/>
        <h2>应收账参数设置</h2>
      </div>
      <div class="a-c-head-btns">
        <div class="ant-btn-group a-c-h-btns-group" style="min-width: 600px">
          <AccountPicker theme="three" :readonly="isEdit" @reloadTable="dynamicAdReload" style="width: 100%"/>
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
              业务参数
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
              <span>业务控制</span>
              <div class="acco-sideline-content-there">
                <a-row>
                  <a-col :span="12">
                    <a-checkbox v-model:checked="arHexiaoAuto" :disabled="isEdit">
                      应收审核自动核销
                    </a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox v-model:checked="arShoukuanHxwc" :disabled="isEdit">
                      月末处理必须完成收款核销
                    </a-checkbox>
                  </a-col>
                  <br/><br/>
                  <a-col :span="12">
                    <a-checkbox v-model:checked="arCheckFlag" :disabled="isEdit">
                      应收单据必须复核后生效
                    </a-checkbox>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div class="acco-sideline">
              <span>应收来源</span>
              <div class="acco-sideline-content-there">
                <a-radio-group v-model:value="arSourceFlag" :disabled="isEdit || sourceTypeNum>0" style="width:100%;">
                  <a-row>
                    <a-col :span="12">
                      <a-radio value="0" style="width: 100%;">
                        销货单确认应收款
                      </a-radio>
                    </a-col>
                    <a-col :span="12">
                      <a-radio value="1" style="width: 100%;">
                        销售发票确认应收款
                      </a-radio>
                    </a-col>
                  </a-row>
                </a-radio-group>
              </div>
            </div>
            <div class="acco-sideline">
              <span>信用控制</span>
              <div class="acco-sideline-content-there">
                <a-row>
                  <a-col :span="12">
                    <a-checkbox v-model:checked="arYsdXinyong" :disabled="isEdit">
                      应收单控制客户信用
                    </a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox v-model:checked="arTkdXinyong" :disabled="isEdit">
                      退款单控制客户信用
                    </a-checkbox>
                  </a-col>
                </a-row>
              </div>
            </div>
            <div class="acco-sideline">
              <span>制单规则</span>
              <div class="acco-sideline-content-there">
                <a-row>
                  <a-col :span="12">
                    <a-checkbox v-model:checked="arPingzhengAuto" :disabled="isEdit">
                      单据审核后立即生成凭证
                    </a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox v-model:checked="arPingzhengAuto" :disabled="isEdit">
                      结账前业务单据必须全部生成凭证
                    </a-checkbox>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" :style="activeKey=='2'?{height: (windowHeight-170)+'px',overflowY: 'auto'}:{}" >
          <template #tab>
            <span style="line-height: 30px;display: flex;">
            <ProfileOutlined style="font-size: 30px;color: #666666;"/>
              账龄设置
            </span>
          </template>
          <div class="a-container-content-two" style="margin-top: 30px;">
            <a-table size="small" bordered :data-source="bankStatementDataSource" :columns="Columns"
                     :pagination="false" :scroll="{ y  : 400 }" style="width: 80%;margin-left: 10%;margin-bottom: 30px;">
              <template #startDayNumber="{ text, record }">{{text+(text == ''?'':text.indexOf('天') != -1?'':`天`)}}</template>
              <template #totalDayNumber="{ text, record }">
                <div class="editable-cell">
                  <div v-if="editableData[record.key]"
                       class="editable-cell-input-wrapper">
                    <a-input v-model:value="editableData[record.key].totalDayNumber" style="width: 80%;" @pressEnter="rowEdit(record.key,'end')"/>
                    <check-outlined class="editable-cell-icon-check"
                                    @click="rowEdit(record.key,'end')"/>
                  </div>
                  <div v-else class="editable-cell-text-wrapper">
                    {{ text || ' ' }}
                    <edit-outlined v-if="record.serialNumber !='10'" class="editable-cell-icon" @click="rowEdit(record.key,'start')"/>
                  </div>
                </div>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
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
const ATabPane = ATabs.TabPane
const ASelectOption = ASelect.Option
const ACheckboxGroup = ACheckbox.Group
const ARadioGroup = ARadio.Group
const ATreeNode = ATree.TreeNode
const AMonthPicker = ADatePicker.MonthPicker
import {onMounted, reactive, ref, watch} from "vue";
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
const windowHeight  = (document.documentElement.clientHeight)
import AccountPicker from "/@/boozsoft/components/AccountPicker/AccountPicker-STOCK.vue";
import {hasBlank} from "/@/api/task-api/tast-bus-api";
import {cloneDeep} from "lodash-es";
import {useMessage} from "/@/hooks/web/useMessage";
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {findAllByAccIdModel, saveModel} from "/@/api/record/system/ar-ap-aging-range";
import {findByStockAccId, saveStocckAccount} from "/@/api/record/system/stock-account";
import {findWriteOffByIyearAndBillStyle} from "/@/api/record/system/arApYsyf";
import {findHzhcdsByIyearAndBillStyle} from "/@/api/record/system/ArApHzhcd";
const {createWarningModal} = useMessage()
const activeKey= ref('1')
const database = ref('')
const databaseCn = ref('')
const databaseYear = ref('')

const isEdit = ref(true)
const formItems:any = ref({})
const arHexiaoAuto:any = ref(false)
const arShoukuanHxwc:any = ref(false)
const arYsdXinyong:any = ref(false)
const arTkdXinyong:any = ref(false)
const arPingzhengAuto:any = ref(false)
const arPingzhengAll:any = ref(false)
const arCheckFlag:any = ref(false)
const arSourceFlag:any = ref('0')

const handleBus = async (bus) => {
  if (bus == '0') {
    isEdit.value = false
  } else if (bus == '1') { //恢复系统
    arHexiaoAuto.value = false
    arShoukuanHxwc.value = false
    arYsdXinyong.value = false
    arTkdXinyong.value = false
    arPingzhengAuto.value = false
    arPingzhengAll.value = false
    arCheckFlag.value = false
    arSourceFlag.value = (formItems.value.arSourceFlag == '1'?'1':'0')
  } else if (bus == '2') {
    isEdit.value = true
    formItems.value.arHexiaoAuto = (arHexiaoAuto.value==true?'1':'0')
    formItems.value.arShoukuanHxwc = (arShoukuanHxwc.value==true?'1':'0')
    formItems.value.arYsdXinyong = (arYsdXinyong.value==true?'1':'0')
    formItems.value.arTkdXinyong = (arTkdXinyong.value==true?'1':'0')
    formItems.value.arPingzhengAuto = (arPingzhengAuto.value==true?'1':'0')
    formItems.value.arPingzhengAll = (arPingzhengAll.value==true?'1':'0')
    formItems.value.arCheckFlag = (arCheckFlag.value==true?'1':'0')
    formItems.value.arSourceFlag = arSourceFlag.value
    await saveStocckAccount(formItems.value)
  } else { // 放弃修改
    arHexiaoAuto.value = (formItems.value.arHexiaoAuto=='1')
    arShoukuanHxwc.value = (formItems.value.arShoukuanHxwc=='1')
    arYsdXinyong.value = (formItems.value.arYsdXinyong=='1')
    arTkdXinyong.value = (formItems.value.arTkdXinyong=='1')
    arPingzhengAuto.value = (formItems.value.arPingzhengAuto=='1')
    arPingzhengAll.value = (formItems.value.arPingzhengAll=='1')
    arCheckFlag.value = (formItems.value.arCheckFlag=='1')
    arSourceFlag.value = (formItems.value.arSourceFlag == '1'?'1':'0')
    isEdit.value = true
  }
}

/************************************未达账项开始************************************/
const editableData = reactive({});
const tableHeight = (document.documentElement.clientHeight)+'px'
const Columns = [
  {
    title: '序号',
    key: 'serialNumber',
    dataIndex: 'serialNumber',
    align: 'center',
    width: '10%'
  },
  {
    title: '起止天数',
    key: 'startDayNumber',
    dataIndex: 'startDayNumber',
    align: 'center',
    slots: {customRender: 'startDayNumber'}
  },
  {
    title: '总天数',
    key: 'totalDayNumber',
    dataIndex: 'totalDayNumber',
    align: 'center',
    width: '20%',
    slots: {customRender: 'totalDayNumber'},
  }
]

const createNeatRow = () => {
  return {
    id: null,
    key: '',
    serialNumber: '',
    agingModel: '',
    accId: '',
    startDayNumber: '',
    totalDayNumber: '',
  }
}
async function assemblyRow(list:any) {
  let rowList:any = []
  if (list.length > 0){
    list.forEach((item,index)=>{
      let row =  createNeatRow()
      row['id'] = item.id
      row['key'] = item.id+''
      row['serialNumber'] = (index+1)+''
      row['agingModel'] = item.agingModel
      row['accId'] = item.accId
      row['startDayNumber'] = item.startDayNumber
      row['totalDayNumber'] = item.totalDayNumber
      rowList.push(row)
    })
  }
  if (list.length < 10){
    for (let i = list.length;i < 10;i++){
      let row =  createNeatRow()
      row['key'] = i+''
      row['serialNumber'] = (i+1) +''
      row['agingModel'] = 'ar'
      row['accId'] = databaseCn.value
      // 第一次
      if (rowList.length > 0 && i == list.length) row['startDayNumber'] = `${(parseInt(rowList[rowList.length-1].totalDayNumber)+1)}天以上`
      rowList.push(row)
    }
  }
  return rowList
}
const checkAndModifyData =  (key) => {
  try {
    if (hasBlank(editableData[key].totalDayNumber)) throw new Error('总天数为必填项且只能为正整数！')
    let xNum:any = parseInt(editableData[key].serialNumber)
    if (xNum == 1){
      if (parseInt(editableData[key].totalDayNumber) < 30) throw new Error('每次增加总天数建议不低于30天！')
      editableData[key].startDayNumber = `0-${ editableData[key].totalDayNumber}`
    }else {
      // 获取上一次
      let currList:any = bankStatementDataSource
      let previous:any = currList.value.filter(item => (xNum-1) == item?.serialNumber)[0]
      let prevNum:any = previous?.totalDayNumber
      if (hasBlank(prevNum))throw new Error(`序号列【${xNum-1}】总天数为必填项且只能为正整数！`)
      if ((parseInt(editableData[key].totalDayNumber) - parseInt(prevNum)) < 30) throw new Error('每次增加总天数建议不低于30天！')
      editableData[key].startDayNumber = `${parseInt(prevNum)+1}-${ editableData[key].totalDayNumber}`
      let nextNum = parseInt(xNum)+1
      // 如果改变的是中间的 重置后面 保留
      if (nextNum != 10){
        let nexts = currList.value.filter(item => nextNum == item?.serialNumber)[0]
        nexts.startDayNumber = (parseInt(editableData[key].totalDayNumber)+1)+'天以上'
      }
    }
    return true
  } catch (e:any) {
    createWarningModal({content: e.message});
    return false
  }
}
const checkPrevFilledIn = (key,currList) => {
  let xNum = currList.value.filter(item => key == item?.key)[0].serialNumber
  if (xNum != 1){ //上一行是否填写
    let previous = currList.value.filter(item => (xNum-1) == item?.serialNumber)[0]
    if (hasBlank(previous?.totalDayNumber)) return true;
  }
  return false;
}
const rowEdit = async (key,type) => {
  let currList:any = bankStatementDataSource
  if (type=='start'){
    // 查看上一行是否填写
    if (!checkPrevFilledIn(key,currList)){
      editableData[key] = cloneDeep(currList.value.filter(item => key === item?.key)[0]);
    }else {
      createWarningModal({title: '温馨提示',content: '请先完善上面空白行！'})
    }
  }else {
    editableData[key].totalDayNumber = editableData[key].totalDayNumber.replaceAll(/[^\d]/g,'')
    if (checkAndModifyData(key)){
      let res =  await save(editableData[key])
      if (res != null) {
        editableData[key].key = res?.id
        editableData[key].id = res?.id
        Object.assign(currList.value.filter(item => key === item.key)[0], editableData[key]);
        delete editableData[key];
        message.success('已进行异步更新！')
      }
    }else {
      delete editableData[key];
    }
  }
}
const bankStatementDataSource = ref([])
async function query(type:string) {   // 查询数据库
  return await useRouteApi(findAllByAccIdModel,{schemaName: database.value})({accId: databaseCn.value, model: type})
}
async function currDataSource() {
  let list = await query('ar')
  bankStatementDataSource.value = await assemblyRow(list)
  return bankStatementDataSource
}
async function save(data:any) {   // 查询数据库
  return await useRouteApi(saveModel,{schemaName: database.value})(data)
}
/************************************未达账项结束************************************/

const sourceTypeNum = ref(0)
const dynamicAdReload = async (obj) => {
  database.value = obj.accountMode
  databaseCn.value = obj.accId
  databaseYear.value = obj.year

  formItems.value = await findByStockAccId(obj.accId)
  arHexiaoAuto.value = (formItems.value.arHexiaoAuto == '1')
  arShoukuanHxwc.value = (formItems.value.arShoukuanHxwc == '1')
  arYsdXinyong.value = (formItems.value.arYsdXinyong == '1')
  arTkdXinyong.value = (formItems.value.arTkdXinyong == '1')
  arPingzhengAuto.value = (formItems.value.arPingzhengAuto == '1')
  arPingzhengAll.value = (formItems.value.arPingzhengAll == '1')
  arCheckFlag.value = (formItems.value.arCheckFlag == '1')
  arSourceFlag.value = (formItems.value.arSourceFlag == '1'?'1':'0')

  const hexiao = await useRouteApi(findWriteOffByIyearAndBillStyle,{schemaName: database})({iyear: databaseYear.value,billStyle: 'SKD'})
  const hzhcds = await useRouteApi(findHzhcdsByIyearAndBillStyle,{schemaName: database})({iyear:databaseYear.value,billStyle: 'YSD'})
  sourceTypeNum.value = hexiao.length + hzhcds.length

  await currDataSource()
}

</script>
<style scoped="scoped" lang="less">
@import '/@/assets/styles/financial-info-menu2.less';
</style>
