<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    title="部门导入"
    @ok="handleOk()"
    @register="register"
    okText="开始导入"
    :canFullscreen="false"
  >
    <template #title>
      <div style="display: flex;" class="vben-basic-title">
        <span style="line-height:40px;font-size: 28px;">
          <CloudUploadOutlined style="font-size: 34px;font-weight: bold"/>&nbsp;&nbsp;数据导入
        </span>
      </div>
    </template>
    <div class="import-centent-div" >
      <div class="import-info-div">
        <div class="import-div-top">
          <div>
          </div>
          <div>
            <span style="font-size: 16px;">导入内容：</span><span style="font-weight: bold;font-size: 16px;">应收款期初余额</span><br/><br/>
            <span style="font-size: 16px;">应收类型：</span>
            <span style="font-weight: bold;font-size: 16px;">
              <Select v-model:value="busStyle" style="width: 50%;font-weight: bold;">
                <SelectOption value="YSD">应收单</SelectOption>
                <SelectOption value="SKD">收款单</SelectOption>
              </Select>
            </span>
<!--            <ul style="list-style-type: disc;color:#0096c7;margin-left: 20px;font-size: 24px;">
              <li><span style="font-size: 16px;color: #000000;">应收类型：</span></li>
            </ul>-->
          </div>
          <div>
            <Tooltip placement="top" >
              <Button size="small" style="color: #3eadbe">查看帮助</Button>
              <EllipsisOutlined style="cursor: pointer;margin-left: 10%;color: #3eadbe"/>
            </Tooltip>
            <br>
            <br>
            <Tooltip placement="top" >
              <DownloadOutlined style="font-size: 30px;"/>
              <a @click="exportExcel()">&emsp;模板下载</a>
            </Tooltip>
          </div>
        </div>
      </div>
      <div class="import-div-bottom">
        <Tabs v-model:activeKey="excelValue">
          <TabPane key="1" tab="全新添加导入">
          </TabPane>
          <TabPane key="2" :disabled="true" tab="字段覆盖导入">
          </TabPane>
        </Tabs>
        <br/>
        <ImpExcel v-if="isActiveImpExcel" @success="loadDataSuccess">
          <a-button class="m-3"> 导入Excel </a-button>
        </ImpExcel>
      </div>
    </div>

    <template #footer>
      <div>
        <Button @click="closeModal()">放弃</Button>
        <Button @click="handleOk()" :disabled="saveClick" type="primary">开始导入</Button>
      </div>
    </template>

  </BasicModal>
</template>

<script setup="props, {content}" lang="ts">
import {nextTick, ref, unref} from 'vue'
import { BasicModal, useModalInner } from '/@/components/Modal'
import { ImpExcel } from '/@/components/Excel'
import {
  Upload as AUpload,
  Spin as ASpin,
  Select,
  Input as AInput,
  Modal as AModal, Badge, Button, Tabs, Radio,Checkbox,Tooltip
} from 'ant-design-vue';
import { DownloadOutlined,CloudUploadOutlined,CaretDownOutlined,EllipsisOutlined } from '@ant-design/icons-vue';
const AInputSearch=AInput.Search
const SelectOption=Select.Option
const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane
import {useMessage} from "/@/hooks/web/useMessage";
// import {aoaToSheetXlsx} from "/@/views/boozsoft/xian_jin_liu_liang/yin_hang_dui_zhang/yin_hang_dui_zhang_dan/excel/components/importexcel";
import {aoaToSheetXlsx} from '/@/components/Excel';
const {
  createErrorModal
} = useMessage()

const saveClick:any = ref(false)

const excelValue:any = ref(1)

const busStyle:any = ref('YSD')

