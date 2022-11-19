<template>
  <div class="asdsadsads">

  <BasicModal
    width="900px"
    v-bind="$attrs"
    title="人员信息"
    @ok="handleOk()"
    :showOkBtn="isEdit"
    :showCancelBtn="true"
    @register="register"
    :loading="loadMark"
    :canFullscreen="false"
  >
    <template #title>
      <div style="display: flex;margin-top: 10px;" class="vben-basic-title">
        <span style="line-height:40px;font-size: 28px;" v-if="isState=='0'">
          <PlusCircleOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;人员信息
        </span>
        <span style="line-height:40px;font-size: 28px;" v-if="isState=='1'">
          <FormOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;人员信息
        </span>
        <span style="line-height:40px;font-size: 28px;" v-if="isState=='2'">
          <FileSearchOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;人员信息
        </span>
      </div>
      <div style="display: inline-block;position:absolute;right: 50px;top: 0;z-index: 100000;background:#ffffff">
        <img src="/@/assets/images/person.png" style="height:100px;margin-right: 10px;"/>
      </div>
    </template>
    <div :class="isEdit?'nc-open-content':'nc-open-show-content'">
      <div class="open-content-up">
        <div style="width:70%;margin-left: 10%;margin-top: 30px;">
          <a-radio-group v-model:value="formItems.psnType" style="margin-left: -10px;">
            <a-radio value="1" style="width:120px;">
              <span style="color: #000000;font-weight: bold;font-size: 12px;">内部人员</span>
            </a-radio>
            <a-radio value="2" style="width:120px;margin-left: -10px;">
              <span style="color: #000000;font-weight: bold;font-size: 12px;">外部人员</span>
            </a-radio>
          </a-radio-group>
          <br/>
          <label style="font-size: 18px;margin-left: 0;width:150px;">人员姓名：</label>
          <a-input
            v-model:value="formItems.psnName"
            :placeholder="isEdit?'请输入姓名(使用后不允许修改)':''"
            class="abc"
            style="width: 70%;border-bottom: 2px solid #000000;"
          />
          <span class="red_span">{{isState=='2'?'':'*'}}</span>
        </div>
        <br/><br/>

        <div>
          <label style="font-size: 14px;">人员编码：</label>
          <a-input v-model:value="formItems.psnCode" :placeholder="isEdit?'请输入编号（不允许重复）':''" style="font-size: 15px;"/>
          <span class="red_span">{{isState=='2'?'':'*'}}</span>
          <label style="font-size: 14px;">人员类别：</label>
          <a-select
            v-model:value="formItems.uniquePsnType"
            placeholder="请选择人员类别"
            style="width: 30%;text-align: center;font-size: 15px;"
          >
            <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
            <a-select-option v-for="psntype in psnTypeList" :key="psntype.psnTypeName" :value="psntype.uniqueCode">
              {{ psntype.psnTypeName }}
            </a-select-option>
          </a-select>
          <span class="red_span"></span>
          <br/>

          <label style="font-size: 14px;">性别：</label>
          <a-select v-model:value="formItems.psnSex" :placeholder="isEdit?'性别':''" style="width: 30%;text-align: center;font-size: 15px;">
            <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
            <a-select-option value="0">未知的性别</a-select-option>
            <a-select-option value="1">男</a-select-option>
            <a-select-option value="2">女</a-select-option>
            <a-select-option value="9">未说明的性别</a-select-option>
          </a-select>
          <span class="red_span"></span>
          <label style="font-size: 14px;">部门：</label>
          <!--          <a-input v-model:value="deptName" @click="openSelectDept" :placeholder="isEdit?'请选择部门':''" style="font-size: 15px;"/>-->
          <a-tree-select
            v-model:value="formItems.uniqueCodeDept"
            style="width: 30%;font-size: 15px;"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            :placeholder="isEdit?'请选择部门':''"
            tree-default-expand-all
            show-search
            :filter-option="filterOption"
            allow-clear
          >
            <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
          </a-tree-select>
          <a style="font-weight: bold;font-size: 18px;"><LinkOutlined v-if="isState!='2'" @click="openSelectDept" /></a>
          <br/>
          <label style="font-size: 14px;">手机：</label>
          <span v-if="isLock">
            <a-input v-model:value="formItems.cellPhoneNum" :placeholder="isEdit?'请输入手机（不允许重复）':''" style="font-size: 15px;"/>
            <span class="red_span"></span>
          </span>
          <span v-else>
            <a-input v-model:value="cellPhoneNum" :readonly="true" :placeholder="isEdit?'请输入手机（不允许重复）':''" style="font-size: 15px;"/>
            <a @click="openAuthPassword" style="font-weight: bold;font-size: 18px;"><KeyOutlined /></a>
          </span>
          <label style="font-size: 14px;">职务：</label>
          <a-select v-model:value="formItems.psnPost" placeholder="" allow-clear style="width: 30%;text-align: center;font-size: 15px;">
            <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
            <a-select-option v-for="item in jobFileList" :key="item.id" :value="item.id">
              {{ item.ecCode }}-{{ item.ecName }}
            </a-select-option>
          </a-select>
          <span class="red_span"></span>
          <label v-if="isState!='0'" style="font-size: 14px;">状态：</label>
          <a-radio-group  v-if="isState!='0'" v-model:value="formItems.flag" style="margin-left: -50px;text-align: left;">
            <a-radio value="1" style="width:100px;">
              <span style="color: #000000;font-weight: bold;font-size: 14px;">启用</span>
            </a-radio>
            <a-radio value="0" style="width:100px;margin-left: -10px;">
              <span style="color: #000000;font-weight: bold;font-size: 14px;">停用</span>
            </a-radio>
          </a-radio-group>
        </div>

      </div>

      <div class="open-content-down">
        <a-tabs v-model:activeKey="activeKey" type="card">
          <a-tab-pane key="1" tab="基本信息">
            <label>证件类型：</label>
            <a-select v-model:value="formItems.documentType" style="width: 30%;">
              <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
              <a-select-option value="">请选择证件类型</a-select-option>
              <!--                <a-select-option value="1">居民身份证</a-select-option>
                              <a-select-option value="2">港澳居民来往内地通行证</a-select-option>
                              <a-select-option value="3">台湾居民来往大陆通行证</a-select-option>
                              <a-select-option value="4">中国护照</a-select-option>
                              <a-select-option value="5">外国护照</a-select-option>-->
              <a-select-option v-for="item in documentTypeList" :value="item.ccode">{{ item.cname }}</a-select-option>
            </a-select>
            <span class="red_span"></span>
            <label>证件号码：</label>
            <span v-if="isLock">
                <a-input v-model:value="formItems.documentCode" :placeholder="isEdit?'请输入证件号码（不允许重复）':''"/>
                <span class="red_span"></span>
              </span>
            <span v-else>
                <a-input v-model:value="documentCode" :readonly="true" :placeholder="isEdit?'请输入证件号码（不允许重复）':''"/>
                <a @click="openAuthPassword" style="font-weight: bold;font-size: 18px;"><KeyOutlined /></a>
              </span>
            <!-- 请输入隐私授权密码(123456)-->
            <br/>
            <label>出生日期：</label>
            <a-date-picker v-model:value="formItems.birthDate" :locale="localeCn" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="" style="width: 30%;"/>
            <span class="red_span"></span>
            <label>国家(地区)：</label>
            <a-select
              v-model:value="formItems.countryId"
              show-search
              :placeholder="isEdit?'国家/地区':''"
              style="width: 30%"
            >
              <template #suffixIcon><CaretDownOutlined v-if="isState!='2'" style="color:#666666;" /></template>
              <a-select-option v-for="countrys in countryList" :key="countrys.namech" :value="countrys.namech">
                {{ countrys.namech }}
              </a-select-option>
            </a-select>
            <span class="red_span"></span>
            <br/>
            <label>行政区划：</label>
            <a-input v-model:value="formItems.province" :placeholder="isEdit?'省/市/区':''"/>
            <span class="red_span"></span>
            <label>详细地址：</label>
            <a-input v-model:value="formItems.psnAddress" :placeholder="isEdit?'街道':''"/>
            <span class="red_span"></span>
          </a-tab-pane>
          <a-tab-pane key="2" tab="联系方式">
            <div class="down-tab-content">
              <label>Email：</label>
              <span v-if="isLock">
                <a-input v-model:value="formItems.psnEmail" placeholder=""/>
                <span class="red_span"></span>
              </span>
              <span v-else>
                <a-input v-model:value="psnEmail" :readonly="true" placeholder=""/>
                <a @click="openAuthPassword" style="font-weight: bold;font-size: 18px;"><KeyOutlined /></a>
              </span>
              <label>微信：</label>
              <span v-if="isLock">
                <a-input v-model:value="formItems.psnWechat" :placeholder="isEdit?'请输入微信（不允许重复）':''"/>
                <span class="red_span"></span>
              </span>
              <span v-else>
                <a-input v-model:value="psnWechat" :readonly="true" :placeholder="isEdit?'请输入微信（不允许重复）':''"/>
                <a @click="openAuthPassword" style="font-weight: bold;font-size: 18px;"><KeyOutlined /></a>
              </span>
              <br/>
              <label>钉钉：</label>
              <span v-if="isLock">
                <a-input v-model:value="formItems.psnQq" :placeholder="isEdit?'请输入钉钉（不允许重复）':''"/>
                <span class="red_span"></span>
              </span>
              <span v-else>
                <a-input v-model:value="psnQq" :readonly="true" :placeholder="isEdit?'请输入钉钉（不允许重复）':''"/>
                <a @click="openAuthPassword" style="font-weight: bold;font-size: 18px;"><KeyOutlined /></a>
              </span>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="入职信息">
            <div class="down-tab-content">
              <label>工号：</label>
              <a-input v-model:value="formItems.jobNum" placeholder=""/>
              <span class="red_span"></span>
              <label>工位：</label>
              <a-input v-model:value="formItems.psnStation" placeholder=""/>
              <span class="red_span"></span>
              <br/>
              <label>入职日期：</label>
              <a-date-picker v-model:value="formItems.entryDate" :locale="localeCn" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="" style="width: 30%;"/>
              <span class="red_span"></span>
              <label>离职日期：</label>
              <a-date-picker v-model:value="formItems.leaveDate" :locale="localeCn" format="YYYY-MM-DD" value-format="YYYY-MM-DD"  placeholder="" style="width: 30%;"/>
              <span class="red_span"></span>
              <br/>
            </div>
          </a-tab-pane>
          <a-tab-pane key="4" tab="银行账户">
            <div class="content-down-tab">
              <div class="down-tab-content">
                <label>开户银行：</label>
                <a-input v-model:value="formItems.psnBank" :placeholder="isEdit?'例如：中国建设银行朝阳路支行':''"/>
                <span class="red_span"></span>
                <label>开户地：</label>
                <a-input v-model:value="formItems.bankArea" :placeholder="isEdit?'例如：武汉市汉阳区':''"/>
                <span class="red_span"></span>
                <br/>
                <label>银行账号：</label>
                <span v-if="isLock">
                  <a-input v-model:value="formItems.bankAccount" placeholder=""/>
                  <span class="red_span"></span>
                </span>
                <span v-else>
                  <a-input v-model:value="bankAccount" :readonly="true" placeholder=""/>
                  <a @click="openAuthPassword" style="font-weight: bold;font-size: 18px;"><KeyOutlined /></a>
                </span>
                <label>银行行号：</label>
                <a-input v-model:value="formItems.bankNum" placeholder=""/>
                <span class="red_span"></span>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <template #footer>
      <div v-if="isState=='2'">
        <a-button @click="closeModal()" type="primary">关闭</a-button>
      </div>
      <div v-if="isState=='0'">
        <a-button @click="closeModal()">取消</a-button>
        <a-button @click="handleOk()" :disabled="saveClick" type="primary">保存</a-button>
      </div>
      <div v-if="isState=='1'">
        <a-button @click="closeModal()">放弃</a-button>
        <a-button @click="handleOk()" :disabled="saveClick" type="primary">保存</a-button>
      </div>
    </template>

    <SelectDept @save="saveSelectDept" @register="registerSelectDeptPage"/>

    <!-- 请输入隐私授权密码(123456)-->
    <AuthPassword @save="saveAuthPassword" @register="registerAuthPasswordPage"/>

  </BasicModal>

  </div>
</template>

<script setup="props, {content}" lang="ts">
import {ref, unref} from 'vue'
import {BasicModal, useModal, useModalInner} from '/@/components/Modal'
import {GetDeptTreeByFlag} from '/@/api/sys/dept'
import {psnTypeFindAll} from "/@/api/psn-type/psn-type";
import {findAllCountry} from "/@/api/record/costomer_data/customer";
import {findAllProvince} from "/@/api/record/system/zone";
import {
  Input as AInput,
  Select as ASelect,
  Popover as APopover,
  Tabs as ATabs,
  DatePicker as ADatePicker,
  Cascader as ACascader,
  TreeSelect as ATreeSelect,
  Radio as ARadio, message
} from "ant-design-vue";
import {
  PlusCircleOutlined,
  FormOutlined,
  FileSearchOutlined,
  CaretDownOutlined,
  LinkOutlined,
  KeyOutlined
} from '@ant-design/icons-vue'
import {useRouteApi} from "/@/utils/boozsoft/datasource/datasourceUtil";
import {useMessage} from "/@/hooks/web/useMessage";
import {findBukongPsnCode, findMaxPsnCode, getPsnList, savePsn} from "/@/api/record/system/psn";
import localeCn from 'ant-design-vue/es/date-picker/locale/zh_CN';
import {getJobFileList} from "/@/api/record/system/job-file";
import {findDocumentTypeAll} from "/@/api/record/system/group-document-type";