const emit=defineEmits(['register','save'])
const isActiveImpExcel=ref(false)
const list:any = ref([])
function loadDataSuccess(excelDataList) {
  // console.log(excelDataList);
  // console.log(excelDataList[0].results);
  list.value = []
  const items = excelDataList[0].results
  if (items.length>0) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const item1: any = {}
      //'应收类型','单据编码','客户名称','结算客户名称','业务部门','业务员','币种','单据日期','收款金额','应收金额','期初余额','摘要'
      item1.busStyle = busStyle.value
      item1.arStyle = item['单据类型']
      item1.ccode = item['单据编号']
      item1.cvencodeXs = item['客户名称']
      item1.cvencodeJs = item['结算客户名称']
      item1.cdepcode = item['业务部门名称']
      item1.cpersoncode = item['业务员编码']
      item1.currency = item['币种']
      item1.ddate = item['单据日期']
      item1.money = item['金额']
      item1.cmemo = item['摘要']
      item1.bcheck = '0'
      item1.billStyle = 'ar'
      item1.iyear = year.value
      //XSFP销售发票、YSD应收单、XHD销货单、PTSK普通收款、YSK预收款
      //YSD应收单、SKD收款单
      if (busStyle.value=='YSD') {
        if (item['单据类型'] == '应收单') {
          item1.arStyle = 'YSD'
        } else if (item['单据类型'] == '销售发票') {
          item1.arStyle = 'XSFP'
        } else if (item['单据类型'] == '销货单') {
          item1.arStyle = 'XHD'
        } else {
          item1.arStyle = 'YSD'
        }
        item1.arIsumBenbi = item1.money
        item1.isumBenbi = item1.arIsumBenbi
      } else {
        if (item['单据类型'] == '普通收款') {
          item1.arStyle = 'PTSK'
        } else if (item['单据类型'] == '预收款') {
          item1.arStyle = 'YSK'
        } else {
          item1.arStyle = 'PTSK'
        }
        item1.ysIsumBenbi = item1.money
        item1.isumBenbi = -item1.ysIsumBenbi
      }
      deptList.value.forEach(dept => {
        if (dept.deptName == item1.cdepcode) {
          item1.cdepcode = dept.id
        }
      })
      psnList.value.forEach(psn => {
        if (psn.psnCode == item1.cpersoncode) {
          item1.cpersoncode = psn.id
        }
      })
      customerList.value.forEach(cust => {
        if (cust.cvencodeXs == item1.custName) {
          item1.cvencodeXs = cust.id
          if (cust.uniqueCodeCcus!=null && cust.uniqueCodeCcus=='') {
            const res = customerList.value.filter(aa=>aa.uniqueCodeCcus==aa.uniqueCode)
            if (res.length!=0) {
              item1.cvencodeJs = res[0].id
            } else {
              item1.cvencodeJs = cust.id
            }
          }
        }
        if (cust.cvencodeJs == item1.custName) {
          item1.cvencodeJs = cust.id
        }
      })
      list.value.push(item1)
    }
    for (let i=0; i<list.value.length; i++){
      const item1 = list.value[i];
      //判断导入编码是否为空
      const arStyle = item1.arStyle
      if (arStyle==null || arStyle==''){
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '第'+(i+2)+'行应收类型为空,不能进行期初数据导入'
        })
        list.value = []
        return false
      }
      const cvencodeJs = item1.cvencodeJs
      if (cvencodeJs==null || cvencodeJs==''){
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '第'+(i+2)+'行结算客户名称为空,不能进行期初数据导入'
        })
        list.value = []
        return false
      }
      const cpersoncode = item1.cpersoncode
      if (cpersoncode==null || cpersoncode==''){
        createErrorModal({
          iconType: 'warning',
          title: '提示',
          content: '第'+(i+2)+'行业务员编码为空,不能进行期初数据导入'
        })
        list.value = []
        return false
      }
    }
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '提示',
      content: '未发现导入数据，请检查数据是否在sheet1页签中'
    })
  }
}
//导入时判断
let msg=''
function checkExcel(){
  msg=''
  if (list.value.length>0) {
    for (let i = 0; i < list.value.length; i++) {
      const item = list.value[i];
    }
    return true
  } else {
    msg = '请选择您需要导入的文件!'
    return false
  }
}

const psnList:any = ref([])
const deptList:any = ref([])
const customerList:any = ref([])
const year:any = ref('')
const dynamicTenantId = ref()
const [register, { closeModal }] = useModalInner((data) => {
  saveClick.value=false
  dynamicTenantId.value = data.dynamicTenantId
  psnList.value = data.psnList
  deptList.value = data.deptList
  customerList.value = data.customerList
  year.value = data.year

  isActiveImpExcel.value=false
  nextTick(()=>{
    isActiveImpExcel.value=true
  })
})
async function handleOk() {
  saveClick.value=true
  // formItems.value.excelValue = excelValue.value
  // formItems.value.object = list.value
  // formItems.value.cateCode = cateCode.value
  checkExcel()
  console.log(msg)
  if (msg=='') {
    emit('save', unref(list))
    closeModal()
    saveClick.value=false
    return true
  } else {
    createErrorModal({
      iconType: 'warning',
      title: '导入失败',
      content: msg
    })
    saveClick.value=false
    return false
  }
}

//下载导入模板
function exportExcel() {
  //单据类型：应收单、销货单、普通收款、预收款
  let arrHeader:any = ['应收类型','单据编码','客户名称','结算客户名称','业务部门','业务员','币种','单据日期','金额','摘要'];
  if (busStyle.arStyle=='YSD'){
    arrHeader = ['单据类型','单据编号','客户名称','业务部门名称','业务员编码','业务员名称','币种','单据日期','金额','摘要']
  } else {
    arrHeader = ['单据类型','单据编号','结算客户名称','业务部门名称','业务员编码','业务员名称','币种','单据日期','金额','摘要']
  }
  console.log(arrHeader)
  // 保证data顺序与header一致
  aoaToSheetXlsx({
    data: [],
    header: arrHeader,
    filename: '应收款期初余额模板.xlsx',
  });
}

</script>
<style lang="less" scoped>
.import-centent-div{
  .import-info-div {
    width: 90%;
    margin-left: 2%;
    height: 180px;
    border-radius: 4px;

    .import-div-top {
      width: 100%;
      height: 70%;
      display: inline-flex;
      justify-content: space-between;

      > div:nth-of-type(1) {
        width: 25%;
        height: auto;
        background-image: url(/nc/download2.png);
        background-size: 80% 80%;
        background-repeat: no-repeat;
        background-position: 12px;
      }

      > div:nth-of-type(2) {
        width: 55%;
        height: auto;
        padding: 18px 2%;

        > span {
          color: black;
          font-size: 20px;
        }

        > span:nth-of-type(1) {
          font-size: 20px;
        }
      }

      > div:nth-of-type(3) {
        width: 20%;
        height: auto;
        padding: 3.5% 0;
      }

    }
  }
  .import-div-bottom {
    margin-left: 2%;
    width: 96%;
    height: 30%;
  }
  .import-download-div{
    width: 100%;height: 60px;display: inline-flex; justify-content: center; line-height: 50px;
    .download-div {
      width: 50px;
      height: 50px;
      display: block;
      background-color: #6a6a6a;
      border-radius: 50%;
      padding: 2px 10px;
      font-size: 30px;
      color: white;
      cursor: pointer;
    }

    .download-div:hover {
      color: #0096c7;
      background-color: #b4b4b4;
    }
  }
}
:deep(.ant-select-selector) {
  border: none !important;
  border-bottom: 1px solid #bdb9b9 !important;
}
</style>