const ASelectOption = ASelect.Option
const AInputSearch = AInput.Search
const ATabPane = ATabs.TabPane
const ARadioGroup = ARadio.Group;
const emit = defineEmits(['register','save'])

const {
  createErrorModal
} = useMessage()

const formItems: any = ref({})

const treeData: any = ref([])
const filterOption = (input: string, option: any) => {
  return option.title.indexOf(input) >= 0;
};

import SelectDept from './select-dept.vue'
const [registerSelectDeptPage, { openModal: openSelectDeptPage }] = useModal()
const openSelectDept = () => {
  openSelectDeptPage(true, {
    dynamicTenantId: dynamicTenantId.value
  })
}
const deptName = ref('')
function saveSelectDept(data){
  formItems.value.uniqueCodeDept = data.uniqueCode
  deptName.value = data.deptName
}

const psnTypeList: any = ref([])
const jobFileList: any = ref([])
const documentTypeList: any = ref([])

const saveClick:any = ref(false)

//国家
const countryList: any = ref([])
const options = ref([])
const cityValye: any = ref([])
// 是否为修改
const isEdit = ref(true)
const isState = ref('0')

let changeBeforeModel: any = {}

const dynamicTenantId = ref("")
const loadMark = ref(false)
const documentCode = ref('')
const cellPhoneNum = ref('')
const psnEmail = ref('')
const bankAccount = ref('')
const psnWechat = ref('')
const psnQq = ref('')
const isLock = ref(false)
const [register, {closeModal}] = useModalInner(async (data) => {
  loadMark.value = true
  saveClick.value=false
  dynamicTenantId.value = data.dynamicTenantId
  isState.value = data.isState
  deptName.value = ''
  if(isState.value=='0') {
    isLock.value = true
  } else {
    isLock.value = false
  }
  //选择部门
  const res =await useRouteApi(GetDeptTreeByFlag, {schemaName: dynamicTenantId})({})
  function a(deptTree: any) {
    deptTree.forEach(
      (item: any) => {
        if (item.children != null) {
          a(item.children)
        }
        item.title = '(' + item.deptCode + ')' + item.deptName
        item.value = item.uniqueCode
        item.key = item.uniqueCode
      })
  }

  a(res)
  treeData.value = res
  if (null != data.data.isEdit) isEdit.value = data.data.isEdit
  //选择人员类别
  const psnTypeList1 = await useRouteApi(psnTypeFindAll, {schemaName: dynamicTenantId})({})
  psnTypeList.value = psnTypeList1.items
  if ((data.data.uniquePsnType == '' || data.data.uniquePsnType == null) && psnTypeList.value.length > 0) {
    data.data.uniquePsnType = psnTypeList.value[0].uniqueCode
    formItems.value.uniquePsnType = psnTypeList.value[0].uniqueCode
  }

  //选择职务
  const jobFileList1 = await useRouteApi(getJobFileList, {schemaName:dynamicTenantId})({})
  jobFileList.value = jobFileList1.items

  //证件类型
  documentTypeList.value = await findDocumentTypeAll()

  // 国家信息
  const countryList1 = await findAllCountry()
  countryList.value = countryList1.items
  // 全部省信息
  const options1 = await findAllProvince()
  options.value = options1

  // 方式2
  /*formItems.value.id = data.data.id
  formItems.value.uniqueCode = data.data.uniqueCode
  formItems.value.psnCode = data.data.psnCode
  formItems.value.jobNum = data.data.jobNum
  formItems.value.psnName = data.data.psnName
  formItems.value.psnSex = data.data.psnSex
  formItems.value.uniqueCodeDept = data.data.uniqueCodeDept
  formItems.value.uniquePsnType = data.data.uniquePsnType
  formItems.value.psnType = data.data.psnType
  formItems.value.psnPost = data.data.psnPost
  formItems.value.documentType = data.data.documentType
  formItems.value.idNum = data.data.idNum
  formItems.value.psnStation = data.data.psnStation
  formItems.value.cellPhoneNum = data.data.cellPhoneNum
  formItems.value.psnEmail = data.data.psnEmail
  formItems.value.psnWechat = data.data.psnWechat
  formItems.value.psnQq = data.data.psnQq
  formItems.value.psnAddress = data.data.psnAddress
  formItems.value.psnBank = data.data.psnBank
  formItems.value.bankArea = data.data.bankArea
  formItems.value.bankAccount = data.data.bankAccount
  formItems.value.EntryDate = data.data.EntryDate
  formItems.value.createDate = data.data.createDate
  formItems.value.flag = data.data.flag
  formItems.value.countryId = data.data.countryId
  formItems.value.uniqueCodeZone = data.data.uniqueCodeZone
  formItems.value.bankNum = data.data.bankNum
  formItems.value.province = data.data.province
  formItems.value.city = data.data.city
  formItems.value.birthDate = data.data.birthDate
  formItems.value.leaveDate = data.data.leaveDate*/
  formItems.value = JSON.parse(JSON.stringify(data.data))
  documentCode.value = formItems.value.documentCode==''?'':formItems.value.documentCode.length>10?plusStr(formItems.value.documentCode,3,4,'******'):plusStr(formItems.value.documentCode,3,0,'******')
  cellPhoneNum.value = formItems.value.cellPhoneNum==''?'':formItems.value.cellPhoneNum.length>10?plusStr(formItems.value.cellPhoneNum,3,4,'****'):plusStr(formItems.value.cellPhoneNum,3,0,'******')
  psnEmail.value = formItems.value.psnEmail==''?'':formItems.value.psnEmail.length>10?plusStr(formItems.value.psnEmail,3,4,'****@***'):plusStr(formItems.value.psnEmail,3,0,'****@***')
  bankAccount.value = formItems.value.bankAccount==''?'':formItems.value.bankAccount.length>10?plusStr(formItems.value.bankAccount,3,4,'******'):plusStr(formItems.value.bankAccount,3,0,'******')
  psnWechat.value = formItems.value.psnWechat==''?'':formItems.value.psnWechat.length>10?plusStr(formItems.value.psnWechat,3,4,'******'):plusStr(formItems.value.psnWechat,3,0,'******')
  psnQq.value = formItems.value.psnQq==''?'':formItems.value.psnQq.length>10?plusStr(formItems.value.psnQq,3,4,'******'):plusStr(formItems.value.psnQq,3,0,'******')

  if (formItems.value.countryId == '' || formItems.value.countryId == null) {
    formItems.value.countryId = '中国'
  }

  // cityValye.value = data.data.province === null ? '' : ref(data.data.province.split(','))
  if (isState.value=='0') {
    await getMaxCode()
  }

  changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
  loadMark.value = false
})

//根据编码规则获取编码
const isManual = ref(false)
async function getMaxCode(){
  // 读取编码规则-人员
  let str = ""
  let temp= await useRouteApi(load,{schemaName: dynamicTenantId})('1-1')
  if (temp==null){
    isManual.value = false
    return false
  }
  // console.log(temp)
  console.log(temp.isManual)
  //是否
  if (temp.codeWay=='1'){
    isManual.value = false
    return false
  }
  //是否编号允许手动修改
  if (temp.isManual=='true'){
    isManual.value = true
  } else {
    isManual.value = false
  }
  if(temp.prefixOneIs=='true'){
    // console.log(temp.prefixOne)
    if (temp.prefixOne=='1-0'){
      //人员类别
      let psnTypeCode = ''
      psnTypeList.value.forEach(item=>{
        if (item.uniqueCode==formItems.value.uniquePsnType){
          psnTypeCode = item.psnTypeCode.length >= temp.prefixOneLength?
            item.psnTypeCode.substring(0,temp.prefixOneLength) : pad(item.psnTypeCode,temp.prefixOneLength)
        }
      })
      str = str + psnTypeCode
    }
    if (temp.prefixOne=='88'){
      //日期(年月)
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
      str = str + yy + mm
    }
    if (temp.prefixOne=='99'){
      //手动录入
      str = str + pad(temp.prefixOneCustomize,temp.prefixOneLength)
    }
    //分隔符
    if (temp.delimiter=='2'){
      str = str + '.'
    } else if (temp.delimiter=='3'){
      str = str + '-'
    }
  }
  if(temp.prefixTwoIs=='true'){
    // console.log(temp.prefixTwo)
    if (temp.prefixTwo=='1-0'){
      //人员类别
      let psnTypeCode = ''
      psnTypeList.value.forEach(item=>{
        if (item.uniqueCode==formItems.value.uniquePsnType){
          psnTypeCode = item.psnTypeCode.length >= temp.prefixTwoLength?
            item.psnTypeCode.substring(0,temp.prefixTwoLength) : pad(item.psnTypeCode,temp.prefixTwoLength)
        }
      })
      str = str + psnTypeCode
    }
    if (temp.prefixTwo=='88'){
      //日期(年月)
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
      str = str + yy + mm
    }
    if (temp.prefixTwo=='99'){
      //手动录入
      str = str + pad(temp.prefixTwoCustomize,temp.prefixTwoLength)
    }
    //分隔符
    if (temp.delimiter=='2'){
      str = str + '.'
    } else if (temp.delimiter=='3'){
      str = str + '-'
    }
  }
  if(temp.prefixThreeIs=='true'){
    // console.log(temp.prefixThree)
    if (temp.prefixThree=='1-0'){
      //人员类别
      let psnTypeCode = ''
      psnTypeList.value.forEach(item=>{
        if (item.uniqueCode==formItems.value.uniquePsnType){
          psnTypeCode = item.psnTypeCode.length >= temp.prefixThreeLength?
            item.psnTypeCode.substring(0,temp.prefixThreeLength) : pad(item.psnTypeCode,temp.prefixThreeLength)
        }
      })
      str = str + psnTypeCode
    }
    if (temp.prefixThree=='88'){
      //日期(年月)
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth()+ 1) : (new Date().getMonth()+ 1)
      str = str + yy + mm
    }
    if (temp.prefixThree=='99'){
      //手动录入
      str = str + pad(temp.prefixThreeCustomize,temp.prefixThreeLength)
    }
    //分隔符
    if (temp.delimiter=='2'){
      str = str + '.'
    } else if (temp.delimiter=='3'){
      str = str + '-'
    }
  }
  // console.log(temp.autoNum)
  if(temp.autoNum=='false') {
    const psn = await useRouteApi(findBukongPsnCode,{schemaName: dynamicTenantId})({num:temp.serialNumLength,sum:add(str.length,temp.serialNumLength),qzNum:str.length,qianzhui:str})
    if (psn.psnCode != null && psn.psnCode != '') {
      str = str + pad(psn.psnCode, temp.serialNumLength)
    } else {
      str = str + pad(temp.serialNumStr, temp.serialNumLength)
    }
  } else {
    const psn = await useRouteApi(findMaxPsnCode,{schemaName: dynamicTenantId})({num:temp.serialNumLength,sum:add(str.length,temp.serialNumLength),qzNum:str.length,qianzhui:str})
    if (psn.psnCode != null && psn.psnCode != '') {
      str = str + pad(add(psn.psnCode,1), temp.serialNumLength)
    } else {
      str = str + pad(temp.serialNumStr, temp.serialNumLength)
    }
  }
  formItems.value.psnCode = str
}

/**
 * 字符串前补0
 * @param num
 * @param n
 */
function pad(num, n) {
  let len = num.toString().length;
  while(len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}

/**
 * 加法
 * @param a
 * @param b
 */
function add(a, b) {
  let c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

let isChanged: boolean = false

async function handleOk() {
  saveClick.value=true
  if (formItems.value.uniqueCodeDept==''||formItems.value.uniqueCodeDept==null){
    formItems.value.uniqueCodeDept = '9999'
  }
  if (formItems.value.uniquePsnType==''||formItems.value.uniquePsnType==null){
    formItems.value.uniquePsnType = '9999'
  }
  const psnList = await useRouteApi(getPsnList,{schemaName: dynamicTenantId})({})
  if (formItems.value.psnCode==null || formItems.value.psnCode==''){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '人员编码不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.psnName == null || formItems.value.psnName == '') {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '人员姓名不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.psnCode != changeBeforeModel.psnCode && formItems.value.psnCode != '' && formItems.value.psnCode != null) {
    for (let i = 0; i < psnList.length; i++) {
      const psn = psnList[i];
      if (psn.psnCode == formItems.value.psnCode) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '人员编码重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  if (formItems.value.cellPhoneNum != changeBeforeModel.cellPhoneNum && formItems.value.cellPhoneNum != '' && formItems.value.cellPhoneNum != null) {
    for (let i = 0; i < psnList.length; i++) {
      const psn = psnList[i];
      if (psn.cellPhoneNum == formItems.value.cellPhoneNum) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '手机号重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  if (formItems.value.psnWechat != changeBeforeModel.psnWechat && formItems.value.psnWechat != '' && formItems.value.psnWechat != null) {
    for (let i = 0; i < psnList.length; i++) {
      const psn = psnList[i];
      if (psn.psnWechat == formItems.value.psnWechat) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '微信重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  if (formItems.value.psnQq != changeBeforeModel.psnQq && formItems.value.psnQq != '' && formItems.value.psnQq != null) {
    for (let i = 0; i < psnList.length; i++) {
      const psn = psnList[i];
      if (psn.psnQq == formItems.value.psnQq) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '钉钉重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  if (formItems.value.documentCode != changeBeforeModel.documentCode && formItems.value.documentCode != '' && formItems.value.documentCode != null) {
    for (let i = 0; i < psnList.length; i++) {
      const psn = psnList[i];
      if (psn.documentCode == formItems.value.documentCode) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '身份证号重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  // formItems.value.province = cityValye.value.join(',')
  isChanged = !(formItems.value.id == changeBeforeModel.id
    && formItems.value.uniqueCode == changeBeforeModel.uniqueCode
    && formItems.value.psnCode == changeBeforeModel.psnCode
    && formItems.value.jobNum == changeBeforeModel.jobNum
    && formItems.value.psnName == changeBeforeModel.psnName
    && formItems.value.psnSex == changeBeforeModel.psnSex
    && formItems.value.uniqueCodeDept == changeBeforeModel.uniqueCodeDept
    && formItems.value.uniquePsnType == changeBeforeModel.uniquePsnType
    && formItems.value.psnType == changeBeforeModel.psnType
    && formItems.value.psnPost == changeBeforeModel.psnPost
    && formItems.value.documentType == changeBeforeModel.documentType
    && formItems.value.idNum == changeBeforeModel.idNum
    && formItems.value.psnStation == changeBeforeModel.psnStation
    && formItems.value.cellPhoneNum == changeBeforeModel.cellPhoneNum
    && formItems.value.psnEmail == changeBeforeModel.psnEmail
    && formItems.value.psnWechat == changeBeforeModel.psnWechat
    && formItems.value.psnQq == changeBeforeModel.psnQq
    && formItems.value.psnAddress == changeBeforeModel.psnAddress
    && formItems.value.psnBank == changeBeforeModel.psnBank
    && formItems.value.bankArea == changeBeforeModel.bankArea
    && formItems.value.bankAccount == changeBeforeModel.bankAccount
    && formItems.value.EntryDate == changeBeforeModel.EntryDate
    && formItems.value.createDate == changeBeforeModel.createDate
    && formItems.value.flag == changeBeforeModel.flag
    && formItems.value.countryId == changeBeforeModel.countryId
    && formItems.value.uniqueCodeZone == changeBeforeModel.uniqueCodeZone
    && formItems.value.bankNum == changeBeforeModel.bankNum
    && formItems.value.province == changeBeforeModel.province
    && formItems.value.city == changeBeforeModel.city)
  if (isChanged) {
    emit('save', unref(formItems))
    closeModal()
    saveClick.value=false
    return true
  }
  closeModal()
  saveClick.value=false
  // alert("没有改变过")
  return false
}

async function handleOkAdd() {
  saveClick.value=true
  if (formItems.value.uniqueCodeDept==''||formItems.value.uniqueCodeDept==null){
    formItems.value.uniqueCodeDept = '9999'
  }
  if (formItems.value.uniquePsnType==''||formItems.value.uniquePsnType==null){
    formItems.value.uniquePsnType = '9999'
  }
  const psnList = await useRouteApi(getPsnList,{schemaName: dynamicTenantId})({})
  if (formItems.value.psnCode==null || formItems.value.psnCode==''){
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '人员编码不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.psnName == null || formItems.value.psnName == '') {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '人员姓名不能为空！'
    })
    saveClick.value=false
    return false
  }
  if (formItems.value.psnCode != changeBeforeModel.psnCode && formItems.value.psnCode != '' && formItems.value.psnCode != null) {
    for (let i = 0; i < psnList.length; i++) {
      const psn = psnList[i];
      if (psn.psnCode == formItems.value.psnCode) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '人员编码重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  if (formItems.value.cellPhoneNum != changeBeforeModel.cellPhoneNum && formItems.value.cellPhoneNum != '' && formItems.value.cellPhoneNum != null) {
    for (let i = 0; i < psnList.length; i++) {
      const psn = psnList[i];
      if (psn.cellPhoneNum == formItems.value.cellPhoneNum) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '手机号重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  if (formItems.value.psnWechat != changeBeforeModel.psnWechat && formItems.value.psnWechat != '' && formItems.value.psnWechat != null) {
    for (let i = 0; i < psnList.length; i++) {
      const psn = psnList[i];
      if (psn.psnWechat == formItems.value.psnWechat) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '微信重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  if (formItems.value.psnQq != changeBeforeModel.psnQq && formItems.value.psnQq != '' && formItems.value.psnQq != null) {
    for (let i = 0; i < psnList.length; i++) {
      const psn = psnList[i];
      if (psn.psnQq == formItems.value.psnQq) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '钉钉重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  if (formItems.value.documentCode != changeBeforeModel.documentCode && formItems.value.documentCode != '' && formItems.value.documentCode != null) {
    for (let i = 0; i < psnList.length; i++) {
      const psn = psnList[i];
      if (psn.documentCode == formItems.value.documentCode) {
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '身份证号重复不允许添加！'
        })
        saveClick.value=false
        return false
      }
    }
  }
  // formItems.value.province = cityValye.value.join(',')
  isChanged = !(formItems.value.id == changeBeforeModel.id
    && formItems.value.uniqueCode == changeBeforeModel.uniqueCode
    && formItems.value.psnCode == changeBeforeModel.psnCode
    && formItems.value.jobNum == changeBeforeModel.jobNum
    && formItems.value.psnName == changeBeforeModel.psnName
    && formItems.value.psnSex == changeBeforeModel.psnSex
    && formItems.value.uniqueCodeDept == changeBeforeModel.uniqueCodeDept
    && formItems.value.uniquePsnType == changeBeforeModel.uniquePsnType
    && formItems.value.psnType == changeBeforeModel.psnType
    && formItems.value.psnPost == changeBeforeModel.psnPost
    && formItems.value.documentType == changeBeforeModel.documentType
    && formItems.value.idNum == changeBeforeModel.idNum
    && formItems.value.psnStation == changeBeforeModel.psnStation
    && formItems.value.cellPhoneNum == changeBeforeModel.cellPhoneNum
    && formItems.value.psnEmail == changeBeforeModel.psnEmail
    && formItems.value.psnWechat == changeBeforeModel.psnWechat
    && formItems.value.psnQq == changeBeforeModel.psnQq
    && formItems.value.psnAddress == changeBeforeModel.psnAddress
    && formItems.value.psnBank == changeBeforeModel.psnBank
    && formItems.value.bankArea == changeBeforeModel.bankArea
    && formItems.value.bankAccount == changeBeforeModel.bankAccount
    && formItems.value.EntryDate == changeBeforeModel.EntryDate
    && formItems.value.createDate == changeBeforeModel.createDate
    && formItems.value.flag == changeBeforeModel.flag
    && formItems.value.countryId == changeBeforeModel.countryId
    && formItems.value.uniqueCodeZone == changeBeforeModel.uniqueCodeZone
    && formItems.value.bankNum == changeBeforeModel.bankNum
    && formItems.value.province == changeBeforeModel.province
    && formItems.value.city == changeBeforeModel.city)
  if (isChanged) {
    // emit('save', unref(formItems))
    // closeModal()
    await useRouteApi(savePsn, {schemaName: dynamicTenantId})(formItems.value)
    message.success('保存成功！')
    formItems.value = {}
    changeBeforeModel = JSON.parse(JSON.stringify(formItems.value))
    saveClick.value=false
    return true
  }
  // closeModal()
  saveClick.value=false
  // alert("没有改变过")
  return false
}

const activeKey = ref('1')

/* 部分隐藏处理
** str 需要处理的字符串
** frontLen  保留的前几位
** endLen  保留的后几位
** cha  替换的字符串
*/
function plusXing(str, frontLen, endLen,cha) {
  let len = str.length - frontLen - endLen;
  let xing = '';
  for (let i = 0; i < len; i++) {
    xing += cha;
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
}
function plusStr(str, frontLen, endLen,cha) {
  return str.substring(0, frontLen) + cha + str.substring(str.length - endLen);
}

import AuthPassword from './auth-password.vue'
import {load} from "/@/api/record/encoding_rules/FileEncodingRules";
import {mul} from "/@/views/boozsoft/gdzc/gu-ding-zi-chan-add/calculation";
const [registerAuthPasswordPage, { openModal: openAuthPasswordPage }] = useModal()
const openAuthPassword = () => {
  openAuthPasswordPage(true, {
    dynamicTenantId: dynamicTenantId.value
  })
}
async function saveAuthPassword(data){
  isLock.value = true
}

</script>
<style>
.vben-basic-title {
  color: #0096c7 !important;
  border:none !important;
}

.ant-modal-body {
  padding: 0px;
  border-bottom: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
  border-top: none !important;
}
.ant-modal-header{
  border: none !important;
}
</style>
<style lang="less" scoped>
:deep(.ant-calendar-picker-input.ant-input), :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input) {
  border: none !important;
  //border-bottom: solid 1px rgb(191, 191, 191) !important;
  width: 100%;
  font-weight: bold;
}

:deep(.ant-picker){
  border: none !important;
  border-bottom: solid 1px rgb(191, 191, 191) !important;
  input {
    font-size: 14px;
    font-weight: bold;
    border: none !important;
  }
}

:deep(.ant-select-single:not(.ant-select-customize-input)
.ant-select-selector
.ant-select-selection-search-input) {
  border: none !important;
}

.vben-basic-title {
  color: #0096c7 !important;
  border: none !important;
}

.ant-modal-body {
  padding: 0px;
  border-bottom: 1px solid rgb(1, 129, 226);
  border-left: none;
  border-right: none;
}

.red_span {
  color: red;
  font-weight: bold;
  display: inline-block;
  width: 20px;
  text-align: right;
}

.nc-open-content {

  input {
    width: 30%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  .abc{
    border-bottom: 2px solid #666666 !important;
    font-size: 19px;
  }

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  label {
    text-align: left;
    width: 120px;
    display: inline-block;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 2em;
    color: #535353;
    font-size: 13px;
    margin-left: 2em;
    font-weight: bold;
  }

  .open-content-down {
    margin-top: 5%;

    .ant-tabs-tab-active::before {
      position: absolute;
      top: 0px;
      left: 0;
      width: 100%;
      border-top: 2px solid transparent;
      border-radius: 2px 2px 0 0;
      transition: all 0.3s;
      content: '';
      pointer-events: none;
      background-color: rgb(1, 143, 251);
    }
  }
}

.nc-open-show-content {

  input {
    width: 30%;
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  .abc{
    border-bottom: 2px solid #666666 !important;
    font-size: 19px;
  }

  pointer-events: none;
  cursor: default;

  .ant-input:focus {
    box-shadow: none;
  }

  :deep(.ant-select-selector) {
    border: none !important;
    border-bottom: 1px solid #bdb9b9 !important;
    font-weight: bold;
    font-size: 14px;
  }

  label {
    text-align: left;
    width: 120px;
    display: inline-block;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 2em;
    color: #535353;
    font-size: 13px;
    margin-left: 2em;
    font-weight: bold;
  }

  :deep(a) {
    pointer-events: auto;
  }

  .open-content-down {
    margin-top: 5%;

    :deep(.ant-tabs-tab) {
      pointer-events: auto;
    }

    :deep(a) {
      pointer-events: auto;
    }

    .ant-tabs-tab-active::before {
      position: absolute;
      top: 0px;
      left: 0;
      width: 100%;
      border-top: 2px solid transparent;
      border-radius: 2px 2px 0 0;
      transition: all 0.3s;
      content: '';
      background-color: rgb(1, 143, 251);
    }
  }
}

/*:deep(.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab) {
  height: 40px;
  margin: 0;
  margin-right: 2px;
  padding: 0 16px;
  line-height: 38px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 2px 2px 0 0;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  font-weight: bold;
  font-size: 13px;
}*/

:deep(.ant-tabs-card).ant-tabs-top > .ant-tabs-nav  {
  height: 40px;
  font-weight: bold;
  font-size: 13px;
  .ant-tabs-tab-active,.ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab-active {
    border-top: 2px solid rgb(1, 143, 251) !important;
  }
}

</style>
